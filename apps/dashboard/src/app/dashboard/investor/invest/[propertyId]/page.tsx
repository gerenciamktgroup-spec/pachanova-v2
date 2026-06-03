import { eq } from "drizzle-orm";
import { schema } from "@pachanova/database";
import { db } from "@/server/db";
import { createServerClient } from "@/utils/supabase/server";
import InvestClient from "./InvestClient";

export const dynamic = 'force-dynamic';

export default async function InvestPage(props: { params: Promise<{ propertyId: string }> }) {
  const params = await props.params;
  const propertyId = params.propertyId;


  const property = await db.query.properties.findFirst({
    where: eq(schema.properties.id, propertyId)
  });

  if (!property) {
    return <div className="p-8 text-white">Propiedad no encontrada.</div>;
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userEmail = user?.email || "demo.investor.holder@pachanova.local";

  const inv = await db.query.investors.findFirst({
    where: eq(schema.investors.email, userEmail)
  });

  const kycStatus = inv?.kycStatus || 'pending';

  return (
    <div className="pb-24">
      <InvestClient property={property} kycStatus={kycStatus} />
    </div>
  );
}
