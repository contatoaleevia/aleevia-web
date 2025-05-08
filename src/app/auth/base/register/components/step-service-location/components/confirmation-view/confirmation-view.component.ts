import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';
import { RegistrationContextService } from 'src/app/auth/services/registration-context.service';
import { RegistrationType } from 'src/app/auth/base/register/constants/registration-types';

@Component({
  selector: 'app-confirmation-view',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './confirmation-view.component.html',
  styleUrl: './confirmation-view.component.scss'
})
export class ConfirmationViewComponent {
  serviceLocation = JSON.parse(localStorage.getItem('serviceLocation') || '{}');
  context: RegistrationType;

  get formattedAddress(): string {
    const f = this.serviceLocation;
    let address = `${f.street}, ${f.number}`;
    if (f.complement) address += ` ${f.complement}`;
    address += ` - ${f.neighborhood}, ${f.city} - ${f.state}, ${f.zipCode}`;
    return address;
  }

  constructor(
    private router: Router,
    private registrationContext: RegistrationContextService
  ) {
    this.context = this.registrationContext.getContext();
  }

  onAction() {
    this.router.navigate([`/auth/register/${this.context}/service-professional/services`]);
  }

  onEdit() {
    this.router.navigate([`/auth/register/${this.context}/service-location/address`]);
  }
}
