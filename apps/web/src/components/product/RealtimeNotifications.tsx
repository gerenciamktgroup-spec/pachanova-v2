'use client';

import { useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

type ToastFn = (opts: { title: string; description?: string; duration?: number }) => void;

/**
 * Componente invisible que escucha eventos Supabase Realtime
 * y dispara toasts de notificación en tiempo real.
 * Montar en el layout del dashboard del inversor.
 */
export function RealtimeNotifications({
  investorId,
  toast,
}: {
  investorId: string;
  toast: ToastFn;
}) {
  useEffect(() => {
    if (!investorId) return;

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Canal 1: KYC aprobado para este inversor
    const kycChannel = supabase
      .channel(`kyc-${investorId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'kyc_documents',
          filter: `investor_id=eq.${investorId}`,
        },
        (payload) => {
          const newStatus = payload.new?.status;
          if (newStatus === 'approved') {
            toast({
              title: '✅ KYC Aprobado',
              description: '¡Tu identidad fue verificada! Ya podés comprar tokens PACHA.',
              duration: 8000,
            });
          } else if (newStatus === 'rejected') {
            toast({
              title: '❌ KYC Denegado',
              description: 'Hay un problema con tu documentación. Contactá al equipo de Pachanova.',
              duration: 10000,
            });
          }
        }
      )
      .subscribe();

    // Canal 2: Anuncios del admin
    const announcementsChannel = supabase
      .channel('admin-announcements')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'announcements',
        },
        (payload) => {
          toast({
            title: `📢 ${payload.new?.title || 'Anuncio de Pachanova'}`,
            description: payload.new?.body,
            duration: 10000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(kycChannel);
      supabase.removeChannel(announcementsChannel);
    };
  }, [investorId, toast]);

  return null;
}
