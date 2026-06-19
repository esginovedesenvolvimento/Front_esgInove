import { getBudgetBoardModel } from "@/features/admin/areas/budgets/services/budgets.service";
import { AdminBudgetsView } from "@/features/admin/areas/budgets/views/pages/admin-budgets-view";

export default async function AdminBudgetsPage() {
  const model = await getBudgetBoardModel();

  return <AdminBudgetsView model={model} />;
}
