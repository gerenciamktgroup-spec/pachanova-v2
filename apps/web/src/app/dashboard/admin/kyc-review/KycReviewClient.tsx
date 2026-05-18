'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Eye, FileText } from 'lucide-react';

type KycEntry = {
  id: string;
  investor_id: string;
  document_type: string;
  file_url: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  investors: { id: string; first_name: string; last_name: string; email: string };
};

export function KycReviewClient({ initialData }: { initialData: KycEntry[] }) {
  const [data, setData] = useState<KycEntry[]>(initialData);
  const [loading, setLoading] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const handleAction = async (investorId: string, action: 'approve' | 'deny') => {
    setLoading(investorId);
    try {
      const endpoint = action === 'approve'
        ? '/api/demo/actions/approve-kyc'
        : '/api/admin/deny-kyc';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investorId }),
      });
      if (res.ok) {
        setData(prev => prev.map(d =>
          d.investor_id === investorId
            ? { ...d, status: action === 'approve' ? 'approved' : 'rejected' }
            : d
        ));
      }
    } finally {
      setLoading(null);
    }
  };

  const filtered = filter === 'all' ? data : data.filter(d => d.status === filter);
  const counts = {
    all: data.length,
    pending: data.filter(d => d.status === 'pending').length,
    approved: data.filter(d => d.status === 'approved').length,
    rejected: data.filter(d => d.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-pn-gold">Revisión de Documentos KYC</h1>
        <p className="text-sm text-pn-text-muted mt-1">Revisá y aprobá la documentación de cada inversor antes de habilitarlos para comprar tokens.</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {(['all','pending','approved','rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-md text-sm border transition-colors ${
              filter === f
                ? 'bg-pn-gold text-pn-bg border-pn-gold font-medium'
                : 'border-pn-border text-pn-text-muted hover:border-pn-gold hover:text-pn-text'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendientes' : f === 'approved' ? 'Aprobados' : 'Denegados'}
            <span className="ml-1.5 text-xs opacity-70">({counts[f]})</span>
          </button>
        ))}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="bg-pn-surface-strong border border-pn-border rounded-xl p-12 text-center">
          <p className="text-pn-text-muted">
            {filter === 'pending' ? '✅ No hay documentos pendientes de revisión.' : 'Sin resultados en esta categoría.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(kyc => (
            <div key={kyc.id} className={`bg-pn-surface-strong border rounded-xl p-6 flex flex-col sm:flex-row gap-4 ${
              kyc.status === 'pending' ? 'border-yellow-500/40' :
              kyc.status === 'approved' ? 'border-green-500/30' :
              'border-red-500/30'
            }`}>

              {/* Info del inversor */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    kyc.status === 'pending' ? 'bg-yellow-500 animate-pulse' :
                    kyc.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="font-medium text-pn-text">
                    {kyc.investors?.first_name} {kyc.investors?.last_name}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    kyc.status === 'pending' ? 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10' :
                    kyc.status === 'approved' ? 'text-green-400 border-green-500/40 bg-green-500/10' :
                    'text-red-400 border-red-500/40 bg-red-500/10'
                  }`}>
                    {kyc.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-pn-text-muted">{kyc.investors?.email}</p>
                <p className="text-xs text-pn-text-soft">
                  Tipo: <span className="text-pn-text">{kyc.document_type}</span>
                  {' · '}
                  Subido: <span className="text-pn-text">{new Date(kyc.created_at).toLocaleDateString('es')}</span>
                </p>
              </div>

              {/* Acciones */}
              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                {kyc.file_url && kyc.file_url !== '' && !kyc.file_url.includes('demo.pachanova.io/kyc') && (
                  <button
                    onClick={() => setPreview(kyc.file_url)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm border border-pn-border text-pn-text-muted hover:text-pn-text hover:border-pn-gold rounded-md transition-colors"
                  >
                    <Eye size={14} />
                    Ver doc.
                  </button>
                )}

                {kyc.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction(kyc.investor_id, 'approve')}
                      disabled={loading === kyc.investor_id}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm bg-green-500 hover:bg-green-400 text-white rounded-md transition-colors disabled:opacity-50"
                    >
                      <CheckCircle2 size={14} />
                      {loading === kyc.investor_id ? 'Procesando...' : 'Aprobar'}
                    </button>
                    <button
                      onClick={() => handleAction(kyc.investor_id, 'deny')}
                      disabled={loading === kyc.investor_id}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm bg-red-500/80 hover:bg-red-500 text-white rounded-md transition-colors disabled:opacity-50"
                    >
                      <XCircle size={14} />
                      Denegar
                    </button>
                  </>
                )}

                {kyc.status === 'approved' && (
                  <div className="flex items-center gap-1.5 text-green-400 text-sm">
                    <CheckCircle2 size={16} /> Aprobado
                  </div>
                )}
                {kyc.status === 'rejected' && (
                  <div className="flex items-center gap-1.5 text-red-400 text-sm">
                    <XCircle size={16} /> Denegado
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de preview de documento */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreview(null)}
        >
          <div className="max-w-2xl w-full bg-pn-surface-strong rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-pn-border">
              <h3 className="font-medium text-pn-text">Documento KYC</h3>
              <button onClick={() => setPreview(null)} className="text-pn-text-muted hover:text-pn-text">✕</button>
            </div>
            <div className="p-4">
              {preview.match(/\.(jpg|jpeg|png|gif|webp)/i) ? (
                <img src={preview} alt="KYC Document" className="w-full rounded" />
              ) : (
                <div className="text-center py-8">
                  <FileText size={48} className="text-pn-gold mx-auto mb-3" />
                  <p className="text-pn-text-muted text-sm">Documento PDF</p>
                  <a href={preview} target="_blank" rel="noopener noreferrer"
                    className="mt-3 inline-block text-pn-gold hover:underline text-sm">
                    Abrir en nueva pestaña →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
