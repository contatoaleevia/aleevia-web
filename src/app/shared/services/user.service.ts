import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/doctor/`;
  private filesUrl = `${environment.apiUrl}/files/`;

  constructor(private http: HttpClient) {}

  updateUser(data: any): Observable<any> {
    return this.http.put(this.apiUrl, data);
  }
  
  uploadFile(formData: FormData): Observable<any> {
    formData.append('acl', 'private');
    return this.http.post(`${this.filesUrl}upload`, formData);
  }
} 