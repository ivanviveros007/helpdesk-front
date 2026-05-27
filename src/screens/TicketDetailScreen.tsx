"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  User,
  Layers,
  Brain,
  Paperclip,
  FileText,
  ImageIcon,
  PlayCircle,
  MessageCircle,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { TicketStatusBadge } from "@/components/tickets/TicketStatusBadge";
import { PriorityIndicator } from "@/components/tickets/PriorityIndicator";
import { CommentThread } from "@/components/tickets/CommentThread";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { useTicketWithComments, useAddComment, useUpdateTicketStatus, useUserResponseTicket, useResolveTicket } from "@/hooks/useTickets";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface TicketDetailScreenProps {
  ticketId: string;
}

function backHref(role: string) {
  if (role === "admin") return "/admin/tickets";
  if (role === "technician") return "/technician";
  return "/client/my-tickets";
}

export function TicketDetailScreen({ ticketId }: TicketDetailScreenProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: ticket, isLoading, error } = useTicketWithComments(ticketId);
  const { mutate: addComment, isPending: isSubmitting } = useAddComment(ticketId);
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateTicketStatus();
  const { mutate: userRespond, isPending: isRespondingUser } = useUserResponseTicket();
  const { mutate: resolve, isPending: isResolving } = useResolveTicket();
  const [statusAction, setStatusAction] = useState<string | null>(null);

  const wsOpts = user ? (user.role === "technician" ? { technicianId: user.id } : { userId: user.id }) : undefined;

  useWebSocket("ticket:new_comment", (payload) => {
    if (payload.ticketId === ticketId) {
      void queryClient.invalidateQueries({ queryKey: ["tickets", ticketId, "comments"] });
    }
  }, wsOpts);

  useWebSocket("ticket:status_changed", (payload) => {
    if (payload.ticketId === ticketId) {
      void queryClient.invalidateQueries({ queryKey: ["tickets", ticketId, "comments"] });
    }
  }, wsOpts);

  if (!user) return null;
  const isSupport = user.role === "technician" || user.role === "admin";
  const isTech = user.role === "technician";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Detalle de ticket" />
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Detalle de ticket" />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="text-slate-500">Ticket no encontrado.</p>
          <Link href={backHref(user.role)} className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
            ← Volver
          </Link>
        </div>
      </div>
    );
  }

  const isClosed = ticket.estado === "RESUELTO" || ticket.estado === "CANCELADO";

  const createdAt = new Date(ticket.created_at).toLocaleString("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Detalle de ticket" />

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        {/* Back */}
        <Link
          href={backHref(user.role)}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-snug">{ticket.asunto}</h1>
            <p className="mt-1 text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {createdAt}
              {ticket.created_by_name && (
                <span className="ml-1">· {ticket.created_by_name}</span>
              )}
            </p>
          </div>
          <TicketStatusBadge status={ticket.estado} />
        </div>

        {/* Metadata + Description */}
        <Card>
          <CardContent className="pt-5 space-y-4">
            {/* Meta grid */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Nivel</dt>
                <dd className="flex items-center gap-1.5 text-slate-700">
                  <Layers className="h-3.5 w-3.5 text-slate-400" />
                  {ticket.nivel_asignado ? `Nivel ${ticket.nivel_asignado}` : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Prioridad</dt>
                <dd><PriorityIndicator priority={ticket.prioridad} /></dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Técnico</dt>
                <dd className="flex items-center gap-1.5 text-slate-700">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  {ticket.tecnico_asignado?.nombre ?? "Sin asignar"}
                </dd>
              </div>
              {ticket.categoria && (
                <div>
                  <dt className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Categoría</dt>
                  <dd>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600">
                      {ticket.categoria}
                    </span>
                  </dd>
                </div>
              )}
            </dl>

            {/* Description */}
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">Descripción</p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{ticket.descripcion_raw}</p>
            </div>

            {/* AI Reasoning */}
            {ticket.razonamiento_ia && (
              <details className="border-t border-slate-100 pt-3">
                <summary className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 select-none">
                  <Brain className="h-3.5 w-3.5" />
                  Razonamiento de la IA
                </summary>
                <p className="mt-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 leading-relaxed">
                  {ticket.razonamiento_ia}
                </p>
              </details>
            )}
          </CardContent>
        </Card>

        {/* Attachments */}
        {ticket.attachments?.length > 0 && (
          <Card>
            <CardContent className="pt-5">
              <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Paperclip className="h-3.5 w-3.5" />
                {ticket.attachments.length} adjunto{ticket.attachments.length !== 1 ? "s" : ""}
              </p>
              <div className="flex flex-wrap gap-3">
                {ticket.attachments.map((att) =>
                  att.mimetype.startsWith("image/") ? (
                    <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer"
                      className="group relative overflow-hidden rounded-xl border border-slate-200 hover:border-indigo-300">
                      <img src={att.url} alt={att.filename}
                        className="h-24 w-24 object-cover transition-opacity group-hover:opacity-80" />
                    </a>
                  ) : (
                    <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                      <FileText className="h-5 w-5 shrink-0 text-slate-400" />
                      <span className="max-w-[160px] truncate">{att.filename}</span>
                    </a>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action buttons */}
        {!isClosed && (isTech || user.role === "user") && (
          <div className="flex flex-wrap gap-2">
            {/* Technician transitions */}
            {isTech && ticket.estado === "ASIGNADO" && (
              <Button variant="outline" size="sm" className="gap-1.5"
                onClick={() => { setStatusAction("EN_PROGRESO"); updateStatus({ ticketId, estado: "EN_PROGRESO" }); }}
                isLoading={isUpdatingStatus && statusAction === "EN_PROGRESO"}>
                <PlayCircle className="h-4 w-4" /> Iniciar
              </Button>
            )}
            {isTech && ticket.estado === "EN_PROGRESO" && (
              <Button variant="outline" size="sm" className="gap-1.5 text-purple-600 hover:bg-purple-50"
                onClick={() => { setStatusAction("ESPERANDO_USUARIO"); updateStatus({ ticketId, estado: "ESPERANDO_USUARIO" }); }}
                isLoading={isUpdatingStatus && statusAction === "ESPERANDO_USUARIO"}>
                <MessageCircle className="h-4 w-4" /> Esperando usuario
              </Button>
            )}
            {isTech && ticket.estado === "ESPERANDO_USUARIO" && (
              <Button variant="outline" size="sm" className="gap-1.5 text-orange-600 hover:bg-orange-50"
                onClick={() => { setStatusAction("EN_PROGRESO"); updateStatus({ ticketId, estado: "EN_PROGRESO" }); }}
                isLoading={isUpdatingStatus && statusAction === "EN_PROGRESO"}>
                <RotateCcw className="h-4 w-4" /> Retomar
              </Button>
            )}
            {isTech && (ticket.estado === "ASIGNADO" || ticket.estado === "EN_PROGRESO") && (
              <Button size="sm" onClick={() => resolve(ticketId)} isLoading={isResolving}>
                Marcar como resuelto
              </Button>
            )}

            {/* User: respond when waiting */}
            {user.role === "user" && ticket.estado === "ESPERANDO_USUARIO" && (
              <Button variant="outline" size="sm" className="gap-1.5 text-indigo-600 hover:bg-indigo-50"
                onClick={() => userRespond(ticketId)} isLoading={isRespondingUser}>
                <RotateCcw className="h-4 w-4" /> Ya realicé la acción
              </Button>
            )}
          </div>
        )}

        {/* Comment thread */}
        <Card>
          <CardContent className="pt-5">
            <CommentThread
              comments={ticket.comments}
              currentUserId={user.id}
              currentUserRole={user.role}
              onAddComment={(body, files) => addComment({ body, files })}
              isSubmitting={isSubmitting}
              disabled={isClosed}
            />
            {isClosed && (
              <p className="mt-3 text-center text-xs text-slate-400">
                Este ticket está cerrado. No se pueden agregar más mensajes.
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
