import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteractionsChartData } from './interactions-chart.model';

@Component({
  selector: 'app-interactions-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interactions-chart.component.html',
  styleUrl: './interactions-chart.component.scss'
})
export class InteractionsChartComponent implements OnInit {
  @Input() chartData!: InteractionsChartData;
  @ViewChild('lineChart', { static: true }) lineChart!: ElementRef<HTMLCanvasElement>;

  ngOnInit() {
    this.drawChart();
  }

  private drawChart() {
    if (!this.lineChart || !this.chartData.data.length) return;

    const canvas = this.lineChart.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 300;
    canvas.height = 180;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Chart dimensions
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;

    // Get data values
    const data = this.chartData.data;
    const values = data.map(d => d.value);
    const minValue = Math.min(...values) * 0.9; // Add 10% padding to min
    const maxValue = Math.max(...values) * 1.1; // Add 10% padding to max
    const valueRange = maxValue - minValue;

    // Draw grid and axes
    this.drawGrid(ctx, padding, chartWidth, chartHeight, minValue, maxValue);

    // Plot line
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#4f46e5'; // Primary purple

    data.forEach((point, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Draw point
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#4f46e5';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.stroke();

    // Fill area under the line
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(
      0, padding.top,
      0, padding.top + chartHeight
    );
    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
    gradient.addColorStop(1, 'rgba(79, 70, 229, 0.0)');
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  private drawGrid(
    ctx: CanvasRenderingContext2D,
    padding: { top: number, right: number, bottom: number, left: number },
    width: number,
    height: number,
    minValue: number,
    maxValue: number
  ) {
    const data = this.chartData.data;

    // Draw horizontal grid lines and labels
    ctx.beginPath();
    ctx.strokeStyle = '#e5e7eb'; // Light gray
    ctx.fillStyle = '#9ca3af'; // Gray text
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const yAxisLabels = 4; // Number of labels on y-axis
    for (let i = 0; i <= yAxisLabels; i++) {
      const y = padding.top + (i / yAxisLabels) * height;
      const value = maxValue - (i / yAxisLabels) * (maxValue - minValue);

      if (i > 0 && i < yAxisLabels) { // Skip first and last for cleaner look
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + width, y);
      }

      // Skip value labels for cleaner look
      if (i % 2 === 0) {
        ctx.fillText(Math.round(value).toString(), padding.left - 8, y);
      }
    }
    ctx.stroke();

    // Draw x-axis and month labels
    ctx.fillStyle = '#9ca3af'; // Gray text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Only show a subset of month labels to avoid crowding
    const visibleLabels = 7; // Show 7 labels
    const step = Math.max(1, Math.floor(data.length / visibleLabels));

    data.forEach((point, i) => {
      const x = padding.left + (i / (data.length - 1)) * width;

      if (i % step === 0 || i === data.length - 1) {
        ctx.fillText(point.month, x, padding.top + height + 10);
      }
    });
  }
}
