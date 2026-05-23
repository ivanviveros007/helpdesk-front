"use client";

import { useState } from "react";
import { Copy, Check, UserPlus, Mail, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { useInvitations, useCreateInvitation } from "@/hooks/useInvitations";

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

export function AdminUsersScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: invitations = [], isLoading } = useInvitations();
  const { mutate: createInvitation, isPending } = useCreateInvitation();

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
        description="Invitá clientes a tu organización. Recibirán un link único para registrarse."
      />

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

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : invitations.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-slate-400">
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {invitations.map((inv) => {
                const link = `${BASE_URL}/register?invite=${inv.token}`;
                const expired = new Date(inv.expires_at) < new Date();
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
