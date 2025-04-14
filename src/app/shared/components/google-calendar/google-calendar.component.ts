import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@shared/components/button/button.component';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-google-calendar',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './google-calendar.component.html',
  styleUrl: './google-calendar.component.scss'
})
export class GoogleCalendarComponent {
  connectWithGoogle() {
    window.location.href = `${environment.apiUrl}/auth/google/login`;
  }
}
