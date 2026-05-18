export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { RouteBreadcrumbs } from '@/components/mission/RouteBreadcrumbs';
import { LoadingState } from '@/components/mission/StateComponents';

async function fetchAdminOverview() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      totalUsers: 3, kycPending: 1, kycApproved: 2,
      totalUsdDeposited: 25000, totalTokensSold: 1200,
      treasuryAvailable: 498800, recentActions: [],
    };
  }
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  const [investors, kycPend, kycApproved, balances, treasury, recentLogs] = await Promise.all([
    sb.from('investors').select('id', { count: 'exact', head: true }),
    sb.from('kyc_documents').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    sb.from('kyc_documents').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    sb.from('balances').select('available_usd').neq('investor_id', '00000000-0000-0000-0000-000000000000'),
    sb.from('balances').select('available_tokens').eq('investor_id', '00000000-0000-0000-0000-000000000000').maybeSingle(),
    sb.from('audit_logs').select('action,details,created_at').order('created_at', { ascending: false }).limit(8),
  ]);

  const totalUsd = (balances.data || []).reduce((acc, b) => acc + Number(b.available_usd || 0), 0);
  return {
    totalUsers: investors.count || 0,
    kycPending: kycPend.count || 0,
    kycApproved: kycApproved.count || 0,
    totalUsdDeposited: totalUsd,
    totalTokensSold: 500000 - Number(treasury.data?.available_tokens || 500000),
    treasuryAvailable: Number(treasury.data?.available_tokens || 500000),
    recentActions: recentLogs.data || [],
  };
}

async function AdminOverviewContent() {
  const data = await fetchAdminOverview();

  const metricCards = [
    { label: 'Inversores registrados', value: data.totalUsers, icon: '👥', href: '/dashboard/admin/users', color: 'border-blue-500/30' },
    { label: 'KYC Pendientes', value: data.kycPending, icon: '📔', href: '/dashboard/admin/kyc-review', color: data.kycPending > 0 ? 'border-yellow-500/60' : 'border-pn-border', alert: data.kycPending > 0 },
    { label: 'KYC Aprobados', value: data.kycApproved, icon: '✅', href: '/dashboard/admin/kyc-review', color: 'border-green-500/30' },
    { label: 'USD en cuentas', value: `$${data.totalUsdDeposited.toLocaleString()}`, icon: '💵', href: '/dashboard/admin/balances', color: 'border-pn-border' },
    { label: 'Tokens vendidos', value: data.totalTokensSold.toLocaleString(), icon: '🪙', href: '/dashboard/admin/treasury', color: 'border-pn-border' },
    { label: 'Bóveda disponible', value: data.treasuryAvailable.toLocaleString(), icon: '🏰', href: '/dashboard/admin/treasury', color: 'border-pn-gold/40' },
  ];

  const navItems = [
    { label: '📔 Revisar KYC', href: '/dashboard/admin/kyc-review', description: 'Ver documentos · Aprobar / Denegar', urgent: data.kycPending > 0 },
    { label: '🏰 Bóveda', href: '/dashboard/admin/treasury', description: '500,000 PACHA · stock en tiempo real' },
    { label: '💰 Control de Saldos', href: '/dashboard/admin/balances', description: 'Editar USD y tokens de cualquier cuenta' },
    { label: '📊 Órdenes Genesis', href: '/dashboard/admin/token-orders', description: 'Historial de compras de tokens' },
    { label: '🔊 Anuncios', href: '/dashboard/admin/announcements', description: 'Emitir avisos a todos los inversores' },
    { label: '📝 Auditóa', href: '/dashboard/admin/audit', description: 'Log completo de operaciones' },
  ];

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <RouteBreadcrumbs items={[{ label: 'Dashboard' }, { label: 'Consola Maestra' }]} />
        <div className="flex gap-2 flex-wrap">
          {navItems.slice(0, 3).map(n => (
            <Link key={n.href} href={n.href}
              className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                n.urgent
                  ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10 animate-pulse'
                  : 'border-pn-border text-pn-text-muted hover:text-pn-text hover:border-pn-gold'
              }`}>
              {n.label} {n.urgent ? `(¡${data.kycPending}!)` : ''}
            </Link>
          ))}
        </div>
      </div>

      {/* Alerta KYC pendiente */}
      {data.kycPending > 0 && (
        <Link href="/dashboard/admin/kyc-review"
          className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4 hover:bg-yellow-500/15 transition-colors">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-medium text-yellow-400">{data.kycPending} documento{data.kycPending > 1 ? 's' : ''} KYC esperando revisión</p>
            <p className="text-xs text-yellow-400/70">Click para revisar y aprobar →</p>
          </div>
        </Link>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {metricCards.map(m => (
          <Link key={m.href + m.label} href={m.href}
            className={`bg-pn-surface-strong border ${m.color} rounded-xl p-4 hover:border-pn-gold/50 transition-colors group`}>
            <div className="text-2xl mb-2">{m.icon}</div>
            <div className="text-xl font-bold text-pn-text group-hover:text-pn-gold transition-colors">{m.value}</div>
            <div className="text-xs text-pn-text-muted mt-1">{m.label}</div>
          </Link>
        ))}
      </div>

      {/* Nav principal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {navItems.map(n => (
          <Link key={n.href} href={n.href}
            className={`bg-pn-surface-strong border rounded-xl p-5 hover:border-pn-gold transition-colors group ${
              n.urgent ? 'border-yellow-500/50' : 'border-pn-border'
            }`}>
            <div className="text-lg font-medium text-pn-text group-hover:text-pn-gold transition-colors">{n.label}</div>
            <div className="text-xs text-pn-text-muted mt-1">{n.description}</div>
          </Link>
        ))}
      </div>

      {/* Actividad reciente */}
      <div className="bg-pn-surface-strong border border-pn-border rounded-xl p-6">
        <h3 className="text-sm font-medium text-pn-text-muted uppercase tracking-wider mb-4">Últimas operaciones auditadas</h3>
        {data.recentActions.length === 0 ? (
          <p className="text-pn-text-muted text-sm">Sin actividad aún.</p>
        ) : (
          <div className="space-y-3">
            {data.recentActions.map((log: Record<string, string>, i: number) => (
              <div key={i} className="flex gap-3 text-sm border-b border-pn-border/50 pb-3 last:border-0">
                <span className="text-pn-text-muted text-xs shrink-0 pt-0.5">
                  {new Date(log.created_at).toLocaleString('es', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                <div>
                  <span className="text-pn-gold font-mono text-xs">{log.action}</span>
                  <p className="text-pn-text-soft text-xs mt-0.5">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<LoadingState message="Cargando consola maestra..." />}>
      <AdminOverviewContent />
    </Suspense>
  );
}
