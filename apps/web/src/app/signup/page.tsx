'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Eye, EyeOff, CheckCircle2, FileText, User, Mail, Lock } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'uploading' | 'done'>('form')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [docFile, setDocFile] = useState<File | null>(null)
  const [docType, setDocType] = useState<'cedula' | 'pasaporte' | 'licencia'>('cedula')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const fullName = fd.get('fullName') as string
    const email = fd.get('email') as string
    const password = fd.get('password') as string

    if (!fullName || !email || !password) {
      setError('Completá todos los campos')
      setLoading(false)
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres')
      setLoading(false)
      return
    }

    try {
      // 1. Crear cuenta vía API route (para evitar redirect server action problems)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.error?.includes('already') || data.error?.includes('registered')) {
          setError('Este email ya tiene una cuenta. \u00bfQuerés iniciar sesión?')
        } else {
          setError(data.error || 'Error al crear la cuenta')
        }
        setLoading(false)
        return
      }

      const { investorId } = data

      // 2. Si hay documento, subirlo
      if (docFile && investorId) {
        setStep('uploading')
        const uploadFd = new FormData()
        uploadFd.append('file', docFile)
        uploadFd.append('documentType', docType)
        uploadFd.append('investorId', investorId)

        await fetch('/api/kyc/upload', {
          method: 'POST',
          body: uploadFd,
        })
      }

      setStep('done')
      setTimeout(() => router.push('/dashboard/investor/onboarding'), 1500)
    } catch (err: any) {
      setError(err.message || 'Error inesperado')
      setLoading(false)
    }
  }

  if (step === 'done') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
        <h2 className="text-2xl font-light text-pn-gold">\u00a1Cuenta creada!</h2>
        <p className="text-pn-text-muted text-sm mt-2">Redirigiendo a tu panel...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-gray-950 text-white">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-3xl font-light text-pn-gold tracking-tight mb-1">PachaNova</div>
          <p className="text-pn-text-muted text-sm">Crea tu cuenta de inversor</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-pn-surface-strong border border-pn-border rounded-xl p-8">
          {/* Error */}
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-sm">
              {error}
              {error.includes('ya tiene') && (
                <a href="/login" className="block mt-1 text-pn-gold underline text-xs">Iniciar sesión →</a>
              )}
            </div>
          )}

          {/* Nombre */}
          <div className="space-y-1.5">
            <label className="text-sm text-pn-text-soft flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Nombre completo
            </label>
            <input
              name="fullName"
              type="text"
              required
              placeholder="Ej. María González"
              className="w-full bg-pn-bg border border-pn-border text-pn-text p-3 rounded focus:outline-none focus:border-pn-gold transition-colors"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm text-pn-text-soft flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="nombre@ejemplo.com"
              className="w-full bg-pn-bg border border-pn-border text-pn-text p-3 rounded focus:outline-none focus:border-pn-gold transition-colors"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm text-pn-text-soft flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Contraseña
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-pn-bg border border-pn-border text-pn-text p-3 rounded focus:outline-none focus:border-pn-gold transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pn-text-soft hover:text-pn-text"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* KYC Document Upload */}
          <div className="space-y-2">
            <label className="text-sm text-pn-text-soft flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Documento de identidad <span className="text-pn-text-soft text-xs">(opcional)</span>
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as any)}
              className="w-full bg-pn-bg border border-pn-border text-pn-text p-2.5 rounded focus:outline-none focus:border-pn-gold text-sm"
            >
              <option value="cedula"> Cédula / DNI</option>
              <option value="pasaporte"> Pasaporte</option>
              <option value="licencia"> Licencia de conducir</option>
            </select>
            <div
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all text-center ${
                docFile
                  ? 'border-pn-gold bg-pn-gold/5'
                  : 'border-pn-border hover:border-pn-gold/50'
              }`}
            >
              {docFile ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-pn-gold" />
                  <span className="text-sm text-pn-gold font-medium">{docFile.name}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-pn-text-soft">
                  <Upload className="w-5 h-5" />
                  <span className="text-sm">Subir documento (JPG, PNG, PDF)</span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => setDocFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-pn-text-soft">Tu documento va directo a la base de datos de Pachanova. No se comparte con terceros.</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-pn-gold hover:bg-pn-gold/90 text-pn-bg font-medium p-3 rounded w-full transition-colors disabled:opacity-50"
          >
            {loading ? (
              step === 'uploading' ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-pn-bg border-t-transparent rounded-full animate-spin" />
                  Subiendo documentación...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-pn-bg border-t-transparent rounded-full animate-spin" />
                  Creando cuenta...
                </span>
              )
            ) : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-6 text-sm text-pn-text-muted text-center">
          \u00bfYa tenés cuenta?{' '}
          <a href="/login" className="text-pn-gold hover:underline">Ingresá aquí</a>
        </p>
      </div>
    </div>
  )
}
