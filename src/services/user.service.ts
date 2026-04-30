import type { User } from "@/features/users/types";
import type { UserRole } from "@/types/role";
import { usersListMock, getUserById, getDoctors } from "@/features/users/mock";

export async function getUsers(): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return usersListMock;
}

export async function getUser(id: string): Promise<User | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return getUserById(id) ?? null;
}

export async function getAllDoctors(): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getDoctors();
}

export async function checkEmailExists(email: string, excludeId?: string): Promise<boolean> {
  const cleanEmail = email.toLowerCase();
  return usersListMock.some(
    (u) => u.email.toLowerCase() === cleanEmail && u.id !== excludeId,
  );
}

export async function checkCpfExists(cpf: string, excludeId?: string): Promise<boolean> {
  const cleanCpf = cpf.replace(/\D/g, "");
  return usersListMock.some(
    (u) => u.cpf.replace(/\D/g, "") === cleanCpf && u.id !== excludeId,
  );
}

export async function createUser(data: {
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
}): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const emailExists = await checkEmailExists(data.email);
  if (emailExists) {
    throw new Error("E-mail já cadastrado");
  }
  
  const cpfExists = await checkCpfExists(data.cpf);
  if (cpfExists) {
    throw new Error("CPF já cadastrado");
  }
  
  const now = new Date().toISOString().split("T")[0];
  const newUser: User = {
    ...data,
    id: String(Date.now()),
    createdAt: now,
    updatedAt: now,
  };
  
  usersListMock.push(newUser);
  return newUser;
}

export async function updateUser(
  id: string, 
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const index = usersListMock.findIndex((u) => u.id === id);
  if (index === -1) {
    throw new Error("Usuário não encontrado");
  }
  
  if (data.email) {
    const emailExists = await checkEmailExists(data.email, id);
    if (emailExists) {
      throw new Error("E-mail já cadastrado");
    }
  }
  
  if (data.cpf) {
    const cpfExists = await checkCpfExists(data.cpf, id);
    if (cpfExists) {
      throw new Error("CPF já cadastrado");
    }
  }
  
  const updated = {
    ...usersListMock[index],
    ...data,
    updatedAt: new Date().toISOString().split("T")[0],
  };
  
  usersListMock[index] = updated;
  return updated;
}

export async function deleteUser(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const index = usersListMock.findIndex((u) => u.id === id);
  if (index === -1) {
    throw new Error("Usuário não encontrado");
  }
  
  usersListMock.splice(index, 1);
}