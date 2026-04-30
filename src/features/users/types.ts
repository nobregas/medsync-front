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

export type UserFormData = Omit<User, "id" | "createdAt" | "updatedAt">;

export const roleLabels = {
  admin: "Administrador",
  doctor: "Médico",
  receptionist: "Recepcionista",
} as const;