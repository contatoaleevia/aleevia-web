import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Router } from '@angular/router';
import { Office } from '@shared/models/office.model';
import { OfficeService } from '@shared/services/office.service';
import { RegistrationContextService } from '@auth/base/register/registration-context.service';
import { RegistrationType } from '@auth/base/register/constants/registration-types';
import { LoadingService } from '@core/services/loading.service';
@Component({
  selector: 'app-step-healthcare-space',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './step-healthcare-space.component.html',
  styleUrl: './step-healthcare-space.component.scss'
})
export class StepHealthcareSpaceComponent {
  private readonly registrationContextService = inject(RegistrationContextService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly officeService = inject(OfficeService);
  private readonly loadingService = inject(LoadingService);
  private context: RegistrationType = this.registrationContextService.getContext();
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
      this.loadingService.loadingOn();
      const office = this.prepareOfficeData();
      const registrationData = JSON.parse(localStorage.getItem('registrationData') || '{}');
      const updatedData = { ...registrationData, ...office };

      localStorage.setItem('registrationData', JSON.stringify(updatedData));
      this.officeService.createOffice(office).subscribe({
        next: (response: Office) => {
          this.router.navigate([`/auth/register/${this.context}/service-location`]);
          localStorage.setItem('officeId', response.id || '');
        },
        error: (error: any) => {
          console.error('Error saving office data:', error);
        }
      });
      this.loadingService.loadingOff();
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
