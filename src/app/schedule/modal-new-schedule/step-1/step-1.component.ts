import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../shared/components/input/input.component';
import { Address } from '../../../shared/models/user.model';
import { ViaCepService } from '../../../shared/services/via-cep.service';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError } from 'rxjs';
import { of } from 'rxjs';

@Component({
  selector: 'app-step-1',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent
  ],
  templateUrl: './step-1.component.html',
  styleUrl: './step-1.component.scss'
})
export class Step1Component implements OnInit {
  @Input() loading = false;
  private _formData: Address = {} as Address;
  
  @Input() set formData(value: Address) {
    if (value) {
      this._formData = {
        ...value,
        zip_code: this.formatCep(value.zip_code || '')
      };
      this.initializeForm();
    }
  }
  
  @Output() formDataChange = new EventEmitter<Address>();
  @Output() formValidityChange = new EventEmitter<boolean>();

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private viaCepService: ViaCepService
  ) {
    this.initializeForm();
  }

  private formatCep(cep: string): string {
    if (!cep) return '';
    cep = cep.replace(/\D/g, '');
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }

  private initializeForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      zip_code: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      address: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      neighborhood: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required]
    });

    if (this._formData) {
      this.form.patchValue(this._formData);
      
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        control?.updateValueAndValidity();
      });

      this.formValidityChange.emit(this.form.valid);
    }

    this.form.valueChanges.subscribe(value => {
      this.formDataChange.emit(value);
      this.formValidityChange.emit(this.form.valid);
    });

    this.form.get('zip_code')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(cep => cep?.length === 9),
      switchMap(cep => this.viaCepService.getAddressByCep(cep).pipe(
        catchError(error => {
          console.error('Error fetching CEP:', error);
          return of(null);
        })
      ))
    ).subscribe(response => {
      if (response) {
        this.form.patchValue({
          address: response.logradouro,
          complement: response.complemento,
          neighborhood: response.bairro,
          state: response.uf,
          city: response.localidade
        });
      }
    });
  }

  ngOnInit() {
    this.formValidityChange.emit(this.form.valid);
  }
}
