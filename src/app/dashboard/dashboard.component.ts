import { Component } from '@angular/core';
import { FirstAccessComponent } from '@dashboard/first-access/first-access.component';
import { CommonModule } from '@angular/common';
import { User } from '@shared/models/user.model';
import { GoogleLoginButtonComponent } from '@shared/components/google-login-button/google-login-button.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FirstAccessComponent,
    CommonModule,
    GoogleLoginButtonComponent,
    DashboardLayoutComponent
  ],
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
