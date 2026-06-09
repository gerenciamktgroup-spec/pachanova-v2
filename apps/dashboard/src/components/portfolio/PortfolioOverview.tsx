'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Wallet, TrendingUp, AlertCircle, ArrowRight, Coins, RefreshCw } from 'lucide-react';

// Tipado según la Fase 1
type AssetStatus = 'active' | 'in_liquidation' | 'liquidated';

interface Asset {
  id: string;
  name: string;
  valor_fiat_inicial: number;
  valor_fiat_actual: number;
  estado: AssetStatus;
  trust_id: string;
  trusts?: {
    name: string;
  };
}

export default function PortfolioOverview() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar Supabase en el cliente
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        setIsLoading(true);
        // Simulamos obtener los activos relevantes para el usuario (usando RLS)
        // Se une con la tabla trusts para obtener el nombre del Fideicomiso
        const { data, error } = await supabase
          .from('assets')
          .select(`
            id,
            name,
            valor_fiat_inicial,
            valor_fiat_actual,
            estado,
            trust_id,
            trusts ( name )
          `);

        if (error) throw error;
        setAssets(data as any[] || []);
      } catch (error) {
        console.error('Error fetching assets:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPortfolio();
  }, [supabase]);

  if (isLoading) {
    return <PortfolioSkeleton />;
  }

  // Cálculos del portafolio
  const totalInvertido = assets.reduce((acc, asset) => acc + Number(asset.valor_fiat_inicial), 0);
  const valorActual = assets.reduce((acc, asset) => acc + Number(asset.valor_fiat_actual), 0);
  const plusvalia = valorActual - totalInvertido;
  const porcentajeCrecimiento = totalInvertido > 0 ? (plusvalia / totalInvertido) * 100 : 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 p-6 md:p-10 font-sans text-neutral-900 dark:text-neutral-50">
      
      {/* Header "Quiet Luxury" */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-neutral-800 dark:text-neutral-100">
            Tu Portafolio RWA
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 font-medium">
            Respaldado por fideicomisos reales. Trazabilidad on-chain.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard 
          title="Total Invertido (Fiat)" 
          value={`$${totalInvertido.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} 
          icon={<Wallet className="w-5 h-5 text-neutral-400" />} 
        />
        <KpiCard 
          title="Valoración Actual" 
          value={`$${valorActual.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} 
          icon={<TrendingUp className="w-5 h-5 text-neutral-400" />} 
          trend={`+${porcentajeCrecimiento.toFixed(2)}%`}
        />
        <KpiCard 
          title="Plusvalía Acumulada" 
          value={`+$${plusvalia.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} 
          icon={<Coins className="w-5 h-5 text-neutral-400" />} 
          highlight={plusvalia > 0}
        />
      </div>

      {/* Tabla de Activos */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50">
          <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">Activos en Fideicomiso</h2>
        </div>
        
        {assets.length === 0 ? (
          <div className="p-10 text-center text-neutral-500">
            No tienes activos registrados aún.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-medium tracking-wider">Activo / Proyecto</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Aporte Inicial</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Valor Actual</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Estado Legal</th>
                  <th className="px-6 py-4 font-medium tracking-wider text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-medium text-neutral-900 dark:text-neutral-100">{asset.name}</div>
                      <div className="text-xs text-neutral-500 mt-1">{asset.trusts?.name || 'Fideicomiso Maestro'}</div>
                    </td>
                    <td className="px-6 py-5">${Number(asset.valor_fiat_inicial).toLocaleString()}</td>
                    <td className="px-6 py-5 font-medium text-emerald-600 dark:text-emerald-400">
                      ${Number(asset.valor_fiat_actual).toLocaleString()}
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={asset.estado} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        disabled={asset.estado !== 'liquidated'}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                          asset.estado === 'liquidated' 
                            ? 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200' 
                            : 'bg-neutral-100 text-neutral-400 cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-600'
                        }`}
                      >
                        Reclamar USDC
                        {asset.estado === 'liquidated' && <ArrowRight className="w-3 h-3" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-componentes UI (Quiet Luxury)

function KpiCard({ title, value, icon, trend, highlight }: { title: string, value: string, icon: React.ReactNode, trend?: string, highlight?: boolean }) {
  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</h3>
        <div className="p-2 bg-neutral-50 dark:bg-neutral-800 rounded-full">{icon}</div>
      </div>
      <div className="flex items-baseline gap-3">
        <span className={`text-3xl font-light tracking-tight ${highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
          {value}
        </span>
        {trend && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: AssetStatus }) {
  const styles = {
    active: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    in_liquidation: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    liquidated: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  };

  const labels = {
    active: 'Vigente (Maduración)',
    in_liquidation: 'En Liquidación',
    liquidated: 'Liquidado',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status === 'active' && <RefreshCw className="w-3 h-3 animate-spin-slow" />}
      {status === 'in_liquidation' && <AlertCircle className="w-3 h-3" />}
      {status === 'liquidated' && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
      {labels[status]}
    </span>
  );
}

function PortfolioSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 p-6 md:p-10 animate-pulse">
      <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4 mb-10"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-neutral-100 dark:bg-neutral-900 h-32 rounded-2xl border border-neutral-200 dark:border-neutral-800"></div>
        ))}
      </div>

      <div className="bg-neutral-100 dark:bg-neutral-900 h-64 rounded-2xl border border-neutral-200 dark:border-neutral-800 mt-10"></div>
    </div>
  );
}
