"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Lock, Unlock, ShieldAlert, CheckCircle2, AlertTriangle, 
  Coins, TrendingDown, Info, Percent, Landmark, HelpCircle, 
  ArrowRight, ShieldCheck, RefreshCw
} from "lucide-react";

interface Property {
  id: string;
  name: string;
  location: string;
  tokenPriceUsd: string;
  annualYieldExpected: string;
  imageUrl?: string | null;
}

interface Balance {
  propertyId: string;
  propertyName: string;
  propertyType: string;
  location: string;
  availableTokens: string;
  lockedTokens: string;
  availableUsd: string;
  lockedUsd: string;
  tokenPriceUsd: string;
}

interface Loan {
  id: string;
  investorId: string;
  propertyId: string;
  collateralAmount: string;
  collateralValueUsd: string;
  borrowedAmount: string;
  interestRate: string;
  accumulatedInterest: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface DeFiBorrowClientProps {
  investor: {
    id: string;
    fullName: string;
    email: string;
  };
  portfolio: Balance[];
  initialLoans: Loan[];
  properties: Property[];
}

export default function DeFiBorrowClient({ investor, portfolio, initialLoans, properties }: DeFiBorrowClientProps) {
  const router = useRouter();
  
  // State
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [balances, setBalances] = useState<Balance[]>(portfolio);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(portfolio[0]?.propertyId || "");
  const [collateralInput, setCollateralInput] = useState<string>("");
  const [borrowInput, setBorrowInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [simulationDropActive, setSimulationDropActive] = useState<boolean>(false);

  // Selected Balance Details
  const selectedBalance = balances.find(b => b.propertyId === selectedPropertyId);
  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  
  const tokenPrice = parseFloat(selectedBalance?.tokenPriceUsd || selectedProperty?.tokenPriceUsd || "0");
  const availableTokens = parseFloat(selectedBalance?.availableTokens || "0");
  
  const colAmount = parseFloat(collateralInput) || 0;
  const colValue = colAmount * tokenPrice;
  const maxBorrow = colValue * 0.60; // 60% Max LTV
  const borrowAmount = parseFloat(borrowInput) || 0;
  
  const simulatedLtv = colValue > 0 ? (borrowAmount / colValue) : 0;
  
  // Calculate Global Loan Metrics
  const activeLoans = loans.filter(l => l.status === 'active' || l.status === 'under_collateralized');
  const totalCollateralVal = activeLoans.reduce((sum, l) => sum + parseFloat(l.collateralValueUsd), 0);
  const totalDebt = activeLoans.reduce((sum, l) => sum + parseFloat(l.borrowedAmount) + parseFloat(l.accumulatedInterest), 0);
  const globalLtv = totalCollateralVal > 0 ? totalDebt / totalCollateralVal : 0;
  const netEquity = totalCollateralVal - totalDebt;
  const borrowCapacity = totalCollateralVal * 0.60;
  
  // Health factor assessment
  let healthLabel = "SEGURO";
  let healthColor = "text-emerald-400 border-emerald-500/30 bg-emerald-500/5";
  if (globalLtv >= 0.85) {
    healthLabel = "LIQUIDACIÓN INMINENTE";
    healthColor = "text-rose-400 border-rose-500/30 bg-rose-500/5 animate-pulse";
  } else if (globalLtv >= 0.80) {
    healthLabel = "RECLAMO DE MARGEN";
    healthColor = "text-red-400 border-red-500/30 bg-red-500/5";
  } else if (globalLtv >= 0.60) {
    healthLabel = "RIESGO MODERADO";
    healthColor = "text-amber-400 border-amber-500/30 bg-amber-500/5";
  }

  // Refresh Balances & Loans
  const refreshData = async () => {
    try {
      const res = await fetch(`/api/borrow?investorId=${investor.id}`);
      const data = await res.json();
      if (data.success) {
        setLoans(data.loans);
      }
      
      // We can trigger router refresh to reload the server data
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Borrow
  const handleBorrowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (colAmount <= 0 || borrowAmount <= 0) {
      setErrorMsg("Debe especificar montos mayores a cero");
      return;
    }
    if (colAmount > availableTokens) {
      setErrorMsg(`No tienes suficientes tokens. Saldo disponible: ${availableTokens}`);
      return;
    }
    if (borrowAmount > maxBorrow) {
      setErrorMsg(`El monto solicitado supera el límite del 60% LTV ($${maxBorrow.toFixed(2)})`);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/borrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'borrow',
          investorId: investor.id,
          propertyId: selectedPropertyId,
          collateralAmount: colAmount.toString(),
          borrowedAmount: borrowAmount.toString(),
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`¡Préstamo de $${borrowAmount.toFixed(2)} USD solicitado con éxito! Los fondos fueron acreditados.`);
        setCollateralInput("");
        setBorrowInput("");
        await refreshData();
      } else {
        setErrorMsg(data.error || "Ocurrió un error al procesar el préstamo.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error de red.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Repay
  const handleRepay = async (loanId: string, amount: string) => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/borrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'repay',
          loanId,
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`¡Préstamo pagado con éxito! Los tokens en colateral fueron liberados.`);
        await refreshData();
      } else {
        setErrorMsg(data.error || "Error al pagar el préstamo.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error de red.");
    } finally {
      setLoading(false);
    }
  };

  // Simulate Property Price Drop
  const handleSimulateDrop = async (propertyId: string) => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/borrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'simulate-drop',
          propertyId,
          dropPercentage: "30"
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`¡Mercado Simulado! El valor del token se redujo 30% a $${data.newPrice}. Se recalcularon los LTV de las deudas activas.`);
        await refreshData();
      } else {
        setErrorMsg(data.error || "Error al simular la caída.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error de red.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>{successMsg}</div>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <div>{errorMsg}</div>
        </div>
      )}

