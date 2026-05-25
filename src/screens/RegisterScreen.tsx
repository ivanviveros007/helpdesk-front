"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Bot, Building2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useValidateInvite } from "@/hooks/useInvitations";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function RegisterScreen() {
  const { register, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite");

  const { data: inviteInfo, isLoading: isValidatingInvite, isError: isInvalidInvite } = useValidateInvite(inviteToken);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState(inviteInfo?.email ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
      await register({ nombre, email: inviteInfo?.email ?? email, password, invite_token: inviteToken ?? undefined });
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(msg === "Email already in use" ? "Ese email ya está registrado." : "Ocurrió un error. Intentá de nuevo.");
    }
  };

  if (inviteToken && isValidatingInvite) {
    return (
      <div className="flex min-h-full items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Validando invitación...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-slate-900">Crear cuenta</h1>
            {inviteInfo ? (
              <p className="text-sm text-slate-500">
                Fuiste invitado a{" "}
                <span className="font-medium text-slate-700">{inviteInfo.org_nombre}</span>
              </p>
            ) : (
              <p className="text-sm text-slate-500">Registrate para enviar tickets de soporte</p>
            )}
          </div>
        </div>

        {inviteToken && isInvalidInvite && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            Esta invitación no es válida o ya fue utilizada.
          </div>
        )}

        {inviteInfo && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
            <Building2 className="h-4 w-4 shrink-0" />
            Te estás uniendo a <strong className="ml-1">{inviteInfo.org_nombre}</strong>
          </div>
        )}

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
            value={inviteInfo?.email ?? email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            readOnly={!!inviteInfo?.email}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Contraseña</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Confirmar contraseña</label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

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
