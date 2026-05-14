/**
 * PachaNova V2.0 - Core Mathematical Formulas & Conversions
 * 
 * Este archivo centraliza la lógica matemática del Sandbox para garantizar
 * consistencia en toda la UI, tests y APIs.
 * 
 * Reglas de Demo:
 * - 1 PACHA = 0.1 m²
 * - Oferta Máxima (Total Supply) = 500,000 PACHA
 * - Inmueble Subyacente = 5 hectáreas (50,000 m²)
 * - Precio Genesis = US$8.40
 */

export const DEMO_CONSTANTS = {
  SQM_PER_TOKEN: 0.1,
  TOTAL_SUPPLY_PACHA: 500000,
  TOTAL_LAND_SQM: 50000,
  GENESIS_PRICE_USD: 8.40,
};

/**
 * Convierte una cantidad de tokens PACHA a metros cuadrados equivalentes.
 */
export function tokensToSquareMeters(tokens: number): number {
  return tokens * DEMO_CONSTANTS.SQM_PER_TOKEN;
}

/**
 * Calcula el porcentaje de propiedad sobre la oferta total génesis.
 */
export function tokenOwnershipPercent(tokens: number): number {
  if (tokens <= 0) return 0;
  return (tokens / DEMO_CONSTANTS.TOTAL_SUPPLY_PACHA) * 100;
}

/**
 * Calcula el valor simulado de los tokens según el precio génesis o un precio de oráculo dinámico.
 */
export function tokenDemoValue(tokens: number, customPriceUsd?: number): number {
  const price = customPriceUsd !== undefined ? customPriceUsd : DEMO_CONSTANTS.GENESIS_PRICE_USD;
  return tokens * price;
}

/**
 * Formatea una cantidad de tokens PACHA con separadores de miles y sin decimales.
 */
export function formatPacha(tokens: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(tokens);
}

/**
 * Formatea metros cuadrados con separadores y 2 decimales si aplica.
 */
export function formatSquareMeters(sqm: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(sqm);
}

/**
 * Formatea un valor monetario en USD.
 */
export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
