import { inject, Injectable } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { Professional } from '../components/form-professional/form-professional.component';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {
  private readonly apiService = inject(ApiService);

  getProfessionals() {
    return this.apiService.get('professionals');
  }

  getMyProfessional(): Observable<Professional[]> {
    return this.apiService.get('professional/me');
  }

  createProfessional(professional: Professional) {
    return this.apiService.post('professional', professional);
  }
}
