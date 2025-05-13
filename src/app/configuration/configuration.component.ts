import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../shared/components/button/button.component';
import { OfficeService } from '@shared/services/office.service';
import { Office, OfficeResponse } from '@app/shared/models/office.model';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { LoadingService } from '@app/core/services/loading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateComponent } from './office/create/create.component';
import { DeleteModalComponent, DeleteModalConfig } from '@app/shared/components/delete-modal/delete-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  private readonly officeService = inject(OfficeService);
  private readonly router = inject(Router);
  private officeId = localStorage.getItem('officeId') || '{}';
  private readonly loadingService = inject(LoadingService);
  private readonly modalService = inject(NgbModal);

  offices: Office[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loadingService.loadingOn();
    this.officeService.getMyOffices().pipe(
      finalize(() => this.loadingService.loadingOff())
    ).subscribe({
      next: (response: OfficeResponse[]) => {
        this.offices = response.map(item => item.office);
      },
      error: (error: any) => {
        console.error('Error fetching offices:', error);
      }
    });
  }

  navigateToOffice(id ?: string) {
    this.router.navigate(['/configuration/office', id || this.officeId]);
  }

  createNewSpace(): void {
    const modalRef = this.modalService.open(CreateComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.result.then(
      (result) => {
        if (result) {
          this.loadData();
        }
      },
      () => { }
    );
  }

  editOffice(event: Event, office: Office): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Em breve!',
      text: 'Esta funcionalidade estará disponível em breve.',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: '#3b82f6',
      color: '#fff',
      iconColor: '#fff',
      customClass: {
        popup: 'swal2-toast-blue'
      }
    });
    // event.stopPropagation();

    // const modalRef = this.modalService.open(CreateComponent, {
    //   size: 'lg',
    //   centered: true,
    //   backdrop: 'static'
    // });

    // modalRef.componentInstance.initialData = { ...office };

    // modalRef.result.then(
    //   (result) => {
    //     if (result) {
    //       this.loadData();
    //     }
    //   },
    //   () => { }
    // );
  }
  deleteOffice(event: Event, office: Office): void {
    event.stopPropagation();

    // Show coming soon message
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Em breve!',
      text: 'Esta funcionalidade estará disponível em breve.',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: '#3b82f6',
      color: '#fff',
      iconColor: '#fff',
      customClass: {
        popup: 'swal2-toast-blue'
      }
    });

    // Commented out delete functionality
    /*
    const modalConfig: DeleteModalConfig = {
      title: 'Excluir Espaço de Atendimento',
      message: `Tem certeza que deseja excluir o espaço "${office.name}"?`,
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

        this.officeService.deleteOffice(office.id!).pipe(
          finalize(() => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Espaço excluído com sucesso!',
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
            this.loadingService.loadingOff();
          })
        ).subscribe({
          next: () => {
            this.loadData();
          },
          error: (error) => {
            console.error('Error deleting office:', error);
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'Erro ao excluir o espaço',
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
      },
      () => {
        console.log('Deletion cancelled');
      }
    );
    */
  }
}
