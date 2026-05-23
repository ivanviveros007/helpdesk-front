"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Bot } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function RegisterScreen() {
  const { register, isLoading } = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    try {
      await register({ nombre, email, password });
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(msg === "Email already in use" ? "Ese email ya está registrado." : "Ocurrió un error. Intentá de nuevo.");
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-slate-900">Crear cuenta</h1>
            <p className="text-sm text-slate-500">Registrate para enviar tickets de soporte</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <Input
            label="Nombre completo"
            type="text"
            placeholder="Juan Pérez"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoComplete="name"
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="tu@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" isLoading={isLoading} className="mt-1 w-full">
            Crear cuenta
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
