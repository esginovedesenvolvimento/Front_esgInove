"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  ShieldCheck, 
  BookOpen, 
  Award, 
  Sparkles, 
  Clock, 
  ArrowUpRight, 
  ShoppingBag, 
  Download, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  MessageSquare,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompany } from "@/features/company-area/context/company-context";
import { getCookie } from "cookies-next";
import { inviteService } from "@/features/company-area/services/invite.service";

interface PurchasedService {
  id: string;
  name: string;
  description: string;
  priceFormatted: string;
  purchasedAt: string;
  status: "ATIVO" | "CONCLUIDO" | "PENDENTE";
}

interface RequestedBudget {
  id: string;
  name: string;
  description: string;
  priceFormatted: string;
  requestedAt: string;
  status: "EM_ANALISE" | "PROPOSTA_ENVIADA" | "NEGOCIACAO";
}

export default function MeusServicosPage() {
  const { user, company, hasOnlyPreDiagnostic, isUnpaid, isSupplierOnly } = useCompany();
  const [purchasedServices, setPurchasedServices] = useState<PurchasedService[]>([]);
  const [requestedBudgets, setRequestedBudgets] = useState<RequestedBudget[]>([]);

  // Carrega serviços comprados e solicitações de orçamento do localStorage & Banco de Dados
  useEffect(() => {
    const loadServices = async () => {
      let localPurchased: PurchasedService[] = [];
      try {
        const purchasedStr = localStorage.getItem("inoveesg_purchased_services");
        const requestedStr = localStorage.getItem("inoveesg_requested_budgets");

        if (purchasedStr) {
          localPurchased = JSON.parse(purchasedStr);
        }
        if (requestedStr) {
          setRequestedBudgets(JSON.parse(requestedStr));
        }
      } catch (e) {
        console.error("Erro ao carregar dados locais do painel de serviços:", e);
      }

      // Consulta o saldo real de convites no banco de dados
      const token = getCookie("inoveesg_token") as string;
      if (token) {
        try {
          const stats = await inviteService.getStats(token);
          if (stats && stats.totalInvitesPurchased > 0) {
            // Verifica se o serviço de convites/fornecedores já está na lista local
            const hasInviteService = localPurchased.some(
              (s) => s.id.startsWith("invite-pack") || s.name.toLowerCase().includes("fornecedor")
            );

            if (!hasInviteService) {
              localPurchased.push({
                id: "invite-pack-backend",
                name: "Avaliação de Fornecedores",
                description: `Você possui um total de ${stats.totalInvitesPurchased} convites contratados no banco de dados, sendo ${stats.availableInvites} convites ainda disponíveis para envio aos seus parceiros.`,
                priceFormatted: `${stats.availableInvites} convites disp.`,
                purchasedAt: new Date().toISOString(),
                status: "ATIVO"
              });
            } else {
              // Se já houver no localStorage, atualizamos a descrição e o preço formatado com os dados reais do banco
              localPurchased = localPurchased.map((s) => {
                if (s.id.startsWith("invite-pack") || s.name.toLowerCase().includes("fornecedor")) {
                  return {
                    ...s,
                    description: `Você possui um total de ${stats.totalInvitesPurchased} convites contratados no banco de dados, sendo ${stats.availableInvites} convites ainda disponíveis para envio aos seus parceiros.`,
                    priceFormatted: `${stats.availableInvites} convites disp.`
                  };
                }
                return s;
              });
            }
          }
        } catch (error) {
          console.error("Erro ao carregar estatísticas de convites do banco:", error);
        }
      }

      setPurchasedServices(localPurchased);
    };

    loadServices();
  }, []);

  // Formata data
  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "---";
    }
  };

  // Prepara link de WhatsApp para contato com consultor
  const getWhatsAppLink = (serviceName: string) => {
    const text = encodeURIComponent(
      `Olá! Gostaria de conversar com um consultor sobre o serviço "${serviceName}" contratado na plataforma InoveESG.`
    );
    return `https://wa.me/5511999999999?text=${text}`;
  };

  // Combina o serviço/diagnóstico principal com os adicionais em uma única lista de serviços contratados
  const getContractedServices = () => {
    const services = [];

    // Adiciona o serviço principal de diagnóstico
    services.push({
      id: "main-diagnostic",
      name: hasOnlyPreDiagnostic 
        ? "Pré-Diagnóstico ESG" 
        : isSupplierOnly 
        ? "Fornecedor Convidado"
        : isUnpaid
        ? "Acesso Demonstração"
        : "Serviço Corporativo Completo",
      description: hasOnlyPreDiagnostic 
        ? "Diagnóstico simplificado de sustentabilidade corporativa focado em responder ao questionário inicial e acessar a nota de maturidade."
        : isSupplierOnly 
        ? "Membro convidado da cadeia de suprimentos para responder avaliações direcionadas."
        : "Módulo avançado com evidências, análise de cadeia de fornecedores e painel completo.",
      status: "ATIVO" as const,
      isMain: true,
      purchasedAt: null
    });

    // Adiciona os serviços adicionais
    purchasedServices.forEach(s => {
      services.push({
        id: s.id,
        name: s.name,
        description: s.description,
        status: s.status,
        isMain: false,
        purchasedAt: s.purchasedAt
      });
    });

    return services;
  };

  const contractedServices = getContractedServices();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* ── Heading ───────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <Briefcase className="h-4 w-4" />
            Ecossistema InoveESG
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 font-display">
            Meus Serviços
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie seus serviços contratados, materiais adicionais e solicitações de propostas.
          </p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold shadow-md shadow-emerald-100 transition-all hover:scale-[1.02]">
          <Link href="/app/upgrade" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Adquirir Novos Serviços
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* ── Grid Layout ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lado Esquerdo: Planos e Compras Adicionais */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card de Meus Serviços (Container Escuro Principal) */}
          <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
            {/* Decorações do Glassmorphism */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    Área do Cliente
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold font-display text-white">
                    Meus Serviços
                  </h2>
                </div>
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-full px-3 py-1 text-xs font-bold text-emerald-300 flex items-center gap-1.5 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {contractedServices.length} {contractedServices.length === 1 ? "Ativo" : "Ativos"}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {contractedServices.map((service) => {
                  const isMain = service.isMain;
                  const isBook = !isMain && service.name.toLowerCase().includes("livro");
                  
                  return (
                    <div 
                      key={service.id} 
                      className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.08] transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden group"
                    >
                      <div className="space-y-2 max-w-xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className={`p-1.5 rounded-lg ${isMain ? "bg-emerald-500/20 text-emerald-300" : isBook ? "bg-amber-500/20 text-amber-300" : "bg-blue-500/20 text-blue-300"}`}>
                            {isMain ? <ShieldCheck className="h-4 w-4" /> : isBook ? <BookOpen className="h-4 w-4" /> : <Award className="h-4 w-4" />}
                          </div>
                          <h4 className="font-bold text-white text-sm leading-snug group-hover:text-emerald-300 transition-colors">
                            {service.name}
                          </h4>
                          {service.purchasedAt && (
                            <span className="text-[9px] text-slate-400 font-mono">
                              Adquirido em {formatDate(service.purchasedAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t border-white/5 md:border-t-0">
                        {isMain ? (
                          <>
                            {hasOnlyPreDiagnostic && (
                              <Button asChild className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs h-9 px-4 transition-all">
                                <Link href="/app/diagnostico" className="flex items-center gap-1.5">
                                  Responder
                                  <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                            )}
                            <Button asChild variant="ghost" className="w-full md:w-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl text-xs h-9 px-4 transition-all">
                              <Link href="/app/resultados">
                                Diagnóstico
                              </Link>
                            </Button>
                          </>
                        ) : isBook ? (
                          <>
                            <a 
                              href="#" 
                              className="w-1/2 md:w-auto text-[11px] font-bold text-center text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 py-2 px-4 rounded-xl transition-all"
                            >
                              PDF
                            </a>
                            <a 
                              href="#" 
                              className="w-1/2 md:w-auto text-[11px] font-bold text-center text-slate-900 bg-white hover:bg-slate-100 py-2 px-4 rounded-xl transition-all"
                            >
                              Ler
                            </a>
                          </>
                        ) : (
                          <>
                            <a 
                              href={getWhatsAppLink(service.name)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="w-1/2 md:w-auto text-[11px] font-bold text-center text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 py-2.5 px-4 rounded-xl transition-all"
                            >
                              Suporte
                            </a>
                            <Button asChild className="w-1/2 md:w-auto text-[11px] font-bold text-center text-white bg-emerald-600 hover:bg-emerald-700 h-9.5 px-4 rounded-xl transition-all border-none">
                              <Link href={
                                service.id.startsWith("invite-pack") || service.name.toLowerCase().includes("fornecedor")
                                  ? "/app"
                                  : service.id === "pre-diag-plus"
                                  ? "/app/diagnostico"
                                  : "#"
                              }>
                                Acessar
                              </Link>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

        </div>

        {/* Lado Direito: Solicitações de Orçamento (Propostas) & Ajuda */}
        <div className="space-y-8">
          
          {/* Card de Solicitações de Orçamento */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Acompanhar Orçamentos
            </h3>
            
            <p className="text-xs text-slate-500">
              Solicitações de cotações comerciais sem compromisso de pacotes e diagnósticos corporativos.
            </p>

            {requestedBudgets.length === 0 ? (
              <div className="bg-slate-50/50 rounded-2xl p-6 text-center border border-dashed border-slate-200">
                <Sparkles className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-500">Nenhuma solicitação pendente</p>
                <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto mt-0.5">
                  Adicione planos corporativos ao carrinho e solicite uma proposta.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {requestedBudgets.map((req, idx) => (
                  <div 
                     key={`${req.id}-${idx}`}
                    className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2 hover:bg-slate-100/40 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-slate-700 leading-tight">
                        {req.name}
                      </h4>
                      <span className="text-[9px] font-mono text-slate-400 shrink-0">
                        {formatDate(req.requestedAt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                        <Clock className="h-2.5 w-2.5" />
                        Em Análise
                      </span>
                      
                      <a 
                        href={getWhatsAppLink(`Proposta: ${req.name}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-0.5"
                      >
                        Falar com consultor
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

      </div>

    </div>
  );
}
