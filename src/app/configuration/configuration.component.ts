import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../shared/components/button/button.component';
import { OfficeService } from '@shared/services/office.service';
import { Office } from '@app/shared/models/office.model';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { LoadingService } from '@app/core/services/loading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateComponent } from './office/create/create.component';
import { AlertService } from '@app/shared/services/alert.service';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent {
  private readonly officeService = inject(OfficeService);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);
  private officeId = localStorage.getItem('officeId') || '{}';
  private readonly modalService = inject(NgbModal);

  offices$ = this.officeService.offices$;

  navigateToOffice(id ?: string) {
    this.router.navigate(['/configuration/office', id || this.officeId]);
  }

  createNewSpace(): void {
    const modalRef = this.modalService.open(CreateComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.result.then(
      (result) => {
        console.log('Modal result:', result);
        if (result) {
          this.officeService.getMyOffices().subscribe({
            next: (offices) => {
              console.log('Offices after creation:', offices);
            },
            error: (error) => {
              console.error('Error fetching offices:', error);
            }
          });
        }
      },
      () => { }
    );
  }

  editOffice(event: Event, office: Office): void {
    this.alertService.comingSoon();
  }

  deleteOffice(event: Event, office: Office): void {
    event.stopPropagation();
    this.alertService.comingSoon();
  }
}
