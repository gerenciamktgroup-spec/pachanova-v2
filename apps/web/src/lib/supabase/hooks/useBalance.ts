'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '../client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface InvestorBalance {
  usd_balance: number
  token_balance: number
  reserved_usd: number
  reserved_tokens: number
}

const DEFAULT_BALANCE: InvestorBalance = {
  usd_balance: 0,
  token_balance: 0,
  reserved_usd: 0,
  reserved_tokens: 0,
}

/**
 * Subscribes to the authenticated user's balance in real time.
 * Returns { balance, loading, error }.
 *
 * Usage:
 *   const { balance, loading } = useBalance()
 */
export function useBalance() {
  const [balance, setBalance] = useState<InvestorBalance>(DEFAULT_BALANCE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    let channel: RealtimeChannel | null = null
    let cancelled = false

    async function fetchAndSubscribe() {
      // 1. Get current session
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData?.session?.user?.id
      if (!userId) {
        setLoading(false)
        return
      }

      // 2. Fetch investor id
      const { data: investor, error: invErr } = await supabase
        .from('investors')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (invErr || !investor) {
        setError(invErr?.message ?? 'Investor not found')
        setLoading(false)
        return
      }

      const investorId = investor.id

      // 3. Initial fetch
      const { data, error: balErr } = await supabase
        .from('balances')
        .select('usd_balance, token_balance, reserved_usd, reserved_tokens')
        .eq('investor_id', investorId)
        .single()

      if (!cancelled) {
        if (balErr) setError(balErr.message)
        else if (data) setBalance(data as InvestorBalance)
        setLoading(false)
      }

      // 4. Realtime subscription
      channel = supabase
        .channel(`balance:${investorId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'balances',
            filter: `investor_id=eq.${investorId}`,
          },
          (payload) => {
            if (!cancelled && payload.new) {
              setBalance(payload.new as InvestorBalance)
            }
          }
        )
        .subscribe()
    }

    fetchAndSubscribe()

    return () => {
      cancelled = true
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  return { balance, loading, error }
}
