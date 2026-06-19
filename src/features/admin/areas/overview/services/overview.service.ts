import { adminAnalyticsBoardModel, adminBudgetRequests, adminClients, adminEvidences, adminMetrics, adminSuppliers } from "@/features/admin/shared/mock-data";
import type { AdminOverviewModel } from "@/features/admin/shared/types";

export async function getAdminOverviewModel(): Promise<AdminOverviewModel> {
  return {
    metrics: adminMetrics,
    queue: adminBudgetRequests.filter((item) => item.status === "PENDING" || item.status === "IN_REVIEW"),
    clientHighlights: adminClients,
    supplierHighlights: adminSuppliers,
    evidenceHighlights: adminEvidences,
    insights: adminAnalyticsBoardModel.notes,
  };
}
