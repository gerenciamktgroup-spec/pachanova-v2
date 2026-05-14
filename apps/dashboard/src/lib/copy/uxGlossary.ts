export const uxGlossary = {
  PACHA: {
    title: "Token PACHA",
    description: "Representación digital fraccional de la propiedad. En el Sandbox, existe solo como un registro en la base de datos local."
  },
  "1 PACHA = 0.1 m²": {
    title: "Paridad Matemática",
    description: "Cada token equivale a 0.1 m² de los 50,000 m² totales del activo San Bartolo (500,000 tokens en total)."
  },
  RWA: {
    title: "Real World Asset",
    description: "Activo del mundo real (inmueble) cuyo valor y propiedad legal es fraccionalizado y administrado por el Fideicomiso."
  },
  "Fideicomiso demo": {
    title: "Fideicomiso Simulado",
    description: "Entidad legal que mantiene la propiedad. La interfaz permite autorizar órdenes simuladas, pero no genera transacciones on-chain."
  },
  "Ledger local": {
    title: "Ledger Simulado",
    description: "Registro de tenencias de tokens que existe puramente en la base de datos Postgres de demostración, sin despliegue blockchain."
  },
  "Audit logs": {
    title: "Trazabilidad Inmutable Demo",
    description: "Registro cronológico de todas las mutaciones realizadas en la base de datos local para fines de auditoría del sistema."
  },
  "Integration readiness": {
    title: "Listo para Integración",
    description: "La arquitectura del software soporta la conexión externa, a la espera de inyección de credenciales productivas."
  },
  "Pending credentials": {
    title: "Credenciales Pendientes",
    description: "El flujo está bloqueado porque las llaves productivas (ej. MercadoPago) han sido explícitamente omitidas por seguridad."
  },
  "Pending Foundry": {
    title: "Bloqueo On-Chain",
    description: "La ejecución de contratos inteligentes está pausada hasta la provisión de un nodo Foundry/Anvil o despliegue en Testnet."
  },
  Simulated: {
    title: "Simulación Local",
    description: "La operación se ha completado únicamente alterando variables en la memoria o base de datos local. Sin impacto externo."
  },
  "No production connections": {
    title: "Aislamiento Productivo",
    description: "Este entorno (Demo Mirror) no tiene visibilidad ni acceso a las bases de datos o servicios de PachaNova V2.0 en producción."
  },
  "External-ready": {
    title: "Preparado para Externos",
    description: "Interfaces y webhooks construidos y testeados contra mocks, listos para conmutar a proveedores reales."
  },
  "Genesis demo": {
    title: "Adquisición Simulada",
    description: "Flujo que imita la compra inicial de tokens, generando una 'Token Order' sin solicitar fondos reales."
  },
  "Trust Anchor": {
    title: "Ancla de Confianza",
    description: "Smart Contract principal que vincula la existencia legal del activo físico con su representación digital."
  },
  "Quorum 2/3": {
    title: "Multifirma Simulada",
    description: "Regla que exige que 2 de las 3 partes (Admin, Fiduciario, Oráculo) aprueben una operación antes de considerarse válida."
  },
  "Token order demo": {
    title: "Intención de Compra",
    description: "Registro en base de datos que indica que un inversor completó el flujo UI, pendiente de revisión administrativa."
  },
  "Safe local mutation": {
    title: "Mutación Segura",
    description: "Escritura en base de datos que está auditada y no produce efectos secundarios colaterales en producción."
  }
};
