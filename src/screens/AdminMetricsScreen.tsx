"use client";

import { Header } from "@/components/layout/Header";
import { Spinner } from "@/components/ui/Spinner";
import { useAdminMetrics } from "@/hooks/useAdminMetrics";
import { BarChart2, Clock, Ticket, TrendingUp, User } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDIENTE_IA: { label: "Pendiente IA", color: "bg-yellow-400" },
  ASIGNADO: { label: "Asignado", color: "bg-blue-500" },
  RESUELTO: { label: "Resuelto", color: "bg-green-500" },
};

export function AdminMetricsScreen() {
  const { data: metrics, isLoading } = useAdminMetrics();

  if (isLoading) {
    return (
      <>
        <Header title="Métricas" description="Resumen de actividad del equipo." />
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  if (!metrics) return null;

  const totalTickets = metrics.by_status.reduce((sum, s) => sum + s.count, 0);
  const resueltos = metrics.by_status.find((s) => s.estado === "RESUELTO")?.count ?? 0;
  const abiertos = totalTickets - resueltos;

  const summaryCards = [
    {
      label: "Total tickets",
      value: totalTickets,
      icon: Ticket,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Tickets este mes",
      value: metrics.tickets_este_mes,
      icon: TrendingUp,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Tickets abiertos",
      value: abiertos,
      icon: BarChart2,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Tiempo promedio resolución",
      value: metrics.avg_resolution_hours !== null ? `${metrics.avg_resolution_hours}h` : "—",
      icon: Clock,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <>
      <Header title="Métricas" description="Resumen de actividad del equipo." />

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {summaryCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className={`mb-3 inline-flex rounded-lg p-2 ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="mt-0.5 text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tickets by status */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Tickets por estado</h2>
          {totalTickets === 0 ? (
            <p className="text-sm text-slate-400">Sin tickets aún.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {metrics.by_status.map(({ estado, count }) => {
                const info = STATUS_LABELS[estado] ?? { label: estado, color: "bg-slate-400" };
                const pct = Math.round((count / totalTickets) * 100);
                return (
                  <div key={estado}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{info.label}</span>
                      <span className="text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${info.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tickets by technician */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Carga por técnico</h2>
          {metrics.by_technician.length === 0 ? (
            <p className="text-sm text-slate-400">Aún no hay tickets asignados a técnicos.</p>
          ) : (
            <div className="overflow-hidden rounded-lg border border-slate-100">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5">
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" /> Técnico
                      </span>
                    </th>
                    <th className="px-4 py-2.5 text-right">Carga actual</th>
                    <th className="px-4 py-2.5 text-right">Total asignados</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {metrics.by_technician.map((t) => (
                    <tr key={t.nombre} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-medium text-slate-800">{t.nombre}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${t.carga_actual > 5 ? "bg-red-100 text-red-700" : t.carga_actual > 2 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                          {t.carga_actual}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right text-slate-600">{t.total_asignados}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
