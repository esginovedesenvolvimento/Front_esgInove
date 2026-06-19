"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { getResultsViewModel } from "@/features/company-area/controllers/results.controller";
import { ResultsView } from "@/features/company-area/views/pages/resultados/results-view";
import { diagnosticService } from "@/features/company-area/services/diagnostic.service";

export default function ResultsPage() {
  const [dbDiagnostic, setDbDiagnostic] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        const token = getCookie("inoveesg_token") as string;
        if (!token) return;
        const res = await diagnosticService.getCurrentDiagnostic(token);
        if (res.hasDiagnostic && res.diagnostic) {
          setDbDiagnostic(res.diagnostic);
        }
      } catch (err) {
        console.error("Failed to load results:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadResults();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  // Get base model structures
  const baseModel = getResultsViewModel();

  // If we have diagnostic from DB, override with dynamic real data or aligned fallback mocks!
  if (dbDiagnostic) {
    const scoreObj = dbDiagnostic.score;
    const isPreDiagnostic = dbDiagnostic.kind === "PRE_DIAGNOSTIC";
    
    // Obter notas reais ou fallback para mocks
    const overallScore = scoreObj ? Math.round(Number(scoreObj.overallScore || 0)) : 64;
    const envScore = scoreObj ? Math.round(Number(scoreObj.environmentalScore || 0)) : 58;
    const bioScore = scoreObj ? Math.round(Number(scoreObj.bioeconomyCircularScore || 0)) : 61;
    const socScore = scoreObj ? Math.round(Number(scoreObj.socialScore || 0)) : 81;
    const govScore = scoreObj ? Math.round(Number(scoreObj.governanceScore || 0)) : 62;

    const globalProven = isPreDiagnostic ? 0 : Math.round(Number(scoreObj?.provenOverallScore || 0));
    const envProven = isPreDiagnostic ? 0 : Math.round(Number(scoreObj?.provenEnvironmentalScore || 0));
    const bioProven = isPreDiagnostic ? 0 : Math.round(Number(scoreObj?.provenBioeconomyCircularScore || 0));
    const socProven = isPreDiagnostic ? 0 : Math.round(Number(scoreObj?.provenSocialScore || 0));
    const govProven = isPreDiagnostic ? 0 : Math.round(Number(scoreObj?.provenGovernanceScore || 0));

    baseModel.globalScore = overallScore;
    baseModel.globalProvenScore = globalProven;
    baseModel.isPreDiagnostic = isPreDiagnostic;

    // Map dynamic axis scores and interpretations based on database scores
    const getInterpretation = (score: number, axis: string) => {
      const axisName = axis === "E" ? "ambiental" : axis === "B" ? "de bioeconomia circular" : axis === "S" ? "social" : "de governança";
      if (score >= 80) {
        return `Excelente maturidade ${axisName}. Práticas avançadas consolidadas com ótimo acompanhamento de metas e indicadores.`;
      } else if (score >= 60) {
        return `Desempenho ${axisName} estruturado. Processos em execução regular com oportunidades pontuais de aprimoramento.`;
      } else if (score >= 40) {
        return `Maturidade ${axisName} em nível intermediário. Políticas iniciadas, demandando maior formalização e auditoria.`;
      } else {
        return `Nível ${axisName} crítico/inicial. Alta necessidade de estruturação de processos e conformidade básica.`;
      }
    };

    baseModel.axisScores = [
      {
        axis: "E",
        score: envScore,
        provenScore: envProven,
        interpretation: getInterpretation(envScore, "E"),
      },
      {
        axis: "B",
        score: bioScore,
        provenScore: bioProven,
        interpretation: getInterpretation(bioScore, "B"),
      },
      {
        axis: "S",
        score: socScore,
        provenScore: socProven,
        interpretation: getInterpretation(socScore, "S"),
      },
      {
        axis: "G",
        score: govScore,
        provenScore: govProven,
        interpretation: getInterpretation(govScore, "G"),
      },
    ];
  }

  return <ResultsView model={baseModel} />;
}
