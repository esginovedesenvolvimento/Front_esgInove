"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "../components/section-heading";
import { KpiStrip } from "../components/kpi-strip";
import type { getProfileViewModel } from "../../controllers/profile.controller";
import { Building2, CreditCard, Mail, MapPin, Phone, Users, ShieldCheck } from "lucide-react";

type ProfileViewModel = ReturnType<typeof getProfileViewModel>;

export function ProfileView({ model }: { model: ProfileViewModel }) {
  const kpis = [
    {
      id: "plan",
      label: "Plano Atual",
      value: model.companyProfile.plan,
      detail: "",
    },
    {
      id: "invites",
      label: "Convites Disponíveis",
      value: model.inviteBalance.available.toString(),
      detail: "",
    },
    {
      id: "cycle",
      label: "Ciclo Ativo",
      value: model.companyProfile.cycle,
      detail: "",
    },
  ];

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Configurações"
        title="Perfil da Empresa"
        description="Gerencie as informações da sua empresa, plano e saldo de convites."
      />

      <KpiStrip items={kpis} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Company Info Card */}
        <article className="border border-border bg-white/70 p-6 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Dados da Empresa</h2>
              <p className="text-sm text-slate-500">Informações cadastrais na plataforma</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-sm text-slate-500">Razão Social</span>
              <span className="text-sm font-medium text-slate-800">{model.companyProfile.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-sm text-slate-500">Setor de Atuação</span>
              <span className="text-sm font-medium text-slate-800">{model.companyProfile.sector}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-sm text-slate-500">CNPJ</span>
              <span className="text-sm font-medium text-slate-800">12.345.678/0001-90</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-sm text-slate-500">Email de Contato</span>
              <span className="text-sm font-medium text-slate-800">contato@inovealimentos.com.br</span>
            </div>
          </div>
        </article>

        {/* Plan & Billing Card */}
        <article className="border border-border bg-white/70 p-6 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Plano & Assinatura</h2>
              <p className="text-sm text-slate-500">Gerencie seu plano e recursos</p>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-emerald-600 uppercase font-medium tracking-wider">Plano Atual</p>
              <h3 className="text-xl font-bold text-emerald-700">{model.companyProfile.plan}</h3>
              <p className="text-xs text-emerald-600/80 mt-0.5">Renova em: 12 Dez 2026</p>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Fazer Upgrade
            </Button>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-sm text-slate-500">Diagnóstico ESG</span>
              <span className="text-sm font-medium text-emerald-600">Incluso</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-sm text-slate-500">Relatórios Avançados</span>
              <span className="text-sm font-medium text-emerald-600">Incluso</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Suporte Dedicado</span>
              <span className="text-sm font-medium text-slate-400">Não incluso</span>
            </div>
          </div>
        </article>

        {/* Invites Management Card */}
        <article className="border border-border bg-white/70 p-6 rounded-lg shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Gestão de Convites para Fornecedores</h2>
              <p className="text-sm text-slate-500">Monitore e adquira mais convites para sua cadeia</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-2">
            <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-lg">
              <p className="text-xs text-slate-500 uppercase font-medium">Adquiridos</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">{model.inviteBalance.acquired}</p>
            </div>
            <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-lg">
              <p className="text-xs text-slate-500 uppercase font-medium">Utilizados</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">{model.inviteBalance.used}</p>
            </div>
            <div className="border border-slate-100 bg-emerald-50/50 p-4 rounded-lg">
              <p className="text-xs text-emerald-600 uppercase font-medium">Disponíveis</p>
              <p className="text-2xl font-semibold text-emerald-600 mt-1">{model.inviteBalance.available}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Uso do limite de convites</span>
              <span className="font-medium text-slate-800">{Math.round((model.inviteBalance.used / model.inviteBalance.acquired) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-600 rounded-full" 
                style={{ width: `${(model.inviteBalance.used / model.inviteBalance.acquired) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <p className="text-sm text-slate-500">Precisa de mais convites para homologar novos fornecedores?</p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link href="/app/convites/comprar">Contratar mais convites</Link>
            </Button>
          </div>
        </article>

        {/* Billing History Card */}
        <article className="border border-border bg-white/70 p-6 rounded-lg shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Histórico de Faturamento</h2>
              <p className="text-sm text-slate-500">Acompanhe suas últimas faturas e próxima cobrança</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 uppercase font-medium tracking-wider">Próxima Cobrança</p>
              <h3 className="text-xl font-bold text-slate-800">{model.nextBilling.amount}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Vencimento em: {model.nextBilling.date}</p>
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
              Processando
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-sm font-medium text-slate-700">Últimas Faturas</p>
            <div className="space-y-2">
              {model.billingHistory.map((invoice) => (
                <div key={invoice.id} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{invoice.id}</p>
                    <p className="text-xs text-slate-500">{invoice.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-800">{invoice.amount}</span>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      Paga
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
