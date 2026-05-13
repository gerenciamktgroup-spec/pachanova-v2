# PachaNova v2.0 — Project Inventory & Gap Analysis

## 1. Executive Summary
El entorno **PachaNova v2.0 Demo Mirror** ha sido reestructurado hacia una arquitectura sólida, aislada e "Integration-Ready". Se ha limpiado exitosamente de todo "legacy code", implementando una base Next.js moderna con componentes de Dashboard inversor y administrador, interconectados a una base de datos Drizzle ORM mockeada, con servicios externos envueltos en un Registry robusto que previene llamadas reales accidentales. 

- **Qué existe:** Infraestructura Docker local, scripts de migración/seed, UI de Dashboards (Inversor, Fideicomiso, Control Room), pruebas unitarias/E2E, Registry de integraciones (Payments, Contracts, KYC, Oracle), y APIs mockeadas.
- **Qué está validado:** Las capas locales, cálculos proporcionales (token-balance), Health checks, y protección de base de datos contra producción.
- **Qué está pendiente:** Inserción de credenciales de prueba (`TEST_`), validación del SDK real de Foundry, pruebas UAT reales y despliegue a entorno en la nube.

**Decisión GO/NO-GO por entorno:**
- **Demo Local Acceptance:** ✅ GO
- **Internal Integration:** ✅ GO
- **External Integrations:** 🟡 READY-BUT-DISABLED
- **MercadoPago:** 🟡 READY-BUT-PENDING-CREDENTIALS
- **Contracts:** 🟡 READY-BUT-PENDING-FOUNDRY
- **Production/Staging:** ❌ NO-GO

---

## 2. Monorepo Structure

| Ruta | Propósito | Estado | Observaciones |
|------|-----------|--------|---------------|
| `apps/web/` | Aplicación Next.js 15 principal (UI, Dashboards, API). | Validado | Funcional, estilizado con Tailwind/Dark Mode. |
| `packages/database/` | Drizzle ORM schemas, migraciones, utils y seeding. | Validado | Protección `validateDemoDatabaseUrl` operativa. |
| `packages/integrations/`| Registry y Adapters de integraciones de 3ros (MP, Web3). | Validado | Nuevo `IntegrationRegistry` atómico funcional. |
| `packages/contracts/` | Scripts Foundry/Solidity. | Pending | Mockeado, requiere Anvil. |
| `tests/demo/` | Vitest Unit/Integration & Playwright E2E. | Validado | 100% Passing (15 unit, 18 e2e). |
| `scripts/` | Utils CLI (`demo-health-check.ts`, MP sandbox, etc). | Validado | Usados vía `package.json`. |

---

## 3. Apps

### `apps/web`
- **Framework:** Next.js 15 (App Router), React 19, TailwindCSS, TypeScript.
- **Rutas Principales:** `/demo/walkthrough`, `/demo/control-room`, `/demo/integrations`, `/dashboard/investor`, `/dashboard/admin`, `/dashboard/fideicomiso`.
- **APIs Incluidas:** `/api/token-balance`, `/api/treasury`, `/api/mercadopago/*`, `/api/fideicomiso/*`, `/api/demo/*`.
- **Estado:** ✅ VALIDATED (Local Demo).
- **Riesgos:** Mock NextAuth (`NEXTAUTH_URL`) puede causar flakiness en algunos E2E tests si las sesiones no se manejan de manera asíncrona correctamente.

---

## 4. Packages

### `packages/database`
- **Propósito:** Single Source of Truth para la base de datos (Postgres/Drizzle).
- **Archivos Principales:** `schema.ts`, `migrations/`, `seed.ts`, `demoValidation.ts`.
- **Estado:** ✅ VALIDATED. Funciona correctamente con Docker Local port 5433.
- **Pendientes:** Ninguno para Demo Local.

### `packages/integrations`
- **Propósito:** Aislamiento y orquestación de servicios de terceros (Payment, KYC, Smart Contracts).
- **Archivos Principales:** `registry/IntegrationRegistry.ts`, `env/integrationEnv.ts`, `payments/verifyMercadoPagoSignature.ts`.
- **Estado:** ✅ VALIDATED.
- **Pendientes:** Llenado de credenciales reales `TEST_` y direcciones en `.env.demo.local`.

### `packages/contracts`
- **Propósito:** Definición Web3 (Solidity), Foundry scripts para `DeployDemo.s.sol`.
- **Estado:** 🟡 PENDING_FOUNDRY.
- **Pendientes:** Despliegue en Anvil, actualización de ABI.

---

