import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Address, AddressResponse } from '@shared/models/address.model';
import { FormAddressComponent } from '@shared/components/form-address/form-address.component';
import { AddressService } from '@shared/services/adress.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, FormAddressComponent],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent implements OnInit {
  @Input() officeId: string = '';

  private readonly addressService = inject(AddressService);

  address: Partial<Address> = {};

  ngOnInit(): void {
    if (this.officeId) {
      this.loadAddress();
    }
  }

  loadAddress(): void {
    this.addressService.getAddresBySource()
      .pipe(
        catchError((error) => {
          console.error('Error loading address:', error);
          return of([]);
        })
      )
      .subscribe((addresses: Address[]) => {
        const officeAddresses = addresses.filter(addr => addr.sourceId === this.officeId);
        if (officeAddresses.length > 0) {
          this.address = officeAddresses[0];
        }
      });
  }

  saveAddress(updatedAddress: Address): void {
    if (this.officeId) {
      updatedAddress.sourceId = this.officeId;
      updatedAddress.sourceType = {
        userTypeId: 2
      };

      this.addressService.createAddress(updatedAddress)
        .pipe(
          catchError((error: any) => {
            console.error('Error saving address:', error);
            return of(null);
          })
        )
        .subscribe((response: AddressResponse | null) => {
          if (response) {
            console.log('Address saved successfully:', response);
            this.address = {
              ...updatedAddress,
              id: response.id,
              street: response.street,
              number: response.number
            };
          }
        });
    }
  }
}
