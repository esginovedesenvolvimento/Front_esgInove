import { AdminSectionHeading } from "@/features/admin/shared/components/admin-section-heading";
import { AdminStatCard } from "@/features/admin/shared/components/admin-stat-card";
import type { AdminClientBoardModel } from "@/features/admin/shared/types";
import { ClientCard } from "../../components/client-card";

export function AdminClientsView({ model }: { model: AdminClientBoardModel }) {
  return (
    <div className="space-y-8">
      <AdminSectionHeading
        eyebrow="Clientes"
        title="Carteira, risco e maturidade"
        description="Leitura operacional das contas atendidas, com foco em saúde da carteira e contas que precisam de ação."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {model.metrics.map((metric) => (
          <AdminStatCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Distribuição de saúde</p>
          <div className="mt-4 space-y-3">
            {Object.entries(model.healthDistribution).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">{status}</span>
                <span className="text-lg font-semibold text-slate-900">{count}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          {model.clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      </section>
    </div>
  );
}
