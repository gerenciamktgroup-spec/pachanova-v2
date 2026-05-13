export type JourneyStep = {
  id: string;
  label: string;
  route: string;
  purpose: string;
  expectedUserUnderstanding: string;
  primaryAction: string;
  status: "available" | "simulated" | "pending_credentials" | "pending_foundry" | "disabled";
};

export type UserJourney = {
  id: string;
  persona: "visitor" | "investor" | "admin" | "fiduciario" | "operator";
  title: string;
  description: string;
  startRoute: string;
  completionRoute: string;
  steps: JourneyStep[];
  riskNote: string;
};

export const visitorJourney: UserJourney = {
  id: "visitor_journey",
  persona: "visitor",
  title: "Exploración Pública",
  description: "Entiende la propuesta de valor y la mecánica del entorno Demo Sandbox.",
  startRoute: "/",
  completionRoute: "/demo/walkthrough",
  riskNote: "Todo es una demostración. No es oferta pública.",
  steps: [
    {
      id: "v1",
      label: "Landing Institucional",
      route: "/",
      purpose: "Presentar la tesis RWA y San Bartolo.",
      expectedUserUnderstanding: "Entiende qué es PachaNova y que esto es una simulación.",
      primaryAction: "Navegar a 'Qué es PachaNova'",
      status: "available"
    },
    {
      id: "v2",
      label: "PACHA/m²",
      route: "/#activo",
      purpose: "Explicar el modelo matemático base.",
      expectedUserUnderstanding: "1 PACHA equivale a 0.1 m².",
      primaryAction: "Ver matemáticas del token",
      status: "available"
    },
    {
      id: "v3",
      label: "Demo Mirror",
      route: "/demo/showcase",
      purpose: "Mostrar la sala de control de la demo.",
      expectedUserUnderstanding: "Hay múltiples paneles para distintos roles.",
      primaryAction: "Entrar al Showcase",
      status: "available"
    },
    {
      id: "v4",
      label: "Walkthrough",
      route: "/demo/walkthrough",
      purpose: "Recorrido guiado de las capacidades.",
      expectedUserUnderstanding: "Comprende el ecosistema completo.",
      primaryAction: "Iniciar recorrido",
      status: "available"
    }
  ]
};

export const investorJourney: UserJourney = {
  id: "investor_journey",
  persona: "investor",
  title: "Adquisición RWA",
  description: "Simulación de compra y consulta de portafolio para el inversor.",
  startRoute: "/dashboard/investor",
  completionRoute: "/demo/integrations",
  riskNote: "Capital y saldos locales simulados. No se conecta a MercadoPago productivo.",
  steps: [
    {
      id: "i1",
      label: "Panel Inversor",
      route: "/dashboard/investor",
      purpose: "Ver el estado general y el activo.",
      expectedUserUnderstanding: "Sabe que está viendo la propiedad San Bartolo.",
      primaryAction: "Revisar activo",
      status: "available"
    },
    {
      id: "i2",
      label: "Ledger PACHA",
      route: "/dashboard/investor/ledger",
      purpose: "Verificar el saldo simulado de tokens.",
      expectedUserUnderstanding: "Sabe cuántos PACHA tiene en la base de datos local.",
      primaryAction: "Consultar saldo",
      status: "simulated"
    },
    {
      id: "i3",
      label: "Genesis Demo",
      route: "/dashboard/investor/genesis",
      purpose: "Simular una intención de compra (Token Order).",
      expectedUserUnderstanding: "Crea una orden sin usar fondos externos.",
      primaryAction: "Simular flujo",
      status: "pending_credentials"
    },
    {
      id: "i4",
      label: "Estado de Integraciones",
      route: "/demo/integrations",
      purpose: "Entender por qué la compra fue simulada.",
      expectedUserUnderstanding: "MercadoPago no está conectado.",
      primaryAction: "Revisar arquitectura",
      status: "available"
    }
  ]
};

