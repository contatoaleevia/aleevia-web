import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { FormCpfComponent } from '@shared/components/form-cpf/form-cpf.component';
import { FormCnpjComponent } from '@shared/components/form-cnpj/form-cnpj.component';
import { Router } from '@angular/router';
import { RegistrationContextService } from '@auth/base/register/registration-context.service';
import { RegistrationType, REGISTRATION_TYPES } from '@auth/base/register/constants/registration-types';
import { RegistrationData } from '@auth/models/register.model';

@Component({
  selector: 'app-step-cpf-cnpj',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ButtonComponent, FormCpfComponent, FormCnpjComponent],
  templateUrl: './step-cpf-cnpj.component.html',
  styleUrl: './step-cpf-cnpj.component.scss'
})
export class StepCpfCnpjComponent implements OnInit {
  REGISTRATION_TYPES = REGISTRATION_TYPES;
  form: FormGroup;
  context: RegistrationType = REGISTRATION_TYPES.INDIVIDUAL;
  acceptTerms: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registrationContext: RegistrationContextService
  ) {
    this.form = this.initializeForm();
    this.setupFormListeners();
    this.loadSavedData();
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      cpf: [{ value: '', disabled: false }, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      isCompany: [false],
      cnpj: [{ value: '', disabled: false }],
      phoneNumber: [''],
      corporateName: ['']
    });
  }

  private setupFormListeners(): void {
    this.form.get('isCompany')?.valueChanges.subscribe((isCompany: boolean) => {
      const cnpj = this.form.get('cnpj');
      const phone = this.form.get('phoneNumber');
      const corporateName = this.form.get('corporateName');
      const cpf = this.form.get('cpf');

      if (isCompany) {
        cnpj?.setValidators([Validators.required]);
        phone?.setValidators([Validators.required]);
        corporateName?.setValidators([Validators.required]);
      } else {
        cnpj?.clearValidators();
        phone?.clearValidators();
        corporateName?.clearValidators();
      }
      cnpj?.updateValueAndValidity();
      phone?.updateValueAndValidity();
      corporateName?.updateValueAndValidity();
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

  private loadSavedData(): void {
    try {
      const savedData = localStorage.getItem('registrationData');
      if (savedData) {
        const data: RegistrationData = JSON.parse(savedData);
        Object.keys(this.form.controls).forEach(key => this.form.get(key)?.enable({ emitEvent: false }));
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
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }

  ngOnInit() {
    this.context = this.registrationContext.getContext();
    this.loadSavedData();
  }

  private prepareRegistrationData(): RegistrationData {
    const formData = this.form.getRawValue();
    return {
      name: formData.name,
      cpf: formData.cpf,
      cnpj: formData.cnpj,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      corporateName: formData.corporateName,
      isCompany: formData.isCompany,
      acceptTerms: this.acceptTerms
    };
  }

  onSubmit() {
    if (this.form.valid) {
      const registrationData = this.prepareRegistrationData();
      try {
        localStorage.setItem('registrationData', JSON.stringify(registrationData));
        this.router.navigate([`/auth/register/step/password`]);
      } catch (error) {
        console.error('Error saving registration data:', error);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}
