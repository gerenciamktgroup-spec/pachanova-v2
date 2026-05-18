export const dynamic = 'force-dynamic';

import { createServerClient } from '@/utils/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { DepositClient } from './DepositClient';

export default async function DepositPage() {
  const authClient = await createServerClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) redirect('/login');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Buscar investor por supabase_auth_id o email
  let investor: { id: string } | null = null;
  const { data: byAuthId } = await supabase.from('investors').select('id').eq('supabase_auth_id', user.id).maybeSingle();
  if (byAuthId) { investor = byAuthId; }
  else {
    const { data: byEmail } = await supabase.from('investors').select('id').eq('email', user.email).maybeSingle();
    investor = byEmail;
  }

  if (!investor) redirect('/signup');

  const { data: balance } = await supabase
    .from('balances')
    .select('available_usd, available_tokens')
    .eq('investor_id', investor.id)
    .maybeSingle();

  return (
    <DepositClient
      investorId={investor.id}
      currentUsd={Number(balance?.available_usd || 0)}
      currentTokens={Number(balance?.available_tokens || 0)}
    />
  );
}
