"use client";

import { useState } from "react";
import { DollarSign, ArrowRight, Clock } from "lucide-react";
import { createDepositRequest } from "@/app/actions/banking";
import { useRouter } from "next/navigation";

export function WalletDepositForm() {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const router = useRouter();

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = await createDepositRequest(parseFloat(amount));
    
    setIsSubmitting(false);
    if (result.success) {
      setStatus("success");
      setAmount("");
      router.refresh(); // Refresh to update transactions list
    } else {
      alert("Error al solicitar fondeo: " + result.error);
    }
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
            Tu fondeo está en proceso de validación. Una vez aprobado por el Administrador, verás el saldo reflejado.
          </p>
        </div>
        <button 
          onClick={() => setStatus("idle")}
          className="mt-4 px-4 py-2 text-sm font-medium text-pn-gold hover:bg-pn-gold/10 rounded-md transition-colors"
        >
          Realizar otro depósito
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleDeposit} className="space-y-4">
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
  );
}
