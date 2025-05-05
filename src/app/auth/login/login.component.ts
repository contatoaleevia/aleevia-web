import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { AuthService } from '@auth/services/auth.service';
import { LoginRequest } from '@auth/models/auth.model';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl: string = '/dashboard';
  cpfCnpjMask: string = '000.000.000-00||00.000.000/0000-00';

  ngOnInit(): void {
    this.initForm();

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    const error = this.route.snapshot.queryParams['error'];
    if (error) {
      this.errorMessage = error;
    }

    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      cpfCnpj: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const cpfCnpj = this.loginForm.value.cpfCnpj.replace(/\D/g, '');
    const rememberMe = this.loginForm.value.rememberMe;

    const loginRequest: LoginRequest = {
      username: cpfCnpj,
      password: this.loginForm.value.password,
      rememberMe: rememberMe
    };

    this.authService.login(loginRequest)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          console.log('Full error object:', error);
          if (error.error && error.error.Errors && error.error.Errors.length > 0) {
            this.errorMessage = error.error.Errors[0].Message;
          } else {
            this.errorMessage = 'Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.';
          }
        }
      });
  }

  forgotPassword(): void {
    console.log('Esqueceu a senha');
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
}
