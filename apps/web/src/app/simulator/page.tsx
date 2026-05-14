'use client'

import { useState } from 'react'

export default function SimulatorPage() {
  const [investment, setInvestment] = useState<number>(1000)
  const [years, setYears] = useState<number>(5)
  const annualYield = 0.085 // 8.5%
  const annualAppreciation = 0.03 // 3%

  const totalYield = investment * (Math.pow(1 + annualYield, years) - 1)
  const totalAppreciation = investment * (Math.pow(1 + annualAppreciation, years) - 1)
  const totalValue = investment + totalYield + totalAppreciation

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
          Simulador de Inversión PachaNova
        </h1>
        <p className="text-gray-400">Proyecta el crecimiento de tu capital a través de rentas y apreciación del inmueble.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Inversión Inicial (USD)</label>
              <input 
                type="range" 
                min="100" max="50000" step="100"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="text-2xl font-bold mt-2 text-amber-500">${investment.toLocaleString()}</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Plazo (Años)</label>
              <input 
                type="range" 
                min="1" max="10" step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="text-2xl font-bold mt-2">{years} años</div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex flex-col justify-center space-y-4">
            <h2 className="text-2xl font-semibold">Proyección a {years} años</h2>
            
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Renta Acumulada (8.5% anual)</span>
              <span className="font-medium text-green-400">+${totalYield.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-400">Apreciación (3% anual)</span>
              <span className="font-medium text-blue-400">+${totalAppreciation.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>

            <div className="flex justify-between text-xl font-bold pt-4">
              <span>Valor Total Proyectado</span>
              <span className="text-amber-500">${totalValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
