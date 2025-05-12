import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../shared/components/button/button.component';
import { OfficeService } from '@shared/services/office.service';
import { Office } from '@app/shared/models/office.model';
import { Router } from '@angular/router';
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
  private officeId = localStorage.getItem('officeId') || '{}';

  offices: Office[] = [];

  ngOnInit(): void {
    this.officeService.getOfficeById(this.officeId).subscribe((office) => this.offices = [office]);
  }

  navigateToOffice(id?: string) {
    this.router.navigate(['/configuration/office', id || this.officeId]);
  }
}
