import { inject, Injectable } from "@angular/core";
import { ApiService } from "@app/core/services/api.service";
import { OfficeAttendance } from "../models/office-attendance.model";
import { BehaviorSubject, Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class OfficeAttendanceService {
  private readonly apiService = inject(ApiService);
  private readonly routeUrl = 'office-attendance';

  private officeAttendanceSubject = new BehaviorSubject<OfficeAttendance[]>([]);
  officeAttendance$ = this.officeAttendanceSubject.asObservable();

  private officeAttendanceByIdSubject = new BehaviorSubject<Map<string, OfficeAttendance>>(new Map());
  officeAttendanceById$ = this.officeAttendanceByIdSubject.asObservable();

  get(officeID: string): Observable<OfficeAttendance[]> {
    const currentData = this.officeAttendanceSubject.getValue();
    if (currentData.length > 0) {
      return of(currentData);
    }

    return this.apiService.get<OfficeAttendance[]>(`${this.routeUrl}/office/${officeID}`).pipe(
      tap(attendances => {
        this.officeAttendanceSubject.next(attendances);
        const currentMap = this.officeAttendanceByIdSubject.getValue();
        attendances.forEach(attendance => {
          if (attendance.id) {
            currentMap.set(attendance.id, attendance);
          }
        });
        this.officeAttendanceByIdSubject.next(currentMap);
      })
    );
  }

  getById(id: string): Observable<OfficeAttendance> {
    const cachedAttendance = this.officeAttendanceByIdSubject.getValue().get(id);
    if (cachedAttendance) {
      return of(cachedAttendance);
    }

    return this.apiService.get<OfficeAttendance>(`${this.routeUrl}/office/${id}`).pipe(
      tap(attendance => {
        if (attendance.id) {
          const currentMap = this.officeAttendanceByIdSubject.getValue();
          currentMap.set(attendance.id, attendance);
          this.officeAttendanceByIdSubject.next(currentMap);
        }
      })
    );
  }

  create(officeAttendance: OfficeAttendance): Observable<OfficeAttendance> {
    return this.apiService.post<OfficeAttendance>(this.routeUrl, officeAttendance).pipe(
      tap(newAttendance => {
        const currentAttendances = this.officeAttendanceSubject.getValue();
        this.officeAttendanceSubject.next([...currentAttendances, newAttendance]);

        if (newAttendance.id) {
          const currentMap = this.officeAttendanceByIdSubject.getValue();
          currentMap.set(newAttendance.id, newAttendance);
          this.officeAttendanceByIdSubject.next(currentMap);
        }
      })
    );
  }

  update(id: string, officeAttendance: OfficeAttendance): Observable<OfficeAttendance> {
    return this.apiService.patch<OfficeAttendance>(`${this.routeUrl}/${id}`, officeAttendance).pipe(
      tap(updatedAttendance => {
        const currentAttendances = this.officeAttendanceSubject.getValue();
        const updatedAttendances = currentAttendances.map(item =>
          item.id === id ? updatedAttendance : item
        );
        this.officeAttendanceSubject.next(updatedAttendances);

        if (updatedAttendance.id) {
          const currentMap = this.officeAttendanceByIdSubject.getValue();
          currentMap.set(updatedAttendance.id, updatedAttendance);
          this.officeAttendanceByIdSubject.next(currentMap);
        }
      })
    );
  }

  delete(officeID: string, id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.routeUrl}/${id}`).pipe(
      tap(() => {
        const currentAttendances = this.officeAttendanceSubject.getValue();
        this.officeAttendanceSubject.next(currentAttendances.filter(item => item.id !== id));

        const currentMap = this.officeAttendanceByIdSubject.getValue();
        currentMap.delete(id);
        this.officeAttendanceByIdSubject.next(currentMap);
      })
    );
  }

  clearCache(): void {
    this.officeAttendanceSubject.next([]);
    this.officeAttendanceByIdSubject.next(new Map());
  }
}
