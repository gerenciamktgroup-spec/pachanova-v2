# PachaNova v2.0 Demo Mirror RC-Local

- **Version:** PachaNova v2.0 Demo Mirror RC-Local
- **Fecha/hora local:** 2026-05-11 09:10:00-05:00
- **Commit/hash:** [pachanova-v2-demo-rc-local-20260511]
- **Node version:** >=18
- **pnpm version:** 9.0.0
- **Docker version:** [Docker Engine Local]
- **Postgres demo port:** 5433

## Estados Oficiales
- **Internal UAT:** ✅ PASS
- **Demo Local Acceptance:** ✅ GO
- **Internal Integration:** ✅ GO
- **External Integrations:** 🟡 READY-BUT-DISABLED
- **MercadoPago:** 🟡 READY-BUT-PENDING-CREDENTIALS
- **Contracts:** 🟡 READY-BUT-PENDING-FOUNDRY
- **Production/Staging:** ❌ NO-GO

## Últimos resultados
- `pnpm lint`: ✅ Passed
- `pnpm typecheck`: ✅ Passed
- `pnpm build`: ✅ Passed
- `pnpm demo:health`: ✅ Passed
- `pnpm test:demo`: ✅ Passed
- `pnpm test:e2e:demo`: ✅ Passed
- `security scan`: ✅ Passed (0 leaks)

## Limitaciones explícitas
1. No existe conexión con blockchain (Smart Contracts simulados).
2. MercadoPago no procesará transacciones financieras (API Key requerida y simulada).
3. Entorno validado estrictamente en Local. No exponer este entorno a IPs públicas sin antes rotar credenciales `.env.demo.local`.
