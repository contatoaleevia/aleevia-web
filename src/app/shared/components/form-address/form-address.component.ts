import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { Address } from '@shared/models/address.model';
import { ViaCepService } from '@shared/services/via-cep.service';
import { FormComponent } from '@shared/components/form/form.component';

@Component({
  selector: 'app-form-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, FormComponent],
  templateUrl: './form-address.component.html',
  styleUrl: './form-address.component.scss'
})
export class FormAddressComponent implements OnInit {
  @Output() formSubmit: EventEmitter<Address> = new EventEmitter<Address>();
  @Input() initialData?: Partial<Address>;
  @Input() submitButtonText: string = 'Adicionar endereço';

  private readonly fb = inject(FormBuilder);
  private readonly viaCep = inject(ViaCepService);

  form: FormGroup = this.initializeForm();

  ngOnInit() {
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
    this.setupCepListener();
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}-[0-9]{3}$/)]],
      street: ['', Validators.required],
      neighborhood: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      state: ['', Validators.required],
      city: ['', Validators.required],
      type: ['SERVICE']
    });
  }

  private setupCepListener(): void {
    this.form.get('zipCode')?.valueChanges.subscribe((cep: string) => {
      if (this.isValidCep(cep)) {
        this.fetchAddress(cep);
      }
    });
  }

  private isValidCep(cep: string): boolean {
    return cep?.length === 9 && /^[0-9]{5}-[0-9]{3}$/.test(cep);
  }

  private fetchAddress(cep: string): void {
    this.viaCep.getAddressByCep(cep).subscribe((data) => {
      if (!data.erro) {
        this.patchAddressData(data);
      }
    });
  }

  private patchAddressData(data: any): void {
    this.form.patchValue({
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
      complement: data.complemento
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const addressData = this.form.value as Address;
      this.formSubmit.emit(addressData);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
