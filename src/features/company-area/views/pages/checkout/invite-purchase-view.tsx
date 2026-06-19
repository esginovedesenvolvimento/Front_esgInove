"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import type { getInvitesPurchaseViewModel } from "../../../controllers/invites.controller";
import { SectionHeading } from "../../components/section-heading";
import { SupplierStatsSummary } from "../../components/supplier-stats-summary";
import { InvitePurchaseModal } from "../../components/invite-purchase-modal";

type InvitePurchaseViewModel = ReturnType<typeof getInvitesPurchaseViewModel>;

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function InvitePurchaseView({ model }: { model: InvitePurchaseViewModel }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMin, setSelectedMin] = useState(15);
  const [selectedMax, setSelectedMax] = useState(30);
  const [selectedQuantity, setSelectedQuantity] = useState(15);

  const handleOpenModal = (min: number, max: number) => {
    setSelectedMin(min);
    setSelectedMax(max);
    setSelectedQuantity(min);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Convites"
        title="Compra de pacotes para fornecedores"
        description="Amplie a cobertura da cadeia de fornecedores sem interromper o monitoramento ESG."
      />

      {/* Real-time Connected Stats */}
      <SupplierStatsSummary />

      {model.shouldPromptPurchase ? (
        <section className="border border-amber-300 bg-amber-50/75 px-4 py-3 text-sm text-amber-900 rounded-2xl">
          Seu saldo de convites está baixo. Recomendado adquirir novo pacote para manter os envios ativos.
        </section>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {model.packages.map((item) => {
          const isRange = item.minInvites !== item.maxInvites;
          const minPrice = item.minInvites * item.pricePerInvite;
          const maxPrice = item.maxInvites * item.pricePerInvite;
          
          return (
            <article
              key={item.id}
              className={`space-y-4 border p-5 rounded-2xl shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${
                item.highlight ? "border-foreground bg-slate-900 text-white" : "border-border bg-white/75"
              }`}
            >
              <div className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] opacity-70">{item.name}</p>
                  <p className="mt-2 text-3xl font-semibold leading-none">
                    {isRange ? `${item.minInvites} a ${item.maxInvites}` : `${item.minInvites}`}
                  </p>
                  <p className="mt-1.5 text-xs opacity-85">convites</p>
                </div>

                <div className="pt-2 border-t border-dashed border-slate-200/40">
                  <p className="text-lg font-semibold leading-snug">
                    {isRange ? (
                      <>
                        <span className="text-[10px] block opacity-75 font-normal">Faixa de preço</span>
                        {currency.format(minPrice)} a {currency.format(maxPrice)}
                      </>
                    ) : (
                      <>
                        <span className="text-[10px] block opacity-75 font-normal">Preço único</span>
                        {currency.format(minPrice)}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <Button 
                variant={item.highlight ? "secondary" : "outline"} 
                className="w-full rounded-full font-bold mt-2"
                onClick={() => handleOpenModal(item.minInvites, item.maxInvites)}
              >
                Selecionar
              </Button>
            </article>
          );
        })}
      </section>

      <InvitePurchaseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        minInvites={selectedMin}
        maxInvites={selectedMax}
        initialQuantity={selectedQuantity}
      />
    </div>
  );
}
