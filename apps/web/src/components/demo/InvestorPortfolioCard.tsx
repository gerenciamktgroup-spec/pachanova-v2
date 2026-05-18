'use client'
import { useEffect } from 'react'
import { useDemoStore } from '@/lib/demo/useDemoStore'

export function InvestorPortfolioCard() {
  const { investor, property, loading, loadProfile, loadProperty } = useDemoStore()

  useEffect(() => {
    loadProfile()
    loadProperty()
  }, [])

  if (loading || !investor) {
    return (
      <div className="rounded-2xl bg-pn-surface border border-pn-border p-6 animate-pulse space-y-4">
        <div className="h-4 bg-pn-surface-strong rounded w-1/3" />
        <div className="h-8 bg-pn-surface-strong rounded w-1/2" />
        <div className="grid grid-cols-3 gap-3">
          {[0,1,2].map(i => <div key={i} className="h-16 bg-pn-surface-strong rounded-xl" />)}
        </div>
      </div>
    )
  }

  const yieldPct = (property as Record<string,unknown>)?.annual_yield_pct as number ?? 8.5
  const tokenPrice = (property as Record<string,unknown>)?.token_price_usd as number ?? 10
  const portfolioValueUsd = investor.available_tokens * tokenPrice
  const monthlyYield = (portfolioValueUsd * yieldPct / 100) / 12

  return (
    <div className="rounded-2xl bg-pn-surface border border-pn-border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-pn-surface to-pn-surface-strong border-b border-pn-border flex items-center justify-between">
        <div>
          <p className="text-xs text-pn-text-muted uppercase tracking-wider">Portafolio Demo</p>
          <h3 className="text-pn-text font-semibold">{investor.first_name} {investor.last_name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            investor.kyc_status === 'approved' ? 'bg-green-400' : 'bg-amber-400'
          }`} />
          <span className="text-xs text-pn-text-muted capitalize">{investor.kyc_status}</span>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-pn-border">
        <MetricCell
          label="Saldo USD"
          value={`$${investor.available_usd.toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
          sub="disponible"
          accent="gold"
        />
        <MetricCell
          label="Tokens Genesis"
          value={investor.available_tokens.toLocaleString()}
          sub={`≈ $${portfolioValueUsd.toLocaleString('en-US', { minimumFractionDigits: 0 })} USD`}
          accent="teal"
        />
        <MetricCell
          label="Total Invertido"
          value={`$${investor.total_invested_usd.toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
          sub="acumulado"
        />
        <MetricCell
          label="Yield Mensual Est."
          value={`$${monthlyYield.toFixed(0)}`}
          sub={`${yieldPct}% APY`}
          accent="green"
        />
      </div>

      {/* Posiciones de tokens */}
      {investor.token_positions.length > 0 && (
        <div className="px-6 py-4 border-t border-pn-border">
          <p className="text-xs text-pn-text-muted uppercase tracking-wider mb-3">Posiciones Activas</p>
          <div className="space-y-2">
            {investor.token_positions.slice(0, 3).map((pos, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-pn-surface-strong px-4 py-2.5">
                <div>
                  <p className="text-sm font-medium text-pn-text">{pos.property_name}</p>
                  <p className="text-xs text-pn-text-muted font-mono">{pos.tx_hash.slice(0, 20)}...</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-pn-gold">{pos.amount.toLocaleString()} TKN</p>
                  <p className="text-xs text-pn-text-muted">${(pos.amount * tokenPrice).toLocaleString()} USD</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Últimas transacciones */}
      {investor.recent_transactions.length > 0 && (
        <div className="px-6 py-4 border-t border-pn-border">
          <p className="text-xs text-pn-text-muted uppercase tracking-wider mb-3">Últimas Transacciones</p>
          <div className="space-y-1.5">
            {investor.recent_transactions.slice(0, 4).map((tx, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    tx.status === 'completed' ? 'bg-green-400' : 'bg-amber-400'
                  }`} />
                  <span className="text-pn-text capitalize">{tx.type}</span>
                  <span className="text-pn-text-muted font-mono text-xs">{tx.tx_hash?.slice(0, 12)}...</span>
                </div>
                <span className="text-pn-gold font-semibold">${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCell({
  label, value, sub, accent,
}: {
  label: string; value: string; sub: string; accent?: 'gold' | 'teal' | 'green'
}) {
  const colors = {
    gold: 'text-pn-gold',
    teal: 'text-teal-400',
    green: 'text-green-400',
    undefined: 'text-pn-text',
  }
  return (
    <div className="px-5 py-4">
      <p className="text-xs text-pn-text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xl font-bold tabular-nums ${colors[accent as keyof typeof colors] ?? colors.undefined}`}>{value}</p>
      <p className="text-xs text-pn-text-muted mt-0.5">{sub}</p>
    </div>
  )
}