## 5. Database Layer
- **DB demo:** PostgreSQL dockerizado.
- **Puerto:** `5433` aislado de `5432` prod.
- **Schemas:** `users`, `properties`, `token_ledger`, `balances`, `genesis_purchases`, `audit_logs`, `integration_events`.
- **Migrations/Seed:** Funcionales (`pnpm demo:db:migrate && pnpm demo:db:seed`).
- **Protección anti-producción:** `validateDemoDatabaseUrl()` lanza Panic si detecta string `.neon.tech` o `cloudsql`.
- **SSOT Balances:** `api/token-balance` consulta tabla `balances` calculando m2 on-the-fly (`tokens * 0.1`).
- **Riesgos pendientes:** Sincronización entre `token_ledger` (RDBMS) y balance ERC-3643 (Web3) durante eventos asíncronos si se habilitan contratos reales.

---

## 6. API Routes Inventory

| Route | Method | Purpose | Provider/DB Used | Status | Tests | Risks |
|-------|--------|---------|------------------|--------|-------|-------|
| `/api/demo/health` | GET | Basic alive check | IntegrationRegistry | Validated | Yes | N/A |
| `/api/demo/integrations` | GET | Expose registry matrix | IntegrationRegistry | Validated | Yes | N/A |
| `/api/demo/reset` | POST | Truncate and re-seed | Database/Drizzle | Validated | Yes | Accidental prod reset (Prevented) |
| `/api/demo/scenario` | POST | Set custom E2E states | Database/Drizzle | Validated | Yes | N/A |
| `/api/token-balance` | GET | Get user tokens + m2 | `balances` table | Validated | Yes | Hardcoded math (0.1 ratio) |
| `/api/treasury` | GET | Platform global metrics | Database | Validated | Yes | Aggregations can be slow |
| `/api/admin/users` | GET | List KYC/Compliance | `users` table | Validated | Yes | N/A |
| `/api/admin/audit-logs` | GET | Show platform logs | `audit_logs` | Validated | Yes | N/A |
| `/api/fideicomiso/propose` | POST | Create multisig prop. | `audit_logs` | Simulated | Yes | Web3 signing missing |
| `/api/fideicomiso/sign` | POST | Sign proposal | `audit_logs` | Simulated | Yes | Web3 signing missing |
| `/api/oracle/valuation` | GET | Asset NAV | DemoValuationProvider | Simulated | Yes | N/A |
| `/api/mercadopago/preference`| POST | Create payment intent | MercadoPagoSandbox | Pending Creds | Yes | Webhook mismatch |
| `/api/mercadopago/webhook` | POST | Receive approval | MercadoPagoSandbox | Pending Creds | Yes | Duplicate processing |

---

## 7. UI Pages & Components Inventory

| Page/Component | Path | Purpose | Status | Tests | Notes |
|----------------|------|---------|--------|-------|-------|
| Control Room | `/demo/control-room` | Hub de scripts y status. | Validated | Yes | |
| Integrations UI| `/demo/integrations` | Matrix state. | Validated | Yes | Renderiza PENDING_CREDENTIALS. |
| Investor Dash  | `/dashboard/investor`| Balance & Land. | Validated | Yes | 3D Land Card interactiva. |
| Admin Dash     | `/dashboard/admin`   | Global Treasury. | Validated | Yes | |
| Fideicomiso    | `/dashboard/fideicomiso`| Multisig Panel. | Simulated | Yes | UI estática de momento. |
| ProRataLandCard| `components/` | Visualizar terreno. | Validated | Yes | Uses React Three Fiber. |
| Matrix Badge   | `components/demo/` | Colores de Status. | Validated | Yes | |

---

## 8. Integration Registry & Providers

El `IntegrationRegistry` opera interceptando el flujo de inicialización mediante `getIntegrationEnv`. Evita escapes de red usando el flag `_EXTERNAL_ENABLED`.

| Integration | Current Provider | Status | External Enabled | Required Env | Missing | Activation Doc |
|-------------|------------------|--------|------------------|--------------|---------|----------------|
| Payments | `mercadopago_sandbox`| `PENDING_CREDENTIALS` | True/False | `MP_ACCESS_TOKEN`, `PUBLIC_KEY`, `WEBHOOK` | Sí | `MERCADOPAGO_TEMPORARY_ACTIVATION.md` |
| Contracts | `demo` / `real` | `SIMULATED` / `PENDING_DEPLOY` | False | `RPC_URL`, `TOKEN_ADDRESS` | Sí | `CONTRACTS_TEMPORARY_ACTIVATION.md` |
| KYC | `demo` | `SIMULATED` | False | - | - | - |
| Oracle | `demo` | `SIMULATED` | False | - | - | - |
| AI | `demo` | `SIMULATED` | False | - | - | - |
| Email | `demo` | `SIMULATED` | False | - | - | - |

