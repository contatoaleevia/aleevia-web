import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { RegistrationContextService } from '@auth/base/register/registration-context.service';
import { RegistrationType } from '@auth/base/register/constants/registration-types';
import { ServiceTypeService } from '@shared/services/service-type.service';
import { inject } from '@angular/core';
import { ServiceType } from '@shared/models/service-type.model';
import { LoadingService } from '@app/core/services/loading.service';
import { OfficeAttendanceService } from '@app/shared/services/office-attendance.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OfficeAttendance } from '@app/shared/models/office-attendance.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [InputComponent, ButtonComponent, NgIf, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly registrationContext = inject(RegistrationContextService);
  private readonly loadingService = inject(LoadingService);
  private readonly officeAttendanceService = inject(OfficeAttendanceService);
  private readonly serviceTypeService = inject(ServiceTypeService);
  private readonly fb = inject(FormBuilder);

  context: 'services' | 'professionals' = 'services';
  serviceTypes: ServiceType[] = [];

  serviceForm!: FormGroup;
  professionalForm!: FormGroup;

  ngOnInit(): void {
    this.detectContext();
    if(this.context === 'services') {
      this.initServiceForm();
    } else {
      this.initProfessionalForm();
    }
  }

  private detectContext() {
    const url = this.route.snapshot.pathFromRoot
      .map(r => r.routeConfig?.path)
      .filter(Boolean)
      .join('/');
    this.context = url.includes('add-professional') ? 'professionals' : 'services';
  }

  private initServiceForm() {
    this.serviceTypeService.getServiceTypes().subscribe((serviceTypes: ServiceType[]) => {
      this.serviceTypes = serviceTypes;
    });
    this.serviceForm = this.fb.group({
      serviceType: [null, Validators.required],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      duration: ['', [Validators.required, Validators.pattern(/^\d{2}:\d{2}$/)]],
      value: ['', [Validators.required, Validators.pattern(/^\d+(,\\d{2})?$/)]],
      description: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  private initProfessionalForm() {
    this.professionalForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      cpf: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      hasSchedule: [null, Validators.required],
      workplace: [null, Validators.required]
    });
  }

  get f() {
    return this.context === 'services'
      ? this.serviceForm.controls
      : this.professionalForm.controls;
  }

  save() {
    if (this.context === 'services') {
      this.saveService();
    } else {
      this.saveProfessional();
    }
  }

  private saveService() {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }
    this.loadingService.loadingOn();
    const officeId = localStorage.getItem('officeId')?.replace(/"/g, '');
    const formValue = this.serviceForm.value;
    const officeAttendance: OfficeAttendance = {
      officeId: officeId ?? '',
      serviceTypeId: formValue.serviceType,
      title: formValue.name,
      description: formValue.description,
      price: Number((formValue.value || '').replace(',', '.'))
    };
    this.officeAttendanceService.create(officeAttendance).subscribe({
      next: () => {
        this.loadingService.loadingOff();
        this.handleSuccess();
      },
      error: (err) => {
        this.loadingService.loadingOff();
        Swal.fire({
          icon: 'error',
          title: 'Erro ao salvar serviço',
          text: err?.error?.message || 'Tente novamente mais tarde.'
        });
      }
    });
  }

  private saveProfessional() {
    this.loadingService.loadingOn();

    localStorage.setItem('professionalData', JSON.stringify([this.professionalForm.value]));
    if (this.professionalForm.invalid) {
      this.professionalForm.markAllAsTouched();
      return;
    }
    this.loadingService.loadingOff();
    this.handleSuccess();
  }

  handleSuccess() {
    const registrationType: RegistrationType = this.registrationContext.getContext();
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: this.context === 'services' ? 'Serviço salvo com sucesso!' : 'Profissional salvo com sucesso!',
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

    if (this.context === 'services') {
      this.router.navigate([`/auth/register/${registrationType}/service-professional/services`]);
    } else {
      this.router.navigate([`/auth/register/${registrationType}/service-professional/professionals`]);
    }
  }
}
