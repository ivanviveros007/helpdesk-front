export interface AdminMetrics {
  by_status: { estado: string; count: number }[];
  tickets_este_mes: number;
  avg_resolution_hours: number | null;
  by_technician: { nombre: string; carga_actual: number; total_asignados: number }[];
}
