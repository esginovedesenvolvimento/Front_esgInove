import { adminEvidenceBoardModel } from "@/features/admin/shared/mock-data";
import type { AdminEvidenceBoardModel } from "@/features/admin/shared/types";

export async function getEvidenceBoardModel(): Promise<AdminEvidenceBoardModel> {
  return adminEvidenceBoardModel;
}
