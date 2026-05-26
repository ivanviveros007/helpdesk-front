"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { TicketList } from "@/components/tickets/TicketList";
import { useMyTickets, useCancelTicket, useDeleteTicket, useUserResponseTicket } from "@/hooks/useTickets";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import type { TicketUpdatedPayload } from "@/types/websocket-events";

export function ClientDashboardScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const { data: tickets = [], isLoading } = useMyTickets();
  const { mutate: cancelTicket } = useCancelTicket();
  const { mutate: deleteTicket } = useDeleteTicket();
  const { mutate: userResponse } = useUserResponseTicket();

  // Real-time: refresh list when one of the user's tickets changes status
  useWebSocket(
    "ticket:status_changed",
    (_payload: TicketUpdatedPayload) => {
      void queryClient.invalidateQueries({ queryKey: ["tickets", "my"] });
    },
    { userId: user?.id }
  );

  const openTickets = tickets.filter((t) => t.estado !== "RESUELTO" && t.estado !== "CANCELADO");
  const resolvedTickets = tickets.filter((t) => t.estado === "RESUELTO");
  const cancelledTickets = tickets.filter((t) => t.estado === "CANCELADO");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between">
        <Header
          title="Mis tickets"
          description={`${openTickets.length} ticket${openTickets.length !== 1 ? "s" : ""} abierto${openTickets.length !== 1 ? "s" : ""}`}
        />
        <Link href="/client/new-ticket">
          <Button size="sm" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Nuevo ticket
          </Button>
        </Link>
      </div>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Abiertos
        </h2>
        <TicketList
          tickets={openTickets}
          isLoading={isLoading}
          emptyMessage="No tenés tickets abiertos. ¡Creá uno si necesitás ayuda!"
          onCancel={(id) => cancelTicket(id)}
          onDelete={(id) => deleteTicket(id)}
          onUserResponse={(id) => {
            setRespondingId(id);
            userResponse(id, { onSettled: () => setRespondingId(null) });
          }}
          respondingUserId={respondingId}
        />
      </section>

      {resolvedTickets.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Resueltos
          </h2>
          <TicketList tickets={resolvedTickets} isLoading={false} emptyMessage="" />
        </section>
      )}

      {cancelledTickets.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Cancelados
          </h2>
          <TicketList tickets={cancelledTickets} isLoading={false} emptyMessage="" />
        </section>
      )}
    </div>
  );
}
