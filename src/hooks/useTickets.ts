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
