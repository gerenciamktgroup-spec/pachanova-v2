export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LoadingState } from '@/components/mission/StateComponents';
import { RouteBreadcrumbs } from '@/components/mission/RouteBreadcrumbs';
import { KycReviewClient } from './KycReviewClient';

async function fetchKycData() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data } = await sb
    .from('kyc_documents')
    .select(`
      id,
      investor_id,
      document_type,
      file_url,
      status,
      uploaded_at,
      created_at,
      investors!inner(id, first_name, last_name, email)
    `)
    .order('created_at', { ascending: false });

  return data || [];
}

async function KycReviewContent() {
  const kyc = await fetchKycData();
  return (
    <div className="space-y-6 pb-24">
      <RouteBreadcrumbs items={[
        { label: 'Admin', href: '/dashboard/admin' },
        { label: 'Revisión KYC' }
      ]} />
      <KycReviewClient initialData={kyc} />
    </div>
  );
}

export default function KycReviewPage() {
  return (
    <Suspense fallback={<LoadingState message="Cargando documentos KYC..." />}>
      <KycReviewContent />
    </Suspense>
  );
}
