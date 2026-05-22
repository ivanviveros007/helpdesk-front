import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Technician } from "@/types/technician";

interface TechnicianTableProps {
  technicians: Technician[];
  onEdit: (tech: Technician) => void;
  onDelete: (techId: string) => void;
  deletingId?: string | null;
}

export function TechnicianTable({ technicians, onEdit, onDelete, deletingId }: TechnicianTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Nivel</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Carga</th>
            <th className="px-4 py-3">Skills</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {technicians.map((tech) => (
            <tr key={tech.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 font-medium text-slate-900">{tech.nombre}</td>
              <td className="px-4 py-3 text-slate-500">{tech.email}</td>
              <td className="px-4 py-3 text-slate-700">
                {tech.nivel ? `Nivel ${tech.nivel.numero_nivel}` : "—"}
              </td>
              <td className="px-4 py-3">
                <Badge variant={tech.estado_activo ? "green" : "default"}>
                  {tech.estado_activo ? "Activo" : "Inactivo"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <span className={`font-mono font-medium ${tech.carga_actual >= 5 ? "text-orange-600" : "text-slate-600"}`}>
                  {tech.carga_actual}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {tech.skills.slice(0, 3).map((s) => (
                    <Badge key={s.id} variant="purple">{s.nombre_tecnologia}</Badge>
                  ))}
                  {tech.skills.length > 3 && (
                    <Badge variant="default">+{tech.skills.length - 3}</Badge>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(tech)}
                    aria-label="Editar técnico"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(tech.id)}
                    isLoading={deletingId === tech.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    aria-label="Eliminar técnico"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
