import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataComponent } from './components/data/data.component';
import { AddressComponent } from './components/address/address.component';
import { OfficeService } from '@shared/services/office.service';
import { OfficeAttendanceComponent } from './components/office-attendance/office-attendance.component';
import { Observable, map, switchMap } from 'rxjs';
import { Office } from '@shared/models/office.model';
import { LoadingService } from '@app/core/services/loading.service';
import { ProfessionalComponent } from './components/professional/professional.component';
import { SocialMediaComponent } from './components/social-media/social-media.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-office',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataComponent,
    AddressComponent,
    OfficeAttendanceComponent,
    ProfessionalComponent,
    SocialMediaComponent
  ],
  templateUrl: './office.component.html',
  styleUrl: './office.component.scss'
})
export class OfficeComponent {
  private readonly officeService = inject(OfficeService);
  private readonly route = inject(ActivatedRoute);

  activeTab: string = 'dados';
  office$: Observable<Office> = this.route.params.pipe(
    map(params => params['id']),
    switchMap(id => this.officeService.getOfficeById(id))
  );

  switchTab(tab: string): void {
    this.activeTab = tab;
  }
}
