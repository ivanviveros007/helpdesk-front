import { Clock, User, Layers, Brain, XCircle, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { PriorityIndicator } from "./PriorityIndicator";
import { Button } from "@/components/ui/Button";
import type { Ticket } from "@/types/ticket";

interface TicketCardProps {
  ticket: Ticket;
  onResolve?: (ticketId: string) => void;
  isResolving?: boolean;
  onCancel?: (ticketId: string) => void;
  onDelete?: (ticketId: string) => void;
  showReasoning?: boolean;
}

export function TicketCard({
  ticket,
  onResolve,
  isResolving = false,
  onCancel,
  onDelete,
  showReasoning = false,
}: TicketCardProps) {
  const createdAt = new Date(ticket.created_at).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-2">{ticket.asunto}</CardTitle>
          <TicketStatusBadge status={ticket.estado} />
        </div>
        <p className="text-sm text-slate-500 line-clamp-2">{ticket.descripcion_raw}</p>
      </CardHeader>

      <CardContent>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Layers className="h-4 w-4 shrink-0 text-slate-400" />
            <dt className="sr-only">Nivel</dt>
            <dd>{ticket.nivel_asignado ? `Nivel ${ticket.nivel_asignado}` : "—"}</dd>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <dt className="sr-only">Prioridad</dt>
            <PriorityIndicator priority={ticket.prioridad} />
          </div>

          <div className="flex items-center gap-2 text-slate-600 col-span-2">
            <User className="h-4 w-4 shrink-0 text-slate-400" />
            <dt className="sr-only">Técnico</dt>
            <dd>{ticket.tecnico_asignado?.nombre ?? "Sin asignar"}</dd>
          </div>

          {ticket.categoria && (
            <div className="flex items-center gap-2 text-slate-600 col-span-2">
              <dt className="sr-only">Categoría</dt>
              <dd className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600">
                {ticket.categoria}
              </dd>
            </div>
          )}

          <div className="flex items-center gap-2 text-slate-400 col-span-2">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <dd className="text-xs">{createdAt}</dd>
          </div>
        </dl>

        {showReasoning && ticket.razonamiento_ia && (
          <details className="mt-4">
            <summary className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700">
              <Brain className="h-3.5 w-3.5" />
              Razonamiento de la IA
            </summary>
            <p className="mt-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 leading-relaxed">
              {ticket.razonamiento_ia}
            </p>
          </details>
        )}
      </CardContent>

      {(onResolve || onCancel || onDelete) && ticket.estado !== "RESUELTO" && ticket.estado !== "CANCELADO" && (
        <CardFooter className="flex gap-2 flex-wrap">
          {onResolve && ticket.estado === "ASIGNADO" && (
            <Button variant="outline" size="sm" onClick={() => onResolve(ticket.id)} isLoading={isResolving}>
              Marcar como resuelto
            </Button>
          )}
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
              onClick={() => {
                if (window.confirm("¿Cancelar este ticket? Quedará registrado como cancelado.")) {
                  onCancel(ticket.id);
                }
              }}
            >
              <XCircle className="h-3.5 w-3.5" />
              Cancelar
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => {
                if (window.confirm("¿Eliminar este ticket? Esta acción no se puede deshacer.")) {
                  onDelete(ticket.id);
                }
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Eliminar
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
