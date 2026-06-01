import type { ReactNode } from "react";
import { AppShell } from "@/features/company-area/views/components/app-shell";
import { CompanyProvider } from "@/features/company-area/context/company-context";
import { CartProvider } from "@/features/company-area/context/cart-context";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <CompanyProvider>
      <CartProvider>
        <AppShell>{children}</AppShell>
      </CartProvider>
    </CompanyProvider>
  );
}
