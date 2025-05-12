import { ServiceType } from "@shared/models/service-type.model";
import { ApiService } from "@app/core/services/api.service";
import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ServiceTypeService {
  private readonly apiService = inject(ApiService);
  private readonly routeUrl = 'service-type';

  private serviceTypesSubject = new BehaviorSubject<ServiceType[]>([]);
  serviceTypes$ = this.serviceTypesSubject.asObservable();

  getServiceTypes(): Observable<ServiceType[]> {
    const currentData = this.serviceTypesSubject.getValue();
    if (currentData.length > 0) {
      console.log('Usando dados em cache de serviceTypes:', currentData);
      return of(currentData);
    }

    return this.apiService.get<ServiceType[]>(this.routeUrl).pipe(
      tap(serviceTypes => {
        this.serviceTypesSubject.next(serviceTypes);
        console.log('Dados de serviceTypes obtidos da API:', serviceTypes);
      })
    );
  }
}