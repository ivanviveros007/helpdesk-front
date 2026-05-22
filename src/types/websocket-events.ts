import type { TicketStatus } from "./ticket";

export interface TicketUpdatedPayload {
  ticketId: string;
  status: TicketStatus;
  category: string | null;
  priority: number | null;
  level: number | null;
  assignedTechnicianId: string | null;
  assignedTechnicianName: string | null;
  reasoning: string | null;
  updatedAt: string;
}

export interface WSEventMap {
  "ticket:updated": TicketUpdatedPayload;
  "ticket:assigned_to_you": TicketUpdatedPayload;
  "ticket:created": { ticketId: string };
}
