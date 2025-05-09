import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Router } from '@angular/router';
import { Office } from '@shared/models/office.model';
import { OfficeService } from '@shared/services/office.service';

@Component({
  selector: 'app-step-healthcare-space',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './step-healthcare-space.component.html',
  styleUrl: './step-healthcare-space.component.scss'
})
export class StepHealthcareSpaceComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private officeService = inject(OfficeService);
  form: FormGroup = this.initializeForm();

  private initializeForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      whatsapp: [''],
      site: [''],
      instagram: [''],
      logo: [null]
    });
  }

  private prepareOfficeData(): Office {
    return {
      name: this.form.value.name,
      phoneNumber: this.form.value.phoneNumber,
      whatsapp: this.form.value.whatsapp,
      email: this.form.value.email,
      site: this.form.value.site,
      instagram: this.form.value.instagram,
      logo: this.form.value.logo
    };
  }

  onSubmit() {
    if (this.form.valid) {
      const office = this.prepareOfficeData();
      try {
        localStorage.setItem('registrationData', JSON.stringify(office));
        this.officeService.createOffice(office).subscribe(() => {
          this.router.navigate(['/auth/register/clinic/service-location']);
        });
      } catch (error) {
        console.error('Error saving office data:', error);
      }
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
        this.form.patchValue({ logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }
}
