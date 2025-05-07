import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Router } from '@angular/router';
import { RegistrationContextService } from '@auth/services/registration-context.service';
import { RegistrationType, REGISTRATION_TYPES } from '@auth/base/register/constants/registration-types';
@Component({
  selector: 'app-step-cpf-cnpj',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './step-cpf-cnpj.component.html',
  styleUrl: './step-cpf-cnpj.component.scss'
})
export class StepCpfCnpjComponent implements OnInit {
  form: FormGroup;
  context: RegistrationType = REGISTRATION_TYPES.INDIVIDUAL;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private registrationContext: RegistrationContextService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      cpf: [{ value: '', disabled: false }, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      isCompany: [false],
      cnpj: [{ value: '', disabled: false }],
      phone: [''],
      companyName: [''],
      acceptTerms: [false, Validators.requiredTrue]
    });

    this.form.get('isCompany')?.valueChanges.subscribe((isCompany: boolean) => {
      const cnpj = this.form.get('cnpj');
      const phone = this.form.get('phone');
      const companyName = this.form.get('companyName');
      const cpf = this.form.get('cpf');
      
      if (isCompany) {
        cnpj?.setValidators([Validators.required]);
        phone?.setValidators([Validators.required]);
        companyName?.setValidators([Validators.required]);
      } else {
        cnpj?.clearValidators();
        phone?.clearValidators();
        companyName?.clearValidators();
      }
      cnpj?.updateValueAndValidity();
      phone?.updateValueAndValidity();
      companyName?.updateValueAndValidity();
      cpf?.updateValueAndValidity();
    });
  }

  private isCPF(value: string): boolean {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.length === 11;
  }

  private isCNPJ(value: string): boolean {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.length === 14;
  }

  ngOnInit() {
    this.context = this.registrationContext.getContext();

    const savedData = localStorage.getItem('registrationData');
    if (savedData) {
      const data = JSON.parse(savedData);
      this.form.patchValue(data);
    }

    const cpfCnpj = localStorage.getItem('cpfCnpj');
    if (cpfCnpj) {
      if (this.isCPF(cpfCnpj)) {
        this.form.patchValue({
          cpf: cpfCnpj,
          isCompany: false
        });
        this.form.get('cpf')?.disable();
      } else if (this.isCNPJ(cpfCnpj)) {
        this.form.patchValue({
          cnpj: cpfCnpj,
          isCompany: true
        });
        this.form.get('cnpj')?.disable();
      }
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.getRawValue();
      localStorage.setItem('registrationData', JSON.stringify(formData));
      this.router.navigate([`/auth/register/${this.context}/password`]);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
