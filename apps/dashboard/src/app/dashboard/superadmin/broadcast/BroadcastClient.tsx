"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BroadcastClient({ properties }: { properties: any[] }) {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [targetSegment, setTargetSegment] = useState("all");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm(`¿Estás seguro de enviar este broadcast a: ${targetSegment}?`)) return;
    
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/superadmin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, type, targetSegment }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`Broadcast enviado exitosamente a ${data.recipientCount} destinatarios.`);
        setMessage("");
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
        <h2 className="text-xl font-bold mb-4 text-red-400">Redactar Nuevo Broadcast</h2>
        <form onSubmit={handleBroadcast} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-1">Segmento Objetivo</label>
              <select value={targetSegment} onChange={e=>setTargetSegment(e.target.value)} required className="w-full bg-black border border-gray-700 p-2 text-white">
                <option value="all">TODOS LOS INVERSORES (Global)</option>
                <optgroup label="Holders por Propiedad">
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>Solo holders de: {p.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-1">Nivel de Urgencia</label>
              <select value={type} onChange={e=>setType(e.target.value)} required className="w-full bg-black border border-gray-700 p-2 text-white">
                <option value="info">INFO (Informativo / Azul)</option>
                <option value="warning">WARNING (Advertencia / Amarillo)</option>
                <option value="alert">ALERT (Crítico / Rojo)</option>
                <option value="system">SYSTEM (Mantenimiento / Gris)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1">Mensaje Push</label>
            <textarea 
              value={message} 
              onChange={e=>setMessage(e.target.value)} 
              required 
              rows={4}
              placeholder="Ej: Mantenimiento programado del sistema a las 02:00 AM UTC..." 
              className="w-full bg-black border border-gray-700 p-2 text-white" 
            />
          </div>

          <button disabled={loading} type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-bold uppercase tracking-wider text-sm transition-colors w-full">
            {loading ? "Emitiendo Broadcast..." : "ENVIAR BROADCAST AHORA"}
          </button>
        </form>
      </div>
    </div>
  );
}
