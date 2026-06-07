"use client";

import { useState } from "react";
import { DollarSign, ArrowRight, Clock, ArrowDownToLine, ArrowUpFromLine, Building } from "lucide-react";
import { createDepositRequest } from "@/app/actions/banking";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function WalletClient({ totalUsd }: { totalUsd: number }) {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [withdrawDetails, setWithdrawDetails] = useState({ bank: "", account: "" });
  const router = useRouter();

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = await createDepositRequest(parseFloat(amount));
    
    setIsSubmitting(false);
    if (result.success) {
      setStatus("success");
      setAmount("");
      toast.success('Solicitud de fondeo enviada', {
        description: 'El administrador revisará y aprobará tu fondeo.'
      });
      router.refresh(); 
    } else {
      toast.error('Error al solicitar fondeo', { description: result.error });
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(amount) > totalUsd) {
      toast.error('Saldo insuficiente', { description: 'El monto solicitado excede tu saldo disponible.' });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simular retraso de API
    setTimeout(() => {
      setIsSubmitting(false);
      setStatus("success");
      setAmount("");
      toast.success('Solicitud de retiro enviada', {
        description: 'El equipo de tesorería procesará tu transferencia en 24-48 hrs.'
      });
      router.refresh();
    }, 1500);
  };

  if (status === "success") {
    return (
      <div className="p-6 rounded-lg bg-pn-success/10 border border-pn-success/20 flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-pn-success/20 flex items-center justify-center">
          <Clock className="w-6 h-6 text-pn-success" />
        </div>
        <div>
          <h3 className="font-semibold text-pn-success">Solicitud en Revisión</h3>
          <p className="text-sm text-pn-text-soft mt-1">
            Tu {activeTab === 'deposit' ? 'fondeo' : 'retiro'} está en proceso de validación por el equipo de Administración.
          </p>
        </div>
        <button 
          onClick={() => setStatus("idle")}
          className="mt-4 px-4 py-2 text-sm font-medium text-pn-gold hover:bg-pn-gold/10 rounded-md transition-colors"
        >
          Realizar otra operación
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex p-1 bg-black/40 rounded-xl border border-white/10 w-full max-w-sm">
        <button 
          onClick={() => setActiveTab('deposit')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeTab === 'deposit' ? 'bg-[#c5a46d] text-black shadow-md' : 'text-white/60 hover:text-white'
          }`}
        >
          <ArrowDownToLine className="w-4 h-4" /> Depositar
        </button>
        <button 
          onClick={() => setActiveTab('withdraw')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeTab === 'withdraw' ? 'bg-[#c5a46d] text-black shadow-md' : 'text-white/60 hover:text-white'
          }`}
        >
          <ArrowUpFromLine className="w-4 h-4" /> Retirar
        </button>
      </div>

      {activeTab === 'deposit' ? (
        <form onSubmit={handleDeposit} className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
          <div className="space-y-2">
            <label className="text-sm font-medium text-pn-text-muted">Monto a depositar (USD)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-pn-text-soft" />
              </div>
              <input
                type="number"
                required
                min="100"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-pn-bg border border-pn-border rounded-lg focus:outline-none focus:ring-1 focus:ring-pn-gold focus:border-pn-gold text-pn-text placeholder-pn-text-soft/50 transition-colors"
                placeholder="Ej. 1000.00"
              />
            </div>
            <p className="text-xs text-pn-text-soft">Depósito mínimo: $100 USD.</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !amount}
              className="w-full flex items-center justify-center gap-2 bg-pn-gold hover:bg-pn-gold/90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 px-4 rounded-lg transition-all"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Procesando...</span>
              ) : (
                <>
                  Continuar con MercadoPago <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleWithdraw} className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
          <div className="space-y-2">
            <label className="text-sm font-medium text-pn-text-muted">Monto a retirar (USD)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-pn-text-soft" />
              </div>
              <input
                type="number"
                required
                min="50"
                max={totalUsd}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-pn-bg border border-pn-border rounded-lg focus:outline-none focus:ring-1 focus:ring-pn-gold focus:border-pn-gold text-pn-text placeholder-pn-text-soft/50 transition-colors"
                placeholder="Ej. 500.00"
              />
            </div>
            <p className="text-xs text-pn-text-soft flex justify-between">
              <span>Retiro mínimo: $50 USD.</span>
              <button type="button" onClick={() => setAmount(totalUsd.toString())} className="text-pn-gold hover:underline">Retirar el total</button>
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium text-pn-text-muted">Banco de Destino</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-pn-text-soft" />
              </div>
              <select
                required
                value={withdrawDetails.bank}
                onChange={(e) => setWithdrawDetails({...withdrawDetails, bank: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-pn-bg border border-pn-border rounded-lg focus:outline-none focus:ring-1 focus:ring-pn-gold focus:border-pn-gold text-pn-text transition-colors appearance-none"
              >
                <option value="" disabled>Selecciona un banco</option>
                <option value="bcp">BCP - Banco de Crédito del Perú</option>
                <option value="interbank">Interbank</option>
                <option value="bbva">BBVA</option>
                <option value="scotiabank">Scotiabank</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-pn-text-muted">Número de Cuenta Interbancaria (CCI)</label>
            <input
              type="text"
              required
              value={withdrawDetails.account}
              onChange={(e) => setWithdrawDetails({...withdrawDetails, account: e.target.value})}
              className="w-full px-4 py-3 bg-pn-bg border border-pn-border rounded-lg focus:outline-none focus:ring-1 focus:ring-pn-gold focus:border-pn-gold text-pn-text placeholder-pn-text-soft/50 transition-colors"
              placeholder="000-000-000000000000-00"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !amount || !withdrawDetails.bank || !withdrawDetails.account}
              className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3 px-4 rounded-lg transition-all"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Procesando...</span>
              ) : (
                <>
                  Solicitar Retiro <ArrowUpFromLine className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
