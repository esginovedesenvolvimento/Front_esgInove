"use client";

import React, { useState } from "react";
import { CircleCheck, Sparkles, ShieldCheck, ArrowRight, ArrowLeft, Users, Zap, GraduationCap, Rocket, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from "@/features/company-area/context/cart-context";
import { BudgetModal } from "@/features/company-area/views/components/budget-modal";
import { checkoutService } from "@/features/company-area/services/checkout.service";
import { getCookie } from "cookies-next";
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
    name: "Diagnóstico Autodeclarável",
    description: "Diagnóstico rápido de maturidade. Relatório não verificado.",
    priceFormatted: "R$ 250",
    type: "ONE_TIME",
    requiresBudget: false,
    icon: Zap,
    features: ["Formulário ESG Autodeclarável", "Relatório de Maturidade"]
  },
  {
    id: "pre-diag-plus",
    name: "Diagnóstico Autodeclarável + Consultoria",
    description: "Diagnóstico autodeclarável + 1h de sessão estratégica.",
    priceFormatted: "R$ 500",
    type: "ONE_TIME",
    requiresBudget: false,
    icon: Users,
    features: ["Formulário ESG Autodeclarável", "1h Sessão Estratégica"]
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
  const [assessoriaMonths, setAssessoriaMonths] = useState<6 | 12>(12);

  const handleOpenBudget = (plan: UpgradePlan) => {
    clearCart();
    addItem({
      id: plan.id,
      name: plan.name,
      price: 0,
      priceFormatted: plan.priceFormatted,
      type: plan.type,
      description: plan.description,
      requiresBudget: true,
      months: plan.id === "assessoria-completa" ? assessoriaMonths : undefined
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
        type: service.type as CartItem["type"],
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
        const productCode = service.id === "pre-diag" ? "PRE_DIAGNOSTIC" : "PRE_DIAGNOSTIC_PLUS";
        const response = await checkoutService.createPreference(token, productCode);
        if (response.checkoutUrl) {
          window.location.href = response.checkoutUrl;
        } else {
          throw new Error("Falha ao gerar link de checkout.");
        }
      } else if (service.id === "livro-esg") {
        const response = await checkoutService.createPreference(token, "LIVRO_ESG");
        if (response.checkoutUrl) {
          window.location.href = response.checkoutUrl;
        } else {
          throw new Error("Falha ao gerar link de checkout.");
        }
      }
    } catch (err: unknown) {
      console.error("Erro ao iniciar compra:", err);
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro ao processar sua solicitação.";
      alert(errorMessage);
    } finally {
      setCheckoutLoadingId(null);
    }
  };

  return (
    <div className="space-y-10 pb-16 pt-6 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Grid container with Left and Right columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Planos de Assessoria (col-span-7) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight font-display">
                Planos de Assessoria
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              Escolha o nível de acompanhamento ideal para a maturidade ESG da sua empresa. Nossos especialistas guiam você em cada passo.
            </p>
          </div>

          <div className="space-y-6">
            {upgradePlans.map((plan) => {
              const isSpecial = plan.highlight;
              return (
                <div 
                  key={plan.id} 
                  className={`rounded-[2rem] border bg-white p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                    isSpecial 
                      ? "border-emerald-500 ring-4 ring-emerald-500/10 shadow-md" 
                      : "border-slate-200/80 hover:border-slate-300 hover:shadow-md shadow-sm"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {plan.badge}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                          {plan.focus}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 font-display tracking-tight">{plan.name}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1">{plan.description}</p>
                        {plan.id === "assessoria-completa" && (
                          <div className="space-y-2 mt-4 bg-slate-50 border border-slate-200/60 p-3 rounded-2xl max-w-[240px]">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Duração do Contrato
                            </label>
                            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/50 rounded-xl">
                              <button
                                type="button"
                                onClick={() => setAssessoriaMonths(6)}
                                className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all ${
                                  assessoriaMonths === 6
                                    ? "bg-white text-emerald-700 shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                              >
                                6 meses
                              </button>
                              <button
                                type="button"
                                onClick={() => setAssessoriaMonths(12)}
                                className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all ${
                                  assessoriaMonths === 12
                                    ? "bg-white text-emerald-700 shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                              >
                                12 meses
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">O que está incluso:</span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                              <CircleCheck className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className="leading-snug">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="w-full sm:w-48 shrink-0 flex flex-col justify-between border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
                      <div className="mb-4">
                        <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Investimento</span>
                        <span className="text-lg font-extrabold text-slate-800 font-display block mt-0.5">Sob Orçamento</span>
                        <span className="text-[10px] text-emerald-600 font-medium block mt-0.5 leading-snug">
                          Proposta personalizada ao porte da empresa
                        </span>
                      </div>
                      
                      <Button
                        onClick={() => handleOpenBudget(plan)}
                        className={`w-full rounded-xl h-10 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1 border-0 ${
                          isSpecial 
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                            : "bg-slate-900 text-white hover:bg-slate-800"
                        }`}
                      >
                        Solicitar Proposta <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Serviços sob Demanda (col-span-5) with soft green background */}
        <div className="lg:col-span-5 bg-gradient-to-b from-emerald-50/50 to-teal-55/30 border border-emerald-100/70 rounded-[2.5rem] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-750">
                <Zap className="h-5 w-5 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight font-display">
                Serviços sob Demanda
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              Contrate soluções pontuais adicionais de acordo com a necessidade atual do seu negócio.
            </p>
          </div>

          <div className="space-y-4">
            {demandServices.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div 
                  key={`${service.id}-${idx}`} 
                  className="group rounded-[2rem] border border-emerald-100/40 bg-white p-5 flex flex-col justify-between hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300 shadow-sm"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100/80 transition-colors">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 tracking-tight font-display">{service.name}</h3>
                    </div>
                    
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {service.description}
                    </p>
                    
                    <div className="space-y-2 mb-4 border-t border-slate-100/60 pt-3">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">O que está incluso:</span>
                      <ul className="space-y-2">
                        {service.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-2 text-xs text-slate-600">
                            <CircleCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Investimento</span>
                      <span className="font-extrabold text-sm text-slate-800">{service.priceFormatted}</span>
                    </div>
                    
                    <Button 
                      onClick={() => handleDemandServiceClick(service)}
                      disabled={checkoutLoadingId !== null}
                      size="sm"
                      className="rounded-full px-4 h-8 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all border-none flex items-center gap-1 shadow-sm shadow-emerald-600/10"
                    >
                      {checkoutLoadingId === service.id ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Aguarde
                        </>
                      ) : (
                        service.requiresBudget ? "Solicitar" : "Comprar"
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAQ / Safety Box */}
      <div className="grid gap-6 md:grid-cols-2 mt-8 pt-4 border-t border-slate-100/60">
        <div className="bg-slate-50/50 border border-slate-150 rounded-[2rem] p-6 flex gap-4 hover:bg-slate-50 transition-colors duration-200">
          <div className="bg-emerald-50 text-emerald-700 p-3.5 rounded-2xl h-fit border border-emerald-100/50">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-slate-800 font-display">Garantia de Confidencialidade</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Todos os seus dados de autodeclaração e documentos anexados são criptografados e tratados sob rígidos acordos de sigilo, 
              garantindo total conformidade com a LGPD.
            </p>
          </div>
        </div>

        <div className="bg-slate-50/50 border border-slate-150 rounded-[2rem] p-6 flex gap-4 hover:bg-slate-50 transition-colors duration-200">
          <div className="bg-emerald-50 text-emerald-700 p-3.5 rounded-2xl h-fit border border-emerald-100/50">
            <Users className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
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
