import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { OfficeAttendance } from '@shared/models/office-attendance.model';
import { ServiceTypeService } from '@shared/services/service-type.service';
import { FormComponent } from '@shared/components/form/form.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-form-office-attendance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, FormComponent],
  templateUrl: './form-office-attendance.component.html',
  styleUrl: './form-office-attendance.component.scss'
})
export class FormOfficeAttendanceComponent implements OnInit {
  @Output() formSubmit: EventEmitter<OfficeAttendance> = new EventEmitter<OfficeAttendance>();
  @Input() initialData?: Partial<OfficeAttendance>;
  @Input() submitButtonText: string = 'Salvar';
  @Input() officeId?: string;

  private readonly fb = inject(FormBuilder);
  private readonly serviceTypeService = inject(ServiceTypeService);

  form: FormGroup = this.initializeForm();
  serviceTypes: { id: string, name: string }[] = [];

  ngOnInit() {
    this.loadServiceTypes();
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      serviceTypeId: [null, Validators.required],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      duration: ['', [Validators.required, Validators.pattern(/^\d{2}:\d{2}$/)]],
      price: ['', [Validators.required, Validators.pattern(/^\d+(,\d{1,2})?$/)]],
      description: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  loadServiceTypes(): void {
    this.serviceTypeService.getServiceTypes()
      .pipe(
        catchError(error => {
          console.error('Error loading service types:', error);
          return of([]);
        })
      )
      .subscribe(types => {
        this.serviceTypes = types.map(type => ({
          id: type.id || '',
          name: type.name
        }));
      });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const officeAttendance: OfficeAttendance = {
        ...formValue,
        officeId: this.officeId || this.initialData?.officeId,
        price: Number((formValue.price || '').replace(',', '.'))
      };
      this.formSubmit.emit(officeAttendance);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
