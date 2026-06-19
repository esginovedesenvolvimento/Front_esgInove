import { getEvidenceBoardModel } from "@/features/admin/areas/evidences/services/evidences.service";
import { AdminEvidencesView } from "@/features/admin/areas/evidences/views/pages/admin-evidences-view";

export default async function AdminEvidencesPage() {
  const model = await getEvidenceBoardModel();

  return <AdminEvidencesView model={model} />;
}
