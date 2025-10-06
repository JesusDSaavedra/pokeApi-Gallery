import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="skeleton-card" *ngFor="let item of items">
      <div class="skeleton-image"></div>
      <div class="skeleton-content">
        <div class="skeleton-title"></div>
        <div class="skeleton-chips">
          <div class="skeleton-chip"></div>
          <div class="skeleton-chip"></div>
        </div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text short"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .skeleton-card {
        background: var(--bg-secondary);
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: var(--shadow-md);
        animation: pulse 1.5s ease-in-out infinite;
      }

      .skeleton-image {
        width: 100%;
        aspect-ratio: 1;
        background: linear-gradient(
          90deg,
          var(--border-color) 25%,
          #f0f0f0 50%,
          var(--border-color) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
        border-radius: 12px;
        margin-bottom: 1rem;
      }

      body.dark-mode .skeleton-image {
        background: linear-gradient(
          90deg,
          var(--dark-border-color) 25%,
          #2a3441 50%,
          var(--dark-border-color) 75%
        );
        background-size: 200% 100%;
      }

      .skeleton-content {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .skeleton-title {
        height: 1.5rem;
        width: 70%;
        background: linear-gradient(
          90deg,
          var(--border-color) 25%,
          #f0f0f0 50%,
          var(--border-color) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
        border-radius: 4px;
      }

      .skeleton-chips {
        display: flex;
        gap: 0.5rem;
      }

      .skeleton-chip {
        height: 1.5rem;
        width: 4rem;
        background: linear-gradient(
          90deg,
          var(--border-color) 25%,
          #f0f0f0 50%,
          var(--border-color) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
        border-radius: 12px;
      }

      .skeleton-text {
        height: 0.875rem;
        width: 100%;
        background: linear-gradient(
          90deg,
          var(--border-color) 25%,
          #f0f0f0 50%,
          var(--border-color) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
        border-radius: 4px;

        &.short {
          width: 80%;
        }
      }

      body.dark-mode .skeleton-title,
      body.dark-mode .skeleton-chip,
      body.dark-mode .skeleton-text {
        background: linear-gradient(
          90deg,
          var(--dark-border-color) 25%,
          #2a3441 50%,
          var(--dark-border-color) 75%
        );
        background-size: 200% 100%;
      }

      @media (max-width: 768px) {
        .skeleton-card {
          padding: 1rem;
        }
      }
    `,
  ],
})
export class SkeletonLoaderComponent {
  @Input() count: number = 1;

  get items(): number[] {
    return Array(this.count).fill(0);
  }
}
