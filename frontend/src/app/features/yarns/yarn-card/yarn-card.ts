import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-yarn-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './yarn-card.html',
  styleUrl: './yarn-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YarnCard {
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly imageUrl = input<string>('');
}
