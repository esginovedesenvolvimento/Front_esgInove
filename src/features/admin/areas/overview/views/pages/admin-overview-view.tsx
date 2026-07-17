import Link from "next/link";
import { ArrowRight, BellRing, CircleDollarSign, FileText, ShieldCheck, Users } from "lucide-react";
import { AdminSectionHeading } from "@/features/admin/shared/components/admin-section-heading";
import { AdminStatCard } from "@/features/admin/shared/components/admin-stat-card";
import { AdminStatusBadge } from "@/features/admin/shared/components/admin-status-badge";
import type { AdminOverviewModel } from "@/features/admin/shared/types";
import { OverviewPill } from "../../components/overview-pill";

export function AdminOverviewView({ model }: { model: AdminOverviewModel }) {
  const openBudgetMetric = model.metrics.find((metric) => metric.id === "budgets-open");
  const evidenceMetric = model.metrics.find((metric) => metric.id === "evidence-pending");

  return (
    <div className="space-y-8">
      <AdminSectionHeading
        eyebrow="Visão geral"
        title="Operação ESG em tempo real"
        description="Painel de leitura rápida para orçamento, contas, evidências, fornecedores e acompanhamento dos pilares do diagnóstico."
        action={
          <Link
            href="/admin/analises"
            className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
          >
            Abrir análises <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {model.metrics.map((metric) => (
          <AdminStatCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Fila crítica</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">Orçamentos e solicitações recentes</h2>
            </div>
            <Link href="/admin/orcamentos" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
              Ver orçamento
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {model.queue.map((request) => (
              <div key={request.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{request.organizationName}</p>
                    <p className="text-sm text-slate-600">{request.sector} · {request.employeeCount}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AdminStatusBadge
                      label={request.status}
                      tone={request.status === "PENDING" ? "amber" : "slate"}
                    />
                    <span className="text-sm font-semibold text-slate-800">{request.proposalValue}</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {request.tags.map((tag) => (
                    <OverviewPill key={tag} axis="G" label={tag} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-slate-100 shadow-sm">
          <div className="flex items-center gap-2">
            <BellRing className="h-4 w-4 text-emerald-300" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Leituras rápidas</p>
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">O que merece atenção agora</h2>

          <div className="mt-5 space-y-3">
            {model.insights.map((insight) => (
              <div key={insight.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      insight.tone === "emerald"
                        ? "bg-emerald-400"
                        : insight.tone === "amber"
                          ? "bg-amber-400"
                          : insight.tone === "rose"
                            ? "bg-rose-400"
                            : "bg-slate-400"
                    }`}
                  />
                  <p className="font-medium text-white">{insight.title}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{insight.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-slate-300">
                <CircleDollarSign className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.14em]">Conversão</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{openBudgetMetric?.value ?? "0"}</p>
              <p className="text-sm text-slate-400">{openBudgetMetric?.detail ?? "entrada registrada no funil"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.14em]">Cobertura</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{evidenceMetric?.value ?? "0"}</p>
              <p className="text-sm text-slate-400">{evidenceMetric?.detail ?? "aguardando validação técnica"}</p>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Clientes</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">Contas que exigem atenção</h2>
            </div>
            <Link href="/admin/clientes" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
              Ver clientes
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {model.clientHighlights.slice(0, 3).map((client) => (
              <div key={client.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
                <div>
                  <p className="font-semibold text-slate-900">{client.tradeName}</p>
                  <p className="text-sm text-slate-600">{client.segment}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{client.score}/100</p>
                  <p className="text-xs text-slate-500">{client.evidencePending} pendências</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Fornecedores</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">Base convidada e resposta</h2>
            </div>
            <Link href="/admin/fornecedores" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
              Ver fornecedores
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {model.supplierHighlights.slice(0, 3).map((supplier) => (
              <div key={supplier.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
                <div>
                  <p className="font-semibold text-slate-900">{supplier.companyName}</p>
                  <p className="text-sm text-slate-600">{supplier.segment}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{supplier.progress}%</p>
                  <p className="text-xs text-slate-500">{supplier.lastUpdate}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {model.evidenceHighlights.slice(0, 4).map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{item.axis}</p>
            <h3 className="mt-2 font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{item.companyName}</p>
            <div className="mt-4 flex items-center justify-between">
              <AdminStatusBadge
                label={item.status}
                tone={item.status === "VERIFIED" ? "emerald" : item.status === "REJECTED" ? "rose" : "amber"}
              />
              <span className="text-xs text-slate-500">{item.uploadDate}</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
