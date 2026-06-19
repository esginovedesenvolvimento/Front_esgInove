import { getSupplierDetailViewModel } from "@/features/company-area/controllers/suppliers.controller";
import { SupplierDetailView } from "@/features/company-area/views/pages/fornecedores/supplier-detail-view";

interface SupplierDetailPageProps {
  params: Promise<{
    supplierId: string;
  }>;
}

export default async function SupplierDetailPage({ params }: SupplierDetailPageProps) {
  const { supplierId } = await params;
  const model = getSupplierDetailViewModel(supplierId);

  return <SupplierDetailView model={model} />;
}
