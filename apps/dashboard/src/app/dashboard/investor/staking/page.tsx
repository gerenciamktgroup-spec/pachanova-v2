import { RouteBreadcrumbs } from "@/components/mission";
import StakingClient from "./StakingClient";
import { getDb, schema } from "@pachanova/database";
import { createServerClient } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function StakingPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }

  const db = getDb();
  const [dbUser] = await db.select().from(schema.users).where(eq(schema.users.supabaseAuthId, user.id));

  let liquidTokens = 0;
  let stakedTokens = 0;

  if (dbUser) {
    const balances = await db.select({
      available: schema.balances.availableTokens
    }).from(schema.balances).where(eq(schema.balances.investorId, dbUser.id));
    liquidTokens = balances.reduce((acc, b) => acc + parseFloat(b.available), 0);

    const [stake] = await db.select().from(schema.stakes).where(eq(schema.stakes.investorId, dbUser.id));
    stakedTokens = stake ? parseFloat(stake.stakedAmount) : 0;
  }

  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[
        { label: 'Inversor' }, 
        { label: 'Staking & Yield' }
      ]} />
      
      <div className="bg-[#0a111f] min-h-screen text-white rounded-2xl border border-white/10 p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c5a46d]/5 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40"></div>

        <div className="mb-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-purple-400 mb-1">Vault de Staking</h2>
            <p className="text-sm text-white/50">Bloquea tus tokens para obtener multiplicador de Poder de Voto (1.5x) y ganar mayores rendimientos.</p>
          </div>
        </div>

        <div className="relative z-10">
          <StakingClient liquidTokens={liquidTokens} stakedTokens={stakedTokens} />
        </div>
      </div>
    </div>
  );
}
