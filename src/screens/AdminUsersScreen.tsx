"use client";

import { useState } from "react";
import { Copy, Check, UserPlus, Mail, Clock, RefreshCw, Users } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { useInvitations, useCreateInvitation, useResendInvitation } from "@/hooks/useInvitations";
import { useAdminUsers } from "@/hooks/useAdminUsers";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

function formatExpiry(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  const days = Math.ceil(diff / 86400_000);
  if (days < 0) return "Expirada";
  if (days === 0) return "Expira hoy";
  return `Expira en ${days}d`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
}

export function AdminUsersScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: invitations = [], isLoading: loadingInvitations } = useInvitations();
  const { data: users = [], isLoading: loadingUsers } = useAdminUsers();
  const { mutate: createInvitation, isPending } = useCreateInvitation();
  const { mutate: resendInvitation, variables: resendingId } = useResendInvitation();

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    createInvitation(
      { email },
      {
        onSuccess: () => setEmail(""),
        onError: (err: any) => setError(err?.response?.data?.message ?? "Error al crear la invitación"),
      },
    );
  };

  return (
    <>
      <Header
        title="Usuarios"
        description="Invitá clientes a tu organización y gestioná los registrados."
      />

      {/* Invite form */}
      <form onSubmit={handleInvite} className="flex items-end gap-3 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex-1">
          <Input
            label="Email del cliente"
            type="email"
            placeholder="cliente@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
        <Button type="submit" isLoading={isPending} className="shrink-0">
          <UserPlus className="h-4 w-4" />
          Invitar
        </Button>
      </form>

      {/* Invitations table */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Invitaciones</h2>
        {loadingInvitations ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : invitations.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
            <Mail className="h-8 w-8" />
            <p className="text-sm">Todavía no enviaste ninguna invitación.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Vencimiento</th>
                  <th className="px-4 py-3">Link de registro</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {invitations.map((inv) => {
                  const link = `${BASE_URL}/register?invite=${inv.token}`;
                  const expired = new Date(inv.expires_at) < new Date();
                  const isResending = resendingId?.id === inv.id;
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{inv.email}</td>
                      <td className="px-4 py-3">
                        {inv.used ? (
                          <Badge variant="green">Usado</Badge>
                        ) : expired ? (
                          <Badge variant="default">Expirado</Badge>
                        ) : (
                          <Badge variant="purple">Pendiente</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatExpiry(inv.expires_at)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {!inv.used && !expired ? (
                          <div className="flex items-center gap-2">
                            <code className="max-w-xs truncate rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                              {link}
                            </code>
                            <CopyButton text={link} />
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {expired && !inv.used && (
                          <button
                            onClick={() => resendInvitation({ id: inv.id })}
                            disabled={isResending}
                            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                          >
                            <RefreshCw className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`} />
                            Reenviar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Registered users table */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Clientes registrados
          {!loadingUsers && <span className="font-normal text-slate-400">({users.length})</span>}
        </h2>
        {loadingUsers ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
            <Users className="h-8 w-8" />
            <p className="text-sm">Aún no hay clientes registrados.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Registrado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{user.nombre}</td>
                    <td className="px-4 py-3 text-slate-600">{user.email}</td>
                    <td className="px-4 py-3">
                      {user.estado_activo ? (
                        <Badge variant="green">Activo</Badge>
                      ) : (
                        <Badge variant="default">Inactivo</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(user.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
