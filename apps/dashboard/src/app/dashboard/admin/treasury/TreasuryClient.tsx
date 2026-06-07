"use client";

import { useState } from "react";
import { formatCurrency, formatNumber } from "@/utils/formatters";

export default function TreasuryClient({ metrics, vaults }: { metrics: any, vaults: any[] }) {
  const [selectedVault, setSelectedVault] = useState<any>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintAmount, setMintAmount] = useState(0);

  const handleMint = async () => {
    // Simulated Maker/Checker
    alert(`[Simulación] Solicitud de Acuñación de ${mintAmount} PACHA enviada al Fideicomiso para validación.`);
    setIsMinting(false);
  };

  return (
    <div className="space-y-8">
      {/* KPI Global Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#0f172a] p-6 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl -mr-10 -mt-10"></div>
          <h3 className="text-[10px] uppercase tracking-wider text-emerald-400 mb-2 font-medium">Liquidez Total P2P</h3>
          <div className="text-3xl font-light text-white">
            {formatCurrency(metrics.totalEscrowedUsd)}
          </div>
          <p className="text-xs text-white/40 mt-2">Fondos retenidos en Escrow Vault</p>
        </div>
        
        <div className="bg-[#0f172a] p-6 rounded-xl border border-[#c5a46d]/20 shadow-lg shadow-[#c5a46d]/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#c5a46d]/10 rounded-full blur-xl -mr-10 -mt-10"></div>
          <h3 className="text-[10px] uppercase tracking-wider text-[#c5a46d] mb-2 font-medium">Tokens Emitidos</h3>
          <div className="text-3xl font-light text-white">
            {formatNumber(metrics.totalMintedTokens)} <span className="text-sm text-white/50">PACHA</span>
          </div>
          <p className="text-xs text-white/40 mt-2">Circulante en Treasury Vaults</p>
        </div>

        <div className="bg-[#0f172a] p-6 rounded-xl border border-blue-500/20 shadow-lg shadow-blue-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl -mr-10 -mt-10"></div>
          <h3 className="text-[10px] uppercase tracking-wider text-blue-400 mb-2 font-medium">Tránsito P2P</h3>
          <div className="text-3xl font-light text-white">
            {formatNumber(metrics.totalEscrowedTokens)} <span className="text-sm text-white/50">PACHA</span>
          </div>
          <p className="text-xs text-white/40 mt-2">Tokens congelados por órdenes abiertas</p>
        </div>

        <div className="bg-[#0f172a] p-6 rounded-xl border border-rose-500/20 shadow-lg shadow-rose-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl -mr-10 -mt-10"></div>
          <h3 className="text-[10px] uppercase tracking-wider text-rose-400 mb-2 font-medium">Tokens Quemados</h3>
          <div className="text-3xl font-light text-white">
            {formatNumber(metrics.totalBurnedTokens)} <span className="text-sm text-white/50">PACHA</span>
          </div>
          <p className="text-xs text-white/40 mt-2">Liquidaciones finales en Burn Vault</p>
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
                {/* Header */}
                <div className="p-5 border-b border-white/5 bg-gradient-to-r from-[#c5a46d]/5 to-transparent flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-white text-lg">{v.property?.name || "Activo Desconocido"}</h4>
                    <p className="text-xs text-[#c5a46d] font-mono mt-1">[{v.property?.location || "N/A"}]</p>
                  </div>
                  <button 
                    onClick={() => { setSelectedVault(v); setIsMinting(true); }}
                    className="text-xs px-3 py-1.5 bg-[#c5a46d]/10 text-[#c5a46d] border border-[#c5a46d]/20 rounded hover:bg-[#c5a46d] hover:text-black transition-colors"
                  >
                    Acuñar
                  </button>
                </div>
                
                {/* Vault Data */}
                <div className="p-5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase text-white/40 mb-1">Treasury (Circulante)</p>
                    <p className="text-sm font-mono text-white">{formatNumber(v.treasury?.availableTokens || 0)} <span className="text-xs text-white/30">PACHA</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-white/40 mb-1">Escrow (Retenido P2P)</p>
                    <p className="text-sm font-mono text-emerald-400">{formatNumber(v.escrow?.escrowedTokens || 0)} <span className="text-xs text-emerald-400/30">PACHA</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-white/40 mb-1">Burn (Liquidado)</p>
                    <p className="text-sm font-mono text-rose-400">{formatNumber(v.burn?.burnedTokens || 0)} <span className="text-xs text-rose-400/30">PACHA</span></p>
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

      {/* Mint Modal */}
      {isMinting && selectedVault && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f172a] rounded-2xl border border-[#c5a46d]/30 p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-medium text-white mb-2">Emisión de Tokens</h3>
            <p className="text-sm text-white/60 mb-6">Acuñar nuevos tokens PACHA para <strong>{selectedVault.property?.name}</strong>.</p>
            
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">Cantidad a Acuñar</label>
              <input 
                type="number" 
                className="w-full bg-[#0a111f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#c5a46d] outline-none"
                value={mintAmount}
                onChange={(e) => setMintAmount(Number(e.target.value))}
              />
            </div>

            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 mb-6">
              <p className="text-xs text-rose-400 leading-relaxed">
                <strong>Maker/Checker Alert:</strong> Esta acción no acuñará los tokens inmediatamente. En su lugar, creará una solicitud en cadena que debe ser firmada por 2/3 de los miembros del Fideicomiso.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsMinting(false)}
                className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleMint}
                className="px-4 py-2 text-sm bg-[#c5a46d] text-black font-medium rounded hover:bg-[#d4b581] transition-colors"
              >
                Solicitar Firmas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
