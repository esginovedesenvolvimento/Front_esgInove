"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { getDiagnosticOverviewViewModel } from "@/features/company-area/controllers/diagnostic.controller";
import { DiagnosticOverviewView } from "@/features/company-area/views/pages/diagnostic-overview-view";
import { DiagnosticStartView } from "@/features/company-area/views/pages/diagnostic-start-view";
import { useCompany } from "@/features/company-area/context/company-context";
import { diagnosticService } from "@/features/company-area/services/diagnostic.service";

export default function DiagnosticPage() {
  const { company, user, isLoading, refreshProfile } = useCompany();
  const router = useRouter();
  
  const [dbDiagnostic, setDbDiagnostic] = useState<any>(null);
  const [isFetchingDiag, setIsFetchingDiag] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    async function loadCurrentDiagnostic() {
      const token = getCookie("inoveesg_token") as string;
      if (!token) {
        setIsFetchingDiag(false);
        return;
      }
      try {
        const res = await diagnosticService.getCurrentDiagnostic(token);
        if (res.hasDiagnostic) {
          setDbDiagnostic(res.diagnostic);
          if (res.diagnostic.status === "COMPLETED") {
            router.push("/app/resultados");
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load current diagnostic:", err);
      } finally {
        setIsFetchingDiag(false);
      }
    }

    if (!isLoading && company) {
      loadCurrentDiagnostic();
    } else if (!isLoading && !company) {
      setIsFetchingDiag(false);
    }
  }, [isLoading, company]);

  if (isLoading || isFetchingDiag) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  const hasDiagnostic = !!dbDiagnostic;
  const hasResponses = hasDiagnostic && dbDiagnostic._count?.responses > 0;

  const handleStart = async () => {
    setIsStarting(true);
    try {
      const token = getCookie("inoveesg_token") as string;
      
      if (hasDiagnostic) {
        router.push(`/app/diagnostico/preencher?id=${dbDiagnostic.id}`);
        return;
      }

      const session = await diagnosticService.simulatePreDiagnosticPurchase(token);
      await refreshProfile();
      
      router.push(`/app/checkout/simulate?id=${session.diagnosticId}`);
    } catch (err) {
      console.error("Failed to start diagnostic:", err);
    } finally {
      setIsStarting(false);
    }
  };

  if (!hasResponses) {
    return (
      <DiagnosticStartView
        userName={user?.fullName || "Usuário"}
        industrySegment={company?.industrySegment || "Geral"}
        onStart={handleStart}
        isStarting={isStarting}
      />
    );
  }

  const model = getDiagnosticOverviewViewModel(company?.industrySegment || undefined);

  return <DiagnosticOverviewView model={model} />;
}
