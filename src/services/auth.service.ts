import type { User } from "@/features/auth/types";

export interface LoginResponse {
  user: User;
  token: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const loginCredentials = [
    { email: "admin@medsync.com", password: "admin123", role: "admin" as const },
    { email: "ana@medsync.com", password: "doctor123", role: "doctor" as const },
    { email: "carlos@medsync.com", password: "recep123", role: "receptionist" as const },
  ];

  const usersMock: User[] = [
    { id: "1", name: "Administrador", email: "admin@medsync.com", cpf: "123.456.789-00", role: "admin", createdAt: "2026-01-01", updatedAt: "2026-01-01" },
    { id: "2", name: "Dr. Ana Martins", email: "ana@medsync.com", cpf: "234.567.890-11", role: "doctor", createdAt: "2026-01-01", updatedAt: "2026-01-01" },
    { id: "3", name: "Carlos Silva", email: "carlos@medsync.com", cpf: "345.678.901-22", role: "receptionist", createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  ];
  
  const credential = loginCredentials.find(
    (c) => c.email === email && c.password === password,
  );
  
  if (!credential) {
    throw new Error("Credenciais inválidas");
  }
  
  const user = usersMock.find((u) => u.role === credential.role);
  if (!user) {
    throw new Error("Usuário não encontrado");
  }
  
  return {
    user,
    token: "mock-jwt-token-" + user.id,
  };
}

export async function logout(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
}

export async function getCurrentUser(): Promise<User | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const storedUser = localStorage.getItem("medsync_user");
  if (!storedUser) return null;
  
  return JSON.parse(storedUser);
}