      {/* Main Layout Header */}
      <div className="pn-card bg-[#0a111f] text-white p-6 md:p-8 relative overflow-hidden">
        <div className="pn-gradient-radial absolute inset-0 opacity-40"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-pn-gold/15 text-pn-gold border border-pn-gold/20">
              <Landmark className="w-3.5 h-3.5" />
              Lending Inmobiliario RWA
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Préstamos DeFi PachaNova</h2>
            <p className="text-sm text-pn-text-muted max-w-xl">
              Utiliza tus tokens de participación inmobiliaria PACHA como garantía colateral para obtener préstamos de liquidez inmediata en USD a tasas fijas, sin perder tu rentabilidad subyacente.
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={refreshData}
              disabled={loading}
              className="bg-white/5 hover:bg-white/10 text-white font-medium p-2.5 rounded-lg border border-white/10 transition-all flex items-center gap-2 text-sm"
              title="Sincronizar saldos y contratos"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Global DeFi lending dashboard metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="pn-card p-5 space-y-2 border-pn-border/40 hover:border-pn-border transition-colors">
          <div className="text-[10px] uppercase tracking-wider text-pn-text-soft flex items-center justify-between">
            <span>Colateral Depositado</span>
            <Lock className="w-3.5 h-3.5 text-pn-gold" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">${totalCollateralVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-xs text-pn-text-muted">Total tokens locked</div>
        </div>

        <div className="pn-card p-5 space-y-2 border-pn-border/40">
          <div className="text-[10px] uppercase tracking-wider text-pn-text-soft flex items-center justify-between">
            <span>Deuda Pendiente (USD)</span>
            <Coins className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 tabular-nums">${totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-xs text-pn-text-muted">Principal + Interés APY 8.5%</div>
        </div>

        <div className="pn-card p-5 space-y-2 border-pn-border/40">
          <div className="text-[10px] uppercase tracking-wider text-pn-text-soft flex items-center justify-between">
            <span>Capacidad Disponible</span>
            <Percent className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">${Math.max(0, borrowCapacity - totalDebt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-xs text-pn-text-muted">Límite LTV Máximo: 60%</div>
        </div>

