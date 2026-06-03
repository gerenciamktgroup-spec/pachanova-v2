"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SystemParametersClient({ initialParams }: { initialParams: any[] }) {
  const [params, setParams] = useState(initialParams);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/superadmin/system-params", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value, description, reason }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("Parámetro actualizado correctamente.");
        setKey(""); setValue(""); setDescription(""); setReason("");
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
      
      <div className="bg-[#0f172a] p-6 rounded border border-gray-800">
        <h2 className="text-xl font-bold mb-4 text-red-400">Actualizar / Crear Parámetro</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-1">Key (Ej: BASE_APY)</label>
              <input value={key} onChange={e=>setKey(e.target.value)} required className="w-full bg-black border border-gray-700 p-2 text-white" />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-1">Value</label>
              <input value={value} onChange={e=>setValue(e.target.value)} required className="w-full bg-black border border-gray-700 p-2 text-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1">Descripción</label>
            <input value={description} onChange={e=>setDescription(e.target.value)} className="w-full bg-black border border-gray-700 p-2 text-white" />
          </div>
          <div>
            <label className="block text-xs uppercase text-red-500 font-bold mb-1">Razón de Auditoría (Obligatorio)</label>
            <input value={reason} onChange={e=>setReason(e.target.value)} required placeholder="Ej: Ajuste de mercado Q3" className="w-full bg-black border border-red-900/50 focus:border-red-500 p-2 text-white" />
          </div>
          <button disabled={loading} type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-bold uppercase tracking-wider text-sm transition-colors">
            {loading ? "Aplicando..." : "Forzar Actualización"}
          </button>
        </form>
      </div>

      <div className="bg-[#0f172a] p-6 rounded border border-gray-800">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Parámetros Activos</h2>
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="text-xs uppercase bg-black text-gray-500">
            <tr>
              <th className="px-4 py-3">Key</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Última Modificación</th>
            </tr>
          </thead>
          <tbody>
            {params.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center">No hay parámetros definidos</td></tr>
            ) : params.map((p, i) => (
              <tr key={i} className="border-b border-gray-800 hover:bg-gray-900/50">
                <td className="px-4 py-3 font-mono text-white">{p.key}</td>
                <td className="px-4 py-3 font-bold text-green-400">{p.value}</td>
                <td className="px-4 py-3">{p.description}</td>
                <td className="px-4 py-3">{new Date(p.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
