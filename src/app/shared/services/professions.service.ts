import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Subspecialty, Specialty, ProfessionsResponse } from '../models/profession.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessionsService {
  private apiUrl = `${environment.apiUrl}/doctor/professions`;

  constructor(private http: HttpClient) {}

  getProfessions(): Observable<ProfessionsResponse> {
    return this.http.get<ProfessionsResponse>(this.apiUrl);
  }
} 