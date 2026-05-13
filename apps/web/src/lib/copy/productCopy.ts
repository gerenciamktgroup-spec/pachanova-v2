/**
 * PachaNova Banking-Grade Copywriting Dictionary
 * Reglas estrictas para evitar promesas legales ("rentabilidad", "fondos externos", etc.)
 */

export const PRODUCT_COPY = {
  status: {
    demoLocal: "Demo Local",
    externalReady: "External-ready",
    simulated: "Simulated",
    pendingCredentials: "Pending credentials",
    pendingFoundry: "Pending Foundry",
    noProduction: "No production connections",
    disabled: "Disabled by default",
  },
  disclaimers: {
    demoRibbon: "DEMO / SANDBOX — Simulated, No production connections",
    fideicomiso: "El fideicomiso PachaNova mantiene custodia sobre el inmueble. La emisión Genesis está limitada a 500,000 PACHA. Ningún token confiere propiedad directa.",
    simulatedPayment: "Este pago es una simulación interna. No se conectará a pasarelas reales salvo activación explícita de Sandbox.",
    noRealMoney: "PachaNova V2.0 Demo Mirror no acepta ni procesa fondos externos.",
  },
  metrics: {
    conversionRule: "1 PACHA = 0.1 m²",
    totalTokens: "500,000 PACHA",
    totalArea: "50,000 m²",
    genesisPrice: "US$ 8.40",
  },
  roles: {
    investor: "Panel Inversor",
    admin: "Consola Admin",
    fiduciario: "Fideicomiso",
    operator: "Consola Operador",
  },
  actions: {
    simulatePurchase: "Simular flujo Genesis",
    signOperation: "Firmar Operación",
    executeSmartContract: "Deploy Smart Contract (Simulated)",
    exportAudit: "Exportar Auditoría",
  }
};
