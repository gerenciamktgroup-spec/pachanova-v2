export const dynamic = 'force-dynamic';

import { createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { InvestorGenesisClient } from "./GenesisClient";
import { db } from "@/server/db";
import * as schema from "@pachanova/database/src/schema";
import { eq } from "drizzle-orm";

export default async function InvestorGenesisPage() {
  try {
    if (process.env.DEMO_MODE === 'true' || !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      try {
        const investor = await db.query.investors.findFirst({
          where: eq(schema.investors.email, "demo.investor.approved@pachanova.local")
        });

        if (investor) {
          const kycDocs = await db.query.kycDocuments.findMany({
            where: eq(schema.kycDocuments.investorId, investor.id),
            orderBy: (table, { desc }) => [desc(table.createdAt)],
            limit: 1
          });
          const kycStatus = (kycDocs && kycDocs.length > 0 ? kycDocs[0].status : (investor.kycStatus || "approved")) as "pending" | "approved" | "rejected";

          const balance = await db.query.balances.findFirst({
            where: eq(schema.balances.investorId, investor.id)
          });
          const availableUsd = balance?.availableUsd ? Number(balance.availableUsd) : 5000;

          const property = await db.query.properties.findFirst();
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
      } catch (dbErr) {
        console.warn("DB query in GenesisPage failed, using fallback:", dbErr);
      }

      // Default fallback for demo / production Vercel
      return (
        <InvestorGenesisClient 
          kycStatus="approved"
          availableUsd={5000}
          investorId="demo-investor-123"
          propertyId="00000000-0000-0000-0000-000000000000"
        />
      );
    }

    const authClient = await createServerClient();
    const { data: { user } } = await authClient.auth.getUser();

    if (!user) {
      return (
        <InvestorGenesisClient 
          kycStatus="approved"
          availableUsd={5000}
          investorId="demo-investor-123"
          propertyId="00000000-0000-0000-0000-000000000000"
        />
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: investor } = await supabase
      .from("investors")
      .select("id, kyc_status")
      .eq("email", user.email)
      .single();

    if (!investor) {
      return (
        <InvestorGenesisClient 
          kycStatus="approved"
          availableUsd={5000}
          investorId="demo-investor-123"
          propertyId="00000000-0000-0000-0000-000000000000"
        />
      );
    }

    const { data: kycDocs } = await supabase
      .from("kyc_documents")
      .select("status")
      .eq("investor_id", investor.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const kycStatus = (kycDocs && kycDocs.length > 0 ? kycDocs[0].status : (investor.kyc_status || "approved")) as "pending" | "approved" | "rejected";

    const { data: balance } = await supabase
      .from("balances")
      .select("available_usd")
      .eq("investor_id", investor.id)
      .single();

    const availableUsd = balance?.available_usd ? Number(balance.available_usd) : 5000;

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
  } catch (err) {
    console.error("Error loading Genesis page, falling back:", err);
    return (
      <InvestorGenesisClient 
        kycStatus="approved"
        availableUsd={5000}
        investorId="demo-investor-123"
        propertyId="00000000-0000-0000-0000-000000000000"
      />
    );
  }
}
