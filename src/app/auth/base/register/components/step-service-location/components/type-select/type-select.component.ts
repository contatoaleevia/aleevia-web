import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SERVICE_LOCATION_TYPES, ServiceLocationType } from '@auth/base/register/constants/service-location-types';
import { RegistrationType } from '@auth/base/register/constants/registration-types';
import { ButtonComponent } from '@shared/components/button/button.component';
import { RegistrationContextService } from '@auth/base/register/registration-context.service';
@Component({
  selector: 'app-type-select',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './type-select.component.html',
  styleUrl: './type-select.component.scss'
})
export class TypeSelectComponent {
  private readonly registrationContext = inject(RegistrationContextService);
  private readonly router = inject(Router);

  SERVICE_LOCATION_TYPES = SERVICE_LOCATION_TYPES;
  selectedTypes: ServiceLocationType[] = [];
  context: RegistrationType = this.registrationContext.getContext();

  toggleType(type: ServiceLocationType) {
    if (this.selectedTypes.includes(type)) {
      this.selectedTypes = this.selectedTypes.filter(t => t !== type);
    } else {
      this.selectedTypes = [...this.selectedTypes, type];
    }
  }

  onAction() {
    const { ONLINE, PRESENCIAL } = SERVICE_LOCATION_TYPES;
    if (this.selectedTypes.length === 1 && this.selectedTypes[0] === ONLINE) {
      this.router.navigate([`/auth/register/${this.context}/congratulations/1`]);
    } else if (this.selectedTypes.includes(PRESENCIAL)) {
      this.router.navigate([`/auth/register/${this.context}/service-location/address`]);
    }
  }
}
