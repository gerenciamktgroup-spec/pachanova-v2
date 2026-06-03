"use client";

import { useState, useEffect, useCallback } from "react";

type Distribution = {
  id: string;
  propertyId: string;
  amountUsd: string;
  periodStart: string;
  periodEnd: string;
  status: string;
  proofRef: string | null;
  claimedAt: string | null;
  createdAt: string;
  propertyName: string;
  propertyType: string;
  location: string;
};

type Summary = {
  total: number;
  totalClaimable: number;
  totalClaimed: number;
  claimableCount: number;
  claimedCount: number;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  CLAIMABLE: {
    label: "Reclamable",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  CLAIMED: {
    label: "Reclamado",
    color: "text-gray-400",
    bg: "bg-gray-500/10 border-gray-500/20",
  },
  PAGADO: {
    label: "Pagado",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  PENDING: {
    label: "Pendiente",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
};

export default function YieldDistributionsClient({
  investorId,
}: {
  investorId: string;
}) {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/yield/distributions?investorId=${investorId}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      setDistributions(data.distributions || []);
      setSummary(data.summary || null);
    } catch (e) {
      console.error("Error fetching distributions:", e);
    } finally {
      setLoading(false);
    }
  }, [investorId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAction = async (
    distributionId: string,
    action: "claim" | "compound"
  ) => {
    setActionLoading(distributionId + action);
    try {
      const res = await fetch("/api/yield/distributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ distributionId, investorId, action }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          action === "claim"
            ? `✅ Reclamado $${Number(data.amountUsd).toFixed(2)} — Tx: ${data.txHash?.slice(0, 16)}...`
            : `✅ Reinvertido $${Number(data.amountUsd).toFixed(2)} en tu saldo USD`
        );
        await fetchData();
      } else {
        showToast(`❌ Error: ${data.error}`);
      }
    } catch (e: any) {
      showToast(`❌ ${e.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const claimableDistributions = distributions.filter(
    (d) => d.status === "CLAIMABLE"
  );
  const claimedDistributions = distributions.filter(
    (d) => d.status === "CLAIMED" || d.status === "PAGADO"
  );

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-[#0f172a] border border-[#c5a46d]/50 rounded-xl text-sm text-white shadow-2xl animate-fade-in">
          {toastMsg}
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-emerald-950/50 to-[#0a111f] border border-emerald-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">
              ${summary.totalClaimable.toLocaleString()}
            </div>
            <div className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">
              Disponible para reclamar
            </div>
          </div>
          <div className="bg-[#0a111f] border border-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {summary.claimableCount}
            </div>
            <div className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">
              Distribuciones pendientes
            </div>
          </div>
          <div className="bg-[#0a111f] border border-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-400">
              ${summary.totalClaimed.toLocaleString()}
            </div>
            <div className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">
              Total reclamado
            </div>
          </div>
          <div className="bg-[#0a111f] border border-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#c5a46d]">
              {summary.total}
            </div>
            <div className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">
              Distribuciones totales
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-white/30">
          Cargando distribuciones...
        </div>
      ) : distributions.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-xl">
          <div className="text-3xl mb-3">💰</div>
          <div className="text-white/50 text-sm mb-2">
            No hay distribuciones registradas aún
          </div>
          <div className="text-white/30 text-xs">
            Las distribuciones aparecerán aquí cuando el administrador ejecute
            una distribución de rendimiento en un activo donde tengas tokens.
          </div>
          <a
            href="/dashboard/investor/marketplace"
            className="inline-block mt-4 px-4 py-2 bg-[#c5a46d]/10 border border-[#c5a46d]/30 text-[#c5a46d] text-sm rounded-lg hover:bg-[#c5a46d]/20 transition-colors"
          >
            Ver activos disponibles →
          </a>
        </div>
      ) : (
        <>
          {/* Claimable */}
          {claimableDistributions.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  ✅ Rendimientos Disponibles
                </h3>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-full">
                  {claimableDistributions.length}
                </span>
              </div>
              <div className="space-y-3">
                {claimableDistributions.map((d) => (
                  <div
                    key={d.id}
                    className="bg-[#0a111f] border border-emerald-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-sm">
                          {d.propertyName}
                        </span>
                        <span className="px-1.5 py-0.5 text-[9px] uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded">
                          CLAIMABLE
                        </span>
                      </div>
                      <div className="text-[11px] text-white/40">
                        {d.location} •{" "}
                        {new Date(d.periodStart).toLocaleDateString("es-PE")} →{" "}
                        {new Date(d.periodEnd).toLocaleDateString("es-PE")}
                      </div>
                      {d.proofRef && (
                        <div className="text-[10px] text-amber-400/70 mt-1 font-mono">
                          proof: {d.proofRef.slice(0, 30)}...
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400 mb-2">
                        ${Number(d.amountUsd).toFixed(2)}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(d.id, "claim")}
                          disabled={!!actionLoading}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          {actionLoading === d.id + "claim"
                            ? "..."
                            : "RECLAMAR"}
                        </button>
                        <button
                          onClick={() => handleAction(d.id, "compound")}
                          disabled={!!actionLoading}
                          className="px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 disabled:opacity-50 text-violet-400 text-xs font-semibold rounded-lg transition-colors"
                        >
                          {actionLoading === d.id + "compound"
                            ? "..."
                            : "REINVERTIR"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          {claimedDistributions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                Historial de Distribuciones
              </h3>
              <div className="bg-[#0a111f] border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-white/30">
                        Activo
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-white/30">
                        Período
                      </th>
                      <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider text-white/30">
                        Monto
                      </th>
                      <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider text-white/30">
                        Estado
                      </th>
                      <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider text-white/30">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {claimedDistributions.map((d) => {
                      const cfg =
                        STATUS_CONFIG[d.status] || STATUS_CONFIG.PAGADO;
                      return (
                        <tr
                          key={d.id}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="text-white/80 text-xs font-medium">
                              {d.propertyName}
                            </div>
                            <div className="text-white/30 text-[10px]">
                              {d.location}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-white/50 text-[10px] font-mono">
                              {new Date(d.periodStart).toLocaleDateString(
                                "es-PE"
                              )}{" "}
                              →{" "}
                              {new Date(d.periodEnd).toLocaleDateString(
                                "es-PE"
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="font-mono text-white text-sm font-semibold">
                              ${Number(d.amountUsd).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded border ${cfg.bg} ${cfg.color}`}
                            >
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-[10px] text-white/30 font-mono">
                            {new Date(d.createdAt).toLocaleDateString("es-PE")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
