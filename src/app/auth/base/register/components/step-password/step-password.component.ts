import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Router } from '@angular/router';
import { RegistrationContextService } from '@auth/services/registration-context.service';
import { RegistrationType } from '@auth/base/register/constants/registration-types';
import Swal from 'sweetalert2';
import { UserService } from '@shared/services/user.service';
import { RegisterUserPayload } from '@auth/models/register.model';
import { AuthService } from '@auth/services/auth.service';
import { switchMap, from, tap, map, catchError } from 'rxjs';

@Component({
  selector: 'app-step-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './step-password.component.html',
  styleUrl: './step-password.component.scss'
})
export class StepPasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private registrationContext = inject(RegistrationContextService);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  form: FormGroup;
  submitted = false;
  context: RegistrationType = this.registrationContext.getContext();

  constructor() {
    this.form = this.initializeForm();
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  private passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  private preparePayload(password: string): RegisterUserPayload {
    const registrationData = JSON.parse(localStorage.getItem('registrationData') || '{}');
    const payload: RegisterUserPayload = {
      password,
      name: registrationData.name,
      cpf: registrationData.cpf,
      cnpj: registrationData.cnpj || '',
      phoneNumber: registrationData.phoneNumber,
      email: registrationData.email,
      manager: {
        typeId: this.context === 'clinic' ? 1 : 0,
        corporateName: registrationData.corporateName || ''
      }
    };

    if (!registrationData.isCompany) {
      delete payload.cnpj;
      if (payload.manager) {
        delete payload.manager.corporateName;
      }
    }

    return payload;
  }

  private prepareLoginPayload(payload: RegisterUserPayload, password: string) {
    return {
      username: payload.cnpj || payload.cpf,
      password
    };
  }

  private handleSuccess() {
    if (this.router.url.includes('reset-password')) {
      return from(Swal.fire({
        title: 'Senha atualizada',
        html: `Sua senha foi redefinida com êxito.<br>Você já pode acessar sua conta normalmente com a nova credencial.`,
        confirmButtonText: 'Acessar conta',
        customClass: {
          popup: 'rounded-4',
          title: 'fw-bold fs-2',
          htmlContainer: 'text-secondary fs-5',
          confirmButton: 'btn btn-primary btn-lg w-100 mt-4'
        },
        buttonsStyling: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      })).pipe(
        tap(() => this.router.navigate(['/auth/login'])),
        map(() => null)
      );
    }
    return this.authService.login(this.prepareLoginPayload(this.preparePayload(this.form.value.password), this.form.value.password));
  }

  private handleNavigation() {
    if (!this.router.url.includes('reset-password')) {
      this.router.navigate([`/auth/register/${this.context}/healthcare-space`]);
    }
  }

  private handleError(error: any) {
    console.log(error.error.Errors);
    return from(Swal.fire({
      title: 'Erro',
      text: error.error.Errors.map((err: any) => err.Message).join('\n'),
      icon: 'error',
      confirmButtonText: 'OK'
    })).pipe(
      tap(() => this.router.navigate([`/auth/register/${this.context}/cpf-cnpj`]))
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      const password = this.form.get('password')?.value;
      this.userService.registerUser(this.preparePayload(password)).pipe(
        switchMap(() => this.handleSuccess()),
        tap(() => this.handleNavigation()),
        catchError(error => this.handleError(error))
      ).subscribe();
    }
  }
}
