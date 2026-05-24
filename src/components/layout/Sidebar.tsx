"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  Users,
  Layers,
  LogOut,
  Bot,
  ListFilter,
  PlusCircle,
  BarChart2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: string[];
}

const navItems: NavItem[] = [
  { href: "/client/new-ticket", label: "Nuevo ticket", icon: PlusCircle, roles: ["user"] },
  { href: "/client/my-tickets", label: "Mis tickets", icon: Ticket, roles: ["user"] },
  { href: "/technician", label: "Mis tickets", icon: LayoutDashboard, roles: ["technician"] },
  { href: "/admin/tickets", label: "Todos los tickets", icon: ListFilter, roles: ["admin"] },
  { href: "/admin/metrics", label: "Métricas", icon: BarChart2, roles: ["admin"] },
  { href: "/admin/levels", label: "Niveles", icon: Layers, roles: ["admin"] },
  { href: "/admin/technicians", label: "Técnicos", icon: Users, roles: ["admin"] },
  { href: "/admin/users", label: "Usuarios", icon: Users, roles: ["admin"] },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const visibleItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <aside className="flex h-full w-60 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Bot className="h-4.5 w-4.5 text-white" />
        </div>
        <span className="font-semibold text-slate-900 text-sm">Helpdesk AI</span>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {visibleItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-100 p-3">
        <div className="mb-2 px-3 py-1">
          <p className="text-xs font-medium text-slate-900 truncate">{user?.nombre}</p>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-slate-500"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
