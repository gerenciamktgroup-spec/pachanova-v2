export const TYPE_LABEL: Record<string, string> = {
  landbanking: "Landbanking",
  building_sale: "Edificio en venta",
  building_rent: "Edificio en renta",
  other: "Otro",
};

export const STATUS_LABEL: Record<string, string> = {
  draft: "Borrador",
  funding: "En captación",
  active: "En operación",
  exiting: "En salida",
  closed: "Cerrado",
  archived: "Archivado",
  open: "Ronda abierta",
  planned: "Ronda por abrir",
  paused: "Ronda pausada",
  published: "Disponible",
  reserved: "Reservado",
  sold: "Vendido",
  rented: "Alquilado",
  pending: "Pendiente",
  in_progress: "En curso",
  done: "Hecho",
  approved: "Aprobado",
  rejected: "Rechazado",
  in_review: "En revisión",
  committed: "Comprometido",
};

export function money(n: string | number, currency = "USD") {
  return `${currency} ${Number(n).toLocaleString("es-PE")}`;
}

export function coverOf(meta: unknown) {
  if (meta && typeof meta === "object" && "cover" in meta) {
    return String((meta as { cover?: string }).cover || "");
  }
  return "";
}
