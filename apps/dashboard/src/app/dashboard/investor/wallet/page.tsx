"use client";

import { useState } from "react";
import { RouteBreadcrumbs } from "@/components/mission";
import { DollarSign, ArrowRight, Clock, ShieldCheck } from "lucide-react";

export default function WalletPage() {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular el registro de la transacción "Maker" (PENDING)
    setTimeout(() => {
      setIsSubmitting(false);
      setStatus("success");
      setAmount("");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <RouteBreadcrumbs />
        <h1 className="text-3xl font-light tracking-tight text-pn-text">
          Billetera <span className="font-semibold text-pn-gold">PachaNova</span>
        </h1>
        <p className="text-pn-text-muted">
          Inyecta saldo fiduciario para comenzar a adquirir fracciones inmobiliarias (RWA).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario de Fondeo (Maker) */}
        <div className="p-6 rounded-xl border border-pn-border bg-pn-surface-strong/30 backdrop-blur-sm space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-pn-text mb-1">Fondear Cuenta</h2>
            <p className="text-sm text-pn-text-soft">
              El saldo se reflejará como <span className="text-pn-gold font-medium">Pacha USD</span> tras la validación de la transferencia.
            </p>
          </div>

          {status === "success" ? (
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
          ) : (
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
          )}
        </div>

        {/* Info lateral */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-pn-border/50 bg-gradient-to-br from-pn-surface-strong/20 to-transparent">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-pn-gold/10 rounded-lg shrink-0">
                <ShieldCheck className="w-6 h-6 text-pn-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-pn-text">Seguridad Institucional</h3>
                <p className="text-sm text-pn-text-soft mt-2 leading-relaxed">
                  PachaNova opera bajo el estándar bancario de <strong>Cuatro Ojos (Maker-Checker)</strong>. Ningún fondo es acreditado sin una doble validación cruzada entre el sistema de pagos y nuestra Consola de Tesorería, garantizando seguridad absoluta contra fraudes.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-xl border border-pn-border/50 bg-gradient-to-br from-pn-surface-strong/20 to-transparent">
            <h3 className="font-semibold text-pn-text mb-4">Proceso de Fondeo</h3>
            <ol className="relative border-l border-pn-border/50 ml-3 space-y-5">
              <li className="pl-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-pn-gold rounded-full -left-3 ring-4 ring-pn-bg text-black text-xs font-bold">1</span>
                <h4 className="font-medium text-pn-text">Solicitud (Maker)</h4>
                <p className="text-xs text-pn-text-soft mt-1">Inicias el depósito en esta pantalla.</p>
              </li>
              <li className="pl-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-pn-surface-strong rounded-full -left-3 ring-4 ring-pn-bg text-pn-text-muted text-xs font-bold">2</span>
                <h4 className="font-medium text-pn-text">Aprobación (Checker)</h4>
                <p className="text-xs text-pn-text-soft mt-1">El Administrador valida los fondos en Tesorería.</p>
              </li>
              <li className="pl-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-pn-surface-strong rounded-full -left-3 ring-4 ring-pn-bg text-pn-text-muted text-xs font-bold">3</span>
                <h4 className="font-medium text-pn-text">Acreditación</h4>
                <p className="text-xs text-pn-text-soft mt-1">Recibes tus Pacha USD listos para invertir.</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
