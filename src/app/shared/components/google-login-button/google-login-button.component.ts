import { Component } from '@angular/core';
import { environment } from '@environments/environment';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-google-login-button',
  imports: [ButtonComponent],
  templateUrl: './google-login-button.component.html',
  styleUrl: './google-login-button.component.scss'
})
export class GoogleLoginButtonComponent {
  connectWithGoogle() {
    window.location.href = `${environment.apiUrl}/auth/google/login`;
  }
}
