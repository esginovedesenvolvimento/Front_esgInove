import { adminFetch } from "@/features/admin/shared/api";
import type { AdminSupplierBoardModel } from "@/features/admin/shared/types";

export async function getSupplierBoardModel(): Promise<AdminSupplierBoardModel> {
  return adminFetch<AdminSupplierBoardModel>("/admin/suppliers");
}
