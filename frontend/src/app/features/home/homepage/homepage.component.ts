import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturedYarns } from '../../yarns/featured-yarns/featured-yarns';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, FeaturedYarns, CustomButtonComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomepageComponent {

}
