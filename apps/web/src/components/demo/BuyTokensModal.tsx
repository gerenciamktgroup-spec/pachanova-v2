'use client'
import { useState, useEffect } from 'react'
import { useDemoStore } from '@/lib/demo/useDemoStore'

interface BuyTokensModalProps {
  open: boolean
  onClose: () => void
  tokenPrice?: number
  propertyName?: string
}

export function BuyTokensModal({
  open,
  onClose,
  tokenPrice = 10,
  propertyName = 'Torre Miraflores - Pacific View',
}: BuyTokensModalProps) {
  const { investor, buyLoading, lastTx, buyTokens, clearLastTx } = useDemoStore()
  const [quantity, setQuantity] = useState(100)
  const [step, setStep] = useState<'form' | 'confirm' | 'success' | 'error'>('form')

  const total = quantity * tokenPrice
  const canAfford = (investor?.available_usd ?? 0) >= total

  useEffect(() => {
    if (!open) { setStep('form'); setQuantity(100); clearLastTx() }
  }, [open])

  useEffect(() => {
    if (lastTx?.ok === true) setStep('success')
    if (lastTx?.ok === false) setStep('error')
  }, [lastTx])

  const handleBuy = async () => {
    if (step === 'form') { setStep('confirm'); return }
    await buyTokens(quantity)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-pn-surface border border-pn-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-pn-border">
          <div>
            <p className="text-xs text-pn-text-muted uppercase tracking-wider font-medium">Comprar Tokens Genesis</p>
            <h2 className="text-lg font-semibold text-pn-text">{propertyName}</h2>
          </div>
          <button onClick={onClose} className="text-pn-text-muted hover:text-pn-text transition-colors text-xl leading-none">&times;</button>
        </div>

        {step === 'form' && (
          <div className="px-6 py-5 space-y-5">
            {/* Saldo disponible */}
            <div className="rounded-xl bg-pn-surface-strong border border-pn-border p-4 flex justify-between items-center">
              <span className="text-sm text-pn-text-muted">Saldo disponible</span>
              <span className="text-lg font-bold text-pn-gold">
                ${investor?.available_usd?.toLocaleString('en-US', { minimumFractionDigits: 2 }) ?? '---'}
              </span>
            </div>

            {/* Cantidad */}
            <div>
              <label className="text-sm font-medium text-pn-text mb-2 block">Cantidad de tokens</label>
              <div className="flex gap-2">
                {[50, 100, 250, 500].map(q => (
                  <button
                    key={q}
                    onClick={() => setQuantity(q)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      quantity === q
                        ? 'bg-pn-gold text-black border-pn-gold'
                        : 'bg-pn-surface-strong border-pn-border text-pn-text-muted hover:border-pn-gold/50'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={1}
                max={9999}
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="mt-3 w-full rounded-lg border border-pn-border bg-pn-bg px-4 py-2.5 text-pn-text text-sm focus:outline-none focus:border-pn-gold"
              />
            </div>

            {/* Resumen */}
            <div className="rounded-xl bg-pn-surface-strong border border-pn-border p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-pn-text-muted">Precio por token</span>
                <span className="text-pn-text font-medium">${tokenPrice.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pn-text-muted">Cantidad</span>
                <span className="text-pn-text font-medium">{quantity.toLocaleString()} tokens</span>
              </div>
              <div className="border-t border-pn-border pt-2 flex justify-between">
                <span className="text-pn-text font-semibold">Total a pagar</span>
                <span className={`text-lg font-bold ${canAfford ? 'text-pn-gold' : 'text-red-400'}`}>
                  ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </span>
              </div>
            </div>

            {!canAfford && (
              <p className="text-xs text-red-400 text-center">Saldo insuficiente para esta operación</p>
            )}

            <button
              disabled={!canAfford}
              onClick={handleBuy}
              className="w-full py-3.5 rounded-xl bg-pn-gold text-black font-bold text-sm hover:bg-pn-gold/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Continuar →
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="px-6 py-5 space-y-5">
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 text-center">
              <p className="text-amber-400 font-semibold text-lg">{quantity.toLocaleString()} tokens</p>
              <p className="text-pn-text-muted text-sm mt-1">por ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</p>
            </div>
            <p className="text-sm text-pn-text-muted text-center">¿Confirmas la compra? Esta operación se registrará en Supabase y actualizará tu portafolio en tiempo real.</p>
            <div className="flex gap-3">
              <button onClick={() => setStep('form')} className="flex-1 py-3 rounded-xl border border-pn-border text-pn-text-muted hover:text-pn-text text-sm font-medium transition-all">
                Volver
              </button>
              <button
                onClick={handleBuy}
                disabled={buyLoading}
                className="flex-1 py-3 rounded-xl bg-pn-gold text-black font-bold text-sm hover:bg-pn-gold/90 disabled:opacity-70 transition-all"
              >
                {buyLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Procesando...
                  </span>
                ) : 'Confirmar Compra'}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && lastTx?.ok && (
          <div className="px-6 py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto text-3xl">✅</div>
            <h3 className="text-xl font-bold text-pn-text">¡Compra exitosa!</h3>
            <p className="text-pn-text-muted text-sm">
              Adquiriste <span className="text-pn-gold font-bold">{lastTx.quantity?.toLocaleString()} tokens</span> por
              <span className="text-pn-gold font-bold"> ${lastTx.total_usd?.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</span>
            </p>
            <div className="rounded-xl bg-pn-surface-strong border border-pn-border p-3 text-left text-xs space-y-1">
              <p className="text-pn-text-muted">TX Hash</p>
              <p className="text-pn-text font-mono break-all">{lastTx.tx_hash}</p>
              <p className="text-pn-text-muted mt-2">Nuevo saldo</p>
              <p className="text-pn-gold font-bold">${lastTx.new_balance_usd?.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</p>
            </div>
            <button onClick={onClose} className="w-full py-3 rounded-xl bg-pn-surface-strong border border-pn-border text-pn-text font-medium text-sm hover:border-pn-gold/50 transition-all">
              Ver Portafolio
            </button>
          </div>
        )}

        {step === 'error' && (
          <div className="px-6 py-8 text-center space-y-4">
            <div className="text-4xl">❌</div>
            <h3 className="text-lg font-bold text-pn-text">Error en la operación</h3>
            <p className="text-red-400 text-sm">{lastTx?.error ?? 'Error desconocido'}</p>
            <button onClick={() => setStep('form')} className="w-full py-3 rounded-xl bg-pn-surface-strong border border-pn-border text-pn-text font-medium text-sm">
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* Footer demo badge */}
        <div className="px-6 py-3 bg-pn-surface-strong border-t border-pn-border flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-pn-gold animate-pulse" />
          <span className="text-xs text-pn-text-muted">Modo Demo — Transacción real en Supabase, sin dinero real</span>
        </div>
      </div>
    </div>
  )
}
