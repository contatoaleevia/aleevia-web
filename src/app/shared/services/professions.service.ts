import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfessionsResponse } from '@shared/models/profession.model';
import { ApiService } from '@core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessionsService {
  private readonly apiService = inject(ApiService);

  getProfessions(): Observable<ProfessionsResponse> {
    return this.apiService.get<ProfessionsResponse>('/doctor/professions');
  }
} 