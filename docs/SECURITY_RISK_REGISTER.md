# PachaNova V2.0 — Security Risk Register & RLS Policy Mapping

This document acts as the official registry for database security, row-level security (RLS) policies, and sensitive credentials exposure risks.

## 1. Executive Summary & Critical RLS Risk (P0)

> [!CAUTION]
> **CRITICAL SECURITY RISK (P0)**:
> An audit of the database initialization migration (`20260604000000_init.sql`) revealed that **none of the core tables** (including `investors`, `kyc_documents`, `balances`, `transactions`, `token_orders`) had Row-Level Security (RLS) enabled. 
> Only the newer Fase 1 tables (`trusts`, `assets`, `users_identity`) created in migration `20260608125000_fase1_rwa_trusts_assets_kyc.sql` have RLS explicitly enabled and defined.
>
> If these tables are deployed on a public Supabase instance without RLS, **any client can read, update, or delete all records** in these tables using the client-side `supabase-js` library.

---

## 2. Table Security Assessment

| Table Name | Sensitive PII | Current RLS Status | Risk Level | Action Required |
| --- | --- | --- | --- | --- |
| `investors` | **YES** (email, name, phone, DNI) | **DISABLED** | **CRITICAL** | Enable RLS. Policy: User reads own profile, admin/service_role writes. |
| `kyc_documents` | **YES** (file URLs for DNI/passport) | **DISABLED** | **CRITICAL** | Enable RLS. Policy: User reads/writes own docs, admin reviews. |
| `balances` | **YES** (investment balances) | **DISABLED** | **HIGH** | Enable RLS. Policy: User reads own balance. |
| `transactions` | **YES** (financial amounts) | **DISABLED** | **HIGH** | Enable RLS. Policy: User reads own transactions. |
| `token_orders` | **YES** (MercadoPago info) | **DISABLED** | **MEDIUM** | Enable RLS. Policy: User reads own orders. |
| `fideicomiso_operations`| NO | **DISABLED** | **MEDIUM** | Enable RLS. Policy: Public read, fiduciary/admin execution. |
| `fideicomiso_signatures`| NO | **DISABLED** | **MEDIUM** | Enable RLS. Policy: Public read, fiduciary write. |
| `audit_logs` | **YES** (actions and IP addresses) | **DISABLED** | **MEDIUM** | Enable RLS. Policy: Server-side (service_role) write only, Admin read. |
| `users_identity` | **YES** (wallet address, status) | **ENABLED** | **LOW** | Valid. Policy: User reads own, service_role writes. |
| `trusts` | NO (public documents metadata) | **ENABLED** | **LOW** | Valid. Public select allowed. |
| `assets` | NO (public property status) | **ENABLED** | **LOW** | Valid. Public select allowed. |

---

## 3. Storage Security (KYC Documents bucket)
- **Bucket**: `kyc_documents`
- **Visibility**: Must be set to **Private** (authenticated-only access via temporary signed URLs generated server-side).
- **Access Control**: Users must only be allowed to upload documents to their own folder (`/kyc_documents/uid/*`) in Supabase Storage.

---

## 4. API & Secret Keys Safety Rules
1. **Service Role Key**: The `SUPABASE_SERVICE_ROLE_KEY` must **NEVER** be exposed to the client-side browser bundle (Next.js environment variables must NOT be prefixed with `NEXT_PUBLIC_` unless they are explicitly meant to be public, like `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
2. **Server-Side Access**: All database manipulations (write/update) for roles and KYC states must pass through backend Next.js API endpoints or Supabase Edge Functions with proper JWT verification.
