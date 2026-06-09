# PachaNova V2.0 — Demo vs. Production Matrix

Following the master directive **"todo en versión real nada simulación" (everything in real version, no simulation)**, this matrix classifies all modules and scripts to ensure no mock/simulation code is represented as production-ready.

## 1. Classification Definitions
- **PROD**: Real production logic, connected to Supabase/PostgreSQL with proper authentication, RLS, and data integrity.
- **DEMO**: Local development helper tools or seed scripts. **Must never run in production or staging.**
- **EXPERIMENTAL**: Partially implemented features or Web3 smart contracts that require further audit and security validation.
- **REMOVE**: Obsolete scripts or code leftovers from older prototype phases.

---

## 2. Core Modules Classification

| Module | Classification | Current State | Action |
| --- | --- | --- | --- |
| **Landing Page** | PROD | Active with visual assets | Clean copy to reflect documentary trust backing. |
| **Authentication** | PROD | Next-Auth / Supabase integration | Verify session enforcement on protected API routes. |
| **KYC Verification** | PROD | Manual approval flow for admins | Keep. Ensure document storage in Supabase bucket is secure. |
| **Fideicomiso Dashboard** | PROD | Validation of documentary trust | Keep. Ensure all documents mapped are real and stored securely. |
| **Investor Dashboard** | PROD | Shows investment summaries | Ensure it only queries real database tables (no mocks). |
| **Asset & Trust Manager** | PROD | CRUD actions for admins | Keep. Connected to `assets` and `trusts` tables. |
| **Secondary Marketplace** | EXPERIMENTAL | Client-side routing to mock UI | Quarantine. Hide from user navigation. |
| **DAO Governance** | EXPERIMENTAL | Web3 / Drizzle-query based UI | Quarantine. Hide from user navigation. |
| **Staking / Yield** | EXPERIMENTAL | Staking simulation | Quarantine. Hide from user navigation. |
| **Borrow / Credits** | EXPERIMENTAL | Simulation of collateralized loans | Quarantine. Hide from user navigation. |

---

## 3. Scripts Classification

| Script | Path | Classification | Purpose |
| --- | --- | --- | --- |
| `demo:db:up` / `down` | Root package.json | **DEMO** | Launches local Docker Postgres container. |
| `demo:reset` | Root package.json | **DEMO** | Resets and seeds local developer database. |
| `demo:doctor` | `scripts/demo/doctor.ts` | **DEMO** | Runs checks on local docker/postgres dev setups. |
| `set-admin.ts` | `scripts/set-admin.ts` | **PROD/ADMIN** | Sets a user's role to 'admin' in the database. |
| `mp:sandbox:smoke` | `scripts/...` | **DEMO** | Tests MercadoPago sandbox webhook integrations. |
| `test-p2p.js` | `scripts/test-p2p.js` | **REMOVE** | Obsolete test file for legacy P2P order matching. |
| `verify-fase16-yield.js`| `scripts/...` | **REMOVE** | Obsolete verify script. |

---

## 4. Real vs. Simulation Invariants
1. **No Mock Data in Dashboards**: When the user logs in, the dashboard must fetch real data from the database. If there are no investments, show an empty state instead of simulated stats.
2. **Environment Isolation**: The environment variable `IS_DEMO` must be set to `false` in production. Any client-side routing must inspect `process.env.NEXT_PUBLIC_IS_DEMO` or API states to disable mock actions.
3. **Database Constraints**: Tables used in production (e.g., `users`, `trusts`, `assets`) must enforce real relational integrity (foreign keys) instead of assuming clean state.
