"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, ChartNoAxesCombined, FileSpreadsheet, FileText, LogOut, ShieldCheck, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthController } from "@/features/auth/controllers/use-auth.controller";
import type { AdminSessionUser } from "../server-auth";

const navigation = [
  { href: "/admin", label: "Visão geral", icon: ChartNoAxesCombined },
  { href: "/admin/orcamentos", label: "Orçamentos", icon: FileText },
  { href: "/admin/clientes", label: "Clientes", icon: Building2 },
  { href: "/admin/fornecedores", label: "Fornecedores", icon: Users2 },
  { href: "/admin/evidencias", label: "Evidências", icon: ShieldCheck },
  { href: "/admin/analises", label: "Análises", icon: FileSpreadsheet },
] as const;

export function AdminSidebar({ adminUser }: { adminUser: AdminSessionUser }) {
  const pathname = usePathname();
  const { logout } = useAuthController();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200/80 bg-slate-950 text-slate-100 lg:flex">
      <div className="flex w-full flex-col">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300/80">
            Admin Inove ESG
          </p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-white">
            Painel operacional
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Orçamentos, clientes, fornecedores, evidências e análises em um único fluxo.
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-6 py-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Sessão ativa
            </p>
            <p className="mt-2 text-sm font-medium text-white">
              {adminUser.fullName ?? adminUser.email}
            </p>
            <p className="text-xs text-slate-400">{adminUser.email}</p>

            <button
              type="button"
              onClick={logout}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
