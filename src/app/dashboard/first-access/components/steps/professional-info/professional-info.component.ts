import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { FormComponent } from '../../../../../shared/components/form/form.component';
import { brazilianStates } from '../../../../../shared/data/brazilian-states';
import { Profession, Specialty, Subspecialty } from '../../../../../shared/models/profession.model';

@Component({
  selector: 'app-professional-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, FormComponent],
  templateUrl: './professional-info.component.html',
  styleUrl: './professional-info.component.scss'
})
export class ProfessionalInfoComponent {
  @Input() formGroup!: FormGroup;
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() professions: Profession[] = [];
  @Input() specialties: Specialty[] = [];
  @Input() subspecialties: Subspecialty[] = [];
  @Output() formSubmit = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() professionChange = new EventEmitter<string>();
  @Output() specialtyChange = new EventEmitter<string>();
  @ViewChild('professionalInfoFormComponent') professionalInfoFormComponent!: FormComponent;

  brazilianStates = brazilianStates;

  onProfessionChange(professionId: string): void {
    this.professionChange.emit(professionId);
  }

  onSpecialtyChange(specialtyId: string): void {
    this.specialtyChange.emit(specialtyId);
  }
}
