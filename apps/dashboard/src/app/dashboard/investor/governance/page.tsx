import { Suspense } from "react";
import { RouteBreadcrumbs, ErrorState, LoadingState, MissionCard } from "@/components/mission";
import { SafeActionButton } from "@/components/mission/SafeActionButton";
import { createServerClient } from "@/utils/supabase/server";
import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import GovernanceVotingClient from "./GovernanceVotingClient";
import { computePachaVotingPower } from "@/lib/governance/computePachaPower";
import { HologramPncCard } from "@/components/product/HologramPncCard"; // Fase4 expansion: HologramPncCard to governance for PachaNova Landbanking full identity + 5PNC visuals in voting context

export const dynamic = 'force-dynamic';

interface ProposalRow {
  id: string;
  title: string;
  description: string | null;
  status: string;
  relatedPropertyId: string | null;
  startAt: Date;
  endAt: Date | null;
  quorumRequired: string | null;
  vertexPrediction: string | null;
}

interface VoteRow {
  proposalId: string;
  choice: string;
  votingPower: string;
  createdAt: Date;
}

async function fetchGovernanceData() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const userEmail = user?.email || "investor@pachanova.local";


    const investor = await db.query.investors.findFirst({
      where: eq(schema.investors.email, userEmail),
    });

    if (!investor) {
      return { error: "Investor profile not found. Login required for governance." };
    }

    // Fetch active proposals (and recent for demo)
    const proposals: ProposalRow[] = await db.query.proposals.findMany({
      where: eq(schema.proposals.status, "active"),
      orderBy: (p, { desc }) => [desc(p.createdAt)],
      limit: 10,
    });

    // Fase42: Compute real PACHA voting power = holdings (balances) + staked (DeFi accrual for gov power boost)
    const holdingsRows = await db.execute(sql`
      SELECT COALESCE(SUM(available_tokens::numeric + locked_tokens::numeric), 0)::float as total
      FROM balances WHERE investor_id = ${investor.id}
    `);
    const baseHoldings = parseFloat((holdingsRows as any[])[0]?.total || '0');

    let stakedPacha = 0;
    try {
      const stakedRows = await db.execute(sql`
        SELECT COALESCE(SUM(staked_amount::numeric), 0)::float as staked
        FROM stakes WHERE investor_id = ${investor.id}
      `);
      stakedPacha = parseFloat((stakedRows as any[])[0]?.staked || '0');
    } catch (e: any) {
      console.warn('[Fase42] stakes table not found or query failed (staked fallback=0):', e?.message || e);
    }
    const totalPachaHoldings = baseHoldings + stakedPacha;

    // Fetch this investor's past votes (for all proposals to show status)
    const myVotes: VoteRow[] = [];
    if (proposals.length > 0) {
      const propIds = proposals.map(p => p.id);
      const votesRaw = await db.query.votes.findMany({
        where: inArray(schema.votes.proposalId, propIds),
      });
      // Filter to current investor
      for (const v of votesRaw) {
        if (v.investorId === investor.id) {
          myVotes.push({
            proposalId: v.proposalId,
            choice: v.choice,
            votingPower: v.votingPower,
            createdAt: v.createdAt,
          });
        }
      }
    }

    // Also fetch global tallies for each proposal (simple count for UI)
    const tallies: Record<string, any> = {};
    for (const p of proposals) {
      const t = await db.execute(sql`
        SELECT choice, COUNT(*)::int as c, COALESCE(SUM(voting_power::numeric),0)::float as pwr
        FROM votes WHERE proposal_id = ${p.id} GROUP BY choice
      `);
      tallies[p.id] = { for: 0, against: 0, abstain: 0, powerFor: 0, powerAgainst: 0, powerAbstain: 0 };
      for (const row of (t as any[])) {
        const key = row.choice;
        if (key === 'for') { tallies[p.id].for = row.c; tallies[p.id].powerFor = row.pwr; }
        else if (key === 'against') { tallies[p.id].against = row.c; tallies[p.id].powerAgainst = row.pwr; }
        else if (key === 'abstain') { tallies[p.id].abstain = row.c; tallies[p.id].powerAbstain = row.pwr; }
      }
    }

    return {
      investor: {
        id: investor.id,
        fullName: `${investor.firstName || ''} ${investor.lastName || ''}`.trim(),
        email: investor.email,
      },
      proposals,
      totalPachaHoldings,
      stakedPacha,
      baseHoldings,
      myVotes,
      tallies,
    };
  } catch (error: any) {
    console.error("[GOVERNANCE] fetch error:", error);
    return { error: error.message || "Failed to load governance data" };
  }
}

