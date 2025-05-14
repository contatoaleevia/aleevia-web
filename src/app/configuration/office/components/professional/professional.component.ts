import { Component, inject, Input, OnInit, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewProfessionalComponent } from '@shared/components/view-professional/view-professional.component';
import { LoadingService } from '@app/core/services/loading.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { Office, OfficeProfessional } from '@app/shared/models/office.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateComponent } from './create/create.component';
import { DeleteModalComponent, DeleteModalConfig } from '@app/shared/components/delete-modal/delete-modal.component';
import { AlertService } from '@app/shared/services/alert.service';
import { OfficeService } from '@app/shared/services/office.service';
import { ProfessionalService } from '@app/shared/services/professional.service';

@Component({
  selector: 'app-professional',
  standalone: true,
  imports: [CommonModule, ViewProfessionalComponent],
  templateUrl: './professional.component.html',
  styleUrl: './professional.component.scss'
})
export class ProfessionalComponent implements OnInit {
  private readonly loadingService = inject(LoadingService);
  private readonly modalService = inject(NgbModal);
  private readonly officeService = inject(OfficeService);
  private readonly professionalService = inject(ProfessionalService);
  private readonly alertService = inject(AlertService);
  private destroy$ = new Subject<void>();

  @Input() office: Office = {} as Office;
  professionals: OfficeProfessional[] = [];
  officeId: string = '';

  ngOnInit(): void {
    this.officeId = localStorage.getItem('officeId') || '';
    this.loadProfessionals();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProfessionals(): void {
    if (this.office && this.office.professionals) {
      this.refreshProfessionalsFromServer();
    } else if (this.officeId) {
      this.refreshProfessionalsFromServer();
    }
  }

  refreshProfessionalsFromServer(): void {
    this.loadingService.loadingOn();
    this.officeService.getProfessionals(this.officeId).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loadingService.loadingOff())
    ).subscribe({
      next: (professionals: OfficeProfessional[]) => {
        this.professionals = professionals;
      },
      error: (error) => {
        console.error('Error loading professionals:', error);
        this.professionals = [];
      }
    });
  }

  addNewProfessional(): void {
    try {
      console.log('Opening professional modal');
      const modalRef = this.modalService.open(CreateComponent, {
        size: 'lg',
        centered: true,
        backdrop: 'static'
      });

      modalRef.result.then(
        (result) => {
          console.log('Modal result:', result);
          if (result) {
            this.officeService.clearCache();
            this.professionalService.clearCache();
            this.refreshProfessionalsFromServer();
          }
        },
        (reason) => {
          console.log('Modal dismissed:', reason);
        }
      );
    } catch (error) {
      console.error('Error opening modal:', error);
    }
  }

  editProfessional(professional: OfficeProfessional): void {
    try {
      console.log('Editing professional:', professional);
      const modalRef = this.modalService.open(CreateComponent, {
        size: 'lg',
        centered: true,
        backdrop: 'static'
      });

      modalRef.componentInstance.initialData = {
        name: professional.professional?.name || '',
        email: professional.professional?.email || '',
        cpf: professional.professional?.cpf || '',
        isPublic: professional.isPublic
      };

      modalRef.result.then(
        (result) => {
          console.log('Edit modal result:', result);
          if (result) {
            this.officeService.clearCache();
            this.professionalService.clearCache();
            this.refreshProfessionalsFromServer();
          }
        },
        (reason) => {
          console.log('Edit modal dismissed:', reason);
        }
      );
    } catch (error) {
      console.error('Error opening edit modal:', error);
    }
  }

  deleteProfessional(professional: OfficeProfessional): void {
    if (!professional.professional) {
      return;
    }

    const modalConfig: DeleteModalConfig = {
      title: 'Excluir Profissional',
      message: `Tem certeza que deseja remover "${professional.professional.name}" do seu espaço?`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
    };

    const modalRef = this.modalService.open(DeleteModalComponent, {
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.config = modalConfig;

    modalRef.result.then(
      () => {
        this.loadingService.loadingOn();
        this.alertService.comingSoon();
        this.loadingService.loadingOff();
      },
      () => {
        console.log('Deletion cancelled');
      }
    );
  }
}
