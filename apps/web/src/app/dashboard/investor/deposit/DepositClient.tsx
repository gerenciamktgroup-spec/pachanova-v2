'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, DollarSign, ArrowRight } from 'lucide-react';
import { RouteBreadcrumbs } from '@/components/mission/RouteBreadcrumbs';

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000, 25000];

export function DepositClient({
  investorId,
  currentUsd,
  currentTokens,
}: {
  investorId: string;
  currentUsd: number;
  currentTokens: number;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(2500);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'processing' | 'done'>('select');
  const [newBalance, setNewBalance] = useState(currentUsd);
  const [error, setError] = useState<string | null>(null);

  const finalAmount = customAmount ? Number(customAmount) : amount;

  const handleDeposit = async () => {
    if (!finalAmount || finalAmount <= 0) return;
    setLoading(true);
    setError(null);
    setStep('processing');

    try {
      const res = await fetch('/api/demo/actions/simulated-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investorId, amountUsd: finalAmount }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al procesar el depósito');
        setStep('select');
      } else {
        setNewBalance(currentUsd + finalAmount);
        setStep('done');
      }
    } catch (err) {
      setError('Error de conexión. Intentá de nuevo.');
      setStep('select');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-pn-gold border-t-transparent rounded-full animate-spin" />
          <DollarSign className="absolute inset-0 m-auto text-pn-gold" size={28} />
        </div>
        <h2 className="text-xl font-light text-pn-gold">Procesando depósito...</h2>
        <p className="text-sm text-pn-text-muted">Simulando transferencia bancaria · ${finalAmount.toLocaleString()} USD</p>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 max-w-md mx-auto">
        <CheckCircle2 size={72} className="text-green-500" />
        <div className="text-center">
          <h2 className="text-2xl font-light text-pn-text">¡Depósito acreditado!</h2>
          <p className="text-sm text-pn-text-muted mt-2">+${finalAmount.toLocaleString()} USD en tu cuenta Pachanova</p>
        </div>
        <div className="bg-pn-surface-strong border border-green-500/30 rounded-xl p-6 w-full text-center">
          <p className="text-xs text-pn-text-muted mb-1">Nuevo saldo disponible</p>
          <p className="text-3xl font-bold text-pn-gold">${newBalance.toLocaleString()}</p>
          <p className="text-xs text-pn-text-muted mt-1">USD disponibles para comprar tokens PACHA</p>
        </div>
        <div className="flex gap-3 w-full">
          <Link href="/dashboard/investor/genesis"
            className="flex-1 flex items-center justify-center gap-2 bg-pn-gold hover:bg-pn-gold/90 text-pn-bg font-medium py-3 rounded-xl transition-colors">
            Comprar tokens <ArrowRight size={18} />
          </Link>
          <Link href="/dashboard/investor"
            className="flex-1 flex items-center justify-center border border-pn-border text-pn-text-muted hover:text-pn-text hover:border-pn-gold py-3 rounded-xl transition-colors text-sm">
            Mi portafolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 max-w-2xl mx-auto">
      <RouteBreadcrumbs items={[
        { label: 'Dashboard', href: '/dashboard/investor' },
        { label: 'Depósito de fondos' },
      ]} />

      <div>
        <h1 className="text-2xl font-light text-pn-gold">Depositar fondos</h1>
        <p className="text-sm text-pn-text-muted mt-1">
          Simulación de transferencia bancaria. Los fondos se acreditan instantáneamente en el entorno demo.
        </p>
      </div>

      {/* Balance actual */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-pn-surface-strong border border-pn-border rounded-xl p-5 text-center">
          <p className="text-xs text-pn-text-muted mb-1">USD disponible</p>
          <p className="text-2xl font-bold text-pn-gold">${currentUsd.toLocaleString()}</p>
        </div>
        <div className="bg-pn-surface-strong border border-pn-border rounded-xl p-5 text-center">
          <p className="text-xs text-pn-text-muted mb-1">Tokens PACHA</p>
          <p className="text-2xl font-bold text-pn-text">{currentTokens.toLocaleString()}</p>
        </div>
      </div>

      {/* Montos preset */}
      <div className="bg-pn-surface-strong border border-pn-border rounded-xl p-6 space-y-5">
        <h2 className="font-medium text-pn-text">Seleccioná el monto</h2>

        <div className="grid grid-cols-3 gap-3">
          {PRESET_AMOUNTS.map(a => (
            <button
              key={a}
              onClick={() => { setAmount(a); setCustomAmount(''); }}
              className={`py-3 rounded-lg text-sm font-medium border transition-colors ${
                amount === a && !customAmount
                  ? 'bg-pn-gold text-pn-bg border-pn-gold'
                  : 'bg-pn-bg border-pn-border text-pn-text-muted hover:border-pn-gold hover:text-pn-text'
              }`}
            >
              ${a.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="space-y-1">
          <label className="text-xs text-pn-text-muted uppercase tracking-wider">O ingresá un monto personalizado</label>
          <input
            type="number"
            min={100}
            max={1000000}
            value={customAmount}
            onChange={e => setCustomAmount(e.target.value)}
            placeholder="Ej. 7,500"
            className="w-full bg-pn-bg border border-pn-border text-pn-text p-3 rounded-md focus:outline-none focus:border-pn-gold"
          />
        </div>

        {/* Preview */}
        {finalAmount > 0 && (
          <div className="bg-pn-bg rounded-lg p-4 border border-pn-border/50">
            <div className="flex justify-between text-sm">
              <span className="text-pn-text-muted">Depósito:</span>
              <span className="text-pn-gold font-medium">${finalAmount.toLocaleString()} USD</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-pn-text-muted">Tokens que podrés comprar:</span>
              <span className="text-pn-text">≈ {Math.floor(finalAmount).toLocaleString()} PACHA</span>
            </div>
            <div className="flex justify-between text-sm mt-2 pt-2 border-t border-pn-border/50">
              <span className="text-pn-text-muted">Saldo después:</span>
              <span className="text-pn-text font-medium">${(currentUsd + finalAmount).toLocaleString()}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 text-sm text-red-400">{error}</div>
        )}

        <button
          onClick={handleDeposit}
          disabled={!finalAmount || finalAmount <= 0 || loading}
          className="w-full bg-pn-gold hover:bg-pn-gold/90 text-pn-bg font-medium py-3.5 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <DollarSign size={18} />
          {loading ? 'Procesando...' : `Depositar $${finalAmount.toLocaleString()} USD`}
        </button>

        <p className="text-center text-xs text-pn-text-soft">
          Entorno demo · Sin cobros reales · Los fondos son simulados
        </p>
      </div>
    </div>
  );
}
