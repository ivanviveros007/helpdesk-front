"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { Invitation, InviteInfo } from "@/types/invitation";

export function useInvitations() {
  return useQuery<Invitation[]>({
    queryKey: ["invitations"],
    queryFn: async () => {
      const { data } = await apiClient.get<Invitation[]>("/admin/invitations");
      return data;
    },
  });
}

export function useCreateInvitation() {
  const queryClient = useQueryClient();
  return useMutation<Invitation, Error, { email: string }>({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post<Invitation>("/admin/invitations", payload);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
}

export function useResendInvitation() {
  const queryClient = useQueryClient();
  return useMutation<Invitation, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      const { data } = await apiClient.post<Invitation>(`/admin/invitations/${id}/resend`);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
}

export function useDeleteInvitation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      await apiClient.delete(`/admin/invitations/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
}

export function useValidateInvite(token: string | null) {
  return useQuery<InviteInfo>({
    queryKey: ["invite", token],
    queryFn: async () => {
      const { data } = await apiClient.get<InviteInfo>(`/auth/invite/${token}`);
      return data;
    },
    enabled: !!token,
    retry: false,
  });
}
