import { adminFetch } from "@/features/admin/shared/api";
import type { AdminEvidenceBoardModel } from "@/features/admin/shared/types";

export async function getEvidenceBoardModel(): Promise<AdminEvidenceBoardModel> {
  return adminFetch<AdminEvidenceBoardModel>("/admin/evidences");
}
