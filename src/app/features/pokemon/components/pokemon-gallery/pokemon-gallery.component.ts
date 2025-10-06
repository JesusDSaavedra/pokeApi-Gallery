import {
  Component,
  OnInit,
  signal,
  computed,
  DestroyRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { PokemonService, RandomService, FavoritesService, ThemeService } from '../../../../core/services';
import { PokemonCard, LoadingState, FavoritePokemon } from '../../../../core/models';
import { PokemonCardComponent } from '../../../../shared/components/pokemon-card/pokemon-card.component';
import { PokeballLoaderComponent } from '../../../../shared/components/pokeball-loader/pokeball-loader.component';
import { PokeballIconComponent } from '../../../../shared/components/icons/pokeball-icon/pokeball-icon.component';
import { SunIconComponent } from '../../../../shared/components/icons/sun-icon.component';
import { MoonIconComponent } from '../../../../shared/components/icons/moon-icon.component';
import { ReloadIconComponent } from '../../../../shared/components/icons/reload-icon.component';
import { StarIconComponent } from '../../../../shared/components/icons/star-icon.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { PokemonDetailModalComponent } from '../pokemon-detail-modal/pokemon-detail-modal.component';
import {
  fadeInAnimation,
  staggerAnimation,
} from '../../../../shared/animations/animations';

@Component({
  selector: 'app-pokemon-gallery',
  animations: [fadeInAnimation, staggerAnimation],
  imports: [
    CommonModule,
    FormsModule,
    PokemonCardComponent,
    PokeballLoaderComponent,
    PokeballIconComponent,
    SunIconComponent,
    MoonIconComponent,
    ReloadIconComponent,
    StarIconComponent,
    ErrorMessageComponent,
    PokemonDetailModalComponent,
  ],
  template: `
    <div class="gallery-container">
      <!-- Header -->
      <header class="gallery-header">
        <div class="container">
          <div class="header-content">
            <h1 class="main-title ">
              <span class="pokeball-icon"
                ><app-pokeball-icon [width]="60" [height]="60"
              /></span>
              Galería Pokémon
            </h1>
            <div class="header-actions">
              <button
                class="btn btn-primary"
                (click)="toggleTheme()"
                [attr.aria-label]="
                  isDarkMode() ? 'Activar modo claro' : 'Activar modo oscuro'
                "
                type="button"
              >
                @if (isDarkMode()) {
                <app-sun-icon [width]="32" [height]="32" />
                } @else {
                <app-moon-icon [width]="32" [height]="32" />
                }
              </button>
              <button
                class="btn btn-primary d-flex align-items-center gap-3"
                (click)="loadRandomPokemon()"
                [disabled]="loadingState().isLoading"
                type="button"
              >
                <app-reload-icon [width]="24" [height]="24" /> Nueva Selección
              </button>
            </div>
          </div>

          <!-- Search and Filters -->
          <div class="filters-section">
            <div class="search-box">
              <input
                type="search"
                class="form-control"
                placeholder="🔍 Buscar Pokémon..."
                [ngModel]="searchTerm()"
                (ngModelChange)="searchTerm.set($event)"
                [attr.aria-label]="'Buscar Pokémon'"
              />
            </div>
            <div class="filter-buttons">
              <button
                class="btn d-flex align-items-center gap-2"
                [class.btn-primary]="filterFavorites()"
                [class.btn-outline-primary]="!filterFavorites()"
                (click)="toggleFavoritesFilter()"
                type="button"
              >
                <app-star-icon
                  [width]="20"
                  [height]="20"
                  [color]="filterFavorites() ? '#FFD700' : 'currentColor'"
                />
                Favoritos ({{ favoritesCount() }})
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="gallery-main container">
        <!-- Loading State -->
        <app-pokeball-loader
          *ngIf="loadingState().isLoading"
          [message]="'Cargando Pokémon...'"
          [fullscreen]="true"
        />

        <!-- Error State -->
        <app-error-message
          *ngIf="loadingState().error"
          [title]="'Error al cargar Pokémon'"
          [message]="loadingState().error!"
          (retry)="loadRandomPokemon()"
        />

        <!-- Empty State -->
        <div
          *ngIf="
            !loadingState().isLoading &&
            !loadingState().error &&
            filteredPokemon().length === 0
          "
          class="empty-state"
        >
          <div class="empty-icon">😢</div>
          <h2>No se encontraron Pokémon</h2>
          <p>
            {{
              searchTerm()
                ? 'Intenta con otros términos de búsqueda'
                : filterFavorites()
                ? 'No tienes Pokémon favoritos aún'
                : 'Recarga la galería para ver más Pokémon'
            }}
          </p>
        </div>

        <!-- Pokemon Grid -->
        <div
          *ngIf="
            !loadingState().isLoading &&
            !loadingState().error &&
            filteredPokemon().length > 0
          "
          class="pokemon-grid"
          [@staggerAnimation]="filteredPokemon().length"
        >
          <app-pokemon-card
            *ngFor="let pokemon of filteredPokemon(); trackBy: trackByPokemonId"
            [pokemon]="pokemon"
            [isFavorite]="isFavorite(pokemon.id)"
            (cardClick)="openPokemonDetail(pokemon.id)"
            (favoriteClick)="toggleFavorite(pokemon)"
            [@fadeInAnimation]
          />
        </div>
      </main>

      <!-- Detail Modal -->
      <app-pokemon-detail-modal
        *ngIf="selectedPokemonId()"
        [pokemonId]="selectedPokemonId()!"
        (close)="closePokemonDetail()"
      />
    </div>
  `,
  styleUrl: './pokemon-gallery.component.scss',
})
export class PokemonGalleryComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private pokemonService = inject(PokemonService);
  private randomService = inject(RandomService);
  private favoritesService = inject(FavoritesService);
  private themeService = inject(ThemeService);

  // State
  pokemonList = signal<PokemonCard[]>([]);
  loadingState = signal<LoadingState>({ isLoading: true, error: null });
  selectedPokemonId = signal<number | null>(null);
  searchTerm = signal('');
  filterFavorites = signal(false);
  favorites = signal<Set<number>>(new Set());
  favoritesList = signal<FavoritePokemon[]>([]);
  isDarkMode = signal(false);

  // Computed
  filteredPokemon = computed(() => {
    // Source list: if filtering favorites, use the full saved favorites list; otherwise use loaded randoms
    let source: PokemonCard[] = this.filterFavorites() ? this.favoritesList() : this.pokemonList();

    // Filter by search term
    const searchValue = this.searchTerm();
    if (searchValue) {
      const term = searchValue.toLowerCase();
      source = source.filter(p =>
        p.displayName.toLowerCase().includes(term) ||
        p.types.some(t => t.toLowerCase().includes(term)) ||
        p.abilities.some(a => a.toLowerCase().includes(term))
      );
    }

    return source;
  });

  favoritesCount = computed(() => this.favoritesList().length);

  ngOnInit(): void {
    this.loadRandomPokemon();
    this.setupRouteListener();
    this.setupFavoritesListener();
    this.setupThemeListener();
  }

  private setupRouteListener(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = params['id'];
        if (id) {
          this.selectedPokemonId.set(+id);
        }
      });
  }

  private setupFavoritesListener(): void {
    this.favoritesService.favorites$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(favorites => {
        this.favorites.set(new Set(favorites.map(f => f.id)));
        this.favoritesList.set(favorites);
      });
  }

  private setupThemeListener(): void {
    this.themeService.darkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isDark) => {
        this.isDarkMode.set(isDark);
      });
  }

  loadRandomPokemon(): void {
    this.loadingState.set({ isLoading: true, error: null });

    this.pokemonService.getPokemonList(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const totalPokemon = response.results.length;
          const randomIds = this.randomService.getRandomNumbers(
            30,
            totalPokemon,
            1
          );

          this.pokemonService
            .getMultiplePokemon(randomIds)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (pokemonData) => {
                const cards = pokemonData.map((p) =>
                  this.pokemonService.toPokemonCard(p)
                );
                this.pokemonList.set(cards);
                this.loadingState.set({ isLoading: false, error: null });
              },
              error: (error) => {
                this.loadingState.set({
                  isLoading: false,
                  error: error.message || 'Error al cargar los Pokémon',
                });
              },
            });
        },
        error: (error) => {
          this.loadingState.set({
            isLoading: false,
            error: error.message || 'Error al cargar la lista de Pokémon',
          });
        },
      });
  }

  openPokemonDetail(id: number): void {
    this.selectedPokemonId.set(id);
    this.router.navigate(['/pokemon', id]);
  }

  closePokemonDetail(): void {
    this.selectedPokemonId.set(null);
    this.router.navigate(['/']);
  }

  toggleFavorite(pokemon: PokemonCard): void {
    this.favoritesService.toggleFavorite(pokemon);
  }

  isFavorite(id: number): boolean {
    return this.favorites().has(id);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleFavoritesFilter(): void {
    this.filterFavorites.set(!this.filterFavorites());
  }

  trackByPokemonId(index: number, pokemon: PokemonCard): number {
    return pokemon.id;
  }
}
