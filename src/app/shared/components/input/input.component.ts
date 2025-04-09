import { AfterViewInit, Component, Input, forwardRef, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor, OnInit, OnChanges, AfterViewInit {
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() mask: string = '';
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() class: string = '';
  @Input() maxLength: number | null = null;
  @Input() value: string = '';
  @Input() bgColor: string = '';
  @Input() options: any[] = [];
  @Input() optionLabel: string = 'name';
  @Input() optionValue: string = 'id';
  @Input() inputType: 'text' | 'select' | 'textarea' = 'text';
  @Input() rows: number = 4;
  @Input() errorMessage: string | null = null;
  @Output() onChange = new EventEmitter<any>();
  
  internalValue: string = '';
  isDisabled: boolean = false;
  isFocused: boolean = false;
  showPassword: boolean = false;
  
  private onChangeCallback: (_: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};
  
  constructor(
    private cdr: ChangeDetectorRef,
  ) {}
  
  get isTextarea(): boolean {
    return this.inputType === 'textarea';
  }
  
  get isSelectInput(): boolean {
    return this.inputType === 'select';
  }
  
  get isRegularInput(): boolean {
    return !this.isSelectInput && !this.isTextarea;
  }

  ngOnInit(): void {
    this.updateInternalValue();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && changes['value'].currentValue !== undefined) {
      this.internalValue = changes['value'].currentValue;
      this.cdr.detectChanges();
    }
    
    if (changes['options'] && changes['options'].currentValue) {
      this.cdr.detectChanges();
    }
  }
  
  ngAfterViewInit(): void {
    if (this.value) {
      this.internalValue = this.value;
      this.cdr.detectChanges();
    }
  }
  
  private updateInternalValue(): void {
    if (this.value !== undefined && this.value !== null) {
      this.internalValue = this.value;
    }
  }

  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this.internalValue = value;
      this.cdr.detectChanges();
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
  
  get inputStyle() {
    if (this.isDisabled || this.disabled) {
      return { 'background-color': '#e9ecef' };
    }
    return this.bgColor ? { 'background-color': this.bgColor } : {};
  }

  onFocus(): void {
    this.isFocused = true;
    this.onTouchedCallback();
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouchedCallback();
  }

  updateValue(event: any): void {
    const value = event.target.value;
    this.internalValue = value;
    this.onChangeCallback(value);
    this.onChange.emit(value);
  }

  selectOption(event: any): void {
    const value = event.target.value;
    this.internalValue = value;
    this.onChangeCallback(value);
    this.onChange.emit(value);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
