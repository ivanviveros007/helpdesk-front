"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { CreateTechnicianPayload, Technician, UpdateTechnicianPayload } from "@/types/technician";

export function useTechnicians() {
  return useQuery<Technician[]>({
    queryKey: ["technicians"],
    queryFn: async () => {
      const { data } = await apiClient.get<Technician[]>("/admin/technicians");
      return data;
    },
  });
}

export function useCreateTechnician() {
  const queryClient = useQueryClient();
  return useMutation<Technician, Error, CreateTechnicianPayload>({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post<Technician>("/admin/technicians", payload);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
  });
}

export function useUpdateTechnician() {
  const queryClient = useQueryClient();
  return useMutation<Technician, Error, { id: string; payload: UpdateTechnicianPayload }>({
    mutationFn: async ({ id, payload }) => {
      const { data } = await apiClient.patch<Technician>(`/admin/technicians/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
  });
}

export function useDeleteTechnician() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await apiClient.delete(`/admin/technicians/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
  });
}
