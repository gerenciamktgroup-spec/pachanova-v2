'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { getInvestorId } from '@/app/signup/actions'

export default function OnboardingWizard() {
  const [step, setStep] = useState(1)
  const [investorId, setInvestorId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [depositAmount, setDepositAmount] = useState(10000)
  const [kycStatus, setKycStatus] = useState<'pending' | 'approved'>('pending')
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      const id = await getInvestorId()
      if (!id) {
        router.push('/signup')
        return
      }
      setInvestorId(id)
      setLoading(false)
    }
    loadUser()
  }, [])

  const handleApproveKyc = async () => {
    if (!investorId) return
    setLoading(true)
    try {
      const res = await fetch('/api/demo/actions/approve-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investorId })
      })
      if (res.ok) {
        setKycStatus('approved')
        setStep(2)
      } else {
        const err = await res.json()
        console.error('KYC approve error:', err)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDeposit = async () => {
    if (!investorId) return
    setLoading(true)
    try {
      const res = await fetch('/api/demo/actions/simulated-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investorId, amountUsd: depositAmount })
      })
      if (res.ok) {
        setStep(3)
      } else {
        const err = await res.json()
        console.error('Deposit error:', err)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !investorId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-pn-text animate-pulse">Cargando tu cuenta...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-10">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className={`flex flex-col items-center gap-1`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                step > s
                  ? 'bg-pn-gold border-pn-gold text-pn-bg'
                  : step === s
                  ? 'border-pn-gold text-pn-gold bg-transparent'
                  : 'border-pn-border text-pn-text-muted bg-transparent'
              }`}>
                {step > s ? '✓' : s}
              </div>
              <span className={`text-xs ${ step >= s ? 'text-pn-text' : 'text-pn-text-muted' }`}>
                {s === 1 ? 'Identidad' : s === 2 ? 'Fondos' : 'Listo'}
              </span>
            </div>
            {s < 3 && (
              <div className={`flex-1 h-0.5 mx-2 transition-all ${ step > s ? 'bg-pn-gold' : 'bg-pn-border' }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-pn-surface-strong border border-pn-border rounded-xl p-8 pn-glow-soft">

        {/* STEP 1: KYC */}
        {step === 1 && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto">
              <span className="text-3xl">📋</span>
            </div>
            <h2 className="text-2xl font-light text-pn-gold">Verificación de Identidad</h2>
            <p className="text-pn-text-muted">
              Tu cuenta fue creada exitosamente. Tu documentación KYC está siendo revisada.
            </p>
            <div className="bg-pn-bg rounded-lg p-4 border border-yellow-500/30 text-sm text-yellow-400">
              ⏳ Estado actual: <strong>PENDIENTE DE REVISIÓN</strong>
            </div>
            <p className="text-xs text-pn-text-soft">
              En el entorno demo, el administrador puede aprobar tu KYC de inmediato.
              Hacé click en el botón para simular la aprobación.
            </p>
            <button
              onClick={handleApproveKyc}
              disabled={loading}
              className="bg-pn-gold hover:bg-pn-gold/90 text-pn-bg font-medium px-8 py-3 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Procesando...' : '✅ Aprobar KYC (Demo)'}
            </button>
          </div>
        )}

        {/* STEP 2: Depósito simulado */}
        {step === 2 && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <span className="text-3xl">💵</span>
            </div>
            <h2 className="text-2xl font-light text-pn-gold">Fondos Simulados</h2>
            <div className="bg-pn-bg rounded-lg p-3 border border-green-500/30 text-sm text-green-400 mb-2">
              ✅ KYC aprobado — ya podés invertir
            </div>
            <p className="text-pn-text-muted">
              Depositá fondos simulados para comenzar a comprar tokens PACHA.
            </p>

            <div className="flex flex-col items-center gap-3 max-w-xs mx-auto">
              <label className="text-sm text-pn-text-soft self-start">Monto a depositar (USD):</label>
              <input
                type="range"
                min={1000}
                max={100000}
                step={1000}
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full accent-pn-gold"
              />
              <div className="text-3xl font-light text-pn-gold">
                ${depositAmount.toLocaleString()} USD
              </div>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full bg-pn-bg border border-pn-border text-pn-text p-2 rounded text-center focus:outline-none focus:border-pn-gold text-sm"
              />
            </div>

            <button
              onClick={handleDeposit}
              disabled={loading}
              className="bg-pn-gold hover:bg-pn-gold/90 text-pn-bg font-medium px-8 py-3 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Procesando pago...' : '💳 Simular Depósito'}
            </button>
          </div>
        )}

        {/* STEP 3: Listo */}
        {step === 3 && (
          <div className="text-center space-y-6">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
            <h2 className="text-2xl font-light text-pn-text">¡Todo listo para invertir!</h2>
            <p className="text-pn-text-muted text-sm">Tu cuenta está configurada y con fondos disponibles.</p>
            <div className="bg-pn-bg p-5 rounded-lg border border-pn-border text-left space-y-3 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-pn-text-soft text-sm">Estado KYC</span>
                <span className="text-green-500 font-bold text-sm">APROBADO ✅</span>
              </div>
              <div className="border-t border-pn-border pt-3 flex justify-between">
                <span className="text-pn-text-soft text-sm">Saldo USD</span>
                <span className="text-pn-gold font-bold">${depositAmount.toLocaleString()}</span>
              </div>
              <div className="border-t border-pn-border pt-3 flex justify-between">
                <span className="text-pn-text-soft text-sm">Tokens PACHA</span>
                <span className="text-pn-text font-bold">0 (comprá en Genesis)</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <button
                onClick={() => router.push('/dashboard/investor/genesis')}
                className="bg-pn-gold hover:bg-pn-gold/90 text-pn-bg font-medium px-6 py-3 rounded-md transition-colors w-full"
              >
                🪙 Comprar Tokens Genesis
              </button>
              <button
                onClick={() => router.push('/dashboard/investor')}
                className="bg-pn-surface hover:bg-pn-surface/80 border border-pn-border text-pn-text font-medium px-6 py-3 rounded-md transition-colors w-full"
              >
                Ver mi Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
