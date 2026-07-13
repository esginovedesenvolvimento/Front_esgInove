"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCookie } from "cookies-next";
import { getReportViewModel } from "@/features/company-area/controllers/report.controller";
import { ReportView } from "@/features/company-area/views/pages/relatorio/report-view";
import { diagnosticService } from "@/features/company-area/services/diagnostic.service";

export default function ReportPage() {
  const searchParams = useSearchParams();
  const reportType = searchParams.get("type") || "pre"; // 'pre' or 'audited'
  
  const [dbDiagnostic, setDbDiagnostic] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReportData() {
      try {
        const token = getCookie("inoveesg_token") as string;
        if (!token) return;
        const res = await diagnosticService.getCurrentDiagnostic(token);
        if (res.hasDiagnostic) {
          setDbDiagnostic(res.diagnostic);
        }
      } catch (err) {
        console.error("Failed to load report data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadReportData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  // Get fallback or base static structures
  const baseModel = getReportViewModel();

  // If we have diagnostic from DB, override with dynamic real data or aligned fallback mocks!
  if (dbDiagnostic) {
    const scoreObj = dbDiagnostic.score;
    const isPreDiagnostic = dbDiagnostic.kind === "PRE_DIAGNOSTIC";
    
    // Obter notas reais ou fallback para 0 se incompleto
    const overallScore = scoreObj ? Math.round(Number(scoreObj.overallScore || 0)) : 0;
    const envScore = scoreObj ? Math.round(Number(scoreObj.environmentalScore || 0)) : 0;
    const bioScore = scoreObj ? Math.round(Number(scoreObj.bioeconomyCircularScore || 0)) : 0;
    const socScore = scoreObj ? Math.round(Number(scoreObj.socialScore || 0)) : 0;
    const govScore = scoreObj ? Math.round(Number(scoreObj.governanceScore || 0)) : 0;

    const provenOverall = isPreDiagnostic ? 0 : Math.round(Number(scoreObj?.provenOverallScore || 0));
    const envProven = isPreDiagnostic ? 0 : Math.round(Number(scoreObj?.provenEnvironmentalScore || 0));
    const bioProven = isPreDiagnostic ? 0 : Math.round(Number(scoreObj?.provenBioeconomyCircularScore || 0));
    const socProven = isPreDiagnostic ? 0 : Math.round(Number(scoreObj?.provenSocialScore || 0));
    const govProven = isPreDiagnostic ? 0 : Math.round(Number(scoreObj?.provenGovernanceScore || 0));

    baseModel.globalScore = overallScore;
    baseModel.axisScores = [
      {
        axis: "E",
        score: envScore,
        provenScore: envProven,
        interpretation: "",
      },
      {
        axis: "B",
        score: bioScore,
        provenScore: bioProven,
        interpretation: "",
      },
      {
        axis: "S",
        score: socScore,
        provenScore: socProven,
        interpretation: "",
      },
      {
        axis: "G",
        score: govScore,
        provenScore: govProven,
        interpretation: "",
      },
    ];

    // Determine maturity label based on real score or maturityLevel enum
    let maturityLabel = "Nível 1 - Inicial";
    const maturityEnum = scoreObj?.maturityLevel;
    const finalScore = reportType === "audited" ? provenOverall : overallScore;

    if (maturityEnum) {
      const map: Record<string, string> = {
        NASCENT: "Nível 1 - Inicial",
        DEVELOPING: "Nível 2 - Básico",
        ESTABLISHED: "Nível 3 - Estruturado",
        MANAGED: "Nível 4 - Avançado",
        OPTIMIZED: "Nível 5 - Líder",
      };
      maturityLabel = map[maturityEnum] || maturityLabel;
    } else {
      if (finalScore >= 85) maturityLabel = "Nível 5 - Líder";
      else if (finalScore >= 70) maturityLabel = "Nível 4 - Avançado";
      else if (finalScore >= 50) maturityLabel = "Nível 3 - Estruturado";
      else if (finalScore >= 30) maturityLabel = "Nível 2 - Básico";
      else maturityLabel = "Nível 1 - Inicial";
    }

    baseModel.summary.maturity = maturityLabel;
    baseModel.summary.generatedAt = new Date(dbDiagnostic.updatedAt || dbDiagnostic.createdAt).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <ReportView
      model={baseModel}
      reportType={reportType as "pre" | "audited"}
      dbDiagnostic={dbDiagnostic}
    />
  );
}
