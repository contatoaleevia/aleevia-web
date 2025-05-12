import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { FormComponent } from '@shared/components/form/form.component';

export interface Professional {
  id?: string;
  name: string;
  email: string;
  cpf: string;
  isPublic: boolean;
  officeId?: string;
}

@Component({
  selector: 'app-form-professional',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, FormComponent],
  templateUrl: './form-professional.component.html',
  styleUrl: './form-professional.component.scss'
})
export class FormProfessionalComponent implements OnInit {
  @Output() formSubmit: EventEmitter<Professional> = new EventEmitter<Professional>();
  @Input() initialData?: Partial<Professional>;
  @Input() submitButtonText: string = 'Salvar';
  @Input() officeId?: string;

  private readonly fb = inject(FormBuilder);

  form: FormGroup = this.initializeForm();

  isActiveOptions = [
    { id: true, name: 'Sim' },
    { id: false, name: 'Não' }
  ];

  ngOnInit() {
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)]],
      isPublic: [null, Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const professional: Professional = {
        ...this.form.value,
        officeId: this.officeId || this.initialData?.officeId
      };
      this.formSubmit.emit(professional);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
