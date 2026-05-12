import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { getDiagnosticOverviewViewModel } from "../../controllers/diagnostic.controller";
import { ProgressMeter } from "../components/progress-meter";
import { SectionHeading } from "../components/section-heading";
import { StatusPill } from "../components/status-pill";

type DiagnosticOverviewViewModel = ReturnType<typeof getDiagnosticOverviewViewModel>;

export function DiagnosticOverviewView({ model }: { model: DiagnosticOverviewViewModel }) {
  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Diagnóstico ESG"
        title="Mapa de execução por eixo"
        description="Organize as respostas por seção, identifique pendências e avance até o envio final."
        action={
          <Button asChild>
            <Link href="/app/diagnostico/preencher">Preencher perguntas</Link>
          </Button>
        }
      />

      <section className="border border-border bg-white/70 p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-foreground/80">Progresso geral</p>
          <p className="text-sm text-foreground/65">{model.answered}/{model.total} respostas</p>
        </div>
        <ProgressMeter value={model.progress} />
      </section>

      <section className="space-y-3">
        {model.sections.map((section) => (
          <article key={section.id} className="space-y-3 border border-border bg-white/70 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold tracking-tight">{section.title}</p>
                <p className="text-sm text-foreground/60">Eixo {section.axis}</p>
              </div>
              <StatusPill status={section.status} />
            </div>
            <ProgressMeter value={Math.round((section.answered / section.total) * 100)} />
            <p className="text-xs text-foreground/60">Última atualização: {section.updatedAt}</p>
          </article>
        ))}
      </section>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link href="/app/diagnostico/revisao">Revisar antes de enviar</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/app/evidencias">Ir para evidências</Link>
        </Button>
      </div>
    </div>
  );
}
