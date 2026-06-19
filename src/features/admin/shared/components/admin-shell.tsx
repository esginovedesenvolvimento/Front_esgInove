"use client";

import type { ReactNode } from "react";
import { Menu, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#eef2e7_0%,_#f8fafc_24%,_#f8fafc_100%)] text-slate-900">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/78 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Operação ESG
                  </p>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-semibold tracking-tight text-slate-900">
                      Console administrativo
                    </h1>
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
                  <Search className="h-4 w-4" />
                  <span>Buscar cliente, orçamento, fornecedor...</span>
                </div>
                <Button className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700">
                  Novo atalho
                </Button>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 md:px-8 md:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
