import { getSupplierBoardModel } from "@/features/admin/areas/suppliers/services/suppliers.service";
import { AdminSuppliersView } from "@/features/admin/areas/suppliers/views/pages/admin-suppliers-view";

export default async function AdminSuppliersPage() {
  const model = await getSupplierBoardModel();

  return <AdminSuppliersView model={model} />;
}
