import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { REGISTRATION_TYPES } from '../constants/registration-types';
@Component({
  selector: 'app-start',
  standalone: true,
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent {
  readonly router = inject(Router);
  readonly REGISTRATION_TYPES = REGISTRATION_TYPES;

  navigateTo(type: string) {
    this.router.navigate(['/auth/register', type, 'cpf-cnpj']);
    localStorage.setItem('registrationType', type);
  }
}
