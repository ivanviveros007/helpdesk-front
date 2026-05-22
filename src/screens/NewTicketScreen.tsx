"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { TicketForm } from "@/components/tickets/TicketForm";
import { TicketProcessingAlert } from "@/components/tickets/TicketProcessingAlert";
import { useCreateTicket } from "@/hooks/useTickets";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { TicketUpdatedPayload } from "@/types/websocket-events";

export function NewTicketScreen() {
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);
  const [aiUpdate, setAiUpdate] = useState<TicketUpdatedPayload | null>(null);

  const { mutate: createTicket, isPending } = useCreateTicket();

  useWebSocket("ticket:updated", (payload) => {
    if (payload.ticketId === submittedTicketId) {
      setAiUpdate(payload);
    }
  });

  const handleSubmit = (payload: { asunto: string; descripcion: string }) => {
    setAiUpdate(null);
    createTicket(payload, {
      onSuccess: (data) => {
        setSubmittedTicketId(data.ticket_id);
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <Header
        title="Crear ticket"
        description="Describí tu problema y la IA lo clasificará y asignará automáticamente."
      />

      {submittedTicketId && (
        <TicketProcessingAlert
          ticketId={submittedTicketId}
          onUpdate={aiUpdate}
        />
      )}

      <TicketForm onSubmit={handleSubmit} isSubmitting={isPending} />
    </div>
  );
}
