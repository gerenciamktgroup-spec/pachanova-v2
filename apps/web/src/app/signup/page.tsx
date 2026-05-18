'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, CheckCircle2, Eye, EyeOff, FileText, X } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [kycFile, setKycFile] = useState<File | null>(null)
  const [kycPreview, setKycPreview] = useState<string | null>(null)
  const [docType, setDocType] = useState('cedula')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'form' | 'uploading' | 'done'>('form')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo no puede superar los 10MB.')
      return
    }
    setKycFile(file)
    setError(null)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (ev) => setKycPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      setKycPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.fullName.trim() || !form.email.trim() || !form.password) {
      setError('Completá todos los campos obligatorios.')
      return
    }
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (!kycFile) {
      setError('Subí tu documento de identidad para continuar.')
      return
    }

    setLoading(true)
    setStep('uploading')

    try {
      // 1. Crear la cuenta
      const signupFD = new FormData()
      signupFD.append('fullName', form.fullName)
      signupFD.append('email', form.email)
      signupFD.append('password', form.password)

      const signupRes = await fetch('/api/demo/auth/signup-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: form.fullName, email: form.email, password: form.password }),
      })

      if (!signupRes.ok) {
        const err = await signupRes.json()
        throw new Error(err.error || 'Error al crear la cuenta')
      }

      const { investorId } = await signupRes.json()

      // 2. Subir el documento KYC
      const kycFD = new FormData()
      kycFD.append('file', kycFile)
      kycFD.append('documentType', docType)
      kycFD.append('investorId', investorId)

      await fetch('/api/kyc/upload', {
        method: 'POST',
        body: kycFD,
      })

      setStep('done')
      setTimeout(() => router.push('/dashboard/investor/onboarding'), 1500)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado'
      setError(msg)
      setStep('form')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'uploading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-pn-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-xl font-light text-pn-gold">Creando tu cuenta...</h2>
          <p className="text-sm text-pn-text-muted">Subiendo documentación KYC a Pachanova</p>
        </div>
      </div>
    )
  }

  if (step === 'done') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
        <div className="text-center space-y-4">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
          <h2 className="text-xl font-light text-pn-text">¡Cuenta creada!</h2>
          <p className="text-sm text-pn-text-muted">Redirigiendo a tu panel de inversor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-pn-gold tracking-tight mb-1">PachaNova</h1>
          <p className="text-sm text-pn-text-muted">Creá tu cuenta de inversor</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-pn-surface-strong border border-pn-border rounded-xl p-8 space-y-5">

          {/* Nombre */}
          <div className="space-y-1">
            <label className="text-xs text-pn-text-muted uppercase tracking-wider">Nombre completo *</label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
              placeholder="Ej. María García"
              className="w-full bg-pn-bg border border-pn-border text-pn-text p-3 rounded-md focus:outline-none focus:border-pn-gold transition-colors"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs text-pn-text-muted uppercase tracking-wider">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="maria@ejemplo.com"
              className="w-full bg-pn-bg border border-pn-border text-pn-text p-3 rounded-md focus:outline-none focus:border-pn-gold transition-colors"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs text-pn-text-muted uppercase tracking-wider">Contraseña *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-pn-bg border border-pn-border text-pn-text p-3 rounded-md focus:outline-none focus:border-pn-gold transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pn-text-muted hover:text-pn-text"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* KYC Document Upload */}
          <div className="space-y-2">
            <label className="text-xs text-pn-text-muted uppercase tracking-wider">Documento de identidad *</label>
            <select
              value={docType}
              onChange={e => setDocType(e.target.value)}
              className="w-full bg-pn-bg border border-pn-border text-pn-text p-3 rounded-md focus:outline-none focus:border-pn-gold text-sm"
            >
              <option value="cedula">Cédula de identidad</option>
              <option value="pasaporte">Pasaporte</option>
              <option value="licencia">Licencia de conducir</option>
            </select>

            {!kycFile ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-pn-border hover:border-pn-gold rounded-lg p-6 flex flex-col items-center gap-2 transition-colors group"
              >
                <Upload size={24} className="text-pn-text-muted group-hover:text-pn-gold transition-colors" />
                <span className="text-sm text-pn-text-muted group-hover:text-pn-text transition-colors">Click para subir</span>
                <span className="text-xs text-pn-text-soft">JPG, PNG, PDF hasta 10MB</span>
              </button>
            ) : (
              <div className="border border-green-500/50 rounded-lg p-4 flex items-center gap-3 bg-green-500/5">
                {kycPreview ? (
                  <img src={kycPreview} alt="Preview" className="w-12 h-12 object-cover rounded" />
                ) : (
                  <FileText size={24} className="text-pn-gold flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-pn-text truncate">{kycFile.name}</p>
                  <p className="text-xs text-pn-text-muted">{(kycFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setKycFile(null); setKycPreview(null) }}
                  className="text-pn-text-muted hover:text-red-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pn-gold hover:bg-pn-gold/90 text-pn-bg font-medium py-3 rounded-md transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta de inversor'}
          </button>

          <p className="text-center text-xs text-pn-text-muted">
            ¿Ya tenés cuenta?{' '}
            <a href="/login" className="text-pn-gold hover:underline">Ingresar aquí</a>
          </p>
        </form>
      </div>
    </div>
  )
}
