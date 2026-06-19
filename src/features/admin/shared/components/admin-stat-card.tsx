import { cn } from "@/lib/utils";
import type { AdminMetric } from "../types";

const tones = {
  emerald: "border-emerald-200 bg-emerald-50/80 text-emerald-700",
  amber: "border-amber-200 bg-amber-50/80 text-amber-700",
  slate: "border-slate-200 bg-slate-50/80 text-slate-700",
  rose: "border-rose-200 bg-rose-50/80 text-rose-700",
} as const;

export function AdminStatCard({ metric }: { metric: AdminMetric }) {
  const tone = metric.tone ?? "slate";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm shadow-slate-900/[0.03] backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {metric.label}
      </p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold tracking-tight text-slate-900">
          {metric.value}
        </p>
        <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-medium", tones[tone])}>
          {tone === "emerald" ? "saudável" : tone === "amber" ? "atenção" : tone === "rose" ? "crítico" : "estável"}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{metric.detail}</p>
    </article>
  );
}
