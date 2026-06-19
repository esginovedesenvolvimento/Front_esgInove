import { adminClientBoardModel } from "@/features/admin/shared/mock-data";
import type { AdminClientBoardModel } from "@/features/admin/shared/types";

export async function getClientBoardModel(): Promise<AdminClientBoardModel> {
  return adminClientBoardModel;
}
