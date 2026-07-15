import { adminFetch } from "@/features/admin/shared/api";
import type { AdminBudgetBoardModel } from "@/features/admin/shared/types";

export async function getBudgetBoardModel(): Promise<AdminBudgetBoardModel> {
  return adminFetch<AdminBudgetBoardModel>("/admin/budgets");
}
