export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { RouteBreadcrumbs } from '@/components/mission/RouteBreadcrumbs';
import Link from 'next/link';

async function fetchTreasuryData() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { available: 500000, sold: 0, totalOrders: 0, orders: [] };
  }
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  const [treasury, orders] = await Promise.all([
    sb.from('balances').select('available_tokens').eq('investor_id', 'PACHANOVA_TREASURY').maybeSingle(),
    sb.from('token_orders').select('quantity,unit_price,total_amount,created_at,investor_id').order('created_at', { ascending: false }).limit(20),
  ]);

  const available = Number(treasury.data?.available_tokens || 500000);
  const sold = 500000 - available;
  return {
    available,
    sold,
    totalOrders: orders.data?.length || 0,
    orders: orders.data || [],
  };
}

export default async function TreasuryPage() {
  const t = await fetchTreasuryData();
  const pct = ((t.sold / 500000) * 100).toFixed(2);

  return (
    <div className="space-y-8 pb-24">
      <RouteBreadcrumbs items={[
        { label: 'Admin', href: '/dashboard/admin' },
        { label: 'Bóveda Maestra' }
      ]} />

      <div>
        <h1 className="text-2xl font-light text-pn-gold">Bóveda Maestra PACHA</h1>
        <p className="text-sm text-pn-text-muted mt-1">5 hectáreas tokenizadas · 500,000 tokens totales · $1.00 USD/token base Genesis</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-pn-surface-strong border border-pn-gold/30 rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-pn-gold">{t.available.toLocaleString()}</div>
          <div className="text-sm text-pn-text-muted mt-1">Tokens disponibles</div>
        </div>
        <div className="bg-pn-surface-strong border border-pn-border rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-pn-text">{t.sold.toLocaleString()}</div>
          <div className="text-sm text-pn-text-muted mt-1">Tokens vendidos</div>
        </div>
        <div className="bg-pn-surface-strong border border-pn-border rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-pn-text">{pct}%</div>
          <div className="text-sm text-pn-text-muted mt-1">Del total vendido</div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="bg-pn-surface-strong border border-pn-border rounded-xl p-6">
        <div className="flex justify-between text-sm text-pn-text-muted mb-3">
          <span>Progreso de venta Genesis</span>
          <span>{pct}% de 500,000 PACHA</span>
        </div>
        <div className="w-full bg-pn-bg rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pn-gold to-yellow-300 rounded-full transition-all duration-700"
            style={{ width: `${Math.max(Number(pct), 0.5)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-pn-text-soft mt-2">
          <span>0</span>
          <span>500,000</span>
        </div>
      </div>

      {/* Últimas órdenes */}
      <div className="bg-pn-surface-strong border border-pn-border rounded-xl p-6">
        <h3 className="font-medium text-pn-text mb-4">Últimas órdenes Genesis ({t.totalOrders})</h3>
        {t.orders.length === 0 ? (
          <p className="text-pn-text-muted text-sm">Sin órdenes aún. Los tokens están esperando sus primeros compradores.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-pn-text-muted border-b border-pn-border">
                  <th className="text-left py-2 pr-4">Inversor</th>
                  <th className="text-right py-2 pr-4">Tokens</th>
                  <th className="text-right py-2 pr-4">Precio</th>
                  <th className="text-right py-2">Total USD</th>
                </tr>
              </thead>
              <tbody>
                {t.orders.map((o: Record<string, string>, i: number) => (
                  <tr key={i} className="border-b border-pn-border/50 hover:bg-pn-bg/30">
                    <td className="py-2 pr-4 text-pn-text-muted font-mono text-xs">{o.investor_id?.slice(0, 12)}...</td>
                    <td className="py-2 pr-4 text-right text-pn-gold">{Number(o.quantity).toLocaleString()}</td>
                    <td className="py-2 pr-4 text-right text-pn-text">${Number(o.unit_price).toFixed(2)}</td>
                    <td className="py-2 text-right text-pn-text">${Number(o.total_amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Link href="/dashboard/admin" className="text-sm text-pn-text-muted hover:text-pn-gold transition-colors">← Volver al panel</Link>
      </div>
    </div>
  );
}
