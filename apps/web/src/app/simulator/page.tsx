'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Shield, HelpCircle, Activity } from 'lucide-react'

interface PropertyOption {
  code: string;
  name: string;
  type: string;
  tokenPrice: number;
  annualYield: number;
  annualAppreciation: number;
  color: string;
  description: string;
}

const PROPERTIES: PropertyOption[] = [
  {
    code: 'PAR',
    name: 'Parcelas Agro-Residenciales',
    type: 'Tierra Agrícola/Residencial',
    tokenPrice: 8.40,
    annualYield: 0.087, // 8.7%
    annualAppreciation: 0.035, // 3.5%
    color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    description: 'Facciones de tierra destinadas al desarrollo agro-residencial de baja densidad en San Bartolo.'
  },
  {
    code: 'VIV',
    name: 'Vivienda San Bartolo',
    type: 'Residencial / Condominios',
    tokenPrice: 8.40,
    annualYield: 0.171, // 17.1%
    annualAppreciation: 0.045, // 4.5%
    color: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
    description: 'Fracciones residenciales con altos retornos proyectados por el boom urbano costero.'
  },
  {
    code: 'YLD',
    name: 'Alquiler Yield Estate',
    type: 'Renta Vacacional / Comercial',
    tokenPrice: 12.00,
    annualYield: 0.148, // 14.8%
    annualAppreciation: 0.05, // 5.0%
    color: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
    description: 'Inmuebles comerciales y de hospedaje vacacional que distribuyen rentas mensuales constantes.'
  },
  {
    code: 'HTL',
    name: 'Hotel Boutique',
    type: 'Hotelería y Recreación',
    tokenPrice: 12.00,
    annualYield: 0.224, // 22.4%
    annualAppreciation: 0.06, // 6.0%
    color: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
    description: 'Participación en el complejo hotelero de playa premium con el máximo retorno de la ronda.'
  }
];

