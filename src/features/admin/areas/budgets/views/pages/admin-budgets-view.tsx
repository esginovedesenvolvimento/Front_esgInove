import { AdminSectionHeading } from "@/features/admin/shared/components/admin-section-heading";
import { AdminStatCard } from "@/features/admin/shared/components/admin-stat-card";
import type { AdminBudgetBoardModel } from "@/features/admin/shared/types";
import { BudgetRequestCard } from "../../components/budget-request-card";

export function AdminBudgetsView({ model }: { model: AdminBudgetBoardModel }) {
  return (
    <div className="space-y-8">
      <AdminSectionHeading
        eyebrow="Orçamentos"
        title="Fila comercial e pedidos de proposta"
        description="Acompanhe a entrada de novos leads, o estado da revisão e o valor potencial da carteira."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {model.metrics.map((metric) => (
          <AdminStatCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {model.requests.map((request) => (
            <BudgetRequestCard key={request.id} request={request} />
          ))}
        </div>

        <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Resumo da fila</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">Status por etapa</h2>
          </div>

          <div className="space-y-3">
            {Object.entries(model.groupedByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">{status}</span>
                <span className="text-lg font-semibold text-slate-900">{count}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-slate-950 p-4 text-slate-100">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Valor aberto</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{model.openValue}</p>
            <p className="mt-2 text-sm text-slate-300">
              Carteira potencial considerando os pedidos ainda sem resposta final.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
