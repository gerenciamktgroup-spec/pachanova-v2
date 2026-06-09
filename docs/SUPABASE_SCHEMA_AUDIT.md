# PachaNova V2.0 — Supabase Schema Audit & Drift Analysis

This document reports the exact schema state of the live Supabase instance (`zekclnqoqdqifpihyvzu`) compared to the Drizzle schema definitions in `@pachanova/database` as of June 9, 2026.

## 1. Live Tables Registry & RLS Status
We ran a live query against `information_schema` and `pg_tables` in public schema. 

- **Total Public Tables**: 28
- **Tables with RLS Enabled**: 0 (100% of tables have `rowsecurity = false`)
- **Active RLS Policies**: 0

### Live Table List (All RLS DISABLED):
1. `annual_valuations`
2. `audit_logs`
3. `balances`
4. `burn_vaults`
5. `demo_sessions`
6. `distributions`
7. `escrow_vaults`
8. `fideicomiso_audits`
9. `fideicomiso_operations`
10. `fideicomiso_signatures`
11. `gamification`
12. `genesis_purchases`
13. `integration_events`
14. `kyc_documents`
15. `loans`
16. `notifications`
17. `p2p_orders`
18. `p2p_trades`
19. `properties`
20. `proposals`
21. `stakes`
22. `system_parameters`
23. `token_ledger`
24. `token_orders`
25. `transactions`
26. `treasury_vaults`
27. `users` (Note: in migrations this was called `investors`, but in the live DB it is `users`)
28. `votes`

---

## 2. Schema Drift Analysis

There is a major discrepancy between the **Drizzle Schema Code** and the **Live Supabase Schema**.

### 2.1 Missing Tables in Supabase (Expected by Drizzle)
The following tables are defined in Drizzle schema files but **do not exist** on the live database:
- `trusts` (defined in `packages/database/src/schema/trusts.ts`)
- `assets` (defined in `packages/database/src/schema/assets.ts`)
- `users_identity` (defined in `packages/database/src/schema/users_identity.ts`)

### 2.2 Leftover/Legacy Tables in Supabase (Absent in Drizzle Code)
The following tables exist in the database but have been **completely deleted** from the Drizzle code models:
- `properties`, `balances`, `distributions`, `loans`, `votes`, `stakes`, `proposals`, `p2p_orders`, `p2p_trades`, `gamification`, etc.

This explains the TypeScript compilation errors:
1. `apps/dashboard` files (such as `investor/marketplace/page.tsx` and `fideicomiso/page.tsx`) still import and query things like `schema.properties`, `schema.balances`, etc.
2. But the local `@pachanova/database` package doesn't export them anymore because the Drizzle schema was trimmed to only contain users, trusts, and assets.

---

## 3. Resolution Plan
Following the directive **"todo en versión real nada simulación"**:
1. We must merge the necessary tables (like `balances`, `distributions`, `kyc_documents`, `transactions`, `fideicomiso_signatures`) back into the Drizzle code schema so they can be queried safely and with proper types.
2. We must create a migration to enable RLS across all tables and deploy the RLS policies to the database.
3. We must push the missing `trusts` and `assets` tables to Supabase.
