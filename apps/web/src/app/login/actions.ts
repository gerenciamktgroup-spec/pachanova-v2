'use server'

import { createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // DEBUG: Log what we're sending
  const debugInfo: string[] = []
  debugInfo.push('=== LOGIN DEBUG ===')
  debugInfo.push(`Email: ${JSON.stringify(email)}`)
  debugInfo.push(`Password: ${JSON.stringify(password)}`)
  debugInfo.push(`Password length: ${password?.length}`)
  debugInfo.push(`SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
  debugInfo.push(`ANON_KEY starts: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 40)}`)
  debugInfo.push(`ANON_KEY ends: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(-20)}`)
  debugInfo.push('===================')
  console.log(debugInfo.join('\n'))
  const fs = require('fs')
  fs.writeFileSync('C:/tmp/login-debug.txt', debugInfo.join('\n'), 'utf-8')

  const supabase = await createServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // DEBUG: Log result
  console.log('=== LOGIN RESULT ===')
  console.log('Error:', error ? JSON.stringify({ message: error.message, status: error.status, code: (error as any).code }) : 'null')
  console.log('User:', data?.user?.id || 'null')
  console.log('====================')

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  // Leer rol del usuario desde app_metadata (sincronizado vía trigger Supabase)
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

