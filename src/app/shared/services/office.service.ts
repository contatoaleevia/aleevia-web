import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { Office, OfficeProfessional, OfficeProfessionalResponse, OfficeResponse } from '@shared/models/office.model';
import { Professional } from '@shared/components/form-professional/form-professional.component';
@Injectable({
  providedIn: 'root'
})
export class OfficeService {
  private readonly apiService = inject(ApiService);
  private readonly routeUrl = 'office';

  private officesSubject = new BehaviorSubject<Office[]>([]);
  offices$ = this.officesSubject.asObservable();

  private officeByIdSubject = new BehaviorSubject<Map<string, Office>>(new Map());
  officeById$ = this.officeByIdSubject.asObservable();

  private professionalsSubject = new BehaviorSubject<OfficeProfessional[]>([]);
  professionals$ = this.professionalsSubject.asObservable();

  getOfficeById(id: string): Observable<Office> {
    const cachedOffice = this.officeByIdSubject.getValue().get(id);
    if (cachedOffice) {
      return of(cachedOffice);
    }

    return this.apiService.get<OfficeResponse>(`${this.routeUrl}/${id}`).pipe(
      map((response: OfficeResponse) => response.office),
      tap((office: Office) => {
        const currentMap = this.officeByIdSubject.getValue();
        currentMap.set(id, office);
        this.officeByIdSubject.next(currentMap);
      })
    );
  }

  getMyOffices(): Observable<Office[]> {
    const currentOffices = this.officesSubject.getValue();
    if (currentOffices.length > 0) {
      return of(currentOffices);
    }

    return this.apiService.get<OfficeResponse[]>(`${this.routeUrl}/my-offices`).pipe(
      map((response: OfficeResponse[]) => response.map(officeResp => officeResp.office)),
      tap((offices: Office[]) => {
        localStorage.setItem('officeIds', JSON.stringify(offices.map(office => office.id)));
        this.officesSubject.next(offices);
      })
    );
  }

  getProfessionals(officeId: string): Observable<OfficeProfessional[]> {
    if (this.professionalsSubject.getValue().length > 0) {
      return of(this.professionalsSubject.getValue());
    }
    return this.apiService.get<OfficeProfessionalResponse>(`${this.routeUrl}/${officeId}/professionals`).pipe(
      map((response: OfficeProfessionalResponse) => response.professionals),
      tap((professionals: OfficeProfessional[]) => {
        this.professionalsSubject.next(professionals);
      })
    );
  }

  createOffice(office: Office): Observable<Office> {
    return this.apiService.post<Office>(this.routeUrl, office).pipe(
      switchMap((createdOffice: Office) => {
        console.log('Office created:', createdOffice);
        if (createdOffice.id) {
          return this.getOfficeById(createdOffice.id).pipe(
            tap((completeOffice: Office) => {
              const currentMap = this.officeByIdSubject.getValue();
              currentMap.set(completeOffice.id!, completeOffice);
              this.officeByIdSubject.next(currentMap);

              const currentOffices = this.officesSubject.getValue();
              const updatedOffices = [...currentOffices, completeOffice];
              console.log('Updated offices list:', updatedOffices);
              this.officesSubject.next(updatedOffices);

              localStorage.setItem('officeIds', JSON.stringify(updatedOffices.map(office => office.id)));
            })
          );
        }
        return of(createdOffice);
      })
    );
  }

  bindAddress(payload: { officeId: string, addressId: string }): Observable<Office> {
    return this.apiService.post<Office>(`${this.routeUrl}/bind-address`, payload).pipe(
      tap((updatedOffice: Office) => {
        if (updatedOffice.id) {
          const currentMap = this.officeByIdSubject.getValue();
          currentMap.set(updatedOffice.id, updatedOffice);
          this.officeByIdSubject.next(currentMap);
          this.officesSubject.next([]);
        }
      })
    );
  }

  bindProfessional(payload: { officeId: string, professional: Professional }): Observable<Office> {
    return this.apiService.post<Office>(`${this.routeUrl}/bind-professional`, payload).pipe(
      tap((updatedOffice: Office) => {
        if (updatedOffice.id) {
          const currentMap = this.officeByIdSubject.getValue();
          currentMap.set(updatedOffice.id, updatedOffice);
          this.officeByIdSubject.next(currentMap);
          this.officesSubject.next([]);
          this.professionalsSubject.next([]);
        }
      })
    );
  }

  clearCache(): void {
    this.officesSubject.next([]);
    this.officeByIdSubject.next(new Map());
    this.professionalsSubject.next([]);
  }

  deleteOffice(officeId: string): Observable<void> {
    return this.apiService.delete<void>(`${this.routeUrl}/${officeId}`).pipe(
      tap(() => {
        const currentMap = this.officeByIdSubject.getValue();
        currentMap.delete(officeId);
        this.officeByIdSubject.next(currentMap);
        this.officesSubject.next([]);
      })
    );
  }
}
