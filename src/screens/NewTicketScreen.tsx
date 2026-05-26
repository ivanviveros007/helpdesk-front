"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle, ListChecks } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { TicketForm } from "@/components/tickets/TicketForm";
import { TicketProcessingAlert } from "@/components/tickets/TicketProcessingAlert";
import { Button } from "@/components/ui/Button";
import { useCreateTicket, useAddAttachments } from "@/hooks/useTickets";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { TicketUpdatedPayload } from "@/types/websocket-events";

export function NewTicketScreen() {
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);
  const [aiUpdate, setAiUpdate] = useState<TicketUpdatedPayload | null>(null);

  const { mutate: createTicket, isPending } = useCreateTicket();
  const { mutate: addAttachments, isPending: isUploading } = useAddAttachments();

  useWebSocket("ticket:updated", (payload) => {
    if (payload.ticketId === submittedTicketId) {
      setAiUpdate(payload);
    }
  });

  const handleSubmit = (payload: { asunto: string; descripcion: string }, files: File[]) => {
    setAiUpdate(null);
    createTicket(payload, {
      onSuccess: (data) => {
        setSubmittedTicketId(data.ticket_id);
        if (files.length > 0) {
          addAttachments({ ticketId: data.ticket_id, files });
        }
      },
    });
  };

  const handleNewTicket = () => {
    setSubmittedTicketId(null);
    setAiUpdate(null);
  };

  if (submittedTicketId) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl">
        <Header
          title="Ticket enviado"
          description="La IA está procesando la asignación automáticamente."
        />

        <TicketProcessingAlert ticketId={submittedTicketId} onUpdate={aiUpdate} />

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleNewTicket} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Crear otro ticket
          </Button>
          <Link href="/client/my-tickets">
            <Button className="gap-2">
              <ListChecks className="h-4 w-4" />
              Ver mis tickets
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <Header
        title="Crear ticket"
        description="Describí tu problema y la IA lo clasificará y asignará automáticamente."
      />
      <TicketForm onSubmit={handleSubmit} isSubmitting={isPending || isUploading} />
    </div>
  );
}
