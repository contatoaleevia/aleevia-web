import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormOfficeAttendanceComponent } from '@app/shared/components/form-office-attendance/form-office-attendance.component';
import { OfficeAttendance } from '@app/shared/models/office-attendance.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { OfficeAttendanceService } from '@app/shared/services/office-attendance.service';
import { LoadingService } from '@app/core/services/loading.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormOfficeAttendanceComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {
  private readonly activeModal = inject(NgbActiveModal);
  private readonly router = inject(Router);
  private readonly officeAttendanceService = inject(OfficeAttendanceService);
  private readonly loadingService = inject(LoadingService);

  initialData: OfficeAttendance = {
    title: '',
    price: 0,
    description: '',
    serviceTypeId: '',
    duration: '',
  };

  isEditMode = false;
  title = 'Criar novo serviço';

  ngOnInit(): void {
    if (this.initialData.id) {
      console.log('initialData', this.initialData);
      this.isEditMode = true;
      this.title = 'Editar serviço';
    }
  }

  onSubmit(data: OfficeAttendance): void {
    this.loadingService.loadingOn();

    const officeId = localStorage.getItem('officeId') || '';
    console.log('data', data);
    const service = {
      id: this.initialData.id,
      ...data,
      officeId
    };

    if (this.isEditMode) {
      console.log('service', data);
      this.officeAttendanceService.update(service.id!, service)
        .pipe(finalize(() => this.loadingService.loadingOff()))
        .subscribe({
          next: () => {
            if (this.activeModal) {
              this.activeModal.close(true);
            } else {
              this.router.navigate(['/office-attendance']);
            }
          },
          error: (error: any) => {
            console.error('Error updating service:', error);
          }
        });
    } else {
      this.officeAttendanceService.create(service)
        .pipe(finalize(() => this.loadingService.loadingOff()))
        .subscribe({
          next: () => {
            if (this.activeModal) {
              this.activeModal.close(true);
            } else {
              this.router.navigate(['/office-attendance']);
            }
          },
          error: (error: any) => {
            console.error('Error creating service:', error);
          }
        });
    }
  }

  close(): void {
    if (this.activeModal) {
      this.activeModal.dismiss();
    } else {
      this.router.navigate(['/office-attendance']);
    }
  }
}
