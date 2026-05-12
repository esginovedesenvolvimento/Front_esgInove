import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Área administrativa</h1>
      <p className="mt-3 text-sm leading-6 text-foreground/75">
        Placeholder por enquanto. Próximo passo: gestão de empresas, diagnósticos,
        convites e planos.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-foreground/15 px-5 py-3 text-sm font-semibold hover:bg-foreground/5"
        >
          Voltar para a landing
        </Link>
      </div>
    </div>
  );
}

