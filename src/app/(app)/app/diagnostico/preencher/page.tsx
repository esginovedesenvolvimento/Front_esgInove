"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getDiagnosticRunViewModel } from "@/features/company-area/controllers/diagnostic.controller";
import { DiagnosticRunView } from "@/features/company-area/views/pages/diagnostic-run-view";
import { useCompany } from "@/features/company-area/context/company-context";

function DiagnosticRunContent() {
  const { company, isLoading } = useCompany();
  const searchParams = useSearchParams();
  const diagnosticId = searchParams.get("id");

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (!diagnosticId) {
    return (
      <div className="p-6 text-center">
        <p className="text-foreground/75 font-medium">Nenhum diagnóstico ativo encontrado.</p>
      </div>
    );
  }

  const model = getDiagnosticRunViewModel(company?.industrySegment || undefined);

  return <DiagnosticRunView model={model} diagnosticId={diagnosticId} />;
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
