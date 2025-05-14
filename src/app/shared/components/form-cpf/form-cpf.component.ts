import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-cpf',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent],
  templateUrl: './form-cpf.component.html',
  styleUrl: './form-cpf.component.scss'
})
export class FormCpfComponent {
  @Input() form!: FormGroup;
  @Output() submitForm = new EventEmitter<void>();

  constructor() {
    console.log(this.form)
  }

  onSubmit() {
    this.submitForm.emit();
  }
}
