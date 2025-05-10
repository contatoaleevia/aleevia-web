import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { RegistrationContextService } from '@auth/base/register/registration-context.service';
import { RegistrationType } from '@auth/base/register/constants/registration-types';
import { OfficeAttendanceService } from '@app/shared/services/office-attendance.service';
import { OfficeAttendance } from '@app/shared/models/office-attendance.model';

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
      this.professionals = [
        { id: 1, name: 'Dr. João da Silva', email: 'joao.silva@gmail.com' },
        { id: 2, name: 'Dra. Maria Oliveira', email: 'maria.oliveira@gmail.com' }
      ];
    }
  }

  getServices() {
    // this.officeAttendanceService.get(this.officeID).subscribe((services) => {
    //   this.services = services;
    // });
      this.services = [
        { id: 1, title: 'Consulta clínica', price: 100, description: 'Consulta clínica' },
        { id: 2, title: 'Consulta clínica', price: 100, description: 'Consulta clínica' }
      ];
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
