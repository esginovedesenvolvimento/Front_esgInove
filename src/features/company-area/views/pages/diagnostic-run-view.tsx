"use client";

import { useState } from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { getDiagnosticRunViewModel } from "../../controllers/diagnostic.controller";
import { SectionHeading } from "../components/section-heading";
import { StatusPill } from "../components/status-pill";
import { diagnosticService } from "../../services/diagnostic.service";

type DiagnosticRunViewModel = ReturnType<typeof getDiagnosticRunViewModel>;

export function DiagnosticRunView({ model, diagnosticId }: { model: DiagnosticRunViewModel; diagnosticId: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const router = useRouter();

  // Controle local do estado das respostas para cálculo em tempo real
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    model.questions.forEach((q) => {
      initial[q.id] = q.answer || "";
    });
    return initial;
  });

  const answeredCount = Object.values(answers).filter(val => val.trim().length > 0).length;
  const isComplete = answeredCount === model.total;

  const handleRadioChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleTextareaChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    if (!isComplete || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const token = getCookie("inoveesg_token") as string;
      const responsesPayload = model.questions.map((question) => {
        let axisEnum: "ENVIRONMENTAL" | "SOCIAL" | "GOVERNANCE" = "GOVERNANCE";
        if (question.axis === "E") {
          axisEnum = "ENVIRONMENTAL";
        } else if (question.axis === "S") {
          axisEnum = "SOCIAL";
        }

        return {
          questionCode: question.id,
          questionOrder: model.questions.indexOf(question) + 1,
          axis: axisEnum,
          questionText: question.prompt,
          questionType: question.options ? ("MULTIPLE_CHOICE" as const) : ("TEXT" as const),
          answerText: answers[question.id] || "",
          options: question.options,
        };
      });

      const res = await diagnosticService.submitDiagnostic(token, diagnosticId, responsesPayload);
      setResults(res);
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit diagnostic:", err);
      alert("Erro ao salvar o diagnóstico. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMaturityLabel = (level: string) => {
    switch (level) {
      case "NASCENT": return "Nascente";
      case "DEVELOPING": return "Em Desenvolvimento";
      case "ESTABLISHED": return "Estabelecido";
      case "MANAGED": return "Gerenciado";
      case "OPTIMIZED": return "Otimizado";
      default: return level;
    }
  };

  const scores = [
    { title: "Geral", score: results?.overallScore ?? 0, isOverall: true },
    { title: "Ambiental", score: results?.environmentalScore ?? 0 },
    { title: "Social", score: results?.socialScore ?? 0 },
    { title: "Governança", score: results?.governanceScore ?? 0 },
  ];

  if (submitted && !showAnswers) {
    return (
      <div className="space-y-7">
        <SectionHeading
          eyebrow="Diagnóstico ESG"
          title="Resultado do Diagnóstico"
          description="Confira a pontuação da sua empresa em cada eixo analisado."
        />

        {results?.maturityLevel && (
          <div className="p-5 border border-emerald-200 bg-emerald-50/50 text-emerald-950 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-emerald-800">Nível de Maturidade ESG</p>
              <p className="text-2xl font-bold tracking-tight text-emerald-900 mt-1">{getMaturityLabel(results.maturityLevel)}</p>
            </div>
            <span className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
              Diagnóstico Concluído
            </span>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {scores.map((item) => (
            <div 
              key={item.title} 
              className={`border p-5 space-y-3 rounded-xl shadow-sm ${item.isOverall ? "border-emerald-200 bg-emerald-50/30" : "border-border bg-white/75"}`}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-foreground/50">{item.title}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-foreground">{item.score}</span>
                <span className="text-sm font-medium text-foreground/50">%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${item.isOverall ? "bg-emerald-600" : "bg-accent"}`} 
                  style={{ width: `${item.score}%` }} 
                />
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
            onClick={() => router.push("/app/diagnostico")}
            className="h-11 px-6 rounded-xl border-slate-200 hover:bg-slate-50"
          >
            Ir para o Painel
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
        <span>{answeredCount}/{model.total} perguntas respondidas</span>
        <span className="text-foreground/35">•</span>
      </div>

      <section className="space-y-3">
        {model.questions.map((question, index) => {
          const currentAnswer = answers[question.id] || "";
          const isAnswered = currentAnswer.trim().length > 0;

          return (
            <article key={question.id} className="space-y-4 border border-border bg-white/75 p-5 rounded-xl shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-foreground/50">
                  Pergunta {index + 1} • Eixo {question.axis}
                </p>
                <StatusPill status={isAnswered ? "concluido" : "nao_iniciado"} />
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
                      className={`flex items-center gap-3 p-3 border rounded-lg ${currentAnswer === option ? 'border-accent bg-accent/5' : 'border-border bg-white'} cursor-pointer hover:bg-slate-50 transition-colors`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={currentAnswer === option}
                        onChange={() => handleRadioChange(question.id, option)}
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
                    value={currentAnswer}
                    onChange={(e) => handleTextareaChange(question.id, e.target.value)}
                    disabled={submitted}
                    placeholder="Descreva processo, indicador, frequência e responsável."
                    className="min-h-28 w-full border border-border bg-background px-3 py-2 text-sm outline-none ring-0 focus:border-accent rounded-lg"
                  />
                </>
              )}
            </article>
          );
        })}
      </section>

      <div className="flex flex-col gap-2 pt-2">
        {!submitted ? (
          <div className="space-y-3">
            <Button 
              onClick={handleSubmit}
              disabled={!isComplete || isSubmitting}
              className="h-11 px-6 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Enviando..." : "Enviar Diagnóstico"}
            </Button>
            {!isComplete && (
              <p className="text-sm text-amber-600 font-semibold animate-pulse">
                * Você deve responder a todas as {model.total} perguntas para poder concluir o diagnóstico.
              </p>
            )}
          </div>
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
