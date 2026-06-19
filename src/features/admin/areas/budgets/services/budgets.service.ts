import { adminBudgetBoardModel } from "@/features/admin/shared/mock-data";
import type { AdminBudgetBoardModel } from "@/features/admin/shared/types";

export async function getBudgetBoardModel(): Promise<AdminBudgetBoardModel> {
  return adminBudgetBoardModel;
}
