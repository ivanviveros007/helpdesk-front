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
