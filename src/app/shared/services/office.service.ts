import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Office, OfficeResponse } from '@shared/models/office.model';
import { Professional } from '@shared/components/form-professional/form-professional.component';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {
  private readonly apiService = inject(ApiService);
  private readonly routeUrl = 'office';
  private cachedOffices: OfficeResponse[] | null = null;
  private cachedOfficeById: Map<string, Office> = new Map();

  getOfficeById(id: string): Observable<Office> {
    if (this.cachedOfficeById.has(id)) {
      console.log('Returning office from cache:', id);
      return of(this.cachedOfficeById.get(id) as Office);
    }

    return this.apiService.get<OfficeResponse>(`${this.routeUrl}/${id}`).pipe(
      map((response: OfficeResponse) => {
        return response.office;
      }),
      tap((office: Office) => {
        console.log('Caching office:', id);
        this.cachedOfficeById.set(id, office);
      })
    );
  }

  getMyOffices(): Observable<OfficeResponse[]> {
    if (this.cachedOffices) {
      return of(this.cachedOffices);
    }

    return this.apiService.get<OfficeResponse[]>(`${this.routeUrl}/my-offices`).pipe(
      tap((response: OfficeResponse[]) => {
        this.cachedOffices = response;
      })
    );
  }

  createOffice(office: Office): Observable<Office> {
    this.cachedOffices = null;
    this.cachedOfficeById.delete(office.id || '');

    return this.apiService.post<Office>(this.routeUrl, office).pipe(
      tap((updatedOffice: Office) => {
        if (updatedOffice.id) {
          this.cachedOfficeById.set(updatedOffice.id, updatedOffice);
        }
      })
    );
  }

  bindAddress(payload: { officeId: string, addressId: string }): Observable<Office> {
    this.cachedOffices = null;
    this.cachedOfficeById.delete(payload.officeId);

    return this.apiService.post<Office>(`${this.routeUrl}/bind-address`, payload).pipe(
      tap((updatedOffice: Office) => {
        if (updatedOffice.id) {
          this.cachedOfficeById.set(updatedOffice.id, updatedOffice);
        }
      })
    );
  }

  bindProfessional(payload: { officeId: string, professional: Professional }): Observable<Office> {
    this.cachedOffices = null;
    this.cachedOfficeById.delete(payload.officeId);

    return this.apiService.post<Office>(`${this.routeUrl}/bind-professional`, payload).pipe(
      tap((updatedOffice: Office) => {
        if (updatedOffice.id) {
          this.cachedOfficeById.set(updatedOffice.id, updatedOffice);
        }
      })
    );
  }

  clearCache(): void {
    this.cachedOffices = null;
    this.cachedOfficeById.clear();
  }
}
