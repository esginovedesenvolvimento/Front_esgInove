"use client";

import React, { useState } from "react";
import { X, Send, CheckCircle2, Calendar, Target, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompany } from "../../context/company-context";
import { useCart } from "../../context/cart-context";
import { useBudgetController } from "../../controllers/use-budget.controller";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BudgetModal({ isOpen, onClose }: BudgetModalProps) {
  const { user, company } = useCompany();
  const { items, clearCart } = useCart();
  const { status, errorMessage, createBudget, reset } = useBudgetController();
  
  const [step, setStep] = useState<"form" | "success">("form");
  const [sector, setSector] = useState(company?.industrySegment || "");
  const [employeeCount, setEmployeeCount] = useState("");
  const [annualRevenue, setAnnualRevenue] = useState("");
  const [objective, setObjective] = useState("");
  const [timeline, setTimeline] = useState("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [hasPriorInventory, setHasPriorInventory] = useState("");
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState(user?.phone || company?.phone || "");

  if (!isOpen) return null;

  const toggleFocusArea = (area: string) => {
    setFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const budgetItemsPayload = items
        .filter(item => item.price === 0)
        .map(item => ({
          id: item.id,
          name: item.name,
          type: item.type,
        }));

      await createBudget({
        sector,
        employeeCount,
        annualRevenue,
        objective,
        timeline,
        focusAreas,
        hasPriorInventory,
        phone,
        notes,
        items: budgetItemsPayload,
      });

      // Salva a solicitação localmente para a lista de Meus Serviços
      try {
        const existingRequested = localStorage.getItem("inoveesg_requested_budgets");
        const requestedList = existingRequested ? JSON.parse(existingRequested) : [];
        
        const newRequests = items.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          priceFormatted: item.priceFormatted,
          requestedAt: new Date().toISOString(),
          status: "EM_ANALISE"
        }));

        localStorage.setItem("inoveesg_requested_budgets", JSON.stringify([...requestedList, ...newRequests]));
      } catch (e) {
        console.error("Failed to save requested budgets", e);
      }

      setStep("success");
    } catch (err) {
      console.error("Erro ao enviar orçamento:", err);
    }
  };

  const handleFinish = () => {
    clearCart();
    setStep("form");
    reset();
    onClose();
  };

  const budgetItems = items.filter(item => item.price === 0);
  const fixedItems = items.filter(item => item.price > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay with Liquid Glass Effect */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
        onClick={step === "form" ? onClose : undefined}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-xl rounded-2xl border border-white/20 bg-white/95 p-6 md:p-8 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.25)] backdrop-blur-xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        {step === "form" && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        )}

        {step === "form" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <Sparkles className="h-3 w-3" />
                Solicitação de Orçamento
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-display tracking-tight">
                Personalize seu Projeto ESG
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Para te enviar uma proposta sob medida, precisamos entender um pouco melhor o contexto da <span className="font-semibold text-emerald-600">{company?.legalName || "sua empresa"}</span>.
              </p>
            </div>

            {/* Informações de Contato (Logado) */}
            <div className="p-3 bg-slate-50/50 border border-slate-200/60 rounded-xl space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Informações de Contato (Logado)</span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Nome Completo</span>
                  <span className="font-semibold text-slate-700 truncate block">{user?.fullName || "Não informado"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">E-mail</span>
                  <span className="font-semibold text-slate-700 truncate block">{user?.email || "Não informado"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Telefone / WhatsApp</span>
                  <span className="font-semibold text-slate-700 truncate block">{user?.phone || company?.phone || "Não informado"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Empresa</span>
                  <span className="font-semibold text-slate-700 truncate block">{company?.legalName || "Não informado"}</span>
                </div>
              </div>
            </div>

            {/* Porte e Segmento da Empresa (Perguntas Mocks) */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">Perfil e Porte da Empresa</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Setor */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Setor de Atuação</label>
                  <select
                    required
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Selecione...</option>
                    <option value="industria">Indústria / Manufatura</option>
                    <option value="servicos">Serviços / Tecnologia</option>
                    <option value="comercio">Comércio / Varejo</option>
                    <option value="agro">Agronegócio</option>
                    <option value="construcao">Construção Civil</option>
                    <option value="outros">Outro</option>
                  </select>
                </div>

                {/* Colaboradores */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Nº de Colaboradores</label>
                  <select
                    required
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Selecione...</option>
                    <option value="micro">Até 10 (Micro)</option>
                    <option value="pequena">11 a 50 (Pequena)</option>
                    <option value="media">51 a 250 (Média)</option>
                    <option value="grande">Mais de 250 (Grande)</option>
                  </select>
                </div>

                {/* Faturamento */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Faturamento Anual</label>
                  <select
                    required
                    value={annualRevenue}
                    onChange={(e) => setAnnualRevenue(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Selecione...</option>
                    <option value="faixa1">Até R$ 360 mil</option>
                    <option value="faixa2">R$ 360 mil a R$ 4,8 milhões</option>
                    <option value="faixa3">R$ 4,8 milhões a R$ 300 milhões</option>
                    <option value="faixa4">Acima de R$ 300 milhões</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Detalhes do Projeto */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">Objetivos e Escopo</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Objetivo */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Qual o principal objetivo?</label>
                  <select
                    required
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Selecione um objetivo...</option>
                    <option value="mapear-fornecedores">Mapear/engajar cadeia de fornecedores</option>
                    <option value="obter-selo">Obter selo/certificação ESG verificado</option>
                    <option value="adequacao-legal">Adequação às exigências legais</option>
                    <option value="atrair-investimento">Atrair investimentos / Crédito verde</option>
                    <option value="outros">Outros objetivos internos</option>
                  </select>
                </div>

                {/* Prazo */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Prazo estimado para início?</label>
                  <select
                    required
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Selecione o prazo...</option>
                    <option value="imediato">O mais rápido possível (Imediato)</option>
                    <option value="1-3-meses">Dentro de 1 a 3 meses</option>
                    <option value="3-6-meses">Dentro de 3 a 6 meses</option>
                    <option value="planejamento">Apenas planejamento estratégico</option>
                  </select>
                </div>
              </div>

              {/* Áreas de Foco */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">
                  Áreas prioritárias para o diagnóstico/assessoria:
                </label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { id: "environmental", label: "Ambiental (E)" },
                    { id: "bioeconomy-circular", label: "Bioeconomia Circular (B)" },
                    { id: "social", label: "Social (S)" },
                    { id: "governance", label: "Governança (G)" },
                  ].map((area) => {
                    const active = focusAreas.includes(area.id);
                    return (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => toggleFocusArea(area.id)}
                        className={`py-1.5 px-3 rounded-lg border text-center text-xs font-semibold transition-all ${
                          active
                            ? "border-emerald-500 bg-emerald-50/50 text-emerald-700 font-bold"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {area.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inventário GEE & WhatsApp */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Possui inventário GEE?</label>
                  <div className="flex gap-4 h-9 items-center">
                    {["Sim", "Não", "Em andamento"].map((option) => (
                      <label key={option} className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                        <input
                          type="radio"
                          name="gee-inventory"
                          value={option}
                          checked={hasPriorInventory === option}
                          onChange={() => setHasPriorInventory(option)}
                          className="accent-emerald-600 h-3.5 w-3.5"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="budget-phone" className="text-[11px] font-bold text-slate-700">WhatsApp de contato:</label>
                  <input
                    id="budget-phone"
                    required
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Observações adicionais:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Temos urgência para apresentar o relatório..."
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-xs text-red-500 font-semibold bg-red-50 border border-red-100 p-2 rounded-lg text-center">
                {errorMessage}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-xl h-11 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-xs"
              >
                Voltar ao Carrinho
              </Button>
              <Button
                type="submit"
                disabled={status === "loading"}
                className="flex-1 rounded-xl h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="size-4" />
                )}
                {status === "loading" ? "Enviando..." : "Enviar Solicitação"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="size-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800">Solicitação Enviada com Sucesso!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Excelente! A equipe técnica do <span className="font-semibold text-emerald-600">InoveESG</span> já recebeu suas respostas e iniciou a análise de escopo para a <span className="font-semibold text-slate-700">{company?.legalName}</span>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-left max-w-md mx-auto space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Próximos Passos:</h4>
              <ol className="space-y-2 text-xs text-slate-600">
                <li className="flex gap-2">
                  <span className="font-bold text-emerald-600">1.</span>
                  <span><strong>Análise Interna:</strong> Nossos especialistas mapearão as horas de consultoria necessárias.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-emerald-600">2.</span>
                  <span><strong>Contato via WhatsApp:</strong> Em até 24 horas úteis, entraremos em contato no número <strong className="text-slate-800">{phone}</strong>.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-emerald-600">3.</span>
                  <span><strong>Apresentação Comercial:</strong> Agendaremos uma videochamada rápida para alinhar a proposta final.</span>
                </li>
              </ol>
            </div>

            <Button
              onClick={handleFinish}
              className="w-full max-w-xs rounded-xl h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-100 mx-auto"
            >
              Entendido e Fechar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
