import { Component, OnInit } from '@angular/core';
import { ViewOfficeAttendanceComponent } from '@shared/components/view-office-attendance/view-office-attendance.component';
import { OfficeAttendance } from '@shared/models/office-attendance.model';
import { CommonModule } from '@angular/common';
import { OfficeAttendanceService } from '@app/shared/services/office-attendance.service';

@Component({
  selector: 'app-office-attendance',
  standalone: true,
  imports: [CommonModule, ViewOfficeAttendanceComponent],
  templateUrl: './office-attendance.component.html',
  styleUrl: './office-attendance.component.scss'
})
export class OfficeAttendanceComponent implements OnInit {
  attendances: OfficeAttendance[] = [];
  officeId: string = '';

  constructor(private officeAttendanceService: OfficeAttendanceService) {}

  ngOnInit(): void {
    this.officeId = JSON.parse(localStorage.getItem('officeId') || '{}');
    this.loadAttendances();
  }

  loadAttendances(): void {
    if (this.officeId) {
      this.officeAttendanceService.get(this.officeId).subscribe({
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
