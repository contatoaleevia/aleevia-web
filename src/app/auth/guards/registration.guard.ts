import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RegistrationContextService } from '@auth/services/registration-context.service';

export const registrationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const registrationContext = inject(RegistrationContextService);
  const registrationData = localStorage.getItem('registrationData');
  const registrationType = registrationContext.getContext();
  const routeBack = `/auth/register/${registrationType}`;
  
  if (!registrationData && !state.url.includes('cpf-cnpj')) {
    router.navigate([routeBack + '/cpf-cnpj']);
    return false;
  }

  if (registrationData) {
    const data = JSON.parse(registrationData);
    
    if (state.url.includes('password') && (!data.name || !data.email || !data.cpf)) {
      router.navigate([routeBack + '/cpf-cnpj']);
      return false;
    }

    if (state.url.includes('service-location') && !data.password) {
      router.navigate([routeBack + '/password']);
      return false;
    }

    if (state.url.includes('confirmation') && !data.address) {
      router.navigate([routeBack + '/service-location']);
      return false;
    }
  }

  return true;
}; 