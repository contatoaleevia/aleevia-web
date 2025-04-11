import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from '../../auth/services/auth.service';
import { ProfessionsService } from '../../shared/services/professions.service';
import { UserService } from '../../shared/services/user.service';

import { 
  PersonalInfoForm, 
  ProfessionalInfoForm, 
  SocialInfoForm, 
  SecurityForm,
  PersonalInfoFormControls,
  ProfessionalInfoFormControls,
  SocialInfoFormControls,
  SecurityFormControls
} from './models/first-access.model';
import { Profession, Specialty, Subspecialty, ProfessionsResponse } from '../../shared/models/profession.model';
import { User, FileUploadResponse, UserUpdateRequest, UserUpdateApiResponse } from '../../shared/models/user.model';

import { ERROR_MESSAGES, STEP_TITLES } from './constants/first-access.constants';

import { StepperComponent } from './components/stepper/stepper.component';
import { PersonalInfoComponent } from './components/steps/personal-info/personal-info.component';
import { ProfessionalInfoComponent } from './components/steps/professional-info/professional-info.component';
import { SocialInfoComponent } from './components/steps/social-info/social-info.component';
import { SecurityInfoComponent } from './components/steps/security-info/security-info.component';
import { SuccessModalComponent } from './components/steps/success-modal/success-modal.component';

import { FormInitializers } from './utils/form-initializers';
import { FormDataFormatter } from './utils/form-data-formatter';

@Component({
  selector: 'app-first-access',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    StepperComponent,
    PersonalInfoComponent,
    ProfessionalInfoComponent,
    SocialInfoComponent,
    SecurityInfoComponent,
    SuccessModalComponent
  ],
  templateUrl: './first-access.component.html',
  styleUrl: './first-access.component.scss'
})
export class FirstAccessComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly professionsService = inject(ProfessionsService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly userService = inject(UserService);

  personalInfoForm!: FormGroup<PersonalInfoFormControls>;
  professionalInfoForm!: FormGroup<ProfessionalInfoFormControls>;
  socialInfoForm!: FormGroup<SocialInfoFormControls>;
  securityForm!: FormGroup<SecurityFormControls>;

  private userCpfSubject = new BehaviorSubject<string>('');
  userCpf$ = this.userCpfSubject.asObservable();

  showModal: boolean = true;
  currentStep: number = 1;
  isUploading: boolean = false;
  profilePictureUrl: string | null = null;
  tempProfilePictureUrl: string | null = null;

  currentUser: User = {} as User;
  professions: Profession[] = [];
  specialties: Specialty[] = [];
  subspecialties: Subspecialty[] = [];

  errorMessages: { [key: string]: string } = ERROR_MESSAGES;
  stepTitles: { [key: number]: string } = STEP_TITLES;

  ngOnInit(): void {
    this.initForms();
    this.loadUserData();
  }

  private initForms(): void {
    this.personalInfoForm = FormInitializers.initPersonalInfoForm(this.fb, this.currentUser?.cpf);
    this.professionalInfoForm = FormInitializers.initProfessionalInfoForm(this.fb);
    this.socialInfoForm = FormInitializers.initSocialInfoForm(this.fb);
    this.securityForm = FormInitializers.initSecurityForm(this.fb);
  }

  private loadUserData(): void {
    this.currentUser = this.authService.currentUser!;
    if (this.currentUser) {
      this.loadUserDataFromUser(this.currentUser);
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
      this.loadProfessionsData(user);
    }
  }

  private loadProfessionsData(user: User): void {
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

  nextStep(): void {
    const currentForm = this.getCurrentFormGroup();
    if (currentForm.valid && this.currentStep < 5) {
      const formData = this.formatFormData(currentForm.getRawValue());
      this.currentStep++;
      
      this.userService.updateUser(formData).subscribe({
        next: (response: UserUpdateApiResponse) => {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao atualizar usuário:', error);
        }
      });
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.cdr.detectChanges();
    }
  }

  private formatFormData(formData: PersonalInfoForm | ProfessionalInfoForm | SocialInfoForm | SecurityForm): UserUpdateRequest {
    return FormDataFormatter.formatFormData(formData, this.currentStep, this.tempProfilePictureUrl);
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

  changeProfileImage(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.isUploading = true;
        const formData = new FormData();
        formData.append('file', file);
        
        this.userService.uploadFile(formData).subscribe({
          next: (response: FileUploadResponse) => {
            this.tempProfilePictureUrl = response.url;
            this.profilePictureUrl = response.url;
            this.isUploading = false;
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Erro ao fazer upload da imagem:', error);
            this.isUploading = false;
            this.cdr.detectChanges();
          }
        });
      }
    };
    
    input.click();
  }

  onConfigureSchedule(): void {
    console.log('Configuring schedule...');
  }

  onGoToDashboard(): void {
    console.log('Navigating to dashboard...');
  }
}
