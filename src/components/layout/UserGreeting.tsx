"use client";

import { useAuth } from "@/hooks/useAuth";

function getRoleLabel(user: NonNullable<ReturnType<typeof useAuth>["user"]>): string {
  if (user.role === "admin") return "Admin";
  if (user.role === "user") return "Usuario";
  if (user.nivel) return `Técnico · ${user.nivel.nombre}`;
  return "Técnico";
}

function getRoleBadgeClass(role: string): string {
  if (role === "admin") return "bg-violet-100 text-violet-700";
  if (role === "user") return "bg-blue-100 text-blue-700";
  return "bg-green-100 text-green-700";
}

export function UserGreeting() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="mb-6 flex items-center gap-3">
      <p className="text-slate-700">
        <span className="font-semibold">¡Hola, {user.nombre}!</span>
      </p>
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
        {getRoleLabel(user)}
      </span>
    </div>
  );
}
