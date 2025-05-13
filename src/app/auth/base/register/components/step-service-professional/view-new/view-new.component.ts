import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { RegistrationContextService } from '@auth/base/register/registration-context.service';
import { RegistrationType } from '@auth/base/register/constants/registration-types';
import { OfficeAttendance } from '@app/shared/models/office-attendance.model';
import { ViewOfficeAttendanceComponent } from '@shared/components/view-office-attendance/view-office-attendance.component';
import { ViewProfessionalComponent } from '@shared/components/view-professional/view-professional.component';
import { LoadingService } from '@app/core/services/loading.service';
import { OfficeAttendanceService } from '@app/shared/services/office-attendance.service';
import { OfficeService } from '@app/shared/services/office.service';
import { OfficeProfessional } from '@app/shared/models/office.model';
@Component({
  selector: 'app-view-new',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent,
    ViewOfficeAttendanceComponent,
    ViewProfessionalComponent
  ],
  templateUrl: './view-new.component.html',
  styleUrl: './view-new.component.scss'
})
export class ViewNewComponent implements OnInit {
  private readonly loadingService = inject(LoadingService);
  private readonly officeAttendanceService = inject(OfficeAttendanceService);
  private readonly officeService = inject(OfficeService);
  private readonly registrationContext = inject(RegistrationContextService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  registrationType: RegistrationType = this.registrationContext.getContext();
  context: 'service' | 'professional' = 'service';
  services: OfficeAttendance[] = [];
  professionals: OfficeProfessional[] = [];
  showServiceForm = false;
  editingService: OfficeAttendance | null = null;
  editingProfessional: OfficeProfessional | null = null;
  keyword: string = '';
  officeID: string = localStorage.getItem('officeId') || '{}';

  ngOnInit(): void {
    this.getKeywords();
  }

  getKeywords() {
    const url = this.route.snapshot.url.map(segment => segment.path).join('/');
    if (url.includes('professionals')) {
      this.context = 'professional';
      this.keyword = 'profissionais';
    } else {
      this.context = 'service';
      this.keyword = 'serviços';
      this.getServices();
    }

    if (this.context === 'professional') {
      this.professionals = JSON.parse(localStorage.getItem('professionalData') || '[]');
      this.getProfessionals();
    }
  }

  getServices() {
    this.loadingService.loadingOn();
    this.officeAttendanceService.get(this.officeID).subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (error: any) => {
        console.error('Error saving office data:', error);
        this.loadingService.loadingOff();
      },
      complete: () => {
        this.loadingService.loadingOff();
      }
    });
  }

  getProfessionals() {
    this.officeService.getProfessionals(this.officeID).subscribe({
      next: (professionals: any) => {
        this.professionals = professionals.professionals;
      },
      error: (error: any) => {
        console.error('Error saving office data:', error);
      }
    });
  }

  addNewService() {
    this.router.navigate([`/auth/register/step/service-professional/add-service`]);
  }

  addNewProfessional() {
    this.router.navigate([`/auth/register/step/service-professional/add-professional`]);
  }

  deleteService(id: string) {
    this.services = this.services.filter(s => s.id !== id);
  }

  editService(service: OfficeAttendance) {
    this.editingService = service;
    console.log('Editing service:', service);
  }

  editProfessional(professional: OfficeProfessional) {
    this.editingProfessional = professional;
    console.log('Editing professional:', professional);
  }

  deleteProfessional(id: string) {
    this.professionals = this.professionals.filter(p => p.id !== id);
  }

  goToNextStep() {
    if (this.context === 'service') {
      this.router.navigate([`/auth/register/step/service-professional/professionals`]);
    } else {
      this.router.navigate([`/auth/register/step/congratulations`]);
    }
  }
}
