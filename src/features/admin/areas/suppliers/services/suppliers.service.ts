import { adminSupplierBoardModel } from "@/features/admin/shared/mock-data";
import type { AdminSupplierBoardModel } from "@/features/admin/shared/types";

export async function getSupplierBoardModel(): Promise<AdminSupplierBoardModel> {
  return adminSupplierBoardModel;
}
