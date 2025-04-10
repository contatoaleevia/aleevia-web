export interface BaseUser {
  id: string;
  full_name: string;
  preferred_name: string;
  email: string;
  phone: string;
  user_type: string;
  email_verified: boolean;
  picture_url: string | null;
  cpf: string;
  gender?: string;
  pre_registered: boolean;
}

export interface Address {
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
}

export interface ProfessionalInfo {
  profession?: string;
  profession_id?: string;
  specialty?: string;
  specialty_id?: string;
  subspecialty?: string;
  subspecialty_id?: string;
  crm_state?: string;
  crm_number?: string;
  cnpj?: string;
  legal_name?: string;
  feegow_token?: string;
}

export interface SocialInfo {
  website?: string;
  instagram?: string;
  bio?: string;
}

export interface User extends BaseUser, Address, ProfessionalInfo, SocialInfo {
  birth_date?: string;
}

export interface UserUpdateRequest extends Partial<BaseUser>, Partial<Address>, Partial<ProfessionalInfo>, Partial<SocialInfo> {
  password?: string;
  password_confirmation?: string;
}

export interface UserUpdateResponse extends BaseUser, ProfessionalInfo, SocialInfo {
  id: string;
  cpf: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  preferred_name: string;
  picture_url: string | null;
  profession: string;
  profession_id: string;
  specialty: string;
  specialty_id: string;
  subspecialty: string;
  subspecialty_id: string;
  crm_state: string;
  crm_number: string;
  cnpj: string;
  legal_name: string;
  website: string;
  instagram: string;
  bio: string;
}

export interface UserUpdateApiResponse {
  message: string;
  user: UserUpdateResponse;
}

export interface FileUploadResponse {
  url: string;
} 