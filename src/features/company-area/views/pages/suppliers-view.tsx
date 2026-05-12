"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { getSuppliersViewModel } from "../../controllers/suppliers.controller";
import { ProgressMeter } from "../components/progress-meter";
import { SectionHeading } from "../components/section-heading";
import { StatusPill } from "../components/status-pill";
import { ChevronDown, ChevronUp, CheckCircle2, X } from "lucide-react";

type SuppliersViewModel = ReturnType<typeof getSuppliersViewModel>;

export function SuppliersView({ model }: { model: SuppliersViewModel }) {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Cadeia de fornecedores"
        title="Monitoramento de convites e respostas"
        description="Acompanhe status por fornecedor e avance nas cobranças de preenchimento ESG."
        action={
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => setIsInviteModalOpen(true)}
          >
            Convidar fornecedor
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="border border-border bg-white/70 p-4 rounded-lg shadow-sm">
          <p className="text-xs uppercase tracking-[0.08em] text-foreground/55">Convites Restantes</p>
          <p className="mt-2 text-3xl font-semibold text-slate-800">
            {model.inviteBalance.available} <span className="text-xl text-slate-400">/ {model.inviteBalance.acquired}</span>
          </p>
        </article>
        <article className="border border-border bg-white/70 p-4 rounded-lg shadow-sm">
          <p className="text-xs uppercase tracking-[0.08em] text-foreground/55">Respondidos</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600">{model.byStatus.respondidos}</p>
        </article>
        <article className="border border-border bg-white/70 p-4 rounded-lg shadow-sm">
          <p className="text-xs uppercase tracking-[0.08em] text-foreground/55">Em andamento</p>
          <p className="mt-2 text-3xl font-semibold text-amber-600">{model.byStatus.emAndamento}</p>
        </article>
        <article className="border border-border bg-white/70 p-4 rounded-lg shadow-sm">
          <p className="text-xs uppercase tracking-[0.08em] text-foreground/55">Expirados</p>
          <p className="mt-2 text-3xl font-semibold text-slate-500">{model.byStatus.expirados}</p>
        </article>
      </section>

      <section className="space-y-4">
        {model.suppliers.map((supplier) => {
          const isExpanded = expandedCards[supplier.id];
          const isRespondido = supplier.status === "respondido";

          return (
            <article key={supplier.id} className="space-y-3 border border-border bg-white/75 p-5 rounded-lg shadow-sm hover:bg-white transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-slate-800">{supplier.companyName}</h2>
                  <p className="text-sm text-slate-500">{supplier.contactEmail}</p>
                </div>
                <StatusPill status={supplier.status} />
              </div>
              
              <ProgressMeter value={supplier.progress} label="Progresso do preenchimento" />
              
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <p>Convite em {supplier.invitedAt}</p>
                <p>Última atualização {supplier.lastUpdate}</p>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleCard(supplier.id)}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                >
                  {isExpanded ? (
                    <>Recolher <ChevronUp className="ml-1 h-4 w-4" /></>
                  ) : (
                    <>Ver detalhes <ChevronDown className="ml-1 h-4 w-4" /></>
                  )}
                </Button>

                <Button asChild variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                  <Link href={`/app/fornecedores/${supplier.id}`}>Página do fornecedor</Link>
                </Button>
              </div>

              {/* Expandable Area */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 bg-slate-50/50 p-4 rounded-md">
                  {isRespondido ? (
                    <>
                      {/* Line 1: Pre-diagnostic scores */}
                      <div className="grid grid-cols-[110px_1fr_1fr_1fr] gap-1 items-center text-xs md:text-sm">
                        <span className="font-medium text-slate-600">Pré-diagnóstico:</span>
                        <span className="text-slate-700">Eixo E: <span className="font-semibold">80</span></span>
                        <span className="text-slate-700">Eixo S: <span className="font-semibold">70</span></span>
                        <span className="text-slate-700">Eixo G: <span className="font-semibold">90</span></span>
                      </div>
                      
                      {/* Line 2: Proven scores */}
                      <div className="grid grid-cols-[110px_1fr_1fr_1fr] gap-1 items-center text-xs md:text-sm mt-2">
                        <span className="font-medium text-emerald-700">Comprovado:</span>
                        <span className="text-emerald-700 font-semibold">Eixo E: 60</span>
                        <span className="text-emerald-700 font-semibold">Eixo S: 45</span>
                        <span className="text-emerald-700 font-semibold">Eixo G: 90</span>
                      </div>
                      
                      {/* Line 3: Metric of proven evidences */}
                      <div className="pt-2 border-t border-slate-200/60">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-600 font-medium">Evidências comprovadas:</span>
                          <span className="font-semibold text-emerald-600">75%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: "75%" }} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 text-sm text-slate-500">
                      Este fornecedor ainda não concluiu o diagnóstico. As pontuações estarão disponíveis após o envio.
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </section>

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
                      value="https://inoveesg.com.br/convite/fornecedor?ref=cia_123"
                      className="w-full text-xs p-3 pr-20 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-600"
                    />
                    <button 
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-md transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText("https://inoveesg.com.br/convite/fornecedor?ref=cia_123");
                        alert("Link copiado!");
                      }}
                    >
                      Copiar
                    </button>
                  </div>
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
                    value={`Prezado parceiro,

Para avançarmos em nossa jornada de sustentabilidade e conformidade ESG, convidamos sua empresa a preencher nosso diagnóstico na plataforma InoveESG.

Acesse o link exclusivo abaixo para responder ao questionário e anexar as evidências solicitadas:
https://inoveesg.com.br/convite/fornecedor?ref=cia_123

Agradecemos a parceria de sempre!`}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-600 resize-none"
                  />
                </div>
                
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50/50 p-2 rounded-md">
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    O link já está incluso na mensagem.
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs whitespace-nowrap"
                      onClick={() => {
                        navigator.clipboard.writeText(`Prezado parceiro,

Para avançarmos em nossa jornada de sustentabilidade e conformidade ESG, convidamos sua empresa a preencher nosso diagnóstico na plataforma InoveESG.

Acesse o link exclusivo abaixo para responder ao questionário e anexar as evidências solicitadas:
https://inoveesg.com.br/convite/fornecedor?ref=cia_123

Agradecemos a parceria de sempre!`);
                        alert("Mensagem copiada!");
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
                  navigator.clipboard.writeText("https://inoveesg.com.br/convite/fornecedor?ref=cia_123");
                  setIsInviteModalOpen(false);
                  alert("Link copiado e modal fechado!");
                }}
              >
                Copiar Link e Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
