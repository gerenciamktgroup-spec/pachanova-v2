'use client';

import React, { useState, useMemo } from 'react';

export function InteractiveYieldSandbox() {
  const [landAppreciation, setLandAppreciation] = useState(5.0); // % per year
  const [borrowRate, setBorrowRate] = useState(8.5); // % per year
  const [reinvestmentRate, setReinvestmentRate] = useState(50); // % of yield reinvested
  const [timeHorizon, setTimeHorizon] = useState(5); // years

  const initialCapital = 30000;
  const initialBaseYield = 12.0; // 12% gross yield

  const projections = useMemo(() => {
    let currentCapital = initialCapital;
    const data = [];
    
    for (let year = 1; year <= timeHorizon; year++) {
      // Gross yield produced this year
      const grossYield = currentCapital * (initialBaseYield / 100);
      
      // Borrow costs (assuming 30% of capital is debt-leveraged)
      const debtAmount = currentCapital * 0.3;
      const borrowCost = debtAmount * (borrowRate / 100);
      
      // Net yield
      const netYield = Math.max(0, grossYield - borrowCost);
      
      // Land appreciation
      const appreciationGains = currentCapital * (landAppreciation / 100);
      
      // Reinvestment
      const reinvestedAmount = netYield * (reinvestmentRate / 100);
      const cashOut = netYield - reinvestedAmount;
      
      // End of year capital
      currentCapital = currentCapital + appreciationGains + reinvestedAmount;
      
      data.push({
        year,
        capital: Math.round(currentCapital),
        grossYield: Math.round(grossYield),
        borrowCost: Math.round(borrowCost),
        netYield: Math.round(netYield),
        reinvested: Math.round(reinvestedAmount),
        cashOut: Math.round(cashOut),
        effectiveYieldPct: ((netYield + appreciationGains) / (currentCapital - appreciationGains - reinvestedAmount) * 100).toFixed(2)
      });
    }
    
    return data;
  }, [landAppreciation, borrowRate, reinvestmentRate, timeHorizon]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border border-zinc-800 rounded bg-[#050608]">
          <h3 className="text-violet-400 font-mono text-sm mb-4">Parámetros del Escenario</h3>
          
          <div className="space-y-4">
            <div>
              <label className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Apreciación del Terreno (Anual)</span>
                <span className="text-emerald-400">{landAppreciation}%</span>
              </label>
              <input type="range" min="0" max="20" step="0.5" value={landAppreciation} onChange={e => setLandAppreciation(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
            </div>

            <div>
              <label className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Tasa de Préstamo / Borrow Rate</span>
                <span className="text-amber-400">{borrowRate}%</span>
              </label>
              <input type="range" min="2" max="15" step="0.5" value={borrowRate} onChange={e => setBorrowRate(parseFloat(e.target.value))} className="w-full accent-amber-500" />
            </div>

            <div>
              <label className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Tasa de Reinversión de Yield</span>
                <span className="text-violet-400">{reinvestmentRate}%</span>
              </label>
              <input type="range" min="0" max="100" step="5" value={reinvestmentRate} onChange={e => setReinvestmentRate(parseInt(e.target.value))} className="w-full accent-violet-500" />
            </div>

            <div>
              <label className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Horizonte de Tiempo (Años)</span>
                <span className="text-blue-400">{timeHorizon} Años</span>
              </label>
              <input type="range" min="1" max="10" step="1" value={timeHorizon} onChange={e => setTimeHorizon(parseInt(e.target.value))} className="w-full accent-blue-500" />
            </div>
          </div>
        </div>

        <div className="p-4 border border-zinc-800 rounded bg-[#050608] overflow-auto max-h-[300px]">
          <h3 className="text-violet-400 font-mono text-sm mb-4">Proyección de Flujo de Caja</h3>
          <table className="w-full text-left text-xs text-zinc-400">
            <thead className="border-b border-zinc-800 text-zinc-500">
              <tr>
                <th className="pb-2">Año</th>
                <th className="pb-2 text-right">Capital Total</th>
                <th className="pb-2 text-right">Yield Neto</th>
                <th className="pb-2 text-right">Reinversión</th>
                <th className="pb-2 text-right">Yield Efectivo</th>
              </tr>
            </thead>
            <tbody>
              {projections.map((row) => (
                <tr key={row.year} className="border-b border-zinc-800/50 hover:bg-zinc-900/30">
                  <td className="py-2 text-white">Año {row.year}</td>
                  <td className="py-2 text-right text-emerald-400 font-mono">${row.capital.toLocaleString()}</td>
                  <td className="py-2 text-right text-emerald-300 font-mono">${row.netYield.toLocaleString()}</td>
                  <td className="py-2 text-right text-violet-400 font-mono">${row.reinvested.toLocaleString()}</td>
                  <td className="py-2 text-right text-blue-400 font-mono">{row.effectiveYieldPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-[10px] text-zinc-500">
        Este sandbox calcula el efecto del Flywheel de Crecimiento de Propiedad (Fase 47). La apreciación aumenta el capital base, el costo de préstamo se deduce del yield bruto, y la reinversión genera interés compuesto incrementando tu <code>effective_my_share</code> a través del tiempo.
      </div>
    </div>
  );
}
