"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { CreateTicketPayload, CreateTicketResponse, Ticket, TicketComment, TicketWithComments } from "@/types/ticket";

export function useTickets() {
  return useQuery<Ticket[]>({
    queryKey: ["tickets"],
    queryFn: async () => {
      const { data } = await apiClient.get<Ticket[]>("/tickets");
      return data;
    },
  });
}

export function useTicket(id: string) {
  return useQuery<Ticket>({
    queryKey: ["tickets", id],
    queryFn: async () => {
      const { data } = await apiClient.get<Ticket>(`/tickets/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useTechnicianTickets(technicianId: string | undefined) {
  return useQuery<Ticket[]>({
    queryKey: ["tickets", "technician", technicianId],
    queryFn: async () => {
      const { data } = await apiClient.get<Ticket[]>(`/tickets/technician/${technicianId}`);
      return data;
    },
    enabled: !!technicianId,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation<CreateTicketResponse, Error, CreateTicketPayload>({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post<CreateTicketResponse>("/tickets", payload);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tickets", "my"] });
    },
  });
}

export function useMyTickets() {
  return useQuery<Ticket[]>({
    queryKey: ["tickets", "my"],
    queryFn: async () => {
      const { data } = await apiClient.get<Ticket[]>("/tickets/my-tickets");
      return data;
    },
  });
}

export function useAdminTickets(filters?: { tecnico_id?: string; estado?: string; nivel?: string }) {
  return useQuery<Ticket[]>({
    queryKey: ["tickets", "admin", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.tecnico_id) params.set("tecnico_id", filters.tecnico_id);
      if (filters?.estado) params.set("estado", filters.estado);
      if (filters?.nivel) params.set("nivel", filters.nivel);
      const { data } = await apiClient.get<Ticket[]>(`/tickets/admin?${params.toString()}`);
      return data;
    },
  });
}

export function useResolveTicket() {
  const queryClient = useQueryClient();
  return useMutation<Ticket, Error, string>({
    mutationFn: async (ticketId) => {
      const { data } = await apiClient.patch<Ticket>(`/tickets/${ticketId}/resolve`);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useAddAttachments() {
  return useMutation<void, Error, { ticketId: string; files: File[] }>({
    mutationFn: async ({ ticketId, files }) => {
      const form = new FormData();
      files.forEach((f) => form.append("files", f));
      await apiClient.post(`/tickets/${ticketId}/attachments`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  });
}

export function useCancelTicket() {
  const queryClient = useQueryClient();
  return useMutation<Ticket, Error, string>({
    mutationFn: async (ticketId) => {
      const { data } = await apiClient.patch<Ticket>(`/tickets/${ticketId}/cancel`);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tickets", "my"] });
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (ticketId) => {
      await apiClient.delete(`/tickets/${ticketId}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tickets", "my"] });
    },
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();
  return useMutation<Ticket, Error, { ticketId: string; estado: string }>({
    mutationFn: async ({ ticketId, estado }) => {
      const { data } = await apiClient.patch<Ticket>(`/tickets/${ticketId}/status`, { estado });
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useUserResponseTicket() {
  const queryClient = useQueryClient();
  return useMutation<Ticket, Error, string>({
    mutationFn: async (ticketId) => {
      const { data } = await apiClient.patch<Ticket>(`/tickets/${ticketId}/user-response`);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tickets", "my"] });
    },
  });
}

export function useTicketWithComments(id: string) {
  return useQuery<TicketWithComments>({
    queryKey: ["tickets", id, "comments"],
    queryFn: async () => {
      const { data } = await apiClient.get<TicketWithComments>(`/tickets/${id}/with-comments`);
      return data;
    },
    enabled: !!id,
  });
}

export function useAddComment(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation<TicketComment, Error, { body: string; files?: File[] }>({
    mutationFn: async ({ body, files = [] }) => {
      const form = new FormData();
      form.append("body", body);
      files.forEach((f) => form.append("files", f));
      const { data } = await apiClient.post<TicketComment>(`/tickets/${ticketId}/comments`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tickets", ticketId, "comments"] });
    },
  });
}
