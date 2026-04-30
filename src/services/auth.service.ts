import { authenticateUser } from "@/features/auth/mock";
import type { LoginCredentials, User } from "@/features/auth/types";

export interface LoginResponse {
  user: User;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const user = authenticateUser(credentials.email, credentials.password);

  if (!user) {
    throw new Error("E-mail ou senha incorretos.");
  }

  return { user };
}
