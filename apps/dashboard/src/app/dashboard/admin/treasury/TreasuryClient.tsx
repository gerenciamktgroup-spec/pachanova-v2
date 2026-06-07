"use client";

import { useState } from "react";
import { formatCurrency, formatNumber } from "@/utils/formatters";

export default function TreasuryClient({ metrics, vaults }: { metrics: any, vaults: any[] }) {
  const [selectedVault, setSelectedVault] = useState<any>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [isInjectingYield, setIsInjectingYield] = useState(false);
  const [amount, setAmount] = useState(0);

  const handleMint = async () => {
    alert(`[Simulación] Solicitud de Acuñación de ${amount} PACHA enviada al Fideicomiso.`);
    setIsMinting(false);
  };

  const handleInjectYield = async () => {
    if (!selectedVault) return;
    try {
      const res = await fetch('/api/treasury/yield/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: selectedVault.property.id,
          amountUsd: amount,
          source: 'Treasury Admin Panel'
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Rentabilidad inyectada correctamente. (Recarga la página para ver los cambios)");
      } else {
        alert("Error: " + data.error);
      }
    } catch(e) {
      alert("Error en la inyección de rentabilidad");
    }
    setIsInjectingYield(false);
  };

  return (
    <div className="space-y-8">
      {/* KPI Global Panel */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-[#0f172a] p-4 rounded-xl border border-amber-500/20 shadow-lg shadow-amber-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl -mr-10 -mt-10"></div>
          <h3 className="text-[10px] uppercase tracking-wider text-amber-400 mb-2 font-medium">Yield en Custodia</h3>
          <div className="text-2xl font-light text-white">
            {formatCurrency(metrics.totalYieldUsd || 0)}
          </div>
          <p className="text-[10px] text-white/40 mt-1">Rentabilidad retenida lista para distribución</p>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-xl border border-[#c5a46d]/20 shadow-lg shadow-[#c5a46d]/5 relative overflow-hidden">
          <h3 className="text-[10px] uppercase tracking-wider text-[#c5a46d] mb-2 font-medium">Tokens Emitidos</h3>
          <div className="text-2xl font-light text-white">
            {formatNumber(metrics.totalMintedTokens)} <span className="text-xs text-white/50">PACHA</span>
          </div>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-xl border border-blue-500/20 shadow-lg shadow-blue-500/5 relative overflow-hidden">
          <h3 className="text-[10px] uppercase tracking-wider text-blue-400 mb-2 font-medium">Tránsito P2P</h3>
          <div className="text-2xl font-light text-white">
            {formatNumber(metrics.totalEscrowedTokens)} <span className="text-xs text-white/50">PACHA</span>
          </div>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-500/5 relative overflow-hidden">
          <h3 className="text-[10px] uppercase tracking-wider text-emerald-400 mb-2 font-medium">Liquidez P2P</h3>
          <div className="text-2xl font-light text-white">
            {formatCurrency(metrics.totalEscrowedUsd)}
          </div>
        </div>

        <div className="bg-[#0f172a] p-4 rounded-xl border border-rose-500/20 shadow-lg shadow-rose-500/5 relative overflow-hidden">
          <h3 className="text-[10px] uppercase tracking-wider text-rose-400 mb-2 font-medium">Tokens Quemados</h3>
          <div className="text-2xl font-light text-white">
            {formatNumber(metrics.totalBurnedTokens)} <span className="text-xs text-white/50">PACHA</span>
          </div>
        </div>
      </div>

      {/* Vaults Grid */}
      <div>
        <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c5a46d]"></span>
          Bóvedas por Activo (Double-Entry Ledger)
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vaults.length === 0 ? (
            <div className="col-span-full p-8 text-center text-white/50 bg-[#0f172a] rounded-xl border border-white/5">
              No hay bóvedas inicializadas.
            </div>
          ) : (
            vaults.map((v, i) => (
              <div key={i} className="bg-[#0a111f] rounded-xl border border-white/10 overflow-hidden hover:border-[#c5a46d]/30 transition-colors">
                <div className="p-5 border-b border-white/5 bg-gradient-to-r from-[#c5a46d]/5 to-transparent flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-white text-lg">{v.property?.name || "Activo Desconocido"}</h4>
                    <p className="text-xs text-[#c5a46d] font-mono mt-1">[{v.property?.location || "N/A"}]</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setSelectedVault(v); setIsInjectingYield(true); }}
                      className="text-xs px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded hover:bg-amber-500 hover:text-black transition-colors"
                    >
                      Inyectar Yield
                    </button>
                    <button 
                      onClick={() => { setSelectedVault(v); setIsMinting(true); }}
                      className="text-xs px-3 py-1.5 bg-[#c5a46d]/10 text-[#c5a46d] border border-[#c5a46d]/20 rounded hover:bg-[#c5a46d] hover:text-black transition-colors"
                    >
                      Acuñar
                    </button>
                  </div>
                </div>
                
                <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] uppercase text-white/40 mb-1">Yield Custodiado</p>
                    <p className="text-sm font-mono text-amber-400">{formatCurrency(v.treasury?.accumulatedYieldUsd || 0)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-white/40 mb-1">Treasury (Circulante)</p>
                    <p className="text-sm font-mono text-white">{formatNumber(v.treasury?.availableTokens || 0)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-white/40 mb-1">Escrow (Retenido P2P)</p>
                    <p className="text-sm font-mono text-emerald-400">{formatNumber(v.escrow?.escrowedTokens || 0)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-white/40 mb-1">Burn (Liquidado)</p>
                    <p className="text-sm font-mono text-rose-400">{formatNumber(v.burn?.burnedTokens || 0)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-white/40 mb-1">Caja Escrow (USD)</p>
                    <p className="text-sm font-mono text-white">{formatCurrency(v.escrow?.escrowedUsd || 0)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal - Generic */}
      {(isMinting || isInjectingYield) && selectedVault && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f172a] rounded-2xl border border-[#c5a46d]/30 p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-medium text-white mb-2">
              {isMinting ? "Emisión de Tokens" : "Inyección de Rentabilidad"}
            </h3>
            <p className="text-sm text-white/60 mb-6">
              {isMinting 
                ? `Acuñar nuevos tokens PACHA para ${selectedVault.property?.name}.`
                : `Ingresar USD (Yield) a la bóveda central de ${selectedVault.property?.name}.`}
            </p>
            
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                {isMinting ? "Cantidad a Acuñar" : "Monto USD a Inyectar"}
              </label>
              <input 
                type="number" 
                className="w-full bg-[#0a111f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c5a46d] outline-none"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            {isMinting && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 mb-6">
                <p className="text-xs text-rose-400 leading-relaxed">
                  <strong>Maker/Checker Alert:</strong> Esta acción requiere firmas del Fideicomiso.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => { setIsMinting(false); setIsInjectingYield(false); setAmount(0); }}
                className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={isMinting ? handleMint : handleInjectYield}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors text-black ${
                  isMinting ? 'bg-[#c5a46d] hover:bg-[#d4b581]' : 'bg-amber-500 hover:bg-amber-400'
                }`}
              >
                {isMinting ? "Solicitar Firmas" : "Inyectar Fondos"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
