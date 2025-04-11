import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { User } from '@shared/models/user.model';
import { AuthService } from '@auth/services/auth.service';

export const userResolver: ResolveFn<User | null> = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.getToken()) {
    return authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          router.navigate(['/login']);
          return null;
        }
        return user;
      }),
      catchError(() => {
        router.navigate(['/login']);
        return of(null);
      })
    );
  }
  
  router.navigate(['/login']);
  return of(null);
}; 