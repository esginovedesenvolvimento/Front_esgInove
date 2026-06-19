import { AdminSectionHeading } from "@/features/admin/shared/components/admin-section-heading";
import { AdminStatCard } from "@/features/admin/shared/components/admin-stat-card";
import type { AdminEvidenceBoardModel } from "@/features/admin/shared/types";
import { EvidenceCard } from "../../components/evidence-card";

export function AdminEvidencesView({ model }: { model: AdminEvidenceBoardModel }) {
  return (
    <div className="space-y-8">
      <AdminSectionHeading
        eyebrow="Evidências"
        title="Fila de revisão e validação"
        description="Acompanhe a entrada de documentos, pendências críticas e o que já foi validado."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {model.metrics.map((metric) => (
          <AdminStatCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Distribuição</p>
          <div className="mt-4 space-y-3">
            {Object.entries(model.reviewDistribution).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">{status}</span>
                <span className="text-lg font-semibold text-slate-900">{count}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          {model.evidences.map((evidence) => (
            <EvidenceCard key={evidence.id} evidence={evidence} />
          ))}
        </div>
      </section>
    </div>
  );
}
