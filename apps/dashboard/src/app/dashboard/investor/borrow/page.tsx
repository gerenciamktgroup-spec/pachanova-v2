import { Suspense } from "react";
import { RouteBreadcrumbs, LoadingState, ErrorState } from "@/components/mission";
import { createServerClient } from "@/utils/supabase/server";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import DeFiBorrowClient from "./DeFiBorrowClient";

export const dynamic = 'force-dynamic';

async function fetchBorrowData() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Default to mock investor if not logged in for demo ease
    const userEmail = user?.email || "demo.investor.holder@pachanova.local";


    // Fetch investor profile
    const investor = await db.query.investors.findFirst({
      where: eq(schema.investors.email, userEmail),
    });

    if (!investor) {
      return { error: "Investor profile not found. Please log in first." };
    }

    // Fetch all active balances/holdings
    const portfolioQuery = await client`
      SELECT 
        b.available_tokens, b.locked_tokens, b.available_usd, b.locked_usd,
        p.id as property_id, p.name as property_name, p.property_type, p.location, p.status,
        p.token_price_usd, p.annual_yield_expected
      FROM balances b
      JOIN properties p ON b.property_id = p.id
      WHERE b.investor_id = ${investor.id}
    `;

    const portfolio = portfolioQuery.map((row: any) => ({
      propertyId: row.property_id,
      propertyName: row.property_name,
      propertyType: row.property_type,
      location: row.location,
      availableTokens: row.available_tokens,
      lockedTokens: row.locked_tokens,
      availableUsd: row.available_usd,
      lockedUsd: row.locked_usd,
      tokenPriceUsd: row.token_price_usd,
    }));

    // Fetch all active loans
    const loans = await db.query.loans.findMany({
      where: eq(schema.loans.investorId, investor.id),
      orderBy: (l, { desc }) => [desc(l.createdAt)],
    });

    // Fetch all properties to have the dynamic reference list
    const properties = await db.query.properties.findMany({
      where: inArray(schema.properties.status, ['trading', 'funding', 'funded']),
    });

    return {
      investor: {
        id: investor.id,
        fullName: `${investor.firstName} ${investor.lastName}`.trim(),
        email: investor.email,
      },
      portfolio,
      loans,
      properties: properties.map(p => ({
        id: p.id,
        name: p.name,
        location: p.location,
        tokenPriceUsd: p.tokenPriceUsd,
        annualYieldExpected: p.annualYieldExpected || "0",
        imageUrl: p.imageUrl,
      })),
    };
  } catch (error: any) {
    console.error("Error loading borrow data:", error);
    return { error: error.message };
  }
}

async function BorrowContent() {
  const data = await fetchBorrowData();

  if (data.error) {
    return (
      <ErrorState 
        title="Error al Cargar Módulo DeFi" 
        message={data.error} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Inversor" },
          { label: "Préstamos DeFi" }
        ]} />
      </div>

      <DeFiBorrowClient
        investor={data.investor!}
        portfolio={data.portfolio!}
        initialLoans={data.loans!}
        properties={data.properties!}
      />
    </div>
  );
}

export default function BorrowPage() {
  return (
    <Suspense fallback={<LoadingState message="Cargando panel de préstamos DeFi..." />}>
      <BorrowContent />
    </Suspense>
  );
}

