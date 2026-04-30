import type { UserRole } from "@/types/role";

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}