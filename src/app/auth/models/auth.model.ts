import { User } from '@shared/models/user.model';

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  email: string;
  userName: string;
  user: User;
}

export interface ForgotPasswordResponse {
  email: string;
  message: string;
  document: string;
}
