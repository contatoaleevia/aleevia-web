import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiService = inject(ApiService);

  updateUser(data: any): Observable<any> {
    return this.apiService.put('/doctor/', data);
  }
  
  uploadFile(formData: FormData): Observable<any> {
    formData.append('acl', 'private');
    return this.apiService.post('/files/upload', formData);
  }
} 