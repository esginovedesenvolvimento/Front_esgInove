"use client";

import React, { useState, useEffect } from "react";
import { 
  Award, ArrowUpRight, ShieldCheck, 
  Leaf, Users, Scale, Lock, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { getCookie } from "cookies-next";
import { diagnosticService } from "../../services/diagnostic.service";
import { inviteService } from "../../services/invite.service";
import { useCompany } from "../../context/company-context";

export function PreDiagnosticResultsView() {
  const { hasInviteAccess } = useCompany();
  const [dbDiagnostic, setDbDiagnostic] = useState<any>(null);
  const [realSuppliers, setRealSuppliers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const token = getCookie("inoveesg_token") as string;
        if (!token) {
          setIsLoading(false);
          return;
        }
        const res = await diagnosticService.getCurrentDiagnostic(token);
        if (res.hasDiagnostic && res.diagnostic) {
          setDbDiagnostic(res.diagnostic);
        }
        if (hasInviteAccess) {
          try {
            const invites = await inviteService.listInvites(token);
            setRealSuppliers(invites);
          } catch (e) {
            console.error("Failed to load real suppliers:", e);
          }
        }
      } catch (err) {
        console.error("Failed to load pre-diagnostic results:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [hasInviteAccess]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  const isCompleted = dbDiagnostic && dbDiagnostic.status === "COMPLETED";

  // Obter notas reais ou fallback para mocks
  const scoreObj = dbDiagnostic?.score;
  const overallScore = scoreObj ? Math.round(Number(scoreObj.overallScore || 0)) : 64;
  const envScore = scoreObj ? Math.round(Number(scoreObj.environmentalScore || 0)) : 58;
  const socScore = scoreObj ? Math.round(Number(scoreObj.socialScore || 0)) : 81;
  const govScore = scoreObj ? Math.round(Number(scoreObj.governanceScore || 0)) : 62;

  const getPillarDescription = (score: number, pillar: "E" | "S" | "G") => {
    if (pillar === "E") {
      if (score >= 80) return "Excelente gestão de recursos e eficiência energética. Foco no monitoramento rigoroso e metas de descarbonização.";
      if (score >= 60) return "Estrutura básica de descarte de resíduos e economia de recursos ativa. Requer refinar inventários de carbono.";
      return "Gestão de recursos e resíduos em nível inicial. Necessidade imediata de estruturação de controle básico de água, energia e emissões.";
    } else if (pillar === "S") {
      if (score >= 80) return "Ótimo ambiente de trabalho e programas de treinamento. Foco em diversidade e governança de direitos humanos.";
      if (score >= 60) return "Treinamentos básicos em segurança e saúde ocupacional ativos. Oportunidades em programas de inclusão de fornecedores.";
      return "Programas sociais e de saúde em estruturação inicial. Necessidade de formalização de políticas internas de diversidade.";
    } else {
      if (score >= 80) return "Alto nível de conformidade, ética e governança corporativa ativa. Comitês independentes bem estruturados.";
      if (score >= 60) return "Código de conduta e LGPD formalizados. Oportunidade de criar canais de ouvidoria com SLA transparente.";
      return "Estrutura de governança e ética em fase embrionária. Alta prioridade para a formalização do código de ética e comitê interno.";
    }
  };

  return (
    <div className="space-y-8 py-4 animate-in fade-in duration-500">
      
      {isCompleted ? (
        <>
          {/* ── Banner Principal / Pontuação Geral ─────────────────────────────────────── */}
          <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-[40%] h-[150%] bg-gradient-to-l from-emerald-600/20 to-transparent blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[20%] h-[80%] bg-gradient-to-r from-teal-600/10 to-transparent blur-2xl" />
            
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                  Módulo Pago Ativo
                </span>
                <h3 className="text-xl sm:text-2xl font-bold">Diagnóstico Piloto ESG</h3>
                <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
                  Parabéns! Sua empresa concluiu a fase preliminar do diagnóstico. Confira abaixo a pontuação dividida e seu plano de ação recomendado.
                </p>
              </div>
              <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pontuação Consolidada</span>
                <div className="flex items-baseline gap-1 bg-slate-800/80 border border-slate-700/50 py-2.5 px-6 rounded-2xl">
                  <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">{overallScore}</span>
                  <span className="text-sm font-semibold text-slate-500">/ 100</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Detalhamento dos Três Pilares (E, S, G) ─────────────────────────────────── */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Distribuição por Pilar ESG
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pilar E - Ambiental */}
              <Card className="border border-slate-100 shadow-sm rounded-2xl relative overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="bg-emerald-50 p-1.5 rounded-lg text-emerald-600">
                        <Leaf className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-sm font-bold text-slate-800">Ambiental (E)</CardTitle>
                    </div>
                    <span className="text-sm font-bold text-slate-800 font-mono">{envScore}/100</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${envScore}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed min-h-[50px]">
                    {getPillarDescription(envScore, "E")}
                  </p>
                  <div className="text-[10px] bg-slate-50 border border-slate-100/50 p-2 rounded-xl text-slate-600 font-medium">
                    🎯 Foco de Ação: Inventário de Emissões de Carbono.
                  </div>
                </CardContent>
              </Card>

              {/* Pilar S - Social */}
              <Card className="border border-slate-100 shadow-sm rounded-2xl relative overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600">
                        <Users className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-sm font-bold text-slate-800">Social (S)</CardTitle>
                    </div>
                    <span className="text-sm font-bold text-slate-800 font-mono">{socScore}/100</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${socScore}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed min-h-[50px]">
                    {getPillarDescription(socScore, "S")}
                  </p>
                  <div className="text-[10px] bg-slate-50 border border-slate-100/50 p-2 rounded-xl text-slate-600 font-medium">
                    🎯 Foco de Ação: Programa de diversidade formalizado.
                  </div>
                </CardContent>
              </Card>

              {/* Pilar G - Governança */}
              <Card className="border border-slate-100 shadow-sm rounded-2xl relative overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-50 p-1.5 rounded-lg text-purple-600">
                        <Scale className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-sm font-bold text-slate-800">Governança (G)</CardTitle>
                    </div>
                    <span className="text-sm font-bold text-slate-800 font-mono">{govScore}/100</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${govScore}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed min-h-[50px]">
                    {getPillarDescription(govScore, "G")}
                  </p>
                  <div className="text-[10px] bg-slate-50 border border-slate-100/50 p-2 rounded-xl text-slate-600 font-medium">
                    🎯 Foco de Ação: Canal de Ouvidoria com reporte independente.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        /* ── Banner explicativo levando para preenchimento ─────────────────────────────────── */
        <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-[40%] h-[150%] bg-gradient-to-l from-emerald-600/30 to-transparent blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[30%] h-[80%] bg-gradient-to-r from-teal-600/15 to-transparent blur-2xl" />
          
          <div className="relative space-y-6">
            <div className="space-y-2">
              <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                Módulo Ativo
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Avaliação de Maturidade ESG</h3>
              <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
                Inicie a avaliação de maturidade da sua empresa nos pilares Ambiental, Social e Governança para identificar gargalos regulatórios, calcular sua pontuação consolidada e gerar o relatório piloto.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-y border-slate-800/80">
              <div className="space-y-1">
                <span className="text-emerald-400 font-bold text-sm">Eixo E (Ambiental)</span>
                <p className="text-xs text-slate-500 leading-snug">Avalie emissões de carbono, energia e descarte de resíduos.</p>
              </div>
              <div className="space-y-1">
                <span className="text-blue-400 font-bold text-sm">Eixo S (Social)</span>
                <p className="text-xs text-slate-500 leading-snug">Analise SST, saúde ocupacional e diversidade corporativa.</p>
              </div>
              <div className="space-y-1">
                <span className="text-purple-400 font-bold text-sm">Eixo G (Governança)</span>
                <p className="text-xs text-slate-500 leading-snug">Verifique canais de ética, conformidade LGPD e comitês.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 h-11 shadow-md transition-all duration-300 hover:scale-[1.02]">
                <Link href="/app/diagnostico">
                  {dbDiagnostic ? "Continuar Diagnóstico" : "Iniciar Avaliação Gratuita"}
                </Link>
              </Button>
              <Button asChild className="bg-transparent border border-slate-700 hover:bg-slate-800 hover:text-white text-slate-300 font-semibold text-sm px-6 h-11 transition-all">
                <Link href="/app/meus-servicos">
                  Ver Meus Serviços
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Análise de Evidências & Ações da Cadeia ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lado Esquerdo: Análise de Evidências (Bloqueado) */}
        <Card className="lg:col-span-2 border border-slate-100 shadow-sm rounded-2xl relative overflow-hidden bg-slate-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-800">Análise de Evidências</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Gerencie e audite os documentos comprobatórios das práticas ESG da sua empresa.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative min-h-[300px] flex flex-col justify-between pt-4">
            {/* Lista desfocada de evidências */}
            <div className="space-y-3 blur-[3px] select-none pointer-events-none opacity-50">
              {[
                { title: "Relatório de consumo energético anual", axis: "Ambiental (E)", status: "Pendente" },
                { title: "Política de SST e relatórios de treinamento", axis: "Social (S)", status: "Pendente" },
                { title: "Código de Conduta e SLA do Canal de Ouvidoria", axis: "Governança (G)", status: "Pendente" },
                { title: "Inventário de Gases de Efeito Estufa (Escopo 1 e 2)", axis: "Ambiental (E)", status: "Não Iniciado" },
              ].map((ev, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-50 p-2 rounded-lg text-slate-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{ev.title}</p>
                      <p className="text-[10px] text-slate-500">{ev.axis}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold py-0.5 px-2 bg-amber-50 text-amber-700 rounded-full">
                    {ev.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Overlay Lock de Upgrade */}
            <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-100 inline-block mb-3 animate-bounce">
                <Lock className="h-6 w-6 text-slate-800" />
              </div>
              <h5 className="font-bold text-slate-900 text-sm mb-1">Upgrade Necessário</h5>
              <p className="text-slate-600 text-xs leading-relaxed max-w-sm mb-4">
                A comprovação por evidências está disponível apenas no plano completo para auditoria e homologação das respostas do diagnóstico.
              </p>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-6 shadow-sm">
                <Link href="/app/upgrade" className="flex items-center justify-center gap-1.5">
                  Fazer Upgrade Corporativo <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lado Direito: Preview de Fornecedores & Certificação */}
        <div className="space-y-6">
          {/* Mapeamento de Cadeia (Bloqueado) */}
          <Card className="border border-slate-100 shadow-sm rounded-2xl relative overflow-hidden bg-slate-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-800">Cadeia de Fornecedores</CardTitle>
              <CardDescription className="text-[11px] text-slate-500">
                Audite e gerencie o perfil ESG dos seus fornecedores.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative min-h-[160px] flex flex-col justify-between pt-2">
              {hasInviteAccess ? (
                <>
                  <div className="space-y-2.5">
                    {realSuppliers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-6 text-center bg-white border border-slate-100 rounded-xl">
                        <Users className="h-6 w-6 text-slate-400 mb-2" />
                        <p className="text-xs font-semibold text-slate-700">Nenhum fornecedor cadastrado</p>
                        <p className="text-[10px] text-slate-500">Envie convites para começar a monitorar a sua cadeia.</p>
                      </div>
                    ) : (
                      realSuppliers.slice(0, 3).map((sup) => {
                        const orgName = sup.supplierOrganization?.tradeName || sup.supplierEmail;
                        const score = sup.requestedDiagnostics?.[0]?.score?.overallScore;
                        const scoreNum = score !== undefined && score !== null ? Number(score) : null;
                        const displayScore = scoreNum !== null ? Math.round(scoreNum) : "--";
                        const statusLabel = 
                          sup.status === "ACCEPTED" ? "Respondido" : 
                          sup.status === "PENDING" || sup.status === "SENT" ? "Pendente" : "Expirado";

                        let badgeClass = "bg-slate-100 text-slate-600 border border-slate-200/50";
                        if (scoreNum !== null) {
                          if (scoreNum < 60) {
                            badgeClass = "bg-red-50 text-red-600 border border-red-100";
                          } else if (scoreNum <= 80) {
                            badgeClass = "bg-amber-50 text-amber-600 border border-amber-100";
                          } else {
                            badgeClass = "bg-emerald-50 text-emerald-600 border border-emerald-100";
                          }
                        }

                        return (
                          <div key={sup.id} className="flex items-center justify-between p-2.5 bg-white border border-slate-200/60 rounded-xl shadow-sm">
                            <div className="min-w-0 flex-1 pr-2">
                              <p className="text-[11px] font-semibold text-slate-700 truncate">{orgName}</p>
                              <p className="text-[9px] text-slate-500">Status: {statusLabel}</p>
                            </div>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ${badgeClass}`}>
                              {displayScore}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[10px] h-8 px-4 mt-4 shadow-sm w-full">
                    <Link href="/app/fornecedores" className="flex items-center justify-center gap-1">
                      Gerenciar Cadeia <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  {/* Lista desfocada de fornecedores */}
                  <div className="space-y-2.5 blur-[3px] select-none pointer-events-none opacity-55">
                    {[
                      { name: "EcoPack Embalagens Ltda", status: "Respondido", score: "84" },
                      { name: "TransLog Verde", status: "Pendente", score: "--" },
                    ].map((sup, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-slate-200/60 rounded-xl shadow-sm">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-slate-700 truncate">{sup.name}</p>
                          <p className="text-[9px] text-slate-500">Status: {sup.status}</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                          {sup.score}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Overlay Lock de Upgrade */}
                  <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                    <div className="bg-white p-2 rounded-xl shadow-md border border-slate-100 inline-block mb-2">
                      <Lock className="h-5 w-5 text-slate-800" />
                    </div>
                    <h5 className="font-bold text-slate-900 text-xs mb-0.5">Upgrade Necessário</h5>
                    <p className="text-slate-600 text-[10px] leading-relaxed max-w-[180px] mb-2.5">
                      Envie convites e acompanhe a conformidade de seus fornecedores.
                    </p>
                    <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[10px] h-7 px-4 shadow-sm">
                      <Link href="/app/upgrade" className="flex items-center justify-center gap-1">
                        Fazer Upgrade <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Upgrade Premium */}
          <Card className="border-emerald-100 bg-emerald-50/20 shadow-sm rounded-2xl">
            <CardContent className="pt-6 space-y-4">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-emerald-100 inline-block">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <h5 className="font-bold text-slate-800 text-sm">Pronto para emitir o Selo?</h5>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Com o **Plano Corporativo**, você pode fazer o upload de evidências estruturadas e emitir o selo de conformidade ESG.
                </p>
              </div>
              <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 shadow-sm">
                <Link href="/app/upgrade" className="flex items-center justify-center gap-1">
                  Fazer Upgrade Corporativo <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}
