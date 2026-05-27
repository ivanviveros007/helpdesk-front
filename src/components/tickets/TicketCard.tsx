import Link from "next/link";
import { Clock, User, Layers, Brain, XCircle, Trash2, Paperclip, FileText, ImageIcon, PlayCircle, MessageCircle, RotateCcw, ArrowRight } from "lucide-react";
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
  onStatusChange?: (ticketId: string, estado: string) => void;
  isUpdatingStatus?: boolean;
  onUserResponse?: (ticketId: string) => void;
  isRespondingUser?: boolean;
}

export function TicketCard({
  ticket,
  onResolve,
  isResolving = false,
  onCancel,
  onDelete,
  showReasoning = false,
  onStatusChange,
  isUpdatingStatus = false,
  onUserResponse,
  isRespondingUser = false,
}: TicketCardProps) {
  const createdAt = new Date(ticket.created_at).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-2">
            <Link href={`/tickets/${ticket.id}`} className="hover:text-indigo-600 transition-colors">
              {ticket.asunto}
            </Link>
          </CardTitle>
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

        {ticket.attachments?.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Paperclip className="h-3.5 w-3.5" />
              {ticket.attachments.length} adjunto{ticket.attachments.length !== 1 ? "s" : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              {ticket.attachments.map((att) =>
                att.mimetype.startsWith("image/") ? (
                  <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-lg border border-slate-200 hover:border-indigo-300">
                    <img src={att.url} alt={att.filename}
                      className="h-20 w-20 object-cover transition-opacity group-hover:opacity-80" />
                  </a>
                ) : (
                  <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                    <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="max-w-[120px] truncate">{att.filename}</span>
                  </a>
                )
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2 flex-wrap">
        <Link
          href={`/tickets/${ticket.id}`}
          className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          Ver hilo
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

        {ticket.estado !== "RESUELTO" && ticket.estado !== "CANCELADO" && (onResolve || onCancel || onDelete || onStatusChange || onUserResponse) && (
        <div className="flex gap-2 flex-wrap">
          {/* Technician state transitions */}
          {onStatusChange && ticket.estado === "ASIGNADO" && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => onStatusChange(ticket.id, "EN_PROGRESO")} isLoading={isUpdatingStatus}>
              <PlayCircle className="h-3.5 w-3.5" />
              Iniciar
            </Button>
          )}
          {onStatusChange && ticket.estado === "EN_PROGRESO" && (
            <Button variant="outline" size="sm" className="gap-1.5 text-purple-600 hover:bg-purple-50 hover:text-purple-700" onClick={() => onStatusChange(ticket.id, "ESPERANDO_USUARIO")} isLoading={isUpdatingStatus}>
              <MessageCircle className="h-3.5 w-3.5" />
              Esperando usuario
            </Button>
          )}
          {onStatusChange && ticket.estado === "ESPERANDO_USUARIO" && (
            <Button variant="outline" size="sm" className="gap-1.5 text-orange-600 hover:bg-orange-50 hover:text-orange-700" onClick={() => onStatusChange(ticket.id, "EN_PROGRESO")} isLoading={isUpdatingStatus}>
              <RotateCcw className="h-3.5 w-3.5" />
              Retomar
            </Button>
          )}

          {onResolve && (ticket.estado === "ASIGNADO" || ticket.estado === "EN_PROGRESO") && (
            <Button variant="outline" size="sm" onClick={() => onResolve(ticket.id)} isLoading={isResolving}>
              Marcar como resuelto
            </Button>
          )}

          {/* User: respond when waiting */}
          {onUserResponse && ticket.estado === "ESPERANDO_USUARIO" && (
            <Button variant="outline" size="sm" className="gap-1.5 text-indigo-600 hover:bg-indigo-50" onClick={() => onUserResponse(ticket.id)} isLoading={isRespondingUser}>
              <RotateCcw className="h-3.5 w-3.5" />
              Ya realicé la acción
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
        </div>
        )}
      </CardFooter>
    </Card>
  );
}
