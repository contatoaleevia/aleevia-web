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

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [InputComponent, ButtonComponent, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly registrationContext = inject(RegistrationContextService);
  private readonly serviceTypeService = inject(ServiceTypeService);
  

  context: 'services' | 'professionals' = 'services';
  serviceTypes: ServiceType[] = [];

  ngOnInit(): void {
    const url = this.route.snapshot.pathFromRoot
      .map(r => r.routeConfig?.path)
      .filter(Boolean)
      .join('/');
    if (url.includes('add-professional')) {
      this.context = 'professionals';
    } else {
      this.context = 'services';
    }

    this.serviceTypeService.getServiceTypes().subscribe(serviceTypes => {
      this.serviceTypes = serviceTypes;
    });
  } 

  save() {
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
