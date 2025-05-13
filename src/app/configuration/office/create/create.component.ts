import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Office } from '@shared/models/office.model';
import { OfficeService } from '@shared/services/office.service';
import { LoadingService } from '@app/core/services/loading.service';
import { FormHealthspaceSpaceComponent } from '@shared/components/form-healthspace-space/form-healthspace-space.component';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

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
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: this.initialData?.id
            ? 'Espaço atualizado com sucesso!'
            : 'Espaço criado com sucesso!',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          background: '#22c55e',
          color: '#fff',
          iconColor: '#fff',
          customClass: {
            popup: 'swal2-toast-green'
          }
        });
        this.activeModal.close(true);
      },
      error: (error) => {
        console.error('Error creating/updating healthcare space:', error);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao salvar o espaço de atendimento',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          background: '#ef4444',
          color: '#fff',
          iconColor: '#fff',
          customClass: {
            popup: 'swal2-toast-red'
          }
        });
      }
    });
  }

  close(): void {
    this.activeModal.dismiss();
  }
}
