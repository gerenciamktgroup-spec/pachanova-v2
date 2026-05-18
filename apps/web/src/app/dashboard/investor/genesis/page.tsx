export const dynamic = 'force-dynamic';

import { createServerClient } from '@/utils/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { InvestorGenesisClient } from './GenesisClient';

export default async function InvestorGenesisPage() {
  const isDemo = process.env.NEXT_PUBLIC_IS_DEMO === 'true';

  let user = null;
  try {
    const authClient = await createServerClient();
    const res = await authClient.auth.getUser();
    user = res.data.user;
  } catch (e) {
    console.warn("Supabase auth failed on genesis page:", e);
  }

  if (!user) {
    if (isDemo) {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const demoKycOverride = cookieStore.get("demo_kyc_status")?.value;
      const kycStatus = demoKycOverride || 'approved';
      return (
        <InvestorGenesisClient
          kycStatus={kycStatus}
          availableUsd={15000}
          investorId="demo-investor-001"
          propertyId="00000000-0000-0000-0000-000000000001"
        />
      );
    }
    redirect('/login');
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Buscar inversor por supabase_auth_id primero, luego por email como fallback
  let investor: { id: string; kyc_status?: string } | null = null;

  const { data: byAuthId } = await supabase
    .from('investors')
    .select('id, kyc_status')
    .eq('supabase_auth_id', user.id)
    .maybeSingle();

  if (byAuthId) {
    investor = byAuthId;
  } else {
    const { data: byEmail } = await supabase
      .from('investors')
      .select('id, kyc_status')
      .eq('email', user.email)
      .maybeSingle();
    investor = byEmail;
  }

  if (!investor) {
    return (
      <div className="p-8 text-center text-red-400">
        <p className="text-lg font-medium">Perfil de inversor no encontrado.</p>
        <p className="text-sm text-pn-text-muted mt-2">Registrate en <a href="/signup" className="text-pn-gold underline">/signup</a> para crear tu cuenta.</p>
      </div>
    );
  }

  // KYC: verificar documentos
  const { data: kycDocs } = await supabase
    .from('kyc_documents')
    .select('status')
    .eq('investor_id', investor.id)
    .order('created_at', { ascending: false })
    .limit(1);

  const kycStatus = kycDocs?.[0]?.status || investor.kyc_status || 'pending';

  // Balance — maybeSingle para no crashear si no existe
  const { data: balance } = await supabase
    .from('balances')
    .select('available_usd')
    .eq('investor_id', investor.id)
    .maybeSingle();

  const availableUsd = Number(balance?.available_usd || 0);

  // Property ID — buscar primero, fallback a UUID null válido
  const { data: property } = await supabase
    .from('properties')
    .select('id')
    .limit(1)
    .maybeSingle();

  const propertyId = property?.id || '00000000-0000-0000-0000-000000000001';

  return (
    <InvestorGenesisClient
      kycStatus={kycStatus}
      availableUsd={availableUsd}
      investorId={investor.id}
      propertyId={propertyId}
    />
  );
}
