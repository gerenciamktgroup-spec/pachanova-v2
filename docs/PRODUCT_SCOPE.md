# PachaNova V2.0 — Product Scope & Router Mapping

This document maps all routes within the Next.js `apps/dashboard` application, classifying them as part of the MVP Scope or Out of Scope (Quarantined).

## 1. Routing Matrix

| Path | Type | Role | Status | Action Required |
| --- | --- | --- | --- | --- |
| `/` | Public | Visitor landing page | **ACTIVE** | Keep & Polish Copy |
| `/login` | Public | Authentication gate | **ACTIVE** | Keep & Verify |
| `/auth/register` | Public | Authentication gate | **ACTIVE** | Keep & Verify |
| `/como-funciona` | Public | Educational content | **ACTIVE** | Keep & Polish |
| `/preguntas-frecuentes`| Public | Help/FAQ | **ACTIVE** | Keep & Polish |
| `/unauthorized` | Public | Error page | **ACTIVE** | Keep |
| `/dashboard/investor` | Protected | Investor home | **ACTIVE** | Keep & Verify DB queries |
| `/dashboard/investor/kyc` | Protected | KYC Onboarding | **ACTIVE** | Keep & Verify |
| `/dashboard/investor/learn` | Protected | Educational / Trust details | **ACTIVE** | Keep |
| `/dashboard/investor/settings`| Protected | Profile & Settings | **ACTIVE** | Keep |
| `/dashboard/investor/wallet` | Protected | Investor Wallet view | **ACTIVE** | Keep |
| `/dashboard/investor/borrow` | Protected | Credits/Borrowing | **QUARANTINED** | Redirect to "Coming Soon" |
| `/dashboard/investor/governance`| Protected| DAO Governance / Voting | **QUARANTINED** | Redirect to "Coming Soon" |
| `/dashboard/investor/marketplace`| Protected| P2P Marketplace | **QUARANTINED** | Redirect to "Coming Soon" |
| `/dashboard/investor/staking` | Protected | Staking / Yield | **QUARANTINED** | Redirect to "Coming Soon" |
| `/dashboard/admin` | Protected | Admin home | **ACTIVE** | Keep |
| `/dashboard/admin/kyc` | Protected | KYC Approval Panel | **ACTIVE** | Keep |
| `/dashboard/admin/landbank` | Protected | Asset & Trust Management | **ACTIVE** | Keep |
| `/dashboard/admin/approvals` | Protected | Fideicomiso / Audit validations | **ACTIVE** | Keep |
| `/dashboard/admin/audit` | Protected | Audit log viewer | **ACTIVE** | Keep |
| `/dashboard/admin/governance` | Protected | Admin governance manager | **QUARANTINED** | Redirect to "Coming Soon" |
| `/dashboard/admin/treasury` | Protected | Admin treasury management | **QUARANTINED** | Redirect to "Coming Soon" |
| `/dashboard/fideicomiso` | Protected | Fiduciary signoff & audit | **ACTIVE** | Keep |

---

## 2. API Routes Mapping

The following API routes in `apps/dashboard/src/app/api` are mapped below:

### Active MVP APIs:
- `/api/admin/kyc`: Onboarding approvals.
- `/api/admin/users`: Manage user profiles.
- `/api/landbank`: Manage assets & trust assets.
- `/api/fideicomiso/status` & `/api/fideicomiso/audit`: Fiduciary document validation.
- `/api/auth`: Next-auth or Supabase session bridge.

### Quarantined APIs (Legacy/Web3):
- `/api/admin/compliance`: Web3 mock check.
- `/api/admin/distribute/batch`: Legacy smart contract distribution execution.
- `/api/admin/fleet-status`: Legacy system parameters.
- `/api/admin/treasury/liquidate`: Web3 swap mock.
- `/api/borrow`: Loan simulation/storage.
- `/api/governance/*`: Votes and proposals.
- `/api/p2p/*`: Order matching.
- `/api/treasury/*`: Custom liquidity.
- `/api/yield/*`: Yield injections and claims.
