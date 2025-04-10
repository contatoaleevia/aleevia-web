import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();
  
  console.log('Auth Interceptor - URL:', req.url);
  console.log('Auth Interceptor - Token:', token ? 'Present' : 'Missing');
  
  if (token) {
    const headers = req.headers.set('Authorization', `Bearer ${token}`);
    req = req.clone({ headers });
  }
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('Auth Interceptor - Error:', error.status);
      
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login'], { 
          queryParams: { returnUrl: router.url } 
        });
      }
      return throwError(() => error);
    })
  );
}; 