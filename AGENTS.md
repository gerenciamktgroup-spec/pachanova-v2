# AGENTS.md - PachaNova (fleet member)

This repo is part of the user's RWA / Aetheris / Copera / PachaNova platforms fleet.

**Core / Maestro Hub**: C:\Users\LENOVO\Documents\laboratorio-lihue-core (Panel Maestro)
- Source of truth for exact yield attribution (Fase16: token_holdings + rwa_distribuciones with snapshot, computePersonalYieldForUser, realtime, mail-to-declare closed loop).
- Orquestadores (mail-processor, google-bridge, core-auth-gateway) and autonomy layer (antigravity master, ps1 bridge, orchestrator:loop, schedulers).
- Blackboard: GitHub issues in gerenciamktgroup-spec/laboratorio-lihue-core with labels antigravity/plan/autonomous/high-impact.

**Autonomy in this project**:
- Bootstrap from core: ejecutar_grok.ps1, orchestrator_agent.cjs, index.cjs, antigravity_master.txt, setup-orquestadores.ps1 copied.
- Package scripts: "orchestrate", "orchestrate:loop", "orchestrate:dry" etc.
- To run Antigravity side (planner): powershell -File ".\ejecutar_grok.ps1" ".\antigravity_master.txt" (in dedicated terminal).
- Executor: npm run orchestrate:loop or activate /antigravity in TUI.
- They coordinate via the same GitHub blackboard (cross-label [pachanova] or sub-issues) + local plan_*.txt + the ps1 bridge for NEXT_BEST_FEATURE consults.
- Full E2E autonomous, no piecemeal, high-level reports only to idealist, DATOS REALES.

**Current integration with core (Fase17 fleet)**:
- Yield attribution and declare happen in core Panel (exact via holdings).
- This project can consume via sync/adapter (future: fetch from core supabase or google-bridge for shared projects/investors, display "Rendimiento exacto vía Panel Maestro (Fase 16 holdings)").
- Orquest layer here allows local autonomy + cross signals back to core (e.g. suggest yield from local mail/CRM to core declare).
- Run orchestrator in this cwd to participate in fleet scan and cycles.

See core's COMO_ENTRAR.md, antigravity_master.txt, plan_fase17_*, and GitHub #8/#11 for bootstrap details and next steps.

Respect core AGENTS.md for shared rules. Use skills (implement, design, execute-plan, antigravity) + MCP + subagents + schedulers for never-stop development across the fleet.

The singularity cycle includes this project now. Never stop.

Fase28 high-level only (core hub Maestro/orq/vertex/proof ready): Maestro generative command center E2E live (real 23125 + 2523325x + gcloud_vertex_gemini conf0.73 + tx@freshblock + cert verifier + Fase13 signals). Core ready for bootstrap. See core plan_fase28. 2026-06-03.

Fase29 high-level (PachaNova Landbank multi-product Peru + Master full manual): core advanced with schema 10_ (PNC-* seeds Paracas/Selva/San Bartolo/Chilca/Lima + product_configs for vivienda/alquiler/hotel/inversiones + manual_overrides + audit), orq landbank PNC load + forecasts (product specific, manual respect), Maestro UI Landbank tab (master edit/override/launch), verify Fase29. orq--dry/verify/build exercised (real 23125 + gcloud + RPC + PNC paths). Master can change ANY data manually in UI. Dedicated investor portfolio / surface here per ideador guidance (high-level only). Cycle continues via core scheduler/bridge. See core plan_fase29 + plan_pachanova_landbanking_*. 2026-06-03.
Fase33 high-level (Gobernanza Colectiva RWA): DB (Drizzle proposals/votes + enums + migration applied + seed PNC-SB/Paracas proposals). Dashboard investor /governance full interactive (server fetch real PACHA power from balances, client buttons A FAVOR/EN CONTRA/ABSTENERSE, POST /api/governance/vote with unique + weighted power snapshot, GET tallies). Added to routeRegistry. Fase34 continuation (V2 PNC Portfolio Net Cards): extended orq runFleet to return portfolioView (PNC-PAR net 68325 post-borrow etc + badges gcloud/onchain/MANUAL/land + relatedGovernance). Investor page renders rich per-PNC cards (gross/net, your share 12.5%*net, badges, health, 'Gobernanza' link to vote with PACHA power). maestroYield PNC-aware. Governance page header/context Fase34 net tie-in. Build green, core verify PASS (Fase32/16 intact). Git Fase33 + Fase34 commits. High-level only for cross (core blackboard updated with NEXT_BEST). Real PNC nets + holdings power + Fase33 proposals. See plan_fase32 + BLOCK18 + core next_feature. Cycle via scheduler. 2026-06-03.
Fase35 start (onchain gov + tx proofs E2E fused 9h roadmap): orq (pach+core) pure gov proof fns (compute/recompute/verifyGovProofMatch deterministic VOTE_GOV + PNC + PACHA power + block + 23125; real RPC). Schema/mig 0003 onchain cols. vote/route real block+store proof. Client badges + VERIFY + DOWNLOAD CERT. Core verify Fase35 section. orq--dry (real 2523535x gcloud0.73 PNC 68325 net + borrow), verify PASS + Fase35. High-level AGENTS/plan. Real data + Fase34 cards intact. 9h plan Fase35-45+ active (scheduler). DATOS REALES. 2026-06-03.
