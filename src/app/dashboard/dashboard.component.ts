import { Component } from '@angular/core';
import { FirstAccessComponent } from './first-access/first-access.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FirstAccessComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // Dashboard lógica aqui
}
