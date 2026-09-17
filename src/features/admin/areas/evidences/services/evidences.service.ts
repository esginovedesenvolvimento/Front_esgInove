import { adminClientFetch } from "@/features/admin/shared/client-api";
import type { AdminEvidenceBoardModel } from "@/features/admin/shared/types";

export async function getEvidenceBoardModel(page = 1, limit = 10): Promise<AdminEvidenceBoardModel> {
  return adminClientFetch<AdminEvidenceBoardModel>("/admin/evidences/list", {
    method: "POST",
    body: JSON.stringify({ page, limit }),
  });
}

export function getEvidencePreview(evidenceId: string) {
  return adminClientFetch<{ signedUrl: string; fileName: string; mimeType: string | null }>(`/admin/evidences/${evidenceId}/preview`);
}

export function reviewEvidence(evidenceId: string, status: "VERIFIED" | "REJECTED", comment?: string) {
  return adminClientFetch<{ id: string; verificationStatus: "VERIFIED" | "REJECTED" }>(`/admin/evidences/${evidenceId}/review`, {
    method: "POST",
    body: JSON.stringify({ status, comment }),
  });
}
