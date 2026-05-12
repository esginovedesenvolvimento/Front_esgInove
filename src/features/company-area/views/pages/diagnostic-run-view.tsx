"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { getDiagnosticRunViewModel } from "../../controllers/diagnostic.controller";
import { SectionHeading } from "../components/section-heading";
import { StatusPill } from "../components/status-pill";

type DiagnosticRunViewModel = ReturnType<typeof getDiagnosticRunViewModel>;

export function DiagnosticRunView({ model }: { model: DiagnosticRunViewModel }) {
  const [submitted, setSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  // Mapeamento de eixos para pontuações mockadas
  const scores = [
    { title: "Governança", score: 80 },
    { title: "Bio", score: 65 },
    { title: "Social", score: 90 },
    { title: "Ambiental", score: 75 },
  ];

  if (submitted && !showAnswers) {
    return (
      <div className="space-y-7">
        <SectionHeading
          eyebrow="Diagnóstico ESG"
          title="Resultado do Diagnóstico"
          description="Confira a pontuação da sua empresa em cada eixo analisado."
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {scores.map((item) => (
            <div key={item.title} className="border border-border bg-white/75 p-5 space-y-3 rounded-xl shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-foreground/50">{item.title}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-foreground">{item.score}</span>
                <span className="text-sm font-medium text-foreground/50">%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-accent" style={{ width: `${item.score}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => setShowAnswers(true)}
            className="h-11 px-6 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Ver respostas
          </Button>
          <Button 
            variant="outline"
            onClick={() => setSubmitted(false)}
            className="h-11 px-6 rounded-xl border-slate-200 hover:bg-slate-50"
          >
            Voltar para o questionário
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Diagnóstico ESG"
        title={submitted ? "Respostas Enviadas" : "Preenchimento do questionário"}
        description={submitted ? "Você está visualizando as respostas enviadas." : "Responda as perguntas abaixo para gerar seu diagnóstico."}
      />

      <div className="flex flex-wrap items-center gap-2 text-sm text-foreground/70">
        <span>{model.answered}/{model.total} perguntas respondidas</span>
        <span className="text-foreground/35">•</span>
        <span>Salvamento automático habilitado</span>
      </div>

      <section className="space-y-3">
        {model.questions.map((question, index) => (
          <article key={question.id} className="space-y-4 border border-border bg-white/75 p-5 rounded-xl shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-foreground/50">
                Pergunta {index + 1} • Eixo {question.axis}
              </p>
              <StatusPill status={question.answer.trim().length > 0 ? "concluido" : "nao_iniciado"} />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold tracking-tight">{question.prompt}</h2>
              <p className="text-sm text-foreground/65">{question.hint}</p>
            </div>

            {question.options ? (
              <div className="space-y-2">
                {question.options.map((option, optIndex) => (
                  <label 
                    key={optIndex} 
                    className={`flex items-center gap-3 p-3 border rounded-lg ${question.answer === option ? 'border-accent bg-accent/5' : 'border-border bg-white'} cursor-pointer hover:bg-slate-50 transition-colors`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      defaultChecked={question.answer === option}
                      disabled={submitted}
                      className="size-4 text-accent border-border focus:ring-accent"
                    />
                    <span className="text-sm text-foreground">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <>
                <label className="block text-sm font-medium text-foreground/75" htmlFor={question.id}>
                  Resposta
                </label>
                <textarea
                  id={question.id}
                  defaultValue={question.answer}
                  disabled={submitted}
                  placeholder="Descreva processo, indicador, frequência e responsável."
                  className="min-h-28 w-full border border-border bg-background px-3 py-2 text-sm outline-none ring-0 focus:border-accent rounded-lg"
                />
              </>
            )}
          </article>
        ))}
      </section>

      <div className="flex flex-wrap gap-2">
        {!submitted ? (
          <Button 
            onClick={() => setSubmitted(true)}
            className="h-11 px-6 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Enviar Diagnóstico
          </Button>
        ) : (
          <Button 
            onClick={() => setShowAnswers(false)}
            className="h-11 px-6 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Voltar para Resultados
          </Button>
        )}
      </div>
    </div>
  );
}
