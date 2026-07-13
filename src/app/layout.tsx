import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inove ESG — Diagnóstico e Rastreabilidade ESG",
  description:
    "Plataforma e metodologia para transformar ESG em vantagem competitiva: diagnóstico, evidências, resultados mensuráveis e monitoramento contínuo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
