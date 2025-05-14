import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '@app/core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
    private readonly apiService = inject(ApiService);

    requestResetPassword(document: string): Observable<void> {
        return this.apiService.post('password/request', { document });
    }
}
