"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { TicketList } from "@/components/tickets/TicketList";
import { useAuth } from "@/hooks/useAuth";
import { useTechnicianTickets, useResolveTicket } from "@/hooks/useTickets";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { TicketUpdatedPayload } from "@/types/websocket-events";

export function TechnicianDashboardScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const { data: tickets = [], isLoading } = useTechnicianTickets(user?.id);
  const { mutate: resolveTicket } = useResolveTicket();

  // Realtime: when a ticket is assigned to this technician, refresh the list
  useWebSocket(
    "ticket:assigned_to_you",
    (_payload: TicketUpdatedPayload) => {
      void queryClient.invalidateQueries({ queryKey: ["tickets", "technician", user?.id] });
    },
    user?.id
  );

  const handleResolve = (ticketId: string) => {
    setResolvingId(ticketId);
    resolveTicket(ticketId, {
      onSettled: () => setResolvingId(null),
    });
  };

  const openTickets = tickets.filter((t) => t.estado !== "RESUELTO");
  const resolvedTickets = tickets.filter((t) => t.estado === "RESUELTO");

  return (
    <div className="flex flex-col gap-8">
      <Header
        title="Mis tickets"
        description={`${openTickets.length} ticket${openTickets.length !== 1 ? "s" : ""} abierto${openTickets.length !== 1 ? "s" : ""}`}
      />

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Abiertos
        </h2>
        <TicketList
          tickets={openTickets}
          isLoading={isLoading}
          onResolve={handleResolve}
          resolvingId={resolvingId}
          showReasoning
          emptyMessage="No tenés tickets abiertos asignados."
        />
      </section>

      {resolvedTickets.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Resueltos
          </h2>
          <TicketList
            tickets={resolvedTickets}
            isLoading={false}
            emptyMessage=""
          />
        </section>
      )}
    </div>
  );
}
