import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormProfessionalComponent, Professional } from '@app/shared/components/form-professional/form-professional.component';
import { OfficeService } from '@shared/services/office.service';
import { LoadingService } from '@app/core/services/loading.service';
import { finalize } from 'rxjs';
import { AlertService } from '@app/shared/services/alert.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormProfessionalComponent, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  private readonly activeModal = inject(NgbActiveModal);
  private readonly officeService = inject(OfficeService);
  private readonly loadingService = inject(LoadingService);
  private readonly alertService = inject(AlertService);

  title = 'Adicionar Profissional';
  initialData?: Professional;
  officeId: string = '';

  ngOnInit(): void {
    this.officeId = localStorage.getItem('officeId') || '';

    if (this.initialData) {
      this.title = 'Editar Profissional';
    }
  }

  onSubmit(formData: Professional): void {
    this.loadingService.loadingOn();

    const payload = {
      officeId: this.officeId,
      professional: formData
    };

    this.officeService.bindProfessional(payload).pipe(
      finalize(() => this.loadingService.loadingOff())
    ).subscribe({
      next: () => {
        this.alertService.success({
          title: this.initialData?.id
            ? 'Profissional atualizado com sucesso!'
            : 'Profissional adicionado com sucesso!'
        });
        this.activeModal.close(true);
      },
      error: (error) => {
        console.error('Error creating/updating professional:', error);
        this.alertService.error({
          title: 'Erro ao salvar o profissional'
        });
        this.activeModal.close(false);
      }
    });
  }

  close(): void {
    this.activeModal.dismiss();
  }
}
