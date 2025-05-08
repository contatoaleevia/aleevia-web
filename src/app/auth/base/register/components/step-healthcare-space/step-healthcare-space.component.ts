import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from 'src/app/shared/components/input/input.component';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step-healthcare-space',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './step-healthcare-space.component.html',
  styleUrl: './step-healthcare-space.component.scss'
})
export class StepHealthcareSpaceComponent {
  form: FormGroup;
  specialties = [
    { id: 'cardiology', name: 'Cardiologia' },
    { id: 'dermatology', name: 'Dermatologia' },
    { id: 'pediatrics', name: 'Pediatria' },
  ];
  @ViewChild('specialtiesSelect', { static: false }) specialtiesSelect!: ElementRef<HTMLSelectElement>;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      image: [null],
      name: ['', Validators.required],
      specialties: [[], Validators.required],
      phone: ['', Validators.required],
      whatsapp: [''],
      site: [''],
      instagram: ['']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      localStorage.setItem('registrationData', JSON.stringify(this.form.value));
      this.router.navigate(['/auth/register/clinic/service-location']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.form.patchValue({ image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }
}
