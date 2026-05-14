'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { CheckCircle2 } from 'lucide-react'

import { getInvestorId } from '@/app/signup/actions'

// Utilizar un client componente para el wizard y usar fetch para comunicarse con las APIs
export default function OnboardingWizard() {
  const [step, setStep] = useState(1)
  const [investorId, setInvestorId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [depositAmount, setDepositAmount] = useState(10000)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      const id = await getInvestorId()
      if (id) {
        setInvestorId(id)
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  const handleApproveKyc = async () => {
    if (!investorId) return
    setLoading(true)
    try {
      await fetch('/api/demo/actions/approve-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investorId })
      })
      setStep(2)
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
      await fetch('/api/demo/actions/simulated-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investorId, amountUsd: depositAmount })
      })
      setStep(3)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading && step === 1 && !investorId) {
    return <div className="flex justify-center items-center h-screen"><p className="text-pn-text">Cargando...</p></div>
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="bg-pn-surface-strong border border-pn-border rounded-xl p-8 pn-glow-soft">
        {step === 1 && (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-light text-pn-gold">Paso 1: Verificación de Identidad</h2>
            <p className="text-pn-text-muted">Tu cuenta fue creada. KYC status: <span className="font-bold text-yellow-500">PENDING</span>.</p>
            <p className="text-sm text-pn-text-soft">En el entorno demo, tu KYC será aprobado automáticamente.</p>
            <button 
              onClick={handleApproveKyc}
              disabled={loading}
              className="bg-pn-gold hover:bg-pn-gold/90 text-pn-bg font-medium px-6 py-3 rounded-md transition-colors"
            >
              {loading ? 'Aprobando...' : 'Aprobar KYC Demo'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-light text-pn-gold">Paso 2: Fondos Simulados</h2>
            <p className="text-pn-text-muted">Deposita fondos simulados para comenzar a invertir.</p>
            
            <div className="flex flex-col items-center gap-2 max-w-xs mx-auto">
              <label htmlFor="amount" className="text-sm text-pn-text-soft self-start">Monto (USD):</label>
              <input 
                id="amount"
                type="number" 
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full bg-pn-bg border border-pn-border text-pn-text p-3 rounded focus:outline-none focus:border-pn-gold"
              />
            </div>

            <button 
              onClick={handleDeposit}
              disabled={loading}
              className="bg-pn-gold hover:bg-pn-gold/90 text-pn-bg font-medium px-6 py-3 rounded-md transition-colors"
            >
              {loading ? 'Procesando...' : 'Depositar'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-light text-pn-text">¡Estás listo para invertir!</h2>
            <div className="bg-pn-bg p-4 rounded border border-pn-border text-left inline-block w-full max-w-sm">
              <p className="flex justify-between border-b border-pn-border pb-2 mb-2">
                <span className="text-pn-text-soft">KYC:</span>
                <span className="text-green-500 font-bold">APPROVED ✅</span>
              </p>
              <p className="flex justify-between">
                <span className="text-pn-text-soft">Balance (USD):</span>
                <span className="text-pn-gold font-bold">${depositAmount.toLocaleString()}</span>
              </p>
            </div>
            <div>
              <button 
                onClick={() => router.push('/dashboard/investor')}
                className="bg-pn-surface hover:bg-pn-surface/80 border border-pn-border text-pn-text font-medium px-6 py-3 rounded-md transition-colors w-full max-w-sm mt-4"
              >
                Ir a mi Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
