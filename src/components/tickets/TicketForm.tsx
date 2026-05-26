"use client";

import { useState, useRef, type FormEvent } from "react";
import { Send, Paperclip, X, FileText, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { CreateTicketPayload } from "@/types/ticket";

interface TicketFormProps {
  onSubmit: (payload: CreateTicketPayload, files: File[]) => void;
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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function TicketForm({ onSubmit, isSubmitting }: TicketFormProps) {
  const [asunto, setAsunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({ asunto: false, descripcion: false });
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const allowed = Array.from(incoming).filter((f) => f.size <= 10 * 1024 * 1024);
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      return [...prev, ...allowed.filter((f) => !existing.has(f.name + f.size))].slice(0, 10);
    });
  };

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(asunto, descripcion);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({ asunto: true, descripcion: true });
      return;
    }
    onSubmit({ asunto: asunto.trim(), descripcion: descripcion.trim() }, files);
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

          {/* File drop zone */}
          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-700">Adjuntos <span className="text-slate-400 font-normal">(opcional)</span></p>
            <div
              className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-sm transition-colors cursor-pointer
                ${dragging ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
            >
              <Paperclip className="h-5 w-5 text-slate-400" />
              <p className="text-slate-500">
                <span className="font-medium text-indigo-600">Seleccioná archivos</span> o arrastrá acá
              </p>
              <p className="text-xs text-slate-400">Imágenes, PDF, documentos — máx. 10MB por archivo</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.log,.zip"
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
            </div>

            {files.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1.5">
                {files.map((file, idx) => (
                  <li key={idx} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                    {file.type.startsWith("image/") ? (
                      <ImageIcon className="h-4 w-4 shrink-0 text-indigo-400" />
                    ) : (
                      <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                    )}
                    <span className="flex-1 truncate text-slate-700">{file.name}</span>
                    <span className="shrink-0 text-xs text-slate-400">{formatBytes(file.size)}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                      className="ml-1 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-red-500"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

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
