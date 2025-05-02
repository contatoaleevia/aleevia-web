import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from 'src/app/shared/components/input/input.component';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step-cpf-cnpj',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './step-cpf-cnpj.component.html',
  styleUrl: './step-cpf-cnpj.component.scss'
})
export class StepCpfCnpjComponent implements OnInit {
  form: FormGroup;
  isClinic = false;
  @Output() actionHandler = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private router: Router) {
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
    this.isClinic = this.router.url.includes('clinic');

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
      this.actionHandler.emit();
    } else {
      this.form.markAllAsTouched();
    }
  }
}
