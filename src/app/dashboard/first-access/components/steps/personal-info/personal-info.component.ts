import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { FormComponent } from '../../../../../shared/components/form/form.component';
import { GENDER_OPTIONS } from '../../../constants/first-access.constants';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, FormComponent],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.scss'
})
export class PersonalInfoComponent {
  @Input() formGroup!: FormGroup;
  @Input() errorMessages: { [key: string]: string } = {};
  @Output() formSubmit = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @ViewChild('personalInfoFormComponent') personalInfoFormComponent!: FormComponent;

  genderOptions = GENDER_OPTIONS;
}
