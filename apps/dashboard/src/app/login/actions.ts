'use server'

import { createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (process.env.DEMO_MODE === 'true') {
    const DEMO_USERS: Record<string, { role: string; password: string }> = {
      "gerencia.mktgroup@gmail.com": { role: "admin", password: "flavi0909A!" },
      "demo.admin@pachanova.local": { role: "admin", password: "Demo2026!" },
      "demo.investor.approved@pachanova.local": { role: "investor", password: "Demo2026!" },
      "demo.investor.holder@pachanova.local": { role: "investor", password: "Demo2026!" },
      "demo.investor.pending@pachanova.local": { role: "investor", password: "Demo2026!" },
      "demo.fiduciario@pachanova.local": { role: "fiduciario", password: "Demo2026!" },
      "demo.comite@pachanova.local": { role: "comite", password: "Demo2026!" },
    };

    const targetUser = DEMO_USERS[email];
    if (targetUser && targetUser.password === password) {
      const { cookies } = await import('next/headers')
      const cookieStore = await cookies()
      cookieStore.set("pachanova_demo_session", JSON.stringify({ email, role: targetUser.role }), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      const role = targetUser.role;
      if (role === 'admin' || role === 'operator') {
        redirect('/dashboard')
      } else if (role === 'investor') {
        redirect('/dashboard/investor')
      } else if (role === 'fiduciario' || role === 'comite') {
        redirect('/dashboard/fideicomiso')
      } else {
        redirect('/unauthorized')
      }
    } else {
      redirect(`/login?message=${encodeURIComponent("Credenciales incorrectas.")}`)
    }
  }

  const supabase = await createServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
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
    redirect('/dashboard/investor')
  } else if (role === 'fiduciario' || role === 'comite') {
    redirect('/dashboard/fideicomiso')
  } else {
    redirect('/unauthorized')
  }
}
