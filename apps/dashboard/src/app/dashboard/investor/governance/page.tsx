import { RouteBreadcrumbs } from "@/components/mission";
import GovernanceClient from "./GovernanceClient";
import { getDb, schema } from "@pachanova/database";
import { createServerClient } from "@/utils/supabase/server";
import { eq, sum } from "drizzle-orm";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function GovernancePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }

  const db = getDb();
  const [dbUser] = await db.select().from(schema.users).where(eq(schema.users.supabaseAuthId, user.id));

  let votingPower = 0;
  let liquidTokens = 0;
  let stakedTokens = 0;

  if (dbUser) {
    // Calcular Saldo Líquido y Staked
    const balances = await db.select({
      available: schema.balances.availableTokens
    }).from(schema.balances).where(eq(schema.balances.investorId, dbUser.id));
    liquidTokens = balances.reduce((acc, b) => acc + parseFloat(b.available), 0);

    const [stake] = await db.select().from(schema.stakes).where(eq(schema.stakes.investorId, dbUser.id));
    stakedTokens = stake ? parseFloat(stake.stakedAmount) : 0;

    votingPower = liquidTokens + (stakedTokens * 1.5); // Fase 42: Staking Multiplier
  }

  // Obtener todas las propuestas
  const rawProposals = await db.query.proposals.findMany({
    orderBy: (proposals, { desc }) => [desc(proposals.createdAt)],
    with: {
      relatedProperty: true
    }
  });

  // Obtener TODOS los votos para calcular el progreso, y buscar el voto del usuario
  const allVotes = await db.select().from(schema.votes);

  // Formatear propuestas para el Client
  const formattedProposals = rawProposals.map(p => {
    const propVotes = allVotes.filter(v => v.proposalId === p.id);
    const votesFor = propVotes.filter(v => v.choice === 'for').reduce((acc, v) => acc + parseFloat(v.votingPower), 0);
    const votesAgainst = propVotes.filter(v => v.choice === 'against').reduce((acc, v) => acc + parseFloat(v.votingPower), 0);
    const votesAbstain = propVotes.filter(v => v.choice === 'abstain').reduce((acc, v) => acc + parseFloat(v.votingPower), 0);
    
    // Obtener el voto específico del usuario si existe
    const userVote = dbUser ? propVotes.find(v => v.investorId === dbUser.id)?.choice || null : null;

    return {
      id: p.id,
      title: p.title,
      description: p.description || "",
      status: p.status,
      endDate: p.endAt ? p.endAt.toISOString() : null,
      votesFor,
      votesAgainst,
      votesAbstain,
      totalEligible: 1000000, // Dummy supply total
      userVote
    };
  });

  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[
        { label: 'Inversor' }, 
        { label: 'Gobernanza y Votaciones' }
      ]} />
      
      <div className="bg-[#0a111f] min-h-screen text-white rounded-2xl border border-white/10 p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c5a46d]/5 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40"></div>

        <div className="mb-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-purple-400 mb-1">Gobernanza de la Red</h2>
            <p className="text-sm text-white/50">Ejerce tu poder de voto (PACHA Power) en decisiones clave sobre las propiedades y el protocolo.</p>
          </div>
          
          <div className="bg-white/5 px-4 py-3 rounded-xl border border-white/10 flex items-center gap-4">
            <div>
              <span className="text-xs text-white/50 uppercase tracking-wider block">Tu Poder de Voto</span>
              <span className="text-lg font-bold text-[#c5a46d]">{votingPower.toLocaleString()} <span className="text-sm font-medium">PACHA</span></span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div>
              <span className="text-xs text-white/50 uppercase tracking-wider block">Tokens Líquidos</span>
              <span className="text-lg font-bold text-white">{liquidTokens.toLocaleString()}</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div>
              <span className="text-xs text-purple-400/80 uppercase tracking-wider block">Staked (x1.5)</span>
              <span className="text-lg font-bold text-purple-400">{stakedTokens.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <GovernanceClient initialProposals={formattedProposals} pachaPower={votingPower} />
        </div>
      </div>
    </div>
  );
}
