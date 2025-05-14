import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from 'src/app/shared/components/input/input.component';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import Swal from 'sweetalert2';
import { PasswordResetService } from '../password-reset.service';
import { LoadingService } from '@app/core/services/loading.service';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private readonly passwordResetService = inject(PasswordResetService);
  private readonly loadingService = inject(LoadingService);

  form: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      document: ['', [Validators.required]]
    });

    const cpfCnpj = localStorage.getItem('cpfCnpj');
    if (cpfCnpj) {
      this.form.patchValue({ document: cpfCnpj });
    }
  }

  get document() {
    return this.form.get('document');
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loadingService.loadingOn();
    this.passwordResetService.requestResetPassword(this.document?.value).pipe(
      finalize(() => this.loadingService.loadingOff())
    ).subscribe({
      next: async () => {
        await Swal.fire({
          title: 'Instruções enviadas',
          html: `Enviamos as instruções de mudança de senha para o email da conta. Verifique sua caixa de spam`,
          confirmButtonText: 'Continuar',
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
        this.router.navigate(['/auth/reset-password/new-password']);
      }
    });
  }
}
