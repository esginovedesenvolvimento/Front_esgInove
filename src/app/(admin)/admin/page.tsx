import { getAdminOverviewModel } from "@/features/admin/areas/overview/services/overview.service";
import { AdminOverviewView } from "@/features/admin/areas/overview/views/pages/admin-overview-view";

export default async function AdminHome() {
  const model = await getAdminOverviewModel();

  return <AdminOverviewView model={model} />;
}
