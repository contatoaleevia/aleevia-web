export interface FormData {
  personalInfo: {
    cpf: string;
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    preferred_name: string;
  };
  professionalInfo: {
    profession: string;
    specialty: string;
    subspecialties: string;
    councilState: string;
    councilNumber: string;
    cnpj: string;
    companyName: string;
  };
  socialInfo: {
    website: string;
    instagram: string;
    about: string;
    profileImage?: File;
  };
  security: {
    password: string;
    confirmPassword: string;
  };
} 