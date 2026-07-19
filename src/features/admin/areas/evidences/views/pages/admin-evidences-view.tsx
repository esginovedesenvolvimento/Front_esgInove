"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Sparkles } from "lucide-react";
import { AdminSectionHeading } from "@/features/admin/shared/components/admin-section-heading";
import { AdminStatCard } from "@/features/admin/shared/components/admin-stat-card";
import type {
  AdminEvidenceBoardModel,
  AdminEvidenceCompanySummary,
  AdminEvidencePillarSummary,
} from "@/features/admin/shared/types";

type Props = {
  model: AdminEvidenceBoardModel;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
};

function axisStyles(axis: string) {
  switch (axis) {
    case "E":
      return {
        title: "Ambiental",
        number: "text-emerald-700",
      };
    case "B":
      return {
        title: "Bioeconomia Circular",
        number: "text-amber-700",
      };
    case "S":
      return {
        title: "Social",
        number: "text-sky-700",
      };
    case "G":
      return {
        title: "Governança",
        number: "text-rose-700",
      };
    default:
      return {
        title: axis,
        number: "text-slate-700",
      };
  }
}

function makePillar(axis: "E" | "B" | "S" | "G", score: number, provenScore: number, evidenceTotal: number, verifiedEvidence: number, pendingEvidence: number, responseTotal: number): AdminEvidencePillarSummary {
  return {
    axis,
    label: axisStyles(axis).title,
    score,
    provenScore,
    evidenceTotal,
    verifiedEvidence,
    pendingEvidence,
    responseTotal,
    gap: Math.max(0, score - provenScore),
  };
}

function OverallScore({ score, provenScore }: { score: number; provenScore: number }) {
  return (
    <div className="border-t border-slate-100 pt-3 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Geral</p>
      <div className="mt-1 flex items-end justify-center gap-3">
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.11em] text-slate-400">Declarada</p>
          <p className="text-base font-semibold tracking-tight text-slate-900">
            {score}
            <span className="text-xs text-slate-400">/100</span>
          </p>
        </div>
        <div className="text-left">
          <p className="text-[10px] uppercase tracking-[0.11em] text-slate-400">Comprovada</p>
          <p className="text-xl font-semibold tracking-tight text-amber-700">
            {provenScore}
            <span className="text-xs text-slate-400">/100</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function CompanyCard({
  company,
  active,
  onClick,
}: {
  company: AdminEvidenceCompanySummary;
  active: boolean;
  onClick: () => void;
}) {
  const metrics = company.pillars;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[1.25rem] border p-3 text-left transition ${
        active
          ? "border-emerald-300 bg-white"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Building2 className={`h-4 w-4 ${active ? "text-emerald-600" : "text-slate-400"}`} />
            <p className="text-base font-semibold tracking-tight text-slate-900">{company.companyName}</p>
          </div>
          <p className="text-xs text-slate-500">{company.category} · {company.segment}</p>
          <p className="text-xs text-slate-400">{company.legalName}</p>
        </div>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">{company.diagnosticStatus === "COMPLETED" ? "Concluído" : company.diagnosticStatus === "DRAFT" ? "Rascunho" : "Contratado"}</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
        {metrics.map((pillar) => {
          const styles = axisStyles(pillar.axis);
          return (
            <div key={pillar.axis} className="min-w-0 border-t border-slate-100 pt-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">{styles.title}</p>
              <div className="mt-1 flex items-end justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.11em] text-slate-400">Declarada</p>
                  <p className="text-base font-semibold tracking-tight text-slate-900">
                    {pillar.score}
                    <span className="text-xs text-slate-400">/100</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.11em] text-slate-400">Comprovada</p>
                  <p className={`text-xl font-semibold tracking-tight ${styles.number}`}>
                    {pillar.provenScore}
                    <span className="text-xs text-slate-400">/100</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <OverallScore score={company.score} provenScore={company.provenScore} />
      </div>

      <p className="mt-3 text-right text-xs text-slate-400">{company.lastDiagnosticAt}</p>
    </button>
  );
}

export function AdminEvidencesView({ model, isLoading = false }: Props) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(model.companies[0]?.id ?? null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "COMPLETED" | "DRAFT" | "CONTRACTED">("ALL");
  const [sortOrder, setSortOrder] = useState<"RECENT" | "OLD">("RECENT");

  const companies = useMemo(() => {
    const filtered = model.companies.filter((company) => statusFilter === "ALL" || company.diagnosticStatus === statusFilter);
    return sortOrder === "RECENT" ? filtered : [...filtered].reverse();
  }, [model.companies, sortOrder, statusFilter]);

  useEffect(() => {
    setSelectedCompanyId(companies[0]?.id ?? null);
  }, [companies]);

  const selectedCompany = companies.find((company) => company.id === selectedCompanyId) ?? companies[0] ?? null;

  return (
    <div className="space-y-8">
      <AdminSectionHeading
        eyebrow="Evidências"
        title="Empresas com acesso às evidências"
        description="Cada card mostra uma empresa e todas as notas dos pilares dentro do próprio card."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {model.metrics.map((metric) => (
          <AdminStatCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-3">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-300"
              >
                <option value="ALL">Todos os status</option>
                <option value="COMPLETED">Concluído</option>
                <option value="DRAFT">Rascunho</option>
                <option value="CONTRACTED">Contratado</option>
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Ordenação</span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as typeof sortOrder)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-300"
              >
                <option value="RECENT">Mais recentes</option>
                <option value="OLD">Mais antigos</option>
              </select>
            </label>
          </div>
        </div>

        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            active={company.id === selectedCompany?.id}
            onClick={() => setSelectedCompanyId(company.id)}
          />
        ))}
      </section>

      {!isLoading && !companies.length ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/60 p-10 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-4 text-sm font-semibold text-slate-900">Nenhuma empresa com acesso às evidências foi encontrada.</p>
        </div>
      ) : null}
    </div>
  );
}
