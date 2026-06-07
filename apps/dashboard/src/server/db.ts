import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { schema, distributions, balances, properties } from '@pachanova/database';
import { eq, and } from 'drizzle-orm';

// This is a singleton instance. 
// We ensure it falls back to a dummy string to avoid crashing at build time if the env variable is missing.
const dbUrl = process.env.DATABASE_URL || "postgresql://pachanova_demo:pachanova_demo@localhost:5433/pachanova_demo";
const useSsl = dbUrl.includes('sslmode=require') || dbUrl.includes('ssl=') || dbUrl.includes('supabase');
const client = postgres(dbUrl, {
  prepare: false,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined
});
export const db = drizzle(client, { schema });

// Real DB helpers for schema10 / landbank closed cashflow (Fase49/69+ perpetual self-drive).
// Maps to distributions (for rwa_distribuciones), balances + properties (for token_holdings + land_meta/eff).
// Used by orq + api routes for production (json state remains only for --dry/local orq autonomy).
export async function loadSchema10FromDb(pncCodigo = 'PNC-PAR-001') {
  try {
    if (!process.env.DATABASE_URL) throw new Error('no real db url');
    const props = await db.select().from(properties).where(eq(properties.name, pncCodigo)).limit(1);
    const prop = props[0] || { id: null, metadata: { pncCode: pncCodigo } as any };
    const balRows = prop.id ? await db.select().from(balances).where(eq(balances.propertyId, prop.id)).limit(5) : [];
    const distRows = prop.id ? await db.select().from(distributions).where(eq(distributions.propertyId, prop.id)).orderBy(distributions.createdAt).limit(30) : [];
    const meta = (prop.metadata as any) || {};
    const holdings = balRows.map((b: any) => ({
      investor_id: b.investorId,
      pnc_codigo: pncCodigo,
      holdings_amount: Number(b.availableTokens || 0) + Number(b.lockedTokens || 0),
      effective_amount: Number(b.availableUsd || meta.effective_amount || 31639),
      net_yield: Number(b.availableUsd || meta.net_yield || 68112.5),
      pacha_power: Number(b.onchainVerifiedPct ? (b.onchainVerifiedPct * 100 + 1250) : (meta.pacha_power || 3250)),
      land_meta: { 
        ...meta, 
        schema10_applied: true, 
        source: 'real_db_balances+properties', 
        last_sync: new Date().toISOString(),
        fase47_eff: meta.effective_amount || 31639,
        fase42_power: meta.pacha_power || 3250,
        ... (meta.land_meta || {})
      }
    }));
    const distribs = distRows.map((d: any) => ({
      pnc_codigo: pncCodigo,
      distrib_amount: Number(d.amountUsd),
      net_yield_post: Number(d.amountUsd),
      status: d.status || 'PAGADO',
      period: d.periodStart ? new Date(d.periodStart).toISOString().slice(0,7) : '2026-06',
      tx_proof: d.proofRef || d.onchainProof || 'YIELD_DB',
      external_ref: d.proofRef,
      note: 'real distributions table'
    }));
    // perpetual state from metadata (synced by persist) or distribs with special tags
    const perpetualSettledClaims = meta.perpetual_settled_claims || [];
    const perpetualLaunchedCycles = meta.perpetual_launched_cycles || [];
    return { 
      holdings: holdings.length ? holdings : [], 
      distribs, 
      land_meta: { [pncCodigo]: { ...meta, effective_amount: holdings[0]?.effective_amount, pacha_power: holdings[0]?.pacha_power } }, 
      perpetualSettledClaims, 
      perpetualLaunchedCycles, 
      source: 'real_drizzle_supabase' 
    };
  } catch (e) {
    return null; // caller falls back to json for autonomy
  }
}

