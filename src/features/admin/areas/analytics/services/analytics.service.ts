import { adminAnalyticsBoardModel } from "@/features/admin/shared/mock-data";
import type { AdminAnalyticsBoardModel } from "@/features/admin/shared/types";

export async function getAnalyticsBoardModel(): Promise<AdminAnalyticsBoardModel> {
  return adminAnalyticsBoardModel;
}
