"use client";

import Link from "next/link";
import { FileCheck2, ShieldCheck, ShoppingCart, Truck, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { getDashboardViewModel } from "../../../controllers/dashboard.controller";
import { useCompany } from "../../../context/company-context";

import { PurchaseView } from "../checkout/purchase-view";
import { PreDiagnosticResultsView } from "../diagnostico/pre-diagnostic-results-view";

type DashboardViewModel = ReturnType<typeof getDashboardViewModel>;

const stageStyles = {
  concluido: "border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50",
  em_andamento: "border-amber-200 bg-amber-50/60 hover:bg-amber-50",
  critico: "border-red-200 bg-red-50/60 hover:bg-red-50",
  bloqueado: "border-slate-200 bg-slate-50/80 hover:bg-slate-100/60 opacity-60 pointer-events-none",
} as const;

const stageIcons = {
  diagnostic: FileCheck2,
  evidences: ShieldCheck,
  suppliers: Truck,
  monetization: ShoppingCart,
} as const;

export function DashboardView({ model }: { model: DashboardViewModel }) {
  const { user, company, isUnpaid, isSupplierOnly, hasOnlyPreDiagnostic, isLoading } = useCompany();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  // Se não tem plano e não tem nenhum entitlement (recém cadastrado)
  if (isUnpaid) {
    return (
      <PurchaseView />
    );
  }

  // Se só tem o pré-diagnóstico concluído (ou em andamento)
  if (hasOnlyPreDiagnostic) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            Olá, {user?.fullName?.split(" ")[0] || "Empresa"}! 👋
          </h1>
          <p className="text-sm text-slate-500">Aqui estão os resultados da sua avaliação inicial.</p>
        </div>
        <PreDiagnosticResultsView />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ── Heading ───────────────────────────────────────────────── */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
            {company?.tradeName || model.companyProfile.name} · {model.companyProfile.cycle}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-800">
            Olá, {user?.fullName?.split(" ")[0] || "Empresa"}! 👋
          </h1>
          <p className="text-sm text-slate-500">Bem-vindo ao seu Painel ESG.</p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto">
          <Link href="/app/diagnostico/preencher">Continuar diagnóstico</Link>
        </Button>
      </div>

      {/* ── KPI strip ─────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">

        <article className="flex flex-col justify-between gap-1 border border-border bg-white/70 p-3 sm:p-4 rounded-xl shadow-sm">
          <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-slate-400">Diagnóstico</p>
          <p className="text-xl sm:text-2xl font-semibold text-slate-800">
            {model.completedSections}
            <span className="text-sm sm:text-base font-normal text-slate-400"> / {model.sections.length}</span>
          </p>
          <p className="text-[10px] sm:text-xs text-slate-400">seções concluídas</p>
        </article>

        <article className="flex flex-col justify-between gap-1 border border-border bg-white/70 p-3 sm:p-4 rounded-xl shadow-sm">
          <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-slate-400">Cadeia</p>
          <p className="text-xl sm:text-2xl font-semibold text-amber-500">{model.pendingSuppliers}</p>
          <p className="text-[10px] sm:text-xs text-slate-400">fornecedores pendentes</p>
        </article>

        <article className="flex flex-col justify-between gap-1 border border-border bg-white/70 p-3 sm:p-4 rounded-xl shadow-sm">
          <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-slate-400">Convites</p>
          <p className="text-xl sm:text-2xl font-semibold text-slate-800">
            {model.inviteBalance.available}
            <span className="text-sm sm:text-base font-normal text-slate-400"> / {model.inviteBalance.acquired}</span>
          </p>
          <p className="text-[10px] sm:text-xs text-slate-400">disponíveis</p>
        </article>

        <article className="flex flex-col justify-between gap-1 border border-border bg-white/70 p-3 sm:p-4 rounded-xl shadow-sm">
          <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-slate-400">Plano</p>
          <p className="text-lg sm:text-2xl font-semibold text-emerald-600 truncate">{model.companyProfile.plan}</p>
          <p className="text-[10px] sm:text-xs text-slate-400 truncate">{company?.industrySegment || model.companyProfile.sector}</p>
        </article>

      </section>

      {/* ── Journey grid ──────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Jornada do ciclo</h2>
          <Button asChild variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 -mr-2">
            <Link href="/app/relatorio">Ver relatório <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {model.workflow.map((stage) => {
            const Icon = stageIcons[stage.id as keyof typeof stageIcons];
            return (
              <Link
                key={stage.id}
                href={stage.href}
                className={`flex flex-col gap-2 border p-3 rounded-xl transition-colors h-full ${stageStyles[stage.status]}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="shrink-0 rounded-full bg-white/80 p-2">
                    <Icon className="h-4 w-4 text-slate-600" />
                  </div>
                  {stage.status === "bloqueado" && <Lock className="h-3.5 w-3.5 text-slate-400 mt-1" />}
                </div>
                
                <div className="flex-1 flex flex-col mt-1">
                  <p className="font-semibold text-slate-800 text-xs sm:text-sm leading-tight mb-1 line-clamp-2">
                    {stage.title}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-500 leading-snug line-clamp-2 mb-2">
                    {stage.description}
                  </p>
                  <div className="mt-auto pt-2 border-t border-black/5">
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-600 block line-clamp-2">{stage.metric}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}
