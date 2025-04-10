export interface Subspecialty {
  id: string;
  name: string;
}

export interface Specialty {
  id: string;
  name: string;
  subspecialties: Subspecialty[];
}

export interface Profession {
  id: string;
  name: string;
  specialties: Specialty[];
}

export interface ProfessionsResponse {
  professions: Profession[];
} 