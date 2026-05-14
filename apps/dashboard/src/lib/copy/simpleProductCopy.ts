export interface CopyDefinition {
  short: string;
  medium: string;
  tooltip: string;
}

export const simpleProductCopy: Record<string, CopyDefinition> = {
  PACHA: {
    short: "Unidad digital de participación (Token).",
    medium: "El PACHA es un token simulado en esta plataforma que equivale matemáticamente a 0.1 metros cuadrados del activo.",
    tooltip: "1 PACHA = 0.1 m². Token de prueba."
  },
  Fideicomiso: {
    short: "Estructura legal de protección.",
    medium: "El fideicomiso asegura que el control jurídico del activo requiera consenso (quórum 2/3) antes de cualquier operación.",
    tooltip: "Entidad fiduciaria. Entorno demo simulado."
  },
  Ledger: {
    short: "Registro local inmutable.",
    medium: "El Ledger es una base de datos local que simula el comportamiento de una blockchain registrando todas las operaciones de forma inmutable.",
    tooltip: "Base de datos local de solo lectura."
  },
  Genesis: {
    short: "Primera emisión de tokens.",
    medium: "El flujo Genesis simula la adquisición inicial de los tokens desde la tesorería hacia las billeteras de los primeros inversores.",
    tooltip: "Simulación de primera emisión."
  },
  PendingCredentials: {
    short: "Credenciales pendientes.",
    medium: "El servicio externo (ej. MercadoPago) no se ha conectado por seguridad. El pago se simulará localmente.",
    tooltip: "Integración desactivada por seguridad."
  },
  PendingFoundry: {
    short: "Contratos desconectados.",
    medium: "La red blockchain local (Foundry) no está activa. Las transacciones se asientan solo en el Ledger local.",
    tooltip: "Simulación off-chain activa."
  },
  ExternalReady: {
    short: "Listo para conexión.",
    medium: "La plataforma está desarrollada para conectarse a proveedores reales, pero actualmente opera en modo local aislado.",
    tooltip: "Código listo, red aislada."
  },
  NoProductionConnections: {
    short: "Sin riesgo financiero.",
    medium: "Este entorno no tiene ninguna llave o acceso a bases de datos en producción ni pasarelas financieras.",
    tooltip: "Entorno 100% de demostración."
  },
  SandboxLocal: {
    short: "Entorno seguro de pruebas.",
    medium: "Estás operando en un entorno local (Sandbox) donde todas las transacciones son únicamente simuladas para propósitos de demostración.",
    tooltip: "Sandbox técnico local."
  },
  AuditLog: {
    short: "Registro de auditoría.",
    medium: "Historial trazable de cada acción realizada en la plataforma para asegurar total transparencia.",
    tooltip: "Log de eventos del sistema."
  },
  TokenOrderDemo: {
    short: "Orden de compra simulada.",
    medium: "Intento de adquisición registrado en la base local sin impacto en saldos reales ni llamadas externas.",
    tooltip: "Registro local de intento."
  },
  ValidarPerfil: {
    short: "Validar perfil",
    medium: "Requisito normativo (KYC) para conocer a tu cliente. Simulado en este entorno.",
    tooltip: "Proceso de KYC simulado."
  },
  DepositarFondos: {
    short: "Depositar fondos simulados",
    medium: "Añadir saldo virtual en USD para realizar operaciones en la plataforma.",
    tooltip: "Carga de saldo virtual."
  },
  AdquirirPacha: {
    short: "Adquirir PACHA",
    medium: "Obtener tokens PACHA equivalentes a m² del activo subyacente.",
    tooltip: "Compra simulada de tokens."
  },
  VerPortafolio: {
    short: "Ver portafolio",
    medium: "Revisar los tokens adquiridos, su equivalencia en m² y el saldo disponible.",
    tooltip: "Vista del balance y Ledger."
  },
  PublicarOrdenP2P: {
    short: "Publicar orden P2P",
    medium: "Crear una oferta de venta de tokens PACHA en el mercado secundario simulado.",
    tooltip: "Crear oferta en mercado P2P."
  },
  ComprarP2PDemo: {
    short: "Comprar en P2P demo",
    medium: "Adquirir tokens PACHA de otros inversores en el mercado secundario simulado.",
    tooltip: "Compra a otro usuario simulada."
  },
  AuditarOperacion: {
    short: "Auditar operación",
    medium: "Revisar la trazabilidad completa de cada acción a través del Audit Log y Ledger.",
    tooltip: "Registro inmutable simulado."
  },
  FideicomisoSupervisa: {
    short: "Fideicomiso supervisa",
    medium: "El fideicomiso garantiza que las operaciones de emisión estén correctamente respaldadas legalmente.",
    tooltip: "Supervisión institucional."
  }
};
