import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Office } from '@shared/models/office.model';
import { OfficeService } from '@shared/services/office.service';
import { RegistrationContextService } from '@auth/base/register/registration-context.service';
import { RegistrationType } from '@auth/base/register/constants/registration-types';
import { LoadingService } from '@core/services/loading.service';
import { FormHealthspaceSpaceComponent } from '@shared/components/form-healthspace-space/form-healthspace-space.component';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-step-healthcare-space',
  standalone: true,
  imports: [CommonModule, FormHealthspaceSpaceComponent],
  templateUrl: './step-healthcare-space.component.html',
  styleUrl: './step-healthcare-space.component.scss'
})
export class StepHealthcareSpaceComponent {
  private readonly registrationContextService = inject(RegistrationContextService);
  private readonly router = inject(Router);
  private readonly officeService = inject(OfficeService);
  private readonly loadingService = inject(LoadingService);
  private context: RegistrationType = this.registrationContextService.getContext();

  initialOfficeData: Office | undefined;

  handleFormSubmit(office: Office) {
    this.loadingService.loadingOn();
    const registrationData = JSON.parse(localStorage.getItem('registrationData') || '{}');
    const updatedData = { ...registrationData, ...office };

    localStorage.setItem('registrationData', JSON.stringify(updatedData));
    this.officeService.createOffice(office).pipe(
      finalize(() => this.loadingService.loadingOff())
    ).subscribe({
      next: (response: Office) => {
        this.router.navigate([`/auth/register/${this.context}/service-location`]);
        localStorage.setItem('officeId', response.id || '');
      },
      error: (error: any) => {
        console.error('Error saving office data:', error);
      },
    });
  }
}
