import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Observable } from 'rxjs';
import { Office } from '@shared/models/office.model';
import { Professional } from '@shared/components/form-professional/form-professional.component';
@Injectable({
  providedIn: 'root'
})
export class OfficeService {
  private readonly apiService = inject(ApiService);

  private readonly routeUrl = 'office';

  getOfficeById(id: string): Observable<Office> {
    return this.apiService.get(`${this.routeUrl}/${id}`);
  }

  createOffice(office: Office): Observable<Office> {
    return this.apiService.post(this.routeUrl, office);
  }

  bindAddress(payload: { officeId: string, addressId: string }): Observable<Office> {
    return this.apiService.post(`${this.routeUrl}/bind-address`, payload);
  }

  bindProfessional(payload: { officeId: string, professional: Professional }): Observable<Office> {
    return this.apiService.post(`${this.routeUrl}/bind-professional`, payload);
  }
}