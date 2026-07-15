import { adminFetch } from "@/features/admin/shared/api";
import type { AdminClientBoardModel } from "@/features/admin/shared/types";

export async function getClientBoardModel(): Promise<AdminClientBoardModel> {
  return adminFetch<AdminClientBoardModel>("/admin/clients");
}
