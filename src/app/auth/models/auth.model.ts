export interface LoginRequest {
  cpf: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface User {
  id: string;
  full_name: string;
  preferred_name: string;
  email: string;
  phone: string;
  user_type: string;
  email_verified: boolean;
  picture_url: string;
  cpf: string;
  birth_date: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  number: string;
  complement: string;
  neighborhood: string;
  profile: Profile;
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