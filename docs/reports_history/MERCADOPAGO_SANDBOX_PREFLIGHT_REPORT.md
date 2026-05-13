# MercadoPago Sandbox Preflight Report

**Fase:** 8A
**Fecha:** 12 de Mayo de 2026
**Entorno:** Local Sandbox Demo

Este reporte documenta los resultados del preflight de seguridad y readiness de MercadoPago Sandbox para PachaNova v2.0.

## 1. Estado del Entorno (Env Hygiene)
Se han implementado controles de seguridad estrictos para garantizar que ninguna credencial productiva (`APP_USR`) pueda ser inyectada y que ningún secreto local llegue al control de versiones.

- **Variables Requeridas:** `DEMO_MODE`, `DEMO_PROFILE`, `PAYMENTS_PROVIDER`, `PAYMENTS_EXTERNAL_ENABLED`, `MERCADOPAGO_PUBLIC_KEY`, `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET`, `MERCADOPAGO_WEBHOOK_URL`, `MERCADOPAGO_CURRENCY`.
- **Variables Faltantes:** 0 (Todas están debidamente configuradas como placeholders seguros o extraídas localmente).
- **Gitignore Validado:** `.env.demo.local` y `.env.mercadopago.sandbox.local` están ignorados.
- **Plantillas Creadas:** `.env.demo.local.example` y `.env.mercadopago.sandbox.example`.

## 2. Validadores Implementados
- `validateMercadoPagoSandboxEnv.ts`:
  - `APP_USR` explícitamente bloqueado.
  - Public Keys deben ser `TEST_`.
  - Configurado `MERCADOPAGO_CURRENCY=USD` dinámico.
  - Emite un resumen redactado al inicio.

## 3. Webhook Signature Readiness
- **Validator Base:** `verifyMercadoPagoSignature.ts` comprueba `ts`, `v1`, normaliza `data.id` en minúsculas para evadir un fallo común del SDK, y utiliza `crypto.timingSafeEqual`.
- **Bypass Rechazado:** `MP_WEBHOOK_ALLOW_UNSIGNED` solo funciona si `DEMO_PROFILE` no es sandbox. En el perfil de pruebas formales, fallará con `401 Unauthorized` ante intentos de falsificación.

## 4. Preference & Webhook Processing Readiness
- **Preference (`/api/mercadopago/preference`):** Rechaza compras de usuarios con KYC pendiente. Usa el precio dictado por backend (US$8.40) y crea pre-órdenes `pending`.
- **Webhook (`/api/mercadopago/webhook`):** Extracción de objeto Payment real de MercadoPago. Valida idempotencia evitando duplicar acreditaciones. Efectúa transacciones atómicas de Drizzle para asentar compras en `genesis_purchases` y en el `token_ledger`.

## 5. Scripts y Documentos Creados
- `pnpm mp:sandbox:preflight`: Para auditar env, gitignore y bloqueos de producción.
- `pnpm mp:sandbox:smoke`: Validará las keys reales cuando se obtengan, ignorando llamadas en caso de placeholders.
- **Documentación:**
  - `docs/MERCADOPAGO_SANDBOX_PREFLIGHT.md`
  - `docs/MERCADOPAGO_SANDBOX_EXECUTION.md`
  - `docs/MERCADOPAGO_WEBHOOK_SIGNATURE.md`
  - `docs/MERCADOPAGO_ROLLBACK.md`

## 6. Tests Ejecutados (Security & Claims)
- **Security Scan:** No se encontraron llaves de producción ni URL activas (Neon, Firebase, Run).
- **Unit Tests (`test:demo`):** Se crearon mocks completos que simulan las transacciones y fallos esperados del webhook en RAM (400 amount mismatch, 404 unknown order, 401 invalid signature).

## 7. Veredicto Final

* MercadoPago Sandbox Preflight: **PREFLIGHT_GO_WITH_OBSERVATIONS** (Faltan ingresar las llaves reales en `.env.demo.local` por parte del equipo humano)
* Ready for Sandbox Execution 8B: **CONDITIONAL** (Solo cuando se configuren las credenciales `TEST_` y `localtunnel`).
* Production/Staging: **NO-GO**
