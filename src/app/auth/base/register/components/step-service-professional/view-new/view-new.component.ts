import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { RegistrationContextService } from '@auth/base/register/registration-context.service';
import { RegistrationType } from '@auth/base/register/constants/registration-types';
import { OfficeAttendanceService } from '@app/shared/services/office-attendance.service';
import { OfficeAttendance } from '@app/shared/models/office-attendance.model';
import { LoadingService } from '@app/core/services/loading.service';

interface Professional {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-view-new',
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './view-new.component.html',
  styleUrl: './view-new.component.scss'
})
export class ViewNewComponent implements OnInit {
  private readonly loadingService = inject(LoadingService);

  context: 'service' | 'professional' = 'service';
  services: OfficeAttendance[] = [];
  professionals: Professional[] = [];
  showServiceForm = false;
  editingService: OfficeAttendance | null = null;
  keyword: string = '';
  officeID: string = JSON.parse(localStorage.getItem('officeId') || '{}');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private registrationContext: RegistrationContextService,
    private officeAttendanceService: OfficeAttendanceService
  ) { }

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
      console.log(localStorage.getItem('professionalData'));
      this.professionals = JSON.parse(localStorage.getItem('professionalData') || '[]');
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

  deleteService(id: number) {
    this.services = this.services.filter(s => s.id !== id);
  }

  goToNextStep() {
    const registrationType: RegistrationType = this.registrationContext.getContext();
    if (this.context === 'service') {
      this.router.navigate([`/auth/register/${registrationType}/service-professional/professionals`]);
    } else {
      this.router.navigate([`/auth/register/${registrationType}/congratulations`]);
    }
  }
}
