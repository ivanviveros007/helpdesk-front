export interface Level {
  id: number;
  numero_nivel: number;
  nombre: string;
  descripcion_responsabilidades: string;
  tags: string[];
  max_complexity_score: number;
  created_at: string;
}

export interface CreateLevelPayload {
  numero_nivel: number;
  nombre: string;
  descripcion_responsabilidades: string;
  tags: string[];
  max_complexity_score: number;
}

export type UpdateLevelPayload = Partial<CreateLevelPayload>;
