import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RegistrationContextService } from '@auth/base/register/registration-context.service';

export const registrationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const registrationContext = inject(RegistrationContextService);
  const registrationData = localStorage.getItem('registrationData');
  const registrationType = registrationContext.getContext();
  const routeBack = `/auth/register/${registrationType}`;
  const token = localStorage.getItem('token');

  if (!registrationData && !state.url.includes('cpf-cnpj')) {
    router.navigate([routeBack + '/cpf-cnpj']);
    return false;
  }

  if (registrationData) {
    const data = JSON.parse(registrationData);

    if (state.url.includes('password') && !token) {
      router.navigate([routeBack + '/cpf-cnpj']);
      return false;
    }

    if (state.url.includes('service-location') && !token) {
      router.navigate([routeBack + '/password']);
      return false;
    }

    if ((state.url.includes('confirmation') && !data.address) || !token) {
      router.navigate([routeBack + '/service-location']);
      return false;
    }
  }

  return true;
};