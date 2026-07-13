"use client";

import { useEffect, useRef, useState } from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { getDiagnosticRunViewModel } from "../../../controllers/diagnostic.controller";
import { diagnosticService } from "../../../services/diagnostic.service";
import { useCompany } from "@/features/company-area/context/company-context";
import { ArrowLeft, ArrowRight, CircleCheckBig, CircleDashed, ShieldCheck } from "lucide-react";

type DiagnosticRunViewModel = ReturnType<typeof getDiagnosticRunViewModel>;

export function DiagnosticRunView({
  model,
  diagnosticId,
  axis,
  isFinalFlow = false,
}: {
  model: DiagnosticRunViewModel;
  diagnosticId: string;
  axis?: string | null;
  isFinalFlow?: boolean;
}) {
  const { refreshProfile } = useCompany();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(() => {
    return isFinalFlow ? model.questions.length : 0;
  });
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [selectedOption, setSelectedOption] = useState<{ questionId: string; option: string } | null>(null);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    let saved: Record<string, string> = {};
    if (typeof window !== "undefined") {
      const cached = window.sessionStorage.getItem(`inoveesg:diagnostic-answers-${diagnosticId}`);
      if (cached) {
        try {
          saved = JSON.parse(cached);
        } catch (e) {
          console.error("Erro ao carregar respostas temporarias:", e);
        }
      }
    }
    // Pre-populate with database answers for the current model questions if not already in saved
    model.questions.forEach((q) => {
      if (!(q.id in saved)) {
        saved[q.id] = q.answer || "";
      }
    });
    return saved;
  });

  const answeredCount = model.questions.filter((q) => answers[q.id]?.trim().length > 0).length;
  const isComplete = answeredCount === model.total;
  const lastQuestionIndex = model.questions.length - 1;
  const isDeclarationStep = currentIndex === model.questions.length;
  const currentQuestion = !isDeclarationStep ? model.questions[currentIndex] : null;
  const currentQuestionId = currentQuestion?.id ?? "";
  const currentAnswer = currentQuestionId ? answers[currentQuestionId] || "" : "";
  const progressPercentage = model.total > 0 ? Math.round((answeredCount / model.total) * 100) : 0;
  const axisInfo = {
    E: { label: "Ambiental", next: "B", nextLabel: "Bioeconomia Circular" },
    B: { label: "Bioeconomia Circular", next: "S", nextLabel: "Social" },
    S: { label: "Social", next: "G", nextLabel: "Governança" },
    G: { label: "Governança", next: null, nextLabel: "" },
  }[axis || "E"] || { label: "Eixo", next: null, nextLabel: "" };

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  // Persistir respostas no sessionStorage sempre que mudarem
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(`inoveesg:diagnostic-answers-${diagnosticId}`, JSON.stringify(answers));
    }
  }, [answers, diagnosticId]);

  const handleRadioChange = (questionId: string, value: string) => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
    }

    if (declarationAccepted) {
      setDeclarationAccepted(false);
    }

    setSelectedOption({ questionId, option: value });
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    if (currentIndex < model.questions.length - 1) {
      advanceTimerRef.current = setTimeout(() => {
        setSlideDirection("next");
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
      }, 420);
    } else {
      advanceTimerRef.current = setTimeout(() => {
        setSlideDirection("next");
        setCurrentIndex(model.questions.length);
        setSelectedOption(null);
      }, 420);
    }
  };

  const handleTextareaChange = (questionId: string, value: string) => {
    if (declarationAccepted) {
      setDeclarationAccepted(false);
    }

    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const buildResponsesPayload = () => {
    return model.questions.map((question) => {
      let axisEnum: "ENVIRONMENTAL" | "BIOECONOMY_CIRCULAR" | "SOCIAL" | "GOVERNANCE" = "GOVERNANCE";
      if (question.axis === "E") axisEnum = "ENVIRONMENTAL";
      else if (question.axis === "B") axisEnum = "BIOECONOMY_CIRCULAR";
      else if (question.axis === "S") axisEnum = "SOCIAL";
      const questionOrder = Number(question.id.replace(/^q-/, ""));

      return {
        questionCode: question.id,
        questionOrder,
        axis: axisEnum,
        questionText: question.prompt,
        questionType: question.options ? ("MULTIPLE_CHOICE" as const) : ("TEXT" as const),
        answerText: answers[question.id] || "",
        options: question.options,
      };
    });
  };

  const saveCurrentAxis = async () => {
    if (!isComplete || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const token = getCookie("inoveesg_token") as string;
      const responsesPayload = buildResponsesPayload();

      await diagnosticService.submitDiagnostic(token, diagnosticId, false, false, responsesPayload);
      await refreshProfile();
      router.push("/app/diagnostico");
    } catch (err) {
      console.error("Failed to save diagnostic axis:", err);
      alert("Erro ao salvar as respostas. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goPrevious = () => {
    if (isDeclarationStep) {
      setSlideDirection("prev");
      setCurrentIndex(lastQuestionIndex);
      return;
    }

    if (currentIndex === 0) return;
    setSlideDirection("prev");
    setCurrentIndex((prev) => prev - 1);
  };

  const goNext = () => {
    if (isDeclarationStep) return;
    if (currentIndex >= model.questions.length - 1) {
      setSlideDirection("next");
      setCurrentIndex(model.questions.length);
      return;
    }
    setSlideDirection("next");
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    if (!isComplete || !declarationAccepted || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const token = getCookie("inoveesg_token") as string;

      await diagnosticService.submitDiagnostic(token, diagnosticId, declarationAccepted, true);
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("inoveesg:diagnostic-start");
        window.sessionStorage.removeItem(`inoveesg:diagnostic-answers-${diagnosticId}`);
      }
      await refreshProfile();
      router.push("/app/resultados");
    } catch (err) {
      console.error("Failed to submit diagnostic:", err);
      alert("Erro ao salvar o diagnóstico. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const questionMotionClass =
    slideDirection === "next"
      ? "animate-in fade-in slide-in-from-right-6 duration-300"
      : "animate-in fade-in slide-in-from-left-6 duration-300";

    if (isDeclarationStep) {
    if (!isFinalFlow) {
      return (
        <div className="mx-auto max-w-xl text-center space-y-6 py-12 animate-in fade-in zoom-in-95 duration-300">
          <div className="inline-flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
            <CircleCheckBig className="size-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Prova Concluída!</h1>
            <p className="text-base text-slate-600">
              Você concluiu a prova de <span className="font-semibold text-slate-800">{axisInfo.label}</span>. Salve agora para registrar as respostas no banco.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-center">
            <Button
              onClick={saveCurrentAxis}
              disabled={isSubmitting}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11 border-none disabled:opacity-50"
            >
              {isSubmitting ? "Salvando..." : "Finalizar e voltar ao painel"}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="space-y-4 border-b border-border/70 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-foreground/45 font-semibold">Diagnóstico ESG</p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">Declaração final</h1>
              <p className="mt-2 text-sm text-foreground/65">Antes de concluir, confirme a responsabilidade pelas informações prestadas.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goPrevious}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
              aria-label="Voltar para a última pergunta"
            >
              <ArrowLeft className="size-4" />
            </button>

            <div className="h-1.5 flex-1 rounded-full bg-slate-200/80 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-600 transition-all duration-300" style={{ width: "100%" }} />
            </div>

          </div>
        </div>

        <div className="relative rounded-[28px] border border-border/70 bg-white/90 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <ShieldCheck className="size-5" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/45">Termo de autorresponsabilidade</p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Confirmação obrigatória antes do envio</h2>
              <p className="text-sm text-foreground/65">O diagnóstico será salvo e calculado somente após esta confirmação.</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
            <div className="max-h-[22rem] space-y-4 overflow-y-auto pr-2 text-sm leading-7 text-slate-700">
              <p className="font-semibold text-slate-900">Termo de Autorresponsabilidade das Informações Prestadas</p>
              <p>
                O(a) respondente declara, para os devidos fins, que as informações fornecidas neste questionário refletem,
                de forma íntegra e fidedigna, a realidade atual da organização avaliada, assumindo total responsabilidade
                pela veracidade, legitimidade e consistência dos dados apresentados.
              </p>
              <p>
                O(a) respondente reconhece que os resultados do diagnóstico, análises técnicas, indicadores,
                recomendações estratégicas, relatórios e possíveis enquadramentos de maturidade ESG serão elaborados com
                base nas informações disponibilizadas neste instrumento.
              </p>
              <p>
                A Inove-ESG não se responsabiliza por conclusões, classificações, interpretações ou resultados
                decorrentes de informações incompletas, imprecisas, desatualizadas ou inverídicas fornecidas pela
                organização ou por seus representantes.
              </p>
              <p>
                Ao prosseguir com o preenchimento, o(a) respondente confirma estar ciente de que este diagnóstico possui
                caráter técnico, estratégico e orientativo, sendo fundamental a transparência e boa-fé no fornecimento
                das informações.
              </p>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">98. Declaração de Ciência e Concordância</p>
                <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={declarationAccepted}
                    onChange={(event) => setDeclarationAccepted(event.target.checked)}
                    className="mt-1 size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">
                    Declaro que li e concordo com os termos de confidencialidade, LGPD e autorresponsabilidade apresentados neste formulário, comprometendo-me com a veracidade das informações fornecidas.
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-foreground/55">
              Esta é a última etapa antes de enviar as respostas, salvar no banco e calcular o diagnóstico.
            </p>
            <Button
              onClick={handleSubmit}
              disabled={!isComplete || !declarationAccepted || isSubmitting}
              className="h-11 rounded-xl bg-emerald-600 px-6 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Enviando..." : "Confirmar envio de respostas"}
            </Button>
          </div>

          {!declarationAccepted && (
            <p className="mt-4 text-sm font-medium text-amber-600">
              Você precisa marcar a declaração para finalizar o diagnóstico.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 border-b border-border/70 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-foreground/45 font-semibold">Diagnóstico ESG</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Preenchimento do questionário</h1>
            <p className="mt-2 text-sm text-foreground/65">Responda uma questão por vez. Use as setas para navegar ou selecione uma opção para avançar.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goPrevious}
            disabled={currentIndex === 0}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Pergunta anterior"
          >
            <ArrowLeft className="size-4" />
          </button>

          <div className="h-1.5 flex-1 rounded-full bg-slate-200/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={currentAnswer.trim().length === 0}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={currentIndex === lastQuestionIndex ? "Ir para declaração final" : "Próxima pergunta"}
          >
            <ArrowRight className="size-4" />
          </button>
        </div>

        <div className="flex items-center justify-between text-xs font-medium text-foreground/55">
          <span>{answeredCount}/{model.total} perguntas respondidas</span>
          <span>{isDeclarationStep ? "Declaração final" : `Etapa ${currentIndex + 1}/${model.questions.length}`}</span>
        </div>
      </div>

      <div className={`relative rounded-[28px] border border-border/70 bg-white/85 p-6 shadow-sm ${questionMotionClass}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/50">
                Pergunta {currentIndex + 1}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-foreground/60">
                Eixo {currentQuestion?.axis}
              </span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">{currentQuestion?.prompt}</h2>
            <p className="text-sm text-foreground/65">{currentQuestion?.hint}</p>
          </div>

        </div>

        <div className="mt-6 space-y-3">
          {currentQuestion?.options ? (
            currentQuestion.options.map((option, optIndex) => (
              (() => {
                const isSelected = currentAnswer === option;
                const isPendingAdvance = selectedOption?.questionId === currentQuestionId && selectedOption.option === option;

                return (
              <label
                key={optIndex}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${
                  isSelected
                    ? "border-emerald-300 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-100"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name={currentQuestionId}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={() => handleRadioChange(currentQuestionId, option)}
                  disabled={isSubmitting}
                  className="size-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-sm leading-relaxed text-foreground">{option}</span>
                {isPendingAdvance ? (
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white animate-pulse">
                    <CircleCheckBig className="size-3" /> Marcada
                  </span>
                ) : (
                  isSelected && <CircleDashed className="ml-auto size-4 text-emerald-600" />
                )}
              </label>
                );
              })()
            ))
          ) : (
            <>
              <label className="block text-sm font-medium text-foreground/75" htmlFor={currentQuestionId}>
                Resposta
              </label>
              <textarea
                id={currentQuestionId}
                value={currentAnswer}
                onChange={(e) => handleTextareaChange(currentQuestionId, e.target.value)}
                disabled={isSubmitting}
                placeholder="Descreva processo, indicador, frequência e responsável."
                className="min-h-28 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none ring-0 focus:border-emerald-500"
              />
            </>
          )}
        </div>

        {currentIndex === lastQuestionIndex && (
          <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4">
            <p className="text-xs text-foreground/55">
              Última pergunta da sequência. A próxima etapa será a declaração final.
            </p>
            <Button
              onClick={goNext}
              disabled={currentAnswer.trim().length === 0}
              className="h-11 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Próxima etapa
            </Button>
          </div>
        )}

        {isComplete && currentIndex < lastQuestionIndex && (
          <div className="mt-6 flex flex-col items-center justify-between border-t border-border/70 pt-4 sm:flex-row gap-3">
            <p className="text-xs text-foreground/55">
              Todas as {model.total} perguntas deste diagnóstico já foram respondidas.
            </p>
            <Button
              onClick={() => {
                setSlideDirection("next");
                setCurrentIndex(model.questions.length);
              }}
              className="h-11 rounded-xl bg-emerald-600 px-6 text-white hover:bg-emerald-700 font-semibold"
            >
              Finalizar
            </Button>
          </div>
        )}

        {!isComplete && (
          <p className="mt-4 text-sm font-medium text-amber-600">
            Você deve responder a todas as {model.total} perguntas para concluir o diagnóstico.
          </p>
        )}
      </div>
    </div>
  );
}
