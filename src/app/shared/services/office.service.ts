import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Office, OfficeProfessional, OfficeResponse } from '@shared/models/office.model';
import { Professional } from '@shared/components/form-professional/form-professional.component';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {
  private readonly apiService = inject(ApiService);
  private readonly routeUrl = 'office';
  private cachedOffices: OfficeResponse[] = [];
  private cachedOfficeById: Map<string, Office> = new Map();
  private cachedProfessionals: OfficeProfessional[] = [];

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
    console.log('getMyOffices', this.cachedOffices);
    if (this.cachedOffices.length > 0) {
      return of(this.cachedOffices);
    }

    return this.apiService.get<OfficeResponse[]>(`${this.routeUrl}/my-offices`).pipe(
      tap((response: OfficeResponse[]) => {
        this.cachedOffices = response;
      })
    );
  }

  getProfessionals(officeId: string): Observable<any> {
    return this.apiService.get<any>(`${this.routeUrl}/${officeId}/professionals`).pipe(
      tap((response: any) => {
        if (Array.isArray(response)) {
          this.cachedProfessionals = response;
        } else if (response && typeof response === 'object' && Array.isArray(response.professionals)) {
          this.cachedProfessionals = response.professionals;
        }
      })
    );
  }

  createOffice(office: Office): Observable<Office> {
    this.cachedOffices = [];
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
    this.cachedOffices = [];
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
    // Limpar todos os caches relacionados
    this.cachedOffices = [];
    this.cachedOfficeById.delete(payload.officeId);
    this.cachedProfessionals = []; // Limpar o cache de profissionais

    return this.apiService.post<Office>(`${this.routeUrl}/bind-professional`, payload).pipe(
      tap((updatedOffice: Office) => {
        if (updatedOffice.id) {
          this.cachedOfficeById.set(updatedOffice.id, updatedOffice);
        }
      })
    );
  }

  clearCache(): void {
    this.cachedOffices = [];
    this.cachedOfficeById.clear();
  }

  deleteOffice(officeId: string): Observable<void> {
    this.cachedOffices = [];
    this.cachedOfficeById.delete(officeId);

    return this.apiService.delete<void>(`${this.routeUrl}/${officeId}`);
  }
}
