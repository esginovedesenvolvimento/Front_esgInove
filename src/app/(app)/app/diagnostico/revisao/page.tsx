import { getDiagnosticReviewViewModel } from "@/features/company-area/controllers/diagnostic.controller";
import { DiagnosticReviewView } from "@/features/company-area/views/pages/diagnostic-review-view";

export default function DiagnosticReviewPage() {
  const model = getDiagnosticReviewViewModel();

  return <DiagnosticReviewView model={model} />;
}
