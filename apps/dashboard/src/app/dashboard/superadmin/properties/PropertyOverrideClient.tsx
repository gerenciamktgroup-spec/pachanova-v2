"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PropertyOverrideClient({ properties }: { properties: any[] }) {
  const [propertyId, setPropertyId] = useState("");
  const [field, setField] = useState("status");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/superadmin/override/property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, field, value, reason }),
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

  const selectedProp = properties.find(p => p.id === propertyId);

  return (
    <div className="space-y-8">
      {msg && <div className="p-4 bg-gray-800 border-l-4 border-red-500 text-white">{msg}</div>}
      
      <div className="bg-[#0f172a] p-6 rounded border border-red-900/50">
        <h2 className="text-xl font-bold mb-4 text-red-400">Forzar Datos de Propiedad (Landbank)</h2>
        <form onSubmit={handleOverride} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1">Propiedad Objetivo</label>
            <select value={propertyId} onChange={e=>setPropertyId(e.target.value)} required className="w-full bg-black border border-gray-700 p-2 text-white">
              <option value="">-- Seleccionar Propiedad --</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.id}) - Estado actual: {p.status}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-1">Campo a Forzar</label>
              <select value={field} onChange={e=>setField(e.target.value)} className="w-full bg-black border border-gray-700 p-2 text-white">
                <option value="status">Estado (Lifecycle Phase)</option>
                <option value="tokenPriceUsd">Precio de Token (USD)</option>
                <option value="totalValuationUsd">Valuación Total (USD)</option>
                <option value="availableTokens">Tokens Disponibles</option>
                <option value="annualYieldExpected">APY Esperado (%)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-1">Nuevo Valor</label>
              {field === 'status' ? (
                 <select value={value} onChange={e=>setValue(e.target.value)} required className="w-full bg-black border border-gray-700 p-2 text-white">
                    <option value="">Seleccione fase...</option>
                    <option value="coming_soon">coming_soon</option>
                    <option value="funding">funding</option>
                    <option value="funded">funded</option>
                    <option value="trading">trading</option>
                    <option value="liquidated">liquidated</option>
                 </select>
              ) : (
                <input value={value} onChange={e=>setValue(e.target.value)} required placeholder={`Ej: ${selectedProp ? selectedProp[field] : ''}`} className="w-full bg-black border border-gray-700 p-2 text-white" />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-red-500 font-bold mb-1">Razón de Auditoría (Obligatorio)</label>
            <input value={reason} onChange={e=>setReason(e.target.value)} required placeholder="Ej: Cambio de fase manual aprobado por comité" className="w-full bg-black border border-red-900/50 focus:border-red-500 p-2 text-white" />
          </div>

          <button disabled={loading} type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-bold uppercase tracking-wider text-sm transition-colors w-full">
            {loading ? "Aplicando Override..." : "Ejecutar Override de Propiedad"}
          </button>
        </form>
      </div>
    </div>
  );
}
