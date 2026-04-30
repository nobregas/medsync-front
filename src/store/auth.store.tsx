import { useState, type ReactNode } from "react";

import type { LoginCredentials, User } from "@/features/auth/types";
import { login as loginService } from "@/services/auth.service";

import { AuthContext, type AuthContextType } from "./auth.context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await loginService(credentials);
      setUser(response.user);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
