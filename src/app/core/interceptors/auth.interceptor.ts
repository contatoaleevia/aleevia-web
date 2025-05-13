import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  console.log('Auth Interceptor - URL:', req.url);
  console.log('Auth Interceptor - Token:', token ? 'Present' : 'Missing');

  if (req.url.includes('viacep')) {
    return next(req);
  }

  if (token) {
    const headers = req.headers.set('Authorization', `Bearer ${token}`);
    req = req.clone({ headers });
  }

  const headers = req.headers.set('x-api-key', environment.apiKey);
  req = req.clone({ headers });

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('Auth Interceptor - Error:', error.status);

      if (error.status === 401) {
        // authService.logout();
        router.navigate(['/login'], {
          queryParams: { returnUrl: router.url }
        });
      }
      return throwError(() => error);
    })
  );
};