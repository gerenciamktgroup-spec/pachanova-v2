'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Upload, DollarSign, ShieldCheck } from 'lucide-react'
import { getInvestorId } from '@/app/signup/actions'

export default function OnboardingWizard() {
  const [step, setStep] = useState(1)
  const [investorId, setInvestorId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [depositAmount, setDepositAmount] = useState(10000)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      try {
        const id = await getInvestorId()
        if (!id) {
          router.push('/signup?error=no_session')
          return
        }
        setInvestorId(id)
      } catch (e) {
        router.push('/signup?error=session_error')
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  const handleApproveKyc = async () => {
    if (!investorId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/demo/actions/approve-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investorId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error aprobando KYC')
      setStep(2)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeposit = async () => {
    if (!investorId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/demo/actions/simulated-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investorId, amountUsd: depositAmount })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error en depósito')
      setStep(3)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !investorId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-pn-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-pn-text-muted text-sm">Cargando tu cuenta...</p>
        </div>
      </div>
    )
  }

  const steps = [
    { id: 1, label: 'KYC', icon: ShieldCheck },
    { id: 2, label: 'Depósito', icon: DollarSign },
    { id: 3, label: 'Listo', icon: CheckCircle2 },
  ]

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-10 gap-0">
        {steps.map((s, idx) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step > s.id ? 'bg-pn-gold border-pn-gold text-pn-bg' :
                step === s.id ? 'border-pn-gold text-pn-gold bg-pn-surface-strong' :
                'border-pn-border text-pn-text-soft bg-pn-surface'
              }`}>
                <s.icon className="w-4 h-4" />
              </div>
              <span className={`text-xs ${ step >= s.id ? 'text-pn-gold' : 'text-pn-text-soft' }`}>{s.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`h-0.5 w-16 mb-4 transition-all ${ step > s.id ? 'bg-pn-gold' : 'bg-pn-border' }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-pn-surface-strong border border-pn-border rounded-xl p-8 pn-glow-soft">
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-2xl font-light text-pn-gold mb-2">Verificación de Identidad</h2>
              <p className="text-pn-text-muted text-sm">Tu documentación fue recibida y está siendo revisada.</p>
              <p className="text-xs text-pn-text-soft mt-2">Estado KYC: <span className="font-bold text-yellow-500">PENDING</span></p>
            </div>
            <div className="bg-pn-bg border border-pn-border rounded-lg p-4 text-left text-sm">
              <p className="text-pn-text-soft text-xs mb-2">En la demo, el administrador puede aprobar tu KYC en tiempo real desde su panel maestro.</p>
              <p className="text-xs text-pn-text-soft">O podés auto-aprobar aquí para continuar el flujo:</p>
            </div>
            <button
              onClick={handleApproveKyc}
              disabled={loading}
              className="bg-pn-gold hover:bg-pn-gold/90 text-pn-bg font-medium px-8 py-3 rounded-md transition-colors disabled:opacity-50 w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-pn-bg border-t-transparent rounded-full animate-spin" />
                  Procesando...
                </span>
              ) : 'Continuar (KYC aprobado)'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-light text-pn-gold mb-2">Fondos Simulados</h2>
              <p className="text-pn-text-muted text-sm">Seleccioná el monto de tu depósito inicial simulado.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {[5000, 10000, 25000, 50000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setDepositAmount(amt)}
                    className={`py-2 px-3 rounded border text-sm transition-all ${
                      depositAmount === amt
                        ? 'bg-pn-gold text-pn-bg border-pn-gold font-medium'
                        : 'border-pn-border text-pn-text hover:border-pn-gold/50'
                    }`}
                  >
                    ${(amt/1000).toFixed(0)}k
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-pn-text-soft text-left">Monto personalizado (USD):</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  min="100"
                  max="500000"
                  className="w-full bg-pn-bg border border-pn-border text-pn-text p-3 rounded focus:outline-none focus:border-pn-gold text-center text-lg font-light"
                />
              </div>
              <p className="text-xs text-pn-text-soft">
                A $1.00/token, podrás comprar hasta <span className="text-pn-gold font-medium">{depositAmount.toLocaleString()} tokens PACHA</span>
              </p>
            </div>

            <button
              onClick={handleDeposit}
              disabled={loading || depositAmount < 100}
              className="bg-pn-gold hover:bg-pn-gold/90 text-pn-bg font-medium px-8 py-3 rounded-md transition-colors disabled:opacity-50 w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-pn-bg border-t-transparent rounded-full animate-spin" />
                  Procesando depósito...
                </span>
              ) : `Depositar $${depositAmount.toLocaleString()} USD (Simulado)`}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
            <div>
              <h2 className="text-2xl font-light text-pn-text mb-1">¡Listo para invertir!</h2>
              <p className="text-pn-text-muted text-sm">Tu cuenta está verificada y con fondos disponibles.</p>
            </div>
            <div className="bg-pn-bg p-5 rounded-lg border border-pn-border text-left space-y-3">
              <div className="flex justify-between items-center border-b border-pn-border pb-2">
                <span className="text-pn-text-soft text-sm">Estado KYC</span>
                <span className="text-green-500 font-bold text-sm">✅ APPROVED</span>
              </div>
              <div className="flex justify-between items-center border-b border-pn-border pb-2">
                <span className="text-pn-text-soft text-sm">Balance disponible</span>
                <span className="text-pn-gold font-bold text-lg">${depositAmount.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-pn-text-soft text-sm">Tokens disponibles a comprar</span>
                <span className="text-pn-text font-medium text-sm">{depositAmount.toLocaleString()} PACHA</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard/investor')}
              className="bg-pn-gold hover:bg-pn-gold/90 text-pn-bg font-medium px-8 py-3 rounded-md transition-colors w-full"
            >
              Ir a mi Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
