import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { FormComponent } from '@shared/components/form/form.component';

@Component({
  selector: 'app-security-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, FormComponent],
  templateUrl: './security-info.component.html',
  styleUrl: './security-info.component.scss'
})
export class SecurityInfoComponent {
  @Input() formGroup!: FormGroup;
  @Input() errorMessages: { [key: string]: string } = {};
  @Output() formSubmit = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @ViewChild('securityFormComponent') securityFormComponent!: FormComponent;
}
