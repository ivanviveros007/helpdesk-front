import { Badge } from "@/components/ui/Badge";
import type { TicketStatus } from "@/types/ticket";

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

const config: Record<TicketStatus, { label: string; variant: "yellow" | "blue" | "green" | "default" }> = {
  PENDIENTE_IA: { label: "Procesando IA", variant: "yellow" },
  ASIGNADO: { label: "Asignado", variant: "blue" },
  RESUELTO: { label: "Resuelto", variant: "green" },
  CANCELADO: { label: "Cancelado", variant: "default" },
};

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}
