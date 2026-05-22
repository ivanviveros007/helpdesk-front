"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { CreateTicketPayload } from "@/types/ticket";

interface TicketFormProps {
  onSubmit: (payload: CreateTicketPayload) => void;
  isSubmitting: boolean;
}

interface FormErrors {
  asunto?: string;
  descripcion?: string;
}

function validate(asunto: string, descripcion: string): FormErrors {
  const errors: FormErrors = {};
  if (asunto.trim().length < 5) errors.asunto = "El asunto debe tener al menos 5 caracteres.";
  if (asunto.trim().length > 200) errors.asunto = "El asunto no puede superar 200 caracteres.";
  if (descripcion.trim().length < 10) errors.descripcion = "La descripción debe tener al menos 10 caracteres.";
  if (descripcion.trim().length > 5000) errors.descripcion = "La descripción no puede superar 5000 caracteres.";
  return errors;
}

export function TicketForm({ onSubmit, isSubmitting }: TicketFormProps) {
  const [asunto, setAsunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({ asunto: false, descripcion: false });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(asunto, descripcion);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({ asunto: true, descripcion: true });
      return;
    }
    onSubmit({ asunto: asunto.trim(), descripcion: descripcion.trim() });
  };

  const handleBlur = (field: "asunto" | "descripcion") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(asunto, descripcion));
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Nuevo ticket de soporte</CardTitle>
        <p className="text-sm text-slate-500">
          Describí el problema con el mayor detalle posible. La IA lo clasificará y asignará automáticamente.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <Input
            label="Asunto"
            placeholder="Resumen breve del problema"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            onBlur={() => handleBlur("asunto")}
            error={touched.asunto ? errors.asunto : undefined}
            maxLength={200}
            disabled={isSubmitting}
          />

          <Textarea
            label="Descripción"
            placeholder="Describí en detalle qué pasó, cuándo ocurre, qué pasos seguiste y el impacto que tiene..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            onBlur={() => handleBlur("descripcion")}
            error={touched.descripcion ? errors.descripcion : undefined}
            maxLength={5000}
            rows={6}
            disabled={isSubmitting}
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {descripcion.length}/5000 caracteres
            </span>
            <Button type="submit" isLoading={isSubmitting} className="gap-2">
              <Send className="h-4 w-4" />
              Enviar ticket
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
