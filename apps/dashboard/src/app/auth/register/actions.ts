'use server'

import { createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function register(formData: FormData) {
  const supabase = await createServerClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        role: 'investor' // Default role for registrations
      }
    }
  })

  if (error) {
    redirect(`/auth/register?message=${encodeURIComponent(error.message)}`)
  }

  // Si no hay confirmación de email requerida o queremos redirigir directamente
  redirect('/dashboard/investor')
}
