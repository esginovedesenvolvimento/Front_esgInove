"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/app");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6 py-14">
      <section className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-[0_28px_60px_-42px_rgba(0,0,0,0.35)]">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Inove ESG</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {mode === "login" ? "Entrar na plataforma" : "Criar conta"}
          </h1>
          <p className="mt-2 text-sm text-foreground/65">
            {mode === "login"
              ? "Acesse sua conta para acompanhar diagnósticos, evidências e evolução ESG."
              : "Cadastre sua empresa para iniciar sua jornada ESG."}
          </p>
        </div>

        <div className="mb-4 flex rounded-xl border border-input p-1 text-sm">
          <Link
            href="/app"
            className="flex-1 rounded-lg px-3 py-2 bg-accent text-accent-foreground text-center"
          >
            Login
          </Link>
          <Link
            href="/app"
            className="flex-1 rounded-lg px-3 py-2 text-foreground/70 text-center"
          >
            Cadastro
          </Link>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          {mode === "register" && (
            <>
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-sm font-medium text-foreground/80">
                  Nome completo
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Seu nome"
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-accent/45 focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="companyName" className="text-sm font-medium text-foreground/80">
                  Empresa
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  placeholder="Nome da empresa"
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-accent/45 focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground/80">
              E-mail corporativo
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@empresa.com"
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-accent/45 focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground/80">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-accent/45 focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <Button className="mt-2 h-11 w-full rounded-xl">
            {mode === "login" ? "Entrar" : "Criar conta"}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <a href="#" className="text-foreground/65 hover:text-accent">
            Esqueci minha senha
          </a>
          <Link href="/" className="text-foreground/65 hover:text-accent">
            Voltar para landing
          </Link>
        </div>
      </section>
    </main>
  );
}
