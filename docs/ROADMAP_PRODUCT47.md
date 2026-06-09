# PachaNova V2.0 — Product47 Stabilization Roadmap

This document outlines the phased plan to move PachaNova from a prototype to a secure, stable, and production-ready real estate RWA technology platform.

## Phase 0 — Governance and Audit (Current Phase)
**Goal**: Baseline the codebase, identify all drift and security risks, and freeze product scope.
- [x] Create the governance and audit branch (`product47-audit`).
- [x] Run typescript and build diagnostics to locate import errors.
- [x] Query live Supabase database to audit tables and RLS configurations.
- [x] Produce comprehensive documentation:
  - `PRODUCT47_MASTER_CONTEXT.md`
  - `PRODUCT_SCOPE.md`
  - `DEMO_VS_PROD_MATRIX.md`
  - `SECURITY_RISK_REGISTER.md`
  - `SUPABASE_SCHEMA_AUDIT.md`
  - `BUILD_STABILIZATION_PLAN.md`
  - `SMART_CONTRACT_QUARANTINE.md`
  - `ROADMAP_PRODUCT47.md`
  - `AUTONOMOUS_AGENT_RULES.md`

---

## Phase 1 — Cleanup & Isolation
**Goal**: Remove obsolete files, comment out or remove legacy scripts, and isolate demo/simulation paths.
- Remove old temporary debug files from the repository root.
- Clean up duplicate configuration variables in `.env` templates.
- Update root scripts in `package.json` to clearly separate `demo` scripts from `prod/staging` tasks.

---

## Phase 2 — Security & Database Sync
**Goal**: Enable RLS, write security policies, and synchronize the Drizzle schema with the active Supabase tables.
- Update `packages/database/src/schema/` to define the necessary tables (`balances`, `kyc_documents`, `distributions`, `transactions`, `fideicomiso_signatures`).
- Deploy a migration to enable RLS across all 28 Supabase tables.
- Write and deploy default `Deny All` policies, allowing authenticated users only to view their own PII/balances, and admins/fiduciary roles to manage operational tables.
- Push missing `trusts` and `assets` tables to Supabase.

---

## Phase 3 — Build Stabilization
**Goal**: Fix all typescript compile and lint errors, and disable build bypasses.
- Refactor dashboard pages (like `fideicomiso/page.tsx` and `investor` pages) to match the new Drizzle schema and hide/quarantine un-implemented features (governance, borrow, staking, marketplace).
- Remove `ignoreDuringBuilds` and `ignoreBuildErrors` from `next.config.ts`.
- Run workspace validation (`pnpm build`) to verify that the build succeeds without error.
- Deploy to Vercel staging for verification.

---

## Phase 4 — Product Finalization (MVP Go-Live)
**Goal**: Deliver the commercial MVP.
- Polish copy on the landing page (incorporating legal disclosures, explaining trust structures, and removing any "guaranteed returns" claims).
- Polish UX/UI states (empty states, loader states, transaction confirmation dialogs) for real investor usage.
- Perform a manual QA pass across authentication, KYC uploading, and the admin approval panels.
