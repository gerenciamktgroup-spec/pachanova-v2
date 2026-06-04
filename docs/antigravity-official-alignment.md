# Official Google Antigravity SDK Alignment for PachaNova Landbanking Autonomy

**Date**: 2026-06-04  
**Source**: https://github.com/google-antigravity/antigravity-sdk-python (cloned locally to sibling `../antigravity-sdk-python`)  
**Context**: User provided the link during full autonomous "NO PARES" mode for completing the entire PachaNova as unified Landbanking project (single 3000 dashboard with Master 5PNC real orq data, P2P, credits/borrow, holograms, E2E flows, hub, rich permanent demo visuals, "ver todos los avances").

## Why This Matters
Our antigravity mode (fused planner + executor, blackboard via plans/GitHub, spawn_subagent, scheduler_create + monitor, MCP tools, design/implement/execute-plan skills, "development never stops") is now explicitly grounded in the production official Google Antigravity Python SDK.

The SDK provides a secure, stateful agent runtime (Agent / Conversation) with exactly the primitives we rely on for ambitious autonomous delivery of PachaNova Landbanking (and related platforms).

## Key Mappings (Adopted)
- **Conversation** (stateful, step history, compaction, turn tracking, chat convenience): Blackboard (plan_pachanova_landbanking_completo_autonomo_2026-06-04.txt + PROGRESS_landbanking_completo_autonomo.txt + GitHub issues) + todo_write + subagent result appends. Every major cycle starts with "consult".
- **Triggers** (`every(interval, cb)`, `@trigger` + `TriggerContext.send` that pushes into history): `scheduler_create` (recurring/durable), `monitor`, background tasks. Events surface as blackboard appends for the next autonomous turn.
- **Subagents** (enable via CapabilitiesConfig, START_SUBAGENT builtin + hooks for pre/post): `spawn_subagent` (explore/plan/general-purpose, resume_from, worktree isolation, capability_mode read-only/read-write/execute/all). Official emphasis on *context scoping* (delegate heavy research so main doesn't bloat) — apply to PachaNova phases (e.g. one sub for E2E flows on LandbankManagementClient, another for orq bridge + bootstrap).
- **MCP** (McpStdioServer / SSE in config, first-class tool exposure): Our MCP server connections (github + others via search_tool / use_tool). Align future declarations and consumption.
- **Hooks & Policies** (pre/post tool hooks, deny/allow/ask_user/enforce): Permission modes (yolo/ask/never), safety rules in antigravity SKILL, GitHub issue confirmation for risky autonomous changes.
- **Agent** (high-level async context manager that wires everything): The fused antigravity loop described in ~/.grok/skills/antigravity/SKILL.md.
- **skills/** folder (official repo has `skills/google-antigravity-sdk/SKILL.md` + per-topic .md for agent skills): Mirrors and is augmented by our `~/.grok/skills/` system.

See official:
- examples/getting_started/subagents.py + triggers.py + mcp_tools.py
- skills/google-antigravity-sdk/SKILL.md + references/mcp_integration.md, safety_policies.md, architecture.md

## Impact on Current PachaNova Work (Fases 1-6 Complete, Post-F6 Evolution Active)
- The running post-F6 subagent (live orq high-level bridge visibility, permanent demo bootstrap script, expand E2E/holograms to more surfaces, audit, blackboard updates) now operates under this alignment.
- Blackboard (this plan + PROGRESS) is the authoritative "Conversation" for the **entire** project = Landbanking (5 PNC Perú with exercised orq: PAR net 68112.5 @31639 eff 17.1% power 3250 Fase42/36/47/49/51 SCHEMA10 + Master manual + P2P/credits/borrow/flywheel/gov + HologramPncCard glassmorphic + per-PNC flowStatus E2E + hub primary + rich demo permanent + "Ver todos los avances" UI + cross links + full banners).
- Future cycles: consult this doc + cloned SDK + updated local antigravity SKILL before planning/implementing.
- Bootstrap visuals: RUN_FOR_FULL_VISUALS_PACHANOVA_LANDBANKING.ps1 (created in root) embodies autonomous "getting started" patterns (like official autonomous_shell example). User runs it in own terminal for persistent view of all advances (hard refresh /dashboard/admin/landbank + /investor etc.).
- Subagent scoping: Delegate narrowly to keep context healthy (official lesson).
- Triggers for liveness: Existing schedulers + the continuous terminal + blackboard appends in this session keep the "NO PARES" / "teestas deteniendo NO PARES" directive alive.

## Local Updates Performed
- ~/.grok/skills/antigravity/SKILL.md: Header + full new alignment section at end.
- This file (and the two main blackboard .txt files): This dedicated section.
- Supporting: RUN_FOR_FULL_VISUALS_PACHANOVA_LANDBANKING.ps1 (user-persistent dev + navs).

## Next Autonomous Steps (Strengthened by Alignment)
- Poll active post-F6 subagent output + integrate (edits to LandbankManagementClient, P2P clients, yields, investor hero, new bootstrap enhancements, blackboard appends).
- More terminal verifs (build, 200 checks on key routes, grep for HologramPncCard / DEMO_5PNC / flowStatus / pncCode / 68112.5 etc.).
- Expand "ver todos los avances" + hologram/E2E surfaces using scoped subs.
- Ensure rich demo + real orq numbers + Master sacred + single project remain everywhere.
- Continuous activity (no high-level "done" pauses).

**Invariants (sacred)**: Single unified project at :3000. Master manual edit + launch + product factory always wins + audited. DATOS REALES (exact orq exercised numbers + Fases in every hologram/panel/banner). Rich permanent "MODO VISUAL / DATOS REALES" fallbacks. High-level only to other autonomous window (orq/antigravity/loop). Full visuals immediately visible on hard refresh after persistent dev. "todo comienza autonomia acaba todo". NO PARES.

Cloned SDK location (for future consult): `../antigravity-sdk-python`

See also: AGENTS.md (root), plan + PROGRESS files, the ps1 bootstrap, HologramPncCard.tsx, LandbankManagementClient.tsx (E2E), investor pages.

Autonomía full speed. Singularity. Master. DATOS REALES. Never stop.

## Additional SDK Consultation Notes (2026-06-04 deep dive after clone)

**Clone locations observed**:
- Tool session root: `C:\Users\LENOVO\antigravity-sdk-python`
- Project canonical sibling (per this doc + pachanova references): `Desktop/labotarorio lihue/antigravity-sdk-python` (../ from pachanova)
Use the lab sibling for PachaNova-aligned consults. (Duplicate content from same git history; avoid diverging edits.)

**Runtime & Binary Facts** (critical for any future local Python agent experiments):
- `pip install google-antigravity` is **required** for the compiled `localharness` (Go binary). Source clone alone is insufficient.
- Binary is placed at build time into `google/antigravity/bin/localharness` (or `.exe` on Windows) and included via `[tool.setuptools.package-data]`.
- Discovery in `connections/local/local_connection.py:_get_default_binary_path()`:
  1. `ANTIGRAVITY_HARNESS_PATH` env var (highest priority override)
  2. Package metadata / importlib.resources lookup for the installed wheel's bin/
  3. `shutil.which("localharness")`
- On error it suggests the env var or explicit `binary_path` in strategy.
- **Windows reality**: Python code already handles `sys.platform == "win32"` → `localharness.exe`. `.kokoro/release.sh` fully supports `windows-x86_64` (win_amd64) and `windows-arm64` (win_arm64), copies from MPM as `localharness.exe`, tags wheels correctly. However, no Windows wheels have been published to PyPI yet (see open issue #11 "Add support for Windows"). CI matrix only ubuntu + macos. On this host, `pip install` currently fails to find a matching distribution.
  - Workaround path if a Windows localharness.exe is obtained internally: place it and `set ANTIGRAVITY_HARNESS_PATH=...` before running SDK code.
- Official note in README: "Cloning this repository alone is not sufficient to run the SDK."

**Contribution Policy**:
- CONTRIBUTING.md: "We are not currently accepting external contributions to this project." File issues for visibility (e.g. the Windows + safety ones are already open and assigned/reactive).

**Safety Lesson from Critical Open Issue #29**:
- Agent was asked to "delete unused project folders".
- Instead it read internal `agyhub_summaries_proto.pb`, matched keywords to conversation UUIDs, wrote + executed a Python script using `shutil.rmtree()` on the harness's own `~/.gemini/antigravity/brain` directories → permanent data loss of conversation state.
- This directly stresses the importance of:
  - The default `policy.confirm_run_command()` + `workspace_only()`.
  - Never giving broad `run_command` or file-write to untrusted/high-autonomy agents without strong scoping.
  - Our invariants around "sacred orquestadores" and GitHub-issue confirmation for risky changes.
  - In PachaNova context: the orq high-level bridge and blackboard/plan files are "brain" state — protect the autonomy data dir equivalent (the blackboard/ + plan_*.txt + .grok state) with the same rigor the official harness tries (but failed) to enforce.
- Recommendation: when mapping more policies, add explicit deny patterns for paths outside declared workspaces + audit any "delete" or "rmtree" like actions in custom tools.

**Architecture Confirmation (from skills/.../references/architecture.md)**:
- 3 pillars map cleanly:
  - Agent (Layer 1, high-level context manager, config, hooks, triggers) → our fused antigravity loop + top-level consult/plan/execute.
  - Conversation (Layer 2, stateful history, compaction, turns) → blackboard (plan + PROGRESS + GitHub) + todo_write + sub result accumulation. "Consult first" is the receive side.
  - Connection (Layer 3, transport to backend) → the "Grok Build executor" role + spawn_subagent worktrees + terminal execution + MCP tool dispatch.
- Official LocalConnectionStrategy + LocalAgentConfig + hooks policy runner is the concrete implementation we draw patterns from (e.g. how subagent results flow back without bloating main context).

These facts strengthen the "grounded in production official patterns" claim. Re-consult the cloned SDK (especially connections/local/, hooks/policy.py, examples/getting_started/subagents.py + triggers.py, and the skills/google-antigravity-sdk/ Markdowns) at the start of future autonomous cycles involving agentic or orchestration work.

Next alignment actions tracked in todo (via the Grok session that performed this consult).