import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@shared/models/user.model';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-modal.component.html',
  styleUrl: './success-modal.component.scss'
})
export class SuccessModalComponent implements OnInit {
  @Output() configureSchedule = new EventEmitter<void>();
  @Output() goToDashboard = new EventEmitter<void>();
  @Input() currentUser: User = {} as User;

  ngOnInit() {
    this.fireConfetti();
  }

  private fireConfetti() {
    confetti({
      particleCount: 150,
      spread: 160,
      origin: { y: 0 },
      angle: 90,
      gravity: 0.8,
      ticks: 200
    });
  }
}
