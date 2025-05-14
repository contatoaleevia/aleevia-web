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
import { BehaviorSubject, Observable, finalize, map, switchMap } from 'rxjs';

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

  private contextSubject = new BehaviorSubject<'service' | 'professional'>('service');
  context$ = this.contextSubject.asObservable();

  private servicesSubject = new BehaviorSubject<OfficeAttendance[]>([]);
  services$ = this.servicesSubject.asObservable();

  private professionalsSubject = new BehaviorSubject<OfficeProfessional[]>([]);
  professionals$ = this.professionalsSubject.asObservable();

  registrationType: RegistrationType = this.registrationContext.getContext();
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
      this.contextSubject.next('professional');
      this.keyword = 'profissionais';
    } else {
      this.contextSubject.next('service');
      this.keyword = 'serviços';
      this.services$ = this.officeAttendanceService.officeAttendanceByOfficeId$
    }

    this.context$.subscribe(context => {
      if (context === 'professional') {
        const storedProfessionals = JSON.parse(localStorage.getItem('professionalData') || '[]');
        this.professionalsSubject.next(storedProfessionals);
        this.getProfessionals();
      }
    });
  }


  getProfessionals() {
    this.officeService.getProfessionals(this.officeID)
      .subscribe({
        next: (professionals: OfficeProfessional[]) => {
          this.professionalsSubject.next(professionals);
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
    const currentServices = this.servicesSubject.value;
    this.servicesSubject.next(currentServices.filter(s => s.id !== id));
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
    const currentProfessionals = this.professionalsSubject.value;
    this.professionalsSubject.next(currentProfessionals.filter(p => p.id !== id));
  }

  goToNextStep() {
    this.context$.subscribe(context => {
      if (context === 'service') {
        this.router.navigate([`/auth/register/step/service-professional/professionals`]);
      } else {
        this.router.navigate([`/auth/register/step/congratulations`]);
      }
    });
  }
}
