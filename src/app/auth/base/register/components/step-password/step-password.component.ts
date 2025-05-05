import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from 'src/app/shared/components/input/input.component';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { Router } from '@angular/router';
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
  isClinic = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      const password = this.form.get('password')?.value;
      localStorage.setItem('password', password);

      // Update registration data with password
      const registrationData = JSON.parse(localStorage.getItem('registrationData') || '{}');
      registrationData.password = password;
      localStorage.setItem('registrationData', JSON.stringify(registrationData));

      this.router.navigate(['/auth/register', this.isClinic ? 'clinic' : 'individual', 'service-location']);
    }
  }
}
