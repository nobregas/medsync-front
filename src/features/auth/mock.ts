import type { User } from "./types";

export const usersMock: User[] = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@medsync.com",
    cpf: "123.456.789-00",
    role: "admin",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
  {
    id: "2",
    name: "Dr. Ana Martins",
    email: "ana@medsync.com",
    cpf: "234.567.890-11",
    role: "doctor",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
  {
    id: "3",
    name: "Carlos Silva",
    email: "recepcionista@recepcionista.com",
    cpf: "345.678.901-22",
    role: "receptionist",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
];

export const loginCredentials = [
  { email: "admin@medsync.com", password: "admin123", role: "admin" as const },
  { email: "ana@medsync.com", password: "doctor123", role: "doctor" as const },
  { email: "recepcionista@recepcionista.com", password: "123456", role: "receptionist" as const },
];

export function authenticateUser(email: string, password: string): User | null {
  const credential = loginCredentials.find(
    (c) => c.email === email && c.password === password,
  );
  
  if (!credential) return null;
  
  return usersMock.find((u) => u.role === credential.role) ?? null;
}