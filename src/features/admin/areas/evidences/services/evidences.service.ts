import { adminClientFetch } from "@/features/admin/shared/client-api";
import type { AdminEvidenceBoardModel } from "@/features/admin/shared/types";

export async function getEvidenceBoardModel(page = 1, limit = 10): Promise<AdminEvidenceBoardModel> {
  return adminClientFetch<AdminEvidenceBoardModel>("/admin/evidences/list", {
    method: "POST",
    body: JSON.stringify({ page, limit }),
  });
}
