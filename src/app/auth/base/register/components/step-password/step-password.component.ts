import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Router } from '@angular/router';
import { RegistrationContextService } from '@auth/services/registration-context.service';
import { RegistrationType } from '@auth/base/register/constants/registration-types';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-step-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './step-password.component.html',
  styleUrl: './step-password.component.scss'
})
export class StepPasswordComponent {
  form: FormGroup;
  submitted = false;
  context: RegistrationType;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registrationContext: RegistrationContextService
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });

    this.context = this.registrationContext.getContext();
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  async onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      const password = this.form.get('password')?.value;

      const registrationData = JSON.parse(localStorage.getItem('registrationData') || '{}');
      registrationData.password = password;
      localStorage.setItem('registrationData', JSON.stringify(registrationData));

      if (this.router.url.includes('reset-password')) {
        await Swal.fire({
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
        });
        this.router.navigate(['/auth/login']);
        return;
      }

      if (this.context === 'clinic') {
        this.router.navigate([`/auth/register/${this.context}/healthcare-space`]);
      } else {
        this.router.navigate([`/auth/register/${this.context}/service-location`]);
      }
    }
  }
}
