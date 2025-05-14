import { Injectable, inject } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { Observable, tap } from 'rxjs';
import { ForgotPasswordResponse } from '@app/auth/models/auth.model';

interface ResetPasswordPayload {
  document: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private readonly apiService = inject(ApiService);
  document: string = localStorage.getItem('documentResetPassword') || '';
  token: string = localStorage.getItem('resetPasswordToken') || '';

  requestResetPassword(document: string): Observable<ForgotPasswordResponse> {
    return this.apiService.post<ForgotPasswordResponse>('password/request', { document }).pipe(
      tap((response: ForgotPasswordResponse) => {
        localStorage.setItem('documentResetPassword', response.document);
        this.document = response.document;
      })
    );
  }

  resetPassword(payload: ResetPasswordPayload): Observable<any> {
    return this.apiService.post('password/reset', payload);
  }
}
