import { getDiagnosticOverviewViewModel } from "@/features/company-area/controllers/diagnostic.controller";
import { DiagnosticOverviewView } from "@/features/company-area/views/pages/diagnostic-overview-view";

export default function DiagnosticPage() {
  const model = getDiagnosticOverviewViewModel();

  return <DiagnosticOverviewView model={model} />;
}
