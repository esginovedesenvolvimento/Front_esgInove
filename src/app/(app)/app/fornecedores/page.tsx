import { getSuppliersViewModel } from "@/features/company-area/controllers/suppliers.controller";
import { SuppliersView } from "@/features/company-area/views/pages/fornecedores/suppliers-view";

export default function SuppliersPage() {
  const model = getSuppliersViewModel();

  return <SuppliersView model={model} />;
}
