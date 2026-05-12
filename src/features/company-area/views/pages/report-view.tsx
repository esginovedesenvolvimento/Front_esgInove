"use client";

import { Button } from "@/components/ui/button";
import type { getReportViewModel } from "../../controllers/report.controller";
import { SectionHeading } from "../components/section-heading";
import { FileText, Download, CheckCircle2, XCircle, AlertCircle, FileWarning } from "lucide-react";

type ReportViewModel = ReturnType<typeof getReportViewModel>;

export function ReportView({ model }: { model: ReportViewModel }) {
  // Mock missing evidences
  const missingEvidences = {
    E: [
      { id: "e1", title: "Laudo de emissões atmosféricas", impact: "Alto", status: "Não enviado" },
      { id: "e2", title: "Inventário de resíduos sólidos", impact: "Médio", status: "Em análise" },
    ],
    S: [
      { id: "s1", title: "Comprovante de canal de denúncias ativo", impact: "Alto", status: "Não enviado" },
      { id: "s2", title: "Registro de treinamento de diversidade", impact: "Baixo", status: "Não enviado" },
    ],
    G: [], // All proven
  };

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow={`Relatório gerado em ${model.summary.generatedAt}`}
        title="Relatório ESG executivo"
        description="Consolidação de maturidade, desempenho por eixo e recomendações para evolução do próximo ciclo."
        action={
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Download className="h-4 w-4 mr-2" /> Exportar PDF
          </Button>
        }
      />

      {/* Overview Cards */}
      <section className="grid gap-4 md:grid-cols-4">
        <article className="border border-border bg-white/70 p-5 rounded-lg shadow-sm">
          <p className="text-xs uppercase tracking-[0.1em] text-foreground/55">Maturidade atual</p>
          <p className="mt-2 text-2xl font-semibold text-slate-800">{model.summary.maturity}</p>
        </article>
        <article className="border border-border bg-white/70 p-5 rounded-lg shadow-sm">
          <p className="text-xs uppercase tracking-[0.1em] text-foreground/55">Score global (Declarado)</p>
          <p className="mt-2 text-4xl font-semibold text-slate-800">{model.globalScore}</p>
        </article>
        <article className="border border-emerald-100 bg-emerald-50/50 p-5 rounded-lg shadow-sm">
          <p className="text-xs uppercase tracking-[0.1em] text-emerald-700/70">Score Comprovado</p>
          <p className="mt-2 text-4xl font-semibold text-emerald-700">65</p>
        </article>
        <article className="border border-border bg-white/70 p-5 rounded-lg shadow-sm">
          <p className="text-xs uppercase tracking-[0.1em] text-foreground/55">Próximo ciclo</p>
          <p className="mt-2 text-2xl font-semibold text-slate-800">{model.summary.nextCycleDate}</p>
        </article>
      </section>

      {/* Detailed Analysis */}
      <section className="grid gap-5 lg:grid-cols-2">
        <article className="space-y-3 border border-border bg-white/70 p-5 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold tracking-tight text-slate-800">Pontos fortes</h2>
          </div>
          <ul className="space-y-2 text-sm text-foreground/75">
            {model.summary.strengths.map((strength) => (
              <li key={strength} className="flex items-start space-x-2 border-b border-border/80 pb-2 last:border-0">
                <span className="text-emerald-600 font-bold">•</span>
                <span className="text-slate-700">{strength}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="space-y-3 border border-border bg-white/70 p-5 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold tracking-tight text-slate-800">Gaps prioritários</h2>
          </div>
          <ul className="space-y-2 text-sm text-foreground/75">
            {model.summary.gaps.map((gap) => (
              <li key={gap} className="flex items-start space-x-2 border-b border-border/80 pb-2 last:border-0">
                <span className="text-amber-600 font-bold">•</span>
                <span className="text-slate-700">{gap}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      {/* What's Missing (O que falta comprovar) */}
      <section className="space-y-4 border border-border bg-white/70 p-6 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <FileWarning className="h-5 w-5 text-amber-600" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-800">O que falta comprovar</h2>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Para que sua pontuação autodeclarada seja validada e se torne oficial, você precisa enviar as seguintes evidências:
        </p>

        <div className="space-y-4">
          {/* Eixo E */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-700">Eixo Ambiental (E)</h3>
            <div className="space-y-2">
              {missingEvidences.E.map((ev) => (
                <div key={ev.id} className="flex items-center justify-between bg-slate-50 p-3 border border-slate-200 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{ev.title}</p>
                    <p className="text-xs text-slate-500">Status: {ev.status} • Impacto no score: <span className={ev.impact === "Alto" ? "text-red-600 font-medium" : "text-amber-600"}>{ev.impact}</span></p>
                  </div>
                  <Button size="sm" variant="outline" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200">
                    Enviar agora
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Eixo S */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-700">Eixo Social (S)</h3>
            <div className="space-y-2">
              {missingEvidences.S.map((ev) => (
                <div key={ev.id} className="flex items-center justify-between bg-slate-50 p-3 border border-slate-200 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{ev.title}</p>
                    <p className="text-xs text-slate-500">Status: {ev.status} • Impacto no score: <span className={ev.impact === "Alto" ? "text-red-600 font-medium" : "text-amber-600"}>{ev.impact}</span></p>
                  </div>
                  <Button size="sm" variant="outline" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200">
                    Enviar agora
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Eixo G */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-700">Eixo Governança (G)</h3>
            <div className="flex items-center space-x-2 bg-emerald-50 p-3 border border-emerald-200 rounded-md">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <p className="text-sm text-emerald-700">Parabéns! Todas as evidências deste eixo foram validadas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="space-y-3 border border-border bg-white/70 p-5 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-800">Recomendações imediatas</h2>
        </div>
        <ul className="space-y-2 text-sm text-foreground/75">
          {model.actions.map((action) => (
            <li key={action.id} className="border-b border-border/80 pb-2 last:border-0 text-slate-700">
              <span className="font-medium">{action.title}</span> • {action.owner} • <span className="text-slate-500">prazo {action.dueDate}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
