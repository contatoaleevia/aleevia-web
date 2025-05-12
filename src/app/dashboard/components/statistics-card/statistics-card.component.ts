import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsCardData } from './statistics-card.model';

@Component({
  selector: 'app-statistics-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics-card.component.html',
  styleUrl: './statistics-card.component.scss'
})
export class StatisticsCardComponent {
  @Input() statsData!: StatisticsCardData;

  getTrendClass(item: any): string {
    const isPositive = item.trend >= 0;
    if (item.isNegativeTrendGood) {
      return isPositive ? 'negative' : 'positive';
    }
    return isPositive ? 'positive' : 'negative';
  }

  getTrendPrefix(trend: number): string {
    return trend > 0 ? '+' : '';
  }

  selectMonth(): void {
    // This would open a dropdown in a real implementation
    console.log('Month selector clicked');
  }
}
