export const dynamic = 'force-dynamic';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { OnboardingStatus } from './OnboardingStatus';

export default async function OnboardingPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { createClient } = await import('@supabase/supabase-js');
  const sbAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: investor } = await sbAdmin
    .from('investors')
    .select('id, first_name, last_name, email')
    .eq('supabase_auth_id', user.id)
    .maybeSingle();

  if (!investor) redirect('/signup');

  const { data: kyc } = await sbAdmin
    .from('kyc_documents')
    .select('status, document_type, created_at')
    .eq('investor_id', investor.id)
    .maybeSingle();

  return (
    <OnboardingStatus
      investorId={investor.id}
      firstName={investor.first_name}
      kycStatus={kyc?.status || 'pending'}
      kycDocType={kyc?.document_type}
    />
  );
}
