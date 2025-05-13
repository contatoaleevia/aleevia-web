import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataComponent } from './components/data/data.component';
import { AddressComponent } from './components/address/address.component';
import { OfficeService } from '@shared/services/office.service';
import { OfficeAttendanceComponent } from './components/office-attendance/office-attendance.component';
import { Observable, switchMap, of, finalize } from 'rxjs';
import { Office } from '@shared/models/office.model';
import { LoadingService } from '@app/core/services/loading.service';
import { ProfessionalComponent } from './components/professional/professional.component';
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
    ProfessionalComponent
  ],
  templateUrl: './office.component.html',
  styleUrl: './office.component.scss'
})
export class OfficeComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly officeService = inject(OfficeService);
  private readonly loadingService = inject(LoadingService);

  officeId: string = '';
  activeTab: string = 'dados';
  office$: Observable<Office> = of({} as Office);

  ngOnInit(): void {
    this.loadingService.loadingOn();
    this.office$ = this.route.params.pipe(
      switchMap(params => {
        this.officeId = params['id'];
        localStorage.setItem('officeId', this.officeId);
        if (this.officeId) {
          return this.officeService.getOfficeById(this.officeId).pipe(finalize(() => this.loadingService.loadingOff()));
        }
        return of({} as Office);
      })
    );
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }
}
