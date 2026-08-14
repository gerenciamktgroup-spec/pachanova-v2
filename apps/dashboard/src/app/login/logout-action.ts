'use server'

import { createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {
  if (process.env.DEMO_MODE === 'true') {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    cookieStore.delete("pachanova_demo_session")
  } else {
    const supabase = await createServerClient()
    await supabase.auth.signOut()
  }
  redirect('/login')
}
