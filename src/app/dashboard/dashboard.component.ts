import { Component } from '@angular/core';
import { FirstAccessComponent } from '@dashboard/first-access/first-access.component';
import { CommonModule } from '@angular/common';
import { User } from '@shared/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FirstAccessComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  currentUser: User = JSON.parse(localStorage.getItem('currentUser') || '{}');
}
