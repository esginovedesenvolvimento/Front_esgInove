import { Button } from "@/components/ui/button";
import type { getInvitesPurchaseViewModel } from "../../controllers/invites.controller";
import { SectionHeading } from "../components/section-heading";

type InvitePurchaseViewModel = ReturnType<typeof getInvitesPurchaseViewModel>;

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function InvitePurchaseView({ model }: { model: InvitePurchaseViewModel }) {
  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Convites"
        title="Compra de pacotes para fornecedores"
        description="Amplie a cobertura da cadeia de fornecedores sem interromper o monitoramento ESG."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="border border-border bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.1em] text-foreground/55">Adquiridos</p>
          <p className="mt-2 text-3xl font-semibold">{model.balance.acquired}</p>
        </article>
        <article className="border border-border bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.1em] text-foreground/55">Utilizados</p>
          <p className="mt-2 text-3xl font-semibold">{model.balance.used}</p>
        </article>
        <article className="border border-border bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.1em] text-foreground/55">Disponíveis</p>
          <p className="mt-2 text-3xl font-semibold">{model.balance.available}</p>
        </article>
      </section>

      {model.shouldPromptPurchase ? (
        <section className="border border-amber-300 bg-amber-50/75 px-4 py-3 text-sm text-amber-900">
          Seu saldo de convites está baixo. Recomendado adquirir novo pacote para manter os envios ativos.
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-3">
        {model.packages.map((item) => (
          <article
            key={item.id}
            className={`space-y-4 border p-5 ${
              item.highlight ? "border-foreground bg-foreground text-background" : "border-border bg-white/75"
            }`}
          >
            <div>
              <p className="text-xs uppercase tracking-[0.1em] opacity-70">{item.name}</p>
              <p className="mt-2 text-4xl font-semibold leading-none">{item.invites}</p>
              <p className="mt-1 text-sm opacity-80">convites</p>
            </div>

            <p className="text-2xl font-semibold">{currency.format(item.price)}</p>

            <Button variant={item.highlight ? "secondary" : "outline"} className="w-full">
              Comprar pacote
            </Button>
          </article>
        ))}
      </section>
    </div>
  );
}
