import { getDashboardViewModel } from "@/features/company-area/controllers/dashboard.controller";
import { DashboardView } from "@/features/company-area/views/pages/dashboard-view";

export default function AppHomePage() {
  const model = getDashboardViewModel();

  return <DashboardView model={model} />;
}
