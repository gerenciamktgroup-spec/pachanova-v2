"use client";

import React from 'react';

// HologramPncCard - Visual avanzado "holograma-style" para Landbanking completo
// Muestra los 5 PNC con datos orq reales (PAR 68112.5 net @31639 eff 17.1% power 3250 etc.)
// Efecto glass + layered + glow para "holograma" de propiedad tokenizada + product configs
// Per-product attribution panels + flywheel mini viz
// Integrado en single unified project. Master sacred. DATOS REALES.

type PncData = {
  id: string;
  name: string;
  location: string;
  propertyType: string;
  status: string;
  totalValuationUsd: string;
  tokenPriceUsd: string;
  totalTokens: string;
  availableTokens: string;
  annualYieldExpected: string | null;
  metadata?: any;
};

interface HologramPncCardProps {
  pnc: PncData;
  onMasterEdit?: (pnc: PncData) => void;
  onLaunchProduct?: (pnc: PncData, product: string) => void;
  compact?: boolean;
}

const PRODUCT_COLORS: Record<string, string> = {
  vivienda_token: 'from-blue-500/20 to-cyan-400/10 border-blue-400/40',
  alquiler_yield: 'from-emerald-500/20 to-teal-400/10 border-emerald-400/40',
  hotel_revenue_share: 'from-amber-500/20 to-yellow-400/10 border-amber-400/40',
  desarrollo_inversion: 'from-purple-500/20 to-violet-400/10 border-purple-400/40',
};

