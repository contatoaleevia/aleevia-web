import { inject, Injectable } from '@angular/core';
import { IsRegisteredResponse, RegisterUserPayload } from '@auth/models/register.model';
import { ApiService } from '@core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly apiService = inject(ApiService);

    private readonly routeUrl = 'user/';

    isRegistered(cpfcnpj: string): Observable<IsRegisteredResponse> {
        return this.apiService.get<IsRegisteredResponse>(this.routeUrl + 'is-registered/' + cpfcnpj);
    }

    registerUser(payload: RegisterUserPayload): Observable<any> {
        return this.apiService.post(this.routeUrl + 'manager', payload);
    }
}