import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OfficeAttendanceService } from '@app/shared/services/office-attendance.service';
import { OfficeAttendance } from '@shared/models/office-attendance.model';
import { InputComponent } from '@app/shared/components/input/input.component';
import { ButtonComponent } from '@app/shared/components/button/button.component';
import { tap, catchError, of, finalize } from 'rxjs';
import { LoadingService } from '@app/core/services/loading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { DeleteModalComponent, DeleteModalConfig } from '@app/shared/components/delete-modal/delete-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-office-attendance',
  standalone: true,
  imports: [CommonModule, DatePipe, InputComponent, ButtonComponent],
  templateUrl: './office-attendance.component.html',
  styleUrl: './office-attendance.component.scss'
})
export class OfficeAttendanceComponent implements OnInit {
  private readonly loadingService = inject(LoadingService);
  private readonly modalService = inject(NgbModal);
  private readonly router = inject(Router);

  serviceTypes: OfficeAttendance[] = [];
  filteredServiceTypes: OfficeAttendance[] = [];

  constructor(private officeAttendanceService: OfficeAttendanceService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loadingService.loadingOn();
    const officeID = localStorage.getItem('officeId') || '{}';
    this.officeAttendanceService.get(officeID).pipe(
      tap(data => {
        console.log('data', data);
        this.serviceTypes = data;
        this.filteredServiceTypes = [...data];
      }),
      catchError(error => {
        console.error('Error loading services:', error);
        return of([]);
      }),
      finalize(() => {
        this.loadingService.loadingOff();
      })
    ).subscribe();
  }

  onSearch(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredServiceTypes = [...this.serviceTypes];
      return;
    }

    this.filteredServiceTypes = this.serviceTypes.filter(service =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  onAdd(): void {
    const modalRef = this.modalService.open(CreateComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.result.then(
      (result) => {
        console.log('result', result);
        if (result) {
          this.loadData();
        }
      },
      () => { }
    );
  }

  onEdit(id: string): void {
    const serviceToEdit = this.serviceTypes.find(service => service.id === id);

    if (serviceToEdit) {
      const modalRef = this.modalService.open(CreateComponent, {
        size: 'lg',
        centered: true,
        backdrop: 'static'
      });

      modalRef.componentInstance.initialData = { ...serviceToEdit };

      modalRef.result.then(
        (result) => {
          if (result) {
            this.loadData();
          }
        },
        () => { }
      );
    }
  }

  openDeleteModal(service: OfficeAttendance): void {
    const modalConfig: DeleteModalConfig = {
      title: 'Excluir Serviço',
      message: 'Tem certeza que deseja excluir este serviço?',
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
        const officeID = localStorage.getItem('officeId') || '{}';

        this.officeAttendanceService.delete(officeID, service.id!).pipe(
          tap(() => {
            console.log('Service deleted successfully');
            this.loadData();
          }),
          catchError(error => {
            console.error('Error deleting service:', error);
            return of(null);
          }),
          finalize(() => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Serviço excluído com sucesso!',
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
        ).subscribe();
      },
      () => {

        console.log('Deletion cancelled');
      }
    );
  }
}
