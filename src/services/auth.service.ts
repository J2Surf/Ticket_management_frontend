import { api } from "./api";

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  status: string;
  last_login: string;
  last_activity: string;
  phone: string;
  failed_login_attempts: number;
  last_login_attempt: string;
  roles: Role[];
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  status: string;
  last_login: string;
  last_activity: string;
  phone: string;
  failed_login_attempts: number;
  last_login_attempt: string;
  password_changed_at: string | null;
  roles: Role[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  accessToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  role: string;
  phone: string;
}

class AuthService {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  }
}

export const authService = new AuthService();
