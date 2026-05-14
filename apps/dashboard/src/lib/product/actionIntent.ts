export type ActionIntent =
  | "navigate"
  | "simulate"
  | "review"
  | "export"
  | "disabled"
  | "planned"
  | "pending_credentials"
  | "pending_foundry";

export function getActionIntentHint(intent: ActionIntent): string | null {
  switch (intent) {
    case "simulate":
      return "Operación Simulada Local";
    case "pending_credentials":
      return "Falta configuración de llaves productivas (ej. MP)";
    case "pending_foundry":
      return "Ejecución On-Chain pendiente de orquestación de red";
    case "disabled":
      return "Acción no disponible en el contexto actual";
    case "planned":
      return "Característica programada para futuras iteraciones";
    default:
      return null;
  }
}
