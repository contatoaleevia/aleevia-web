export interface Address extends AddressResponse {
    sourceId: string;
    sourceType: {
      userTypeId: number;
    };
    name?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    complement?: string;
    type: string;
}

export interface AddressResponse {
    id: string;
    street: string;
    number: string;
}