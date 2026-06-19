"use client";

import { getCookie } from "cookies-next";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { DiagnosticRunView } from "@/features/company-area/views/pages/diagnostico/diagnostic-run-view";
import { Button } from "@/components/ui/button";
import { diagnosticService, type DiagnosticStartPayload } from "@/features/company-area/services/diagnostic.service";

type DiagnosticRunModel = {
  questions: Array<{
    id: string;
    sectionId: string;
    axis: "E" | "B" | "S" | "G";
    category: string;
    weight: number;
    prompt: string;
    hint: string;
    answer: string;
    hasEvidence: boolean;
    options?: string[];
  }>;
  total: number;
  answered: number;
};

const DIAGNOSTIC_START_CACHE_KEY = "inoveesg:diagnostic-start";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapAxis(axis: DiagnosticStartPayload["questions"][number]["axis"]): "E" | "B" | "S" | "G" {
  if (axis === "ENVIRONMENTAL") return "E";
  if (axis === "BIOECONOMY_CIRCULAR") return "B";
  if (axis === "SOCIAL") return "S";
  return "G";
}

function mapPayloadToRunModel(payload: DiagnosticStartPayload): DiagnosticRunModel {
  const segmentSlug = slugify(payload.industrySegment || "diagnostico");
  const questions = payload.questions.map((question) => ({
    id: `q-${question.number}`,
    sectionId: `${segmentSlug}-${mapAxis(question.axis).toLowerCase()}`,
    axis: mapAxis(question.axis),
    category: question.category,
    weight: question.weight ?? 1,
    prompt: question.prompt,
    hint: "Selecione a alternativa que melhor representa a situação atual da empresa.",
    answer: "",
    hasEvidence: false,
    options: question.options.map((option) => option.text),
  }));

  return {
    questions,
    total: questions.length,
    answered: 0,
  };
}

function DiagnosticRunContent() {
  const searchParams = useSearchParams();
  const diagnosticIdFromUrl = searchParams.get("id");
  const [resolvedDiagnosticId, setResolvedDiagnosticId] = useState<string | null>(diagnosticIdFromUrl);
  const [model, setModel] = useState<DiagnosticRunModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blockedByConsultoria, setBlockedByConsultoria] = useState(false);

  useEffect(() => {
    async function loadDiagnostic() {
      try {
        if (typeof window !== "undefined") {
          const cached = window.sessionStorage.getItem(DIAGNOSTIC_START_CACHE_KEY);
          if (cached) {
            try {
              const parsed = JSON.parse(cached) as DiagnosticStartPayload;
              if (!diagnosticIdFromUrl || parsed.diagnosticId === diagnosticIdFromUrl) {
                setModel(mapPayloadToRunModel(parsed));
                setResolvedDiagnosticId(parsed.diagnosticId);
                return;
              }
            } catch {
              window.sessionStorage.removeItem(DIAGNOSTIC_START_CACHE_KEY);
            }
          }
        }

        const token = getCookie("inoveesg_token") as string;
        if (!token) {
          setError("Nenhum token de autenticação encontrado.");
          return;
        }

        const payload = await diagnosticService.startDiagnostic(token);
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(DIAGNOSTIC_START_CACHE_KEY, JSON.stringify(payload));
        }

        setModel(mapPayloadToRunModel(payload));
        setResolvedDiagnosticId(payload.diagnosticId);
      } catch (err) {
        console.error("Failed to load diagnostic questions:", err);
        const message = err instanceof Error ? err.message : "Não foi possível carregar o diagnóstico.";
        setBlockedByConsultoria(message.toLowerCase().includes("consultoria"));
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadDiagnostic();
  }, [diagnosticIdFromUrl]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-900">Não foi possível iniciar o diagnóstico</p>
        <p className="mt-2 text-sm text-slate-600">{error}</p>
        {blockedByConsultoria && (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
              <Link href="/app/upgrade">Contratar consultoria</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-50">
              <Link href="/app/resultados">Ver resultados atuais</Link>
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (!model || !resolvedDiagnosticId) {
    return (
      <div className="p-6 text-center">
        <p className="text-foreground/75 font-medium">Nenhum diagnóstico ativo encontrado.</p>
      </div>
    );
  }

  return <DiagnosticRunView model={model} diagnosticId={resolvedDiagnosticId} />;
}

export default function DiagnosticRunPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      }
    >
      <DiagnosticRunContent />
    </Suspense>
  );
}
