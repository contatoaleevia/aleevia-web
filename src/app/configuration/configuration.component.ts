import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../shared/components/button/button.component';
import { OfficeService } from '@shared/services/office.service';
import { Office, OfficeResponse } from '@app/shared/models/office.model';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { LoadingService } from '@app/core/services/loading.service';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  private readonly officeService = inject(OfficeService);
  private readonly router = inject(Router);
  private officeId = localStorage.getItem('officeId') || '{}';
  private readonly loadingService = inject(LoadingService);

  offices: Office[] = [];

  ngOnInit(): void {
    this.loadingService.loadingOn();
    this.officeService.getMyOffices().pipe(
      finalize(() => this.loadingService.loadingOff())
    ).subscribe({
      next: (response: OfficeResponse[]) => {
        this.offices = response.map(item => item.office);
      },
      error: (error: any) => {
        console.error('Error fetching offices:', error);
      }
    });
  }

navigateToOffice(id ?: string) {
  this.router.navigate(['/configuration/office', id || this.officeId]);
}
}
