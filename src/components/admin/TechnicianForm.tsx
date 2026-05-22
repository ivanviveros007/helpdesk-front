"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { CreateTechnicianPayload, Technician } from "@/types/technician";
import type { Level } from "@/types/level";

interface TechnicianFormProps {
  initialData?: Technician;
  levels: Level[];
  onSubmit: (payload: CreateTechnicianPayload) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function TechnicianForm({
  initialData,
  levels,
  onSubmit,
  isSubmitting,
  onCancel,
}: TechnicianFormProps) {
  const [fields, setFields] = useState({
    nombre: initialData?.nombre ?? "",
    email: initialData?.email ?? "",
    password: "",
    nivel_id: initialData?.nivel?.id ?? (levels[0]?.id ?? 0),
    estado_activo: initialData?.estado_activo ?? true,
    skillInput: "",
    skills: initialData?.skills.map((s) => s.nombre_tecnologia) ?? [] as string[],
  });

  const setField = <K extends keyof typeof fields>(key: K, value: (typeof fields)[K]) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const addSkill = () => {
    const skill = fields.skillInput.trim();
    if (skill && !fields.skills.includes(skill)) {
      setField("skills", [...fields.skills, skill]);
    }
    setField("skillInput", "");
  };

  const removeSkill = (skill: string) =>
    setField("skills", fields.skills.filter((s) => s !== skill));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload: CreateTechnicianPayload = {
      nombre: fields.nombre,
      email: fields.email,
      nivel_id: fields.nivel_id || undefined,
      estado_activo: fields.estado_activo,
      skills: fields.skills,
    };
    if (fields.password) payload.password = fields.password;
    else if (!initialData) payload.password = fields.password; // required on create
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nombre completo"
        placeholder="ej: Carlos Martínez"
        value={fields.nombre}
        onChange={(e) => setField("nombre", e.target.value)}
        required
      />

      <Input
        label="Email"
        type="email"
        placeholder="carlos@empresa.com"
        value={fields.email}
        onChange={(e) => setField("email", e.target.value)}
        required
      />

      <Input
        label={initialData ? "Nueva contraseña (dejar vacío para no cambiar)" : "Contraseña"}
        type="password"
        placeholder="Mínimo 8 caracteres"
        value={fields.password}
        onChange={(e) => setField("password", e.target.value)}
        required={!initialData}
        minLength={8}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Nivel de soporte</label>
        <select
          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          value={fields.nivel_id}
          onChange={(e) => setField("nivel_id", Number(e.target.value))}
        >
          {levels.map((l) => (
            <option key={l.id} value={l.id}>
              Nivel {l.numero_nivel} — {l.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="estado_activo"
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          checked={fields.estado_activo}
          onChange={(e) => setField("estado_activo", e.target.checked)}
        />
        <label htmlFor="estado_activo" className="text-sm text-slate-700">
          Técnico activo
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Skills</label>
        <div className="flex gap-2">
          <Input
            placeholder="ej: React Native, SQL, Docker"
            value={fields.skillInput}
            onChange={(e) => setField("skillInput", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <Button type="button" variant="secondary" onClick={addSkill}>
            Agregar
          </Button>
        </div>
        {fields.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {fields.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700"
              >
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="hover:text-purple-900">
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
          {initialData ? "Guardar cambios" : "Crear técnico"}
        </Button>
      </div>
    </form>
  );
}