---

## 9. MercadoPago Readiness

### Implemented
- `/api/mercadopago/preference` con inserción atómica `token_orders`.
- `/api/mercadopago/webhook` con transaccionalidad total (Drizzle db.transaction).
- Verificación de Firma estricta HMAC-SHA256 (`verifyMercadoPagoSignature`).
- Doc: `MERCADOPAGO_TEMPORARY_ACTIVATION.md`.
- Scripts de habilitación rápida.

### Not Yet Done
- Llenado del `.env.demo.local` con claves `TEST_` genuinas.
- Generación y recepción de Webhook real (exposición en Localtunnel).
- Verificación de GO manual en Sandbox UI.

### Risks
- Credentials leakage si un developer hace commit a `.env.demo.local`.
- Amount mismatch (precio hardcodeado localmente vs precio configurado en MP).

### Next Step
Proceder con la inyección de token de prueba y realizar prueba E2E humana interactiva usando checkout.

---

## 10. Smart Contracts Readiness

### Implemented
- Packages: `contracts`.
- DTO/Provider abstractions: `DemoContractProvider`.
- Doc: `CONTRACTS_TEMPORARY_ACTIVATION.md`.

### Not Yet Done
- Despliegue en Foundry (Anvil).
- Extracción de ADDR hacia variables de entorno.
- Enlace entre UI Fideicomiso (`ethers.js` o `viem`) hacia Anvil.

### Risks
- Cumplimiento de estándar oficial ERC-3643 vs versión "inspirada".
- Diferencia del estado Ledger SQL vs estado Blockchain.

### Next Step
Fase 8A - Levantar Anvil y ejecutar script de Forge.

---

## 11. Testing Inventory

| Test Suite | Command | Coverage Intent | Last Known Result | Missing |
|------------|---------|-----------------|-------------------|---------|
| Linter | `pnpm lint` | Next.js/TS best practices | ✅ Passed | - |
| Types | `pnpm typecheck` | Type safety | ✅ Passed | - |
| Build | `pnpm build` | Production artifacts | ✅ Passed | - |
| Health | `pnpm demo:health` | Alive APIs | ✅ Passed | - |
| Unit | `pnpm test:demo` | Logic / Integrations | ✅ Passed (15/15) | - |
| E2E | `pnpm test:e2e:demo`| User Flows Playwright | ✅ Passed (18/18) | - |
| Doctor | `pnpm demo:doctor` | Env validation | ❌ NO EJECUTADO (Script no existe) | Script no implementado |
| Acceptance | `pnpm demo:acceptance`| Full CI flow | ❌ NO EJECUTADO (Script desfasado) | Falta actualización de script |
| Security | `grep` scan | Hardcoded secrets | ✅ Passed (0 matches)| - |

---

## 12. Security & Isolation
- **Production Isolation:** Impecable (`validateDemoDatabaseUrl`).
- **Variables Seguras:** Uso intensivo de `.env.demo` y exclusión total de `.env.demo.local` en `.gitignore`.
- **Fail-Fast:** El Registry lanza error 500 y bloquea Next.js si se detectan tokens productivos (`APP_USR`) en entorno local o si `NODE_ENV=production` tiene `DEMO_MODE=true` sin `DEMO_PUBLIC_ALLOWED`.

---

## 13. Documentation Inventory

| Document | Purpose | Status | Needs Update? |
|----------|---------|--------|---------------|
| `DEMO_ACCEPTANCE_REPORT.md` | Matriz de GO/NO-GO local | ✅ Updated | No |
| `INTEGRATION_READINESS_REPORT.md` | Estado de Registry y Webhooks | ✅ Updated | No |
| `MERCADOPAGO_TEMPORARY_ACTIVATION.md` | Runbook habilitación MP | ✅ Created | No |
| `CONTRACTS_TEMPORARY_ACTIVATION.md` | Runbook habilitación Anvil | ✅ Created | No |
| `BUSINESS_MODEL_DEMO_FLOW_REPORT.md` | Reporte final del flujo operativo | ✅ Created | No |
| `BUSINESS_DEMO_RELEASE_CANDIDATE.md` | Estado de congelamiento RC | ✅ Created | No |
| `BUSINESS_DEMO_MANUAL_UAT_CHECKLIST.md` | Guion de validación manual | ✅ Created | No |
| `docs/BUSINESS_DEMO_PRESENTATION_SCRIPT.md` | Guion narrativo para presentaciones | ✅ Created | No |

