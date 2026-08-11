"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "../../components/section-heading";
import { KpiStrip } from "../../components/kpi-strip";
import type { getProfileViewModel } from "../../../controllers/profile.controller";
import { Building2, CreditCard, Mail, MapPin, Phone, Users, ShieldCheck, User, ExternalLink } from "lucide-react";
import { InvitePurchaseModal } from "../../components/invite-purchase-modal";
import { useCompany } from "@/features/company-area/context/company-context";
import { getCookie } from "cookies-next";
import { inviteService } from "@/features/company-area/services/invite.service";
import { authService } from "@/features/auth/services/auth.service";
import { formatCPF, formatCNPJ, validateCPF, validateCNPJ } from "@/lib/cpfCnpjValidator";

const BUSINESS_CATEGORIES = [
  { code: "AGRONEGOCIO", name: "Agronegócio" }
];

const BUSINESS_SEGMENTS: Record<string, { code: string; name: string }[]> = {
  AGRONEGOCIO: [
    { code: "AGROINDUSTRIA", name: "Agroindústria" },
    { code: "PRODUCAO", name: "Produção" }
  ]
};

function displayCNPJ(cnpj?: string | null): string {
  if (!cnpj) return "N/A";
  return formatCNPJ(cnpj);
}

function displayCPF(cpf?: string | null): string {
  if (!cpf) return "N/A";
  return formatCPF(cpf);
}

function formatPhone(phone?: string | null): string {
  if (!phone) return "N/A";
  const clean = phone.replace(/\D/g, "");
  if (clean.length === 11) {
    return clean.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  }
  if (clean.length === 10) {
    return clean.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }
  return phone;
}

type ProfileViewModel = ReturnType<typeof getProfileViewModel>;

