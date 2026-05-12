"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "cadastro";
};

export function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "cadastro">(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  };

  const isValidEmail = (e: string) => /\S+@\S+\.\S+/.test(e);
  const emailValid = isValidEmail(email);
  const emailsMatch = email === emailConfirm && emailConfirm !== "";
  const passwordValid = password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
  const passwordsMatch = password === passwordConfirm && passwordConfirm !== "";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay with Liquid Glass Effect */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg rounded-2xl border border-white/20 bg-white/80 p-8 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-foreground/50 hover:text-foreground transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Inove ESG</p>
          <h2 className="mt-2 text-2xl font-bold font-display tracking-tight text-foreground">
            {activeTab === "login" ? "Entrar na plataforma" : "Criar sua conta"}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            className={cn(
              "flex-1 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === "login" 
                ? "border-accent text-foreground" 
                : "border-transparent text-foreground/50 hover:text-foreground"
            )}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={cn(
              "flex-1 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === "cadastro" 
                ? "border-accent text-foreground" 
                : "border-transparent text-foreground/50 hover:text-foreground"
            )}
            onClick={() => setActiveTab("cadastro")}
          >
            Cadastro
          </button>
        </div>

        {/* Forms */}
        {activeTab === "login" ? (
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground/80">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@empresa.com"
                className="h-11 w-full rounded-xl border border-input bg-white/50 px-3 text-sm outline-none transition focus:border-accent/45 focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground/80">
                Senha
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11 w-full rounded-xl border border-input bg-white/50 px-3 text-sm outline-none transition focus:border-accent/45 focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <Button 
              className="mt-2 h-11 w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => router.push("/app")}
            >
              Entrar
            </Button>
            
            <div className="text-center mt-4">
              <a href="#" className="text-sm text-foreground/65 hover:text-accent">
                Esqueci minha senha
              </a>
            </div>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium text-foreground/80">
                  Nome completo
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  className="h-11 w-full rounded-xl border border-input bg-white/50 px-3 text-sm outline-none transition focus:border-accent/45 focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="tel" className="text-sm font-medium text-foreground/80">
                  Telefone / WhatsApp
                </label>
                <input
                  id="tel"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  className="h-11 w-full rounded-xl border border-input bg-white/50 px-3 text-sm outline-none transition focus:border-accent/45 focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="email-cad" className="text-sm font-medium text-foreground/80">
                  E-mail Corporativo
                </label>
                <div className="relative">
                  <input
                    id="email-cad"
                    type="email"
                    placeholder="seu@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`h-11 w-full rounded-xl border ${emailValid ? 'border-green-500/50' : email !== '' ? 'border-red-500/50' : 'border-input'} bg-white/50 px-3 pr-10 text-sm outline-none transition focus:border-accent/45 focus:ring-2 focus:ring-accent/20`}
                  />
                  {emailValid && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-green-500" />
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email-confirm" className="text-sm font-medium text-foreground/80">
                  Confirmar E-mail
                </label>
                <div className="relative">
                  <input
                    id="email-confirm"
                    type="email"
                    placeholder="seu@empresa.com"
                    value={emailConfirm}
                    onChange={(e) => setEmailConfirm(e.target.value)}
                    className={`h-11 w-full rounded-xl border ${emailsMatch ? 'border-green-500/50' : emailConfirm !== '' ? 'border-red-500/50' : 'border-input'} bg-white/50 px-3 pr-10 text-sm outline-none transition focus:border-accent/45 focus:ring-2 focus:ring-accent/20`}
                  />
                  {emailsMatch && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-green-500" />
                  )}
                </div>
                {email !== emailConfirm && emailConfirm !== '' && (
                  <p className="text-xs text-red-500 mt-1">Os e-mails não coincidem</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="company" className="text-sm font-medium text-foreground/80">
                Nome da Empresa
              </label>
              <input
                id="company"
                type="text"
                placeholder="Nome da sua empresa"
                className="h-11 w-full rounded-xl border border-input bg-white/50 px-3 text-sm outline-none transition focus:border-accent/45 focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="segment" className="text-sm font-medium text-foreground/80">
                  Segmento
                </label>
                <select
                  id="segment"
                  className="h-11 w-full rounded-xl border border-input bg-white/50 px-3 text-sm outline-none transition focus:border-accent/45 focus:ring-2 focus:ring-accent/20"
                >
                  <option value="">Selecione...</option>
                  <option value="industria">Indústria</option>
                  <option value="comercio">Comércio</option>
                  <option value="servicos">Serviços</option>
                  <option value="agro">Agronegócio</option>
                  <option value="tech">Startups / Tech</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="employees" className="text-sm font-medium text-foreground/80">
                  Nº Colaboradores
                </label>
                <select
                  id="employees"
                  className="h-11 w-full rounded-xl border border-input bg-white/50 px-3 text-sm outline-none transition focus:border-accent/45 focus:ring-2 focus:ring-accent/20"
                >
                  <option value="">Selecione...</option>
                  <option value="1-10">1 a 10</option>
                  <option value="11-50">11 a 50</option>
                  <option value="51-250">51 a 250</option>
                  <option value="250+">Mais de 250</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="suppliers" className="text-sm font-medium text-foreground/80">
                  Nº Fornecedores
                </label>
                <select
                  id="suppliers"
                  className="h-11 w-full rounded-xl border border-input bg-white/50 px-3 text-sm outline-none transition focus:border-accent/45 focus:ring-2 focus:ring-accent/20"
                >
                  <option value="">Selecione...</option>
                  <option value="1-15">1 a 15</option>
                  <option value="16-50">16 a 50</option>
                  <option value="51-100">51 a 100</option>
                  <option value="100+">Mais de 100</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="revenue" className="text-sm font-medium text-foreground/80">
                  Faturamento Anual
                </label>
                <select
                  id="revenue"
                  className="h-11 w-full rounded-xl border border-input bg-white/50 px-3 text-sm outline-none transition focus:border-accent/45 focus:ring-2 focus:ring-accent/20"
                >
                  <option value="">Selecione...</option>
                  <option value="micro">Até R$ 360 mil</option>
                  <option value="pequena">De R$ 360 mil a R$ 4,8 milhões</option>
                  <option value="media-pequena">De R$ 4,8 milhões a R$ 20 milhões</option>
                  <option value="media">De R$ 20 milhões a R$ 100 milhões</option>
                  <option value="grande">Acima de R$ 100 milhões</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="password-cad" className="text-sm font-medium text-foreground/80">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password-cad"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`h-11 w-full rounded-xl border ${passwordValid ? 'border-green-500/50' : password !== '' ? 'border-yellow-500/50' : 'border-input'} bg-white/50 px-3 pr-10 text-sm outline-none transition focus:border-accent/45 focus:ring-2 focus:ring-accent/20`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {passwordValid && <Check className="size-4 text-green-500" />}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-foreground/50 hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password-confirm" className="text-sm font-medium text-foreground/80">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    id="password-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className={`h-11 w-full rounded-xl border ${passwordsMatch ? 'border-green-500/50' : passwordConfirm !== '' ? 'border-red-500/50' : 'border-input'} bg-white/50 px-3 pr-10 text-sm outline-none transition focus:border-accent/45 focus:ring-2 focus:ring-accent/20`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {passwordsMatch && <Check className="size-4 text-green-500" />}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-foreground/50 hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                {password !== passwordConfirm && passwordConfirm !== '' && (
                  <p className="text-xs text-red-500 mt-1">As senhas não coincidem</p>
                )}
              </div>
            </div>

            <p className="text-xs text-foreground/60 mt-1">
              A senha deve conter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma minúscula e um número.
            </p>

            <Button 
              className="mt-2 h-11 w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => router.push("/app")}
            >
              Criar Conta e Continuar
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
