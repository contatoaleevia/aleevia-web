import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalNewScheduleComponent } from './modal-new-schedule/modal-new-schedule.component';
import { DoctorService } from '@app/shared/services/doctor.service';
import { Address, UpdateAddress } from '@app/shared/models/user.model';
import { Subject, takeUntil, BehaviorSubject, Observable } from 'rxjs';
import { WeekDay } from './models/schedule.model';
import { DeleteModalComponent, DeleteModalConfig } from '@app/shared/components/delete-modal/delete-modal.component';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private addressSubject = new BehaviorSubject<Address | undefined>(undefined);

  selectedService: string = '';
  selectedHealthService: string = '';
  procedureDuration: string = '30 min.';
  appointmentInterval: string = '30 min.';
  address$: Observable<Address | undefined> = this.addressSubject.asObservable();

  weekDays: WeekDay[] = [
    {
      code: 'SEG',
      name: 'Segunda',
      value: 1,
      configs: [
        { start: '08:00', end: '18:00' },
        { start: '19:00', end: '22:00' }
      ]
    },
    {
      code: 'TER',
      name: 'Terça',
      value: 2,
      configs: [
        { start: '08:00', end: '18:00' }
      ]
    },
    {
      code: 'QUA',
      name: 'Quarta',
      value: 3,
      configs: [
        { start: '08:00', end: '18:00' }
      ]
    },
    {
      code: 'QUI',
      name: 'Quinta',
      value: 4,
      configs: [
        { start: '08:00', end: '18:00' }
      ]
    },
    {
      code: 'SEX',
      name: 'Sexta',
      value: 5,
      configs: [
        { start: '08:00', end: '18:00' }
      ]
    },
    { code: 'SAB', name: 'Sábado', value: 6, configs: [] },
    { code: 'DOM', name: 'Domingo', value: 7, configs: [] }
  ];

  healthServices = [
    { id: 1, name: 'Consulta Psicológica' },
    { id: 2, name: 'Avaliação Nutricional' },
    { id: 3, name: 'Fisioterapia' }
  ];

  constructor(
    private modalService: NgbModal,
    private doctorService: DoctorService
  ) { }

  ngOnInit() {
    this.subscribeToAddressChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToAddressChanges() {
    this.doctorService.getAddresses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (addresses: Address[]) => {
          console.log('Addresses updated:', addresses);
          if (addresses && addresses.length > 0) {
            const currentAddress = this.addressSubject.getValue();
            if (!currentAddress || JSON.stringify(currentAddress) !== JSON.stringify(addresses[0])) {
              this.addressSubject.next(addresses[0]);
            }
          } else {
            this.addressSubject.next(undefined);
          }
        },
        error: (error) => {
          console.error('Error loading address:', error);
        }
      });
  }

  configureSchedule(day: WeekDay) {
    if (!day.configs) {
      day.configs = [];
    }
    day.configs.push({ start: '08:00', end: '18:00' });
  }

  addSchedule(day: WeekDay) {
    if (!day.configs) {
      day.configs = [];
    }
    day.configs.push({ start: '08:00', end: '18:00' });
  }

  openNewScheduleModal() {
    const modalRef = this.modalService.open(ModalNewScheduleComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    if (this.addressSubject.getValue()) {
      modalRef.componentInstance.formData = { ...this.addressSubject.getValue() };
    }

    modalRef.result.then(
      (result) => {
        if (result) {
          this.addressSubject.next(result);
        }
      }
    );
  }

  openDeleteModal(address: UpdateAddress) {
    console.log(address);
    const modalConfig: DeleteModalConfig = {
      title: 'Excluir Endereço',
      message: 'Deseja excluir este endereço?',
      showPreview: true,
      previewTitle: 'Endereço a ser excluído',
      previewContent: {
        address: this.getFormattedAddress()
      },
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    };

    const modalRef = this.modalService.open(DeleteModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.config = modalConfig;

    modalRef.result.then(
      () => {
        if (address.id) {
          this.doctorService.deleteAddress(address.id).subscribe({
            next: () => {
              this.addressSubject.next(undefined);
              this.subscribeToAddressChanges();
            },
            error: (error) => {
              console.error('Error deleting address:', error);
            }
          });
        }
      },
      () => {
        // Handle cancellation
      }
    );
  }

  getFormattedAddress(): string {
    const address = this.addressSubject.getValue();
    if (!address) return '';
    
    const parts = [
      address.name,
      `${address.address}, ${address.number}`,
      address.complement,
      address.neighborhood,
      `${address.city} - ${address.state}`
    ];

    return parts
      .filter(part => part && part.trim() !== '')
      .join(', ');
  }
}
