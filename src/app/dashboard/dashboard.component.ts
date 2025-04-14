import { Component } from '@angular/core';
import { FirstAccessComponent } from '@dashboard/first-access/first-access.component';
import { CommonModule } from '@angular/common';
import { User } from '@shared/models/user.model';
import { GoogleCalendarComponent } from '../shared/components/google-calendar/google-calendar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FirstAccessComponent, CommonModule, GoogleCalendarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  currentUser: User = JSON.parse(localStorage.getItem('currentUser') || '{}');
  showCalendarConfig: boolean = false;

  onConfigureSchedule() {
    this.showCalendarConfig = true;
  }
}
