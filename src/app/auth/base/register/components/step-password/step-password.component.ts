import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Router } from '@angular/router';
import { RegistrationContextService } from '@auth/base/register/registration-context.service';
import { REGISTRATION_TYPES, RegistrationType } from '@auth/base/register/constants/registration-types';
import { UserService } from '@shared/services/user.service';
import { RegisterUserPayload } from '@auth/models/register.model';
import { AuthService } from '@auth/services/auth.service';
import { switchMap, from, tap, map, catchError, finalize } from 'rxjs';
import { LoadingService } from '@core/services/loading.service';
import { AlertService } from '@app/shared/services/alert.service';
import { PasswordResetService } from '@auth/base/reset-password/password-reset.service';
import { FormValidators } from '@shared/validators/form.validators';

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
  private loadingService = inject(LoadingService);
  private alertService = inject(AlertService);
  private passwordResetService = inject(PasswordResetService);

  form: FormGroup;
  submitted = false;
  context: RegistrationType = this.registrationContext.getContext();
  isResetPassword = false;

  constructor() {
    this.form = this.initializeForm();
    this.isResetPassword = this.router.url.includes('reset-password');
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: FormValidators.passwordMatchValidator });
  }

  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  private preparePayload(password: string): RegisterUserPayload {
    this.loadingService.loadingOn();
    const registrationData = JSON.parse(localStorage.getItem('registrationData') || '{}');
    const payload: RegisterUserPayload = {
      password,
      name: registrationData.name,
      cpf: registrationData.cpf,
      cnpj: registrationData.cnpj || '',
      phoneNumber: registrationData.phoneNumber,
      email: registrationData.email,
      manager: {
        typeId: this.context === REGISTRATION_TYPES.CLINIC ? 1 : 0,
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
    if (this.isResetPassword) {
      return from(this.alertService.custom({
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
    this.loadingService.loadingOff();
    if (!this.isResetPassword) {
      this.router.navigate([`/auth/register/step/healthcare-space`]);
    }
  }

  private handleError(error: any) {
    this.loadingService.loadingOff();
    return from(this.alertService.error({
      title: 'Erro',
      text: error.error.Errors.map((err: any) => err.Message).join('\n'),
      confirmButtonText: 'OK'
    })).pipe(
      tap(() => {
        if (this.isResetPassword) {
          this.router.navigate(['/auth/login']);
        } else {
          this.router.navigate([`/auth/register/step/cpf-cnpj`]);
        }
      })
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      const password = this.form.get('password')?.value;
      const confirmPassword = this.form.get('confirmPassword')?.value;

      if (this.isResetPassword) {
        const token = localStorage.getItem('resetPasswordToken');
        const document = localStorage.getItem('documentResetPassword');

        if (!token || !document) {
          this.alertService.error({
            title: 'Erro',
            text: 'Token ou documento não encontrado',
            confirmButtonText: 'OK'
          });
          return;
        }

        this.passwordResetService.resetPassword({
          document,
          token,
          newPassword: password,
          confirmPassword
        }).pipe(
          switchMap(() => this.handleSuccess()),
          catchError(error => this.handleError(error))
        ).subscribe();
      } else {
        this.userService.registerUser(this.preparePayload(password)).pipe(
          switchMap(() => this.handleSuccess()),
          tap(() => this.handleNavigation()),
          catchError(error => this.handleError(error))
        ).subscribe();
      }
    }
  }
}
