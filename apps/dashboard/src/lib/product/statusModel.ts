export type SystemStatus = "GO" | "READY-BUT-DISABLED" | "PENDING_CREDENTIALS" | "PENDING_FOUNDRY" | "NO-GO" | "SIMULATED" | "DISABLED";

export const systemStatusMap: Record<string, SystemStatus> = {
  "Demo Local": "GO",
  "Internal Integration": "GO",
  "External Integrations": "READY-BUT-DISABLED",
  "MercadoPago": "PENDING_CREDENTIALS",
  "Contracts": "PENDING_FOUNDRY",
  "Production/Staging": "NO-GO"
};

export function getSystemStatus(key: string): SystemStatus {
  return systemStatusMap[key] || "DISABLED";
}

export function getStatusCopy(status: SystemStatus): string {
  const dictionary: Record<SystemStatus, string> = {
    "GO": "Activo y Seguro",
    "READY-BUT-DISABLED": "Listo pero Desactivado",
    "PENDING_CREDENTIALS": "Credenciales Pendientes",
    "PENDING_FOUNDRY": "Trust Anchor Pendiente",
    "NO-GO": "Desconectado (Aislamiento)",
    "SIMULATED": "Simulación Local",
    "DISABLED": "No Disponible"
  };
  return dictionary[status];
}

export function getStatusBadgeVariant(status: SystemStatus): string {
  const dictionary: Record<SystemStatus, string> = {
    "GO": "bg-pn-success/10 text-pn-success border-pn-success/20",
    "READY-BUT-DISABLED": "bg-pn-blue/10 text-pn-blue border-pn-blue/20",
    "PENDING_CREDENTIALS": "bg-pn-warning/10 text-pn-warning border-pn-warning/20",
    "PENDING_FOUNDRY": "bg-pn-warning/10 text-pn-warning border-pn-warning/20",
    "NO-GO": "bg-pn-danger/10 text-pn-danger border-pn-danger/20",
    "SIMULATED": "bg-pn-surface-strong text-pn-text-muted border-pn-border",
    "DISABLED": "bg-pn-surface-strong text-pn-text-muted border-pn-border"
  };
  return dictionary[status];
}
