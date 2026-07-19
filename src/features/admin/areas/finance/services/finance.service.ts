import { adminClientFetch } from "@/features/admin/shared/client-api";
import type { AdminFinanceBoardModel } from "@/features/admin/shared/types";

export async function getFinanceBoardModel(): Promise<AdminFinanceBoardModel> {
  return adminClientFetch<AdminFinanceBoardModel>("/admin/financeiro/load", {
    method: "POST",
  });
}
