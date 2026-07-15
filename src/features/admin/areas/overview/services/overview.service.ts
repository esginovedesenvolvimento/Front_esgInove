import { adminFetch } from "@/features/admin/shared/api";
import type { AdminOverviewModel } from "@/features/admin/shared/types";

export async function getAdminOverviewModel(): Promise<AdminOverviewModel> {
  return adminFetch<AdminOverviewModel>("/admin/overview");
}
