import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const registrationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const registrationData = localStorage.getItem('registrationData');
  
  if (!registrationData && !state.url.includes('cpf-cnpj')) {
    router.navigate(['/auth/register/individual/cpf-cnpj']);
    return false;
  }

  if (registrationData) {
    const data = JSON.parse(registrationData);
    
    if (state.url.includes('password') && (!data.name || !data.email || !data.cpf)) {
      router.navigate(['/auth/register/individual/cpf-cnpj']);
      return false;
    }

    if (state.url.includes('service-location') && !data.password) {
      router.navigate(['/auth/register/individual/password']);
      return false;
    }

    if (state.url.includes('confirmation') && !data.address) {
      router.navigate(['/auth/register/individual/service-location']);
      return false;
    }
  }

  return true;
}; 