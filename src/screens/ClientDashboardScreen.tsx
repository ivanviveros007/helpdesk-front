"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { TicketList } from "@/components/tickets/TicketList";
import { useMyTickets } from "@/hooks/useTickets";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import type { TicketUpdatedPayload } from "@/types/websocket-events";

export function ClientDashboardScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: tickets = [], isLoading } = useMyTickets();

  // Real-time: refresh list when one of the user's tickets changes status
  useWebSocket(
    "ticket:status_changed",
    (_payload: TicketUpdatedPayload) => {
      void queryClient.invalidateQueries({ queryKey: ["tickets", "my"] });
    },
    { userId: user?.id }
  );

  const openTickets = tickets.filter((t) => t.estado !== "RESUELTO");
  const resolvedTickets = tickets.filter((t) => t.estado === "RESUELTO");

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
    </div>
  );
}
