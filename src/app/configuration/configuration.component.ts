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
import Swal from 'sweetalert2';

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
  private readonly loadingService = inject(LoadingService);
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
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Em breve!',
      text: 'Esta funcionalidade estará disponível em breve.',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: '#3b82f6',
      color: '#fff',
      iconColor: '#fff',
      customClass: {
        popup: 'swal2-toast-blue'
      }
    });
  }

  deleteOffice(event: Event, office: Office): void {
    event.stopPropagation();

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Em breve!',
      text: 'Esta funcionalidade estará disponível em breve.',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: '#3b82f6',
      color: '#fff',
      iconColor: '#fff',
      customClass: {
        popup: 'swal2-toast-blue'
      }
    });
  }
}
