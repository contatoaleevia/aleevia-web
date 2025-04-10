import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { InputComponent } from '../../shared/components/input/input.component';
import { FormComponent } from '../../shared/components/form/form.component';
import { AuthService } from '../../auth/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { brazilianStates } from '../../shared/data/brazilian-states';
import { PersonalInfoForm, ProfessionalInfoForm, SocialInfoForm, SecurityForm } from './models/first-access.model';
import { ProfessionsService } from '../../shared/services/professions.service';
import { UserService } from '../../shared/services/user.service';
import { Profession, Specialty, Subspecialty, ProfessionsResponse } from '../../shared/models/profession.model';
import { User, UserUpdateResponse, FileUploadResponse } from '../../shared/models/user.model';
import { GENDER_OPTIONS, ERROR_MESSAGES, STEP_TITLES } from './constants/first-access.constants';

@Component({
  selector: 'app-first-access',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, FormComponent],
  templateUrl: './first-access.component.html',
  styleUrl: './first-access.component.scss'
})
export class FirstAccessComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly professionsService = inject(ProfessionsService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly userService = inject(UserService);

  showModal = true;
  currentStep = 1;
  totalSteps = 4;
  profilePictureUrl: string | null = null;
  professions: Profession[] = [];
  specialties: Specialty[] = [];
  subspecialties: Subspecialty[] = [];
  brazilianStates = brazilianStates;
  genderOptions = GENDER_OPTIONS;
  errorMessages = ERROR_MESSAGES;

  personalInfoForm!: FormGroup;
  professionalInfoForm!: FormGroup;
  socialInfoForm!: FormGroup;
  securityForm!: FormGroup;

  private userCpfSubject = new BehaviorSubject<string>('');
  userCpf$ = this.userCpfSubject.asObservable();

  ngOnInit(): void {
    this.initForms();
    this.loadUserData();
  }

  private initForms(): void {
    this.initPersonalInfoForm();
    this.initProfessionalInfoForm();
    this.initSocialInfoForm();
    this.initSecurityForm();
  }

  private initPersonalInfoForm(): void {
    this.personalInfoForm = this.fb.group({
      cpf: [{ value: '', disabled: false }, [Validators.required, this.cpfMaskValidator]],
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      gender: [''],
      preferred_name: ['']
    });

    const currentUser = this.authService.currentUser;
    if (currentUser?.cpf) {
      this.personalInfoForm.get('cpf')?.disable();
      this.personalInfoForm.patchValue({ cpf: currentUser.cpf });
    }
  }

  private initProfessionalInfoForm(): void {
    this.professionalInfoForm = this.fb.group({
      profession: ['', Validators.required],
      specialty: [{ value: '', disabled: true }, Validators.required],
      subspecialties: [{ value: '', disabled: true }],
      councilState: ['', Validators.required],
      councilNumber: ['', Validators.required],
      cnpj: ['', Validators.required],
      companyName: ['', Validators.required]
    });
  }

  private initSocialInfoForm(): void {
    this.socialInfoForm = this.fb.group({
      website: [''],
      instagram: [''],
      about: ['']
    });
  }

  private initSecurityForm(): void {
    this.securityForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  private cpfMaskValidator(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value;
    const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfPattern.test(cpf) ? null : { invalidCpf: true };
  }

  private loadUserData(): void {
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.loadUserDataFromUser(currentUser);
    } else {
      this.loadUserDataFromLocalStorage();
    }
  }

  private loadUserDataFromLocalStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.loadUserDataFromUser(user);
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
      }
    }
  }

  private loadUserDataFromUser(user: User): void {
    this.profilePictureUrl = user.picture_url || null;
    
    this.personalInfoForm.patchValue({
      cpf: user.cpf || '',
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      gender: user.gender || '',
      preferred_name: user.preferred_name || ''
    });

    if (user.cpf) {
      this.personalInfoForm.get('cpf')?.disable();
      this.userCpfSubject.next(user.cpf);
    }

    this.professionalInfoForm.patchValue({
      councilState: user.crm_state || '',
      councilNumber: user.crm_number || '',
      cnpj: user.cnpj || '',
      companyName: user.legal_name || ''
    });

    this.socialInfoForm.patchValue({
      website: user.website || '',
      instagram: user.instagram || '',
      about: user.bio || ''
    });

    if (user.specialty_id) {
      this.professionsService.getProfessions().subscribe({
        next: (response: ProfessionsResponse) => {
          this.professions = response.professions || [];
          for (const profession of this.professions) {
            const specialty = profession.specialties.find(s => s.id === user.specialty_id);
            if (specialty) {
              this.professionalInfoForm.patchValue({ profession: profession.id });
              this.onProfessionChange(profession.id, true);
              
              this.professionalInfoForm.patchValue({ specialty: specialty.id });
              this.onSpecialtyChange(specialty.id, true);
              
              if (user.subspecialty_id) {
                this.professionalInfoForm.patchValue({ subspecialties: user.subspecialty_id });
              }
              break;
            }
          }
        },
        error: (error) => {
          console.error('Erro ao carregar profissões:', error);
        }
      });
    }
  }

  onProfessionChange(professionId: string, keepValues: boolean = false): void {
    const profession = this.professions.find(p => p.id === professionId);
    if (profession) {
      this.specialties = profession.specialties;
      const specialtyControl = this.professionalInfoForm.get('specialty');
      const subspecialtiesControl = this.professionalInfoForm.get('subspecialties');
      
      if (specialtyControl && subspecialtiesControl) {
        specialtyControl.enable();
        if (!keepValues) {
          specialtyControl.setValue('');
          subspecialtiesControl.disable();
          subspecialtiesControl.setValue('');
        }
      }
    }
  }

  onSpecialtyChange(specialtyId: string, keepValues: boolean = false): void {
    const specialty = this.specialties.find(s => s.id === specialtyId);
    if (specialty) {
      this.subspecialties = specialty.subspecialties;
      const subspecialtiesControl = this.professionalInfoForm.get('subspecialties');
      
      if (subspecialtiesControl) {
        if (this.subspecialties.length > 0) {
          subspecialtiesControl.enable();
          if (!keepValues) {
            subspecialtiesControl.setValue('');
          }
        } else {
          subspecialtiesControl.disable();
          subspecialtiesControl.setValue('');
        }
      }
    }
  }

  getStepTitle(step: number): string {
    return STEP_TITLES[step as keyof typeof STEP_TITLES] || '';
  }

  getCurrentFormGroup(): FormGroup {
    switch (this.currentStep) {
      case 1:
        return this.personalInfoForm;
      case 2:
        return this.professionalInfoForm;
      case 3:
        return this.socialInfoForm;
      case 4:
        return this.securityForm;
      default:
        return this.personalInfoForm;
    }
  }

  onFormSubmit(formData: PersonalInfoForm | ProfessionalInfoForm | SocialInfoForm | SecurityForm): void {
    const currentForm = this.getCurrentFormGroup();
    if (currentForm.valid) {
      if (this.currentStep < this.totalSteps) {
        this.nextStep();
      } else {
        this.onSubmit();
      }
    }
  }

  nextStep(): void {
    const currentForm = this.getCurrentFormGroup();
    if (currentForm.valid && this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.cdr.detectChanges();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.cdr.detectChanges();
    }
  }

  changeProfileImage(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        
        this.userService.uploadFile(formData).subscribe({
          next: (response: FileUploadResponse) => {
            this.profilePictureUrl = response.url;
            this.updateLocalStorageUser({ picture_url: response.url });
          },
          error: (error) => {
            console.error('Erro ao fazer upload da imagem:', error);
          }
        });
      }
    };
    
    input.click();
  }

  onSubmit(): void {
    const formData = {
      ...this.formatFormData(this.personalInfoForm.getRawValue()),
      ...this.formatFormData(this.professionalInfoForm.getRawValue()),
      ...this.formatFormData(this.socialInfoForm.getRawValue()),
      ...this.formatFormData(this.securityForm.getRawValue())
    };

    this.userService.updateUser(formData).subscribe({
      next: (response: UserUpdateResponse) => {
        this.updateLocalStorageUser(response);
      },
      error: (error) => {
        console.error('Erro ao atualizar usuário:', error);
      }
    });
  }

  private updateLocalStorageUser(updates: Partial<UserUpdateResponse>): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const updatedUser = { ...user, ...updates };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      } catch (e) {
        console.error('Erro ao atualizar usuário no localStorage:', e);
      }
    }
  }

  private formatFormData(formData: PersonalInfoForm | ProfessionalInfoForm | SocialInfoForm | SecurityForm): Partial<UserUpdateResponse> {
    if (this.currentStep === 1) {
      const personalData = formData as PersonalInfoForm;
      return {
        cpf: personalData.cpf,
        full_name: personalData.full_name,
        email: personalData.email,
        phone: personalData.phone,
        gender: personalData.gender,
        preferred_name: personalData.preferred_name
      };
    }
    if (this.currentStep === 2) {
      const professionalData = formData as ProfessionalInfoForm;
      return {
        profession_id: professionalData.profession,
        doctor_specialty_id: professionalData.specialty,
        doctor_subspecialty_id: professionalData.subspecialties,
        crm_state: professionalData.councilState,
        crm_number: professionalData.councilNumber,
        cnpj: professionalData.cnpj,
        legal_name: professionalData.companyName
      };
    }
    if (this.currentStep === 3) {
      const socialData = formData as SocialInfoForm;
      return {
        website: socialData.website,
        instagram: socialData.instagram,
        bio: socialData.about
      };
    }
    if (this.currentStep === 4) {
      return {};
    }
    return {};
  }
}
