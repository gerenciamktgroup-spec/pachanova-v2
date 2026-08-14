"use client";

import { useState } from "react";
import { UserAdminView } from "@/types/product";

interface AdminControlPanelProps {
  users: UserAdminView[];
}

export function AdminControlPanel({ users }: AdminControlPanelProps) {
  const [selectedUser, setSelectedUser] = useState<string>(users[0]?.id || "");
  const [kycStatus, setKycStatus] = useState<"approved" | "pending" | "rejected">("approved");
  const [depositAmount, setDepositAmount] = useState<string>("1000");
  const [oraclePrice, setOraclePrice] = useState<string>("10");
  const [loading, setLoading] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);

  async function doAction(action: string, payload: Record<string, unknown>) {
    setLoading(action);
    setLastResult(null);
    try {
      let url = "";
      if (action === "kyc") url = "/api/demo/actions/kyc-status";
      else if (action === "deposit") url = "/api/demo/actions/simulated-deposit";
      else if (action === "oracle") url = "/api/oracle/valuation";
      else if (action === "reset") url = "/api/demo/reset";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success || data.ok) {
        setLastResult(`✅ ${action.toUpperCase()} exitoso`);
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setLastResult(`❌ Error: ${data.error || JSON.stringify(data)}`);
      }
    } catch (error: unknown) {
      setLastResult(`❌ Error de red: ${error instanceof Error ? error.message : "error desconocido"}`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div
      data-testid="admin-control-panel"
      className="bg-pn-surface-strong border border-pn-gold/30 rounded-xl p-6 mb-2"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🎛️</span>
        <div>
          <h2 className="text-lg font-bold text-pn-gold">Panel de Control Maestro</h2>
          <p className="text-xs text-pn-text-soft">Control total sobre usuarios, KYC, treasury y oracle de valuación</p>
        </div>
        <span className="ml-auto text-xs bg-pn-gold/10 text-pn-gold border border-pn-gold/30 px-2 py-1 rounded-full font-mono">
          ADMIN
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ── KYC Override ── */}
        <div className="bg-pn-bg border border-pn-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-pn-text mb-3 flex items-center gap-2">
            <span>🪪</span> Override KYC
          </h3>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-pn-text-soft block mb-1">Inversor</label>
              <select
                className="w-full bg-pn-surface border border-pn-border rounded px-2 py-1 text-sm text-pn-text"
                value={selectedUser}
                onChange={e => setSelectedUser(e.target.value)}
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.fullName} ({u.kycStatus})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-pn-text-soft block mb-1">Nuevo estado KYC</label>
              <select
                className="w-full bg-pn-surface border border-pn-border rounded px-2 py-1 text-sm text-pn-text"
                value={kycStatus}
                onChange={e => setKycStatus(e.target.value as "approved" | "pending" | "rejected")}
              >
                <option value="approved">✅ Approved</option>
                <option value="pending">⏳ Pending</option>
                <option value="rejected">❌ Rejected</option>
              </select>
            </div>
            <button
              disabled={loading === "kyc" || !selectedUser}
              onClick={() => doAction("kyc", { investorId: selectedUser, status: kycStatus })}
              className="w-full mt-2 bg-pn-gold text-black text-sm font-semibold py-2 rounded hover:bg-pn-gold/80 disabled:opacity-50 transition-colors"
            >
              {loading === "kyc" ? "Aplicando…" : "Aplicar KYC Override"}
            </button>
          </div>
        </div>

        {/* ── Depósito Simulado ── */}
        <div className="bg-pn-bg border border-pn-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-pn-text mb-3 flex items-center gap-2">
            <span>💵</span> Depósito USD Simulado
          </h3>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-pn-text-soft block mb-1">Inversor destino</label>
              <select
                className="w-full bg-pn-surface border border-pn-border rounded px-2 py-1 text-sm text-pn-text"
                value={selectedUser}
                onChange={e => setSelectedUser(e.target.value)}
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.fullName} — ${u.balance.availableUsd} USD
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-pn-text-soft block mb-1">Monto USD a depositar</label>
              <input
                type="number"
                min="1"
                className="w-full bg-pn-surface border border-pn-border rounded px-2 py-1 text-sm text-pn-text"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
              />
            </div>
            <button
              disabled={loading === "deposit" || !selectedUser}
      onClick={() => doAction("deposit", { investorId: selectedUser, amountUsd: Number(depositAmount) })}
              className="w-full mt-2 bg-green-600 text-white text-sm font-semibold py-2 rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading === "deposit" ? "Procesando…" : "Acreditar USD"}
            </button>
          </div>
        </div>

        {/* ── Oracle Precio ── */}
        <div className="bg-pn-bg border border-pn-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-pn-text mb-3 flex items-center gap-2">
            <span>📡</span> Oracle Valuación
          </h3>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-pn-text-soft block mb-1">Precio por m² (USD)</label>
              <input
                type="number"
                min="1"
                step="0.5"
                className="w-full bg-pn-surface border border-pn-border rounded px-2 py-1 text-sm text-pn-text"
                value={oraclePrice}
                onChange={e => setOraclePrice(e.target.value)}
              />
            </div>
            <p className="text-xs text-pn-text-soft">
              Precio token ≈ ${(Number(oraclePrice) * 0.1).toFixed(2)} USD<br />
              NAV total ≈ ${(Number(oraclePrice) * 500000).toLocaleString()} USD
            </p>
            <button
              disabled={loading === "oracle"}
              onClick={() => doAction("oracle", { pricePerSqm: Number(oraclePrice) })}
              className="w-full mt-2 bg-blue-600 text-white text-sm font-semibold py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading === "oracle" ? "Actualizando…" : "Actualizar Oracle"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick Links Row ── */}
      <div className="mt-4 flex flex-wrap gap-2">
        <a href="/dashboard/admin/users" className="text-xs text-pn-text-soft border border-pn-border px-3 py-1.5 rounded hover:bg-pn-surface transition-colors">
          👥 Usuarios y KYC
        </a>
        <a href="/dashboard/admin/audit" className="text-xs text-pn-text-soft border border-pn-border px-3 py-1.5 rounded hover:bg-pn-surface transition-colors">
          📋 Logs de Auditoría
        </a>
        <a href="/dashboard/admin/settings" className="text-xs text-pn-text-soft border border-pn-border px-3 py-1.5 rounded hover:bg-pn-surface transition-colors">
          ⚙️ Configuración
        </a>
        <a href="/dashboard/admin/landbank" className="text-xs text-pn-text-soft border border-pn-border px-3 py-1.5 rounded hover:bg-pn-surface transition-colors">
          🏗️ Landbank + Holograms
        </a>
        <a href="/dashboard/fideicomiso" className="text-xs text-pn-text-soft border border-pn-border px-3 py-1.5 rounded hover:bg-pn-surface transition-colors">
          📜 Fideicomiso Multi-Sig
        </a>
        <a href="/demo/showcase" className="text-xs text-pn-text-soft border border-pn-border px-3 py-1.5 rounded hover:bg-pn-surface transition-colors">
          🚀 Demo Showcase
        </a>
        <a href="/api/demo/health" target="_blank" className="text-xs text-pn-text-soft border border-pn-border px-3 py-1.5 rounded hover:bg-pn-surface transition-colors">
          🩺 Health Check
        </a>
      </div>

      {/* ── CSV Export Row ── */}
      <div className="mt-3">
        <p className="text-xs text-pn-text-soft mb-2 font-medium">📥 Exportar datos:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { type: 'users', label: '👥 Usuarios CSV' },
            { type: 'audit', label: '📋 Auditoría CSV' },
            { type: 'transactions', label: '💱 Transacciones CSV' },
            { type: 'orders', label: '🪙 Órdenes CSV' },
          ].map(({ type, label }) => (
            <a
              key={type}
              href={`/api/admin/export?type=${type}`}
              download
              className="text-xs text-pn-gold border border-pn-gold/30 px-3 py-1.5 rounded hover:bg-pn-gold/10 transition-colors"
            >
              {label}
            </a>
          ))}
          <a
            href="/api/admin/webhook-queue"
            target="_blank"
            className="text-xs text-pn-text-soft border border-pn-border px-3 py-1.5 rounded hover:bg-pn-surface transition-colors"
          >
            🔁 Cola Webhooks
          </a>
        </div>
      </div>

      {/* ── Feedback banner ── */}
      {lastResult && (
        <div className={`mt-4 text-sm font-medium px-4 py-2 rounded border ${lastResult.startsWith("✅") ? "bg-green-950 border-green-800 text-green-300" : "bg-red-950 border-red-800 text-red-300"}`}>
          {lastResult}
        </div>
      )}
    </div>
  );
}
