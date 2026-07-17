"use client";

import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import { getCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import { inviteService, type SupplierInvite } from "@/features/company-area/services/invite.service";
import type { getResultsViewModel } from "../../../controllers/results.controller";
import { type DiagnosticHistoryItem } from "../../../services/diagnostic.service";
import { useCompany } from "@/features/company-area/context/company-context";
import { generateESGReportPDF } from "@/features/company-area/utils/pdf-generator";
import { SectionHeading } from "../../components/section-heading";
import {
  Download,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Users,
  Target,
  GraduationCap,
  Check,
  Leaf,
  Recycle,
  Heart,
  Scale,
  FileText,
  FileCheck,
  Star,
  StarHalf,
  Building2,
  Loader2,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type ResultsViewModel = ReturnType<typeof getResultsViewModel>;

const axisConfig = {
  E: { label: "Ambiental", icon: Leaf, color: "text-emerald-600", bg: "bg-emerald-50/50", border: "border-emerald-200", bar: "bg-emerald-500" },
  B: { label: "Bioeconomia Circular", icon: Recycle, color: "text-amber-600", bg: "bg-amber-50/50", border: "border-amber-200", bar: "bg-amber-500" },
  S: { label: "Social", icon: Heart, color: "text-blue-600", bg: "bg-blue-50/50", border: "border-blue-200", bar: "bg-blue-500" },
  G: { label: "Governança", icon: Scale, color: "text-violet-600", bg: "bg-violet-50/50", border: "border-violet-200", bar: "bg-violet-500" },
};

const premiumServices = [
  {
    title: "Auditoria & Selo de Evidências ESG",
    description: "Valide formalmente seus documentos de ESG e desbloqueie a pontuação comprovada no mercado.",
    benefits: ["Validação de 50+ indicadores", "Selo InoveESG verificado", "Relatório certificado"],
    ctaText: "Iniciar Homologação",
    link: "/app/upgrade",
    icon: ShieldCheck,
    tag: "Auditoria",
  },
  {
    title: "Rastreabilidade de Fornecedores",
    description: "Mapeie e avalie o risco socioambiental dos seus parceiros comerciais em uma única plataforma.",
    benefits: ["Painel de cadeia produtiva", "Métricas de risco ESG", "Gestão de convites integrada"],
    ctaText: "Mapear Fornecedores",
    link: "/app/fornecedores",
    icon: Users,
    tag: "Cadeia de Valor",
  },
  {
    title: "Consultoria ESG Hands-on",
    description: "Fale com nossos especialistas para criar inventários de CO2, PGRCC ou estruturar políticas internas.",
    benefits: ["Planos de ação personalizados", "Suporte com engenheiros ambientais", "Preparação para certificações"],
    ctaText: "Solicitar Orçamento",
    link: "/app/upgrade",
    icon: Target,
    tag: "Estratégico",
  },
  {
    title: "Treinamentos e Capacitação",
    description: "Engaje líderes e colaboradores sobre práticas de ESG com conteúdo especializado.",
    benefits: ["Cursos online customizados", "Certificados de conclusão", "Métricas de engajamento"],
    ctaText: "Ver Catálogo",
    link: "/app/upgrade",
    icon: GraduationCap,
    tag: "Educação",
  },
];

function ScoreRing({ score, color, size = 100 }: { score: number; color: string; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={8} className="text-slate-100" />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="currentColor" strokeWidth={8}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        className={`${color} transition-all duration-700`}
      />
    </svg>
  );
}

function getMaturityLabelFromStars(stars: number) {
  if (stars >= 4.5) return "Nível 5 — Transformador";
  if (stars >= 4.0) return "Nível 4 — Estratégico";
  if (stars >= 3.0) return "Nível 3 — Gerencial";
  if (stars >= 2.0) return "Nível 2 — Não Integrado";
  return "Nível 1 — Elementar";
}

function getSupplierRiskLabelFromStars(stars: number) {
  if (stars >= 2) return "Nível 2 — Básico";
  if (stars >= 1.5) return "Nível 1,5 — Risco moderado";
  if (stars >= 1) return "Nível 1 — Risco alto";
  if (stars >= 0.5) return "Nível 0,5 — Risco muito alto";
  return "Nível 0 — Altíssimo risco";
}

function getMaturityLabel(level?: string | null) {
  if (!level) return "Não calculado";
  switch (level.toUpperCase()) {
    case "NASCENT":
      return "Nível 1 — Elementar";
    case "DEVELOPING":
      return "Nível 2 — Não Integrado";
    case "ESTABLISHED":
      return "Nível 3 — Gerencial";
    case "MANAGED":
      return "Nível 4 — Estratégico";
    case "OPTIMIZED":
      return "Nível 5 — Transformador";
    default:
      return level;
  }
}

export function ResultsView({ model, history = [] }: { model: ResultsViewModel; history?: DiagnosticHistoryItem[] }) {
  const { globalScore, globalProvenScore, isPreDiagnostic, axisScores, isSupplierOrg } = model;
  const hasVerifiedScore = globalProvenScore > 0;
  const { company } = useCompany();

  const [invites, setInvites] = useState<SupplierInvite[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const [errorInvites, setErrorInvites] = useState(false);
  const [expandedDiagnosticId, setExpandedDiagnosticId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedDiagnosticId(prev => prev === id ? null : id);
  };

  const handleDownload = () => {
    generateESGReportPDF({
      isSupplierOrg,
      model,
      companyName: company?.legalName || company?.tradeName || "Minha Empresa",
      cnpj: company?.cnpj || "00.000.000/0001-00",
      segment: company?.industrySegment || "Serviços",
      invites,
    });
  };

  useEffect(() => {
    async function fetchInvites() {
      try {
        const token = getCookie("inoveesg_token") as string;
        if (!token) {
          setLoadingInvites(false);
          return;
        }
        const list = await inviteService.listInvites(token);
        setInvites(list);
      } catch (err) {
        console.error("Erro ao carregar fornecedores:", err);
        setErrorInvites(true);
      } finally {
        setLoadingInvites(false);
      }
    }
    fetchInvites();
  }, []);

  // Maps 0-100 score to 0.0 - 5.0 stars range with custom rounding rules:
  // - Decimal part <= 0.25 rounds to .0
  // - Decimal part > 0.25 and <= 0.75 rounds to .5
  // - Decimal part > 0.75 rounds to 1.0
  const getStarsValue = (score: number) => {
    const rawStars = score / 20;
    const integerPart = Math.floor(rawStars);
    const decimalPart = rawStars - integerPart;
    
    let roundedDecimal = 0;
    if (decimalPart > 0.25 && decimalPart <= 0.75) {
      roundedDecimal = 0.5;
    } else if (decimalPart > 0.75) {
      roundedDecimal = 1.0;
    }
    
    return integerPart + roundedDecimal;
  };

  const starsValue = getStarsValue(globalScore ?? 0);
  const activeInvites = invites.filter((i) => i.relationship?.status !== "INACTIVE");

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(
          <Star key={i} className="h-5 w-5 text-amber-500 fill-amber-500 animate-in zoom-in duration-300" style={{ animationDelay: `${i * 100}ms` }} />
        );
      } else if (rating >= i - 0.5) {
        stars.push(
          <StarHalf key={i} className="h-5 w-5 text-amber-500 fill-amber-500 animate-in zoom-in duration-300" style={{ animationDelay: `${i * 100}ms` }} />
        );
      } else {
        stars.push(
          <Star key={i} className="h-5 w-5 text-slate-200 animate-in zoom-in duration-300" style={{ animationDelay: `${i * 100}ms` }} />
        );
      }
    }
    return stars;
  };

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <SectionHeading
        eyebrow="Resultados"
        title="Painel de Maturidade ESG"
        description="Diagnóstico completo do desempenho ESG da sua empresa por eixo, evidências e recomendações."
        action={
          hasVerifiedScore ? (
            <Button onClick={handleDownload} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shadow-sm cursor-pointer">
              <FileCheck className="w-4 h-4" /> Baixar Relatório
            </Button>
          ) : (
            <Button onClick={handleDownload} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-2 shadow-sm cursor-pointer">
              <Download className="w-4 h-4" /> Baixar Relatório
            </Button>
          )
        }
      />

      {/* ── Status Banner for pre-diagnostic ── */}
      {!hasVerifiedScore && (
        <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/30 p-5 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100/80 border border-amber-200 shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900">Pré-Diagnóstico — Sem evidências comprovadas</p>
                <p className="text-xs text-slate-600 mt-0.5">Sua pontuação foi declarada mas ainda não foi verificada. Envie evidências para obter o Selo ESG.</p>
              </div>
            </div>
            <Button asChild size="sm" className="shrink-0 ml-auto bg-amber-600 hover:bg-amber-700 text-white gap-1.5 text-xs font-semibold">
              <Link href="/app/upgrade">
                <Sparkles className="w-3.5 h-3.5" /> Comprovar Score
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* ── Score Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Global Score (Declarado) */}
        <div className="sm:col-span-2 border border-slate-200 bg-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
          {/* Left Block: Score & Stars */}
          <div className="flex flex-col items-center sm:items-start justify-center space-y-3 shrink-0">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5 text-center sm:text-left">Pontuação Geral</span>
              <span className="text-4xl font-black text-slate-900 font-display block text-center sm:text-left">
                {globalScore}%
              </span>
            </div>
            
            <div className="flex flex-col items-center sm:items-start space-y-1 pt-2 border-t border-slate-100 w-full">
              <div className="flex items-center gap-1">
                {renderStars(starsValue)}
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                Maturidade: {starsValue.toFixed(1)} / 5.0
              </span>
            </div>
          </div>

          {/* Right Block: Maturity and Status details */}
          <div className="flex-1 flex flex-col justify-between h-full space-y-3 sm:space-y-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-extrabold">Score Declarado</p>
              <h3 className="text-base font-black text-slate-800 font-display mt-0.5">
                {isSupplierOrg ? getSupplierRiskLabelFromStars(starsValue) : getMaturityLabelFromStars(starsValue)}
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">
                {hasVerifiedScore ? "Maturidade avaliada com sucesso" : "Sem evidências comprovadas"}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                hasVerifiedScore
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}>
                {hasVerifiedScore ? (
                  <>
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Auditado
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-2.5 h-2.5 text-amber-600" /> Declaratório
                  </>
                )}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                hasVerifiedScore
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                  : "bg-red-50 text-red-700 border-red-200"
              }`}>
                Confiança: {hasVerifiedScore ? "Alto" : "Baixo"}
              </span>
            </div>
          </div>
        </div>

        {/* Proven Score */}
        <div className={`sm:col-span-2 border rounded-2xl p-6 flex items-center gap-6 shadow-sm ${hasVerifiedScore ? "border-emerald-200 bg-emerald-50/20" : "border-dashed border-slate-200 bg-slate-50/50"}`}>
          <div className="relative shrink-0">
            {hasVerifiedScore ? (
              <>
                <ScoreRing score={globalProvenScore} color="text-emerald-600" size={100} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-emerald-700">{globalProvenScore}<span className="text-sm text-emerald-600">%</span></span>
                </div>
              </>
            ) : (
              <div className="w-[100px] h-[100px] rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center bg-white">
                <Lock className="w-7 h-7 text-slate-400" />
              </div>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-slate-500">
              Score Comprovado
            </p>
            {hasVerifiedScore ? (
              <>
                <p className="text-3xl font-extrabold text-emerald-700 mt-1">{globalProvenScore}%</p>
                <p className="text-xs text-emerald-600/80 mt-1">Evidências validadas e auditadas</p>
                <span className="mt-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-55 text-emerald-850 border border-emerald-200">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" /> Verificado InoveESG
                </span>
              </>
            ) : (
              <>
                <p className="text-3xl font-extrabold text-slate-400 mt-1">0%</p>
                <p className="text-xs text-slate-500 mt-1">Sem evidências verificadas</p>
                <Link href="/app/upgrade" className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                  Enviar evidências <ArrowRight className="w-2.5 h-2.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Axis Score Bars ── */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">Desempenho por Eixo</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {axisScores.map((axis) => {
            const cfg = axisConfig[axis.axis as keyof typeof axisConfig] ?? axisConfig.E;
            const Icon = cfg.icon;
            const proven = axis.provenScore;

            return (
              <article key={axis.axis} className={`border ${cfg.border} ${cfg.bg} rounded-xl p-5 shadow-sm space-y-4 bg-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                    <h3 className={`text-sm font-bold ${cfg.color}`}>{cfg.label}</h3>
                  </div>
                  {proven > 0 ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-800">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Comprovado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-50 border border-slate-200 text-slate-400">
                      <Lock className="w-2.5 h-2.5 text-slate-400" /> Não verificado
                    </span>
                  )}
                </div>

                {/* Declared bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Declarado</span>
                    <span className="font-semibold text-slate-700">{axis.score}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${cfg.bar} opacity-70 transition-all duration-700`} style={{ width: `${axis.score}%` }} />
                  </div>
                </div>

                {/* Proven bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={proven > 0 ? "text-emerald-700 font-medium" : "text-slate-400"}>Comprovado</span>
                    <span className={`font-semibold ${proven > 0 ? "text-emerald-700" : "text-slate-400"}`}>{proven}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${proven > 0 ? "bg-emerald-500" : "bg-slate-300"} transition-all duration-700`} style={{ width: `${proven}%` }} />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-100 pt-3">{axis.interpretation}</p>
              </article>
            );
          })}
        </div>
      </section>

      {!isSupplierOrg ? (
        <>
          {/* ── Histórico de Desempenho ── */}
          <section className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Histórico de Desempenho
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Acompanhe a evolução histórica da maturidade e pontuação ESG da sua empresa.</p>
            </div>

            {(!history || history.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <FileText className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-700">Nenhum histórico disponível</p>
                <p className="text-[11px] text-slate-500 mt-1">Conclua diagnósticos para visualizar sua evolução aqui.</p>
              </div>
            ) : (
              <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="w-10 px-5 py-3"></th>
                        <th className="px-5 py-3">Data de Conclusão</th>
                        <th className="px-5 py-3">Tipo</th>
                        <th className="px-5 py-3 text-center">Ambiental (E)</th>
                        <th className="px-5 py-3 text-center">Bioeconomia (B)</th>
                        <th className="px-5 py-3 text-center">Social (S)</th>
                        <th className="px-5 py-3 text-center">Governança (G)</th>
                        <th className="px-5 py-3 text-center">Maturidade</th>
                        <th className="px-5 py-3 text-right">Nota Geral</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {history.map((item) => {
                        const score = item.score;
                        const overall = score ? Math.round(Number(score.overallScore || 0)) : 0;
                        const env = score?.environmentalScore != null ? Math.round(Number(score.environmentalScore)) : null;
                        const bio = score?.bioeconomyCircularScore != null ? Math.round(Number(score.bioeconomyCircularScore)) : null;
                        const soc = score?.socialScore != null ? Math.round(Number(score.socialScore)) : null;
                        const gov = score?.governanceScore != null ? Math.round(Number(score.governanceScore)) : null;

                        const dateStr = item.completedAt
                          ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(item.completedAt))
                          : item.createdAt
                          ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(item.createdAt))
                          : "—";

                        const isExpanded = expandedDiagnosticId === item.id;
                        
                        // Grouping responses compliance metrics
                        const totalResponses = item.responses?.length || 0;
                        const highCount = item.responses?.filter(r => (r.score ?? 0) >= 80).length || 0;
                        const mediumCount = item.responses?.filter(r => (r.score ?? 0) > 0 && (r.score ?? 0) < 80).length || 0;
                        const lowCount = item.responses?.filter(r => (r.score ?? 0) === 0 || r.score === null).length || 0;

                        return (
                          <Fragment key={item.id}>
                            <tr className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-5 py-4 text-center whitespace-nowrap">
                                <button
                                  onClick={() => toggleExpand(item.id)}
                                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                                  title={isExpanded ? "Recolher detalhes" : "Expandir detalhes"}
                                >
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                              </td>
                              <td className="px-5 py-4 font-medium text-slate-900 whitespace-nowrap">
                                {dateStr}
                              </td>
                              <td className="px-5 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                                  item.kind === "PRE_DIAGNOSTIC"
                                    ? "bg-amber-50 text-amber-800 border-amber-200"
                                    : "bg-emerald-50 text-emerald-800 border-emerald-200"
                                }`}>
                                  {item.kind === "PRE_DIAGNOSTIC" ? "Pré-Diagnóstico" : "Completo"}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-center whitespace-nowrap">
                                {env !== null ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                                    <Leaf className="w-3 h-3" /> {env}%
                                  </span>
                                ) : "—"}
                              </td>
                              <td className="px-5 py-4 text-center whitespace-nowrap">
                                {bio !== null ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                                    <Recycle className="w-3 h-3" /> {bio}%
                                  </span>
                                ) : "—"}
                              </td>
                              <td className="px-5 py-4 text-center whitespace-nowrap">
                                {soc !== null ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-blue-600">
                                    <Heart className="w-3 h-3" /> {soc}%
                                  </span>
                                ) : "—"}
                              </td>
                              <td className="px-5 py-4 text-center whitespace-nowrap">
                                {gov !== null ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-violet-600">
                                    <Scale className="w-3 h-3" /> {gov}%
                                  </span>
                                ) : "—"}
                              </td>
                              <td className="px-5 py-4 text-center font-medium text-slate-800 whitespace-nowrap">
                                {score?.maturityLevel ? getMaturityLabel(score.maturityLevel) : "—"}
                              </td>
                              <td className="px-5 py-4 text-right whitespace-nowrap">
                                <span className="font-extrabold text-slate-900 text-sm bg-slate-50 border border-slate-200 rounded px-2 py-1">
                                  {overall}%
                                </span>
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr className="bg-slate-50/30">
                                <td colSpan={9} className="px-8 py-6 border-b border-slate-200">
                                  <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    {/* Left Panel: Pontuação por Pilar (Bar Chart) */}
                                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                                        <Target className="w-4 h-4 text-emerald-600" />
                                        Desempenho por Eixo
                                      </h3>
                                      <div className="space-y-3 pt-1">
                                        {/* Ambiental */}
                                        <div className="space-y-1">
                                          <div className="flex justify-between text-xs font-medium text-slate-600">
                                            <span className="flex items-center gap-1.5"><Leaf className="w-3.5 h-3.5 text-emerald-600" /> Ambiental (E)</span>
                                            <span>{env !== null ? `${env}%` : "—"}</span>
                                          </div>
                                          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${env ?? 0}%` }} />
                                          </div>
                                        </div>
                                        {/* Bioeconomia */}
                                        <div className="space-y-1">
                                          <div className="flex justify-between text-xs font-medium text-slate-600">
                                            <span className="flex items-center gap-1.5"><Recycle className="w-3.5 h-3.5 text-amber-600" /> Bioeconomia (B)</span>
                                            <span>{bio !== null ? `${bio}%` : "—"}</span>
                                          </div>
                                          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${bio ?? 0}%` }} />
                                          </div>
                                        </div>
                                        {/* Social */}
                                        <div className="space-y-1">
                                          <div className="flex justify-between text-xs font-medium text-slate-600">
                                            <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-blue-600" /> Social (S)</span>
                                            <span>{soc !== null ? `${soc}%` : "—"}</span>
                                          </div>
                                          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${soc ?? 0}%` }} />
                                          </div>
                                        </div>
                                        {/* Governança */}
                                        <div className="space-y-1">
                                          <div className="flex justify-between text-xs font-medium text-slate-600">
                                            <span className="flex items-center gap-1.5"><Scale className="w-3.5 h-3.5 text-violet-600" /> Governança (G)</span>
                                            <span>{gov !== null ? `${gov}%` : "—"}</span>
                                          </div>
                                          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full rounded-full bg-violet-500 transition-all duration-500" style={{ width: `${gov ?? 0}%` }} />
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Right Panel: Resumo das Respostas */}
                                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                        Resumo de Conformidade das Respostas
                                      </h3>
                                      {totalResponses === 0 ? (
                                        <p className="text-xs text-slate-500 italic py-6 text-center">Nenhuma resposta detalhada registrada para este diagnóstico.</p>
                                      ) : (
                                        <div className="space-y-4 pt-1">
                                          <div className="flex items-center justify-between text-xs text-slate-600">
                                            <span>Total de Questões Respondidas</span>
                                            <span className="font-semibold text-slate-900">{totalResponses}</span>
                                          </div>
                                          
                                          {/* Compliance Progress Bars */}
                                          <div className="space-y-2">
                                            <div className="space-y-0.5">
                                              <div className="flex justify-between text-[11px] text-slate-500">
                                                <span>Conformidade Alta (score ≥ 80%)</span>
                                                <span className="font-medium text-slate-700">{highCount} ({Math.round((highCount / totalResponses) * 100)}%)</span>
                                              </div>
                                              <div className="h-1.5 w-full rounded-full bg-slate-50 overflow-hidden">
                                                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(highCount / totalResponses) * 100}%` }} />
                                              </div>
                                            </div>
                                            <div className="space-y-0.5">
                                              <div className="flex justify-between text-[11px] text-slate-500">
                                                <span>Conformidade Parcial (0 &lt; score &lt; 80%)</span>
                                                <span className="font-medium text-slate-700">{mediumCount} ({Math.round((mediumCount / totalResponses) * 100)}%)</span>
                                              </div>
                                              <div className="h-1.5 w-full rounded-full bg-slate-50 overflow-hidden">
                                                <div className="h-full rounded-full bg-amber-500" style={{ width: `${(mediumCount / totalResponses) * 100}%` }} />
                                              </div>
                                            </div>
                                            <div className="space-y-0.5">
                                              <div className="flex justify-between text-[11px] text-slate-500">
                                                <span>Sem Conformidade (score = 0%)</span>
                                                <span className="font-medium text-slate-700">{lowCount} ({Math.round((lowCount / totalResponses) * 100)}%)</span>
                                              </div>
                                              <div className="h-1.5 w-full rounded-full bg-slate-50 overflow-hidden">
                                                <div className="h-full rounded-full bg-rose-500" style={{ width: `${(lowCount / totalResponses) * 100}%` }} />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Detailed Response List */}
                                    {totalResponses > 0 && (
                                      <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                                          <FileText className="w-4 h-4 text-slate-500" />
                                          Questões e Respostas Registradas
                                        </h3>
                                        <div className="max-h-60 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-100 scrollbar-thin">
                                          {item.responses?.map((res, idx) => {
                                            const axisName = res.axis === "ENVIRONMENTAL" ? "Ambiental" : res.axis === "BIOECONOMY_CIRCULAR" ? "Bioeconomia" : res.axis === "SOCIAL" ? "Social" : "Governança";
                                            const axisColor = res.axis === "ENVIRONMENTAL" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : res.axis === "BIOECONOMY_CIRCULAR" ? "text-amber-600 bg-amber-50 border-amber-100" : res.axis === "SOCIAL" ? "text-blue-600 bg-blue-50 border-blue-100" : "text-violet-600 bg-violet-50 border-violet-100";
                                            return (
                                              <div key={res.id || idx} className="p-3 text-[11px] flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-slate-50/50">
                                                <div className="space-y-1 max-w-[80%]">
                                                  <div className="flex items-center gap-2">
                                                    <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded border ${axisColor}`}>
                                                      {axisName}
                                                    </span>
                                                    <span className="text-slate-400 font-semibold">Questão {idx + 1}</span>
                                                  </div>
                                                  <p className="font-medium text-slate-800">{res.questionText}</p>
                                                  <p className="text-slate-600 mt-1">
                                                    Resposta: <span className="font-semibold text-slate-900">{res.answerText || "—"}</span>
                                                  </p>
                                                </div>
                                                <div className="shrink-0 flex items-center gap-2 self-end sm:self-start">
                                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                                    (res.score ?? 0) >= 80 
                                                      ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                                                      : (res.score ?? 0) > 0 
                                                        ? "bg-amber-50 border-amber-200 text-amber-800" 
                                                        : "bg-rose-50 border-rose-200 text-rose-800"
                                                  }`}>
                                                    Pontuação: {res.score ?? 0}%
                                                  </span>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* ── Cadeia de Fornecedores Section ── */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Monitoramento ESG da Cadeia de Valor
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Mapeie o risco socioambiental dos seus parceiros de negócios e obtenha a média da cadeia.</p>
              </div>
              {activeInvites.length > 0 && (
                <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1.5 shadow-sm text-xs rounded-xl">
                  <Link href="/app/fornecedores">
                    <Plus className="w-3.5 h-3.5" /> Convidar Fornecedor
                  </Link>
                </Button>
              )}
            </div>

            {loadingInvites ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-3 bg-white border border-slate-200 rounded-2xl">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p className="text-xs text-slate-400">Carregando dados dos fornecedores...</p>
              </div>
            ) : errorInvites ? (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <AlertTriangle className="h-8 w-8 text-rose-500 mb-2" />
                <p className="text-xs font-bold text-slate-700">Erro ao carregar dados dos fornecedores</p>
                <p className="text-[11px] text-slate-500 mt-1">Verifique sua conexão ou tente novamente.</p>
              </div>
            ) : activeInvites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-6 space-y-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div className="space-y-1.5 max-w-lg">
                  <h4 className="text-sm font-bold text-slate-800">Sua cadeia de suprimentos ainda não está cadastrada</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Adquira pacotes de convites para que seus fornecedores possam preencher o questionário ESG gratuitamente. 
                    Isso permitirá que sua empresa monitore riscos socioambientais de terceiros e calcule o Score ESG médio da cadeia.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  <Button asChild className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 text-xs shadow-md shadow-indigo-100">
                    <Link href="/app/convites/comprar" className="flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> Adquirir Convites
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 h-9 text-xs font-semibold">
                    <Link href="/app/fornecedores">
                      Gestão de Convites
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Quick Metrics Bar */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Total Convidados</span>
                      <p className="text-xl font-black text-slate-800 font-display">{activeInvites.length}</p>
                    </div>
                    <Users className="h-7 w-7 text-indigo-500/20" />
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Conectados</span>
                      <p className="text-xl font-black text-indigo-600 font-display">
                        {activeInvites.filter(i => i.status === "ACCEPTED" || i.supplierOrganizationId != null).length}
                      </p>
                    </div>
                    <Building2 className="h-7 w-7 text-indigo-500/20" />
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Respondidos</span>
                      <p className="text-xl font-black text-emerald-600 font-display">
                        {activeInvites.filter(i => i.requestedDiagnostics.some(d => d.status === "COMPLETED")).length}
                      </p>
                    </div>
                    <CheckCircle2 className="h-7 w-7 text-emerald-500/20" />
                  </div>
                </div>

                {/* List of Suppliers */}
                <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                          <th className="px-5 py-3">Fornecedor</th>
                          <th className="px-5 py-3">Segmento</th>
                          <th className="px-5 py-3">Status do Convite</th>
                          <th className="px-5 py-3">Diagnóstico</th>
                          <th className="px-5 py-3 text-center">Amb. (E)</th>
                          <th className="px-5 py-3 text-center">Bio. (B)</th>
                          <th className="px-5 py-3 text-center">Soc. (S)</th>
                          <th className="px-5 py-3 text-center">Gov. (G)</th>
                          <th className="px-5 py-3 text-right">Nota Geral</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                        {activeInvites.map((invite) => {
                          const completedDiag = invite.requestedDiagnostics.find(d => d.status === "COMPLETED");
                          const hasCompleted = !!completedDiag;
                          const hasAccepted = invite.status === "ACCEPTED" || invite.supplierOrganizationId != null;

                          const score = completedDiag?.score;
                          const env = score?.environmentalScore != null ? Math.round(Number(score.environmentalScore)) : null;
                          const bio = score?.bioeconomyCircularScore != null ? Math.round(Number(score.bioeconomyCircularScore)) : null;
                          const soc = score?.socialScore != null ? Math.round(Number(score.socialScore)) : null;
                          const gov = score?.governanceScore != null ? Math.round(Number(score.governanceScore)) : null;
                          const overall = score?.overallScore != null ? Math.round(Number(score.overallScore)) : null;

                          let overallColorClass = "text-slate-800";
                          if (overall !== null) {
                            if (overall >= 80) {
                              overallColorClass = "text-emerald-600";
                            } else if (overall < 50) {
                              overallColorClass = "text-rose-600";
                            } else {
                              overallColorClass = "text-amber-500";
                            }
                          }

                          let statusBadge = (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                              Pendente
                            </span>
                          );
                          if (hasCompleted) {
                            statusBadge = (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                                Respondido
                              </span>
                            );
                          } else if (hasAccepted) {
                            statusBadge = (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-850">
                                Preenchendo
                              </span>
                            );
                          }

                          return (
                            <tr key={invite.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-5 py-3">
                                <div className="space-y-0.5">
                                  <p className="font-bold text-slate-800">
                                    {invite.supplierOrganization?.tradeName || invite.supplierOrganization?.legalName || "Fornecedor Convidado"}
                                  </p>
                                  <p className="text-[10px] text-slate-400">{invite.supplierEmail}</p>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-slate-600 font-medium">
                                {invite.supplierOrganization?.industrySegment || "Geral / Não Informado"}
                              </td>
                              <td className="px-5 py-3">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  invite.status === "ACCEPTED" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                                  invite.status === "SENT" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                                  invite.status === "CANCELED" ? "bg-rose-50 text-rose-700 border border-rose-100" :
                                  "bg-slate-100 text-slate-700"
                                }`}>
                                  {invite.status === "ACCEPTED" ? "Conectado" :
                                   invite.status === "SENT" ? "Enviado" :
                                   invite.status === "CANCELED" ? "Cancelado" : invite.status}
                                </span>
                              </td>
                              <td className="px-5 py-3">
                                {statusBadge}
                              </td>
                              <td className="px-5 py-3 text-center whitespace-nowrap">
                                {env !== null ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                                    <Leaf className="w-3.5 h-3.5" /> {env}%
                                  </span>
                                ) : (
                                  <span className="text-slate-300 font-normal">—</span>
                                )}
                              </td>
                              <td className="px-5 py-3 text-center whitespace-nowrap">
                                {bio !== null ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                                    <Recycle className="w-3.5 h-3.5" /> {bio}%
                                  </span>
                                ) : (
                                  <span className="text-slate-300 font-normal">—</span>
                                )}
                              </td>
                              <td className="px-5 py-3 text-center whitespace-nowrap">
                                {soc !== null ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-blue-600">
                                    <Heart className="w-3.5 h-3.5" /> {soc}%
                                  </span>
                                ) : (
                                  <span className="text-slate-300 font-normal">—</span>
                                )}
                              </td>
                              <td className="px-5 py-3 text-center whitespace-nowrap">
                                {gov !== null ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-indigo-600">
                                    <Scale className="w-3.5 h-3.5" /> {gov}%
                                  </span>
                                ) : (
                                  <span className="text-slate-300 font-normal">—</span>
                                )}
                              </td>
                              <td className="px-5 py-3 text-right font-extrabold text-sm">
                                {overall !== null ? (
                                  <span className={`${overallColorClass} font-display`}>
                                    {overall}%
                                  </span>
                                ) : (
                                  <span className="text-slate-300 font-normal">—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </section>
        </>
      ) : (
        /* ── Card de CTA para análise mais completa do Fornecedor ── */
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 text-white shadow-xl border border-emerald-500/20 my-6">
          {/* Decorative glows */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Destaque-se no Mercado
              </div>
              <h3 className="text-xl md:text-2xl font-black font-display tracking-tight">
                Deseja uma análise ESG completa para sua empresa?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Como fornecedor, você concluiu a avaliação simplificada. Para acessar um diagnóstico corporativo completo, realizar a auditoria de evidências com o Selo InoveESG verificado, gerar relatórios para novos clientes e alavancar seus indicadores de sustentabilidade, conheça nossas soluções.
              </p>
            </div>
            <div className="shrink-0 pt-2 md:pt-0">
              <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.03] duration-200">
                <Link href="/app/meus-servicos" className="flex items-center gap-2">
                  Ver Serviços Disponíveis
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ── Relatórios section ── */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">Relatório de Desempenho</h2>
        <div className={`rounded-xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${hasVerifiedScore ? "border-emerald-200 bg-emerald-50/20" : "border-slate-200 bg-slate-50/50"}`}>
          <div className="flex items-center gap-3 flex-1">
            {hasVerifiedScore ? (
              <FileCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            ) : (
              <FileText className="w-8 h-8 text-slate-450 shrink-0" />
            )}
            <div>
              <p className={`text-sm font-semibold ${hasVerifiedScore ? "text-emerald-850" : "text-slate-800"}`}>
                {hasVerifiedScore ? "Relatório Completo e Auditado disponível" : "Relatório Básico de Pré-Diagnóstico"}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {hasVerifiedScore
                  ? "Inclui Selo ESG, evidências validadas e conformidade GRI/SASB — ideal para investidores."
                  : "Resumo de maturidade sem comprovação de evidências. Para o relatório completo, contrate a auditoria."}
              </p>
            </div>
          </div>
          <Button
            onClick={handleDownload}
            className={`shrink-0 gap-2 font-semibold cursor-pointer ${hasVerifiedScore
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              : "bg-amber-600 hover:bg-amber-700 text-white shadow-sm"}`}
          >
            <Download className="w-4 h-4" />
            Baixar Relatório
          </Button>
        </div>
      </section>

      {/* ── Premium Services Marketplace ── */}
      <section className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Potencialize seu Score ESG</h2>
            <p className="text-xs text-slate-500 mt-0.5">Contrate serviços sob medida para comprovar, melhorar e certificar suas práticas.</p>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0 border-slate-200 text-slate-600 hover:bg-slate-50 text-xs gap-1 font-semibold">
            <Link href="/app/upgrade">
              Ver todos <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {premiumServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <article key={index} className="relative overflow-hidden border border-slate-200 hover:border-emerald-500/30 bg-white rounded-xl p-5 transition-all duration-300 group flex flex-col gap-4 shadow-sm">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all duration-500 -z-10 pointer-events-none" />

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                      <IconComponent className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors duration-200 leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-500 shrink-0 whitespace-nowrap">
                    {service.tag}
                  </span>
                </div>

                <ul className="grid grid-cols-1 gap-1">
                  {service.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <Button asChild size="sm" className="mt-auto w-full bg-slate-50 hover:bg-emerald-600 hover:text-white border border-slate-200 hover:border-transparent text-slate-700 font-semibold gap-1.5 text-xs transition-all duration-200">
                  <Link href={service.link}>
                    {service.ctaText} <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
