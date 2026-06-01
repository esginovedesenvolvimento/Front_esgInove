"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, X, AlertTriangle, User, Phone, Mail, Building2, ShieldCheck, BarChart3, Users, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthController } from "@/features/auth/controllers/use-auth.controller";
import { setCookie } from "cookies-next";

type RegisterFormProps = {
  refCode?: string;
  initialEmail?: string;
  submitButtonText?: string;
  onSuccess?: (accessToken: string) => void;
};

export function RegisterForm({ refCode, initialEmail, submitButtonText = "Criar Conta e Continuar", onSuccess }: RegisterFormProps) {
  const router = useRouter();
  const { register, status, errorMessage, reset } = useAuthController();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(initialEmail || "");
  const [emailConfirm, setEmailConfirm] = useState(initialEmail || "");
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [industrySegment, setIndustrySegment] = useState("");
  const [size, setSize] = useState("");
  const [numberOfSuppliers, setNumberOfSuppliers] = useState("");
  const [annualRevenue, setAnnualRevenue] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
      setEmailConfirm(initialEmail);
    }
  }, [initialEmail]);

  const isLoading = status === "loading";

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  };

  const formatCnpj = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  };

  const isValidEmail = (e: string) => /\S+@\S+\.\S+/.test(e);
  const emailValid = isValidEmail(email);
  const emailsMatch = email === emailConfirm && emailConfirm !== "";
  const passwordValid = password.length >= 6;
  const passwordsMatch = password === passwordConfirm && passwordConfirm !== "";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !emailValid || 
      !emailsMatch || 
      !passwordValid || 
      !passwordsMatch || 
      !fullName || 
      !companyName || 
      !cnpj ||
      !phone
    ) return;
    
    try {
      const response = await register({
        email,
        password,
        fullName,
        phone,
        companyName,
        cnpj,
        industrySegment: industrySegment || undefined,
        size: size || undefined,
        numberOfSuppliers: numberOfSuppliers || undefined,
        annualRevenue: annualRevenue || undefined,
        ref: refCode || undefined
      });
      
      if (response?.accessToken) {
        setCookie("inoveesg_token", response.accessToken, { 
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
        
        if (onSuccess) {
          onSuccess(response.accessToken);
        } else {
          router.push("/app");
        }
      }
    } catch (err) {
      console.error("Register error:", err);
    }
  };

  const isFormValid = 
    emailValid && 
    emailsMatch && 
    passwordValid && 
    passwordsMatch && 
    fullName.trim().length >= 2 && 
    companyName.trim().length >= 2 && 
    cnpj.replace(/\D/g, "").length === 14 && 
    phone.replace(/\D/g, "").length >= 10;

  return (
    <form className="space-y-6" onSubmit={handleRegister} noValidate>
      
      {/* Seção 1: Dados do Contato */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <User className="size-4 text-emerald-600" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Dados do Contato Principal
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="text-xs font-medium text-slate-700">
              Nome Completo
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Seu nome completo"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white/50 px-3 text-sm outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-xs font-medium text-slate-700">
              Telefone / WhatsApp
            </label>
            <input
              id="phone"
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="(00) 00000-0000"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white/50 px-3 text-sm outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-slate-700">
              E-mail Corporativo
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@empresa.com"
                className={cn(
                  "h-11 w-full rounded-xl border bg-white/50 px-3 pr-10 text-sm outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20",
                  emailValid ? "border-green-500/50" : email !== "" ? "border-red-400/50" : "border-slate-200"
                )}
              />
              {emailValid && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-green-500" />
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="emailConfirm" className="text-xs font-medium text-slate-700">
              Confirmar E-mail
            </label>
            <div className="relative">
              <input
                id="emailConfirm"
                type="email"
                required
                value={emailConfirm}
                onChange={(e) => setEmailConfirm(e.target.value)}
                placeholder="seu@empresa.com"
                className={cn(
                  "h-11 w-full rounded-xl border bg-white/50 px-3 pr-10 text-sm outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20",
                  emailsMatch ? "border-green-500/50" : emailConfirm !== "" ? "border-red-400/50" : "border-slate-200"
                )}
              />
              {emailsMatch && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-green-500" />
              )}
            </div>
            {email !== emailConfirm && emailConfirm !== "" && (
              <p className="text-[11px] text-red-500 mt-1">Os e-mails não coincidem</p>
            )}
          </div>
        </div>
      </div>

      {/* Seção 2: Dados da Empresa */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Building2 className="size-4 text-emerald-600" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Dados da Empresa
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="companyName" className="text-xs font-medium text-slate-700">
              Razão Social
            </label>
            <input
              id="companyName"
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Nome da sua empresa"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white/50 px-3 text-sm outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="cnpj" className="text-xs font-medium text-slate-700">
              CNPJ
            </label>
            <input
              id="cnpj"
              type="text"
              required
              value={cnpj}
              onChange={(e) => setCnpj(formatCnpj(e.target.value))}
              placeholder="00.000.000/0000-00"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white/50 px-3 text-sm outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="industrySegment" className="text-xs font-medium text-slate-700">
              Segmento de Atuação
            </label>
            <select
              id="industrySegment"
              value={industrySegment}
              onChange={(e) => setIndustrySegment(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white/50 px-3 text-sm outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Selecione...</option>
              <option value="Alimentos & Bebidas">Alimentos & Bebidas</option>
              <option value="Agronegócio">Agronegócio</option>
              <option value="Logística & Transportes">Logística & Transportes</option>
              <option value="Indústria Metal-Mecânica">Indústria Metal-Mecânica</option>
              <option value="Química & Plásticos">Química & Plásticos</option>
              <option value="Construção Civil">Construção Civil</option>
              <option value="Tecnologia & Serviços">Tecnologia & Serviços</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="size" className="text-xs font-medium text-slate-700">
              Nº Colaboradores (Porte)
            </label>
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white/50 px-3 text-sm outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Selecione...</option>
              <option value="Micro (Até 9)">Micro (Até 9 colaboradores)</option>
              <option value="Pequena (10 a 49)">Pequena (10 a 49 colaboradores)</option>
              <option value="Média (50 a 99)">Média (50 a 99 colaboradores)</option>
              <option value="Média-Grande (100 a 249)">Média-Grande (100 a 249 colaboradores)</option>
              <option value="Grande (Mais de 250)">Grande (Mais de 250 colaboradores)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="numberOfSuppliers" className="text-xs font-medium text-slate-700">
              Nº Fornecedores na Cadeia
            </label>
            <select
              id="numberOfSuppliers"
              value={numberOfSuppliers}
              onChange={(e) => setNumberOfSuppliers(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white/50 px-3 text-sm outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Selecione...</option>
              <option value="Nenhum (Apenas forneço)">Nenhum (Apenas forneço)</option>
              <option value="1 a 15">1 a 15 fornecedores</option>
              <option value="16 a 50">16 a 50 fornecedores</option>
              <option value="51 a 100">51 a 100 fornecedores</option>
              <option value="Mais de 100">Mais de 100 fornecedores</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="annualRevenue" className="text-xs font-medium text-slate-700">
              Faturamento Anual Estimado
            </label>
            <select
              id="annualRevenue"
              value={annualRevenue}
              onChange={(e) => setAnnualRevenue(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white/50 px-3 text-sm outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Selecione...</option>
              <option value="Até R$ 360 mil">Até R$ 360 mil (Microempresa)</option>
              <option value="De R$ 360 mil a R$ 4,8 milhões">De R$ 360 mil a R$ 4,8 milhões (EPP)</option>
              <option value="De R$ 4,8 milhões a R$ 20 milhões">De R$ 4,8 milhões a R$ 20 milhões (Médio Porte)</option>
              <option value="De R$ 20 milhões a R$ 100 milhões">De R$ 20 milhões a R$ 100 milhões (Média-Grande)</option>
              <option value="Acima de R$ 100 milhões">Acima de R$ 100 milhões (Grande Empresa)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Seção 3: Senha */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <ShieldCheck className="size-4 text-emerald-600" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Segurança
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="password-reg" className="text-xs font-medium text-slate-700">
              Senha de Acesso
            </label>
            <div className="relative">
              <input
                id="password-reg"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "h-11 w-full rounded-xl border bg-white/50 px-3 pr-10 text-sm outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20",
                  passwordValid ? "border-green-500/50" : password !== "" ? "border-yellow-500/50" : "border-slate-200"
                )}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {password !== "" && (
                  passwordValid ? (
                    <Check className="size-4 text-green-500" />
                  ) : (
                    <X className="size-4 text-red-500" />
                  )
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password-confirm-reg" className="text-xs font-medium text-slate-700">
              Confirmar Senha
            </label>
            <div className="relative">
              <input
                id="password-confirm-reg"
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className={cn(
                  "h-11 w-full rounded-xl border bg-white/50 px-3 pr-10 text-sm outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20",
                  passwordsMatch ? "border-green-500/50" : passwordConfirm !== "" ? "border-red-400/50" : "border-slate-200"
                )}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {passwordsMatch && <Check className="size-4 text-green-500" />}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            {password !== passwordConfirm && passwordConfirm !== "" && (
              <p className="text-[11px] text-red-500 mt-1">As senhas não coincidem</p>
            )}
          </div>
        </div>
        <p className={cn("text-[11px] flex items-center gap-1", passwordValid ? "text-green-600" : "text-slate-400")}>
          {passwordValid ? <Check className="size-3" /> : <X className="size-3 text-red-500" />}
          Mínimo de 6 caracteres.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-600 font-medium animate-shake">
          <AlertTriangle className="size-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <Button 
        type="submit"
        disabled={isLoading || !isFormValid}
        className="h-11 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-2 font-semibold shadow-md transition duration-200 disabled:bg-slate-200 disabled:text-slate-400"
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Cadastrando...</span>
          </>
        ) : (
          <span>{submitButtonText}</span>
        )}
      </Button>
    </form>
  );
}