*(Faltan los archivos del Runbook Operativo de la Fase 7E cancelada: `RELEASE_CANDIDATE_STATUS`, `DEMO_OPERATOR_RUNBOOK`, `TROUBLESHOOTING`).*

---

## 14. Scripts Inventory

| Script | Command | Purpose | Status | Risks |
|--------|---------|---------|--------|-------|
| `demo:db:up` / `down` | `docker compose ...` | DB Container | ✅ Functional | N/A |
| `demo:db:migrate` / `seed`| `pnpm --filter ...` | DB prep | ✅ Functional | N/A |
| `demo:health` | `tsx scripts/demo-health-check.ts` | Endpoint validation | ✅ Functional | N/A |
| `mp:sandbox:smoke` | `tsx scripts/mercadopago-...` | Ping MP SDK | ✅ Functional | Returns 401 on Dummy |
| `enable-mp-sandbox` | `tsx scripts/enable-mp...` | Update .env | ✅ Functional | N/A |
| `demo:doctor` | - | Validar dependencias | ❌ Pending | - |

---

## 15. What Is Fully Done
- **Demo Local:** Next.js + Tailwind UI.
- **DB Isolation:** Drizzle + Postgres 5433 aislado.
- **Veredicto UAT:** 🟢 **PASS**
- **Internal Integration:** Integration Registry atómico.
- **Tests:** Suites de Playwright y Vitest operativas. Flakiness de TS resuelto.
- **Docs:** Reportes de Acceptance e Integración generados y limpios de claims.
- **Security:** Bloqueo anti-production y limpieza de logs de commit de todo secreto.
- **Business Model Demo Flow:** Ciclo completo funcional con KYC, depósitos, Genesis, y P2P simulados sin necesidad de integración.

## 16. What Is Partially Done
- **MercadoPago:** Listo en código, faltan credenciales manuales.
- **Contracts:** Listo Provider offline, falta Anvil.

## 17. What Is Not Done
- Producción y Cloud Deploy (Staging).
- Validación de Foundry / Forge tests.
- KYC Real (Suma/SumSub).
- Auditoría externa de Smart Contracts.
- Email Provider (Resend/Sendgrid).
- AI Provider (OpenAI/Gemini).

---

## 18. Risk Register

| Risk | Severity | Area | Current Mitigation | Required Action |
|------|----------|------|--------------------|-----------------|
| Credentials leakage | Alto | Git | `.gitignore` en `.env.local` | Mantener higiene estricta. |
| False production claim| Alto | PR/Legal | Reportes de status transparentes. | Auditar `STAGING_ENTRY_CRITERIA` |
| Webhook idempotency | Medio| MP | Drizzle transaction check | Probar exhaustivamente E2E real. |
| Contract Compliance | Alto | Web3 | Mock local | Validar T-Rex protocol ERC-3643. |

---

## 19. Recommended Next Phases

1. **Manual UAT-1 — Business Demo**
   - Objetivo: Ejecutar el checklist manual con inversionistas o el equipo comercial para validar la narrativa.
2. **Fase 8A — MercadoPago Sandbox / Foundry Anvil local**
   - Objetivo: Sincronización Web3 local y transacciones Sandbox reales temporales.
3. **Fase 8B/C — Cloud Deploy (Staging Demo Privado)**
   - Objetivo: Migración de infraestructura hacia NEXUS AWS/GCP o Vercel con protección de contraseña.

---

## 20. Deep-Dive Candidates

- **MercadoPago Idempotency:** Validar qué ocurre si MP dispara 3 webhooks idénticos simultáneos por retrasos de red. (Prevenir race conditions).
- **Contracts ERC-3643 Real:** Revisión arquitectónica de los modulos de compliance e Identity Registry.
- **Release Packaging:** Definición de una imagen Docker o pipeline CI/CD unificado para facilitar el empaquetado del Demo hacia AWS.
- **Observability:** Centralizar el `audit_logs` en un Datadog o Grafana.

---

## 21. Final Decision

- **¿Podemos presentar demo local?** ✅ **SÍ.**
- **¿Podemos usar demo para inversionistas internos?** 🟡 **Con Condiciones** (Para uso presencial/guiado sin transacciones reales o usando sandbox test mode).
- **¿Podemos hacer staging público?** ❌ **NO.** Faltan deploy en nube, tokens reales y auditorías de base.
- **¿Podemos aceptar capital inversor?** ❌ **NO.** Bloqueo activo y estricto.
- **¿Qué debe hacerse inmediatamente?** Decidir entre completar la **Fase 7E (Paquete de Runbooks)** o avanzar directamente al Test interactivo de MercadoPago o Foundry (UAT).
