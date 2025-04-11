import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../../shared/models/user.model';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-modal.component.html',
  styleUrl: './success-modal.component.scss'
})
export class SuccessModalComponent {
  @Output() configureSchedule = new EventEmitter<void>();
  @Output() goToDashboard = new EventEmitter<void>();
  @Input() currentUser: User = {} as User;
}
