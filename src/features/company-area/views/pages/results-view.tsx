"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { getResultsViewModel } from "../../controllers/results.controller";
import { SectionHeading } from "../components/section-heading";
import { CheckCircle2, AlertTriangle } from "lucide-react";

type ResultsViewModel = ReturnType<typeof getResultsViewModel>;

const axisLabel = {
  E: "Ambiental",
  S: "Social",
  G: "Governança",
};

// Mock proven scores since they are not in the controller yet
const provenScores = {
  E: 60,
  S: 45,
  G: 90,
};

export function ResultsView({ model }: { model: ResultsViewModel }) {
  // Calculate global proven score
  const globalProvenScore = Math.round(
    (provenScores.E + provenScores.S + provenScores.G) / 3
  );

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Resultados"
        title="Pontuação ESG consolidada"
        description="Visualize score global, desempenho por eixo e ações recomendadas para o próximo ciclo."
        action={
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/app/relatorio">Abrir relatório completo</Link>
          </Button>
        }
      />

      {/* Global Scores */}
      <div className="grid gap-4 md:grid-cols-2">
        <section className="border border-border bg-white/75 p-5 rounded-lg shadow-sm">
          <p className="text-xs uppercase tracking-[0.1em] text-foreground/55">Score Global (Declarado)</p>
          <p className="mt-2 text-5xl font-semibold leading-none tracking-tight text-slate-800">{model.globalScore}</p>
          <p className="text-xs text-slate-500 mt-2">Baseado nas respostas do formulário.</p>
        </section>

        <section className="border border-emerald-200 bg-emerald-50/50 p-5 rounded-lg shadow-sm">
          <p className="text-xs uppercase tracking-[0.1em] text-emerald-700/70">Score Global (Comprovado)</p>
          <p className="mt-2 text-5xl font-semibold leading-none tracking-tight text-emerald-700">{globalProvenScore}</p>
          <p className="text-xs text-emerald-600 mt-2">Baseado nas evidências validadas.</p>
        </section>
      </div>

      {/* Axis Scores */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Desempenho por Eixo</h2>
        
        {model.axisScores.map((axis) => {
          const declared = axis.score;
          const proven = provenScores[axis.axis];
          const isFullyProven = proven === declared;

          return (
            <article key={axis.axis} className="space-y-4 border border-border bg-white/70 p-5 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-slate-800 tracking-tight">
                    Eixo {axis.axis} • {axisLabel[axis.axis]}
                  </h3>
                  {isFullyProven ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Comprovado
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Pendente de Comprovação
                    </span>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Declared Score */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Pontuação Declarada</span>
                    <span className="font-semibold text-slate-700">{declared}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-400 transition-all duration-500"
                      style={{ width: `${declared}%` }}
                    />
                  </div>
                </div>

                {/* Proven Score */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-emerald-700 font-medium">Pontuação Comprovada</span>
                    <span className="font-semibold text-emerald-700">{proven}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-emerald-100">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                      style={{ width: `${proven}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-sm text-foreground/70 mt-2">{axis.interpretation}</p>
            </article>
          );
        })}
      </section>

      {/* Action Plan */}
      <section className="space-y-3 border border-border bg-white/70 p-5 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight text-slate-800">Plano de ação prioritário</h2>
        <ul className="space-y-2 text-sm text-foreground/75">
          {model.actions.map((action) => (
            <li key={action.id} className="border-b border-border/80 pb-2 last:border-0">
              <p className="font-medium text-slate-800">{action.title}</p>
              <p className="text-slate-500">{action.owner} • prioridade {action.priority} • prazo {action.dueDate}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
