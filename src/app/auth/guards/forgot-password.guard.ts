import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { PasswordResetService } from '@auth/base/reset-password/password-reset.service';
@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordGuard implements CanActivate {
  private readonly router = inject(Router);
  private readonly passwordResetService = inject(PasswordResetService);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = route.queryParams['token'];

    if (token) {
      this.router.navigate(['/auth/reset-password/new-password'], {
        queryParams: { token }
      });
      localStorage.setItem('resetPasswordToken', token);
      this.passwordResetService.token = token;
      return false;
    }

    return true;
  }
}
