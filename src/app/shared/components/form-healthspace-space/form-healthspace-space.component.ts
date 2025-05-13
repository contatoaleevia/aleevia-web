import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Office } from '@shared/models/office.model';
import { FormComponent } from '@shared/components/form/form.component';

@Component({
  selector: 'app-form-healthspace-space',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, FormComponent],
  templateUrl: './form-healthspace-space.component.html',
  styleUrl: './form-healthspace-space.component.scss'
})
export class FormHealthspaceSpaceComponent implements OnInit {
  @Output() formSubmit: EventEmitter<Office> = new EventEmitter<Office>();
  @Input() initialData?: Office;
  @Input() submitButtonText: string = 'Avançar';

  private readonly fb = inject(FormBuilder);
  form: FormGroup = this.initializeForm();

  ngOnInit() {
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      whatsapp: [''],
      email: ['', [Validators.required, Validators.email]],
      site: [''],
      instagram: [''],
      logo: [null]
    });
  }

  private prepareOfficeData(): Office {
    const formData = {
      name: this.form.value.name,
      phoneNumber: this.form.value.phoneNumber,
      whatsapp: this.form.value.whatsapp,
      email: this.form.value.email,
      site: this.form.value.site,
      instagram: this.form.value.instagram,
      logo: this.form.value.logo
    };
    console.log('Emitting form data:', formData);
    return formData;
  }

  onSubmit() {
    if (this.form.valid) {
      const office = this.prepareOfficeData();
      this.formSubmit.emit(office);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.form.patchValue({ logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }
}
