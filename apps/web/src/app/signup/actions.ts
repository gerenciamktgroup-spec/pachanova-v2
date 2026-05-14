'use server'

import { createServerClient } from '@/utils/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1. supabaseAdmin.auth.admin.createUser() to bypass rate limits
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true // Auto confirm for demo
  })

  if (authError || !authData.user) {
    console.error('Signup error:', authError)
    redirect('/login?error=signup_failed')
  }

  const userId = authData.user.id

  // Automatically sign in the user to establish a session
  const supabaseClient = await createServerClient()
  await supabaseClient.auth.signInWithPassword({ email, password })

  const nameParts = fullName.trim().split(' ')
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(' ') || 'Demo'

  // INSERT investors
  const { data: newInvestor, error: invError } = await supabaseAdmin.from('investors').insert({
    supabase_auth_id: userId,
    email,
    first_name: firstName,
    last_name: lastName,
    role: 'investor',
    is_demo: true
  }).select('id').single()

  if (invError || !newInvestor) {
    console.error('Insert investor error:', invError)
    return redirect('/login?error=investor_creation_failed')
  }

  // 3. INSERT balances
  await supabaseAdmin.from('balances').insert({
    investor_id: newInvestor.id,
    available_usd: '0',
    available_tokens: '0'
  })

  // 4. INSERT kyc_documents
  await supabaseAdmin.from('kyc_documents').insert({
    investor_id: newInvestor.id,
    document_type: 'DEMO_IDENTITY',
    file_url: 'https://demo.pachanova.io/placeholder-kyc-doc',
    status: 'pending',
    is_demo: true
  })

  // 5. INSERT audit_logs
  await supabaseAdmin.from('audit_logs').insert({
    action: 'INVESTOR_REGISTERED',
    details: `New investor ${email} registered`,
    user_id: userId
  })

  // 6. Redirect a /dashboard/investor/onboarding
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
