"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { CreateLevelPayload, Level } from "@/types/level";

interface LevelFormProps {
  initialData?: Level;
  onSubmit: (payload: CreateLevelPayload) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function LevelForm({ initialData, onSubmit, isSubmitting, onCancel }: LevelFormProps) {
  const [fields, setFields] = useState({
    numero_nivel: initialData?.numero_nivel ?? 1,
    nombre: initialData?.nombre ?? "",
    descripcion_responsabilidades: initialData?.descripcion_responsabilidades ?? "",
    max_complexity_score: initialData?.max_complexity_score ?? 5,
    tagInput: "",
    tags: initialData?.tags ?? [] as string[],
  });

  const setField = <K extends keyof typeof fields>(key: K, value: (typeof fields)[K]) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const addTag = () => {
    const newTags = fields.tagInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t && !fields.tags.includes(t));
    if (newTags.length > 0) {
      setField("tags", [...fields.tags, ...newTags]);
    }
    setField("tagInput", "");
  };

  const removeTag = (tag: string) =>
    setField("tags", fields.tags.filter((t) => t !== tag));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      numero_nivel: fields.numero_nivel,
      nombre: fields.nombre,
      descripcion_responsabilidades: fields.descripcion_responsabilidades,
      tags: fields.tags,
      max_complexity_score: fields.max_complexity_score,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Número de nivel"
          type="number"
          min={1}
          value={fields.numero_nivel}
          onChange={(e) => setField("numero_nivel", Number(e.target.value))}
          required
        />
        <Input
          label="Complejidad máxima (1-10)"
          type="number"
          min={1}
          max={10}
          value={fields.max_complexity_score}
          onChange={(e) => setField("max_complexity_score", Number(e.target.value))}
          required
        />
      </div>

      <Input
        label="Nombre del nivel"
        placeholder="ej: Soporte Técnico"
        value={fields.nombre}
        onChange={(e) => setField("nombre", e.target.value)}
        required
      />

      <Textarea
        label="Descripción de responsabilidades"
        placeholder="Describí qué tipos de problemas atiende este nivel..."
        value={fields.descripcion_responsabilidades}
        onChange={(e) => setField("descripcion_responsabilidades", e.target.value)}
        rows={3}
        required
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Tags</label>
        <div className="flex gap-2">
          <Input
            placeholder="ej: mobile, payments"
            value={fields.tagInput}
            onChange={(e) => setField("tagInput", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" variant="secondary" onClick={addTag}>
            Agregar
          </Button>
        </div>
        {fields.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {fields.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700"
              >
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-blue-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? "Guardar cambios" : "Crear nivel"}
        </Button>
      </div>
    </form>
  );
}
