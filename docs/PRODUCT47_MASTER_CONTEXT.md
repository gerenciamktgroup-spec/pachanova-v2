# ANTIGRAVITY PRODUCT47 / PACHANOVA — MASTER CONTEXT, RULES & EXECUTION PLAN

## 0. Purpose
This document defines the operating context, autonomous-agent rules, technical diagnosis, product direction, intervention plan, and safety boundaries for **Product47 / PachaNova**.
The goal is to convert the current PachaNova codebase from an advanced prompt-generated prototype into a clean, secure, deployable, institutionally credible RWA real-estate product.

---

# 1. Project Identity
## 1.1 Product Name
**PachaNova / Product47**

## 1.2 Current Repository
`gerenciamktgroup-spec/pachanova-v2`

## 1.3 Current Known Architecture
```txt
pachanova-v2
├─ apps/
│  └─ dashboard
├─ packages/
│  ├─ database
│  ├─ integrations
│  ├─ contracts
│  └─ demo-environment
├─ package.json
├─ pnpm-workspace.yaml
├─ turbo.json
└─ .env.example
```

## 1.4 Product Direction
**Canon vigente:** `docs/PRODUCT_CANON.md` (2026-08-22). Si este archivo contradice el canon, gana el canon.

PachaNova should become:
```txt
A real-estate co-financing platform (landbanking, buildings for sale,
buildings for rent) with documentary backing, admin / investor / client
roles, traceability, and optional future tokenization.
```
The platform must not depend on on-chain tokenization to be useful.

Recommended staged positioning:
- **Now**: Co-financing + operations + traceability. Token/RWA/chain quarantined.
- **Later**: Tokenization layer after legal, compliance, technical, and product validation.

---

# 2. Core Strategic Principle
Do not continue expanding the prototype until the foundation is clean.
The first mission is:
`Freeze → Audit → Classify → Clean → Secure → Stabilize → Polish → Deploy → Then expand.`

---

# 3. Product47 Final Product Definition
The MVP should include only these core modules:
1. Institutional landing page
2. Authentication
3. Investor onboarding
4. KYC/profile status
5. Project catalog
6. Project detail page
7. Investor dashboard
8. Investment/participation summary
9. Rent/distribution reporting
10. Admin dashboard
11. Fideicomiso/trust dashboard
12. Documentary audit trail
13. Supabase/Postgres backend
14. Secure server-side access
15. Environment separation: demo/staging/production

---

# 4. Autonomous Agent Operating Rules
## 4.1 Prime Directive
Agents must optimize for: Safety, Reversibility, Truthfulness, Security, Build stability, Product clarity, Legal prudence, Small commits, and No destructive operations without explicit approval.

## 4.2 Forbidden Autonomous Actions
Agents must not perform these actions without explicit human confirmation:
- Delete production data
- Drop database tables
- Alter production user records
- Expose secrets
- Commit service role keys
- Disable authentication
- Disable security policies
- Deploy to mainnet
- Deploy to production without review
- Remove large code sections without backup
- Pause or restore Supabase projects
- Modify billing, domain, or organization settings
- Promise legal/regulatory compliance without legal review

## 4.3 Allowed Autonomous Actions
Agents may perform these safely:
- Create documentation
- Create audit files
- Create backlog files
- Add comments explaining risks
- Create branches
- Create non-destructive code cleanup PRs
- Refactor local code with small commits
- Improve copy for legal prudence
- Add tests
- Add type definitions
- Add missing documentation
- Identify dead code
- Propose migrations
- Create migrations only when non-destructive and reviewed
- Improve build configuration cautiously

## 4.4 Commit Rules
Every commit must be small, descriptive, reversible, scoped, and auditable.
Format: `product47(scope): concise description`

## 4.5 Branching Strategy
Use this branch naming pattern: `product47-*`. Never push risky changes directly to `main`.

---

# 5. Agent Roles
- **5.1 Chief Architect Agent**: Responsible for system architecture, module boundaries, product scope, and drift detection.
- **5.2 Security Agent**: Responsible for Supabase RLS, auth boundaries, service role usage, and data leak prevention.
- **5.3 Database Agent**: Responsible for Supabase schema, Drizzle schema, migrations, seeds, and demo/prod separation.
- **5.4 Product Agent**: Responsible for product flow, dashboard interfaces, copywriting, and feature pruning.
- **5.5 Compliance Copy Agent**: Responsible for removing exaggerated claims and ensuring wording is review-ready for lawyers.
- **5.6 Smart Contract Agent**: Responsible for Solidity review, Foundry tests, and deployment verification.
- **5.7 QA Agent**: Responsible for build validation, typechecking, linting, and manual/automated flow testing.

---

# 6. Current Technical Observations
- Next.js config ignores eslint and typescript errors during builds (Major risk).
- Schema drift between Supabase (more tables like votes, stakes, loans) and Drizzle (only users, trusts, assets).
- Several Supabase tables have RLS disabled.
- Smart contracts must be quarantined and marked as experimental.

---

# 7. UX / Product Copy Rules
Avoid high-risk claims like: "garantizado", "sin riesgo", "liquidez asegurada", "renta fija", "ganancia garantizada", "propiedad directa del inmueble", "100% seguro".
Use preferred copy: "respaldo documental", "estructura fiduciaria", "derechos económicos sujetos a contrato", "distribuciones sujetas al desempeño del activo", "trazabilidad", "auditoría".
