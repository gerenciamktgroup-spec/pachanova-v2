import { createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { InvestorGenesisClient } from "./GenesisClient";
import { requireRole } from "@/utils/auth/requireRole";

export default async function InvestorGenesisPage() {
  await requireRole(["investor"]);
  
  const authClient = await createServerClient();
  const { data: { user } } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Use Service Role to bypass RLS since GoTrue users were recreated and auth.uid() mismatches
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Get Investor
  const { data: investor } = await supabase
    .from("investors")
    .select("id, kyc_status")
    .eq("email", user.email)
    .single();

  if (!investor) {
    // If no investor record, fallback gracefully (or redirect)
    return <div className="p-8 text-center text-pn-danger">Error: Perfil de inversor no encontrado para {user.email}.</div>;
  }

  // 2. Get KYC Status (Check documents first, fallback to investor.kyc_status)
  const { data: kycDocs } = await supabase
    .from("kyc_documents")
    .select("status")
    .eq("investor_id", investor.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const kycStatus = kycDocs && kycDocs.length > 0 ? kycDocs[0].status : (investor.kyc_status || "pending");

  // 3. Get Balance
  const { data: balance } = await supabase
    .from("balances")
    .select("available_usd")
    .eq("investor_id", investor.id)
    .single();

  const availableUsd = balance?.available_usd ? Number(balance.available_usd) : 0;

  // 4. Get first property ID for the demo
  const { data: property } = await supabase
    .from("properties")
    .select("id")
    .limit(1)
    .single();

  const propertyId = property?.id || "00000000-0000-0000-0000-000000000000";

  return (
    <InvestorGenesisClient 
      kycStatus={kycStatus}
      availableUsd={availableUsd}
      investorId={investor.id}
      propertyId={propertyId}
    />
  );
}
