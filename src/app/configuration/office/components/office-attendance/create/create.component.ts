import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OfficeAttendance } from '@shared/models/office-attendance.model';
import { FormOfficeAttendanceComponent } from '@shared/components/form-office-attendance/form-office-attendance.component';
import { OfficeAttendanceService } from '@app/shared/services/office-attendance.service';
import { LoadingService } from '@app/core/services/loading.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormOfficeAttendanceComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {
  private readonly activeModal = inject(NgbActiveModal);
  private readonly officeAttendanceService = inject(OfficeAttendanceService);
  private readonly loadingService = inject(LoadingService);

  @Input() initialData: Partial<OfficeAttendance> = {};

  title = 'Adicionar Serviço';
  isEditMode = false;
  officeId = '';

  ngOnInit(): void {
    this.officeId = localStorage.getItem('officeId') || '';
    this.isEditMode = !!this.initialData?.id;

    if (this.isEditMode) {
      this.title = 'Editar Serviço';
    }
  }

  onSubmit(data: OfficeAttendance): void {
    this.loadingService.loadingOn();

    const service = {
      ...this.initialData,
      ...data,
      officeId: this.officeId
    };

    this.officeAttendanceService.create(service)
      .pipe(finalize(() => this.loadingService.loadingOff()))
      .subscribe({
        next: () => {
          this.activeModal.close(true);
        },
        error: (error) => {
          console.error('Error creating service:', error);
        }
      });
  }

  close(): void {
    this.activeModal.dismiss();
  }
}
