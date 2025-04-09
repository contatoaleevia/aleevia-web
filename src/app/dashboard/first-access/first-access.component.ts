import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { InputComponent } from '../../shared/components/input/input.component';
import { FormComponent } from '../../shared/components/form/form.component';
import { AuthService } from '../../auth/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { brazilianStates } from '../../shared/data/brazilian-states';
import { FormData } from './models/first-access.model';
import { ProfessionsService } from '../../shared/services/professions.service';
import { UserService } from '../../shared/services/user.service';
import { Profession, Specialty, Subspecialty, ProfessionsResponse } from '../../shared/models/profession.model';

interface PersonalInfoForm {
  cpf: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  preferred_name: string;
}

interface ProfessionalInfoForm {
  profession: string;
  specialty: string;
  subspecialties: string;
  councilState: string;
  councilNumber: string;
  cnpj: string;
  companyName: string;
}

interface SocialInfoForm {
  website: string;
  instagram: string;
  about: string;
}

interface SecurityForm {
  password: string;
  confirmPassword: string;
}

interface FileUploadResponse {
  url: string;
}

interface UserUpdateResponse {
  id: string;
  cpf: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  preferred_name: string;
  picture_url: string | null;
  profession_id: string;
  doctor_specialty_id: string;
  doctor_subspecialty_id: string;
  crm_state: string;
  crm_number: string;
  cnpj: string;
  legal_name: string;
  website: string;
  instagram: string;
  bio: string;
}

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

  private userCpfSubject = new BehaviorSubject<string>('');
  userCpf$ = this.userCpfSubject.asObservable();

  personalInfoForm!: FormGroup;
  professionalInfoForm!: FormGroup;
  socialInfoForm!: FormGroup;
  securityForm!: FormGroup;

  professions: Profession[] = [];
  specialties: Specialty[] = [];
  subspecialties: Subspecialty[] = [];

  brazilianStates = brazilianStates;

  genderOptions = [
    { value: 'Homem Cis', label: 'Homem Cis' },
    { value: 'Mulher Cis', label: 'Mulher Cis' },
    { value: 'Mulher Trans', label: 'Mulher Trans' },
    { value: 'Homem Trans', label: 'Homem Trans' },
    { value: 'Não Binário', label: 'Não Binário' },
    { value: 'Prefiro não dizer', label: 'Prefiro não dizer' },
    { value: 'Outros', label: 'Outros' }
  ];

  errorMessages = {
    required: 'Este campo é obrigatório.',
    email: 'Por favor, insira um e-mail válido.',
    minlength: 'Este campo deve ter pelo menos 8 caracteres.',
    mismatch: 'As senhas não coincidem.',
    invalidCpf: 'CPF inválido.'
  };

  ngOnInit() {
    this.initForms();
    this.loadProfessions();
  }

  private initForms() {
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

    this.professionalInfoForm = this.fb.group({
      profession: ['', Validators.required],
      specialty: [{ value: '', disabled: true }, Validators.required],
      subspecialties: [{ value: '', disabled: true }],
      councilState: ['', Validators.required],
      councilNumber: ['', Validators.required],
      cnpj: ['', Validators.required],
      companyName: ['', Validators.required]
    });

    this.socialInfoForm = this.fb.group({
      website: [''],
      instagram: [''],
      about: ['']
    });

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

  private loadUserData() {
    const currentUser = this.authService.currentUser;

    if (currentUser) {
      this.profilePictureUrl = currentUser.picture_url || null;
      
      this.personalInfoForm.patchValue({
        cpf: currentUser.cpf || '',
        full_name: currentUser.full_name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        gender: currentUser.gender || '',
        preferred_name: currentUser.preferred_name || ''
      });

      if (currentUser.cpf) {
        this.personalInfoForm.get('cpf')?.disable();
        this.userCpfSubject.next(currentUser.cpf);
      }

      this.professionalInfoForm.patchValue({
        councilState: currentUser.crm_state || '',
        councilNumber: currentUser.crm_number || '',
        cnpj: currentUser.cnpj || '',
        companyName: currentUser.legal_name || ''
      });

      this.socialInfoForm.patchValue({
        website: currentUser.website || '',
        instagram: currentUser.instagram || '',
        about: currentUser.bio || ''
      });

      if (currentUser.specialty_id) {
        this.professionsService.getProfessions().subscribe({
          next: (response: ProfessionsResponse) => {
            this.professions = response.professions || [];
            
            for (const profession of this.professions) {
              const specialty = profession.specialties.find(s => s.id === currentUser.specialty_id);
              if (specialty) {
                this.professionalInfoForm.patchValue({
                  profession: profession.id
                });
                
                this.specialties = profession.specialties;
                this.professionalInfoForm.get('specialty')?.enable();
                
                this.professionalInfoForm.patchValue({
                  specialty: specialty.id
                });
                
                if (specialty.subspecialties && specialty.subspecialties.length > 0) {
                  this.subspecialties = specialty.subspecialties;
                  this.professionalInfoForm.get('subspecialties')?.enable();
                }
                
                break;
              }
            }
            
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Error loading professions:', error);
          }
        });
      }
    } else {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          
          this.profilePictureUrl = user.picture_url || null;
          
          this.userCpfSubject.next(user.cpf);
          
          this.personalInfoForm.patchValue({
            cpf: user.cpf || '',
            full_name: user.full_name || '',
            email: user.email || '',
            phone: user.phone || '',
            gender: user.gender || '',
            preferred_name: user.preferred_name || ''
          });
          
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
                    this.professionalInfoForm.patchValue({
                      profession: profession.id
                    });
                    
                    this.specialties = profession.specialties;
                    this.professionalInfoForm.get('specialty')?.enable();
                    
                    this.professionalInfoForm.patchValue({
                      specialty: specialty.id
                    });
                    
                    if (specialty.subspecialties && specialty.subspecialties.length > 0) {
                      this.subspecialties = specialty.subspecialties;
                      this.professionalInfoForm.get('subspecialties')?.enable();
                    }
                    
                    break;
                  }
                }
                
                this.cdr.detectChanges();
              },
              error: (error) => {
                console.error('Error loading professions:', error);
              }
            });
          }
        } catch (e) {
          console.error('Erro ao fazer parse do usuário:', e);
        }
      }
    }
  }

  private loadProfessions() {
    this.professionsService.getProfessions().subscribe({
      next: (response: ProfessionsResponse) => {
        this.professions = response.professions || [];
        this.cdr.detectChanges();
        
        this.loadUserData();
      },
      error: (error) => {
        console.error('Error loading professions:', error);
        this.loadUserData();
      }
    });
  }

  onProfessionChange(professionId: string) {
    this.professionalInfoForm.patchValue({
      specialty: '',
      subspecialties: ''
    });
    this.specialties = [];
    this.subspecialties = [];
    
    if (professionId) {
      const selectedProfession = this.professions.find(p => p.id === professionId);
      if (selectedProfession) {
        this.specialties = selectedProfession.specialties;
        this.professionalInfoForm.get('specialty')?.enable();
      }
    } else {
      this.professionalInfoForm.get('specialty')?.disable();
    }
  }

  onSpecialtyChange(specialtyId: string) {
    this.professionalInfoForm.patchValue({
      subspecialties: ''
    });
    this.subspecialties = [];
    
    if (specialtyId) {
      const professionId = this.professionalInfoForm.get('profession')?.value;
      const selectedProfession = this.professions.find(p => p.id === professionId);
      if (selectedProfession) {
        const selectedSpecialty = selectedProfession.specialties.find(s => s.id === specialtyId);
        if (selectedSpecialty) {
          this.subspecialties = selectedSpecialty.subspecialties;
          this.professionalInfoForm.get('subspecialties')?.enable();
        }
      }
    } else {
      this.professionalInfoForm.get('subspecialties')?.disable();
    }
  }

  getStepTitle(step: number): string {
    switch (step) {
      case 1: return 'Dados pessoais';
      case 2: return 'Dados profissionais';
      case 3: return 'Social';
      case 4: return 'Finalizar';
      default: return '';
    }
  }

  getCurrentFormGroup(): FormGroup {
    switch (this.currentStep) {
      case 1: return this.personalInfoForm;
      case 2: return this.professionalInfoForm;
      case 3: return this.socialInfoForm;
      case 4: return this.securityForm;
      default: return this.personalInfoForm;
    }
  }

  onFormSubmit(formData: PersonalInfoForm | ProfessionalInfoForm | SocialInfoForm | SecurityForm) {
    const formattedData = this.formatFormData(formData);
    this.userService.updateUser(formattedData).subscribe({
      next: (response: UserUpdateResponse) => {
        this.updateLocalStorageUser(response);
        if (this.currentStep === this.totalSteps) {
          this.onSubmit();
        }
      },
      error: (error) => {
        console.error('Error sending data:', error);
      }
    });
  }

  nextStep() {
    const currentFormGroup = this.getCurrentFormGroup();
    if (currentFormGroup.valid) {
      const formData = currentFormGroup.value;
      const formattedData = this.formatFormData(formData);
      this.userService.updateUser(formattedData).subscribe({
        next: (response: UserUpdateResponse) => {
          this.updateLocalStorageUser(response);
          this.currentStep++;
        },
        error: (error) => {
          console.error('Error sending data:', error);
        }
      });
    } else {
      currentFormGroup.markAllAsTouched();
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  changeProfileImage() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const formData = new globalThis.FormData();
        formData.append('folder', 'healthai');
        formData.append('file', file);
        
        this.userService.uploadFile(formData).subscribe({
          next: (response: FileUploadResponse) => {
            this.profilePictureUrl = response.url;
            this.updateLocalStorageUser({ picture_url: response.url });
            this.cdr.detectChanges();
            console.log('Profile picture uploaded:', response.url);
          },
          error: (error: Error) => {
            console.error('Error uploading profile picture:', error);
          }
        });
      }
    };
    fileInput.click();
  }

  onSubmit() {
    if (this.securityForm.valid) {
      const formData: FormData = {
        personalInfo: this.personalInfoForm.value,
        professionalInfo: this.professionalInfoForm.value,
        socialInfo: this.socialInfoForm.value,
        security: this.securityForm.value
      };
      
      console.log('Form submitted:', formData);
    } else {
      this.securityForm.markAllAsTouched();
    }
  }

  private updateLocalStorageUser(updates: Partial<UserUpdateResponse>) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const currentUser = JSON.parse(storedUser);
        const updatedUser = { ...currentUser, ...updates };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      } catch (e) {
        console.error('Error updating localStorage user:', e);
      }
    }
  }

  private formatFormData(formData: PersonalInfoForm | ProfessionalInfoForm | SocialInfoForm | SecurityForm): Partial<UserUpdateResponse> {
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
    return formData as Partial<UserUpdateResponse>;
  }
}
