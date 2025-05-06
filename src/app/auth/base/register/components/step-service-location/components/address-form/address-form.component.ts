import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViaCepService } from '@shared/services/via-cep.service';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Router } from '@angular/router';
import { REGISTRATION_TYPES, RegistrationType } from '@auth/base/register/constants/registration-types';
import { RegistrationContextService } from '@app/auth/services/registration-context.service';
@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss'
})
export class AddressFormComponent {
  form: FormGroup;
  context: RegistrationType = REGISTRATION_TYPES.INDIVIDUAL;

  constructor(
    private fb: FormBuilder,
    private viaCep: ViaCepService,
    private router: Router,
    private registrationContext: RegistrationContextService
  ) {
    this.context = this.registrationContext.getContext();
    this.form = this.fb.group({
      addressName: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}-[0-9]{3}$/)]],
      street: ['', Validators.required],
      neighborhood: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      state: ['', Validators.required],
      city: ['', Validators.required],
    });

    const savedAddress = localStorage.getItem('serviceLocation');
    if (savedAddress) {
      this.form.patchValue(JSON.parse(savedAddress));
    }

    this.form.get('zipCode')?.valueChanges.subscribe((cep: string) => {
      if (cep && cep.length === 9 && /^[0-9]{5}-[0-9]{3}$/.test(cep)) {
        this.viaCep.getAddressByCep(cep).subscribe((data) => {
          if (!data.erro) {
            this.form.patchValue({
              street: data.logradouro,
              neighborhood: data.bairro,
              city: data.localidade,
              state: data.uf,
              complement: data.complemento
            });
          }
        });
      }
    });
  }

  onAction() {
    if (this.form.valid) {
      const addressData = this.form.value;
      localStorage.setItem('serviceLocation', JSON.stringify(addressData));
      
      const registrationData = JSON.parse(localStorage.getItem('registrationData') || '{}');
      registrationData.address = addressData;
      localStorage.setItem('registrationData', JSON.stringify(registrationData));
      
      this.router.navigate([`/auth/register/${this.context}/service-location/confirmation`]);
    }
  }
}
