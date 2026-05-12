import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { getSupplierDetailViewModel } from "../../controllers/suppliers.controller";
import { ProgressMeter } from "../components/progress-meter";
import { SectionHeading } from "../components/section-heading";
import { StatusPill } from "../components/status-pill";

type SupplierDetailViewModel = ReturnType<typeof getSupplierDetailViewModel>;

export function SupplierDetailView({ model }: { model: SupplierDetailViewModel }) {
  if (!model.supplier) {
    return (
      <div className="space-y-4">
        <SectionHeading
          eyebrow="Fornecedores"
          title="Fornecedor não encontrado"
          description="Verifique o link acessado ou retorne para a lista principal."
        />
        <Button asChild variant="outline">
          <Link href="/app/fornecedores">Voltar para fornecedores</Link>
        </Button>
      </div>
    );
  }

  const hasLimitedAccess = model.supplier.status !== "respondido";

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Fornecedor"
        title={model.supplier.companyName}
        description={`Contato principal: ${model.supplier.contactEmail}`}
        action={
          <Button asChild variant="outline">
            <Link href="/app/fornecedores">Voltar</Link>
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="border border-border bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.1em] text-foreground/55">Status</p>
          <div className="mt-2">
            <StatusPill status={model.supplier.status} />
          </div>
        </article>
        <article className="border border-border bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.1em] text-foreground/55">Convite enviado em</p>
          <p className="mt-2 text-2xl font-semibold">{model.supplier.invitedAt}</p>
        </article>
        <article className="border border-border bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.1em] text-foreground/55">Última atualização</p>
          <p className="mt-2 text-2xl font-semibold">{model.supplier.lastUpdate}</p>
        </article>
      </section>

      <section className="border border-border bg-white/70 p-5">
        <h2 className="text-lg font-semibold tracking-tight">Evolução do preenchimento</h2>
        <div className="mt-3">
          <ProgressMeter value={model.supplier.progress} />
        </div>
      </section>

      <section className="border border-border bg-white/70 p-5">
        <h2 className="text-lg font-semibold tracking-tight">Acesso ao relatório do fornecedor</h2>
        {hasLimitedAccess ? (
          <p className="mt-2 text-sm text-foreground/70">
            O acesso completo do relatório está restrito até o fornecedor concluir o diagnóstico e sua assinatura estar ativa.
          </p>
        ) : (
          <p className="mt-2 text-sm text-foreground/70">
            Fornecedor com resposta finalizada. Relatório detalhado disponível para visualização completa.
          </p>
        )}
      </section>
    </div>
  );
}
