import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  signal,
  DestroyRef,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { trigger, transition, style, animate } from '@angular/animations';

import { PokemonService, FavoritesService } from '../../../../core/services';
import { PokemonDetail, LoadingState } from '../../../../core/models';
import { ChipComponent } from '../../../../shared/components/chip/chip.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { PokeballLoaderComponent } from '../../../../shared/components/pokeball-loader/pokeball-loader.component';
import { StarIconComponent } from '../../../../shared/components/icons/star-icon.component';

@Component({
  selector: 'app-pokemon-detail-modal',
  imports: [
    CommonModule,
    ChipComponent,
    ErrorMessageComponent,
    PokeballLoaderComponent,
    StarIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))]),
    ]),
    trigger('contentAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
    ]),
  ],
  template: `
    <div
      class="modal-backdrop"
      @modalAnimation
      (click)="onBackdropClick()"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="'Detalles de ' + (pokemon()?.displayName || 'Pokémon')"
    >
      <div
        class="modal-content"
        @contentAnimation
        (click)="$event.stopPropagation()"
      >
        <!-- Close Button -->
        <button
          class="close-btn"
          (click)="closeModal()"
          aria-label="Cerrar modal"
          type="button"
        >
          ✕
        </button>

        <!-- Loading State -->
        <app-pokeball-loader
          *ngIf="loadingState().isLoading"
          [message]="'Cargando detalles del Pokémon...'"
        />

        <!-- Error State -->
        <app-error-message
          *ngIf="loadingState().error"
          [title]="'Error'"
          [message]="loadingState().error!"
          [showRetry]="false"
        />

        <!-- Pokemon Details -->
        <div
          *ngIf="pokemon() && !loadingState().isLoading"
          class="detail-container"
        >
          <!-- Main Content -->
          <div class="detail-body">
            <!-- Image -->
            <div class="image-section">
              <img
                [src]="
                  pokemon()!.sprites.other['official-artwork'].front_default
                "
                [alt]="pokemon()!.displayName"
                class="pokemon-image"
              />
              <p class="pokemon-category" *ngIf="pokemon()!.category">
                {{ pokemon()!.category }}
              </p>
            </div>

            <!-- Info -->
            <div class="info-section">
              <!-- Types -->
              <div class="info-block">
                <h3 class="info-title">Tipos</h3>
                <div class="chips-container">
                  <app-chip
                    *ngFor="let type of pokemon()!.types"
                    [label]="pokemonService.normalizeString(type.type.name)"
                    [type]="'type-' + type.type.name"
                    size="lg"
                  />
                </div>
              </div>

              <!-- Physical Info -->
              <div class="info-block">
                <h3 class="info-title">Información Física</h3>
                <div class="physical-info">
                  <div class="stat-item">
                    <span class="stat-label">Altura:</span>
                    <span class="stat-value"
                      >{{ (pokemon()!.height / 10).toFixed(1) }} m</span
                    >
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Peso:</span>
                    <span class="stat-value"
                      >{{ (pokemon()!.weight / 10).toFixed(1) }} kg</span
                    >
                  </div>
                </div>
              </div>

              <!-- Abilities -->
              <div class="info-block">
                <h3 class="info-title">Habilidades</h3>
                <div class="chips-container">
                  <app-chip
                    *ngFor="let ability of pokemon()!.abilities"
                    [label]="
                      pokemonService.normalizeString(ability.ability.name)
                    "
                    type="ability"
                    size="md"
                  />
                </div>
              </div>

              <!-- Stats -->
              <div class="info-block">
                <h3 class="info-title">Estadísticas Base</h3>
                <div class="stats-container">
                  <div *ngFor="let stat of pokemon()!.stats" class="stat-bar">
                    <div class="stat-info">
                      <span class="stat-name">{{
                        pokemonService.normalizeString(stat.stat.name)
                      }}</span>
                      <span class="stat-number">{{ stat.base_stat }}</span>
                    </div>
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        [style.width.%]="(stat.base_stat / 255) * 100"
                        [style.background-color]="getStatColor(stat.base_stat)"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="info-block" *ngIf="pokemon()!.description">
                <h3 class="info-title">Descripción</h3>
                <p class="description-text">{{ pokemon()!.description }}</p>
              </div>

              <!-- AI Description -->
              <div
                class="info-block ai-description"
                *ngIf="pokemon()!.aiDescription"
              >
                <h3 class="info-title">Análisis Generado</h3>
                <p class="description-text">{{ pokemon()!.aiDescription }}</p>
              </div>

              <!-- Evolutions -->
              <div
                class="info-block"
                *ngIf="
                  pokemon()!.evolutionChain &&
                  pokemon()!.evolutionChain!.length > 1
                "
              >
                <h3 class="info-title">Cadena Evolutiva</h3>
                <div class="evolution-chain">
                  <span
                    *ngFor="
                      let evo of pokemon()!.evolutionChain;
                      let last = last
                    "
                    class="evolution-item"
                  >
                    {{ evo }}
                    <span *ngIf="!last" class="evolution-arrow">→</span>
                  </span>
                </div>
              </div>

              <!-- Moves (first 8) -->
              <div class="info-block">
                <h3 class="info-title">Movimientos Destacados</h3>
                <div class="chips-container">
                  <app-chip
                    *ngFor="let move of pokemon()!.moves.slice(0, 8)"
                    [label]="pokemonService.normalizeString(move.move.name)"
                    type="default"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Header -->
          <div class="detail-header">
            <div class="header-info">
              <h2 class="pokemon-name">{{ pokemon()!.displayName }}</h2>
              <span class="pokemon-id"
                >#{{ pokemon()!.id.toString().padStart(3, '0') }}</span
              >
            </div>
            <button
              class="favorite-btn-large"
              (click)="toggleFavorite()"
              [attr.aria-label]="
                isFavorite() ? 'Quitar de favoritos' : 'Agregar a favoritos'
              "
              type="button"
            >
              <app-star-icon
                [width]="32"
                [height]="32"
                [color]="isFavorite() ? '#FFD700' : '#D3D3D3'"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './pokemon-detail-modal.component.scss',
})
export class PokemonDetailModalComponent implements OnInit {
  @Input() pokemonId!: number;
  @Output() close = new EventEmitter<void>();

  private destroyRef = inject(DestroyRef);
  pokemonService = inject(PokemonService);
  private favoritesService = inject(FavoritesService);

  pokemon = signal<PokemonDetail | null>(null);
  loadingState = signal<LoadingState>({ isLoading: true, error: null });
  isFavorite = signal(false);

  ngOnInit(): void {
    this.loadPokemonDetail();
    this.checkFavoriteStatus();
    this.setupKeyboardListener();
  }

  private loadPokemonDetail(): void {
    this.loadingState.set({ isLoading: true, error: null });

    this.pokemonService
      .getPokemonDetail(this.pokemonId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail) => {
          this.pokemon.set(detail);
          this.loadingState.set({ isLoading: false, error: null });
        },
        error: (error) => {
          this.loadingState.set({
            isLoading: false,
            error: error.message || 'Error al cargar los detalles',
          });
        },
      });
  }

  private checkFavoriteStatus(): void {
    this.isFavorite.set(this.favoritesService.isFavorite(this.pokemonId));

    this.favoritesService.favorites$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isFavorite.set(this.favoritesService.isFavorite(this.pokemonId));
      });
  }

  private setupKeyboardListener(): void {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);

    this.destroyRef.onDestroy(() => {
      document.removeEventListener('keydown', handleEscape);
    });
  }

  toggleFavorite(): void {
    const pokemon = this.pokemon();
    if (pokemon) {
      this.favoritesService.toggleFavorite(pokemon);
    }
  }

  getStatColor(value: number): string {
    if (value >= 150) return '#4caf50';
    if (value >= 100) return '#8bc34a';
    if (value >= 75) return '#ffc107';
    if (value >= 50) return '#ff9800';
    return '#f44336';
  }

  closeModal(): void {
    this.close.emit();
  }

  onBackdropClick(): void {
    this.closeModal();
  }
}
