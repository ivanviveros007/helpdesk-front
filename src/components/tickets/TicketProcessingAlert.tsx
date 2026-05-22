"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import type { TicketUpdatedPayload } from "@/types/websocket-events";

interface TicketProcessingAlertProps {
  ticketId: string | null;
  onUpdate: TicketUpdatedPayload | null;
}

export function TicketProcessingAlert({ ticketId, onUpdate }: TicketProcessingAlertProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (ticketId) setVisible(true);
  }, [ticketId]);

  if (!visible || !ticketId) return null;

  const isResolved = onUpdate?.status === "ASIGNADO";

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all",
        isResolved
          ? "border-green-200 bg-green-50"
          : "border-yellow-200 bg-yellow-50"
      )}
    >
      <div className="flex items-start gap-3">
        {isResolved ? (
          <CheckCircle className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
        ) : (
          <Clock className="h-5 w-5 shrink-0 animate-pulse text-yellow-600 mt-0.5" />
        )}
        <div className="flex flex-col gap-1">
          {isResolved ? (
            <>
              <p className="text-sm font-medium text-green-800">
                Ticket asignado correctamente
              </p>
              <ul className="text-xs text-green-700 space-y-0.5">
                <li><strong>Técnico:</strong> {onUpdate?.assignedTechnicianName ?? "—"}</li>
                <li><strong>Nivel:</strong> {onUpdate?.level ?? "—"}</li>
                <li><strong>Prioridad:</strong> {onUpdate?.priority ?? "—"}/10</li>
                <li><strong>Categoría:</strong> {onUpdate?.category ?? "—"}</li>
              </ul>
              {onUpdate?.reasoning && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-medium text-green-700 hover:text-green-900">
                    Ver razonamiento de la IA
                  </summary>
                  <p className="mt-1 text-xs text-green-700 leading-relaxed">
                    {onUpdate.reasoning}
                  </p>
                </details>
              )}
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-yellow-800">
                Ticket enviado — la IA está procesando la asignación...
              </p>
              <p className="text-xs text-yellow-700">
                ID: <code className="font-mono">{ticketId}</code>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
