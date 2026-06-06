"use client";

import React from "react";
import { Home, Building2, Hotel, Leaf, TrendingUp, Zap } from "lucide-react";

export interface PNC {
  id: string;
  code: string; // e.g. PAR, VIV
  label: string;
  fase: number;
  product_config: string; // Vivienda | Alquiler_Yield | Hotel | PAR | ...
  net: number; // real orq e.g. 68112.5
  eff: number;
  power: number; // e.g. 17.1
  sqm: number;
  yieldPct: number;
  claim: number; // e.g. 23125 for flywheel example
  orq: string; // SYNC | LIVE | ORQ
  masterNote?: string;
  color?: string;
}

function getIconForConfig(config: string) {
  const c = config.toLowerCase();
  if (c.includes("vivienda") || c.includes("viv")) return Home;
  if (c.includes("hotel") || c.includes("htl")) return Hotel;
  if (c.includes("alquiler") || c.includes("yield") || c.includes("yld")) return TrendingUp;
  if (c.includes("par") || c.includes("agro") || c.includes("leaf")) return Leaf;
  return Building2;
}

function getEmojiForConfig(config: string): string {
  const c = config.toLowerCase();
  if (c.includes("vivienda") || c.includes("viv")) return "🏠";
  if (c.includes("hotel") || c.includes("htl")) return "🏨";
  if (c.includes("alquiler") || c.includes("yield") || c.includes("yld")) return "📈";
  if (c.includes("par")) return "🌱";
  return "🏢";
}

