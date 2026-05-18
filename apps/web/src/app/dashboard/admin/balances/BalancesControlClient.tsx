'use client';

import { useState } from 'react';
import { PlusCircle, MinusCircle, RefreshCw, Lock } from 'lucide-react';

type Balance = {
  investor_id: string;
  available_usd: string;
  locked_usd: string;
  available_tokens: string;
  locked_tokens: string;
  investors: { id: string; first_name: string; last_name: string; email: string; role: string } | null;
};

export function BalancesControlClient({ initialData }: { initialData: Balance[] }) {
  const [balances, setBalances] = useState<Balance[]>(initialData);
  const [modal, setModal] = useState<{ investorId: string; field: 'available_usd' | 'available_tokens'; name: string } | null>(null);
  const [delta, setDelta] = useState('');
  const [reason, setReason] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAdjust = async () => {
    if (!modal || !delta || !reason) return;
    setLoadingId(modal.investorId);
    try {
      const res = await fetch('/api/admin/adjust-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorId: modal.investorId,
          field: modal.field,
          delta: Number(delta),
          reason,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setBalances(prev => prev.map(b =>
          b.investor_id === modal.investorId
            ? { ...b, [modal.field]: data.newValue.toString() }
            : b
        ));
        setFeedback(`✅ Ajuste aplicado en ${modal.name}`);
        setModal(null);
        setDelta('');
        setReason('');
      } else {
        setFeedback(`❌ Error: ${data.error}`);
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-pn-gold">Control Maestro de Saldos</h1>
        <p className="text-sm text-pn-text-muted mt-1">Ajustá USD y tokens de cualquier inversor. Cada operación queda en el audit log.</p>
      </div>

      {feedback && (
        <div className={`rounded-md p-3 text-sm ${
          feedback.startsWith('✅') ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {feedback}
          <button onClick={() => setFeedback(null)} className="ml-3 opacity-50 hover:opacity-100">✕</button>
        </div>
      )}

      {balances.length === 0 ? (
        <div className="bg-pn-surface-strong border border-pn-border rounded-xl p-12 text-center">
          <p className="text-pn-text-muted">Sin inversores registrados aún.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pn-border text-xs text-pn-text-muted uppercase tracking-wider">
                <th className="text-left py-3 pr-4">Inversor</th>
                <th className="text-right py-3 pr-4">USD disponible</th>
                <th className="text-right py-3 pr-4">Tokens PACHA</th>
                <th className="text-right py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {balances.map(b => (
                <tr key={b.investor_id} className="border-b border-pn-border/50 hover:bg-pn-bg/20">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-pn-text">
                      {b.investors?.first_name} {b.investors?.last_name}
                    </div>
                    <div className="text-xs text-pn-text-muted">{b.investors?.email}</div>
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <span className="text-pn-gold font-mono">${Number(b.available_usd).toLocaleString()}</span>
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <span className="text-pn-text font-mono">{Number(b.available_tokens).toLocaleString()}</span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => setModal({ investorId: b.investor_id, field: 'available_usd', name: `${b.investors?.first_name} (USD)` })}
                        title="Ajustar USD"
                        className="p-1.5 text-pn-text-muted hover:text-pn-gold border border-transparent hover:border-pn-gold rounded transition-colors"
                      >
                        <PlusCircle size={16} />
                      </button>
                      <button
                        onClick={() => setModal({ investorId: b.investor_id, field: 'available_tokens', name: `${b.investors?.first_name} (Tokens)` })}
                        title="Ajustar Tokens"
                        className="p-1.5 text-pn-text-muted hover:text-pn-gold border border-transparent hover:border-pn-gold rounded transition-colors"
                      >
                        <RefreshCw size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de ajuste */}
      {modal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setModal(null)}>
          <div className="bg-pn-surface-strong border border-pn-border rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-medium text-pn-text mb-1">Ajustar saldo</h3>
            <p className="text-sm text-pn-text-muted mb-5">{modal.name}</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-pn-text-muted uppercase tracking-wider block mb-1">Delta (positivo suma, negativo resta)</label>
                <input
                  type="number"
                  value={delta}
                  onChange={e => setDelta(e.target.value)}
                  placeholder="Ej. 5000 o -1000"
                  className="w-full bg-pn-bg border border-pn-border text-pn-text p-3 rounded-md focus:outline-none focus:border-pn-gold"
                />
              </div>
              <div>
                <label className="text-xs text-pn-text-muted uppercase tracking-wider block mb-1">Motivo (requerido para audit)</label>
                <input
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Ej. Ajuste demo para presentación"
                  className="w-full bg-pn-bg border border-pn-border text-pn-text p-3 rounded-md focus:outline-none focus:border-pn-gold"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(null)}
                className="flex-1 py-2.5 border border-pn-border text-pn-text-muted hover:text-pn-text rounded-md text-sm transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleAdjust}
                disabled={!delta || !reason || !!loadingId}
                className="flex-1 py-2.5 bg-pn-gold hover:bg-pn-gold/90 text-pn-bg font-medium rounded-md text-sm transition-colors disabled:opacity-50"
              >
                {loadingId ? 'Aplicando...' : 'Aplicar ajuste'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
