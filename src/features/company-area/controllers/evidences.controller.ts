import { evidences } from "../models/mock-data";

export function getEvidencesViewModel() {
  const pendingReview = evidences.filter((item) => item.status === "pendente").length;

  return {
    items: evidences,
    pendingReview,
    total: evidences.length,
  };
}
