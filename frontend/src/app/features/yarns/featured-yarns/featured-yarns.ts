import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YarnCard } from '../yarn-card/yarn-card';

interface Yarn {
  title: string;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-featured-yarns',
  standalone: true,
  imports: [CommonModule, YarnCard],
  templateUrl: './featured-yarns.html',
  styleUrl: './featured-yarns.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturedYarns {
  featuredYarns: Yarn[] = [
    {
      title: 'Cozy Merino Wool',
      description: 'Perfect for sweaters and blankets',
      imageUrl: 'assets/images/merino-wool.jpg'
    },
    {
      title: 'Soft Alpaca Blend',
      description: 'Ideal for scarves and shawls',
      imageUrl: 'assets/images/alpaca-blend.jpg'
    },
    {
      title: 'Luxury Cashmere Yarn',
      description: 'The ultimate in softness and warmth',
      imageUrl: 'assets/images/cashmere.jpg'
    }
  ];
}
