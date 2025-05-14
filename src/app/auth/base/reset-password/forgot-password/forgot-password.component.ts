import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from 'src/app/shared/components/input/input.component';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { PasswordResetService } from '../password-reset.service';
import { LoadingService } from '@app/core/services/loading.service';
import { finalize } from 'rxjs';
import { ForgotPasswordResponse } from '@app/auth/models/auth.model';
import { AlertService } from '@app/shared/services/alert.service';

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
  private readonly alertService = inject(AlertService);

  form: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder) {
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
      next: async (response: ForgotPasswordResponse) => {
        await this.alertService.passwordResetInstructions(this.formatEmail(response.email));
      }
    });
  }

  private formatEmail(email: string): string {
    const [username, domain] = email.split('@');
    const maskedUsername = '*'.repeat(username.length);
    return `${maskedUsername}@${domain}`;
  }
}