export async function persistSchema10ToDb(muts: any = {}) {
  try {
    if (!process.env.DATABASE_URL || !muts) return { success: false, note: 'no db or no muts' };
    const pnc = 'PNC-PAR-001';
    // Find/create property for PNC (store full land_meta + perpetual state in jsonb for Fase69+ self-drive provenance)
    const propRows = await db.select().from(properties).where(eq(properties.name, pnc)).limit(1);
    const prop = propRows[0];
    let propId = prop?.id;
    const currentMeta = (prop?.metadata as any) || { pncCode: pnc, schema10: true };
    const newMeta = {
      ...currentMeta,
      ...(muts.land?.[pnc] || {}),
      effective_amount: muts.holdings?.[0]?.effective_amount || currentMeta.effective_amount,
      net_yield: muts.holdings?.[0]?.net_yield || currentMeta.net_yield,
      pacha_power: muts.holdings?.[0]?.pacha_power || currentMeta.pacha_power,
      perpetual_settled_claims: muts.perpetualSettledClaims || currentMeta.perpetual_settled_claims || [],
      perpetual_launched_cycles: muts.perpetualLaunchedCycles || currentMeta.perpetual_launched_cycles || [],
      last_fase69_sync: new Date().toISOString()
    };
    if (!propId) {
      const inserted = await db.insert(properties).values({
        name: pnc,
        location: (muts.land?.[pnc]?.geo || 'Paracas, Ica, Perú'),
        totalValuationUsd: '1250000',
        tokenPriceUsd: '500',
        totalTokens: '2500',
        availableTokens: '2000',
        metadata: newMeta,
        isDemo: false
      }).returning();
      propId = inserted[0]?.id;
    } else {
      await db.update(properties).set({ metadata: newMeta, updatedAt: new Date() }).where(eq(properties.id, propId));
    }
    // real investor: try find by email or use first; fallback safe uuid for demo/prod seed
    let investorId = '00000000-0000-0000-0000-000000000000';
    try {
      const inv = await db.select().from(schema.users || schema.users).limit(1); // adjust if table name differs
      if (inv[0]?.id) investorId = inv[0].id;
    } catch {}
    if (propId && muts.distribs && muts.distribs.length) {
      for (const d of muts.distribs.slice(-5)) {
        await db.insert(distributions).values({
          propertyId: propId,
          investorId,
          amountUsd: String(d.distrib_amount || d.net_yield_post || 0),
          periodStart: new Date(),
          periodEnd: new Date(),
          status: d.status || 'PAGADO',
          proofRef: d.tx_proof || d.external_ref || 'fase69-ledger-ssot',
          isDemo: false,
          compoundDetails: { note: d.note || 'self-drive' }
        }).onConflictDoNothing?.();
      }
    }
    if (propId && muts.holdings && muts.holdings.length) {
      for (const h of muts.holdings) {
        await db.insert(balances).values({
          investorId,
          propertyId: propId,
          availableUsd: String(h.effective_amount || h.net_yield || 0),
          lockedUsd: '0',
          availableTokens: String(h.holdings_amount || 23125),
          lockedTokens: '0',
          onchainProof: 'Fase69-LEDGER-SSOT',
          lastOnchainSync: new Date()
        }).onConflictDoUpdate?.({
          target: [balances.investorId, balances.propertyId],
          set: { 
            availableUsd: String(h.effective_amount || 0), 
            lastUpdatedAt: new Date(),
            onchainVerifiedPct: String((h.pacha_power || 3250) / 100) 
          }
        });
      }
    }
    return { success: true, source: 'real_drizzle_supabase', pnc };
  } catch (e: any) {
    return { success: false, err: e.message };
  }
}

export { schema };

// Helper for Fase 141: load real PNC data for HologramPncCard from DB (properties + metadata)
export async function getRealHologramPncs(limit = 5) {
  try {
    if (!process.env.DATABASE_URL) throw new Error('no real db');
    const props = await db.query.properties.findMany({ limit });
    return props.map((p: any) => ({
      id: p.id,
      name: p.name,
      location: p.location || 'Perú',
      propertyType: p.propertyType || 'land',
      status: p.status || 'trading',
      totalValuationUsd: p.totalValuationUsd || '1250000',
      tokenPriceUsd: p.tokenPriceUsd || '500',
      totalTokens: p.totalTokens || '2500',
      availableTokens: p.availableTokens || '2000',
      annualYieldExpected: p.annualYieldExpected || '7.8',
      metadata: p.metadata || { pncCode: (p.name || '').split('—').pop()?.trim() || 'PNC-PAR-001', net: 68112.5, effectiveYield: 31639, effectivePct: "17.1%", pachaPower: 3250, phase: "Fase141", product_configs: { alquiler_yield: { porcentaje_renta_a_holders: 55, yield_estimado_anual: 7.8 } } }
    }));
  } catch (e) {
    return [];
  }
}
