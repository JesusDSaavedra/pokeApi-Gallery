import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

type ChipSize = 'xs' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-chip',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="chip"
      [class]="'chip-' + size + ' ' + type"
      [attr.aria-label]="label">
      {{ label }}
    </span>
  `,
  styles: [`
    .chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-weight: 500;
      text-transform: capitalize;
      white-space: nowrap;
      transition: all var(--transition-fast);
    }

    .chip-xs {
      font-size: 0.625rem;
      padding: 0.125rem 0.5rem;
    }

    .chip-sm {
      font-size: 0.75rem;
      padding: 0.25rem 0.625rem;
    }

    .chip-md {
      font-size: 0.875rem;
      padding: 0.375rem 0.875rem;
    }

    .chip-lg {
      font-size: 1rem;
      padding: 0.5rem 1rem;
    }

    /* Tipos de Pokémon */
    .type-normal { background: var(--type-normal); color: white; }
    .type-fire { background: var(--type-fire); color: white; }
    .type-water { background: var(--type-water); color: white; }
    .type-electric { background: var(--type-electric); color: #333; }
    .type-grass { background: var(--type-grass); color: white; }
    .type-ice { background: var(--type-ice); color: #333; }
    .type-fighting { background: var(--type-fighting); color: white; }
    .type-poison { background: var(--type-poison); color: white; }
    .type-ground { background: var(--type-ground); color: #333; }
    .type-flying { background: var(--type-flying); color: white; }
    .type-psychic { background: var(--type-psychic); color: white; }
    .type-bug { background: var(--type-bug); color: white; }
    .type-rock { background: var(--type-rock); color: white; }
    .type-ghost { background: var(--type-ghost); color: white; }
    .type-dragon { background: var(--type-dragon); color: white; }
    .type-dark { background: var(--type-dark); color: white; }
    .type-steel { background: var(--type-steel); color: #333; }
    .type-fairy { background: var(--type-fairy); color: #333; }

    /* Habilidades y otros */
    .ability {
      background: var(--secondary-color);
      color: var(--text-primary);
    }

    .stat {
      background: var(--primary-color);
      color: white;
    }

    .default {
      background: var(--border-color);
      color: var(--text-primary);
    }

    body.dark-mode .default {
      background: var(--dark-border-color);
      color: var(--dark-text-primary);
    }
  `]
})
export class ChipComponent {
  @Input() label: string = '';
  @Input() type: string = 'default';
  @Input() size: ChipSize = 'md';
}
