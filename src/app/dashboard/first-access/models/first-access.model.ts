import { AbstractControl } from "@angular/forms";

export interface FormData {
  personalInfo: PersonalInfoForm;
  professionalInfo: ProfessionalInfoForm;
  socialInfo: SocialInfoForm;
  security: SecurityForm;
}

export interface PersonalInfoForm {
  cpf: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  preferred_name: string;
}

export interface ProfessionalInfoForm {
  profession: string;
  specialty: string;
  subspecialties: string;
  councilState: string;
  councilNumber: string;
  cnpj: string;
  companyName: string;
}

export interface SocialInfoForm {
  website: string;
  instagram: string;
  about: string;
  profileImage?: string;
}

export interface SecurityForm {
  password: string;
  confirmPassword: string;
}

export interface PersonalInfoFormControls {
  cpf: AbstractControl<string>;
  full_name: AbstractControl<string>;
  email: AbstractControl<string>;
  phone: AbstractControl<string>;
  gender: AbstractControl<string>;
  preferred_name: AbstractControl<string>;
}

export interface ProfessionalInfoFormControls {
  profession: AbstractControl<string>;
  specialty: AbstractControl<string>;
  subspecialties: AbstractControl<string>;
  councilState: AbstractControl<string>;
  councilNumber: AbstractControl<string>;
  cnpj: AbstractControl<string>;
  companyName: AbstractControl<string>;
}

export interface SocialInfoFormControls {
  website: AbstractControl<string>;
  instagram: AbstractControl<string>;
  about: AbstractControl<string>;
  profileImage?: AbstractControl<string>;
}

export interface SecurityFormControls {
  password: AbstractControl<string>;
  confirmPassword: AbstractControl<string>;
  pre_register: AbstractControl<boolean>;
} 