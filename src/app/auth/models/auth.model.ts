export interface LoginRequest {
  cpf: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  cpf?: string;
  role?: string;
  picture?: string;
} 