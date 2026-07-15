import { adminFetch } from "@/features/admin/shared/api";
import type { AdminAnalyticsBoardModel } from "@/features/admin/shared/types";

export async function getAnalyticsBoardModel(): Promise<AdminAnalyticsBoardModel> {
  return adminFetch<AdminAnalyticsBoardModel>("/admin/analytics");
}
