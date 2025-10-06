import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokeballIconComponent } from '../icons/pokeball-icon/pokeball-icon.component';

@Component({
  selector: 'app-pokeball-loader',
  imports: [CommonModule, PokeballIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="loader-container" [class.fullscreen]="fullscreen">
      <div class="pokeball-loader">
        <app-pokeball-icon [width]="106" [height]="106" />
      </div>
      <p *ngIf="message" class="loader-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loader-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      padding: 2rem;

      &.fullscreen {
        min-height: 60vh;
      }
    }

    .pokeball-loader {
      animation: bounce 0.8s ease-in-out infinite;

      svg {
        animation: spin 1.5s linear infinite;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
      }
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    .loader-message {
      font-size: 1.125rem;
      font-weight: 500;
      color: var(--text-primary);
      margin: 0;
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.6;
      }
    }

    @media (max-width: 768px) {
      .pokeball-loader svg {
        width: 80px;
        height: 80px;
      }

      .loader-message {
        font-size: 1rem;
      }
    }
  `]
})
export class PokeballLoaderComponent {
  @Input() message: string = '';
  @Input() fullscreen: boolean = false;
}
