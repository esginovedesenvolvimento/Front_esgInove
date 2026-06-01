"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { getSuppliersViewModel } from "../../controllers/suppliers.controller";
import { ProgressMeter } from "../components/progress-meter";
import { SectionHeading } from "../components/section-heading";
import { StatusPill } from "../components/status-pill";
import { ChevronDown, ChevronUp, CheckCircle2, X, Loader2, Copy, Send, Users } from "lucide-react";
import { SupplierStatsSummary } from "../components/supplier-stats-summary";
import { InvitePurchaseModal } from "../components/invite-purchase-modal";
import { getCookie } from "cookies-next";
import { inviteService, type SupplierInvite } from "../../services/invite.service";
import { useCompany } from "../../context/company-context";

export function SuppliersView({ model }: { model: ReturnType<typeof getSuppliersViewModel> }) {
  const { company } = useCompany();
  const [invites, setInvites] = useState<SupplierInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

   const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Dynamic invitation links
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  const inviteUrl = `${frontendUrl}/convite/fornecedor?ref=${company?.id || ""}`;

  const readyMessage = `Prezado parceiro,

Para avançarmos em nossa jornada de sustentabilidade e conformidade ESG, convidamos sua empresa a preencher nosso diagnóstico na plataforma InoveESG.

Acesse o link exclusivo abaixo para responder ao questionário e anexar as evidências solicitadas:
${inviteUrl}

Agradecemos a parceria de sempre!`;

  useEffect(() => {
    async function loadInvites() {
      const token = getCookie("inoveesg_token") as string;
      if (!token) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await inviteService.listInvites(token);
        setInvites(data);
      } catch (err: any) {
        console.error("Error loading invites:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInvites();
  }, [refreshTrigger]);


  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  function getSupplierStatus(invite: SupplierInvite): "respondido" | "em_andamento" | "convidado" | "expirado" | "pendente" {
    const hasDiagnostic = invite.requestedDiagnostics.length > 0;
    const diagnostic = invite.requestedDiagnostics[0];

    if (diagnostic?.status === "COMPLETED") {
      return "respondido";
    }
    if (diagnostic?.status === "DRAFT") {
      return "em_andamento";
    }
    if (invite.status === "ACCEPTED") {
      return "convidado";
    }
    if (invite.status === "SENT") {
      return "convidado";
    }
    if (invite.status === "EXPIRED") {
      return "expirado";
    }
    return "pendente";
  }

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Cadeia de fornecedores"
        title="Monitoramento de convites e respostas"
        description="Acompanhe status por fornecedor e avance nas cobranças de preenchimento ESG."
        action={
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-full font-bold"
              onClick={() => setIsPurchaseModalOpen(true)}
            >
              Comprar convites
            </Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold"
              onClick={() => setIsInviteModalOpen(true)}
            >
              Convidar fornecedor
            </Button>
          </div>
        }
      />

      <SupplierStatsSummary refreshTrigger={refreshTrigger} />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/40 backdrop-blur-sm rounded-xl border border-slate-200">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-2" />
          <p className="text-sm text-slate-500">Carregando cadeia de fornecedores...</p>
        </div>
      ) : invites.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 py-16 bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-sm text-center max-w-2xl mx-auto mt-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-emerald-100/50">
            <Users className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Conecte sua cadeia de fornecedores</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-md">
            Você ainda não convidou nenhum fornecedor para realizar o diagnóstico ESG. Comece a monitorar a conformidade de seus parceiros agora mesmo.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 font-semibold"
              onClick={() => setIsInviteModalOpen(true)}
            >
              Enviar Primeiro Convite
            </Button>
            <Button
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-full px-6 font-semibold"
              onClick={() => setIsPurchaseModalOpen(true)}
            >
              Comprar mais convites
            </Button>
          </div>
        </div>
      ) : (
        <section className="space-y-4">
          {invites.map((invite) => {
            const isExpanded = expandedCards[invite.id];
            const hasDiagnostic = invite.requestedDiagnostics.length > 0;
            const diagnostic = invite.requestedDiagnostics[0];
            const isRespondido = diagnostic?.status === "COMPLETED";
            const progress = hasDiagnostic ? diagnostic.percentageCompletion : 0;
            const supplierName = invite.supplierOrganization?.tradeName 
              || invite.supplierOrganization?.legalName 
              || `Pendente (${invite.supplierEmail})`;

            return (
              <article key={invite.id} className="space-y-3 border border-border bg-white/75 p-5 rounded-lg shadow-sm hover:bg-white transition-all duration-200">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-slate-800">{supplierName}</h2>
                    <p className="text-sm text-slate-500">{invite.supplierEmail}</p>
                  </div>
                  <StatusPill status={getSupplierStatus(invite)} />
                </div>
                
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <p>Convite enviado em {new Date(invite.createdAt).toLocaleDateString("pt-BR")}</p>
                  <p>Última atualização: {invite.acceptedAt ? new Date(invite.acceptedAt).toLocaleDateString("pt-BR") : "-"}</p>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleCard(invite.id)}
                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                  >
                    {isExpanded ? (
                      <>Recolher <ChevronUp className="ml-1 h-4 w-4" /></>
                    ) : (
                      <>Ver detalhes <ChevronDown className="ml-1 h-4 w-4" /></>
                    )}
                  </Button>
                </div>

                {/* Expandable Area */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 bg-slate-50/50 p-4 rounded-md">
                    {isRespondido && diagnostic.score ? (
                      <>
                        {/* Line 1: Pre-diagnostic scores */}
                        <div className="grid grid-cols-[110px_1fr_1fr_1fr] gap-1 items-center text-xs md:text-sm">
                          <span className="font-medium text-slate-600">Pré-diagnóstico:</span>
                          <span className="text-slate-700">Eixo E: <span className="font-semibold">{Number(diagnostic.score.environmentalScore ?? 0)}</span></span>
                          <span className="text-slate-700">Eixo S: <span className="font-semibold">{Number(diagnostic.score.socialScore ?? 0)}</span></span>
                          <span className="text-slate-700">Eixo G: <span className="font-semibold">{Number(diagnostic.score.governanceScore ?? 0)}</span></span>
                        </div>
                        
                        {/* Line 2: Proven scores */}
                        <div className="grid grid-cols-[110px_1fr_1fr_1fr] gap-1 items-center text-xs md:text-sm mt-2">
                          <span className="font-medium text-emerald-700">Comprovado:</span>
                          <span className="text-emerald-700 font-semibold">Eixo E: {Number(diagnostic.score.environmentalScore ?? 0)}</span>
                          <span className="text-emerald-700 font-semibold">Eixo S: {Number(diagnostic.score.socialScore ?? 0)}</span>
                          <span className="text-emerald-700 font-semibold">Eixo G: {Number(diagnostic.score.governanceScore ?? 0)}</span>
                        </div>
                        
                        {/* Line 3: Metric of proven evidences */}
                        <div className="pt-2 border-t border-slate-200/60">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-slate-600 font-medium">Pontuação Geral (ESG):</span>
                            <span className="font-semibold text-emerald-600">{Number(diagnostic.score.overallScore ?? 0)}/100</span>
                          </div>
                          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${Number(diagnostic.score.overallScore ?? 0)}%` }} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-sm text-slate-500">
                        {invite.status === "SENT" 
                          ? "Este fornecedor ainda não se cadastrou na plataforma utilizando o link de convite."
                          : "Este fornecedor ainda não concluiu o diagnóstico. As pontuações estarão disponíveis após o envio."}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}

      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl p-8 overflow-hidden rounded-2xl border border-white/20 bg-white/60 backdrop-blur-xl shadow-2xl">
            {/* Liquid Glass Background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-white/10 -z-10" />
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-slate-800">Convidar Fornecedor</h3>
                <p className="text-sm text-slate-500 mt-1">Gerencie o convite e envie as instruções para sua cadeia.</p>
              </div>
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-500 hover:text-slate-700 transition-colors p-2 hover:bg-slate-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Left Column: Instructions + Link */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">Instruções de Uso</h4>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Copie o link único</p>
                        <p className="text-xs text-slate-500 mt-0.5">Este link é exclusivo para a sua empresa e identifica os seus fornecedores.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Envie para seus fornecedores</p>
                        <p className="text-xs text-slate-500 mt-0.5">Envie da melhor forma para seu fornecedor</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Acompanhe o progresso</p>
                        <p className="text-xs text-slate-500 mt-0.5">Assim que ele começar, você verá o status "Em andamento" nesta tela.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/80 rounded-xl border border-slate-100 shadow-sm">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Link de Convite</h4>
                  <p className="text-xs text-slate-500 mb-4">Compartilhe este link com os fornecedores que deseja homologar.</p>
                  
                  <div className="relative">
                    <input 
                      type="text" 
                      readOnly 
                      value={inviteUrl}
                      className="w-full text-xs p-3 pr-20 bg-emerald-600 border border-emerald-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white font-mono font-bold shadow-inner"
                    />
                    <button 
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-100 text-emerald-700 text-xs px-3 py-1.5 rounded-md transition-colors font-bold shadow-sm"
                      onClick={() => {
                        navigator.clipboard.writeText(inviteUrl);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 5000);
                      }}
                    >
                      Copiar
                    </button>
                  </div>
                  {copiedLink && (
                    <p className="text-xs text-emerald-600 mt-2 font-medium">
                      ✓ Link copiado!
                    </p>
                  )}
                </div>
              </div>
              
              {/* Right Column: Pre-written Message */}
              <div className="p-4 bg-white/80 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Mensagem Pronta para Envio</h4>
                  <p className="text-xs text-slate-500 mb-4">Copie o texto completo abaixo e envie por e-mail ou WhatsApp para facilitar a abordagem.</p>
                  
                  <textarea 
                    readOnly 
                    rows={10}
                    value={readyMessage}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-600 resize-none"
                  />
                </div>
                
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50/50 p-2 rounded-md">
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    O link já está incluso na mensagem.
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      {copiedMessage && (
                        <p className="text-xs text-emerald-600 font-medium">
                          ✓ Mensagem copiada!
                        </p>
                      )}
                    </div>
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs whitespace-nowrap"
                      onClick={() => {
                        navigator.clipboard.writeText(readyMessage);
                        setCopiedMessage(true);
                        setTimeout(() => setCopiedMessage(false), 5000);
                      }}
                    >
                      Copiar Mensagem
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-600 border-slate-200"
              >
                Fechar
              </Button>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => {
                  navigator.clipboard.writeText(inviteUrl);
                  setIsInviteModalOpen(false);
                }}
              >
                Copiar Link e Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      <InvitePurchaseModal 
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </div>
  );
}
