# PachaNova V2.0 — Build Stabilization Plan

This document outlines the TypeScript and build diagnostics of `apps/dashboard` and details the actions required to resolve them so we can safely disable the ESLint and TypeScript build bypasses in `next.config.ts`.

## 1. Build Diagnostics (Current State)
Running `npx tsc --noEmit` on the dashboard application yields compilation failures. All of them are related to schema drift where the application attempts to import deleted or missing database tables from `@pachanova/database`.

### Identified Compile Errors:

#### 1. Fideicomiso Dashboard (`fideicomiso/page.tsx`):
- `Property 'fideicomisoSignatures' does not exist on type 'typeof import("@pachanova/database")'`
- `Property 'fideicomisoAudits' does not exist on type 'typeof import("@pachanova/database")'`
- `Property 'auditLogs' does not exist on type 'typeof import("@pachanova/database")'`
- Implicit `any` parameters in array callbacks.

#### 2. Investor Borrow Page (`investor/borrow/page.tsx`):
- `Property 'loans' does not exist on type 'typeof import("@pachanova/database")'`
- `Property 'properties' does not exist on type 'typeof import("@pachanova/database")'`
- Implicit `any` parameters.

#### 3. Investor Governance Page (`investor/governance/page.tsx`):
- `Property 'balances' does not exist on type 'typeof import("@pachanova/database")'`
- `Property 'stakes' does not exist on type 'typeof import("@pachanova/database")'`
- `Property 'proposals' does not exist on type 'typeof import("@pachanova/database")'`
- `Property 'votes' does not exist on type 'typeof import("@pachanova/database")'`

#### 4. Investor Marketplace Page (`investor/marketplace/page.tsx`):
- `Property 'p2pOrders' does not exist on type 'typeof import("@pachanova/database")'`
- `Property 'properties' does not exist on type 'typeof import("@pachanova/database")'`

---

## 2. Action Items
To achieve build stability (`pnpm run build` passing with typecheck and lint checks enabled):

### Step 1: Re-incorporate Essential Schema Tables
We will restore the required schema fields in `@pachanova/database` to represent the **real** tables (such as `balances`, `distributions`, `kyc_documents`, `transactions`, `fideicomiso_signatures`) rather than leaving them orphaned. This will resolve most import errors.

### Step 2: Quarantine Non-MVP Pages
For features that are **Out of MVP Scope** (like `borrow`, `governance`, `marketplace`, `staking`):
1. We will place a clean, premium "Coming Soon" or "Modo Consulta / Próximamente" interface on those routes.
2. We will remove or comment out the broken queries inside them, eliminating the typescript errors while maintaining the UI page structure for future expansion.

### Step 3: Remove Build Bypasses
Once the type errors are fixed, we will update `apps/dashboard/next.config.ts`:
```ts
// next.config.ts
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false, // Enable linting
  },
  typescript: {
    ignoreBuildErrors: false, // Enable typechecking
  },
};
```
And verify that a full production build succeeds.
