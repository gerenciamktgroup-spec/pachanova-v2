'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '../client'

export interface Investor {
  id: string
  user_id: string
  display_name: string | null
  kyc_status: string
  investor_tier: string
  is_demo: boolean
  created_at: string
}

/**
 * Returns the authenticated user's investor profile.
 * Automatically re-fetches when auth state changes.
 *
 * Usage:
 *   const { investor, loading, error } = useInvestor()
 */
export function useInvestor() {
  const [investor, setInvestor] = useState<Investor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    let cancelled = false

    async function fetchInvestor() {
      setLoading(true)
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData?.session?.user?.id

      if (!userId) {
        if (!cancelled) {
          setInvestor(null)
          setLoading(false)
        }
        return
      }

      const { data, error: err } = await supabase
        .from('investors')
        .select(
          'id, user_id, display_name, kyc_status, investor_tier, is_demo, created_at'
        )
        .eq('user_id', userId)
        .single()

      if (!cancelled) {
        if (err) setError(err.message)
        else setInvestor(data as Investor)
        setLoading(false)
      }
    }

    fetchInvestor()

    // Re-fetch on auth changes (login / logout)
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchInvestor()
    })

    return () => {
      cancelled = true
      listener.subscription.unsubscribe()
    }
  }, [])

  return { investor, loading, error }
}
