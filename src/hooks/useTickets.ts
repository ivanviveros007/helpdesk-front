"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { CreateTicketPayload, CreateTicketResponse, Ticket } from "@/types/ticket";

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
  return useMutation<CreateTicketResponse, Error, CreateTicketPayload>({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post<CreateTicketResponse>("/tickets", payload);
      return data;
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
