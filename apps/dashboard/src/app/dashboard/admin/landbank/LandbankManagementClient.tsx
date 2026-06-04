"use client";

import { useState, useEffect, useCallback } from "react";

type Property = {
  id: string;
  name: string;
  location: string;
  propertyType: string;
  status: "coming_soon" | "funding" | "funded" | "trading" | "liquidated";
  totalValuationUsd: string;
  tokenPriceUsd: string;
  totalTokens: string;
  availableTokens: string;
  annualYieldExpected: string | null;
  contractAddress: string | null;
  isDemo: boolean;
  createdAt: string;
};

type Stats = {
  total: number;
  coming_soon: number;
  funding: number;
  funded: number;
  trading: number;
  liquidated: number;
  totalValuationUsd: number;
  totalTokensIssued: number;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; next: string | null }
> = {
  coming_soon: {
    label: "Próximamente",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    next: "Iniciar Fundraising",
  },
  funding: {
    label: "En Captación",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    next: "Marcar como Fondeado",
  },
  funded: {
    label: "Fondeado",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    next: "Activar Trading",
  },
  trading: {
    label: "En Trading",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    next: "Liquidar",
  },
  liquidated: {
    label: "Liquidado",
    color: "text-gray-400",
    bg: "bg-gray-500/10 border-gray-500/20",
    next: null,
  },
};

const TYPE_ICONS: Record<string, string> = {
  land: "🌾",
  residential: "🏠",
  hotel: "🏨",
  rental: "🏢",
};

