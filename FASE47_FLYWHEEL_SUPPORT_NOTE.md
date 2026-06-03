# FASE47_FLYWHEEL_IMPLEMENTATION_SUPPORT (for PachaNova Loop Coordinator subagent)

## Current Exercised Real PNC State (from prior windows + AGENTS)
- PNC-PAR-001: gross ~68537.5, net 68112.5 (post Fase9 borrow/accrue +212.5), health ~1.65
- Ownership growth flywheel (Fase47): base 23125 (23125@) + claimed ~8514 compound/reinvested → effective holdings 31639 / 17.1% eff
- Power: 3250 (Fase42 staked: base 1250? + 2000 staked; stakes_state.json currently shows PAR:3000 — sync/enhance)
- 4x GOV QUORUM PASSED (PAR/SB/CHI/AET) real land/INSERT/distrib paths, Fase36 gate ready_for_launch
- tx fresh publicnode (25239xxx range), gcloud_vertex 0.73, predict 0.82 FOR +2.3%
- 15PNC + AET, manual LIM, Master manual, Fase15 landbank completo (tokenized 4: RWA-PNC-PAR-001-2026 etc), Fase48 receipts (YIELD_CLAIM_ATTEST + YIELD_COMPOUND_ATTEST)
- schema10RealPAR override in orq: { eff: 31639, pct: '17.1%', net: 68112.5, power: 3250, staked: 2000, base: 23125, ... note: 'Fase47 flywheel + Fase15 RWA + schema10 seed applied' }

## Key Locations (from grep at restart)
- UI VERTEX section + growth badge: apps/dashboard/src/app/dashboard/investor/page.tsx (lines ~213-227, ~296+, Fase47 comments, RECLAMAR/REINVERTIR mentions, orqClaimables)
- Live buttons + handleAction: apps/dashboard/src/app/dashboard/investor/yields/YieldDistributionsClient.tsx
  - handleAction(distributionId, "claim" | "compound") → POST /api/yield/distributions {distributionId, investorId, action}
  - Expects {success, amountUsd, txHash?}
  - Then fetchData() refresh
  - Buttons: RECLAMAR (emerald), REINVERTIR (violet compound)
- API routes (small stubs exist per build):
  - apps/dashboard/src/app/api/yield/distributions/route.ts
  - apps/dashboard/src/app/api/yield/claim/route.ts
  - apps/dashboard/src/app/api/yield/compound/route.ts
- Orq Fase48 (simulated batch + receipts, needs wiring to real mutations):
  - orchestrator_agent.cjs (search for runFase48BatchClaimsOrRollups, YIELD_CLAIM_ATTEST, schema10RealPAR, Fase48 log)
- stakes_state.json (simple { "PNC-PAR-001": 3000, ... } — enhance loadStakes/stakePACHA etc for dynamic power + tie to eff growth)
- portfolioView / investor cards: orq + page.tsx (Fase15/34/36/42/47/48 sections)

## What "Live Fase47 Ownership Growth Flywheel" Means (acceptance per restart + window protocol)
1. On RECLAMAR or REINVERTIR: the action must invoke (orq or api bridge to) a real claim/compound function.
2. That fn mutates:
   - stakes_state.json (or in-mem + persist)
   - schema10RealPAR / portfolioView (eff: 31639, power updated, land_meta)
   - Possibly create receipt entry with note 'Fase47 flywheel + Fase15 RWA', tx attest YIELD_*_ATTEST
   - Update "effective holdings" badge / cards from 23125 → 31639 (growth +8514), 17.1%
3. UI reflects immediately after refetch: VERTEX OPTIMIZER shows growth, cards update eff/power, history/receipts show Fase47 entry, orqClaimables cleared or updated.
4. orq --dry / orchestrate:dry must log the FLYWHEEL action + exercised numbers + new eff.
5. Fase48 batch can call the same claim/compound for multiple PNC.
6. Respect Master manual, schema10 note when seeds present, DATOS REALES (use the exact numbers above).
7. Build green, no regressions on prior Fase9/15/36/42/44.

## Support Data
- Latest pre-restart window_PROGRESS: window_PROGRESS_9H_20260603_1900_pachanova-9h.md (pach-9h-012..017 cycles did staking/schema10/Fase48 UI/receipts/demo clean)
- Run `node index.cjs --dry` (or pnpm orchestrate:dry) after changes to verify.
- If git conflict: npm run resolve-conflicts <file>
- Use todo_write 'pach-9h-f47-*' + high-level only persist in new timestamped window_PROGRESS + AGENTS append.
- For cross: write high note to local antigravity_master.txt + window PROGRESS (refs 31639/3250 etc).

## Quick Start for Subagent
- Read the yields client fully + the two api/yield/* routes + orq Fase48 section + investor/page Fase47 block.
- Extend the POST /api/yield/distributions to branch on action and call orq helper (e.g. runFase47ClaimCompound(pnc, action)).
- Implement/enhance in orq: runFase47OwnershipFlywheelClaimCompound or similar (update eff/holdings/staked, log exactly the exercised string with growth, return {success, amountUsd: 8514, txHash: '0x...@' + freshBlock }).
- After action, the portfolio/investor data (orqPortfolioView or schema10 override) must show the new eff 31639.
- Test end-to-end in --dry + build + (if possible) remount UI.

DATOS REALES. Master manual. Singularity. TU CONTINUA. (Support note for the loop coordinator only.)
