"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { CreateLevelPayload, Level, UpdateLevelPayload } from "@/types/level";

export function useLevels() {
  return useQuery<Level[]>({
    queryKey: ["levels"],
    queryFn: async () => {
      const { data } = await apiClient.get<Level[]>("/admin/levels");
      return data;
    },
  });
}

export function useCreateLevel() {
  const queryClient = useQueryClient();
  return useMutation<Level, Error, CreateLevelPayload>({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post<Level>("/admin/levels", payload);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["levels"] });
    },
  });
}

export function useUpdateLevel() {
  const queryClient = useQueryClient();
  return useMutation<Level, Error, { id: number; payload: UpdateLevelPayload }>({
    mutationFn: async ({ id, payload }) => {
      const { data } = await apiClient.patch<Level>(`/admin/levels/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["levels"] });
    },
  });
}

export function useDeleteLevel() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(`/admin/levels/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["levels"] });
    },
  });
}
