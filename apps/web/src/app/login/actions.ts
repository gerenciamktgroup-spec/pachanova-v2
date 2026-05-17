'use server'

import { createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import type { AuthError } from '@supabase/supabase-js'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  console.log('Login attempt:', { email, userId: data?.user?.id || null, error: error ? (error as AuthError).message : null })

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  const { data: { user } } = await supabase.auth.getUser()
  const role = user?.app_metadata?.role as string | undefined

  if (role === 'admin' || role === 'operator') {
    redirect('/dashboard')
  } else if (role === 'investor') {
    redirect('/dashboard/investor')
  } else {
    redirect('/unauthorized')
  }
}
