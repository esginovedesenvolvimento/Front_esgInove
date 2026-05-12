import { getResultsViewModel } from "@/features/company-area/controllers/results.controller";
import { ResultsView } from "@/features/company-area/views/pages/results-view";

export default function ResultsPage() {
  const model = getResultsViewModel();

  return <ResultsView model={model} />;
}
