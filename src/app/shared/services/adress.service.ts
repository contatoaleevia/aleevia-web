import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@app/core/services/api.service';
import { Address, AddressResponse } from '@shared/models/address.model';

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    private readonly apiService = inject(ApiService);
    private readonly apiUrl = 'address';

    getAddressById(id: string): Observable<AddressResponse> {
        return this.apiService.get(`${this.apiUrl}/${id}`);
    }

    createAddress(address: Address): Observable<AddressResponse> {
        return this.apiService.post(`${this.apiUrl}`, address);
    }

    getAddresBySource(): Observable<Address[]> {
        return this.apiService.get(`${this.apiUrl}/by-source`);
    }
}