export const adminJourney: UserJourney = {
  id: "admin_journey",
  persona: "admin",
  title: "Gestión Operativa",
  description: "Auditoría de usuarios, KYC simulado y token orders.",
  startRoute: "/dashboard/admin",
  completionRoute: "/dashboard/admin/integrations",
  riskNote: "El KYC es un dummy flag en Postgres local.",
  steps: [
    {
      id: "a1",
      label: "Consola Admin",
      route: "/dashboard/admin",
      purpose: "Visión global operativa.",
      expectedUserUnderstanding: "Tiene el poder de ver a todos los usuarios.",
      primaryAction: "Ir a usuarios",
      status: "available"
    },
    {
      id: "a2",
      label: "Usuarios y KYC",
      route: "/dashboard/admin/users",
      purpose: "Aprobar o revisar KYC de inversores.",
      expectedUserUnderstanding: "El KYC simula un webhook exitoso.",
      primaryAction: "Simular revisión",
      status: "simulated"
    },
    {
      id: "a3",
      label: "Órdenes Demo",
      route: "/dashboard/admin/token-orders",
      purpose: "Revisar las intenciones de compra (Genesis).",
      expectedUserUnderstanding: "Puede ver lo que el Inversor intentó comprar.",
      primaryAction: "Revisar órdenes",
      status: "simulated"
    },
    {
      id: "a4",
      label: "Auditoría",
      route: "/dashboard/admin/audit",
      purpose: "Trazabilidad de cada mutación.",
      expectedUserUnderstanding: "Cada clic queda registrado en el Audit Log inmutable.",
      primaryAction: "Ver logs",
      status: "available"
    }
  ]
};

export const fiduciarioJourney: UserJourney = {
  id: "fiduciario_journey",
  persona: "fiduciario",
  title: "Control Fiduciario RWA",
  description: "Aprobación Multi-Sig y validación de respaldo legal.",
  startRoute: "/dashboard/fideicomiso",
  completionRoute: "/demo/integrations", // Pending Foundry
  riskNote: "La ejecución final está en PENDING_FOUNDRY. No impacta en blockchain.",
  steps: [
    {
      id: "f1",
      label: "Fideicomiso",
      route: "/dashboard/fideicomiso",
      purpose: "Visión global del mandato fiduciario.",
      expectedUserUnderstanding: "Es la figura legal que resguarda el activo.",
      primaryAction: "Ver operaciones",
      status: "available"
    },
    {
      id: "f2",
      label: "Respaldo Legal",
      route: "/dashboard/fideicomiso/legal-backing",
      purpose: "Comprobar el SPV y documentación.",
      expectedUserUnderstanding: "El activo está blindado legalmente.",
      primaryAction: "Consultar estructura",
      status: "available"
    },
    {
      id: "f3",
      label: "Operaciones",
      route: "/dashboard/fideicomiso/operations",
      purpose: "Ver propuestas de emisión pendientes.",
      expectedUserUnderstanding: "Requieren firmas (Quorum 2/3).",
      primaryAction: "Proponer demo",
      status: "simulated"
    },
    {
      id: "f4",
      label: "Firmas",
      route: "/dashboard/fideicomiso/signatures",
      purpose: "Ejercer firma simulada en el multi-sig.",
      expectedUserUnderstanding: "Abre la puerta a la emisión on-chain (bloqueada).",
      primaryAction: "Ejecutar simulación",
      status: "pending_foundry"
    }
  ]
};

export const operatorJourney: UserJourney = {
  id: "operator_journey",
  persona: "operator",
  title: "Gestión de Entorno",
  description: "Herramientas de control para realizar la demostración.",
  startRoute: "/demo/showcase",
  completionRoute: "/demo/reports",
  riskNote: "Acciones destructivas locales (Reset DB).",
  steps: [
    {
      id: "o1",
      label: "Showcase",
      route: "/demo/showcase",
      purpose: "Punto de partida y selector de roles.",
      expectedUserUnderstanding: "Puede saltar a cualquier módulo.",
      primaryAction: "Entrar al Operador",
      status: "available"
    },
    {
      id: "o2",
      label: "Operator",
      route: "/demo/operator",
      purpose: "Resetear la base de datos.",
      expectedUserUnderstanding: "Puede restaurar el Demo a cero.",
      primaryAction: "Verificar Health",
      status: "simulated"
    },
    {
      id: "o3",
      label: "Scenarios",
      route: "/demo/scenarios",
      purpose: "Inyectar estados (KYC, saldos) para acelerar la demo.",
      expectedUserUnderstanding: "No necesita hacer todo el flujo manual.",
      primaryAction: "Inyectar escenario",
      status: "simulated"
    },
    {
      id: "o4",
      label: "Reports",
      route: "/demo/reports",
      purpose: "Mostar documentación de QA y salidas.",
      expectedUserUnderstanding: "El software está testeado profesionalmente.",
      primaryAction: "Ver QA",
      status: "available"
    }
  ]
};

export const allJourneys = {
  visitor: visitorJourney,
  investor: investorJourney,
  admin: adminJourney,
  fiduciario: fiduciarioJourney,
  operator: operatorJourney
};
