'use server'

import { createServerClient } from '@/utils/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  if (!email || !password || !fullName) {
    redirect('/signup?error=missing_fields')
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1. Try admin.createUser first (bypasses email confirmation for demo)
  let userId: string | null = null

  const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (!adminError && adminData?.user) {
    userId = adminData.user.id
  } else {
    // Fallback: if admin API fails (e.g. user already exists), try standard signUp
    console.warn('admin.createUser failed, falling back to signUp:', adminError?.message)
    const supabaseClient = await createServerClient()
    const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (signUpError || !signUpData?.user) {
      console.error('Signup error (both methods failed):', signUpError)
      // Distinguish error types for better UX
      if (signUpError?.message?.toLowerCase().includes('already registered')) {
        redirect('/login?error=already_registered')
      }
      redirect('/signup?error=signup_failed&reason=' + encodeURIComponent(signUpError?.message || 'unknown'))
    }
    userId = signUpData.user.id
  }

  // 2. Sign in to establish a session
  const supabaseClient = await createServerClient()
  await supabaseClient.auth.signInWithPassword({ email, password })

  const nameParts = fullName.trim().split(' ')
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(' ') || 'Demo'

  // 3. Check if investor record already exists (avoid duplicate insert)
  const { data: existingInvestor } = await supabaseAdmin
    .from('investors')
    .select('id')
    .eq('supabase_auth_id', userId)
    .maybeSingle()

  let investorId: string

  if (existingInvestor?.id) {
    investorId = existingInvestor.id
  } else {
    // INSERT investors
    const { data: newInvestor, error: invError } = await supabaseAdmin
      .from('investors')
      .insert({
        supabase_auth_id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        role: 'investor',
        is_demo: true,
      })
      .select('id')
      .single()

    if (invError || !newInvestor) {
      console.error('Insert investor error:', invError)
      redirect('/signup?error=investor_creation_failed')
    }
    investorId = newInvestor!.id

    // INSERT balances
    await supabaseAdmin.from('balances').insert({
      investor_id: investorId,
      available_usd: '0',
      available_tokens: '0',
    })

    // INSERT kyc_documents
    await supabaseAdmin.from('kyc_documents').insert({
      investor_id: investorId,
      document_type: 'DEMO_IDENTITY',
      file_url: 'https://demo.pachanova.io/placeholder-kyc-doc',
      status: 'pending',
      is_demo: true,
    })

    // INSERT audit_logs
    await supabaseAdmin.from('audit_logs').insert({
      action: 'INVESTOR_REGISTERED',
      details: `New investor ${email} registered`,
      user_id: userId,
    })
  }

  redirect('/dashboard/investor/onboarding')
}

export async function getInvestorId() {
  const supabaseClient = await createServerClient()
  const { data: { session } } = await supabaseClient.auth.getSession()

  if (!session?.user) return null

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: investor } = await supabaseAdmin
    .from('investors')
    .select('id')
    .eq('supabase_auth_id', session.user.id)
    .single()

  return investor?.id || null
}
