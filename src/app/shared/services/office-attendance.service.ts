import { inject, Injectable } from "@angular/core";
import { ApiService } from "@app/core/services/api.service";
import { OfficeAttendance } from "../models/office-attendance.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OfficeAttendanceService {
  private readonly apiService = inject(ApiService);

  private readonly routeUrl = 'office-attendance';

  create(officeAttendance: OfficeAttendance): Observable<OfficeAttendance> {
    return this.apiService.post(this.routeUrl, officeAttendance);
  }

  get(officeID: string): Observable<OfficeAttendance[]> {
    return this.apiService.get(`${this.routeUrl}/office/${officeID}`);
  }
}