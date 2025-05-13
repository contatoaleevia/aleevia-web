import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { OfficeAttendanceService } from "@app/shared/services/office-attendance.service";
import { map } from "rxjs/operators";

export const officeAttendanceResolver: ResolveFn<any> = () => {
  const officeId = localStorage.getItem('officeId') || '{}';
  const officeAttendanceService = inject(OfficeAttendanceService);

  return officeAttendanceService.getByOfficeId(officeId).pipe(
    map((officeAttendance) => {
      return officeAttendance;
    })
  );
}