export function HologramPncCard({ pnc }: { pnc: PNC }) {
  const Icon = getIconForConfig(pnc.product_config);
  const isMasterOverride = !!pnc.masterNote;
  const accent = pnc.color || "#C9A77B";

  // Simple layered SVG for "hologram 3D-like" land/property effect
  // Perspective polygons + grid + subtle scan for glass/holo feel. No heavy deps.
  const svgId = `holo-${pnc.id}`;

  return (
    <div
      className={`hologram-card p-3.5 flex flex-col h-full ${isMasterOverride ? "override-glow" : ""}`}
      data-pnc-id={pnc.id}
      data-product-config={pnc.product_config}
    >
      {/* Header: code, fase orq badges, label */}
      <div className="flex items-start justify-between mb-2.5">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono uppercase tracking-[2px] text-[13px] text-pn-gold font-medium">
              {pnc.code}
            </span>
            <span className="holo-badge text-pn-text-soft">FASE {pnc.fase}</span>
            <span className="holo-badge text-[#4B8FF0] border-[#4B8FF0]/30">{pnc.orq}</span>
            <span className="holo-badge text-[8px] bg-emerald-900/40 text-emerald-300 border-emerald-700/50">ORQ EXERCISED</span>
            <span className="holo-badge text-[8px] text-pn-sand/70 border-pn-sand/30">F16/21/53 bridge</span>
          </div>
          <div className="text-[15px] font-semibold tracking-[-0.2px] text-pn-text mt-px leading-none">
            {pnc.label}
          </div>
          <div className="text-[10px] text-pn-text-soft mt-0.5">{pnc.product_config}</div>
        </div>

        <div className="flex flex-col items-end text-right">
          <div className="text-[10px] text-pn-text-muted">ORQ REAL</div>
          <div style={{ color: accent }} className="font-mono text-xs">{pnc.net.toFixed(1)}</div>
        </div>
      </div>

      {/* HOLOGRAM LAND / PROPERTY VISUAL - layered SVG + glass overlay */}
      <div className="relative mb-3 h-[112px] rounded-xl border border-white/10 bg-[#07090b] overflow-hidden flex items-center justify-center">
        {/* Base terrain with 3D-ish perspective */}
        <svg
          viewBox="0 0 240 118"
          className="holo-land-svg absolute inset-0 w-full h-full"
          style={{ opacity: 0.95 }}
        >
          <defs>
            {/* Land fill gradient */}
            <linearGradient id={`${svgId}-land`} x1="0" y1="30" x2="0" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2a2f2a" />
              <stop offset="55%" stopColor="#181d19" />
              <stop offset="100%" stopColor="#111311" />
            </linearGradient>
            {/* Holographic iridescent overlay */}
            <linearGradient id={`${svgId}-holo`} x1="10%" y1="0%" x2="90%" y2="100%" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C9A77B" stopOpacity="0.0" />
              <stop offset="35%" stopColor="#C9A77B" stopOpacity="0.18" />
              <stop offset="48%" stopColor="#fff" stopOpacity="0.22" />
              <stop offset="62%" stopColor="#4B8FF0" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#C9A77B" stopOpacity="0.0" />
            </linearGradient>
            {/* Subtle grid pattern */}
            <pattern id={`${svgId}-grid`} width="14" height="14" patternUnits="userSpaceOnUse">
              <path d="M 14 0 L 0 0 0 14" fill="none" stroke="#C9A77B" strokeWidth="0.4" opacity="0.25" />
            </pattern>
          </defs>

          {/* Main land mass - isometric-ish trapezoid for 3D land feel */}
          <polygon
            points="28,92 212,92 192,38 48,38"
            fill={`url(#${svgId}-land)`}
            stroke="#3f463d"
            strokeWidth="1.5"
          />

          {/* Ownership / eff layer (scaled representation of power/eff) */}
          <polygon
            points={`38,86 ${170 + (pnc.power - 8) * 1.6},86 ${158 + (pnc.power - 8) * 0.9},48 52,48`}
            fill="none"
            stroke="#C9A77B"
            strokeWidth="2.5"
            opacity={0.55 + Math.min(pnc.power / 40, 0.35)}
          />

          {/* Hologram top sheen / facet */}
          <polygon
            points="48,38 192,38 178,52 62,52"
            fill={`url(#${svgId}-holo)`}
            opacity="0.65"
          />

          {/* Holographic grid overlay on terrain */}
          <polygon
            points="28,92 212,92 192,38 48,38"
            fill={`url(#${svgId}-grid)`}
            opacity="0.45"
          />

          {/* Horizon / depth lines for 3D */}
          <line x1="52" y1="56" x2="188" y2="56" stroke="#C9A77B" strokeWidth="0.6" opacity="0.3" />
          <line x1="58" y1="70" x2="182" y2="70" stroke="#C9A77B" strokeWidth="0.5" opacity="0.25" />

          {/* Subtle animated scanline for hologram tech effect */}
          <rect x="30" y="42" width="180" height="1.6" fill="#C9A77B" opacity="0.12">
            <animate
              attributeName="y"
              values="42;88;42"
              dur="3.8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.06;0.22;0.06"
              dur="3.8s"
              repeatCount="indefinite"
            />
          </rect>

          {/* Edge bevel highlights */}
          <polyline
            points="28,92 48,38 192,38 212,92"
            fill="none"
            stroke="#fff"
            strokeWidth="1"
            opacity="0.08"
          />
        </svg>

        {/* Centered product icon + subtle power ring */}
        <div className="absolute z-10 flex flex-col items-center justify-center">
          <div
            className="relative flex items-center justify-center w-9 h-9 rounded-full border border-white/20 bg-black/40"
            style={{ boxShadow: `0 0 18px ${accent}22` }}
          >
            <Icon className="w-4.5 h-4.5" style={{ color: accent }} />
            {/* small power indicator ring */}
            <div
              className="absolute inset-[-3px] rounded-full border"
              style={{
                borderColor: `${accent}55`,
                borderWidth: `${Math.max(1, pnc.power / 9)}px`,
              }}
            />
          </div>
          <div className="mt-1 text-lg leading-none drop-shadow" style={{ color: accent }}>
            {getEmojiForConfig(pnc.product_config)}
          </div>
        </div>

        {/* Corner orq badge overlay - enhanced live orq high-level bridge visibility */}
        <div className="absolute top-2 right-2 z-20 flex flex-col items-end gap-0.5">
          <span className="holo-badge text-[9px] bg-black/60 text-pn-gold border-pn-gold/40">
            {pnc.orq} • {pnc.fase}
          </span>
          <span className="holo-badge text-[7px] bg-emerald-950/70 text-emerald-200 border-emerald-800/60">EXERCISED</span>
        </div>
      </div>

      {/* Layered metadata: net / eff / power + yield */}
      <div className="grid grid-cols-4 gap-x-2 gap-y-1 text-[11px] tabular-nums">
        <div className="col-span-1">
          <div className="text-pn-text-soft/80 tracking-wider text-[9px]">NET</div>
          <div className="font-medium text-pn-text">{pnc.net.toLocaleString()}</div>
        </div>
        <div className="col-span-1">
          <div className="text-pn-text-soft/80 tracking-wider text-[9px]">EFF</div>
          <div className="font-medium text-pn-text">{pnc.eff.toLocaleString()}</div>
        </div>
        <div className="col-span-1">
          <div className="text-pn-text-soft/80 tracking-wider text-[9px]">PWR</div>
          <div className="font-semibold text-pn-gold">{pnc.power.toFixed(1)}%</div>
        </div>
        <div className="col-span-1 text-right">
          <div className="text-pn-text-soft/80 tracking-wider text-[9px]">YIELD</div>
          <div className="font-medium text-pn-sage">{pnc.yieldPct.toFixed(1)}%</div>
        </div>
      </div>

      <div className="mt-auto pt-2.5 flex items-center justify-between border-t border-white/10 text-[10px]">
        <span className="text-pn-text-muted font-mono">
          {pnc.sqm.toLocaleString()} m²
        </span>

        {isMasterOverride ? (
          <span className="text-pn-gold text-[9px] font-medium flex items-center gap-1">
            <Zap className="w-3 h-3" /> MASTER
          </span>
        ) : (
          <span className="text-pn-text-soft/70">ORQ SYNC</span>
        )}
      </div>

      {/* orq high-level bridge visibility: cycle notes + exercised (no core orq calls, pure UI) */}
      <div className="mt-1 text-[8px] text-emerald-400/80 font-mono tracking-tight border-t border-white/5 pt-1 flex justify-between">
        <span>ORQ CYCLE: exercised @ latest bridge</span>
        <span className="text-pn-sand/60">Fase refs: 16/21/36/47/51/53</span>
      </div>

      {/* Master note if present - sacred */}
      {pnc.masterNote && (
        <div className="mt-1.5 text-[9.5px] leading-snug text-pn-sand/75 border-l-2 border-pn-gold/40 pl-2 italic">
          {pnc.masterNote}
        </div>
      )}
    </div>
  );
}
