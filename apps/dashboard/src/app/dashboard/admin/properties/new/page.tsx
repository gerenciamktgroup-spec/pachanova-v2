"use client";

import { useState } from "react";
import { RouteBreadcrumbs } from "@/components/mission";
import { createPropertyAction } from "./actions";
import { useRouter } from "next/navigation";

export default function NewPropertyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await createPropertyAction(formData);

    if (res.success) {
      router.push("/dashboard/admin/properties");
      router.refresh();
    } else {
      setError(res.error || "Ocurrió un error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[
        { label: 'Admin' }, 
        { label: 'Gestión de Proyectos', href: '/dashboard/admin/properties' }, 
        { label: 'Nuevo Proyecto' }
      ]} />
      
      <div className="bg-[#0a111f] min-h-screen text-white rounded-2xl border border-white/10 p-6 md:p-8 max-w-2xl">
        <h2 className="text-xl font-semibold tracking-tight text-white/90 mb-6">Agregar Nueva Propiedad</h2>
        
        {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-white/70">Nombre del Proyecto</label>
              <input name="name" required className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2 focus:border-[#c5a46d] focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70">Ubicación</label>
              <input name="location" required className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2 focus:border-[#c5a46d] focus:outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70">Tipo de Propiedad</label>
              <select name="propertyType" className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2 focus:border-[#c5a46d] focus:outline-none">
                <option value="land">Terreno (Land)</option>
                <option value="residential">Vivienda (Residential)</option>
                <option value="hotel">Hotel</option>
                <option value="rental">Alquiler (Rental)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70">Estado Inicial</label>
              <select name="status" className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2 focus:border-[#c5a46d] focus:outline-none">
                <option value="coming_soon">Próximamente (Coming Soon)</option>
                <option value="funding">En Fondeo (Funding)</option>
                <option value="trading">Trading Abierto</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70">Valuación Total (USD)</label>
              <input name="totalValuationUsd" type="number" step="0.01" required className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2 focus:border-[#c5a46d] focus:outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70">Precio por Token (USD)</label>
              <input name="tokenPriceUsd" type="number" step="0.01" required className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2 focus:border-[#c5a46d] focus:outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70">Cantidad de Tokens (Supply)</label>
              <input name="totalTokens" type="number" required className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2 focus:border-[#c5a46d] focus:outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70">Rendimiento Esperado (% APY)</label>
              <input name="annualYieldExpected" type="number" step="0.01" required className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-2 focus:border-[#c5a46d] focus:outline-none" />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
            <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/5 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-[#c5a46d] hover:bg-[#d4b47d] text-[#0a111f] font-semibold px-6 py-2 rounded-lg transition-colors">
              {isSubmitting ? "Guardando..." : "Crear Propiedad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
