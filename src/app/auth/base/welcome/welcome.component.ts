import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [ButtonComponent, InputComponent, ReactiveFormsModule, CommonModule  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  step = 1;
  cpfCnpjForm: FormGroup;
  cpfCnpjMask: string = '000.000.000-00||00.000.000/0000-00';
  private readonly router = inject(Router);
  constructor(private fb: FormBuilder) {
    this.cpfCnpjForm = this.fb.group({
      cpfCnpj: ['', [Validators.required]]
    });
  }

  nextStep() {
    this.step = 2;
  }

  onContinue() {
    this.router.navigate(['/auth/login']);
    localStorage.setItem('cpfCnpj', this.cpfCnpjForm.get('cpfCnpj')?.value);
  }
}
