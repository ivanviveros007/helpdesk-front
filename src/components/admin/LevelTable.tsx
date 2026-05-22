import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Level } from "@/types/level";

interface LevelTableProps {
  levels: Level[];
  onEdit: (level: Level) => void;
  onDelete: (levelId: number) => void;
  deletingId?: number | null;
}

export function LevelTable({ levels, onEdit, onDelete, deletingId }: LevelTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Nivel</th>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Complejidad máx.</th>
            <th className="px-4 py-3">Tags</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {levels.map((level) => (
            <tr key={level.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 font-medium text-slate-900">#{level.numero_nivel}</td>
              <td className="px-4 py-3 text-slate-700">{level.nombre}</td>
              <td className="px-4 py-3">
                <span className="font-mono text-slate-600">{level.max_complexity_score}/10</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {level.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="blue">{tag}</Badge>
                  ))}
                  {level.tags.length > 4 && (
                    <Badge variant="default">+{level.tags.length - 4}</Badge>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(level)}
                    aria-label="Editar nivel"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(level.id)}
                    isLoading={deletingId === level.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    aria-label="Eliminar nivel"
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
