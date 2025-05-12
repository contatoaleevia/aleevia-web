import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesChartData } from './categories-chart.model';

@Component({
  selector: 'app-categories-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-chart.component.html',
  styleUrl: './categories-chart.component.scss'
})
export class CategoriesChartComponent implements OnInit {
  @Input() chartData!: CategoriesChartData;
  @ViewChild('donutChart', { static: true }) donutChart!: ElementRef<HTMLCanvasElement>;

  ngOnInit() {
    this.drawChart();
  }

  private drawChart() {
    if (!this.donutChart) return;

    const canvas = this.donutChart.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 220;
    canvas.height = 220;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate center and radius
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = 80;
    const innerRadius = 50;

    // Draw donut chart
    let startAngle = 0;

    this.chartData.categories.forEach(category => {
      const sliceAngle = (category.percentage / 100) * 2 * Math.PI;

      // Draw slice
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = category.color;
      ctx.fill();

      startAngle += sliceAngle;
    });

    // Draw center circle (white)
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius - 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Draw total text
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Total', centerX, centerY - 15);

    ctx.font = 'bold 30px Arial';
    ctx.fillText(this.chartData.total.toString(), centerX, centerY + 15);
  }
}
