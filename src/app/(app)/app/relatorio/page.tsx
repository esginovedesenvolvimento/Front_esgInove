import { getReportViewModel } from "@/features/company-area/controllers/report.controller";
import { ReportView } from "@/features/company-area/views/pages/report-view";

export default function ReportPage() {
  const model = getReportViewModel();

  return <ReportView model={model} />;
}