export default function SimulatorPage() {
  const [selectedProp, setSelectedProp] = useState<PropertyOption>(PROPERTIES[0])
  const [investment, setInvestment] = useState<number>(5000)
  const [years, setYears] = useState<number>(5)

  // Calculations
  const tokenCount = investment / selectedProp.tokenPrice
  const sqmCount = tokenCount * 0.1 // 1 token = 0.1 m²

  // Compound Interest: A = P * (1 + r)^n
  const totalYield = investment * (Math.pow(1 + selectedProp.annualYield, years) - 1)
  const totalAppreciation = investment * (Math.pow(1 + selectedProp.annualAppreciation, years) - 1)
  const totalValue = investment + totalYield + totalAppreciation

  return (
    <div className="min-h-screen bg-[#0a111f] text-[#f1f5f9] font-sans antialiased">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <Link 
            href="/demo/showcase" 
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#94a3b8] hover:text-[#c5a46d] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Showcase
          </Link>
          <div className="rounded border border-[#c5a46d]/30 bg-[#c5a46d]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-[#c5a46d]">
            Simulador RWA
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl font-extralight tracking-tight text-[#f1f5f9]">
            Simulador de Crecimiento <span className="font-medium text-[#c5a46d]">PachaNova</span>
          </h1>
          <p className="text-[#94a3b8] text-sm max-w-2xl">
            Proyecta tus dividendos mensuales por renta y la plusvalía de la tierra física de San Bartolo a través de fracciones digitales reguladas.
          </p>
        </div>

        {/* Property Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PROPERTIES.map(p => (
            <button
              key={p.code}
              onClick={() => setSelectedProp(p)}
              className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                selectedProp.code === p.code 
                  ? 'border-[#c5a46d] bg-[#c5a46d]/5 shadow-lg shadow-[#c5a46d]/5' 
                  : 'border-white/5 bg-white/2 hover:border-white/10 hover:bg-white/5'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 text-[#94a3b8]">
                  {p.code}
                </span>
                <span className="text-[10px] text-[#94a3b8] font-medium">
                  Rend. {(p.annualYield * 100).toFixed(1)}%
                </span>
              </div>
              <h3 className="text-xs font-semibold truncate text-[#f1f5f9]">{p.name}</h3>
              <p className="text-[10px] text-[#64748b] truncate mt-1">{p.type}</p>
            </button>
          ))}
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-2 space-y-6 bg-white/3 border border-white/5 p-6 sm:p-8 rounded-2xl backdrop-blur-md">
            <div className="space-y-1">
              <h3 className="text-md font-semibold text-[#f1f5f9]">{selectedProp.name}</h3>
              <p className="text-xs text-[#94a3b8]">{selectedProp.description}</p>
            </div>

            {/* Price reference badge */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/3 border border-white/5 text-xs text-[#94a3b8]">
              <Activity className="w-4 h-4 text-[#c5a46d]" />
              <span>Precio Actual: <strong className="text-[#f1f5f9]">${selectedProp.tokenPrice.toFixed(2)} USD</strong> por token (1 token = 0.1 m² de tierra).</span>
            </div>

            {/* Slider 1: Investment Amount */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Monto de Inversión (USD)</label>
                <span className="text-2xl font-semibold text-[#c5a46d] font-mono">${investment.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="100" max="100000" step="100"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#c5a46d]"
              />
              <div className="flex justify-between text-[10px] text-[#64748b] font-mono">
                <span>$100 USD</span>
                <span>$100,000 USD</span>
              </div>
            </div>

            {/* Slider 2: Years */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Plazo de Retención</label>
                <span className="text-2xl font-semibold text-[#f1f5f9] font-mono">{years} {years === 1 ? 'Año' : 'Años'}</span>
              </div>
              <input 
                type="range" 
                min="1" max="15" step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#c5a46d]"
              />
              <div className="flex justify-between text-[10px] text-[#64748b] font-mono">
                <span>1 año</span>
                <span>15 años</span>
              </div>
            </div>

            {/* Physical land details card */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase text-[#64748b] tracking-wider block">Área de Tierra Equiv.</span>
                <span className="text-xl font-semibold text-emerald-400 font-mono">
                  {sqmCount.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })} m²
                </span>
                <span className="text-[10px] text-[#94a3b8] block leading-none">de propiedad física en la costa</span>
              </div>
              <div className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase text-[#64748b] tracking-wider block">Fracciones Emitidas</span>
                <span className="text-xl font-semibold text-[#f1f5f9] font-mono">
                  {tokenCount.toLocaleString(undefined, { maximumFractionDigits: 0 })} PACHA
                </span>
                <span className="text-[10px] text-[#94a3b8] block leading-none">tokens asignados en tu portafolio</span>
              </div>
            </div>
          </div>

          {/* Projection Summary Card */}
          <div className="bg-white/3 border border-[#c5a46d]/20 p-6 sm:p-8 rounded-2xl flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#c5a46d]/5 rounded-full blur-2xl"></div>

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#c5a46d]" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#f1f5f9]">Proyección Estimada</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs text-[#94a3b8]">Inversión Inicial</span>
                  <span className="text-sm font-medium text-[#f1f5f9] font-mono">${investment.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-xs text-[#94a3b8] block">Rentas Estimadas</span>
                    <span className="text-[10px] text-[#64748b] block">{(selectedProp.annualYield * 100).toFixed(1)}% tasa anual</span>
                  </div>
                  <span className="text-sm font-medium text-emerald-400 font-mono">
                    +${totalYield.toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-xs text-[#94a3b8] block">Plusvalía Proyectada</span>
                    <span className="text-[10px] text-[#64748b] block">{(selectedProp.annualAppreciation * 100).toFixed(1)}% anual</span>
                  </div>
                  <span className="text-sm font-medium text-blue-400 font-mono">
                    +${totalAppreciation.toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                <span className="text-[10px] uppercase text-[#94a3b8] tracking-wider block mb-1">Valor Final Proyectado</span>
                <span className="text-3xl font-bold text-[#c5a46d] font-mono">
                  ${totalValue.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </span>
                <span className="text-[10px] text-[#64748b] block mt-1">
                  Retorno Total: +{(((totalValue - investment) / investment) * 100).toFixed(0)}% sobre capital inicial
                </span>
              </div>

              <Link 
                href="/dashboard/investor/genesis"
                className="w-full block text-center bg-[#c5a46d] hover:bg-[#c5a46d]/90 text-[#0a111f] font-semibold text-xs py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#c5a46d]/20"
              >
                Comenzar a Invertir
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimers & Security Guarantee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl bg-white/2 border border-white/5 text-xs text-[#94a3b8]">
          <div className="flex gap-3">
            <Shield className="w-6 h-6 text-[#c5a46d] shrink-0" />
            <div className="space-y-1">
              <h4 className="font-semibold text-[#f1f5f9]">Garantía Real de Fideicomiso</h4>
              <p className="leading-relaxed">
                Todas las simulaciones y proyecciones se respaldan en los derechos económicos registrados del fideicomiso físico inmobiliario de 500k m² en San Bartolo, inscritos bajo la normativa de la SBS en SUNARP.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <HelpCircle className="w-6 h-6 text-[#94a3b8] shrink-0" />
            <div className="space-y-1">
              <h4 className="font-semibold text-[#f1f5f9]">Información y Riesgos</h4>
              <p className="leading-relaxed">
                Los retornos pasados no garantizan rendimientos futuros. La plusvalía del suelo depende de la evolución del mercado costero y el desarrollo urbano del sur de Lima.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
