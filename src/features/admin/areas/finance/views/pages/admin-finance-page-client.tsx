"use client";

import { useEffect, useState } from "react";
import { AdminBoardLoading } from "@/features/admin/shared/components/admin-board-loading";
import type { AdminFinanceBoardModel } from "@/features/admin/shared/types";
import { getFinanceBoardModel } from "../../services/finance.service";
import { AdminFinanceView } from "./admin-finance-view";

export function AdminFinancePageClient() {
  const [model, setModel] = useState<AdminFinanceBoardModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    getFinanceBoardModel()
      .then((data) => {
        if (active) setModel(data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Erro ao carregar o financeiro");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!model && isLoading) {
    return (
      <AdminBoardLoading
        eyebrow="Financeiro"
        title="Compras, vendas e produtos"
        description="Carregando a visão financeira do admin."
      />
    );
  }

  if (error && !model) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  return model ? <AdminFinanceView model={model} /> : null;
}