        <div className="pn-card p-5 space-y-2 border-pn-border/40">
          <div className="text-[10px] uppercase tracking-wider text-pn-text-soft flex items-center justify-between">
            <span>Factor de Salud</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="tabular-nums">{(globalLtv * 100).toFixed(1)}%</span>
            <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-white/5 bg-white/5">LTV</span>
          </div>
          <div className="text-xs text-pn-text-muted flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${globalLtv >= 0.85 ? 'bg-rose-500' : globalLtv >= 0.80 ? 'bg-red-500' : globalLtv >= 0.60 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            <span className="font-semibold text-white/70">{healthLabel}</span>
          </div>
        </div>

      </div>

      {/* Main Borrow Simulator & Loan Portfolio Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Borrow simulator */}
        <div className="lg:col-span-7 space-y-6">
          <div className="pn-card p-6 bg-[#090b0f] border-pn-border/60">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Coins className="w-5 h-5 text-pn-gold" />
              Solicitar Préstamo RWA
            </h3>

            <form onSubmit={handleBorrowSubmit} className="space-y-6">
              
              {/* Select asset to collateralize */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-pn-text-muted uppercase tracking-wider">
                  Seleccionar Activo Colateral
                </label>
                <select
                  value={selectedPropertyId}
                  onChange={(e) => {
                    setSelectedPropertyId(e.target.value);
                    setCollateralInput("");
                    setBorrowInput("");
                  }}
                  className="w-full bg-[#121620] border border-pn-border text-white text-sm rounded-lg p-3 focus:outline-none focus:border-pn-gold transition-colors"
                >
                  {balances.map((bal) => (
                    <option key={bal.propertyId} value={bal.propertyId}>
                      {bal.propertyName} ({bal.location}) — Disponible: {parseFloat(bal.availableTokens).toLocaleString()} PACHA (Valor ${ (parseFloat(bal.availableTokens) * parseFloat(bal.tokenPriceUsd)).toFixed(2) } USD)
                    </option>
                  ))}
                  {balances.length === 0 && (
                    <option value="" disabled>No tienes tokens para colateralizar</option>
                  )}
                </select>
              </div>

              {selectedBalance && (
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-white/5 bg-white/5 text-xs text-pn-text-muted">
                  <div>
                    <div className="text-[10px] uppercase text-pn-text-soft mb-1">Precio Unitario</div>
                    <div className="text-sm font-semibold text-white">${tokenPrice.toFixed(2)} USD</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-pn-text-soft mb-1">Tu Balance Disponible</div>
                    <div className="text-sm font-semibold text-white tabular-nums">{parseFloat(selectedBalance.availableTokens).toLocaleString()} PACHA</div>
                  </div>
                </div>
              )}

              {/* Enter Collateral amount */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-pn-text-muted uppercase tracking-wider">
                    Cantidad a Bloquear como Colateral (PACHA)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setCollateralInput(availableTokens.toString());
                      const val = availableTokens * tokenPrice;
                      setBorrowInput((val * 0.50).toFixed(0)); // Suggest a safe 50% LTV borrow
                    }}
                    className="text-xs text-pn-gold hover:underline font-semibold"
                  >
                    Usar Máx.
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={availableTokens}
                    placeholder="0.00"
                    value={collateralInput}
                    onChange={(e) => {
                      setCollateralInput(e.target.value);
                      const col = parseFloat(e.target.value) || 0;
                      const val = col * tokenPrice;
                      setBorrowInput((val * 0.50).toFixed(0)); // Autosuggest safe 50% LTV
                    }}
                    className="w-full bg-[#121620] border border-pn-border text-white text-sm rounded-lg p-3 pr-16 focus:outline-none focus:border-pn-gold transition-colors"
                  />
                  <span className="absolute right-3 top-3.5 text-xs font-bold text-pn-text-soft">PACHA</span>
                </div>
                <p className="text-[10px] text-pn-text-soft">
                  Valor de colateral estimado: <span className="text-white">${colValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
                </p>
              </div>

              {/* Enter Borrow amount */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-pn-text-muted uppercase tracking-wider">
                    Monto de Préstamo a Solicitar (USD)
                  </label>
                  <span className="text-xs text-pn-text-soft">
                    Límite LTV (60%): ${maxBorrow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max={maxBorrow}
                    placeholder="0.00"
                    value={borrowInput}
                    onChange={(e) => setBorrowInput(e.target.value)}
                    className="w-full bg-[#121620] border border-pn-border text-white text-sm rounded-lg p-3 pr-16 focus:outline-none focus:border-pn-gold transition-colors"
                  />
                  <span className="absolute right-3 top-3.5 text-xs font-bold text-pn-text-soft">USD</span>
                </div>

                {/* Slider for quick LTV adjustments */}
                {colValue > 0 && (
                  <div className="space-y-1 py-2">
                    <input
                      type="range"
                      min="0"
                      max={maxBorrow}
                      step="1"
                      value={borrowAmount}
                      onChange={(e) => setBorrowInput(e.target.value)}
                      className="w-full accent-pn-gold bg-[#121620]"
                    />
                    <div className="flex justify-between text-[10px] text-pn-text-soft">
                      <span>0% LTV</span>
                      <span>30% LTV (Recomendado)</span>
                      <span>60% LTV (Límite)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Live Risk assessment parameters */}
              {colValue > 0 && (
                <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-3">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Métricas de Riesgo del Préstamo</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-pn-text-soft">LTV Proyectado:</div>
                      <div className={`font-semibold text-sm ${simulatedLtv > 0.50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {(simulatedLtv * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-pn-text-soft">Estado del Préstamo:</div>
                      <div className={`font-semibold text-sm ${simulatedLtv > 0.55 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {simulatedLtv > 0.55 ? 'MODERADO (Monitorear)' : 'SEGURO'}
                      </div>
                    </div>
                    <div>
                      <div className="text-pn-text-soft">Costo Financiero (APY):</div>
                      <div className="font-semibold text-white text-sm">8.50% tasa fija</div>
                    </div>
                    <div>
                      <div className="text-pn-text-soft">Liquidación:</div>
                      <div className="text-pn-text-soft text-sm">Si LTV supera <span className="text-rose-400 font-semibold">90.0%</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || colAmount <= 0 || borrowAmount <= 0}
                className="w-full bg-pn-gold hover:bg-pn-gold/90 text-pn-bg font-semibold p-3.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Procesando préstamo..." : "Confirmar Préstamo RWA"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Active Loans & Price Drop Simulator */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Market price crash simulation panel */}
          <div className="pn-card p-5 border-rose-500/20 bg-rose-500/5 space-y-3">
            <div className="flex items-center gap-2 text-rose-400">
              <TrendingDown className="w-5 h-5" />
              <h4 className="font-semibold text-sm">Simulador de Mercado (Fuerza Mayor)</h4>
            </div>
            <p className="text-xs text-pn-text-muted">
              Para validar cómo la plataforma gestiona automáticamente el riesgo de liquidación DeFi, puedes simular una caída de valoración de tierras del 30% en cualquiera de tus propiedades activas.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              {balances.map((bal) => (
                <div key={bal.propertyId} className="flex items-center justify-between gap-4 p-2 rounded bg-black/30 border border-white/5">
                  <div className="text-xs">
                    <div className="font-semibold text-white/90 truncate max-w-[150px]">{bal.propertyName}</div>
                    <div className="text-[10px] text-pn-text-soft">Precio: ${parseFloat(bal.tokenPriceUsd).toFixed(2)} USD</div>
                  </div>
                  <button
                    onClick={() => handleSimulateDrop(bal.propertyId)}
                    disabled={loading}
                    className="bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    Causar Caída -30%
                  </button>
                </div>
              ))}
              {balances.length === 0 && (
                <div className="text-xs text-pn-text-soft text-center py-2">No hay propiedades activas en tu portafolio</div>
              )}
            </div>
          </div>

          {/* Active Loans Panel */}
          <div className="pn-card p-6 bg-[#090b0f] border-pn-border/60 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-pn-gold" />
              Tus Préstamos Activos
            </h3>

            <div className="space-y-4">
              {loans.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-pn-border/40 rounded-xl">
                  <HelpCircle className="w-8 h-8 mx-auto text-pn-text-soft mb-2" />
                  <p className="text-xs text-pn-text-soft">No tienes préstamos registrados en este momento</p>
                </div>
              ) : (
                loans.map((loan) => {
                  const property = properties.find(p => p.id === loan.propertyId);
                  const collateralVal = parseFloat(loan.collateralValueUsd);
                  const totalDebt = parseFloat(loan.borrowedAmount) + parseFloat(loan.accumulatedInterest);
                  const ltv = collateralVal > 0 ? (totalDebt / collateralVal) : 0;
                  
                  return (
                    <div 
                      key={loan.id} 
                      className={`p-4 rounded-xl border relative overflow-hidden transition-all ${
                        loan.status === 'liquidated' 
                          ? 'border-rose-500/20 bg-rose-500/5' 
                          : loan.status === 'under_collateralized'
                          ? 'border-red-500/20 bg-red-500/5'
                          : 'border-pn-border bg-pn-surface-strong/30 hover:border-pn-border-strong'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div>
                          <h4 className="font-semibold text-sm text-white">{property?.name || 'Propiedad RWA'}</h4>
                          <span className="text-[10px] text-pn-text-soft uppercase tracking-wider">{property?.location}</span>
                        </div>
                        <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                          loan.status === 'repaid' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : loan.status === 'liquidated'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : loan.status === 'under_collateralized'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-pn-gold/10 text-pn-gold border border-pn-gold/20'
                        }`}>
                          {loan.status === 'under_collateralized' ? 'Alerta LTV' : loan.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs border-t border-white/5 pt-3 mb-4">
                        <div>
                          <div className="text-pn-text-soft">Colateral:</div>
                          <div className="font-semibold text-white">{parseFloat(loan.collateralAmount).toLocaleString()} PACHA</div>
                          <div className="text-[10px] text-pn-text-muted">Valor: ${collateralVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</div>
                        </div>
                        <div>
                          <div className="text-pn-text-soft">Deuda Total:</div>
                          <div className={`font-semibold ${loan.status === 'liquidated' ? 'text-pn-text-soft line-through' : 'text-white'}`}>
                            ${totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                          </div>
                          {parseFloat(loan.accumulatedInterest) > 0 && (
                            <div className="text-[10px] text-rose-400">+${parseFloat(loan.accumulatedInterest).toFixed(2)} interés</div>
                          )}
                        </div>
                        <div>
                          <div className="text-pn-text-soft">LTV Actual:</div>
                          <div className={`font-semibold ${ltv > 0.80 ? 'text-rose-400 font-bold' : ltv > 0.60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {(ltv * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-pn-text-soft">Fecha:</div>
                          <div className="text-pn-text-muted text-[10px] mt-0.5">
                            {new Date(loan.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {loan.status === 'active' && (
                        <button
                          onClick={() => handleRepay(loan.id, totalDebt.toString())}
                          disabled={loading}
                          className="w-full bg-[#121620] hover:bg-white/10 text-white font-semibold py-2 rounded-lg text-xs border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Unlock className="w-3.5 h-3.5 text-pn-gold" />
                          Pagar Deuda y Liberar Colateral
                        </button>
                      )}
                      
                      {loan.status === 'under_collateralized' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-semibold bg-red-500/10 p-2 rounded">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            <span>Margin Call: Colateral en riesgo de liquidación. Paga la deuda de inmediato.</span>
                          </div>
                          <button
                            onClick={() => handleRepay(loan.id, totalDebt.toString())}
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            Liquidar Deuda Urgente
                          </button>
                        </div>
                      )}

                      {loan.status === 'liquidated' && (
                        <div className="flex items-center gap-1.5 text-[10px] text-rose-400 bg-rose-500/10 p-2 rounded">
                          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                          <span>Liquidado: El LTV superó el 90%. El colateral de tokens PACHA fue transferido al fondo de reserva del protocolo.</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
