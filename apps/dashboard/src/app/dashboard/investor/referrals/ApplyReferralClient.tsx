"use client";

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Gift, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ApplyReferralClient({ currentReferredBy }: { currentReferredBy: string | null }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const router = useRouter();

  if (currentReferredBy) {
    return (
      <GlassCard className="p-6 flex flex-col justify-center items-center text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Código Aplicado</h3>
        <p className="text-sm text-pn-text-muted">
          Ya has utilizado un código de referido y has recibido tu bonificación de Yield Boost inicial (+0.5%).
        </p>
      </GlassCard>
    );
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      const res = await fetch('/api/investor/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'apply_referral', referralCode: code.toUpperCase() })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ text: data.message, type: 'success' });
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        setMessage({ text: data.error || 'Error al aplicar el código', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Error de red', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
        <Gift className="w-5 h-5 text-emerald-400" />
        ¿Te invitó alguien?
      </h3>
      <p className="text-sm text-pn-text-muted mb-4">
        Ingresa el código de referido de quien te invitó a la plataforma PachaNova para recibir instantáneamente un <strong>+0.5% de Yield Boost</strong> en todos tus retornos pasivos.
      </p>
      
      <form onSubmit={handleApply} className="space-y-4">
        <div>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="Ej: PACHA-XXXXXX"
            className="w-full bg-[#121620] border border-pn-border text-white text-sm rounded-lg p-3 focus:outline-none focus:border-pn-gold transition-colors font-mono tracking-wider"
          />
        </div>
        
        {message && (
          <div className={`flex items-center gap-2 p-3 rounded-lg text-xs ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !code}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold p-3 rounded-lg text-sm transition-all disabled:opacity-50"
        >
          {loading ? 'Verificando...' : 'Aplicar Código'}
        </button>
      </form>
    </GlassCard>
  );
}
