'use server'

import { createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  // Leer rol del usuario desde app_metadata (sincronizado vía trigger Supabase)
  const { data: { user } } = await supabase.auth.getUser()
  const role = user?.app_metadata?.role as string | undefined

  if (role === 'admin' || role === 'operator') {
    redirect('/dashboard')
  } else if (role === 'investor') {
    redirect('/unauthorized')
  } else {
    redirect('/unauthorized')
  }
}
