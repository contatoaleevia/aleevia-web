import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AlertService } from '@app/shared/services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordGuard implements CanActivate {
  constructor(
    private router: Router,
    private alertService: AlertService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = route.queryParams['token'];

    if (!token) {
      this.alertService.error({
        title: 'Token inválido',
        text: 'O link de redefinição de senha é inválido ou expirou.',
        confirmButtonText: 'Voltar para login',
        allowOutsideClick: false,
        allowEscapeKey: false,
        buttonsStyling: false
      })
      this.router.navigate(['/auth/login']);
      return false;
    }

    localStorage.setItem('resetPasswordToken', token);
    return true;
  }
}