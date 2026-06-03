"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InvestorOverrideClient({ investors }: { investors: any[] }) {
  const [investorId, setInvestorId] = useState("");
  const [field, setField] = useState("kycStatus");
  const [value, setValue] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/superadmin/override/investor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ investorId, field, value, reason, propertyId }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("Override aplicado correctamente.");
        setReason(""); setValue("");
        router.refresh();
      } else {
        setMsg(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {msg && <div className="p-4 bg-gray-800 border-l-4 border-red-500 text-white">{msg}</div>}
      
      <div className="bg-[#0f172a] p-6 rounded border border-red-900/50">
        <h2 className="text-xl font-bold mb-4 text-red-400">Forzar Datos de Inversor</h2>
        <form onSubmit={handleOverride} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1">Inversor Objetivo</label>
            <select value={investorId} onChange={e=>setInvestorId(e.target.value)} required className="w-full bg-black border border-gray-700 p-2 text-white">
              <option value="">-- Seleccionar Inversor --</option>
              {investors.map(inv => (
                <option key={inv.id} value={inv.id}>{inv.firstName} {inv.lastName} ({inv.email}) - {inv.kycStatus}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-1">Campo a Forzar</label>
              <select value={field} onChange={e=>setField(e.target.value)} className="w-full bg-black border border-gray-700 p-2 text-white">
                <option value="kycStatus">Estado KYC</option>
                <option value="availableUsd">Saldo USD Disponible</option>
                <option value="availableTokens">Tokens Disponibles</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-1">Nuevo Valor</label>
              <input value={value} onChange={e=>setValue(e.target.value)} required placeholder={field === 'kycStatus' ? 'approved, rejected...' : '0.00'} className="w-full bg-black border border-gray-700 p-2 text-white" />
            </div>
          </div>

          {(field === "availableTokens" || field === "availableUsd") && (
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-1">Property ID (Opcional - para especificar balance exacto)</label>
              <input value={propertyId} onChange={e=>setPropertyId(e.target.value)} placeholder="Ej: PNC-PAR-001" className="w-full bg-black border border-gray-700 p-2 text-white" />
            </div>
          )}

          <div>
            <label className="block text-xs uppercase text-red-500 font-bold mb-1">Razón de Auditoría (Obligatorio)</label>
            <input value={reason} onChange={e=>setReason(e.target.value)} required placeholder="Ej: Fondeo manual via transferencia bancaria" className="w-full bg-black border border-red-900/50 focus:border-red-500 p-2 text-white" />
          </div>

          <button disabled={loading} type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-bold uppercase tracking-wider text-sm transition-colors w-full">
            {loading ? "Aplicando Override..." : "Ejecutar Override"}
          </button>
        </form>
      </div>
    </div>
  );
}
