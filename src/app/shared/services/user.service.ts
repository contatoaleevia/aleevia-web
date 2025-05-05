import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly apiService = inject(ApiService);

    private readonly routeUrl = 'user/';

    /**
     * Verifica se o usuário está registrado
     * @returns Observable com o resultado
     */
    isRegistered(cpfcnpj: string): Observable<boolean> {
        return this.apiService.get<boolean>(this.routeUrl + 'is-registered/' + cpfcnpj);
    }
}