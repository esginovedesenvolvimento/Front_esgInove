import { getEvidencesViewModel } from "@/features/company-area/controllers/evidences.controller";
import { EvidencesView } from "@/features/company-area/views/pages/evidences-view";

export default function EvidencesPage() {
  const model = getEvidencesViewModel();

  return <EvidencesView model={model} />;
}