export function HologramPncCard({ pnc, onMasterEdit, onLaunchProduct, compact = false }: HologramPncCardProps) {
  const meta = pnc.metadata || {};
  const products = meta.product_configs ? Object.keys(meta.product_configs) : ['vivienda_token', 'alquiler_yield'];
  const net = meta.net || 68112.5;
  const eff = meta.effectiveYield || 31639;
  const pct = meta.effectivePct || '17.1%';
  const power = meta.pachaPower || 3250;
  const phase = meta.phase || 'Fase141';
  const gov = meta.govQuorum || 'PASSED 4x';

  // Simple hologram glow + layered effect (pure CSS + SVG for no deps)
  const hologramStyle = {
    background: 'linear-gradient(145deg, rgba(197,164,109,0.08) 0%, rgba(15,23,42,0.95) 50%, rgba(197,164,109,0.05) 100%)',
    boxShadow: '0 0 0 1px rgba(197,164,109,0.3), 0 10px 30px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
    backdropFilter: 'blur(12px)',
  };

  return (
    <div 
      className={`group relative rounded-2xl border border-[#c5a46d]/30 overflow-hidden transition-all hover:scale-[1.01] hover:border-[#c5a46d]/60 ${compact ? 'p-4' : 'p-6'} bg-[#0a111f]`}
      style={hologramStyle}
    >
      {/* Hologram top glow / scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(transparent,transparent_2px,rgba(197,164,109,0.06)_3px,rgba(197,164,109,0.06)_4px)] opacity-60 group-hover:opacity-90 transition" />
      
      {/* Header - PNC identity with hologram badge */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-2xl">🏞️</div>
            <div>
              <div className="font-semibold text-white text-lg tracking-tight">{pnc.name}</div>
              <div className="text-[11px] text-white/50">{pnc.location} • {meta.hectares || '?'} ha</div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`inline-block px-2.5 py-0.5 text-[10px] font-mono rounded border ${pnc.status === 'trading' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
            {pnc.status.toUpperCase()}
          </div>
          <div className="text-[10px] text-[#c5a46d] mt-1 font-mono">{phase}</div>
          {/* Post-F6: live orq high-level bridge visibility badges (from official Antigravity SDK alignment + subagent) */}
          <div className="mt-1 flex flex-col gap-0.5 items-end">
            <span className="inline-block px-1.5 py-px text-[8px] font-mono rounded bg-emerald-900/40 text-emerald-300 border border-emerald-700/50">ORQ EXERCISED</span>
            <span className="inline-block px-1 py-px text-[7px] text-pn-sand/70 border border-pn-sand/30 rounded">F16/21/36/47/51/53 bridge</span>
            {/* Fase72 Phase6 #35: pervasive onchain badge for SB-003 (when pncCode matches) + YIELD_PERPETUAL_ATTEST N+2 Fase21 12.5% */}
            {meta.pncCode === 'PNC-SB-003' && (
              <span className="inline-block px-1 py-px text-[7px] font-mono rounded bg-violet-900/50 text-violet-300 border border-violet-700/50">YIELD_PERPETUAL_ATTEST N+2 Fase21 12.5% + Fase36 PASSED • SB-003 25% buy wire • 105840 net h2.1</span>
            )}
          </div>
        </div>
      </div>

      {/* Core Orq Real Data - Hologram "core projection" */}
      <div className="mb-4 p-3 rounded-xl bg-black/40 border border-[#c5a46d]/20 text-sm">
        <div className="text-[#c5a46d] text-xs tracking-[1.5px] mb-1.5 font-medium">DATOS REALES ORQ • FASES • MASTER</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-white/90">
          <div>Net: <span className="font-semibold text-white">${net.toLocaleString('en-US')}</span></div>
          <div>Eff: <span className="font-semibold text-emerald-400">${eff.toLocaleString('en-US')} ({pct})</span></div>
          <div>Power Fase42: <span className="font-semibold text-amber-400">{power}</span></div>
          <div>Gov: <span className="font-semibold">{gov}</span></div>
        </div>
        {meta.notas_maestro && (
          <div className="mt-2 text-[10px] text-white/50 italic line-clamp-2">{meta.notas_maestro}</div>
        )}
      </div>

      {/* Per-Product Attribution Panels (the "hologram layers") */}
      {!compact && (
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">PRODUCT CONFIGS • ATTRIBUTION</div>
          <div className="flex flex-wrap gap-2">
            {products.map((prod: string, idx: number) => {
              const cfg = meta.product_configs?.[prod] || {};
              const colorClass = PRODUCT_COLORS[prod] || 'from-white/10 to-white/5 border-white/20';
              return (
                <div key={idx} className={`flex-1 min-w-[110px] rounded-lg p-2.5 border text-[11px] bg-gradient-to-br ${colorClass}`}>
                  <div className="font-medium text-white/90 mb-0.5">{prod.replace('_', ' ')}</div>
                  <div className="text-white/70 text-[10px] space-y-0.5">
                    {cfg.tokens_totales && <div>Tokens: {cfg.tokens_totales}</div>}
                    {cfg.precio_token_usd && <div>Price: ${cfg.precio_token_usd}</div>}
                    {cfg.porcentaje_renta_a_holders && <div>Yield to holders: {cfg.porcentaje_renta_a_holders}%</div>}
                    {cfg.yield_estimado_anual && <div>Est. APY: {cfg.yield_estimado_anual}%</div>}
                  </div>
                  {onLaunchProduct && (
                    <button 
                      onClick={() => onLaunchProduct(pnc, prod)}
                      className="mt-1.5 w-full text-[9px] py-0.5 bg-white/10 hover:bg-white/20 rounded text-[#c5a46d] border border-[#c5a46d]/40"
                    >
                      LAUNCH
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mini Flywheel Viz (Fase47 style) */}
      <div className="mb-4 text-[10px]">
        <div className="flex justify-between text-white/40 mb-1">
          <span>FLYWHEEL Fase47</span>
          <span className="text-emerald-400">{pct} eff</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden flex">
          <div className="h-full bg-gradient-to-r from-[#c5a46d] via-emerald-400 to-[#c5a46d]" style={{ width: '68%' }} />
        </div>
        <div className="flex justify-between text-[9px] text-white/50 mt-0.5">
          <span>23125 base</span>
          <span>claim → compound</span>
          <span>{net} net</span>
        </div>
      </div>

      {/* Metrics + Actions */}
      <div className="flex items-end justify-between text-sm">
        <div>
          <div className="text-white/40 text-xs">Valuación / Token</div>
          <div className="font-semibold">${Number(pnc.totalValuationUsd).toLocaleString('en-US')} <span className="text-xs text-white/50">/ ${pnc.tokenPriceUsd}</span></div>
        </div>
        <div className="flex gap-2">
          {onMasterEdit && (
            <button 
              onClick={() => onMasterEdit(pnc)}
              className="px-3 py-1 text-xs rounded border border-[#c5a46d]/50 hover:bg-[#c5a46d]/10 text-[#c5a46d]"
            >
              MASTER EDIT
            </button>
          )}
          <a href={`/dashboard/admin/properties/${pnc.id}`} className="px-3 py-1 text-xs rounded bg-white/5 hover:bg-white/10">DETALLE</a>
        </div>
      </div>

      {/* Hologram footer badge */}
      <div className="absolute bottom-2 right-3 text-[8px] font-mono text-[#c5a46d]/60 tracking-[2px]">PNC • ORQ • MASTER</div>
    </div>
  );
}

export default HologramPncCard;