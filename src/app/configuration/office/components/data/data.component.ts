import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormHealthspaceSpaceComponent } from '@shared/components/form-healthspace-space/form-healthspace-space.component';
import { Office } from '@app/shared/models/office.model';
import { AlertService } from '@app/shared/services/alert.service';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [CommonModule, FormHealthspaceSpaceComponent],
  templateUrl: './data.component.html',
  styleUrl: './data.component.scss'
})
export class DataComponent implements OnInit, OnChanges {
  @Input() office: Office = {} as Office;
  private readonly alertService = inject(AlertService);


  formData: any = {};
  dataLoaded = false;

  ngOnInit(): void {
    this.updateFormData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['office'] && this.office) {
      this.updateFormData();
    }
  }

  updateFormData(): void {
    if (this.office && this.office.id) {
      this.formData = {
        name: this.office.name,
        phoneNumber: this.office.phoneNumber || '',
        whatsapp: this.office.whatsapp || '',
        email: this.office.email || '',
        site: this.office.site || '',
        instagram: this.office.instagram || '',
        logo: this.office.logo || ''
      };

      this.dataLoaded = true;
    }
  }

  saveOffice(updatedOffice: Office): void {
    this.alertService.comingSoon();
    // if (this.office && this.office.id) {
    //   console.log('Updated office from form:', updatedOffice);

    //   const officeToSave: Office = {
    //     ...this.office,
    //     name: updatedOffice.name,
    //     phone: updatedOffice.phoneNumber,
    //     whatsapp: updatedOffice.whatsapp,
    //     email: updatedOffice.email,
    //     site: updatedOffice.site,
    //     instagram: updatedOffice.instagram,
    //     logo: updatedOffice.logo
    //   };

    //   console.log('Saving office to API:', officeToSave);

    //   this.officeService.createOffice(officeToSave).subscribe({
    //     next: (response: Office) => {
    //       console.log('Office updated successfully:', response);
    //       this.office = response;

    //       this.formData = {
    //         name: response.name,
    //         phoneNumber: response.phone || '',
    //         whatsapp: response.whatsapp || '',
    //         email: response.email || '',
    //         site: response.site || '',
    //         instagram: response.instagram || '',
    //         logo: response.logo || ''
    //       };
    //       console.log('Updated form data after save:', this.formData);
    //     },
    //     error: (error: any) => {
    //       console.error('Error updating office:', error);
    //     }
    //   });
    // }
  }
}
