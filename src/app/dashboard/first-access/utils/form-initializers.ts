import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidators } from '@shared/validators/form.validators';

export class FormInitializers {
  static initPersonalInfoForm(fb: FormBuilder, currentUserCpf?: string): FormGroup {
    const form = fb.group({
      cpf: [{ value: '', disabled: false }, [Validators.required, FormValidators.cpfMaskValidator]],
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      preferred_name: ['']
    });

    if (currentUserCpf) {
      form.get('cpf')?.disable();
      form.patchValue({ cpf: currentUserCpf });
    }

    return form;
  }

  static initProfessionalInfoForm(fb: FormBuilder): FormGroup {
    return fb.group({
      profession: ['', Validators.required],
      specialty: [{ value: '', disabled: true }, Validators.required],
      subspecialties: [{ value: '', disabled: true }],
      councilState: ['', Validators.required],
      councilNumber: ['', Validators.required],
      cnpj: ['', Validators.required],
      companyName: ['', Validators.required]
    });
  }

  static initSocialInfoForm(fb: FormBuilder): FormGroup {
    return fb.group({
      website: [''],
      instagram: [''],
      about: ['']
    });
  }

  static initSecurityForm(fb: FormBuilder): FormGroup {
    return fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      pre_register: [false]
    }, { validators: FormValidators.passwordMatchValidator });
  }
} 