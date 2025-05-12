import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { REGISTRATION_TYPES, RegistrationType } from '@auth/base/register/constants/registration-types';

@Injectable({
  providedIn: 'root'
})
export class RegistrationContextService {
  private contextSubject = new BehaviorSubject<RegistrationType>(REGISTRATION_TYPES.INDIVIDUAL);
  context$ = this.contextSubject.asObservable();

  constructor(private router: Router) {
    const registrationType = localStorage.getItem('registrationType');
    if (registrationType) {
      this.contextSubject.next(registrationType as RegistrationType);
    }
  }

  getContext(): RegistrationType {
    return this.contextSubject.value;
  }
}