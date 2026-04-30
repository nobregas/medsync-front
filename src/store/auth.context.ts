import { createContext } from "react";

import type { LoginCredentials, User } from "@/features/auth/types";

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
