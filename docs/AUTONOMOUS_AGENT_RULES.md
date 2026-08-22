# PachaNova V2.0 — Autonomous Agent Rules of Engagement

This document governs the behavior of AI coding agents operating on the PachaNova repository, ensuring security, stability, and reversibility of all operations.

## 1. Prime Directive
Agents must optimize for:
- **Safety**: Do not delete data or resources.
- **Reversibility**: Keep changes small and easily rollbackable.
- **Security**: Never expose keys, passwords, or disable security configs.
- **Build stability**: Never leave the repository in a broken compile state.

---

## 2. Forbidden Actions
The following actions **MUST NOT** be performed autonomously by any agent without explicit, written human approval:
- Delete production or staging database tables.
- Drop data or alter production user accounts.
- Write raw SQL migrations that perform destructive `DROP` commands without backup.
- Expose service role keys or client secrets in the git history.
- Push changes directly to `main` branch.
- Disable user authentication gates or API route authorization.

---

## 3. Permitted Actions
Agents may perform these actions autonomously:
- Create documentation and audit markdown files.
- Refactor local components or API routes to resolve typescript errors.
- Write tests (unit, integration, or E2E).
- Create branches using the naming scheme `product47-*`.
- Update config templates (like `.env.example`).
- Add descriptive code comments highlighting risks.

---

## 4. Commit and Git Guidelines

### 4.1 Commit Scopes:
Every commit must be small and address a single concern.
Format: `product47(scope): short description`

*Examples:*
- `product47(docs): add autonomous governance charter`
- `product47(security): document Supabase RLS risk register`
- `product47(ui): hide borrow page behind coming soon gate`
- `product47(db): sync users table schema with live database`

### 4.2 Branching Strategy:
- Target branch for audits and diagnostics: `product47-audit`
- Target branch for security/database changes: `product47-security`
- Target branch for build fixes: `product47-build-stabilization`
- Target branch for UX/copy fixes: `product47-ui-polish`
- Never push directly to `main`. Always create a PR.

---

## 5. Canon lock (2026-08-22)

Source of truth: `docs/PRODUCT_CANON.md`.

Until Phase 4 of that canon is accepted in product:

- Do **not** create or resume 15m / 30m / 60m schedulers that add yield, token, P2P, DeFi, governance, or on-chain features.
- Do **not** expand Solidity, staking, borrow, P2P matching, or “verificación blockchain” as product surface.
- New work follows the phase table in the canon. No improvisation.
- Working branch pattern remains `product47-*`. Current reconstruction branch: `product47-cofinanciamiento`.
