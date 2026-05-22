import { Inbox } from "lucide-react";
import { TicketCard } from "./TicketCard";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Ticket } from "@/types/ticket";

interface TicketListProps {
  tickets: Ticket[];
  isLoading: boolean;
  onResolve?: (ticketId: string) => void;
  resolvingId?: string | null;
  showReasoning?: boolean;
  emptyMessage?: string;
}

export function TicketList({
  tickets,
  isLoading,
  onResolve,
  resolvingId,
  showReasoning = false,
  emptyMessage = "No hay tickets por el momento.",
}: TicketListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" label="Cargando tickets..." />
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Sin tickets"
        description={emptyMessage}
      />
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {tickets.map((ticket) => (
        <li key={ticket.id}>
          <TicketCard
            ticket={ticket}
            onResolve={onResolve}
            isResolving={resolvingId === ticket.id}
            showReasoning={showReasoning}
          />
        </li>
      ))}
    </ul>
  );
}
