export type TechnicianRole = "technician" | "admin";

export interface Technician {
  id: string;
  nombre: string;
  email: string;
  role: TechnicianRole;
  nivel: {
    id: number;
    numero_nivel: number;
    nombre: string;
  } | null;
  estado_activo: boolean;
  carga_actual: number;
  skills: { id: number; nombre_tecnologia: string }[];
  created_at: string;
}

export interface CreateTechnicianPayload {
  nombre: string;
  email: string;
  password?: string;
  nivel_id?: number;
  estado_activo?: boolean;
  skills?: string[];
}

export type UpdateTechnicianPayload = Partial<CreateTechnicianPayload>;

export interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  role: TechnicianRole;
  nivel: Technician["nivel"];
}
