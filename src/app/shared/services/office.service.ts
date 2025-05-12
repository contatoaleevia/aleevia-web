import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Observable } from 'rxjs';
import { Office } from '@shared/models/office.model';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {
  private readonly apiService = inject(ApiService);

  private readonly routeUrl = 'office';

  createOffice(office: Office): Observable<Office> {
    return this.apiService.post(this.routeUrl, office);
  }

  bindAddress(payload: { officeId: string, addressId: string }): Observable<Office> {
    return this.apiService.post(`${this.routeUrl}/bind-address`, payload);
  }

  getOfficeById(id: string): Observable<Office> {
    return this.apiService.get(`${this.routeUrl}/${id}`);
  }
}