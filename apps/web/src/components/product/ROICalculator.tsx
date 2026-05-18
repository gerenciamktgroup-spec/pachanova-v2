'use client';

import { useState } from 'react';
import { MissionCard } from '../mission/MissionCard';
import { Calculator } from 'lucide-react';

export function ROICalculator({ currentPrice = 8.40 }: { currentPrice?: number }) {
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  
  // Simulated metrics based on PachaNova business model
  const projectedAnnualYield = 0.12; // 12% annual yield from agribusiness
  const projectedAppreciation = 0.08; // 8% annual appreciation of land
  const years = 3;

  const fractions = Math.floor(investmentAmount / currentPrice);
  const totalYield = investmentAmount * projectedAnnualYield * years;
  const totalAppreciation = investmentAmount * projectedAppreciation * years;
  const projectedTotalValue = investmentAmount + totalYield + totalAppreciation;

  return (
    <MissionCard title="Proyección de Retorno (Calculadora)">
      <div className="flex items-center gap-2 mb-6 border-b border-pn-border pb-4">
        <Calculator className="text-pn-gold" size={20} />
        <p className="text-sm text-pn-text-muted">Descubre el potencial de tu inversión combinando el rendimiento agrícola con la plusvalía de la tierra.</p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-pn-text">Capital Inicial (USD)</label>
            <span className="text-pn-gold font-mono font-medium">${investmentAmount.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
            className="w-full h-2 bg-pn-bg rounded-lg appearance-none cursor-pointer accent-pn-gold"
          />
          <div className="flex justify-between text-xs text-pn-text-soft mt-1">
            <span>$100</span>
            <span>Equivale a {fractions} Fracciones</span>
            <span>$10,000</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-pn-surface-strong p-4 rounded-lg border border-pn-border text-center">
            <p className="text-xs text-pn-text-muted mb-1">Plusvalía Proyectada (3 años)</p>
            <p className="text-lg text-pn-success font-medium">+${Math.round(totalAppreciation).toLocaleString()}</p>
            <p className="text-[10px] text-pn-text-soft">8% anual (Tierra)</p>
          </div>
          <div className="bg-pn-surface-strong p-4 rounded-lg border border-pn-border text-center">
            <p className="text-xs text-pn-text-muted mb-1">Rendimiento Agrícola (3 años)</p>
            <p className="text-lg text-pn-success font-medium">+${Math.round(totalYield).toLocaleString()}</p>
            <p className="text-[10px] text-pn-text-soft">12% anual (Pitahaya)</p>
          </div>
        </div>

        <div className="bg-pn-gold/10 border border-pn-gold/30 p-4 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-pn-gold">Valor Total Estimado</p>
            <p className="text-xs text-pn-text-soft">Al finalizar el año 3</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-pn-text">${Math.round(projectedTotalValue).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </MissionCard>
  );
}
