import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Step1Component } from './step-1/step-1.component';
import { Step2Component } from './step-2/step-2.component';
import {  UpdateAddress } from '@app/shared/models/user.model';
import { DoctorService } from '@app/shared/services/doctor.service';
import { finalize } from 'rxjs';
import { SchedulePayload } from '../models/schedule.model';

@Component({
  selector: 'app-modal-new-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    Step1Component,
    Step2Component
  ],
  templateUrl: './modal-new-schedule.component.html',
  styleUrl: './modal-new-schedule.component.scss'
})
export class ModalNewScheduleComponent implements OnInit {
  @ViewChild('step2') step2?: Step2Component;

  formData: UpdateAddress = {
    address: '',
    city: '',
    state: '',
    zip_code: '',
    number: '',
    complement: '',
    neighborhood: ''
  };

  currentStep = 1;
  isFormValid = false;
  isLoading = false;
  scheduleData?: SchedulePayload;

  constructor(
    private activeModal: NgbActiveModal,
    private doctorService: DoctorService
  ) { }

  ngOnInit(): void { }

  close(): void {
    this.activeModal.dismiss();
  }

  next(): void {
    if (this.currentStep === 1 && this.isFormValid) {
      this.isLoading = true;
      this.doctorService.saveAddress(this.formData)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: (response) => {
            this.formData = response;
            this.currentStep = 2;
            this.isFormValid = false;
          },
          error: (error) => {
            console.error('Error saving address:', error);
          }
        });
    } else if (this.currentStep === 2 && this.isFormValid && this.scheduleData) {
      this.isLoading = true;
      this.doctorService.saveSchedule(this.scheduleData)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: (response) => {
            this.activeModal.close(response);
          },
          error: (error) => {
            console.error('Error saving schedule:', error);
          }
        });
    }
  }

  previous(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onScheduleSave(data: SchedulePayload): void {
    this.scheduleData = data;
  }
}
