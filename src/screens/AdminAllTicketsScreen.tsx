"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { TicketList } from "@/components/tickets/TicketList";
import { useAdminTickets, useResolveTicket } from "@/hooks/useTickets";
import { useTechnicians } from "@/hooks/useTechnicians";

type TicketStatusFilter = "" | "PENDIENTE_IA" | "ASIGNADO" | "RESUELTO";

export function AdminAllTicketsScreen() {
  const [tecnicoId, setTecnicoId] = useState("");
  const [estado, setEstado] = useState<TicketStatusFilter>("");
  const [nivel, setNivel] = useState("");
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const { data: technicians = [] } = useTechnicians();
  const { data: tickets = [], isLoading } = useAdminTickets({
    tecnico_id: tecnicoId || undefined,
    estado: estado || undefined,
    nivel: nivel || undefined,
  });
  const { mutate: resolveTicket } = useResolveTicket();

  const handleResolve = (ticketId: string) => {
    setResolvingId(ticketId);
    resolveTicket(ticketId, { onSettled: () => setResolvingId(null) });
  };

  return (
    <div className="flex flex-col gap-6">
      <Header
        title="Todos los tickets"
        description={`${tickets.length} ticket${tickets.length !== 1 ? "s" : ""} en total`}
      />

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <select
          value={tecnicoId}
          onChange={(e) => setTecnicoId(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los técnicos</option>
          {technicians.map((t) => (
            <option key={t.id} value={t.id}>{t.nombre}</option>
          ))}
        </select>

        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as TicketStatusFilter)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          <option value="PENDIENTE_IA">Pendiente IA</option>
          <option value="ASIGNADO">Asignado</option>
          <option value="RESUELTO">Resuelto</option>
        </select>

        <select
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los niveles</option>
          <option value="1">Nivel 1</option>
          <option value="2">Nivel 2</option>
          <option value="3">Nivel 3</option>
        </select>

        {(tecnicoId || estado || nivel) && (
          <button
            onClick={() => { setTecnicoId(""); setEstado(""); setNivel(""); }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 hover:bg-slate-50"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <TicketList
        tickets={tickets}
        isLoading={isLoading}
        onResolve={handleResolve}
        resolvingId={resolvingId}
        showReasoning
        emptyMessage="No hay tickets que coincidan con los filtros."
      />
    </div>
  );
}
