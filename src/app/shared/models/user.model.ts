export interface User {
  id: string;
  full_name: string;
  preferred_name: string;
  email: string;
  phone: string;
  user_type: string;
  email_verified: boolean;
  picture_url: string | null;
  cpf: string;
  birth_date?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  gender?: string;
  crm_state?: string;
  crm_number?: string;
  cnpj?: string;
  legal_name?: string;
  website?: string;
  instagram?: string;
  bio?: string;
  specialty_id?: string;
  specialty?: string;
  subspecialty_id?: string;
  profession_id?: string;
  doctor_specialty_id?: string;
  doctor_subspecialty_id?: string;
  profile?: Profile;
}

export interface Profile {
  id: string;
  gender: string | null;
  profession: string | null;
  insurance: string;
  insurance_id: string;
  plan: string | null;
  plan_id: string | null;
  biological_sex: string | null;
  weight: number | null;
  height: number | null;
  blood_type: string | null;
  organ_donor: boolean | null;
  drinks_alcohol: boolean | null;
  drinking_frequency: string | null;
  smokes: boolean | null;
  smoking_frequency: string | null;
  exercises: boolean | null;
  exercise_frequency: string | null;
}

export interface UserUpdateResponse {
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

export interface FileUploadResponse {
  url: string;
} 