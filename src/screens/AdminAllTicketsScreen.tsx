"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { TicketStatusBadge } from "@/components/tickets/TicketStatusBadge";
import { useAdminTickets, useResolveTicket } from "@/hooks/useTickets";
import { useTechnicians } from "@/hooks/useTechnicians";
import type { Ticket } from "@/types/ticket";

type SortKey = "created_at" | "prioridad" | "nivel_asignado" | "estado";
type SortDir = "asc" | "desc";

const PRIORITY_COLOR: Record<number, string> = {
  10: "text-red-600 font-bold",
  9: "text-red-500 font-semibold",
  8: "text-orange-500 font-semibold",
  7: "text-orange-400",
  6: "text-yellow-500",
  5: "text-yellow-400",
};

function priorityLabel(p: number | null) {
  if (p === null) return "—";
  if (p >= 9) return `${p} — Crítica`;
  if (p >= 7) return `${p} — Alta`;
  if (p >= 5) return `${p} — Media`;
  return `${p} — Baja`;
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ArrowUpDown className="h-3.5 w-3.5 text-slate-300" />;
  return sortDir === "asc"
    ? <ArrowUp className="h-3.5 w-3.5 text-indigo-500" />
    : <ArrowDown className="h-3.5 w-3.5 text-indigo-500" />;
}

export function AdminAllTicketsScreen() {
  const [tecnicoId, setTecnicoId] = useState("");
  const [estado, setEstado] = useState("");
  const [nivel, setNivel] = useState("");
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const { data: technicians = [] } = useTechnicians();
  const { data: tickets = [], isLoading } = useAdminTickets({
    tecnico_id: tecnicoId || undefined,
    estado: estado || undefined,
    nivel: nivel || undefined,
  });
  const { mutate: resolveTicket } = useResolveTicket();

  const handleResolve = (ticketId: string) => {
    if (!window.confirm("¿Marcar este ticket como resuelto?")) return;
    setResolvingId(ticketId);
    resolveTicket(ticketId, { onSettled: () => setResolvingId(null) });
  };

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  const sorted = useMemo(() => {
    return [...tickets].sort((a, b) => {
      let av: number | string, bv: number | string;
      if (sortKey === "created_at") {
        av = a.created_at; bv = b.created_at;
      } else if (sortKey === "prioridad") {
        av = a.prioridad ?? -1; bv = b.prioridad ?? -1;
      } else if (sortKey === "nivel_asignado") {
        av = a.nivel_asignado ?? -1; bv = b.nivel_asignado ?? -1;
      } else {
        av = a.estado; bv = b.estado;
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [tickets, sortKey, sortDir]);

  const selectCls = "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400";

  return (
    <div className="flex flex-col gap-6">
      <Header
        title="Todos los tickets"
        description={`${tickets.length} ticket${tickets.length !== 1 ? "s" : ""} en total`}
      />

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <select value={tecnicoId} onChange={(e) => setTecnicoId(e.target.value)} className={selectCls}>
          <option value="">Todos los técnicos</option>
          {technicians.map((t) => (
            <option key={t.id} value={t.id}>{t.nombre}</option>
          ))}
        </select>

        <select value={estado} onChange={(e) => setEstado(e.target.value)} className={selectCls}>
          <option value="">Todos los estados</option>
          <option value="PENDIENTE_IA">Pendiente IA</option>
          <option value="ASIGNADO">Asignado</option>
          <option value="EN_PROGRESO">En progreso</option>
          <option value="ESPERANDO_USUARIO">Esperando usuario</option>
          <option value="RESUELTO">Resuelto</option>
          <option value="CANCELADO">Cancelado</option>
        </select>

        <select value={nivel} onChange={(e) => setNivel(e.target.value)} className={selectCls}>
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

      {/* Tabla */}
      {isLoading ? (
        <p className="text-sm text-slate-400">Cargando tickets...</p>
      ) : sorted.length === 0 ? (
        <p className="text-sm text-slate-400 py-8 text-center">No hay tickets que coincidan con los filtros.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Asunto</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  <button onClick={() => toggleSort("estado")} className="flex items-center gap-1.5 hover:text-slate-700">
                    Estado <SortIcon col="estado" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  <button onClick={() => toggleSort("prioridad")} className="flex items-center gap-1.5 hover:text-slate-700">
                    Prioridad <SortIcon col="prioridad" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  <button onClick={() => toggleSort("nivel_asignado")} className="flex items-center gap-1.5 hover:text-slate-700">
                    Nivel <SortIcon col="nivel_asignado" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Técnico</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Categoría</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  <button onClick={() => toggleSort("created_at")} className="flex items-center gap-1.5 hover:text-slate-700">
                    Fecha <SortIcon col="created_at" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((ticket) => (
                <TicketRow
                  key={ticket.id}
                  ticket={ticket}
                  onResolve={handleResolve}
                  isResolving={resolvingId === ticket.id}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TicketRow({ ticket, onResolve, isResolving }: { ticket: Ticket; onResolve: (id: string) => void; isResolving: boolean }) {
  const router = useRouter();
  const createdAt = new Date(ticket.created_at).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  const isClosed = ticket.estado === "RESUELTO" || ticket.estado === "CANCELADO";

  return (
    <tr
      className="hover:bg-indigo-50/40 cursor-pointer transition-colors"
      onClick={() => router.push(`/tickets/${ticket.id}`)}
    >
      <td className="px-4 py-3 max-w-[280px]">
        <p className="font-medium text-slate-900 line-clamp-1">{ticket.asunto}</p>
        {ticket.created_by_name && (
          <p className="text-xs text-slate-400 mt-0.5">{ticket.created_by_name}</p>
        )}
      </td>
      <td className="px-4 py-3">
        <TicketStatusBadge status={ticket.estado} />
      </td>
      <td className="px-4 py-3">
        <span className={`text-sm ${PRIORITY_COLOR[ticket.prioridad ?? 0] ?? "text-slate-500"}`}>
          {priorityLabel(ticket.prioridad)}
        </span>
      </td>
      <td className="px-4 py-3 text-slate-600">
        {ticket.nivel_asignado ? `Nivel ${ticket.nivel_asignado}` : "—"}
      </td>
      <td className="px-4 py-3 text-slate-600">
        {ticket.tecnico_asignado?.nombre ?? <span className="text-slate-400">Sin asignar</span>}
      </td>
      <td className="px-4 py-3">
        {ticket.categoria
          ? <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600">{ticket.categoria}</span>
          : <span className="text-slate-400">—</span>}
      </td>
      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{createdAt}</td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        {!isClosed && (
          <button
            onClick={() => onResolve(ticket.id)}
            disabled={isResolving}
            className="text-xs text-slate-500 hover:text-green-600 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {isResolving ? "..." : "Resolver"}
          </button>
        )}
      </td>
    </tr>
  );
}
