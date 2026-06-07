export type AppRoute = {
  id: string;
  label: string;
  path: string;
  section: "investor" | "experto" | "demo";
  role: "public" | "investor" | "admin" | "fiduciario" | "operator";
  icon: string;
  status: "active" | "simulated" | "pending_credentials" | "pending_foundry" | "disabled" | "planned";
  description: string;
  primaryAction?: string;
  secondaryAction?: string;
};

export const ROUTE_REGISTRY: AppRoute[] = [
  // --- INVERSOR: Flujo Limpio (Maker) ---
  {
    id: "investor-learn",
    label: "Aprende",
    path: "/dashboard/investor/learn",
    section: "investor",
    role: "investor",
    icon: "book-open",
    status: "active",
    description: "Centro educativo sobre el modelo de Tokenización y RWA.",
  },
  {
    id: "investor-wallet",
    label: "Billetera (Fondeo)",
    path: "/dashboard/investor/wallet",
    section: "investor",
    role: "investor",
    icon: "banknote",
    status: "active",
    description: "Inyecta capital puente vía MercadoPago para adquirir propiedades.",
    primaryAction: "Fondear Cuenta",
  },
  {
    id: "investor-portfolio",
    label: "Mi Portafolio",
    path: "/dashboard/investor",
    section: "investor",
    role: "investor",
    icon: "wallet",
    status: "active",
    description: "Visualiza tus fracciones inmobiliarias y rendimiento.",
  },
  {
    id: "investor-marketplace",
    label: "Marketplace RWA",
    path: "/dashboard/investor/marketplace",
    section: "investor",
    role: "investor",
    icon: "activity",
    status: "active",
    description: "Mercado primario y P2P de participaciones PACHA.",
  },
  {
    id: "investor-borrow",
    label: "Préstamos DeFi",
    path: "/dashboard/investor/borrow",
    section: "investor",
    role: "investor",
    icon: "scale",
    status: "active",
    description: "Solicita liquidez en USD usando tus tokens como colateral.",
  },

  // --- ADMINISTRADOR MAESTRO: Consola Bancaria (Checker) ---
  {
    id: "admin-approvals",
    label: "Aprobaciones (Maker/Checker)",
    path: "/dashboard/admin/approvals",
    section: "experto",
    role: "admin",
    icon: "shield",
    status: "active",
    description: "Bandeja de entrada para aprobar Fondeos, Retiros y KYC.",
    primaryAction: "Revisar Pendientes",
  },
  {
    id: "admin-landbank",
    label: "Bóvedas RWA (Landbank)",
    path: "/dashboard/admin/landbank",
    section: "experto",
    role: "admin",
    icon: "landmark",
    status: "active",
    description: "Control absoluto sobre los 3 modelos de propiedades y su circulante.",
  },
  {
    id: "admin-treasury",
    label: "Tesorería y Liquidación",
    path: "/dashboard/treasury",
    section: "experto",
    role: "admin",
    icon: "layout-dashboard",
    status: "active",
    description: "Gestión de caja, yield distribuido y liquidación de colaterales (Préstamos).",
  },
  {
    id: "admin-audit",
    label: "Ledger Institucional",
    path: "/dashboard/admin/audit",
    section: "experto",
    role: "admin",
    icon: "file-search",
    status: "active",
    description: "Registro inmutable de todas las transacciones de tokens en la plataforma.",
  },
  {
    id: "admin-fideicomiso",
    label: "Firmas (Fideicomiso)",
    path: "/dashboard/fideicomiso",
    section: "experto",
    role: "admin",
    icon: "pen-tool",
    status: "active",
    description: "Control de operaciones legales subyacentes.",
  },

];
