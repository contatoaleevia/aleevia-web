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
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      if (url.includes(REGISTRATION_TYPES.CLINIC)) {
        this.contextSubject.next(REGISTRATION_TYPES.CLINIC);
      } else if (url.includes(REGISTRATION_TYPES.INDIVIDUAL)) {
        this.contextSubject.next(REGISTRATION_TYPES.INDIVIDUAL);
      }
    });
  }

  getContext(): RegistrationType {
    return this.contextSubject.value;
  }
} 