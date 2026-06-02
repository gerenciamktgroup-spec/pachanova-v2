/**
 * Maestro Yield Adapter (Fase17 fleet)
 * Pulls exact attribution from core Panel Maestro (laboratorio-lihue-core Fase16: token_holdings + rwa_distribuciones with holdings snapshot, computePersonal).
 * For demo/real: in production use core supabase (with proper RLS token or service/bridge for cross project investor mapping by email/codigo).
 * Here: example computation matching core seed (12.5% on 185k AET-002 = 23125), and UI wiring for suggest back to core declare (closed loop via mail or direct).
 */

export interface MaestroYield {
  projectCode: string;
  montoTotal: number;
  myPct: number; // from holdings pct_owned
  myShare: number; // exact = pct/100 * monto
  declaredAt?: string;
  isExact: boolean;
}

export interface MaestroPortfolioYield {
  rendimientosTotal: number;
  distribs: MaestroYield[];
  source: 'core-maestro-fase16';
  lastSync: string;
}

/**
 * Demo/real data fetch.
 * In full: const supabase = createClient(CORE_URL, CORE_ANON or user token);
 * Then query token_holdings where inversor matches (map email or id), join distribs for project.
 * For now, returns exact from Fase16 seed example + note.
 */
export async function fetchMaestroYields(investorEmailOrId: string = 'demo', projectCode?: string): Promise<MaestroPortfolioYield> {
  // TODO: real cross fetch via core supabase anon (if RLS public read for authorized) or google-bridge export or orchestrator sync.
  // For this E2E bootstrap + demo: use the exact numbers from core seed (AET-002 185000 with 12.5% holder).
  const example: MaestroYield = {
    projectCode: projectCode || 'AET-002',
    montoTotal: 185000,
    myPct: 12.5,
    myShare: 23125, // exact (12.5/100 * 185000)
    declaredAt: '2026-06-02',
    isExact: true,
  };

  return {
    rendimientosTotal: example.myShare,
    distribs: [example],
    source: 'core-maestro-fase16',
    lastSync: new Date().toISOString(),
  };
}

/**
 * Suggest yield/payout to core (for mail closed loop or direct declare prefill in core Panel).
 * In full: POST to core edge or use bridge, or write to core via supabase with admin, or trigger mail-processor.
 * Here: logs the suggestion (simulates one-click from pachanova to core prefill).
 */
export function suggestYieldToCoreMaestro(yieldData: MaestroYield, investorEmail: string) {
  console.log('[MAESTRO YIELD SUGGEST TO CORE]', { ...yieldData, investorEmail, action: 'would prefill declare in core rwa_distribuciones + snapshot, trigger realtime in core UI' });
  // Future: use core's processEmailForCrossIntegration or direct supabase insert to distribs with suggest flag.
  return { success: true, message: 'Suggestion logged for core Panel Maestro (Fase16 closed loop). In real: opens prefilled declare in core proyectos tab.' };
}

export default { fetchMaestroYields, suggestYieldToCoreMaestro };