import { PersonalInfoForm, ProfessionalInfoForm, SocialInfoForm, SecurityForm } from '../models/first-access.model';
import { UserUpdateRequest } from '../../../shared/models/user.model';

export class FormDataFormatter {
  static formatFormData(
    formData: PersonalInfoForm | ProfessionalInfoForm | SocialInfoForm | SecurityForm,
    currentStep: number,
    tempProfilePictureUrl: string | null
  ): UserUpdateRequest {
    switch (currentStep) {
      case 1: {
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
      case 2: {
        const professionalData = formData as ProfessionalInfoForm;
        return {
          profession_id: professionalData.profession,
          specialty_id: professionalData.specialty,
          subspecialty_id: professionalData.subspecialties,
          crm_state: professionalData.councilState,
          crm_number: professionalData.councilNumber,
          cnpj: professionalData.cnpj,
          legal_name: professionalData.companyName
        };
      }
      case 3: {
        const socialData = formData as SocialInfoForm;
        return {
          website: socialData.website,
          instagram: socialData.instagram,
          bio: socialData.about,
          picture_url: tempProfilePictureUrl || null
        };
      }
      case 4: {
        const securityData = formData as SecurityForm;
        return {
          password: securityData.password,
          password_confirmation: securityData.confirmPassword,
          pre_registered: true
        };
      }
      default:
        return {};
    }
  }
} 