import { getClientBoardModel } from "@/features/admin/areas/clients/services/clients.service";
import { AdminClientsView } from "@/features/admin/areas/clients/views/pages/admin-clients-view";

export default async function AdminClientsPage() {
  const model = await getClientBoardModel();

  return <AdminClientsView model={model} />;
}
