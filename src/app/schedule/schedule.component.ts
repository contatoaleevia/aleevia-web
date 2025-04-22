import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalNewScheduleComponent } from './modal-new-schedule/modal-new-schedule.component';
import { DoctorService } from '@app/shared/services/doctor.service';
import { Address } from '@app/shared/models/user.model';
import { Subject, takeUntil } from 'rxjs';
import { WeekDay } from './models/schedule.model';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  selectedService: string = '';
  selectedHealthService: string = '';
  procedureDuration: string = '30 min.';
  appointmentInterval: string = '30 min.';
  address?: Address;

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
          if (addresses && addresses.length > 0) {
            this.address = addresses[0];
          } else {
            this.address = undefined;
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

    if (this.address) {
      modalRef.componentInstance.formData = { ...this.address };
    }
  }

  getFormattedAddress(): string {
    if (!this.address) return '';
    return `${this.address.address}, ${this.address.number}${this.address.complement ? ` - ${this.address.complement}` : ''}, ${this.address.neighborhood}, ${this.address.city} - ${this.address.state}`;
  }
}
