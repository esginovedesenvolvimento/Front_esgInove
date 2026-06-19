"use client";

import { getDiagnosticReviewViewModel } from "@/features/company-area/controllers/diagnostic.controller";
import { DiagnosticReviewView } from "@/features/company-area/views/pages/diagnostico/diagnostic-review-view";
import { useCompany } from "@/features/company-area/context/company-context";

export default function DiagnosticReviewPage() {
  const { company, isLoading } = useCompany();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  const model = getDiagnosticReviewViewModel(company?.industrySegment || undefined);

  return <DiagnosticReviewView model={model} />;
}
