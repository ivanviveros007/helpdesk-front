import { cn } from "@/lib/cn";

interface PriorityIndicatorProps {
  priority: number | null;
}

function getPriorityConfig(p: number | null) {
  if (p === null) return { label: "—", className: "text-slate-400" };
  if (p >= 9) return { label: `${p} — Crítica`, className: "text-red-600 font-semibold" };
  if (p >= 7) return { label: `${p} — Alta`, className: "text-orange-600 font-semibold" };
  if (p >= 5) return { label: `${p} — Media`, className: "text-yellow-600" };
  if (p >= 3) return { label: `${p} — Baja`, className: "text-green-600" };
  return { label: `${p} — Mínima`, className: "text-slate-500" };
}

export function PriorityIndicator({ priority }: PriorityIndicatorProps) {
  const { label, className } = getPriorityConfig(priority);
  return <span className={cn("text-sm", className)}>{label}</span>;
}