export function ProfileView({ model }: { model: ProfileViewModel }) {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const { company, user, refreshProfile } = useCompany();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);

  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    legalName: "",
    tradeName: "",
    cnpj: "",
    industrySegment: "",
    businessCategoryCode: "",
    businessSegmentCode: "",
    specificActivity: "",
    enderecoCompleto: "",
    municipioEstado: "",
    website: "",
    redesSociais: "",
    naturezaJuridica: "",
    porte: "",
    tempoOperacao: "",
    alcanceMercado: "",
    primaryEmail: "",
  });

  const handleStartEditCompany = () => {
    setCompanyForm({
      legalName: company?.legalName || "",
      tradeName: company?.tradeName || "",
      cnpj: company?.cnpj || "",
      industrySegment: company?.industrySegment || "",
      businessCategoryCode: company?.businessCategory?.code || "",
      businessSegmentCode: company?.businessSegment?.code || "",
      specificActivity: company?.specificActivity || "",
      enderecoCompleto: company?.enderecoCompleto || "",
      municipioEstado: company?.municipioEstado || "",
      website: company?.website || "",
      redesSociais: company?.redesSociais || "",
      naturezaJuridica: company?.naturezaJuridica || "",
      porte: company?.porte || "",
      tempoOperacao: company?.tempoOperacao || "",
      alcanceMercado: company?.alcanceMercado || "",
      primaryEmail: company?.primaryEmail || "",
    });
    setIsEditingCompany(true);
  };

  const handleSaveCompany = async () => {
    const token = getCookie("inoveesg_token") as string;
    if (!token) return;
    if (companyForm.cnpj && !validateCNPJ(companyForm.cnpj)) {
      alert("CNPJ inválido (dígitos verificadores incorretos). Por favor verifique o número preenchido.");
      return;
    }
    try {
      await authService.updateProfile(token, {
        organization: companyForm,
      });
      await refreshProfile();
      setIsEditingCompany(false);
    } catch (err: any) {
      alert(err?.message || "Erro ao salvar dados da organização");
    }
  };

  const [isEditingRespondent, setIsEditingRespondent] = useState(false);
  const [respondentForm, setRespondentForm] = useState({
    fullName: "",
    phone: "",
    cpf: "",
    cargoFuncao: "",
    grauParticipacao: "",
  });

  const handleStartEditRespondent = () => {
    setRespondentForm({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      cpf: user?.cpf || "",
      cargoFuncao: user?.cargoFuncao || "",
      grauParticipacao: user?.grauParticipacao || "",
    });
    setIsEditingRespondent(true);
  };

  const handleSaveRespondent = async () => {
    const token = getCookie("inoveesg_token") as string;
    if (!token) return;
    if (respondentForm.cpf && !validateCPF(respondentForm.cpf)) {
      alert("CPF inválido (dígitos verificadores incorretos). Por favor verifique o número preenchido.");
      return;
    }
    try {
      await authService.updateProfile(token, {
        user: respondentForm,
      });
      await refreshProfile();
      setIsEditingRespondent(false);
    } catch (err: any) {
      alert(err?.message || "Erro ao salvar dados do respondente");
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      const token = getCookie("inoveesg_token") as string;
      if (token) {
        try {
          const res = await inviteService.getStats(token);
          setStats(res);
        } catch (err) {
          console.error("Failed to fetch invite stats", err);
        }
      }
    };
    fetchStats();
  }, []);

  const available = stats?.availableInvites ?? company?.inviteWallet?.balance ?? 0;
  const acquired = Math.max(available, stats?.totalInvitesPurchased ?? company?.orders?.filter(o => o.orderType === "INVITE_PACK" && o.status === "PAID").reduce((acc, o) => acc + (o.items?.[0]?.quantity || 0), 0) ?? 0);
  const used = Math.max(0, acquired - available);

  const billingHistory = company?.orders?.map((order) => {
    const itemName = order.items?.[0]?.product?.name || (order.orderType === "INVITE_PACK" ? "Pacote de Convites" : "Serviço InoveESG");
    const quantity = order.items?.[0]?.quantity;
    const displayName = order.orderType === "INVITE_PACK" 
      ? `${itemName} (${quantity} convites)` 
      : itemName;

    return {
      id: order.id,
      displayName,
      date: order.paidAt 
        ? new Date(order.paidAt).toLocaleDateString("pt-BR") 
        : new Date(order.createdAt).toLocaleDateString("pt-BR"),
      amount: `R$ ${(order.totalCents / 100).toFixed(2).replace(".", ",")}`,
      status: order.status,
    };
  }) || [];

  const userInitials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "US";

  const joinedDate = company?.createdAt
    ? new Date(company.createdAt).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })
    : "-";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent opacity-70" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight">
              {company?.tradeName || company?.legalName || "Minha Empresa"}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-white/10 backdrop-blur-md border border-white/10 text-white">
              <Building2 className="h-4 w-4 text-accent" />
              CNPJ: {displayCNPJ(company?.cnpj)}
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-white/10 backdrop-blur-md border border-white/10 text-white">
              <User className="h-4 w-4 text-accent" />
              Membro desde: {joinedDate}
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-accent">
              <ShieldCheck className="h-4 w-4" />
              Empresa Verificada
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Company Info Card (Left Column, takes 2/3 space on large screens) */}
        <article className="lg:col-span-2 rounded-2xl border border-white/40 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl flex items-center justify-center shadow-sm">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-slate-800">Dados da Organização</h2>
                <p className="text-xs text-slate-500">Informações cadastrais e de mercado registradas no banco</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isEditingCompany ? (
                <Button 
                  onClick={handleStartEditCompany}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold"
                >
                  Editar
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => setIsEditingCompany(false)}
                    variant="ghost"
                    size="sm"
                    className="rounded-xl text-slate-500 font-semibold hover:bg-slate-100"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSaveCompany}
                    size="sm"
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    Salvar
                  </Button>
                </>
              )}
            </div>
          </div>

          {isEditingCompany ? (
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Razão Social</span>
                <input
                  type="text"
                  value={companyForm.legalName}
                  onChange={(e) => setCompanyForm({ ...companyForm, legalName: e.target.value })}
                  className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Nome Fantasia</span>
                <input
                  type="text"
                  value={companyForm.tradeName}
                  onChange={(e) => setCompanyForm({ ...companyForm, tradeName: e.target.value })}
                  className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">CNPJ</span>
                <input
                  type="text"
                  value={companyForm.cnpj}
                  onChange={(e) => setCompanyForm({ ...companyForm, cnpj: formatCNPJ(e.target.value) })}
                  placeholder="00.000.000/0000-00"
                  className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Categoria de Negócio</span>
                <select
                  value={companyForm.businessCategoryCode}
                  onChange={(e) => {
                    const catCode = e.target.value;
                    setCompanyForm({
                      ...companyForm,
                      businessCategoryCode: catCode,
                      businessSegmentCode: "",
                      industrySegment: "",
                      specificActivity: ""
                    });
                  }}
                  className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">Selecione...</option>
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat.code} value={cat.code}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Segmento de Atuação</span>
                <select
                  disabled={!companyForm.businessCategoryCode}
                  value={companyForm.businessSegmentCode}
                  onChange={(e) => {
                    const segCode = e.target.value;
                    const segName = BUSINESS_SEGMENTS[companyForm.businessCategoryCode]?.find((s) => s.code === segCode)?.name || "";
                    setCompanyForm({
                      ...companyForm,
                      businessSegmentCode: segCode,
                      industrySegment: segName,
                      specificActivity: ""
                    });
                  }}
                  className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-50"
                >
                  <option value="">Selecione...</option>
                  {companyForm.businessCategoryCode &&
                    BUSINESS_SEGMENTS[companyForm.businessCategoryCode]?.map((seg) => (
                      <option key={seg.code} value={seg.code}>{seg.name}</option>
                    ))
                  }
                </select>
              </div>
              {companyForm.businessSegmentCode && (
                <div className="space-y-1 md:col-span-2 animate-fade-in">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Atividade Específica</span>
                  <input
                    type="text"
                    value={companyForm.specificActivity}
                    onChange={(e) => setCompanyForm({ ...companyForm, specificActivity: e.target.value })}
                    className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              )}
              <div className="space-y-1 md:col-span-2">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Endereço Completo</span>
                <input
                  type="text"
                  value={companyForm.enderecoCompleto}
                  onChange={(e) => setCompanyForm({ ...companyForm, enderecoCompleto: e.target.value })}
                  className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Município / Estado</span>
                <input
                  type="text"
                  value={companyForm.municipioEstado}
                  onChange={(e) => setCompanyForm({ ...companyForm, municipioEstado: e.target.value })}
                  className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Site Oficial</span>
                <input
                  type="text"
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Redes Sociais</span>
                <input
                  type="text"
                  value={companyForm.redesSociais}
                  onChange={(e) => setCompanyForm({ ...companyForm, redesSociais: e.target.value })}
                  className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Natureza Jurídica</span>
                <input
                  type="text"
                  value={companyForm.naturezaJuridica}
                  onChange={(e) => setCompanyForm({ ...companyForm, naturezaJuridica: e.target.value })}
                  className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Porte da Empresa</span>
                <input
                  type="text"
                  value={companyForm.porte}
                  onChange={(e) => setCompanyForm({ ...companyForm, porte: e.target.value })}
                  className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Tempo de Operação</span>
                <input
                  type="text"
                  value={companyForm.tempoOperacao}
                  onChange={(e) => setCompanyForm({ ...companyForm, tempoOperacao: e.target.value })}
                  className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Alcance de Mercado</span>
                <input
                  type="text"
                  value={companyForm.alcanceMercado}
                  onChange={(e) => setCompanyForm({ ...companyForm, alcanceMercado: e.target.value })}
                  className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">E-mail de Contato Principal</span>
                <input
                  type="email"
                  value={companyForm.primaryEmail}
                  onChange={(e) => setCompanyForm({ ...companyForm, primaryEmail: e.target.value })}
                  className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Razão Social</span>
                <p className="text-sm font-semibold text-slate-700 bg-white/40 border border-slate-100 px-3 py-2 rounded-xl">
                  {company?.legalName || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Nome Fantasia</span>
                <p className="text-sm font-semibold text-slate-700 bg-white/40 border border-slate-100 px-3 py-2 rounded-xl">
                  {company?.tradeName || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">CNPJ</span>
                <p className="text-sm font-semibold text-slate-700 bg-white/40 border border-slate-100 px-3 py-2 rounded-xl">
                  {displayCNPJ(company?.cnpj)}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Setor de Atuação</span>
                <p className="text-sm font-semibold text-slate-700 bg-white/40 border border-slate-100 px-3 py-2 rounded-xl">
                  {company?.businessCategory?.name && company?.businessSegment?.name
                    ? `${company.businessCategory.name} - ${company.businessSegment.name}`
                    : company?.industrySegment || "N/A"}
                </p>
              </div>
              {company?.specificActivity && (
                <div className="space-y-1 md:col-span-2">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Atividade Específica</span>
                  <p className="text-sm font-semibold text-slate-700 bg-white/40 border border-slate-100 px-3 py-2 rounded-xl">
                    {company.specificActivity}
                  </p>
                </div>
              )}
              <div className="space-y-1 md:col-span-2">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Endereço Completo</span>
                <p className="text-sm font-semibold text-slate-700 bg-white/40 border border-slate-100 px-3 py-2 rounded-xl">
                  {company?.enderecoCompleto || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Município / Estado</span>
                <p className="text-sm font-semibold text-slate-700 bg-white/40 border border-slate-100 px-3 py-2 rounded-xl">
                  {company?.municipioEstado || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Site Oficial</span>
                <p className="text-sm font-semibold text-slate-700 bg-white/40 border border-slate-100 px-3 py-2 rounded-xl flex items-center justify-between">
                  <span>{company?.website || "N/A"}</span>
                  {company?.website && (
                    <a 
                      href={company.website.startsWith("http") ? company.website : `https://${company.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Redes Sociais</span>
                <p className="text-sm font-semibold text-slate-700 bg-white/40 border border-slate-100 px-3 py-2 rounded-xl">
                  {company?.redesSociais || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Natureza Jurídica</span>
                <p className="text-sm font-semibold text-slate-700 bg-white/40 border border-slate-100 px-3 py-2 rounded-xl">
                  {company?.naturezaJuridica || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Porte da Empresa</span>
                <p className="text-sm font-semibold text-slate-700 bg-white/40 border border-slate-100 px-3 py-2 rounded-xl">
                  {company?.porte || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Tempo de Operação</span>
                <p className="text-sm font-semibold text-slate-700 bg-white/40 border border-slate-100 px-3 py-2 rounded-xl">
                  {company?.tempoOperacao || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Alcance de Mercado</span>
                <p className="text-sm font-semibold text-slate-700 bg-white/40 border border-slate-100 px-3 py-2 rounded-xl">
                  {company?.alcanceMercado || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">E-mail de Contato Principal</span>
                <p className="text-sm font-semibold text-slate-700 bg-white/40 border border-slate-100 px-3 py-2 rounded-xl">
                  {company?.primaryEmail || "N/A"}
                </p>
              </div>
            </div>
          )}
        </article>

        {/* Right Column (Takes 1/3 space on large screens) */}
        <div className="space-y-8">
          {/* Respondent Info Card */}
          <article className="rounded-2xl border border-white/40 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-teal-50 text-teal-600 border border-teal-100 rounded-xl flex items-center justify-center shadow-sm">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-display text-slate-800">Dados do Respondente</h2>
                  <p className="text-xs text-slate-500">Representante técnico legal</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isEditingRespondent ? (
                  <Button 
                    onClick={handleStartEditRespondent}
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold"
                  >
                    Editar
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={() => setIsEditingRespondent(false)}
                      variant="ghost"
                      size="sm"
                      className="rounded-xl text-slate-500 font-semibold hover:bg-slate-100"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleSaveRespondent}
                      size="sm"
                      className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                    >
                      Salvar
                    </Button>
                  </>
                )}
              </div>
            </div>

            {isEditingRespondent ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Nome Completo</span>
                  <input
                    type="text"
                    value={respondentForm.fullName}
                    onChange={(e) => setRespondentForm({ ...respondentForm, fullName: e.target.value })}
                    className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Cargo/Função</span>
                  <input
                    type="text"
                    value={respondentForm.cargoFuncao}
                    onChange={(e) => setRespondentForm({ ...respondentForm, cargoFuncao: e.target.value })}
                    className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">CPF</span>
                  <input
                    type="text"
                    value={respondentForm.cpf}
                    onChange={(e) => setRespondentForm({ ...respondentForm, cpf: formatCPF(e.target.value) })}
                    placeholder="000.000.000-00"
                    className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">WhatsApp</span>
                  <input
                    type="text"
                    value={respondentForm.phone}
                    onChange={(e) => setRespondentForm({ ...respondentForm, phone: e.target.value })}
                    className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Envolvimento</span>
                  <input
                    type="text"
                    value={respondentForm.grauParticipacao}
                    onChange={(e) => setRespondentForm({ ...respondentForm, grauParticipacao: e.target.value })}
                    className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 bg-gradient-to-r from-slate-50 to-slate-100/50 p-4 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-lg flex items-center justify-center shadow-sm shadow-emerald-500/20">
                    {userInitials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{user?.fullName || "N/A"}</h4>
                    <p className="text-xs text-slate-500">{user?.cargoFuncao || "Cargo não informado"}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs text-slate-400 uppercase font-medium">CPF</span>
                    <span className="text-xs font-semibold text-slate-800">{displayCPF(user?.cpf)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs text-slate-400 uppercase font-medium">E-mail</span>
                    <span className="text-xs font-semibold text-slate-800 truncate max-w-[180px]">{user?.email || "N/A"}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs text-slate-400 uppercase font-medium">WhatsApp</span>
                    <span className="text-xs font-semibold text-slate-800">{formatPhone(user?.phone)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400 uppercase font-medium">Envolvimento</span>
                    <span className="text-xs font-semibold text-slate-800">{user?.grauParticipacao || "N/A"}</span>
                  </div>
                </div>
              </>
            )}
          </article>

        </div>
      </div>

      {/* Invites Chain Management Card */}
      <article className="rounded-2xl border border-white/40 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-accent/20 text-emerald-700 border border-accent/30 rounded-xl flex items-center justify-center shadow-sm">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-800">Cadeia de Fornecedores</h2>
              <p className="text-xs text-slate-500">Distribuição e monitoramento de convites de homologação ESG</p>
            </div>
          </div>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20"
            onClick={() => setIsPurchaseModalOpen(true)}
          >
            Contratar mais convites
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/50 border border-slate-100 p-5 rounded-2xl shadow-sm transition-all hover:bg-white">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Adquiridos</span>
            <p className="text-3xl font-bold font-display text-slate-800 mt-2">{acquired}</p>
            <p className="text-xs text-slate-500 mt-1">Total de licenças de convites</p>
          </div>
          <div className="bg-white/50 border border-slate-100 p-5 rounded-2xl shadow-sm transition-all hover:bg-white">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Utilizados</span>
            <p className="text-3xl font-bold font-display text-slate-800 mt-2">{used}</p>
            <p className="text-xs text-slate-500 mt-1">Enviados para homologação</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl shadow-sm transition-all hover:bg-emerald-500/10">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Disponíveis</span>
            <p className="text-3xl font-bold font-display text-emerald-600 mt-2">{available}</p>
            <p className="text-xs text-emerald-600/80 mt-1">Prontos para envio</p>
          </div>
        </div>

        <div className="space-y-2.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Uso Geral da Capacidade de Cadeia</span>
            <span>{acquired > 0 ? Math.round((used / acquired) * 100) : 0}%</span>
          </div>
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500" 
              style={{ width: `${acquired > 0 ? (used / acquired) * 100 : 0}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            * Cada convite permite que um fornecedor terceirizado responda ao questionário de integridade ESG do ecossistema.
          </p>
        </div>
      </article>

      {/* Invoice & Billing History Card */}
      <article className="rounded-2xl border border-white/40 bg-white/70 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-md space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-11 h-11 bg-slate-100 text-slate-600 border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-slate-800">Histórico Financeiro</h2>
            <p className="text-xs text-slate-500">Últimas transações e cobranças processadas via Gateway</p>
          </div>
        </div>



        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-800">Faturas Recentes</h4>
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-white/40">
            {billingHistory.length > 0 ? (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500">
                    <th className="p-4">Produto/Serviço</th>
                    <th className="p-4">Data do Pedido</th>
                    <th className="p-4">Valor Total</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {billingHistory.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-white/60 transition-colors">
                      <td className="p-4 font-semibold text-slate-800">{invoice.displayName}</td>
                      <td className="p-4 text-slate-500 text-xs">{invoice.date}</td>
                      <td className="p-4 font-semibold text-slate-800">{invoice.amount}</td>
                      <td className="p-4 text-right">
                        {invoice.status === "PAID" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Pago
                          </span>
                        ) : invoice.status === "PENDING_PAYMENT" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Pendente
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                            {invoice.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                Nenhum pagamento registrado no histórico financeiro da organização.
              </div>
            )}
          </div>
        </div>
      </article>

      <InvitePurchaseModal 
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </div>
  );
}
