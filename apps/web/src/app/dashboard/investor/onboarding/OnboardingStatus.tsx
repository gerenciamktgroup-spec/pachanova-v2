'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';

type KycStatus = 'pending' | 'approved' | 'rejected' | 'PENDING';

const statusConfig = {
  pending: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/40', icon: Clock, label: 'Documento en revisión' },
  PENDING: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/40', icon: Clock, label: 'Documento en revisión' },
  approved: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/40', icon: CheckCircle2, label: 'Identidad verificada' },
  rejected: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/40', icon: XCircle, label: 'Documento denegado' },
};

export function OnboardingStatus({
  investorId,
  firstName,
  kycStatus: initialStatus,
  kycDocType,
}: {
  investorId: string;
  firstName: string;
  kycStatus: KycStatus;
  kycDocType?: string;
}) {
  const [status, setStatus] = useState<KycStatus>(initialStatus);

  // Escuchar actualizaciones en tiempo real
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = supabase
      .channel(`kyc-onboarding-${investorId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'kyc_documents', filter: `investor_id=eq.${investorId}` },
        (payload) => {
          const newStatus = payload.new?.status as KycStatus;
          if (newStatus) setStatus(newStatus);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [investorId]);

  const cfg = statusConfig[status] || statusConfig.pending;
  const Icon = cfg.icon;
  const isApproved = status === 'approved';

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-light text-pn-gold">¡Bienvenido, {firstName}!</h1>
          <p className="text-sm text-pn-text-muted mt-2">Tu cuenta Pachanova está siendo procesada</p>
        </div>

        {/* Estado KYC */}
        <div className={`border rounded-xl p-6 ${cfg.bg}`}>
          <div className="flex items-center gap-4">
            <Icon size={32} className={cfg.color} />
            <div>
              <p className={`font-medium ${cfg.color}`}>{cfg.label}</p>
              <p className="text-sm text-pn-text-muted mt-0.5">
                {status === 'pending' || status === 'PENDING'
                  ? 'El equipo de Pachanova está revisando tu documento. Recibirás una notificación al instante.'
                  : status === 'approved'
                  ? '¡Ya podés comprar tokens PACHA y operar en el mercado!'
                  : 'Hay un problema con tu documentación. Comunicate con soporte.'}
              </p>
            </div>
          </div>

          {(status === 'pending' || status === 'PENDING') && (
            <div className="mt-4 flex items-center gap-2 text-xs text-pn-text-muted">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              Esperando aprobación del administrador...
            </div>
          )}
        </div>

        {/* Pasos del proceso */}
        <div className="bg-pn-surface-strong border border-pn-border rounded-xl p-6 space-y-4">
          <h3 className="font-medium text-pn-text text-sm">Proceso de activación</h3>
          {[
            { step: 1, label: 'Crear cuenta', done: true },
            { step: 2, label: 'Subir documento KYC', done: kycDocType !== 'PENDING' },
            { step: 3, label: 'Aprobación de identidad', done: isApproved },
            { step: 4, label: 'Simular depósito', done: false },
            { step: 5, label: 'Comprar tokens PACHA', done: false },
          ].map(s => (
            <div key={s.step} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border ${
                s.done
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'bg-pn-bg border-pn-border text-pn-text-muted'
              }`}>
                {s.done ? '✓' : s.step}
              </div>
              <span className={`text-sm ${s.done ? 'text-pn-text' : 'text-pn-text-muted'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* CTA si ya fue aprobado */}
        {isApproved && (
          <Link
            href="/dashboard/investor"
            className="flex items-center justify-center gap-2 w-full bg-pn-gold hover:bg-pn-gold/90 text-pn-bg font-medium py-3 rounded-xl transition-colors"
          >
            Ir a mi Dashboard <ArrowRight size={18} />
          </Link>
        )}
      </div>
    </div>
  );
}
