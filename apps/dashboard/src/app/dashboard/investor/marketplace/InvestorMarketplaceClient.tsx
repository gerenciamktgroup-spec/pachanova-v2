"use client";

import { useState, useEffect, useCallback } from "react";

type Property = {
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
  imageUrl: string | null;
  metadata: any;
};

const STATUS_LABELS: Record<string, { label: string; color: string; dot: string }> = {
  coming_soon: { label: "Próximamente", color: "text-amber-400", dot: "bg-amber-400" },
  funding: { label: "Captación Abierta", color: "text-blue-400", dot: "bg-blue-400 animate-pulse" },
  funded: { label: "Fondeado", color: "text-purple-400", dot: "bg-purple-400" },
  trading: { label: "En Trading", color: "text-emerald-400", dot: "bg-emerald-400 animate-pulse" },
  liquidated: { label: "Liquidado", color: "text-gray-400", dot: "bg-gray-400" },
};

const TYPE_LABELS: Record<string, string> = {
  land: "Terreno Agrícola",
  residential: "Residencial",
  hotel: "Hotel / Hospedaje",
  rental: "Renta Comercial",
};

const TYPE_ICONS: Record<string, string> = {
  land: "🌾",
  residential: "🏠",
  hotel: "🏨",
  rental: "🏢",
};

const COUNTRY_FLAGS: Record<string, string> = {
  Paracas: "🇵🇪",
  Lima: "🇵🇪",
  Chilca: "🇵🇪",
  "San Bartolo": "🇵🇪",
  Perú: "🇵🇪",
};

function getFlag(location: string) {
  for (const [key, flag] of Object.entries(COUNTRY_FLAGS)) {
    if (location.includes(key)) return flag;
  }
  return "🌎";
}

