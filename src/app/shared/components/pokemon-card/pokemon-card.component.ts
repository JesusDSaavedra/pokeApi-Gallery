import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonCard } from '../../../core/models';
import { ChipComponent } from '../chip/chip.component';
import { StarIconComponent } from '../icons/star-icon.component';

@Component({
  selector: 'app-pokemon-card',
  imports: [CommonModule, ChipComponent, StarIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="pokemon-card card-hover"
      (click)="onCardClick()"
      (keydown.enter)="onCardClick()"
      (keydown.space)="onCardClick(); $event.preventDefault()"
      tabindex="0"
      role="button"
      [attr.aria-label]="'Ver detalles de ' + pokemon.displayName">

      <div class="card-image-container">
        <img
          [src]="pokemon.image"
          [alt]="pokemon.displayName"
          class="card-image"
          loading="lazy"
          (error)="onImageError($event)">
        <div class="card-id">#{{ pokemon.id.toString().padStart(3, '0') }}</div>
      </div>

      <div class="card-content">
        <h3 class="card-title">{{ pokemon.displayName }}</h3>

        <div class="card-types">
          <app-chip
            *ngFor="let type of pokemon.types"
            [label]="type"
            [type]="'type-' + type"
            size="sm" />
        </div>

        <div class="card-abilities">
          <h4 class="abilities-title">Habilidades</h4>
          <div class="abilities-list">
            <app-chip
              *ngFor="let ability of pokemon.abilities"
              [label]="ability"
              type="ability"
              size="xs" />
          </div>
        </div>
      </div>

      <button
        class="favorite-btn"
        (click)="onFavoriteClick($event)"
        [attr.aria-label]="'Agregar ' + pokemon.displayName + ' a favoritos'"
        type="button">
        <app-star-icon
          [width]="22"
          [height]="22"
          [color]="isFavorite ? '#FFD700' : '#D3D3D3'" />
      </button>
    </div>
  `,
  styles: [`
    .pokemon-card {
      background: var(--bg-secondary);
      border-radius: 16px;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: all var(--transition-normal);
      border: 2px solid transparent;

      &:hover {
        border-color: var(--primary-color);
      }

      &:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
    }

    .card-image-container {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      overflow: hidden;
    }

    body.dark-mode .card-image-container {
      background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform var(--transition-normal);
    }

    .pokemon-card:hover .card-image {
      transform: scale(1.1);
    }

    .card-id {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: rgba(255, 255, 255, 0.9);
      padding: 0.25rem 0.5rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    body.dark-mode .card-id {
      background: rgba(0, 0, 0, 0.6);
      color: var(--dark-text-secondary);
    }

    .card-content {
      flex: 1;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: var(--text-primary);
    }

    .card-types {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }

    .abilities-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    .abilities-list {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .favorite-btn {
      border: solid 1px var(--border-color);
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-fast);
      z-index: 10;

      &:hover {
        transform: scale(1.2);
      }

      &:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
    }

    body.dark-mode .favorite-btn {
      background: rgba(0, 0, 0, 0.6);
    }

    .heart-icon {
      font-size: 1.25rem;
    }

    @media (max-width: 768px) {
      .pokemon-card {
        padding: 1rem;
      }

      .card-title {
        font-size: 1.125rem;
      }
    }
  `]
})
export class PokemonCardComponent {
  @Input() pokemon!: PokemonCard;
  @Input() isFavorite: boolean = false;
  @Output() cardClick = new EventEmitter<PokemonCard>();
  @Output() favoriteClick = new EventEmitter<PokemonCard>();

  onCardClick(): void {
    this.cardClick.emit(this.pokemon);
  }

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    this.favoriteClick.emit(this.pokemon);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
  }
}
