import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { RegistrationContextService } from '@auth/base/register/registration-context.service';
import { inject } from '@angular/core';
import { LoadingService } from '@app/core/services/loading.service';
import { OfficeAttendanceService } from '@app/shared/services/office-attendance.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OfficeAttendance } from '@app/shared/models/office-attendance.model';
import { FormOfficeAttendanceComponent } from '@shared/components/form-office-attendance/form-office-attendance.component';
import { FormProfessionalComponent, Professional } from '@shared/components/form-professional/form-professional.component';
import { ServiceType } from '@app/shared/models/service-type.model';
import { OfficeService } from '@app/shared/services/office.service';
import { AlertService } from '@app/shared/services/alert.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormOfficeAttendanceComponent,
    FormProfessionalComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly registrationContext = inject(RegistrationContextService);
  private readonly loadingService = inject(LoadingService);
  private readonly officeAttendanceService = inject(OfficeAttendanceService);
  private readonly officeService = inject(OfficeService);
  private readonly alertService = inject(AlertService);


  context: 'services' | 'professionals' = 'services';
  serviceTypes: ServiceType[] = [];
  serviceForm!: FormGroup;
  professionalForm!: FormGroup;
  officeId: string = '';

  ngOnInit(): void {
    this.detectContext();
    this.loadOfficeId();
  }

  private detectContext() {
    const url = this.route.snapshot.pathFromRoot
      .map(r => r.routeConfig?.path)
      .filter(Boolean)
      .join('/');
    this.context = url.includes('add-professional') ? 'professionals' : 'services';
  }

  private loadOfficeId() {
    const storedOfficeId = localStorage.getItem('officeId');
    if (storedOfficeId) {
      this.officeId = storedOfficeId;
    }
  }

  handleServiceFormSubmit(officeAttendance: OfficeAttendance) {
    this.loadingService.loadingOn();
    this.officeAttendanceService.create(officeAttendance).subscribe({
      next: () => {
        this.loadingService.loadingOff();
        this.handleSuccess();
      },
      error: (err) => {
        this.loadingService.loadingOff();
        this.alertService.error({
          title: 'Erro ao salvar serviço',
          text: err?.error?.message || 'Tente novamente mais tarde.'
        });
      }
    });
  }

  handleProfessionalFormSubmit(professional: Professional) {
    this.loadingService.loadingOn();

    const professionalPayload = {
      cpf: professional.cpf,
      name: professional.name,
      email: professional.email,
      isPublic: professional.isPublic,
      isActive: true
    };

    const payload = {
      officeId: this.officeId,
      professional: professionalPayload
    };

    this.officeService.bindProfessional(payload).subscribe({
      next: () => {
        this.loadingService.loadingOff();
        this.handleSuccess();
      },
      error: (err) => {
        this.loadingService.loadingOff();
        this.alertService.error({
          title: 'Erro ao salvar profissional',
          text: err?.error?.message || 'Tente novamente mais tarde.'
        });
      }
    });
  }

  handleSuccess() {
    this.alertService.success({
      title: this.context === 'services' ? 'Serviço salvo com sucesso!' : 'Profissional salvo com sucesso!'
    });

    if (this.context === 'services') {
      this.router.navigate([`/auth/register/step/service-professional/services`]);
    } else {
      this.router.navigate([`/auth/register/step/service-professional/professionals`]);
    }
  }
}
