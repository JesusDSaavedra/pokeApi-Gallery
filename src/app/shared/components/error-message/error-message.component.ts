import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="error-container" role="alert" aria-live="assertive">
      <div class="error-icon">⚠️</div>
      <div class="error-content">
        <h3 class="error-title">{{ title }}</h3>
        <p class="error-message">{{ message }}</p>
        <button
          *ngIf="showRetry"
          class="btn btn-primary retry-btn"
          (click)="onRetry()"
          type="button">
          🔄 Reintentar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem;
      text-align: center;
      background: var(--bg-secondary);
      border-radius: 16px;
      box-shadow: var(--shadow-md);
      margin: 2rem auto;
      max-width: 500px;
    }

    .error-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: bounce 1s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .error-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .error-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--primary-color);
      margin: 0;
    }

    .error-message {
      font-size: 1rem;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.6;
    }

    .retry-btn {
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      font-weight: 500;
      border-radius: 8px;
      transition: all var(--transition-normal);

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }
    }

    @media (max-width: 768px) {
      .error-container {
        padding: 2rem 1rem;
      }

      .error-icon {
        font-size: 3rem;
      }

      .error-title {
        font-size: 1.25rem;
      }

      .error-message {
        font-size: 0.875rem;
      }
    }
  `]
})
export class ErrorMessageComponent {
  @Input() title: string = 'Error';
  @Input() message: string = 'Ha ocurrido un error inesperado';
  @Input() showRetry: boolean = true;
  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
