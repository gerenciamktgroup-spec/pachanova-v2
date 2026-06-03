
/**
 * Fase42: Compute real PACHA voting power = holdings (available + locked from balances) + staked (from stakes table)
 * Used for governance vote weight. Staked PACHA from DeFi lock accrues extra power.
 * Defensive: if stakes table missing (pre-migration), staked=0 with warn.
 */
export async function computePachaVotingPower(
  client: ReturnType<typeof postgres>,
  investorId: string
): Promise<{ holdings: number; staked: number; total: number }> {
  const holdingsRows = await client`
    SELECT COALESCE(SUM(available_tokens::numeric + locked_tokens::numeric), 0)::float as total
    FROM balances WHERE investor_id = ${investorId}
  `;
  const holdings = parseFloat(holdingsRows[0]?.total || '0');

  let staked = 0;
  try {
    const stakedRows = await client`
      SELECT COALESCE(SUM(staked_amount::numeric), 0)::float as staked
      FROM stakes WHERE investor_id = ${investorId}
    `;
    staked = parseFloat(stakedRows[0]?.staked || '0');
  } catch (e: any) {
    // Table may not exist until migration 0005 applied in DB (manual or orchestrator)
    console.warn('[Fase42] stakes table not found or query failed (staked fallback=0):', e?.message || e);
  }

  return { holdings, staked, total: holdings + staked };
}

