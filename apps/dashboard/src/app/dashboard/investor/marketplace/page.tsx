import { RouteBreadcrumbs } from "@/components/mission";
import { MarketplaceClient } from "./MarketplaceClient";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MarketplacePage() {
  const cookieStore = await cookies();
  const sessionStr = cookieStore.get('pachanova-mock-session')?.value;
  if (!sessionStr) redirect('/login');
  
  const user = JSON.parse(sessionStr);
  if (user.role !== 'investor') redirect('/dashboard/admin');

  // Fetch open P2P orders
  const openOrders = await db.query.p2pOrders.findMany({
    where: eq(schema.p2pOrders.status, "open"),
    with: {
      property: true,
      sellerInvestor: true,
    }
  });

  // Fetch properties for the sell form
  const properties = await db.select().from(schema.properties);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <RouteBreadcrumbs />
        <h1 className="text-3xl font-light tracking-tight text-pn-text">
          Marketplace <span className="font-semibold text-pn-gold">P2P</span>
        </h1>
        <p className="text-pn-text-muted">
          Mercado secundario de fracciones RWA. Compra y vende tokens con otros inversores de la red.
        </p>
      </div>

      <MarketplaceClient 
        orders={openOrders} 
        properties={properties} 
      />
    </div>
  );
}
