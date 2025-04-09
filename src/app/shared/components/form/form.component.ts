import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit, OnChanges {
  @Input() formGroup!: FormGroup;
  @Input() submitButtonText: string = 'Enviar';
  @Input() showSubmitButton: boolean = true;
  @Input() showPreviousButton: boolean = false;
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() isNextButton: boolean = false;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formValid = new EventEmitter<boolean>();
  @Output() previous = new EventEmitter<void>();

  formErrors: { [key: string]: ValidationErrors | null } = {};
  isFormValid: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.updateFormValidity();
    this.formGroup.statusChanges.subscribe(() => {
      this.updateFormValidity();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formGroup']) {
      this.updateFormValidity();
    }
  }

  updateFormValidity(): void {
    this.isFormValid = this.formGroup.valid;
    this.formValid.emit(this.isFormValid);
    
    this.formErrors = {};
    Object.keys(this.formGroup.controls).forEach(key => {
      const control = this.formGroup.get(key);
      if (control && control.errors && control.touched) {
        this.formErrors[key] = control.errors;
      }
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.formSubmit.emit(this.formGroup.value);
    } else {
      this.markFormGroupTouched(this.formGroup);
    }
  }

  onPrevious(): void {
    this.previous.emit();
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getControlError(controlName: string): ValidationErrors | null {
    const control = this.formGroup.get(controlName);
    if (control && control.errors && control.touched) {
      return control.errors;
    }
    return null;
  }

  getErrorMessage(controlName: string): string | null {
    const errors = this.getControlError(controlName);
    if (errors) {
      const firstErrorKey = Object.keys(errors)[0];
      return firstErrorKey ? this.errorMessages[firstErrorKey] : null;
    }
    return null;
  }
}
