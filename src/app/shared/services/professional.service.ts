import { inject, Injectable } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { Professional } from '../components/form-professional/form-professional.component';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { OfficeProfessional, OfficeProfessionalResponse } from '@shared/models/office.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {
  private readonly apiService = inject(ApiService);
  private readonly routeUrl = 'professional';

  private professionalsSubject = new BehaviorSubject<OfficeProfessional[]>([]);
  professionals$ = this.professionalsSubject.asObservable();

  private professionalByIdSubject = new BehaviorSubject<Map<string, OfficeProfessional>>(new Map());
  professionalById$ = this.professionalByIdSubject.asObservable();

  getProfessionals(): Observable<OfficeProfessional[]> {
    const currentProfessionals = this.professionalsSubject.getValue();
    if (currentProfessionals.length > 0) {
      return of(currentProfessionals);
    }

    return this.apiService.get<OfficeProfessionalResponse>(`${this.routeUrl}/me`).pipe(
      map((response: OfficeProfessionalResponse) => response.professionals),
      tap((professionals: OfficeProfessional[]) => {
        this.professionalsSubject.next(professionals);
        const currentMap = this.professionalByIdSubject.getValue();
        professionals.forEach(professional => {
          if (professional.id) {
            currentMap.set(professional.id, professional);
          }
        });
        this.professionalByIdSubject.next(currentMap);
      })
    );
  }

  getMyProfessional(): Observable<OfficeProfessional[]> {
    return this.apiService.get<OfficeProfessionalResponse>(`${this.routeUrl}/me`).pipe(
      map((response: OfficeProfessionalResponse) => response.professionals)
    );
  }

  getProfessionalById(id: string): Observable<OfficeProfessional | undefined> {
    const cachedProfessional = this.professionalByIdSubject.getValue().get(id);
    if (cachedProfessional) {
      return of(cachedProfessional);
    }

    return this.apiService.get<OfficeProfessional>(`${this.routeUrl}/${id}`).pipe(
      tap((professional: OfficeProfessional) => {
        if (professional.id) {
          const currentMap = this.professionalByIdSubject.getValue();
          currentMap.set(professional.id, professional);
          this.professionalByIdSubject.next(currentMap);
        }
      })
    );
  }

  createProfessional(professional: Professional): Observable<OfficeProfessional> {
    return this.apiService.post<OfficeProfessional>(this.routeUrl, professional).pipe(
      tap((createdProfessional: OfficeProfessional) => {
        if (createdProfessional.id) {
          const currentMap = this.professionalByIdSubject.getValue();
          currentMap.set(createdProfessional.id, createdProfessional);
          this.professionalByIdSubject.next(currentMap);

          const currentProfessionals = this.professionalsSubject.getValue();
          const updatedProfessionals = [...currentProfessionals, createdProfessional];
          this.professionalsSubject.next(updatedProfessionals);
        }
      })
    );
  }

  clearCache(): void {
    this.professionalsSubject.next([]);
    this.professionalByIdSubject.next(new Map());
  }
}
