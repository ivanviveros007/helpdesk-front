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

export interface NewCommentPayload {
  ticketId: string;
  technicianId: string | null;
  userId: string | null;
  comment: {
    id: string;
    author_name: string;
    author_role: string;
    body: string;
    attachments: Array<{ url: string; filename: string; mimetype: string; key: string }>;
    created_at: string;
  };
}

export interface WSEventMap {
  "ticket:updated": TicketUpdatedPayload;
  "ticket:assigned_to_you": TicketUpdatedPayload;
  "ticket:status_changed": TicketUpdatedPayload;
  "ticket:created": { ticketId: string };
  "ticket:new_comment": NewCommentPayload;
}
