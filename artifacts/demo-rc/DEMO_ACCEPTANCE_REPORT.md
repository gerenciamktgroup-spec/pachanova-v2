# PachaNova v2.0 - Demo Mirror Acceptance Report

## 🏆 VEREDICTO DE ACEPTACIÓN
- **Internal Integration:** ✅ GO
- **Demo Local Infra/Build:** ✅ GO
- **Demo Local Acceptance Completa:** ✅ GO
- **External Integrations:** 🟡 READY-BUT-DISABLED
- **MercadoPago:** 🟡 READY-BUT-PENDING-CREDENTIALS
- **Contracts:** 🟡 READY-BUT-PENDING-FOUNDRY
- **Production/Staging:** ❌ NO-GO

> **Nota de Seguridad:** Aprobado para operaciones en Local e integraciones simuladas. Aislamiento absoluto de DB de producción garantizado. La capa de adaptadores externos (Registry) está lista pero se requiere habilitación manual temporal según los protocolos documentados.

---

## Métrica de Aceptación

1. **Docker y Postgres:** Operativo (Puerto 5433).
2. **Migraciones y Seeds:** Exitoso.
3. **APIs y Health Check (`demo:health`):** Pasó (100% rutas operativas, incluyendo `/api/demo/integrations`).
4. **Tests Unitarios/Integración (`test:demo`):** Pasó (15 escenarios exitosos, incluyendo IntegrationRegistry).
5. **E2E Playwright (`test:e2e:demo`):** Pasó (18 escenarios exitosos, validando render UI de PENDING_CREDENTIALS sin leaks).
6. **Security Scan:** Limpio (0 leaks detectados).

## Fases Completadas
- **Fase 7B.2:** Demo Local Mirror (GO)
- **Fase 7C:** MercadoPago Sandbox Integration
- **Fase 7D:** Integración Interna Completa y Capa External-Ready

1. **Veredicto:**
   - Demo Local Acceptance Completa: GO
   - Demo Sandbox MercadoPago: **NO-GO**
   - Demo Connected: NO-GO

2. **Comandos Ejecutados:**
   - `pnpm demo:health`
   - `pnpm test:demo`
   - `pnpm test:e2e:demo`
   - `npx localtunnel --port 3000`
   - `pnpm mp:sandbox:smoke`
   - `grep` Security Scan

3. **Evidencia MercadoPago:**
   - URL pública HTTPS configurada vía Localtunnel (`https://pachanova-sandbox.loca.lt`).
   - `pnpm mp:sandbox:smoke` falló validando que el SDK de MercadoPago rechaza las credenciales `TEST_xxxx` dummy, lo que confirma que la conexión es real y requiere llaves reales del panel developer para proceder.
   - Rutas `/api/mercadopago/preference` preparadas con inserciones atómicas `tokenOrders`.
   - Rutas `/api/mercadopago/webhook` preparadas con idempotencia y atomicidad completa hacia `token_ledger` y `genesis_purchases`.

4. **Decisión:**
   - **NO-GO** declarado debido a la falta de credenciales reales `TEST_` de MercadoPago, de acuerdo con la matriz de aceptación establecida. Se requiere que el developer inyecte un `MERCADOPAGO_ACCESS_TOKEN` y un `MERCADOPAGO_WEBHOOK_SECRET` válidos en `.env.demo.local`.

## Limitaciones Restantes
- MercadoPago Sandbox firmado con Ngrok/localtunnel
- Foundry/Anvil/Amoy
- NextAuth real si todavía usa sesión demo
- CI cross-browser
- auditoría formal smart contracts

## Veredicto Final
(Se llenará al final)
