import {
  ClipboardCheck,
  FileSpreadsheet,
  FileUp,
  LayoutDashboard,
  ShoppingCart,
  Truck,
  Briefcase,
} from "lucide-react";

export const companyNavItems = [
  {
    href: "/app",
    label: "Painel",
    icon: LayoutDashboard,
  },
  {
    href: "/app/meus-servicos",
    label: "Meus Serviços",
    icon: Briefcase,
  },
  {
    href: "/app/diagnostico",
    label: "Diagnóstico",
    icon: ClipboardCheck,
  },
  {
    href: "/app/evidencias",
    label: "Evidências",
    icon: FileUp,
  },
  {
    href: "/app/resultados",
    label: "Resultados",
    icon: FileSpreadsheet,
  },
  {
    href: "/app/fornecedores",
    label: "Cadeia",
    icon: Truck,
  },
  {
    href: "/app/convites/comprar",
    label: "Convites",
    icon: ShoppingCart,
  },
] as const;
