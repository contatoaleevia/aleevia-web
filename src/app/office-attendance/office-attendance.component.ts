import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfficeAttendanceService } from '@app/shared/services/office-attendance.service';
import { OfficeAttendance } from '@shared/models/office-attendance.model';
import { InputComponent } from '@app/shared/components/input/input.component';
import { ButtonComponent } from '@app/shared/components/button/button.component';
import { finalize, BehaviorSubject, map, switchMap, first } from 'rxjs';
import { LoadingService } from '@app/core/services/loading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateComponent } from './create/create.component';
import { DeleteModalComponent, DeleteModalConfig } from '@app/shared/components/delete-modal/delete-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-office-attendance',
  standalone: true,
  imports: [CommonModule, InputComponent, ButtonComponent],
  templateUrl: './office-attendance.component.html',
  styleUrl: './office-attendance.component.scss'
})
export class OfficeAttendanceComponent {
  private readonly loadingService = inject(LoadingService);
  private readonly modalService = inject(NgbModal);
  private readonly officeAttendanceService = inject(OfficeAttendanceService);
  private readonly officeId = localStorage.getItem('officeId') || '{}';

  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  serviceTypes$ = this.officeAttendanceService.officeAttendance$;
  filteredServiceTypes$ = this.searchTerm$.pipe(
    switchMap(searchTerm =>
      this.serviceTypes$.pipe(
        map(services => {
          if (!searchTerm) {
            return services;
          }
          return services.filter(service =>
            service.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      )
    )
  );

  constructor() {

  }

  onSearch(searchTerm: string): void {
    this.searchTermSubject.next(searchTerm);
  }

  onAdd(): void {
    const modalRef = this.modalService.open(CreateComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.result.then(
      (result) => {
        if (result) {
          this.officeAttendanceService.get(this.officeId).subscribe();
        }
      },
      () => { }
    );
  }

  onEdit(id: string): void {
    this.serviceTypes$.pipe(
      first(),
      map(services => services.find(service => service.id === id))
    ).subscribe(service => {
      if (service) {
        const modalRef = this.modalService.open(CreateComponent, {
          size: 'lg',
          centered: true,
          backdrop: 'static'
        });

        modalRef.componentInstance.initialData = { ...service };

        modalRef.result.then(
          (result) => {
            if (result) {
              this.officeAttendanceService.get(this.officeId).subscribe();
            }
          },
          () => { }
        );
      }
    });
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
        this.officeAttendanceService.delete(this.officeId, service.id!).pipe(
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
      }
    );
  }
}
