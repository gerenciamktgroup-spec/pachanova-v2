export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import { RouteBreadcrumbs } from '@/components/mission/RouteBreadcrumbs';
import { LoadingState } from '@/components/mission/StateComponents';
import { BalancesControlClient } from './BalancesControlClient';

async function fetchAllBalances() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data } = await sb
    .from('balances')
    .select(`
      investor_id,
      available_usd,
      locked_usd,
      available_tokens,
      locked_tokens,
      investors(id, first_name, last_name, email, role)
    `)
    .neq('investor_id', '00000000-0000-0000-0000-000000000000')
    .order('available_tokens', { ascending: false });

  return data || [];
}

async function BalancesContent() {
  const balances = await fetchAllBalances();
  return (
    <div className="space-y-6 pb-24">
      <RouteBreadcrumbs items={[
        { label: 'Admin', href: '/dashboard/admin' },
        { label: 'Control de Saldos' }
      ]} />
      <BalancesControlClient initialData={balances} />
    </div>
  );
}

export default function BalancesPage() {
  return (
    <Suspense fallback={<LoadingState message="Cargando saldos..." />}>
      <BalancesContent />
    </Suspense>
  );
}
