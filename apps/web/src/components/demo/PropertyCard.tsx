'use client'
import { useState, useEffect } from 'react'
import { useDemoStore } from '@/lib/demo/useDemoStore'
import { BuyTokensModal } from './BuyTokensModal'

export function PropertyCard() {
  const { property, investor, loadProperty } = useDemoStore()
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => { loadProperty() }, [])

  if (!property) {
    return (
      <div className="rounded-2xl bg-pn-surface border border-pn-border p-6 animate-pulse">
        <div className="h-48 bg-pn-surface-strong rounded-xl mb-4" />
        <div className="space-y-2">
          <div className="h-5 bg-pn-surface-strong rounded w-2/3" />
          <div className="h-4 bg-pn-surface-strong rounded w-1/2" />
        </div>
      </div>
    )
  }

  const p = property as Record<string, unknown>
  const tokensSold = p.tokens_sold as number ?? 0
  const totalTokens = p.total_tokens as number ?? 100000
  const tokensReserved = p.tokens_reserved as number ?? 0
  const progressPct = Math.round((tokensSold / totalTokens) * 100)
  const tokenPrice = p.token_price_usd as number ?? 10
  const yieldPct = p.annual_yield_pct as number ?? 8.5
  const valuation = p.total_valuation_usd as number ?? 1000000

  return (
    <>
      <div className="rounded-2xl bg-pn-surface border border-pn-border overflow-hidden">
        {/* Imagen / banner */}
        <div className="relative h-44 bg-gradient-to-br from-slate-800 to-slate-900 flex items-end">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80')] bg-cover bg-center opacity-40" />
          <div className="relative px-5 py-4 w-full">
            <div className="flex gap-2 mb-2">
              <span className="rounded-full bg-green-500/20 border border-green-500/40 px-2.5 py-0.5 text-xs font-semibold text-green-400 uppercase">● Activa</span>
              <span className="rounded-full bg-pn-gold/20 border border-pn-gold/40 px-2.5 py-0.5 text-xs font-semibold text-pn-gold uppercase">Genesis Round</span>
            </div>
            <h3 className="text-white text-lg font-bold leading-tight">{p.name as string}</h3>
            <p className="text-white/60 text-xs mt-0.5">{p.district as string}, {p.city as string}</p>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-3 divide-x divide-pn-border border-b border-pn-border">
          <div className="px-4 py-3 text-center">
            <p className="text-xs text-pn-text-muted">Precio Token</p>
            <p className="text-base font-bold text-pn-gold">${tokenPrice}</p>
          </div>
          <div className="px-4 py-3 text-center">
            <p className="text-xs text-pn-text-muted">Yield APY</p>
            <p className="text-base font-bold text-green-400">{yieldPct}%</p>
          </div>
          <div className="px-4 py-3 text-center">
            <p className="text-xs text-pn-text-muted">Valoración</p>
            <p className="text-base font-bold text-pn-text">${(valuation / 1000).toFixed(0)}K</p>
          </div>
        </div>

        {/* Progreso de tokenización */}
        <div className="px-5 py-4">
          <div className="flex justify-between text-xs text-pn-text-muted mb-2">
            <span>{tokensSold.toLocaleString()} tokens vendidos</span>
            <span>{progressPct}% completado</span>
          </div>
          <div className="h-2 rounded-full bg-pn-surface-strong overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pn-gold to-amber-300 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-pn-text-muted mt-1.5">
            <span>{(totalTokens - tokensSold - tokensReserved).toLocaleString()} disponibles</span>
            <span>{totalTokens.toLocaleString()} total</span>
          </div>
        </div>

        {/* CTA */}
        <div className="px-5 pb-5">
          <button
            onClick={() => setModalOpen(true)}
            disabled={!investor}
            className="w-full py-3.5 rounded-xl bg-pn-gold text-black font-bold text-sm hover:bg-pn-gold/90 disabled:opacity-40 transition-all shadow-lg shadow-pn-gold/20"
          >
            Comprar Tokens Genesis
          </button>
          <p className="text-center text-xs text-pn-text-muted mt-2">Mínimo 1 token · Pago en USD simulado</p>
        </div>
      </div>

      <BuyTokensModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tokenPrice={tokenPrice}
        propertyName={p.name as string}
      />
    </>
  )
}
