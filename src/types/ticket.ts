export type TicketStatus = "PENDIENTE_IA" | "ASIGNADO" | "RESUELTO" | "CANCELADO";

export interface Ticket {
  id: string;
  asunto: string;
  descripcion_raw: string;
  categoria: string | null;
  prioridad: number | null;
  nivel_asignado: number | null;
  tecnico_asignado: {
    id: string;
    nombre: string;
    email: string;
  } | null;
  razonamiento_ia: string | null;
  created_by_name: string | null;
  org_id: string | null;
  estado: TicketStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateTicketPayload {
  asunto: string;
  descripcion: string;
}

export interface CreateTicketResponse {
  ticket_id: string;
  status: TicketStatus;
  message: string;
}
