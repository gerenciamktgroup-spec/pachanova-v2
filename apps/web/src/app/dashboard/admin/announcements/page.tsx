'use client';

import { useState } from 'react';
import { RouteBreadcrumbs } from '@/components/mission/RouteBreadcrumbs';
import { Send, Bell } from 'lucide-react';

export default function AnnouncementsPage() {
  const [form, setForm] = useState({ title: '', body: '', target: 'all' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<{ title: string; body: string; target: string; time: string }[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(prev => [{ ...form, time: new Date().toLocaleTimeString('es') }, ...prev]);
        setForm({ title: '', body: '', target: 'all' });
        setFeedback('✅ Anuncio enviado a todos los inversores activos');
      } else {
        const err = await res.json();
        setFeedback('❌ Error: ' + err.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <RouteBreadcrumbs items={[
        { label: 'Admin', href: '/dashboard/admin' },
        { label: 'Anuncios' }
      ]} />

      <div>
        <h1 className="text-2xl font-light text-pn-gold">Anuncios a Inversores</h1>
        <p className="text-sm text-pn-text-muted mt-1">Los mensajes llegarán en tiempo real al dashboard de cada inversor activo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="bg-pn-surface-strong border border-pn-border rounded-xl p-6">
          <h2 className="font-medium text-pn-text mb-5 flex items-center gap-2">
            <Bell size={18} className="text-pn-gold" />
            Nuevo anuncio
          </h2>

          {feedback && (
            <div className={`rounded-md p-3 text-sm mb-4 ${
              feedback.startsWith('✅') ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}>
              {feedback}
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="text-xs text-pn-text-muted uppercase tracking-wider block mb-1">Título</label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Ej. Actualización del proyecto"
                className="w-full bg-pn-bg border border-pn-border text-pn-text p-3 rounded-md focus:outline-none focus:border-pn-gold"
              />
            </div>
            <div>
              <label className="text-xs text-pn-text-muted uppercase tracking-wider block mb-1">Mensaje</label>
              <textarea
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                placeholder="Escribi el contenido del anuncio..."
                rows={4}
                className="w-full bg-pn-bg border border-pn-border text-pn-text p-3 rounded-md focus:outline-none focus:border-pn-gold resize-none"
              />
            </div>
            <div>
              <label className="text-xs text-pn-text-muted uppercase tracking-wider block mb-1">Destinatarios</label>
              <select
                value={form.target}
                onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                className="w-full bg-pn-bg border border-pn-border text-pn-text p-3 rounded-md focus:outline-none focus:border-pn-gold"
              >
                <option value="all">Todos los inversores</option>
                <option value="kyc_approved">Solo KYC aprobados</option>
                <option value="kyc_pending">Solo KYC pendientes</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading || !form.title || !form.body}
              className="w-full flex items-center justify-center gap-2 bg-pn-gold hover:bg-pn-gold/90 text-pn-bg font-medium py-3 rounded-md transition-colors disabled:opacity-50"
            >
              <Send size={16} />
              {loading ? 'Enviando...' : 'Enviar anuncio'}
            </button>
          </form>
        </div>

        {/* Historial enviados */}
        <div className="bg-pn-surface-strong border border-pn-border rounded-xl p-6">
          <h2 className="font-medium text-pn-text mb-5">Anuncios enviados (esta sesión)</h2>
          {sent.length === 0 ? (
            <p className="text-pn-text-muted text-sm">Aún no enviaste ningún anuncio en esta sesión.</p>
          ) : (
            <div className="space-y-4">
              {sent.map((s, i) => (
                <div key={i} className="border-b border-pn-border/50 pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-pn-text text-sm">{s.title}</p>
                    <span className="text-xs text-pn-text-muted">{s.time}</span>
                  </div>
                  <p className="text-xs text-pn-text-muted mt-1">{s.body}</p>
                  <span className="text-xs text-pn-gold">→ {s.target === 'all' ? 'Todos' : s.target === 'kyc_approved' ? 'KYC aprobados' : 'KYC pendientes'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
