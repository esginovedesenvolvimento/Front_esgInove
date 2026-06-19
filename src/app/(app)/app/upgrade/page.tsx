"use client";

import React, { useState } from "react";
import { CircleCheck, Sparkles, ShieldCheck, ArrowRight, ArrowLeft, Users, Zap, GraduationCap, Rocket, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from "@/features/company-area/context/cart-context";
import { useCompany } from "@/features/company-area/context/company-context";
import { BudgetModal } from "@/features/company-area/views/components/budget-modal";
import { HorizontalServiceRail } from "@/features/company-area/views/components/horizontal-service-rail";
import { getCookie } from "cookies-next";
import { diagnosticService } from "@/features/company-area/services/diagnostic.service";
import Link from "next/link";

interface UpgradePlan extends CartItem {
  features: string[];
  focus: string;
  badge?: string;
  highlight?: boolean;
}

const upgradePlans: UpgradePlan[] = [
  {
    id: "diag-estrat",
    name: "Diagnóstico Estratégico",
    description: "Ideal para empresas que precisam comprovar sua maturidade ESG de ponta a ponta com selo de verificação.",
    focus: "Mapeamento Completo",
    price: 0,
    priceFormatted: "Sob Orçamento",
    type: "ONE_TIME",
    requiresBudget: true,
    features: [
      "Autodeclaração ESG Completa",
      "Upload e Análise de Evidências",
      "Validação e Auditoria de Documentos",
      "Roadmap Estratégico Detalhado",
      "Relatório Final de Conformidade",
      "Selo de Verificação InoveESG"
    ]
  },
  {
    id: "diag-consultoria",
    name: "Diagnóstico + Consultoria",
    description: "Além do diagnóstico profundo, tenha sessões estratégicas ao vivo com nossos especialistas para traçar o plano de ação.",
    focus: "Diagnóstico + Plano de Ação",
    badge: "Mais Procurado",
    highlight: true,
    price: 0,
    priceFormatted: "Sob Orçamento",
    type: "ONE_TIME",
    requiresBudget: true,
    features: [
      "Autodeclaração ESG Completa",
      "Upload e Análise de Evidências",
      "Validação e Auditoria de Documentos",
      "Roadmap Estratégico Detalhado",
      "Relatório Final de Conformidade",
      "Selo de Verificação InoveESG",
      "2h de Sessão Estratégica Ao Vivo",
      "Apoio Técnico à Tomada de Decisão"
    ]
  },
  {
    id: "assessoria-completa",
    name: "Assessoria ESG Contínua",
    description: "Gestão contínua da sua jornada ESG. Auditoria mensal, acompanhamento de metas e engajamento da cadeia de fornecedores.",
    focus: "Gestão Corporativa 360°",
    price: 0,
    priceFormatted: "Sob Orçamento",
    type: "SUBSCRIPTION",
    requiresBudget: true,
    features: [
      "Autodeclaração, Evidências e Selo",
      "Acompanhamento e Auditoria Mensal",
      "Sessões de Alinhamento Estratégico Mensais",
      "Painel de Rastreabilidade de Fornecedores",
      "Canal de Suporte Prioritário Via WhatsApp",
      "Suporte à Elaboração de Relatório GRI/SASB"
    ]
  }
];

const demandServices = [
  {
    id: "pre-diag",
    name: "Pré-Diagnóstico ESG",
    description: "Diagnóstico rápido de maturidade. Relatório não verificado.",
    priceFormatted: "R$ 250",
    type: "ONE_TIME",
    requiresBudget: false,
    icon: Zap,
    features: ["Formulário Automatizado", "Relatório de Maturidade"]
  },
  {
    id: "pre-diag-plus",
    name: "Pré-Diag + Consultoria",
    description: "Pré-Diagnóstico + 1h de sessão estratégica.",
    priceFormatted: "R$ 500",
    type: "ONE_TIME",
    requiresBudget: false,
    icon: Users,
    features: ["Formulário Automatizado", "1h Sessão Estratégica"]
  },
  {
    id: "cadeia-fornecedores",
    name: "Avaliação de Fornecedores",
    description: "Rastreie o impacto da sua cadeia de suprimentos.",
    priceFormatted: "A partir de R$ 50",
    type: "ONE_TIME",
    requiresBudget: false,
    icon: ShieldCheck,
    features: ["Mapeamento de Fornecedores", "Análise de Risco ESG"]
  },
  {
    id: "capacitacao",
    name: "Capacitação ESG",
    description: "Aula sobre ESG + certificado para a equipe.",
    priceFormatted: "Sob Orçamento",
    type: "ONE_TIME",
    requiresBudget: true,
    icon: GraduationCap,
    features: ["Aula Exclusiva", "Certificado de Capacitação"]
  },
  {
    id: "livro-esg",
    name: "Livro Bioeconomia & ESG",
    description: "Adquira o livro físico ou digital.",
    priceFormatted: "R$ 41,90",
    type: "ONE_TIME",
    requiresBudget: false,
    icon: Rocket,
    features: ["Conteúdo Exclusivo", "Versão Física/Digital"]
  }
];

import { InvitePurchaseModal } from "@/features/company-area/views/components/invite-purchase-modal";

export default function UpgradePage() {
  const { addItem, clearCart } = useCart();
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [checkoutLoadingId, setCheckoutLoadingId] = useState<string | null>(null);
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL?.replace(/\/+$/, "") ?? "";

  const handleOpenBudget = (plan: UpgradePlan) => {
    clearCart();
    addItem({
      id: plan.id,
      name: plan.name,
      price: 0,
      priceFormatted: plan.priceFormatted,
      type: plan.type,
      description: plan.description,
      requiresBudget: true
    });
    setIsBudgetOpen(true);
  };

  const handleDemandServiceClick = async (service: typeof demandServices[0]) => {
    if (service.id === "cadeia-fornecedores") {
      setIsInviteModalOpen(true);
      return;
    }

    if (service.requiresBudget) {
      clearCart();
      addItem({
        id: service.id,
        name: service.name,
        price: 0,
        priceFormatted: service.priceFormatted,
        type: service.type as any,
        description: service.description,
        requiresBudget: true
      });
      setIsBudgetOpen(true);
      return;
    }

    setCheckoutLoadingId(service.id);
    const token = getCookie("inoveesg_token") as string;

    try {
      if (!token) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }

      // Salva o produto pendente no localStorage para a página de sucesso registrar no "Meus Serviços"
      const pendingItem = {
        id: service.id,
        name: service.name,
        description: service.description,
        priceFormatted: service.priceFormatted
      };
      localStorage.setItem("inoveesg_pending_purchase", JSON.stringify([pendingItem]));

      if (service.id === "pre-diag" || service.id === "pre-diag-plus") {
        const response = await diagnosticService.simulatePreDiagnosticPurchase(token);
        if (response.checkoutUrl) {
          window.location.href = response.checkoutUrl;
        } else {
          throw new Error("Falha ao gerar link de checkout.");
        }
      } else if (service.id === "livro-esg") {
        window.location.href = `${frontendUrl}/app/checkout/simulate?id=fake-livro-esg&amount=41.90`;
      }
    } catch (err: any) {
      console.error("Erro ao iniciar compra:", err);
      alert(err.message || "Ocorreu um erro ao processar sua solicitação.");
    } finally {
      setCheckoutLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 md:px-6">
      
      {/* Header com Navegação de Volta */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <Link href="/app" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-2">
            <ArrowLeft className="h-3 w-3" /> Voltar ao Painel
          </Link>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5 fill-amber-800" />
              Upgrade Corporativo
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 font-display tracking-tight">
            Desbloqueie o Potencial Completo do InoveESG
          </h1>
          <p className="text-sm text-slate-500 max-w-3xl">
            Sua empresa atualmente possui o <span className="font-semibold text-emerald-600">Pré-Diagnóstico ESG</span>. 
            Atualize agora para um de nossos planos corporativos e ganhe acesso total à gestão de evidências, selo verificado e engajamento de fornecedores.
          </p>
        </div>
      </div>

      {/* Serviços sob demanda com navegação manual */}
      <div className="bg-slate-900 rounded-3xl p-5 md:p-6 shadow-xl relative group">
        <div className="flex items-center justify-between mb-4 shrink-0 px-2 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
            <h3 className="text-xs md:text-sm font-bold tracking-tight">Serviços Sob Demanda e Adicionais</h3>
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider hidden sm:block">Use as setas ou arraste no mobile</span>
        </div>

        <HorizontalServiceRail
          ariaLabel="Lista de serviços sob demanda"
          railClassName="pb-2"
          className="relative"
          items={demandServices}
          renderItem={(service, idx) => {
            const Icon = service.icon;
            return (
              <div key={`${service.id}-${idx}`} className="w-[280px] snap-start rounded-2xl border border-slate-800 bg-slate-950 p-4 flex flex-col justify-between shadow-lg shrink-0 hover:border-emerald-500/50 transition-colors duration-350">
                <div>
                  <div className="flex items-center gap-2.5 mb-2 text-white">
                    <div className="p-1.5 rounded-lg bg-slate-900 text-emerald-400">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h4 className="text-xs font-bold truncate max-w-[190px]">{service.name}</h4>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight mb-2.5 min-h-[30px]">{service.description}</p>
                  <ul className="text-[9px] text-slate-500 space-y-1">
                    {service.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-1.5"><CircleCheck className="size-2.5 text-emerald-500" /> {f}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between items-center mt-4 border-t border-slate-900/60 pt-3">
                  <span className="font-bold text-xs text-white">{service.priceFormatted}</span>
                  <Button 
                    onClick={() => handleDemandServiceClick(service)}
                    disabled={checkoutLoadingId !== null}
                    size="sm"
                    className="rounded-full px-3.5 h-7 text-[9px] font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all border-none flex items-center gap-1"
                  >
                    {checkoutLoadingId === service.id ? (
                      <>
                        <Loader2 className="h-2.5 w-2.5 animate-spin" />
                        Processando
                      </>
                    ) : (
                      service.requiresBudget ? "Solicitar" : "Comprar"
                    )}
                  </Button>
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* Cards de Planos */}
      <div className="grid gap-6 md:grid-cols-3">
        {upgradePlans.map((plan) => {
          const isSpecial = plan.highlight;
          return (
            <div 
              key={plan.id} 
              className={`rounded-3xl border bg-white p-6 md:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                isSpecial 
                  ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl shadow-emerald-50/50 scale-[1.02] md:-translate-y-2 z-10" 
                  : "border-slate-200 hover:border-slate-300 hover:shadow-lg shadow-sm"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider inline-block mb-4">
                  {plan.focus}
                </span>
                
                <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2 font-display">{plan.name}</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed min-h-[48px]">{plan.description}</p>
                
                <div className="border-t border-slate-100 pt-5 mb-6">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Investimento</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-extrabold text-slate-800 font-display">Sob Orçamento</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium block mt-1">
                    Proposta personalizada ao porte da empresa
                  </span>
                </div>

                <div className="space-y-3 mb-8">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">O que está incluso:</span>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CircleCheck className="size-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button
                onClick={() => handleOpenBudget(plan)}
                className={`w-full rounded-2xl h-11 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 ${
                  isSpecial 
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100" 
                    : "bg-slate-900 text-white hover:bg-slate-850"
                }`}
              >
                Solicitar Proposta <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Caixa de Segurança/FAQ */}
      <div className="grid gap-6 md:grid-cols-2 mt-8">
        <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 flex gap-4">
          <div className="bg-emerald-100 text-emerald-800 p-3 rounded-2xl h-fit">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800 font-display">Garantia de Confidencialidade</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Todos os seus dados de autodeclaração e documentos anexados são criptografados e tratados sob rígidos acordos de sigilo, 
              garantindo total conformidade com a LGPD.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 flex gap-4">
          <div className="bg-emerald-100 text-emerald-800 p-3 rounded-2xl h-fit">
            <Users className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800 font-display">Suporte Técnico Dedicado</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nossa equipe comercial e de engenheiros ambientais está disponível para sanar dúvidas e personalizar o escopo 
              conforme a realidade do seu setor empresarial.
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Orçamento Reusado */}
      <BudgetModal 
        isOpen={isBudgetOpen} 
        onClose={() => setIsBudgetOpen(false)} 
      />

      <InvitePurchaseModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
}
