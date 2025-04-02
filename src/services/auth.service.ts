import { api } from "./api";

export interface User {
  id: string;
  email: string;
  role: "CUSTOMER" | "FULFILLER";
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
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