export default async function InvestorGovernancePage() {
  const data = await fetchGovernanceData();

  if (data.error) {
    return (
      <div className="space-y-8 pb-24">
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Panel Inversor", href: "/dashboard/investor" },
          { label: "Gobernanza RWA" }
        ]} />
        <ErrorState title="Error de Gobernanza" message={data.error} />
      </div>
    );
  }

  const { investor, proposals, totalPachaHoldings, stakedPacha, baseHoldings, myVotes, tallies } = data;

  return (
    <div className="space-y-8 pb-24">
      <div>
        <RouteBreadcrumbs items={[
          { label: "Dashboard" },
          { label: "Panel Inversor", href: "/dashboard/investor" },
          { label: "Gobernanza Colectiva RWA" }
        ]} className="mb-4" />
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-pn-gold text-sm font-mono tracking-[2px] mb-1">FASE 33 + 34 • RWA DAO + NET YIELDS</div>
            <h1 className="text-4xl font-semibold text-white">Gobernanza Colectiva RWA</h1>

      {/* Fase4 + full project: Hologram for landbank PNC in governance context (votes on 5PNC launches) */}
      <div className="text-xs uppercase tracking-[2px] text-[#c5a46d]/70 border-b border-[#c5a46d]/20 pb-1 mb-2 mt-2">GOBERNANZA SOBRE LANDBANK 5PNC — FULL PACHA NOVA PROJECT (votes power from holdings + Fase42 stake + Master launches gated)</div>
      <div className="mb-4">
        {/* MACRO-FASE 141: real DB data for hologram in governance (Maestro/Inversor) */}
        {(await (await import('../../../../server/db')).getRealHologramPncs(1)).map((pnc: any, i: number) => (
          <div key={i}>
            <HologramPncCard pnc={pnc as any} compact />
            {/* MACRO-FASE 141: cablear Vender P2P button */}
            <a href={`/dashboard/investor/marketplace?pnc=${encodeURIComponent(pnc.metadata?.pncCode || pnc.id)}`} className="mt-1 block text-xs px-2 py-0.5 border border-blue-600 text-blue-400 rounded hover:bg-blue-900/20 text-center">Vender en Mercado Secundario (P2P)</a>
          </div>
        ))}
      </div>
            <p className="text-pn-text-soft mt-2 max-w-2xl">
              Vota decisiones clave sobre activos reales (PNC-*). Tu voto está ponderado por tus tenencias reales de tokens PACHA (holdings + staked Fase42 DeFi). Bloquea PACHA para accrual de poder de voto + descuentos. Fase34 net + Fase35 onchain intactos.
            </p>
          </div>
            <div className="hidden sm:block text-right">
              <div className="text-xs text-pn-text-soft">TU PODER DE VOTO ACTUAL (FASE42)</div>
              <div className="text-3xl font-semibold tabular-nums text-white">{(totalPachaHoldings || 0).toLocaleString()} <span className="text-sm text-pn-gold">PACHA</span></div>
              <div className="text-[10px] text-pn-text-soft/70">Holdings: {(baseHoldings || 0).toLocaleString()} + Staked: {(stakedPacha || 0).toLocaleString()} (DeFi accrual)</div>
            </div>
        </div>
      </div>

      <MissionCard className="bg-pn-surface border border-pn-border">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div>
            <div className="text-sm text-pn-text-soft">Inversor</div>
            <div className="font-medium">{investor?.fullName} <span className="font-mono text-xs text-pn-text-soft">({investor?.email})</span></div>
          </div>
          <div className="flex gap-2">
            <SafeActionButton label="Volver al Panel" href="/dashboard/investor" variant="ghost" />
            <SafeActionButton label="Ver Portafolio" href="/dashboard/investor" variant="secondary" />
          </div>
        </div>
      </MissionCard>

      {/* Fase4 + Fase1: HologramPncCard in governance + PachaNova Landbanking banner + hub feel + ver avances concrete UI */}
      <div className="border border-violet-500/30 rounded-xl p-4 bg-[#0a111f]">
        <div className="text-[10px] uppercase tracking-[2px] text-violet-400 mb-2">PACHA NOVA LANDBANKING — GOVERNANCE SOBRE 5PNC (PODR FASE42 + HOLOGRAMAS DE PROPIEDADES • QUORUM REAL ORQ)</div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-2">
          {/* MACRO-FASE 141: real DB for gov holograms + Vender P2P */}
          {(await (await import('../../../../server/db')).getRealHologramPncs(2)).map((pnc: any, i: number) => (
            <div key={i}>
              <HologramPncCard pnc={pnc as any} compact />
              <a href={`/dashboard/investor/marketplace?pnc=${encodeURIComponent(pnc.metadata?.pncCode || pnc.id)}`} className="mt-1 block text-xs px-2 py-0.5 border border-blue-600 text-blue-400 rounded hover:bg-blue-900/20 text-center">Vender en Mercado Secundario (P2P)</a>
            </div>
          ))}
        </div>
        <div className="text-[9px] mt-1"><a href="#ver-avances" className="text-emerald-400 hover:underline">VER TODOS LOS AVANCES (Fase1 consolidation + Fase4 holograms expansion en yields/gov/market/hero/admin) → blackboard</a></div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Propuestas Activas</h2>
          <div className="text-xs px-3 py-1 rounded bg-pn-gold/10 text-pn-gold border border-pn-gold/30">Peso = Holdings + Staked PACHA (Fase42 DeFi accrual) • Fase34 net context</div>
        </div>

        {(proposals || []).length === 0 ? (
          <MissionCard>
            <div className="text-pn-text-soft">No hay propuestas activas en este momento. El comité o landbank puede proponer vía orquestador.</div>
          </MissionCard>
        ) : (
          <Suspense fallback={<LoadingState message="Cargando propuestas de gobernanza RWA..." />}>
            <GovernanceVotingClient
              proposals={proposals || []}
              totalPachaHoldings={totalPachaHoldings || 0}
              stakedPacha={stakedPacha || 0}
              baseHoldings={baseHoldings || 0}
              myVotes={myVotes || []}
              tallies={tallies || {}}
              investorId={investor?.id}
            />
          </Suspense>
        )}
      </div>

      <MissionCard>
        <div className="text-sm text-pn-text-soft space-y-1">
          <div><strong>Reglas de Votación (RWA Governance Fase42):</strong></div>
          <ul className="list-disc pl-5 text-xs space-y-0.5">
            <li>Voto ponderado 1:1 por token PACHA en tenencia (available + locked de balances + staked_amount de stakes Fase42).</li>
            <li>DeFi Staking: usa Stake/Unstake en el panel para bloquear PACHA, aumentar tu poder de voto y accrual (power = holdings + staked).</li>
            <li>Un voto por inversor por propuesta (on-chain ready via unique constraint). Stake/Unstake refresca poder inmediatamente.</li>
            <li>Quórum por defecto 10-20%. Estado actualizado en tiempo real vía DB + Fase35 onchain tx proofs intactos.</li>
            <li>Decisiones afectan Landbank / distribuciones / lanzamientos PNC (ver Fase29-32,40+). Fase42 integrado a governance.</li>
          </ul>
        </div>
      </MissionCard>
    </div>
  );
}

