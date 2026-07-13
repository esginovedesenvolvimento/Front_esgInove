"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RegisterForm } from "@/features/auth/views/components/register-form";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

function SupplierInvitePage() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const token = searchParams.get("token");

  const [referringCompanyName, setReferringCompanyName] = useState<string | null>(null);
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [resolvedRef, setResolvedRef] = useState<string | null>(null);
  const [resolvedEmail, setResolvedEmail] = useState<string | null>(null);
  const [errorState, setErrorState] = useState<string | null>(null);

  useEffect(() => {
    if (ref) {
      setResolvedRef(ref);
    }
  }, [ref]);

  // Fetch referring company name and invitation info
  useEffect(() => {
    if (!ref && !token) return;

    async function fetchCompany() {
      setLoadingCompany(true);
      setErrorState(null);
      try {
        const query = token ? `token=${token}` : `ref=${ref}`;
        const res = await fetch(`${API_URL}/invite/public-info?${query}`);
        if (res.ok) {
          const data = await res.json();
          setReferringCompanyName(data.name);
          if (data.ref) {
            setResolvedRef(data.ref);
          }
          if (data.email) {
            setResolvedEmail(data.email);
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          setErrorState(errData.message || "Este convite é inválido ou expirou.");
        }
      } catch (err) {
        console.error("Erro ao buscar empresa de indicação:", err);
        setErrorState("Não foi possível carregar as informações do convite no momento.");
      } finally {
        setLoadingCompany(false);
      }
    }

    fetchCompany();
  }, [ref, token]);

  const hasInviteContext = ref || token;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glass decorative circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="text-center mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-600">Portal do Fornecedor</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-800">
            Cadastro de Homologação ESG
          </h2>
          {hasInviteContext && !loadingCompany && referringCompanyName && !errorState && (
            <p className="mt-3 text-sm text-slate-600 max-w-md mx-auto">
              Você foi convidado pela empresa <span className="font-semibold text-emerald-700">{referringCompanyName}</span> para realizar seu diagnóstico e homologação na plataforma.
            </p>
          )}
          {hasInviteContext && loadingCompany && (
            <p className="mt-3 text-xs text-slate-400 animate-pulse">
              Carregando dados do convite...
            </p>
          )}
          {!hasInviteContext && (
            <p className="mt-3 text-sm text-slate-600 max-w-md mx-auto">
              Realize seu cadastro de fornecedor para preencher o diagnóstico ESG solicitado pelo seu cliente.
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 py-8 px-6 shadow-xl rounded-2xl sm:px-10">
          {errorState ? (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900">Convite Indisponível</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                {errorState}
              </p>
              <div className="pt-4">
                <a
                  href="/"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                >
                  Voltar para o site
                </a>
              </div>
            </div>
          ) : (
            <RegisterForm 
              refCode={resolvedRef || undefined} 
              initialEmail={resolvedEmail || undefined}
              submitButtonText="Criar Conta e Iniciar Diagnóstico"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function SupplierInvitePageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    }>
      <SupplierInvitePage />
    </Suspense>
  );
}
