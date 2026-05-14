export const businessModelCopy = {
  asset: {
    name: "San Bartolo",
    sizeHectares: 5,
    sizeSqm: 50000,
    totalTokens: 500000,
    sqmPerToken: 0.1,
    unitPriceUsd: 8.40
  },
  roles: {
    investor: "Usuario registrado que ha validado su perfil (KYC) y opera simuladamente adquiriendo y transando PACHA en la plataforma.",
    admin: "Operador que supervisa los registros de auditoría, aprueba perfiles de manera simulada y monitorea la liquidez.",
    fideicomiso: "Estructura fiduciaria que supervisa la emisión de PACHA, asegurando que las operaciones estén respaldadas por el fideicomiso y requiriendo un quórum."
  },
  steps: [
    {
      title: "Validar perfil",
      description: "El inversor simula la validación de identidad requerida para operar."
    },
    {
      title: "Depositar fondos simulados",
      description: "El inversor carga saldo virtual en su cuenta para poder participar en la simulación."
    },
    {
      title: "Adquirir PACHA",
      description: "Compra directa de PACHA en el mercado primario (Genesis) deduciendo el saldo simulado y actualizando el Ledger."
    },
    {
      title: "Opera en mercado P2P demo",
      description: "Publica órdenes de venta o compra PACHA a otros usuarios en un entorno secundario simulado."
    }
  ],
  legal: {
    disclaimer1: "Demostración de software. Operaciones simuladas.",
    disclaimer2: "No constituye oferta pública ni recomendación de compra.",
    disclaimer3: "Sin conexiones a servicios de pago productivos."
  }
};
