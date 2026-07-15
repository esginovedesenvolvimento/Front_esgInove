import { type ReactNode } from "react";
import { AdminShell } from "@/features/admin/shared/components/admin-shell";
import { requireAdminSession } from "@/features/admin/shared/server-auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminSession();

  return <AdminShell adminUser={session.user}>{children}</AdminShell>;
}
