export function errorMessage(error: unknown, fallback = "Error interno") {
  return error instanceof Error ? error.message : fallback;
}