export default function InvestorMarketplaceClient() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"valuation" | "apy" | "newest">("newest");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const fetchProperties = useCallback(async () => {
    try {
      const res = await fetch("/api/landbank", { cache: "no-store" });
      const data = await res.json();
      // Only show public-facing statuses
      const visible = (data.properties || []).filter(
        (p: Property) => p.status !== "liquidated"
      );
      setProperties(visible);
    } catch (e) {
      console.error("Error fetching marketplace:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const filtered = properties
    .filter((p) => activeFilter === "all" || p.status === activeFilter)
    .sort((a, b) => {
      if (sortBy === "valuation")
        return Number(b.totalValuationUsd) - Number(a.totalValuationUsd);
      if (sortBy === "apy")
        return Number(b.annualYieldExpected || 0) - Number(a.annualYieldExpected || 0);
      return new Date(b.status).getTime() - new Date(a.status).getTime();
    });

  const liveCount = properties.filter((p) =>
    ["funding", "trading"].includes(p.status)
  ).length;

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#0f172a] to-[#0a111f] border border-[#c5a46d]/20 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-[#c5a46d]">
            {properties.length}
          </div>
          <div className="text-[11px] text-white/40 mt-1">Activos Totales</div>
        </div>
        <div className="bg-gradient-to-br from-[#0f172a] to-[#0a111f] border border-emerald-500/20 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-emerald-400">{liveCount}</div>
          <div className="text-[11px] text-white/40 mt-1">En Vivo Ahora</div>
        </div>
        <div className="bg-gradient-to-br from-[#0f172a] to-[#0a111f] border border-blue-500/20 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">
            {properties.length > 0
              ? (
                  properties.reduce(
                    (sum, p) => sum + Number(p.annualYieldExpected || 0),
                    0
                  ) / properties.length
                ).toFixed(1)
              : "—"}
            %
          </div>
          <div className="text-[11px] text-white/40 mt-1">APY Promedio</div>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "Todos" },
            { key: "coming_soon", label: "Próximamente" },
            { key: "funding", label: "Captación" },
            { key: "funded", label: "Fondeado" },
            { key: "trading", label: "Trading" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                activeFilter === f.key
                  ? "border-[#c5a46d]/60 bg-[#c5a46d]/10 text-[#c5a46d]"
                  : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-[#0a111f] border border-white/10 text-white/60 text-xs rounded-lg px-3 py-1.5 outline-none"
        >
          <option value="newest">Más recientes</option>
          <option value="valuation">Mayor valuación</option>
          <option value="apy">Mayor APY</option>
        </select>
      </div>

      {/* Property Grid */}
      {loading ? (
        <div className="text-center py-16 text-white/30">
          Cargando marketplace...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          No hay activos disponibles en este momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((prop) => {
            const status = STATUS_LABELS[prop.status] || STATUS_LABELS.coming_soon;
            const soldTokens =
              Number(prop.totalTokens) - Number(prop.availableTokens);
            const soldPct =
              Number(prop.totalTokens) > 0
                ? Math.round((soldTokens / Number(prop.totalTokens)) * 100)
                : 0;
            const isInvestable = ["funding", "coming_soon"].includes(
              prop.status
            );

            return (
              <div
                key={prop.id}
                className="group bg-[#0a111f] border border-white/10 hover:border-white/25 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/50 cursor-pointer"
                onClick={() => setSelectedProperty(prop)}
              >
                {/* Card Top — Gradient Banner */}
                <div className="relative h-40 bg-gradient-to-br from-[#0f1f3d] to-[#060d1f] flex items-center justify-center overflow-hidden">
                  <div className="text-7xl opacity-20 group-hover:opacity-30 transition-opacity">
                    {TYPE_ICONS[prop.propertyType] || "🏗️"}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a111f] to-transparent" />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    <span className={`text-[10px] font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 text-xs text-white/50">
                    {getFlag(prop.location)} {prop.location}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase tracking-wider text-white/30 border border-white/10 px-2 py-0.5 rounded">
                        {TYPE_LABELS[prop.propertyType] || prop.propertyType}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#c5a46d] transition-colors">
                      {prop.name}
                    </h3>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-[9px] text-white/30 uppercase tracking-wider mb-0.5">
                        Valuación
                      </div>
                      <div className="text-sm font-bold text-white">
                        ${(Number(prop.totalValuationUsd) / 1000).toFixed(0)}K
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] text-white/30 uppercase tracking-wider mb-0.5">
                        APY Est.
                      </div>
                      <div className="text-sm font-bold text-emerald-400">
                        {prop.annualYieldExpected || "—"}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] text-white/30 uppercase tracking-wider mb-0.5">
                        Token
                      </div>
                      <div className="text-sm font-bold text-[#c5a46d]">
                        ${Number(prop.tokenPriceUsd).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {Number(prop.totalTokens) > 0 && (
                    <div>
                      <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
                        <span>
                          {soldPct}% captado •{" "}
                          {Number(prop.availableTokens).toLocaleString()} tokens
                          disp.
                        </span>
                        <span>{soldPct}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${soldPct}%`,
                            background:
                              soldPct > 80
                                ? "linear-gradient(90deg, #10b981, #059669)"
                                : "linear-gradient(90deg, #c5a46d, #d4b47d)",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="pt-2 border-t border-white/5">
                    {isInvestable ? (
                      <a
                        href={`/dashboard/investor/invest`}
                        onClick={(e) => e.stopPropagation()}
                        className="block w-full text-center py-2.5 bg-[#c5a46d] hover:bg-[#d4b47d] text-black font-semibold text-sm rounded-lg transition-colors"
                      >
                        Invertir Ahora →
                      </a>
                    ) : prop.status === "trading" ? (
                      <a
                        href={`/dashboard/investor/marketplace`}
                        onClick={(e) => e.stopPropagation()}
                        className="block w-full text-center py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 font-semibold text-sm rounded-lg transition-colors"
                      >
                        Comprar en P2P →
                      </a>
                    ) : (
                      <div className="text-center text-xs text-white/30 py-2.5">
                        No disponible para inversión aún
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedProperty(null)}
        >
          <div
            className="bg-[#0a111f] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">
                    {TYPE_ICONS[selectedProperty.propertyType] || "🏗️"}
                  </span>
                  <h2 className="text-xl font-bold text-white">
                    {selectedProperty.name}
                  </h2>
                </div>
                <p className="text-sm text-white/40">
                  {getFlag(selectedProperty.location)}{" "}
                  {selectedProperty.location} •{" "}
                  {TYPE_LABELS[selectedProperty.propertyType]}
                </p>
              </div>
              <button
                onClick={() => setSelectedProperty(null)}
                className="text-white/30 hover:text-white text-xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                {
                  label: "Valuación Total",
                  val: `$${Number(selectedProperty.totalValuationUsd).toLocaleString()}`,
                  color: "text-[#c5a46d]",
                },
                {
                  label: "APY Estimado",
                  val: `${selectedProperty.annualYieldExpected || "—"}%`,
                  color: "text-emerald-400",
                },
                {
                  label: "Precio Token",
                  val: `$${Number(selectedProperty.tokenPriceUsd).toFixed(2)}`,
                  color: "text-white",
                },
                {
                  label: "Tokens Disponibles",
                  val: Number(selectedProperty.availableTokens).toLocaleString(),
                  color: "text-white",
                },
                {
                  label: "Total Tokens",
                  val: Number(selectedProperty.totalTokens).toLocaleString(),
                  color: "text-white",
                },
                {
                  label: "Estado",
                  val:
                    STATUS_LABELS[selectedProperty.status]?.label || selectedProperty.status,
                  color:
                    STATUS_LABELS[selectedProperty.status]?.color || "text-white",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/[0.03] border border-white/5 rounded-xl p-3"
                >
                  <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                    {item.label}
                  </div>
                  <div className={`text-lg font-bold ${item.color}`}>
                    {item.val}
                  </div>
                </div>
              ))}
            </div>

            {selectedProperty.metadata?.execute_proof && (
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4 mb-4 text-xs">
                <div className="text-emerald-400 font-bold mb-2">
                  ✓ Verificado On-Chain
                </div>
                <div className="font-mono text-white/60 break-all">
                  {selectedProperty.metadata.execute_proof.txHash}
                </div>
                <div className="text-white/40 mt-1">
                  Bloque #{selectedProperty.metadata.execute_proof.blockNum}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {["funding", "coming_soon"].includes(selectedProperty.status) && (
                <a
                  href="/dashboard/investor/invest"
                  className="flex-1 text-center py-3 bg-[#c5a46d] hover:bg-[#d4b47d] text-black font-semibold rounded-xl transition-colors"
                >
                  Invertir Ahora →
                </a>
              )}
              {selectedProperty.status === "trading" && (
                <a
                  href="/dashboard/investor/marketplace"
                  className="flex-1 text-center py-3 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-semibold rounded-xl transition-colors hover:bg-emerald-600/30"
                >
                  Mercado P2P →
                </a>
              )}
              <button
                onClick={() => setSelectedProperty(null)}
                className="px-5 border border-white/10 hover:border-white/20 text-white/50 hover:text-white rounded-xl transition-colors text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
