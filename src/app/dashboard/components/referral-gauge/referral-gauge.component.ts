import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferralGaugeData } from './referral-gauge.model';

@Component({
  selector: 'app-referral-gauge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './referral-gauge.component.html',
  styleUrl: './referral-gauge.component.scss'
})
export class ReferralGaugeComponent implements OnInit {
  @Input() gaugeData!: ReferralGaugeData;
  @ViewChild('gaugeCanvas', { static: true }) gaugeCanvas!: ElementRef<HTMLCanvasElement>;

  ngOnInit() {
    this.drawGauge();
  }

  private drawGauge() {
    if (!this.gaugeCanvas) return;

    const canvas = this.gaugeCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 240;
    canvas.height = 140;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw gauge
    const centerX = canvas.width / 2;
    const centerY = canvas.height - 20;
    const radius = 110;
    const startAngle = Math.PI;
    const endAngle = 0;

    // Background track
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineWidth = 15;
    ctx.strokeStyle = '#f0f0f0';
    ctx.stroke();

    // Calculate percentage arc
    const percentAngle = startAngle - ((this.gaugeData.percentage / 100) * Math.PI);

    // Create gradient for the gauge
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#8A65FF');    // Purple
    gradient.addColorStop(1, '#3DACFF');    // Blue

    // Draw percentage arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, percentAngle);
    ctx.lineWidth = 15;
    ctx.strokeStyle = gradient;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}
