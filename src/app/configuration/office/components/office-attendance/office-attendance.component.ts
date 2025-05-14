import { Component, inject, OnInit } from '@angular/core';
import { ViewOfficeAttendanceComponent } from '@shared/components/view-office-attendance/view-office-attendance.component';
import { OfficeAttendance } from '@shared/models/office-attendance.model';
import { CommonModule } from '@angular/common';
import { OfficeAttendanceService } from '@app/shared/services/office-attendance.service';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateComponent } from './create/create.component';
import { AlertService } from '@app/shared/services/alert.service';

@Component({
  selector: 'app-office-attendance',
  standalone: true,
  imports: [CommonModule, ViewOfficeAttendanceComponent],
  templateUrl: './office-attendance.component.html',
  styleUrl: './office-attendance.component.scss'
})
export class OfficeAttendanceComponent implements OnInit {
  private readonly officeAttendanceService = inject(OfficeAttendanceService);
  private readonly modalService = inject(NgbModal);
  private readonly alertService = inject(AlertService);
  attendances$: Observable<OfficeAttendance[]> = this.officeAttendanceService.officeAttendanceByOfficeId$;
  officeId: string = '';

  ngOnInit(): void {
    this.officeId = localStorage.getItem('officeId') || '{}';
  }

  editAttendance(attendance: OfficeAttendance): void {
    console.log('Edit attendance:', attendance);

    this.alertService.comingSoon();
  }

  deleteAttendance(attendance: OfficeAttendance): void {
    console.log('Delete attendance:', attendance);

    this.alertService.comingSoon();
  }

  addNewAttendance(): void {
    try {
      const modalRef = this.modalService.open(CreateComponent, {
        size: 'lg',
        centered: true,
        backdrop: 'static'
      });

      modalRef.result.then(
        (result) => {
          console.log('Modal result:', result);
        },
        (reason) => {
          console.log('Modal dismissed:', reason);
        }
      );
    } catch (error) {
      console.error('Error opening modal:', error);

      this.alertService.comingSoon();
    }
  }
}
