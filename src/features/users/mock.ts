import type { User } from "./types";

export const usersListMock: User[] = [
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
    createdAt: "2026-01-15",
    updatedAt: "2026-01-15",
  },
  {
    id: "3",
    name: "Carlos Silva",
    email: "carlos@medsync.com",
    cpf: "345.678.901-22",
    role: "receptionist",
    createdAt: "2026-02-01",
    updatedAt: "2026-02-01",
  },
  {
    id: "4",
    name: "Dr. Roberto Carlos",
    email: "roberto@medsync.com",
    cpf: "456.789.012-33",
    role: "doctor",
    createdAt: "2026-02-10",
    updatedAt: "2026-02-10",
  },
  {
    id: "5",
    name: "Dra. Paula Ferreira",
    email: "paula@medsync.com",
    cpf: "567.890.123-44",
    role: "doctor",
    createdAt: "2026-02-20",
    updatedAt: "2026-02-20",
  },
  {
    id: "6",
    name: "Mariana Souza",
    email: "mariana@medsync.com",
    cpf: "678.901.234-55",
    role: "receptionist",
    createdAt: "2026-03-01",
    updatedAt: "2026-03-01",
  },
];

export function getUserById(id: string): User | undefined {
  return usersListMock.find((u) => u.id === id);
}

export function getUsersByRole(role: string): User[] {
  return usersListMock.filter((u) => u.role === role);
}

export function getDoctors(): User[] {
  return usersListMock.filter((u) => u.role === "doctor");
}

export function checkEmailExists(email: string, excludeId?: string): boolean {
  return usersListMock.some(
    (u) => u.email === email && u.id !== excludeId,
  );
}

export function checkCpfExists(cpf: string, excludeId?: string): boolean {
  const cleanCpf = cpf.replace(/\D/g, "");
  return usersListMock.some(
    (u) => u.cpf.replace(/\D/g, "") === cleanCpf && u.id !== excludeId,
  );
}