import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UpdateAddress } from '../models/user.model';
import { ProfessionsResponse } from '../models/profession.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = environment.apiUrl + 'doctor';
  private addressesCache = new BehaviorSubject<UpdateAddress[]>([]);

  constructor(private http: HttpClient) {
    this.loadAddresses();
  }

  get addresses$(): Observable<UpdateAddress[]> {
    return this.addressesCache.asObservable();
  }

  private loadAddresses(): void {
    this.http.get<UpdateAddress[]>(`${this.apiUrl}/addresses`)
      .subscribe(addresses => {
        this.addressesCache.next(addresses);
      });
  }

  saveAddress(address: UpdateAddress): Observable<UpdateAddress> {
    const request$ = address.id
      ? this.http.put<UpdateAddress>(`${this.apiUrl}/addresses/${address.id}`, address)
      : this.http.post<UpdateAddress>(`${this.apiUrl}/addresses`, address);

    return request$.pipe(
      tap(newAddress => {
        const currentAddresses = this.addressesCache.value;
        if (address.id) {
          const index = currentAddresses.findIndex(a => a.id === address.id);
          if (index !== -1) {
            currentAddresses[index] = newAddress;
          }
        } else {
          currentAddresses.push(newAddress);
        }
        this.addressesCache.next(currentAddresses);
      })
    );
  }

  getAddresses(): Observable<UpdateAddress[]> {
    return this.addresses$;
  }

  deleteAddress(addressId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/addresses/${addressId}`).pipe(
      tap(() => {
        const currentAddresses = this.addressesCache.value;
        const updatedAddresses = currentAddresses.filter(address => address.id !== addressId);
        this.addressesCache.next(updatedAddresses);
      })
    );
  }

  getProfessions(): Observable<ProfessionsResponse> {
    return this.http.get<ProfessionsResponse>(`${this.apiUrl}/professions`);
  }

  updateUser(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/`, data);
  }
  
  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/files/upload`, formData);
  }

  saveSchedule(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/availability`, data);
  }
} 