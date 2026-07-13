"use client";

import { Button } from "@/components/ui/button";
import type { getReportViewModel } from "../../../controllers/report.controller";
import { useRouter } from "next/navigation";
import {
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileWarning,
  Lock,
  Award,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Printer,
  ArrowLeft
} from "lucide-react";

type ReportViewModel = ReturnType<typeof getReportViewModel>;

interface ReportViewProps {
  model: ReportViewModel;
  reportType: "pre" | "audited";
  dbDiagnostic?: any;
}

export function ReportView({ model, reportType, dbDiagnostic }: ReportViewProps) {
  const router = useRouter();

  // If there are verified scores from DB, we use them, otherwise 0
  const isPre = reportType === "pre";
  const globalScore = model.globalScore || 0;
  const provenScore = isPre ? 0 : Math.round(Number(dbDiagnostic?.score?.provenOverallScore || 0));
  
  const envScore = model.axisScores?.[0]?.score || 0;
  const envProven = isPre ? 0 : model.axisScores?.[0]?.provenScore || 0;
  const bioScore = model.axisScores?.[1]?.score || 0;
  const bioProven = isPre ? 0 : model.axisScores?.[1]?.provenScore || 0;
  const socScore = model.axisScores?.[2]?.score || 0;
  const socProven = isPre ? 0 : model.axisScores?.[2]?.provenScore || 0;
  const govScore = model.axisScores?.[3]?.score || 0;
  const govProven = isPre ? 0 : model.axisScores?.[3]?.provenScore || 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print-container max-w-5xl mx-auto pb-12">
      {/* Dynamic CSS injection for clean printing */}
      <style jsx global>{`
        @media print {
          /* Hide sidebar, top header, page navigation, buttons, and decorations */
          aside,
          nav,
          header,
          .no-print,
          button,
          .breadcrumb,
          .sidebar-container {
            display: none !important;
          }
          
          /* Reset margins, paddings, backgrounds for printable output */
          body {
            background-color: #fff !important;
            color: #000 !important;
            font-size: 12pt !important;
          }
          
          .print-container {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            background: transparent !important;
          }
          
          /* Keep borders clean and clear on page */
          .print-card {
            border: 1px solid #e2e8f0 !important;
            background: #ffffff !important;
            box-shadow: none !important;
          }
          
          .print-progress {
            border: 1px solid #cbd5e1 !important;
            background-color: #f1f5f9 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print-progress-fill {
            background-color: #059669 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .print-text-green {
            color: #047857 !important;
          }
        }
      `}</style>

      {/* Top Navigation / Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5 no-print">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/app/resultados")}
            className="text-foreground/70 hover:text-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <span className="text-foreground/30">|</span>
          <div className="text-xs text-foreground/50 font-medium">
            Gerado em {model.summary.generatedAt}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="border-border hover:bg-muted font-medium text-slate-700"
          >
            <Printer className="h-4 w-4 mr-2" /> Imprimir / PDF
          </Button>
          {isPre && (
            <Button
              onClick={() => router.push("/app/upgrade")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm"
            >
              <Award className="h-4 w-4 mr-2" /> Certificar Pontuação
            </Button>
          )}
        </div>
      </div>

      {/* Main Report Header */}
      <header className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-8 rounded-xl shadow-md border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 text-white/90 border border-white/10">
            {isPre ? (
              <>
                <FileText className="h-3 w-3 text-amber-400" />
                <span>Pré-Diagnóstico ESG</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-3 w-3 text-emerald-400 animate-pulse" />
                <span className="text-emerald-400">Auditado & Verificado</span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isPre ? "Relatório ESG Executivo" : "Certificado de Desempenho ESG"}
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            {isPre
              ? "Relatório preliminar consolidando as respostas autodeclaradas pelo fornecedor na plataforma InoveESG."
              : "Laudo oficial emitido pela InoveESG atestando a conformidade dos dados socioambientais apresentados."}
          </p>
        </div>
        
        {/* Seal/Badge Decoration */}
        <div className="flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-full">
          {isPre ? (
            <div className="h-16 w-16 flex flex-col items-center justify-center text-center rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Lock className="h-6 w-6" />
              <span className="text-[9px] font-bold uppercase mt-0.5">Pré</span>
            </div>
          ) : (
            <div className="h-16 w-16 flex flex-col items-center justify-center text-center rounded-full bg-emerald-500/15 border-2 border-emerald-400 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
              <Award className="h-7 w-7" />
              <span className="text-[8px] font-extrabold uppercase tracking-widest mt-0.5">Selo</span>
            </div>
          )}
        </div>
      </header>

      {/* Warning Banners based on state */}
      {!isPre && (
        <section className="print-card flex items-start gap-4 p-5 rounded-lg border border-emerald-500/25 bg-emerald-50/20">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-emerald-800 text-sm print-text-green">Pontuação ESG Validada e Certificada</h4>
            <p className="text-xs text-emerald-900/80 leading-relaxed">
              Certificação ativa sob auditoria InoveESG. O **Score Comprovado ({provenScore})** atesta a veracidade de todas as metas socioambientais e canais de governança declarados no formulário.
            </p>
          </div>
        </section>
      )}

      {/* Summary Stats Grid */}
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="print-card border border-border bg-card p-5 rounded-lg shadow-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Score Declarado</p>
          <div className="flex items-baseline space-x-1 mt-2">
            <p className="text-4xl font-extrabold text-slate-800">{globalScore}</p>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </article>

        <article className={`print-card border p-5 rounded-lg shadow-sm ${
          isPre 
            ? "border-border bg-muted/30" 
            : "border-emerald-500/20 bg-emerald-50/10"
        }`}>
          <p className={`text-xs uppercase tracking-wider font-semibold ${isPre ? "text-muted-foreground" : "text-emerald-700"}`}>
            Score Comprovado
          </p>
          <div className="flex items-baseline space-x-1 mt-2">
            {isPre ? (
              <div className="flex items-center space-x-2 text-slate-400 mt-1">
                <Lock className="h-5 w-5" />
                <span className="text-sm font-semibold">Pendente auditoria</span>
              </div>
            ) : (
              <>
                <p className="text-4xl font-extrabold text-emerald-700 print-text-green">{provenScore}</p>
                <span className="text-xs text-emerald-600/80">/ 100</span>
              </>
            )}
          </div>
        </article>

        <article className="print-card border border-border bg-card p-5 rounded-lg shadow-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Respondido em</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">{model.summary.generatedAt}</p>
          <p className="text-[10px] text-muted-foreground">Última atualização cadastrada</p>
        </article>
      </section>


      {/* Axis Performance Breakdown */}
      <section className="print-card border border-border bg-card p-6 rounded-lg shadow-sm space-y-6">
        <h3 className="text-lg font-bold tracking-tight text-foreground/90 border-b border-border/55 pb-2">
          Desempenho Detalhado por Pilar ESG
        </h3>
        
        <div className="grid gap-6 md:grid-cols-4">
          {/* Ambiental (E) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm text-foreground/80 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Eixo Ambiental (E)
              </span>
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                {envScore} / 100
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="text-[11px] text-muted-foreground flex justify-between">
                <span>Declarado:</span>
                <span className="font-medium">{envScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 print-progress overflow-hidden">
                <div
                  className="bg-emerald-600 h-2.5 rounded-full print-progress-fill transition-all"
                  style={{ width: `${envScore}%` }}
                />
              </div>
            </div>

            <div className="space-y-1 pt-1 border-t border-dashed border-border/80">
              <div className="text-[11px] text-muted-foreground flex justify-between">
                <span>Comprovado:</span>
                <span className={`font-semibold ${isPre ? "text-slate-400" : "text-emerald-700"}`}>
                  {isPre ? "0%" : `${envProven}%`}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 print-progress overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all ${
                    isPre ? "bg-slate-300/60" : "bg-emerald-500 print-progress-fill"
                  }`}
                  style={{ width: `${envProven}%` }}
                />
              </div>
            </div>
          </div>

          {/* Bioeconomia Circular (B) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm text-foreground/80 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Eixo Bioeconomia Circular (B)
              </span>
              <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                {bioScore} / 100
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-muted-foreground flex justify-between">
                <span>Declarado:</span>
                <span className="font-medium">{bioScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 print-progress overflow-hidden">
                <div
                  className="bg-amber-600 h-2.5 rounded-full print-progress-fill transition-all"
                  style={{ width: `${bioScore}%` }}
                />
              </div>
            </div>

            <div className="space-y-1 pt-1 border-t border-dashed border-border/80">
              <div className="text-[11px] text-muted-foreground flex justify-between">
                <span>Comprovado:</span>
                <span className={`font-semibold ${isPre ? "text-slate-400" : "text-emerald-700"}`}>
                  {isPre ? "0%" : `${bioProven}%`}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 print-progress overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all ${
                    isPre ? "bg-slate-300/60" : "bg-amber-500 print-progress-fill"
                  }`}
                  style={{ width: `${bioProven}%` }}
                />
              </div>
            </div>
          </div>

          {/* Social (S) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm text-foreground/80 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Eixo Social (S)
              </span>
              <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                {socScore} / 100
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-muted-foreground flex justify-between">
                <span>Declarado:</span>
                <span className="font-medium">{socScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 print-progress overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full print-progress-fill transition-all"
                  style={{ width: `${socScore}%` }}
                />
              </div>
            </div>

            <div className="space-y-1 pt-1 border-t border-dashed border-border/80">
              <div className="text-[11px] text-muted-foreground flex justify-between">
                <span>Comprovado:</span>
                <span className={`font-semibold ${isPre ? "text-slate-400" : "text-emerald-700"}`}>
                  {isPre ? "0%" : `${socProven}%`}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 print-progress overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all ${
                    isPre ? "bg-slate-300/60" : "bg-blue-500 print-progress-fill"
                  }`}
                  style={{ width: `${socProven}%` }}
                />
              </div>
            </div>
          </div>

          {/* Governança (G) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm text-foreground/80 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                Eixo Governança (G)
              </span>
              <span className="text-xs font-semibold bg-violet-100 text-violet-800 px-2 py-0.5 rounded">
                {govScore} / 100
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-muted-foreground flex justify-between">
                <span>Declarado:</span>
                <span className="font-medium">{govScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 print-progress overflow-hidden">
                <div
                  className="bg-violet-600 h-2.5 rounded-full print-progress-fill transition-all"
                  style={{ width: `${govScore}%` }}
                />
              </div>
            </div>

            <div className="space-y-1 pt-1 border-t border-dashed border-border/80">
              <div className="text-[11px] text-muted-foreground flex justify-between">
                <span>Comprovado:</span>
                <span className={`font-semibold ${isPre ? "text-slate-400" : "text-emerald-700"}`}>
                  {isPre ? "0%" : `${govProven}%`}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 print-progress overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all ${
                    isPre ? "bg-slate-300/60" : "bg-violet-500 print-progress-fill"
                  }`}
                  style={{ width: `${govProven}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Central Section */}
      {isPre ? (
        /* Action Call for Premium Services */
        <section className="space-y-5 no-print">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold tracking-tight text-slate-800">
              Como desbloquear seu Selo e aumentar o Score Comprovado?
            </h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <article className="border border-border bg-card p-5 rounded-lg flex flex-col justify-between hover:border-emerald-600/30 hover:shadow-md transition-all">
              <div className="space-y-2">
                <Award className="h-7 w-7 text-emerald-600" />
                <h3 className="font-bold text-slate-800 text-base">Auditoria de Evidências ESG</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Submeta seus laudos de emissões, contratos e licenças de SST para nossa equipe auditar e validar suas notas declaradas.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/app/upgrade")}
                className="mt-4 w-full border-emerald-600/20 text-emerald-600 hover:bg-emerald-50"
              >
                Auditar evidências <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </article>

            <article className="border border-border bg-card p-5 rounded-lg flex flex-col justify-between hover:border-emerald-600/30 hover:shadow-md transition-all">
              <div className="space-y-2">
                <ShieldCheck className="h-7 w-7 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-base">Homologação de Fornecedores</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Monitore e homologue a conformidade socioambiental da sua cadeia produtiva inteira, reduzindo risco de passivos.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/app/upgrade")}
                className="mt-4 w-full border-blue-600/20 text-blue-600 hover:bg-blue-50"
              >
                Mapear cadeia <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </article>

            <article className="border border-border bg-card p-5 rounded-lg flex flex-col justify-between hover:border-emerald-600/30 hover:shadow-md transition-all">
              <div className="space-y-2">
                <TrendingUp className="h-7 w-7 text-violet-600" />
                <h3 className="font-bold text-slate-800 text-base">Consultoria ESG Hands-on</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Gaps prioritários identificados? Receba suporte consultivo para desenvolver políticas, inventários de resíduos e carbono.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/app/upgrade")}
                className="mt-4 w-full border-violet-600/20 text-violet-600 hover:bg-violet-50"
              >
                Falar com consultor <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </article>
          </div>
        </section>
      ) : (
        /* Evidences Status List (Auditado) */
        <section className="print-card border border-border bg-card p-6 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold tracking-tight text-slate-800">
              Evidências Socioambientais Homologadas
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Abaixo constam as evidências e documentos que foram avaliados e validados formalmente pela banca auditora InoveESG.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between bg-slate-50 p-4 border border-slate-100 rounded-md">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Laudo de Emissões Atmosféricas</p>
                  <p className="text-[11px] text-muted-foreground">Eixo E • Licenciamento Ambiental Conforme</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
                Validado
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-4 border border-slate-100 rounded-md">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Plano de Gerenciamento de Resíduos Sólidos (PGRSS)</p>
                  <p className="text-[11px] text-muted-foreground">Eixo E • Destinação adequada comprovada</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
                Validado
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-4 border border-slate-100 rounded-md">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Código de Ética e Canal de Denúncias Ativo</p>
                  <p className="text-[11px] text-muted-foreground">Eixo G • Termos de compliance validados</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
                Validado
              </span>
            </div>
          </div>
        </section>
      )}


      {/* Footer */}
      <footer className="text-center pt-8 border-t border-border/60 text-[10px] text-muted-foreground">
        <p>InoveESG Tecnologias Sustentáveis S.A. © {new Date().getFullYear()} • Relatório confidencial da plataforma corporativa.</p>
        <p className="mt-0.5">As informações contidas neste laudo são de uso exclusivo da organização auditada e parceiros autorizados.</p>
      </footer>
    </div>
  );
}
