import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SatisfactionRatingData } from './satisfaction-rating.model';

@Component({
  selector: 'app-satisfaction-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './satisfaction-rating.component.html',
  styleUrl: './satisfaction-rating.component.scss'
})
export class SatisfactionRatingComponent {
  @Input() ratingData!: SatisfactionRatingData;

  currentMonth: string = 'Abril/25';

  getTrendClass(trend: number): string {
    return trend >= 0 ? 'positive' : 'negative';
  }

  getTrendPrefix(trend: number): string {
    return trend >= 0 ? '+' : '';
  }

  selectMonth(): void {
    // This would open a dropdown in a real implementation
    console.log('Month selector clicked');
  }
}
