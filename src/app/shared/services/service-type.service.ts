import { ServiceType } from "@shared/models/service-type.model";
import { ApiService } from "@app/core/services/api.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ServiceTypeService {

  private routeUrl = 'service-type';

  constructor(private readonly apiService: ApiService) { }

  getServiceTypes() {
    return this.apiService.get<ServiceType[]>(this.routeUrl);
  }
}