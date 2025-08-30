import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('medium');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly fullWidth = input(false);
  readonly icon = input<string>();
  readonly iconPosition = input<'left' | 'right'>('left');
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  onClick = output<Event>();

  buttonClasses = computed(() => {
    return [
      'custom-btn',
      `custom-btn--${this.variant()}`,
      `custom-btn--${this.size()}`,
      this.fullWidth() ? 'custom-btn--full-width' : '',
      this.loading() ? 'custom-btn--loading' : ''
    ].filter(Boolean).join(' ');
  });

  materialButtonType = computed(() => {
    switch (this.variant()) {
      case 'primary':
        return 'mat-raised-button';
      case 'secondary':
        return 'mat-stroked-button';
      case 'tertiary':
        return 'mat-button';
      default:
        return 'mat-raised-button';
    }
  });

  handleClick(event: Event): void {
    if (!this.disabled() && !this.loading()) {
      this.onClick.emit(event);
    }
  }
}