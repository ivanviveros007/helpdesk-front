"use client";

import { createContext, useCallback, useState, type ReactNode } from "react";
import apiClient from "@/lib/api-client";
import type { AuthUser } from "@/types/technician";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  nombre: string;
  email: string;
  password: string;
  invite_token?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;

  logout: () => void;
}

function redirectByRole(role: string) {
  if (role === "user") window.location.href = "/client/my-tickets";
  else if (role === "admin") window.location.href = "/admin/tickets";
  else window.location.href = "/technician";
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("auth_user");
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async ({ email, password }: LoginPayload) => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.post<{ access_token: string; user: AuthUser }>(
        "/auth/login",
        { email, password }
      );
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      setUser(data.user);
      redirectByRole(data.user.role);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async ({ nombre, email, password, invite_token }: RegisterPayload) => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.post<{ access_token: string; user: AuthUser }>(
        "/auth/register",
        { nombre, email, password, ...(invite_token ? { invite_token } : {}) }
      );
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      setUser(data.user);
      window.location.href = "/client/my-tickets";
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_user");
    setUser(null);
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
