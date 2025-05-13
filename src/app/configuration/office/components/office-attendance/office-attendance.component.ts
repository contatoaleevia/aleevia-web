import { Component, inject, OnInit } from '@angular/core';
import { ViewOfficeAttendanceComponent } from '@shared/components/view-office-attendance/view-office-attendance.component';
import { OfficeAttendance } from '@shared/models/office-attendance.model';
import { CommonModule } from '@angular/common';
import { OfficeAttendanceService } from '@app/shared/services/office-attendance.service';
import { LoadingService } from '@app/core/services/loading.service';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-office-attendance',
  standalone: true,
  imports: [CommonModule, ViewOfficeAttendanceComponent],
  templateUrl: './office-attendance.component.html',
  styleUrl: './office-attendance.component.scss'
})
export class OfficeAttendanceComponent implements OnInit {
  private readonly officeAttendanceService = inject(OfficeAttendanceService);
  private readonly loadingService = inject(LoadingService);
  attendances: OfficeAttendance[] = [];
  officeId: string = '';

  ngOnInit(): void {
    this.officeId = localStorage.getItem('officeId') || '{}';
    this.loadAttendances();
  }

  loadAttendances(): void {
    this.loadingService.loadingOn();
    console.log('this.officeId', this.officeId);
    if (this.officeId) {
      this.officeAttendanceService.get(this.officeId).pipe(finalize(() => this.loadingService.loadingOff())).subscribe({
        next: (attendances) => {
          this.attendances = attendances;
        },
        error: (error) => {
          console.error('Error loading attendances:', error);
        }
      });
    }
  }

  editAttendance(attendance: OfficeAttendance): void {
    console.log('Edit attendance:', attendance);
  }

  deleteAttendance(attendance: OfficeAttendance): void {
    console.log('Delete attendance:', attendance);
  }
}
