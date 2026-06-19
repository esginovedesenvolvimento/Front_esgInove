import { AdminSectionHeading } from "@/features/admin/shared/components/admin-section-heading";
import { AdminStatCard } from "@/features/admin/shared/components/admin-stat-card";
import type { AdminSupplierBoardModel } from "@/features/admin/shared/types";
import { SupplierCard } from "../../components/supplier-card";

export function AdminSuppliersView({ model }: { model: AdminSupplierBoardModel }) {
  return (
    <div className="space-y-8">
      <AdminSectionHeading
        eyebrow="Fornecedores"
        title="Convites, resposta e cobertura da cadeia"
        description="Veja quem foi convidado, quem respondeu e onde a cadeia ainda tem atrasos ou gaps de evidência."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {model.metrics.map((metric) => (
          <AdminStatCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Pipeline da cadeia</p>
          <div className="mt-4 space-y-3">
            {Object.entries(model.pipeline).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">{status}</span>
                <span className="text-lg font-semibold text-slate-900">{count}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          {model.suppliers.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      </section>
    </div>
  );
}
