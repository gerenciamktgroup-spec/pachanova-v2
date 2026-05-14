import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export function useRealtimeNotifications(investorId: string, onNotification: (payload: any) => void) {
  useEffect(() => {
    if (!investorId) return

    const supabase = createClient()

    const channel = supabase
      .channel(`notifications:${investorId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `investor_id=eq.${investorId}`,
        },
        (payload) => {
          onNotification(payload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [investorId, onNotification])
}

export function useRealtimeBalances(investorId: string, onBalanceChange: (payload: any) => void) {
  useEffect(() => {
    if (!investorId) return

    const supabase = createClient()

    const channel = supabase
      .channel(`balances:${investorId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'balances',
          filter: `investor_id=eq.${investorId}`,
        },
        (payload) => {
          onBalanceChange(payload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [investorId, onBalanceChange])
}
