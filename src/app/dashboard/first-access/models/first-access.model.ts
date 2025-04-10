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
  profileImage?: File;
}

export interface SecurityForm {
  password: string;
  confirmPassword: string;
} 