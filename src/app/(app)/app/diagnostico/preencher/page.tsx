import { getDiagnosticRunViewModel } from "@/features/company-area/controllers/diagnostic.controller";
import { DiagnosticRunView } from "@/features/company-area/views/pages/diagnostic-run-view";

export default function DiagnosticRunPage() {
  const model = getDiagnosticRunViewModel();

  return <DiagnosticRunView model={model} />;
}
