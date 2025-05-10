import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViaCepService } from '@shared/services/via-cep.service';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Router } from '@angular/router';
import { RegistrationType } from '@auth/base/register/constants/registration-types';
import { RegistrationContextService } from '@auth/base/register/registration-context.service';
import { AddressService } from '@shared/services/adress.service';
@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss'
})
export class AddressFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly viaCep = inject(ViaCepService);
  private readonly router = inject(Router);
  private readonly registrationContext = inject(RegistrationContextService);
  private readonly addressService = inject(AddressService);

  form: FormGroup;
  context: RegistrationType = this.registrationContext.getContext();

  constructor() {
    this.form = this.initializeForm();
    this.loadSavedAddress();
    this.setupCepListener();
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      addressName: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}-[0-9]{3}$/)]],
      street: ['', Validators.required],
      neighborhood: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      state: ['', Validators.required],
      city: ['', Validators.required],
    });
  }

  private loadSavedAddress(): void {
    const savedAddress = localStorage.getItem('serviceLocation');
    if (savedAddress) {
      this.form.patchValue(JSON.parse(savedAddress));
    }
  }

  private setupCepListener(): void {
    this.form.get('zipCode')?.valueChanges.subscribe((cep: string) => {
      if (this.isValidCep(cep)) {
        this.fetchAddress(cep);
      }
    });
  }

  private isValidCep(cep: string): boolean {
    return cep?.length === 9 && /^[0-9]{5}-[0-9]{3}$/.test(cep);
  }

  private fetchAddress(cep: string): void {
    this.viaCep.getAddressByCep(cep).subscribe((data) => {
      if (!data.erro) {
        this.patchAddressData(data);
      }
    });
  }

  private patchAddressData(data: any): void {
    this.form.patchValue({
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
      complement: data.complemento
    });
  }

  private saveAddressData(): void {
    const addressData = this.form.value;
    const officeId = localStorage.getItem('officeId');
    addressData.sourceId = officeId;
    addressData.sourceType.userTypeId = 2;
    localStorage.setItem('serviceLocation', JSON.stringify(addressData));

    console.log(addressData);

    // if (officeId) {
    //   this.addressService.createAddress(addressData).subscribe((response) => {
    //     addressData.id = response.id;
    //   });
    // }
    
    const registrationData = JSON.parse(localStorage.getItem('registrationData') || '{}');
    registrationData.address = addressData;
    localStorage.setItem('registrationData', JSON.stringify(registrationData));
  }

  onAction(): void {
    if (this.form.valid) {
      this.saveAddressData();
      this.router.navigate([`/auth/register/${this.context}/service-location/confirmation`]);
    }
  }
}
