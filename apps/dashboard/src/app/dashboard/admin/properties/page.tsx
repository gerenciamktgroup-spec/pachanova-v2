import { RouteBreadcrumbs, ErrorState, LoadingState } from "@/components/mission";
import { Suspense } from "react";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { desc } from "drizzle-orm";

export const dynamic = 'force-dynamic';

async function fetchProperties() {
  try {
    const data = await db.query.properties.findMany({
      orderBy: [desc(schema.properties.createdAt)]
    });
    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      property_type: p.propertyType,
      location: p.location,
      total_valuation_usd: p.totalValuationUsd,
      token_price_usd: p.tokenPriceUsd,
      status: p.status,
      created_at: p.createdAt
    }));
  } catch (err) {
    console.error("Error fetching properties via Drizzle:", err);
    return [];
  }
}

async function PropertiesContent() {
  const properties = await fetchProperties();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white/90">Portafolio Inmobiliario</h2>
          <p className="text-sm text-white/50">Gestiona los terrenos, hoteles y proyectos disponibles en PachaNova.</p>
        </div>
        <a href="/dashboard/admin/properties/new" className="bg-[#c5a46d] hover:bg-[#d4b47d] text-[#0a111f] font-semibold px-4 py-2 rounded-lg text-sm transition-colors block">
          + Nuevo Proyecto
        </a>
      </div>

      <div className="bg-[#0f172a] rounded-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 border-b border-white/5 text-white/40">
              <tr>
                <th className="px-6 py-4 font-medium">PROYECTO</th>
                <th className="px-6 py-4 font-medium">TIPO</th>
                <th className="px-6 py-4 font-medium">UBICACIÓN</th>
                <th className="px-6 py-4 font-medium text-right">VALUACIÓN</th>
                <th className="px-6 py-4 font-medium text-right">PRECIO TOKEN</th>
                <th className="px-6 py-4 font-medium text-center">ESTADO</th>
                <th className="px-6 py-4 font-medium text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-white/40">
                    No hay proyectos registrados.
                  </td>
                </tr>
              ) : (
                properties.map((prop: any) => (
                  <tr key={prop.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white/90">{prop.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-white/70 uppercase">
                        {prop.property_type || 'land'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/60">
                      {prop.location}
                    </td>
                    <td className="px-6 py-4 text-right text-white/80 font-mono">
                      ${Number(prop.total_valuation_usd).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-white/80 font-mono">
                      ${Number(prop.token_price_usd).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase
                        ${prop.status === 'trading' ? 'bg-green-500/10 text-green-400' : 
                          prop.status === 'funding' ? 'bg-blue-500/10 text-blue-400' : 
                          'bg-yellow-500/10 text-yellow-400'}`}>
                        {prop.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#c5a46d] hover:text-[#d4b47d] text-sm font-medium transition-colors">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminPropertiesPage() {
  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[{ label: 'Admin' }, { label: 'Gestión de Proyectos' }]} />
      
      <div className="bg-[#0a111f] min-h-screen text-white rounded-2xl border border-white/10 p-6 md:p-8">
        <Suspense fallback={<LoadingState message="Cargando portafolio inmobiliario..." />}>
          <PropertiesContent />
        </Suspense>
      </div>
    </div>
  );
}
