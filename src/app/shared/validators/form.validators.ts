import { AbstractControl, ValidationErrors } from '@angular/forms';

export class FormValidators {
  static passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      control.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }

  static cpfMaskValidator(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value;
    const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfPattern.test(cpf) ? null : { invalidCpf: true };
  }
} 