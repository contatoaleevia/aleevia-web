import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormHealthspaceSpaceComponent } from '@shared/components/form-healthspace-space/form-healthspace-space.component';
import { Office } from '@app/shared/models/office.model';
import { OfficeService } from '@shared/services/office.service';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [CommonModule, FormHealthspaceSpaceComponent],
  templateUrl: './data.component.html',
  styleUrl: './data.component.scss'
})
export class DataComponent implements OnInit {
  @Input() officeId: string = '';

  private readonly officeService = inject(OfficeService);

  office: Office = {} as Office;

  ngOnInit(): void {
    if (this.officeId) {
      this.loadOffice();
    }
  }

  loadOffice(): void {
    this.officeService.getOfficeById(this.officeId).subscribe({
      next: (office) => {
        this.office = office;
      },
      error: (error: any) => {
        console.error('Error loading office:', error);
      }
    });
  }

  saveOffice(updatedOffice: Office): void {
    if (this.officeId) {
      updatedOffice.id = this.officeId;
      this.officeService.createOffice(updatedOffice).subscribe({
        next: (response: Office) => {
          console.log('Office updated successfully:', response);
          this.office = response;
        },
        error: (error: any) => {
          console.error('Error updating office:', error);
        }
      });
    }
  }
}
