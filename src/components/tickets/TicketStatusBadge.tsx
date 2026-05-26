import { Badge } from "@/components/ui/Badge";
import type { TicketStatus } from "@/types/ticket";

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

const config: Record<TicketStatus, { label: string; variant: "yellow" | "blue" | "green" | "default" | "orange" | "purple" }> = {
  PENDIENTE_IA: { label: "Procesando IA", variant: "yellow" },
  ASIGNADO: { label: "Asignado", variant: "blue" },
  EN_PROGRESO: { label: "En progreso", variant: "orange" },
  ESPERANDO_USUARIO: { label: "Esperando usuario", variant: "purple" },
  RESUELTO: { label: "Resuelto", variant: "green" },
  CANCELADO: { label: "Cancelado", variant: "default" },
};

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}
