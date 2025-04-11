import { User } from '@shared/models/user.model';

export interface LoginRequest {
  cpf: string;
  password: string;
  fromApp?: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}