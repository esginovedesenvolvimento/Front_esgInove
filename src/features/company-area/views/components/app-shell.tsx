import type { ReactNode } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { companyProfile } from "../../models/mock-data";
import { AppSidebar } from "./app-sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7faf4_0%,_#ffffff_36%,_#ffffff_100%)] text-foreground">
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
