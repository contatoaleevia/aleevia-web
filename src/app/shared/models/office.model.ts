import { Address } from "./address.model";

export interface OfficeAddress {
  id: string;
  addressId: string;
  isTeleconsultation: boolean;
  isActive: boolean;
  address: Address;
}

export interface OfficeProfessional {
  id: string;
  professionalId: string;
  isPublic: boolean;
  isActive: boolean;
  professional: {
    id: string;
    name: string;
    preferredName: string;
    email: string;
    cpf: string;
    cnpj: string | null;
    website: string | null;
    instagram: string | null;
    biography: string | null;
    isRegistered: boolean;
    registerStatus: string;
    specialtyDetails: any[];
    documents: any[];
  };
}

export interface Office {
  id?: string;
  ownerId?: string;
  name: string;
  cnpj?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  site?: string;
  instagram?: string;
  logo?: string;
  individual?: boolean;
  addresses?: OfficeAddress[];
  professionals?: OfficeProfessional[];
  // Legacy fields to ensure backward compatibility
  phoneNumber?: string;
}

export interface OfficeResponse {
  office: Office;
}
