import Link from "next/link";
import { ShieldAlert, Settings, Users, Home, Radio, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default function SuperAdminDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <div className="mb-8 border-b border-red-900/50 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <ShieldAlert className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-bold tracking-tight text-red-500 uppercase">Panel de Control Maestro</h1>
        </div>
        <p className="text-gray-400">
          Modo Back-Office Bancario. Las acciones tomadas aquí eluden las validaciones regulares y se aplican en tiempo real. Todo queda auditado.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/superadmin/system" className="block group">
          <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-xl hover:border-red-500/50 transition-all duration-300">
            <Settings className="w-8 h-8 text-gray-400 group-hover:text-red-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Parámetros del Sistema</h2>
            <p className="text-sm text-gray-500">Configura APYs, fees, límites de inversión y modos de mantenimiento global.</p>
          </div>
        </Link>

        <Link href="/dashboard/superadmin/investors" className="block group">
          <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-xl hover:border-red-500/50 transition-all duration-300">
            <Users className="w-8 h-8 text-gray-400 group-hover:text-red-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Override de Inversores</h2>
            <p className="text-sm text-gray-500">Fuerza cambios en saldos USD, tokens, o estados KYC de manera manual.</p>
          </div>
        </Link>

        <Link href="/dashboard/superadmin/properties" className="block group">
          <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-xl hover:border-red-500/50 transition-all duration-300">
            <Home className="w-8 h-8 text-gray-400 group-hover:text-red-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Override de Propiedades</h2>
            <p className="text-sm text-gray-500">Cambia valuaciones, precios de token, o avanza de fase cualquier propiedad.</p>
          </div>
        </Link>

        <Link href="/dashboard/superadmin/broadcast" className="block group">
          <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-xl hover:border-red-500/50 transition-all duration-300">
            <Radio className="w-8 h-8 text-gray-400 group-hover:text-red-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Push Broadcast</h2>
            <p className="text-sm text-gray-500">Envía alertas y notificaciones forzadas a todos los inversores o segmentos.</p>
          </div>
        </Link>

        <Link href="/dashboard/superadmin/activity" className="block group">
          <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-xl hover:border-red-500/50 transition-all duration-300">
            <Activity className="w-8 h-8 text-gray-400 group-hover:text-red-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Feed de Actividad</h2>
            <p className="text-sm text-gray-500">Monitoreo en vivo (SSE) de todos los overrides y logs de auditoría.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
