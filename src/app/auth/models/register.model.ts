export interface RegistrationData {
    name: string;
    cpf: string;
    cnpj: string;
    phoneNumber: string;
    email: string;
    corporateName: string;
    isCompany: boolean;
}


export interface IsRegisteredResponse {
    isRegistered: boolean;
    userId: string;
}

export interface RegisterUserPayload {
    password: string;
    name: string;
    cpf: string;
    cnpj?: string;
    phoneNumber: string;
    email: string;
    manager: {
        typeId: number;
        corporateName?: string;
    };
}