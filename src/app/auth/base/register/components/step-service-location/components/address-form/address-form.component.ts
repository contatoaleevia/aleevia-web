import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RegistrationType } from '@auth/base/register/constants/registration-types';
import { RegistrationContextService } from '@auth/base/register/registration-context.service';
import { AddressService } from '@shared/services/adress.service';
import { LoadingService } from '@app/core/services/loading.service';
import { FormAddressComponent } from '@shared/components/form-address/form-address.component';
import { Address } from '@shared/models/address.model';
import { OfficeService } from '@app/shared/services/office.service';
import { switchMap } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, FormAddressComponent],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss'
})
export class AddressFormComponent {
  private readonly router = inject(Router);
  private readonly registrationContext = inject(RegistrationContextService);
  private readonly authService = inject(AuthService);
  private readonly officeService = inject(OfficeService);
  private readonly addressService = inject(AddressService);
  private readonly loadingService = inject(LoadingService);

  context: RegistrationType = this.registrationContext.getContext();
  initialAddressData?: Partial<Address>;

  constructor() {
    this.loadSavedAddress();
  }

  private loadSavedAddress(): void {
    const savedAddress = localStorage.getItem('serviceLocation');
    if (savedAddress) {
      this.initialAddressData = JSON.parse(savedAddress);
    }
  }

  handleFormSubmit(addressData: Address): void {
    const user = this.authService.currentUser;
    this.loadingService.loadingOn();
    const officeId = localStorage.getItem('officeId')

    if (user) {
      addressData.sourceId = user.id;
      addressData.sourceType = {
        userTypeId: 2
      };
    }

    localStorage.setItem('serviceLocation', JSON.stringify(addressData));

    if (user) {
      this.addressService.createAddress(addressData).pipe(
        switchMap(response => {
          addressData.id = response.id;
          const registrationData = JSON.parse(localStorage.getItem('registrationData') || '{}');
          registrationData.address = addressData;
          localStorage.setItem('registrationData', JSON.stringify(registrationData));

          return this.officeService.bindAddress({
            officeId: officeId!,
            addressId: response.id
          });
        }),
        catchError(error => {
          console.error('Error in address flow:', error);
          return EMPTY;
        }),
        finalize(() => this.loadingService.loadingOff())
      ).subscribe(() => {
        this.router.navigate([`/auth/register/step/service-location/confirmation`]);
      });
    } else {
      const registrationData = JSON.parse(localStorage.getItem('registrationData') || '{}');
      registrationData.address = addressData;
      localStorage.setItem('registrationData', JSON.stringify(registrationData));
      this.router.navigate([`/auth/register/step/service-location/confirmation`]);
      this.loadingService.loadingOff();
    }
  }
}
