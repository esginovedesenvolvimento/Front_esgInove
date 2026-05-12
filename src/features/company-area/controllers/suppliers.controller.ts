import { inviteBalance, suppliers } from "../models/mock-data";

export function getSuppliersViewModel() {
  const byStatus = {
    convidados: suppliers.filter((supplier) => supplier.status === "convidado").length,
    emAndamento: suppliers.filter((supplier) => supplier.status === "em_andamento").length,
    respondidos: suppliers.filter((supplier) => supplier.status === "respondido").length,
    pendentes: suppliers.filter((supplier) => supplier.status === "pendente").length,
    expirados: suppliers.filter((supplier) => supplier.status === "expirado").length,
  };

  return {
    suppliers,
    byStatus,
    inviteBalance,
    evidences: {
      total: 150,
      validated: 45,
      pending: 105,
      progress: 30,
    },
    scores: {
      declared: 75,
      validated: 50,
    }
  };
}

export function getSupplierDetailViewModel(supplierId: string) {
  const supplier = suppliers.find((item) => item.id === supplierId) ?? null;

  return {
    supplier,
  };
}
