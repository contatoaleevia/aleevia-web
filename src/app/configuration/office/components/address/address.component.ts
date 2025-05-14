import { Component, Input, OnInit, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Address } from '@shared/models/address.model';
import { FormAddressComponent } from '@shared/components/form-address/form-address.component';
import { AddressService } from '@shared/services/adress.service';
import { OfficeService } from '@shared/services/office.service';
import { Office, OfficeAddress } from '@shared/models/office.model';
import { AlertService } from '@app/shared/services/alert.service';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, FormAddressComponent],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent implements OnInit, OnChanges {
  @Input() office: Office = {} as Office;

  address: Partial<Address> = {};
  formData: any = {};
  dataLoaded = false;
  officeAddress: OfficeAddress | null = null;
  private readonly alertService = inject(AlertService);

  ngOnInit(): void {
    this.processOfficeAddress();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['office'] && this.office) {
      this.processOfficeAddress();
    }
  }

  processOfficeAddress(): void {
    if (this.office && this.office.id) {
      if (this.office.addresses && this.office.addresses.length > 0) {
        const activeAddress = this.office.addresses.find(addr => addr.isActive) || this.office.addresses[0];
        this.officeAddress = activeAddress;

        if (activeAddress.address) {
          this.formData = {
            id: activeAddress.address.id,
            name: activeAddress.address.name || '',
            street: activeAddress.address.street || '',
            number: activeAddress.address.number || '',
            complement: activeAddress.address.complement || '',
            neighborhood: activeAddress.address.neighborhood || '',
            city: activeAddress.address.city || '',
            state: activeAddress.address.state || '',
            zipCode: activeAddress.address.zipCode || '',
            type: activeAddress.address.type || 'SERVICE',
            isTeleconsultation: activeAddress.isTeleconsultation || false
          };

          this.address = activeAddress.address;
        }
      }

      this.dataLoaded = true;
    }
  }

  saveAddress(updatedAddress: Address): void {
    this.alertService.comingSoon();

    // Commented out for now as per the data component pattern
    /*
    if (this.office && this.office.id) {
      // Preparing the address data
      const addressToSave: Address = {
        ...updatedAddress,
        sourceId: this.office.id,
        sourceType: {
          userTypeId: 2
        }
      };

      // If we already have an address ID, update it
      if (this.officeAddress && this.officeAddress.address.id) {
        addressToSave.id = this.officeAddress.address.id;
      }

      this.addressService.createAddress(addressToSave)
        .pipe(
          catchError((error: any) => {
            console.error('Error saving address:', error);
            return of(null);
          })
        )
        .subscribe((response: AddressResponse | null) => {
          if (response) {
            console.log('Address saved successfully:', response);

            // Update local data
            if (this.officeAddress) {
              this.officeAddress.address = {
                ...this.officeAddress.address,
                ...addressToSave,
                id: response.id,
                street: response.street,
                number: response.number
              };

              this.address = this.officeAddress.address;

              // Update form data
              this.formData = {
                id: response.id,
                name: addressToSave.name || '',
                street: response.street || '',
                number: response.number || '',
                complement: addressToSave.complement || '',
                neighborhood: addressToSave.neighborhood || '',
                city: addressToSave.city || '',
                state: addressToSave.state || '',
                zipCode: addressToSave.zipCode || '',
                type: addressToSave.type || 'SERVICE',
                isTeleconsultation: this.officeAddress.isTeleconsultation
              };
            }
          }
        });
    }
    */
  }
}
