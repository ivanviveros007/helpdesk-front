"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

export interface AdminUser {
  id: string;
  nombre: string;
  email: string;
  role: string;
  estado_activo: boolean;
  created_at: string;
}

export function useAdminUsers() {
  return useQuery<AdminUser[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await apiClient.get<AdminUser[]>("/admin/users");
      return data;
    },
  });
}
