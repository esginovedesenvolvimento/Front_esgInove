"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { AppSidebar } from "./app-sidebar";
import { CartSidebar } from "./cart-sidebar";
import { useCompany } from "../../context/company-context";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isUnpaid, hasOnlyPreDiagnostic, hasInviteAccess, hasEvidenceAccess, isLoading } = useCompany();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Se não há usuário logado (falha no token ou deslogado), manda para a landing com login aberto
    if (!user) {
      router.push("/?auth=true");
      return;
    }

    if (pathname.startsWith("/app/evidencias") && !hasEvidenceAccess) {
      router.push("/app/upgrade");
      return;
    }

    // Se o usuário não pagou nada e tentar acessar qualquer rota que não seja o dashboard principal
    if (isUnpaid && pathname !== "/app" && pathname !== "/app/perfil" && pathname !== "/app/meus-servicos") {
      router.push("/app");
      return;
    }

    // Se o usuário tem apenas pré-diagnóstico e tentar acessar qualquer rota bloqueada
      if (hasOnlyPreDiagnostic) {
        const allowedPaths = [
          "/app",
          "/app/diagnostico",
          "/app/perfil",
          "/app/upgrade",
          "/app/checkout",
          "/app/meus-servicos",
          "/app/fornecedores", // Exceção temporária para teste do fluxo da cadeia
        ];
        if (hasInviteAccess) {
          allowedPaths.push("/app/convites");
        }
        if (hasEvidenceAccess) {
          allowedPaths.push("/app/evidencias");
        }
        const isAllowed = allowedPaths.some(path => pathname === path || pathname.startsWith(path + "/"));
        if (!isAllowed) {
          router.push("/app/upgrade");
        }
      }
  }, [user, isUnpaid, hasOnlyPreDiagnostic, hasInviteAccess, hasEvidenceAccess, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <p className="text-slate-500 text-sm font-medium">Carregando seu perfil...</p>
        </div>
      </div>
    );
  }

  // Layout para usuário não-pagante (Loja/Checkout)
  if (isUnpaid) {
    return (
      <div className="min-h-screen bg-background flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Header simples para checkout */}
          <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center">
              <Image 
                src="/logo_inove_transparent.png" 
                alt="Inove ESG" 
                width={1472}
                height={832}
                className="h-10 w-auto sm:h-12"
                priority
              />
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">1</span>
                Seleção
              </span>
              <span className="w-4 h-[1px] bg-slate-200" />
              <span className="flex items-center gap-1.5 opacity-40">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">2</span>
                Pagamento
              </span>
            </div>
          </header>

          <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
            {children}
          </main>
        </div>
        
        {/* Sidebar de Carrinho no lugar da Sidebar de Navegação */}
        <CartSidebar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#ebf1e7_0%,_var(--background)_36%,_var(--background)_100%)] text-foreground">
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-6 md:px-8 md:py-8 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
