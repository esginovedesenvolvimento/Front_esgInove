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
        }
      } catch (err) {
        console.error("Erro ao buscar empresa de indicação:", err);
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
          {hasInviteContext && !loadingCompany && referringCompanyName && (
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
          <RegisterForm 
            refCode={resolvedRef || undefined} 
            initialEmail={resolvedEmail || undefined}
            submitButtonText="Criar Conta e Iniciar Diagnóstico"
          />
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
