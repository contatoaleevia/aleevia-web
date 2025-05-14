import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Office } from '@shared/models/office.model';
import { OfficeService } from '@shared/services/office.service';
import { LoadingService } from '@app/core/services/loading.service';
import { FormHealthspaceSpaceComponent } from '@shared/components/form-healthspace-space/form-healthspace-space.component';
import { finalize } from 'rxjs';
import { AlertService } from '@app/shared/services/alert.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormHealthspaceSpaceComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {
  private readonly activeModal = inject(NgbActiveModal);
  private readonly officeService = inject(OfficeService);
  private readonly loadingService = inject(LoadingService);
  private readonly alertService = inject(AlertService);

  title = 'Criar espaço de atendimento';
  initialData?: Office;

  ngOnInit(): void {
    if (this.initialData) {
      this.title = 'Editar espaço de atendimento';
    }
  }

  onSubmit(formData: Office): void {
    this.loadingService.loadingOn();

    if (this.initialData?.id) {
      formData.id = this.initialData.id;
    }

    this.officeService.createOffice(formData).pipe(
      finalize(() => this.loadingService.loadingOff())
    ).subscribe({
      next: (response) => {
        this.alertService.success({
          title: this.initialData?.id
            ? 'Espaço atualizado com sucesso!'
            : 'Espaço criado com sucesso!'
        });
        this.activeModal.close(true);
      },
      error: (error) => {
        console.error('Error creating/updating healthcare space:', error);
        this.alertService.error({
          title: 'Erro ao salvar o espaço de atendimento'
        });
      }
    });
  }

  close(): void {
    this.activeModal.dismiss();
  }
}