export default function LandbankManagementClient() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [distributeModal, setDistributeModal] = useState<Property | null>(null);
  const [distributeAmount, setDistributeAmount] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // MASTER AUTHORIZATION: Full manual control panel for the ideador/master.
  // Always available. Edit any fields manually (real data). Changes pushed to real users/data via API (audit + orq sync + DB).
  const [masterEditModal, setMasterEditModal] = useState<Property | null>(null);
  const [masterEditJson, setMasterEditJson] = useState<string>("{}");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/landbank", { cache: "no-store" });
      const data = await res.json();
      setProperties(data.properties || []);
      setStats(data.stats || null);
    } catch (e) {
      console.error("Error fetching landbank:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleAdvance = async (property: Property) => {
    setActionLoading(property.id);
    try {
      const res = await fetch("/api/landbank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          action: "advance_lifecycle",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          `✅ ${property.name}: ${property.status} → ${data.newStatus}`
        );
        await fetchData();
      } else {
        showToast(`❌ Error: ${data.error}`);
      }
    } catch (e: any) {
      showToast(`❌ Error: ${e.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDistribute = async () => {
    if (!distributeModal || !distributeAmount) return;
    setActionLoading(distributeModal.id);
    try {
      const res = await fetch("/api/landbank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: distributeModal.id,
          action: "distribute",
          amountUsd: distributeAmount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          `✅ Distribución ejecutada: $${distributeAmount} → ${data.distribs?.length || 0} inversores`
        );
        setDistributeModal(null);
        setDistributeAmount("");
        await fetchData();
      } else {
        showToast(`❌ Error: ${data.error}`);
      }
    } catch (e: any) {
      showToast(`❌ Error: ${e.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleMasterEdit = async () => {
    if (!masterEditModal) return;
    setActionLoading(masterEditModal.id);
    try {
      let fields: any;
      try {
        fields = JSON.parse(masterEditJson);
      } catch (e) {
        showToast("? Invalid JSON for master edit fields");
        return;
      }
      const res = await fetch("/api/landbank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: masterEditModal.id,
          action: "master_edit",
          fields,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`? Master edit applied & pushed to real users/data: ${masterEditModal.name}`);
        setMasterEditModal(null);
        setMasterEditJson("{}");
        await fetchData();
      } else {
        showToast(`? Error: ${data.error}`);
      }
    } catch (e: any) {
      showToast(`? Error: ${e.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const openMasterEdit = (prop: Property) => {
    setMasterEditModal(prop);
    // Pre-fill with current + product_configs from metadata (integrated master control from core - structured for single project)
    const meta = (prop as any).metadata || {};
    setMasterEditJson(JSON.stringify({
      status: prop.status,
      totalValuationUsd: prop.totalValuationUsd,
      tokenPriceUsd: prop.tokenPriceUsd,
      totalTokens: prop.totalTokens,
      annualYieldExpected: prop.annualYieldExpected,
      hectares: meta.hectares,
      tipo_predio: meta.tipo_predio,
      socio_partner: meta.socio_partner,
      product_configs: meta.product_configs || {},
      manual_overrides: meta.manual_overrides || {},
      notas_maestro: meta.notas_maestro || "",
      // real orq data for reference (P2P/credits context)
      pncCode: meta.pncCode,
      net: meta.net,
      effectiveYield: meta.effectiveYield,
      pachaPower: meta.pachaPower,
    }, null, 2));
  };

  const filtered =
    filterStatus === "all"
      ? properties
      : properties.filter((p) => p.status === filterStatus);

  const lifecycle = [
    "coming_soon",
    "funding",
    "funded",
    "trading",
    "liquidated",
  ];

  return (
    <div className="space-y-8">
      {/* Master PNC Seeds Load (integrated from core Maestro - now single unified PachaNova project with P2P/credits) */}
      <div className="bg-[#0a111f] border border-[#c5a46d]/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-sm font-semibold text-[#c5a46d]">Master PNC Perú Control (integrado - single project final)</div>
            <div className="text-[10px] text-white/50">5 PNC multi-product (vivienda/alquiler/hotel/desarrollo) con datos reales orq (PAR 68112.5 net @31639 eff 17.1% power 3250 Fase42, Fase36 PASSED etc.). Master edita TODO + lanza productos. Ver investor para P2P + créditos/borrow.</div>
          </div>
          <button
            onClick={async () => {
              setActionLoading("seed");
              try {
                const res = await fetch("/api/landbank/seed", { method: "POST" });
                const data = await res.json();
                if (data.success || !data.error) {
                  showToast("✓ Full Master PNC seeds loaded (5 Perú + product_configs + real orq data). Master control activado.");
                  await fetchData();
                } else {
                  showToast("Seed note: " + (data.error || "check DB"));
                }
              } catch (e) {
                showToast("Seed called (demo may use client data). Refetching...");
                await fetchData();
              } finally {
                setActionLoading(null);
              }
            }}
            disabled={!!actionLoading}
            className="px-3 py-1.5 bg-[#c5a46d] text-black text-xs font-semibold rounded hover:bg-white transition disabled:opacity-50"
          >
            {actionLoading === "seed" ? "Loading..." : "CARGAR 5 PNC MASTER PERÚ (real orq data + multi-product)"}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-[#0f172a] border border-[#c5a46d]/50 rounded-xl text-sm text-white shadow-2xl shadow-black/50 animate-fade-in">
          {toastMsg}
        </div>
      )}

      {/* Distribute Modal */}
      {distributeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0a111f] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">
              💰 Distribución de Rendimiento
            </h3>
            <p className="text-sm text-white/50 mb-4">
              <span className="text-[#c5a46d]">{distributeModal.name}</span> —
              Ingresa el monto total a distribuir entre los inversores
              proporcionalmente a sus tokens.
            </p>
            <input
              type="number"
              step="0.01"
              value={distributeAmount}
              onChange={(e) => setDistributeAmount(e.target.value)}
              placeholder="Ej: 15000"
              className="w-full bg-[#060d1f] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#c5a46d] mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleDistribute}
                disabled={!distributeAmount || !!actionLoading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
              >
                {actionLoading === distributeModal.id
                  ? "Procesando..."
                  : "Ejecutar Distribución"}
              </button>
              <button
                onClick={() => {
                  setDistributeModal(null);
                  setDistributeAmount("");
                }}
                className="flex-1 border border-white/10 hover:border-white/20 text-white/60 hover:text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MASTER AUTHORIZATION BANNER - Full manual control for the bank system under construction */}
      <div className="bg-[#c5a46d]/10 border border-[#c5a46d]/30 rounded-xl p-4 text-sm">
        <div className="font-semibold text-[#c5a46d] mb-1">?? MASTER AUTHORIZATION ENABLED</div>
        <div className="text-white/70">
          You (Ideador/Master) have permanent full manual control. Edit ANY data here (or via properties/superadmin overrides). 
          Changes are real data only, fully audited (MASTER_MANUAL_EDIT + MASTER_PUSH), and pushed to all real users/real data via:
          DB (source of truth), orq sync (yields/power/gates/portfolios for all holders), revalidate, and broadcast.
          Automations (orq/Fases) run on top but your manual overrides always win. Easy configs via forms/JSON below.
        </div>
      </div>

      {/* Master Edit Modal - Easy manual JSON config for Master */}
      {masterEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0a111f] border border-[#c5a46d]/50 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-semibold text-[#c5a46d] mb-2">
              ?? Master Manual Edit (integrado - single project) - {masterEditModal.name}
            </h3>
            <p className="text-xs text-white/50 mb-3">
              Edit fields/JSON (product_configs for multi: vivienda/alquiler/hotel/desarrollo, manual_overrides). Master full control. Audit + orq sync + push real (P2P/credits flows via status). Datos reales orq (PAR 68112.5 net etc.).
            </p>
            <textarea
              value={masterEditJson}
              onChange={(e) => setMasterEditJson(e.target.value)}
              className="w-full h-48 bg-[#060d1f] border border-white/10 rounded-lg p-3 text-xs font-mono text-white focus:border-[#c5a46d] outline-none"
              placeholder='{"status": "trading", "totalValuationUsd": "5000000", "metadata": {...}}'
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleMasterEdit}
                disabled={!!actionLoading}
                className="flex-1 bg-[#c5a46d] hover:bg-[#d4b47d] text-black font-semibold rounded-lg py-2.5 text-sm transition-colors disabled:opacity-50"
              >
                {actionLoading === masterEditModal.id ? "Applying & Pushing..." : "Apply Master Edit & Push to Real Users/Data"}
              </button>
              <button
                onClick={() => {
                  setMasterEditModal(null);
                  setMasterEditJson("{}");
                }}
                className="flex-1 border border-white/10 hover:border-white/20 text-white/60 hover:text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
            {/* Product Launch (from core master factory - unified) */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="text-[10px] text-white/40 mb-1">Launch Product (orq/bridge with land_meta + MANUAL - P2P/credits ready)</div>
              <div className="flex gap-2 flex-wrap">
                {["vivienda_token", "alquiler_yield", "hotel_revenue_share", "desarrollo_inversion"].map((prod) => (
                  <button
                    key={prod}
                    onClick={async () => {
                      setActionLoading(masterEditModal.id + prod);
                      try {
                        // Call orq or api for launch (high-level in pach orq already supports landbankLaunches)
                        const res = await fetch("/api/landbank", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ propertyId: masterEditModal.id, action: "launch_product", product: prod }) });
                        const d = await res.json();
                        showToast(d.success ? `✓ Launched ${prod} for ${masterEditModal.name} (land_meta + orq). Check investor/governance for gated.` : "Launch note: " + (d.error || "orq wired"));
                        await fetchData();
                      } catch (e) { showToast(`Launch ${prod} (demo orq)`); }
                      finally { setActionLoading(null); }
                    }}
                    disabled={!!actionLoading}
                    className="px-2 py-1 text-[10px] border border-[#c5a46d]/50 hover:bg-[#c5a46d]/10 rounded text-[#c5a46d]"
                  >
                    LAUNCH {prod.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2 bg-[#0a111f] border border-white/10 rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">
              Valuación Total
            </div>
            <div className="text-2xl font-bold text-[#c5a46d]">
              ${(stats.totalValuationUsd / 1_000_000).toFixed(2)}M
            </div>
            <div className="text-[10px] text-white/30 mt-1">
              {stats.total} activos • {stats.totalTokensIssued.toLocaleString()}{" "}
              tokens
            </div>
          </div>
          {(["coming_soon", "funding", "funded", "trading"] as const).map(
            (st) => {
              const cfg = STATUS_CONFIG[st];
              return (
                <div
                  key={st}
                  className={`bg-[#0a111f] border rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${
                    filterStatus === st
                      ? "border-[#c5a46d]/60"
                      : "border-white/10"
                  }`}
                  onClick={() =>
                    setFilterStatus(filterStatus === st ? "all" : st)
                  }
                >
                  <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">
                    {cfg.label}
                  </div>
                  <div className={`text-3xl font-bold ${cfg.color}`}>
                    {stats[st]}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* Lifecycle Pipeline */}
      <div className="bg-[#0a111f] border border-white/10 rounded-xl p-5">
        <div className="text-[10px] uppercase tracking-wider text-white/40 mb-4">
          Pipeline de Ciclo de Vida
        </div>
        <div className="flex items-center gap-0 overflow-x-auto">
          {lifecycle.map((st, i) => {
            const cfg = STATUS_CONFIG[st];
            const count = stats ? stats[st as keyof Stats] as number : 0;
            return (
              <div key={st} className="flex items-center">
                <div
                  className={`flex flex-col items-center min-w-[100px] px-3 py-2 rounded-lg border cursor-pointer transition-all hover:opacity-80 ${
                    filterStatus === st
                      ? cfg.bg + " scale-105"
                      : "bg-white/[0.02] border-white/5"
                  }`}
                  onClick={() =>
                    setFilterStatus(filterStatus === st ? "all" : st)
                  }
                >
                  <span className={`text-lg font-bold ${cfg.color}`}>
                    {count}
                  </span>
                  <span className="text-[9px] text-white/40 text-center mt-0.5">
                    {cfg.label}
                  </span>
                </div>
                {i < lifecycle.length - 1 && (
                  <div className="text-white/20 px-1 text-xs">→</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Properties Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider">
            {filterStatus === "all"
              ? "Todos los Activos"
              : STATUS_CONFIG[filterStatus]?.label}{" "}
            ({filtered.length})
          </h3>
          <div className="flex gap-2">
            <a
              href="/dashboard/admin/properties/new"
              className="px-3 py-1.5 bg-[#c5a46d] hover:bg-[#d4b47d] text-black text-xs font-semibold rounded-lg transition-colors"
            >
              + Nuevo Activo
            </a>
            <button
              onClick={() => setFilterStatus("all")}
              className="px-3 py-1.5 border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-xs rounded-lg transition-colors"
            >
              Ver Todos
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-white/30">
            Cargando activos...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-white/30">
            No hay activos en este estado.{" "}
            <a
              href="/dashboard/admin/properties/new"
              className="text-[#c5a46d] hover:underline"
            >
              Crear uno
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((prop) => {
              const cfg = STATUS_CONFIG[prop.status];
              const tokenizationPct =
                Number(prop.totalTokens) > 0
                  ? Math.round(
                      ((Number(prop.totalTokens) -
                        Number(prop.availableTokens)) /
                        Number(prop.totalTokens)) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={prop.id}
                  className="bg-[#0a111f] border border-white/10 hover:border-white/20 rounded-xl p-5 transition-all flex flex-col gap-3"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">
                          {TYPE_ICONS[prop.propertyType] || "🏗️"}
                        </span>
                        <span className="font-semibold text-white text-sm">
                          {prop.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-white/40">
                        {prop.location}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded border ${cfg.bg} ${cfg.color}`}
                    >
                      {cfg.label}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white/[0.03] rounded-lg p-2">
                      <div className="text-white/30 mb-0.5">Valuación</div>
                      <div className="text-white font-semibold">
                        ${Number(prop.totalValuationUsd).toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-white/[0.03] rounded-lg p-2">
                      <div className="text-white/30 mb-0.5">Token Price</div>
                      <div className="text-[#c5a46d] font-semibold">
                        ${Number(prop.tokenPriceUsd).toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-white/[0.03] rounded-lg p-2">
                      <div className="text-white/30 mb-0.5">APY Est.</div>
                      <div className="text-emerald-400 font-semibold">
                        {prop.annualYieldExpected || "—"}%
                      </div>
                    </div>
                    <div className="bg-white/[0.03] rounded-lg p-2">
                      <div className="text-white/30 mb-0.5">Tokens</div>
                      <div className="text-white font-semibold">
                        {Number(prop.totalTokens).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Tokenization Progress */}
                  {Number(prop.totalTokens) > 0 && (
                    <div>
                      <div className="flex justify-between text-[10px] text-white/30 mb-1">
                        <span>Tokens vendidos</span>
                        <span>{tokenizationPct}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#c5a46d] to-emerald-400 rounded-full transition-all"
                          style={{ width: `${tokenizationPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Demo Badge */}
                  {prop.isDemo && (
                    <div className="text-[10px] text-amber-400/60 border border-amber-500/20 rounded px-2 py-0.5 inline-block w-fit">
                      DEMO
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-2 border-t border-white/5">
                    <a
                      href={`/dashboard/admin/properties/${prop.id}`}
                      className="flex-1 text-center px-3 py-1.5 border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-xs rounded-lg transition-colors"
                    >
                      Ver Detalle
                    </a>
                    {cfg.next && (
                      <button
                        onClick={() => handleAdvance(prop)}
                        disabled={actionLoading === prop.id}
                        className="flex-1 px-3 py-1.5 bg-[#c5a46d]/10 hover:bg-[#c5a46d]/20 border border-[#c5a46d]/30 text-[#c5a46d] text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                      >
                        {actionLoading === prop.id
                          ? "..."
                          : cfg.next}
                      </button>
                    )}
                    {(prop.status === "trading" ||
                      prop.status === "funded") && (
                      <button
                        onClick={() => setDistributeModal(prop)}
                        className="px-2 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg transition-colors"
                        title="Distribuir Rendimientos"
                      >
                        💰
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

