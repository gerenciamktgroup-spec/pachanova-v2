# MercadoPago Sandbox Rollback

Si ocurren problemas bloqueantes durante la fase 8A (Preflight) o la fase 8B (Ejecución), debes seguir estos pasos para desactivar la integración de pagos externos.

## 1. Desactivación Segura del Registry
En el entorno PachaNova v2.0, los proveedores están centralizados en el `IntegrationRegistry`.
Para desactivar MercadoPago y volver al flujo de simulación de depósito manual sin webhooks:

Modifica tu `.env.demo.local` o `.env.local`:
```env
PAYMENTS_EXTERNAL_ENABLED=false
DEMO_PROFILE=offline
```

## 2. Retiro de Credenciales
Si temes que el `MERCADOPAGO_ACCESS_TOKEN` de tipo `TEST_` o `APP_USR` fue expuesto en una transmisión insegura o commit:
1. Entra al Panel de Desarrolladores de MercadoPago y genera nuevas credenciales (rotación).
2. Abre tu `.env.demo.local` y borra el contenido, reemplazándolo por `TEST_placeholder`.
3. Borra tu `MERCADOPAGO_WEBHOOK_SECRET` y colócalo en `placeholder`.

## 3. Qué hace el Registry al estar apagado
- `api/mercadopago/preference` retornará error 400 (Payments disabled).
- `api/mercadopago/webhook` rechazará peticiones devolviendo 400.
- La interfaz `/dashboard/investor/genesis` volverá al estado inactivo o utilizará mock si el código frontend está atado al `Registry` fallback.

## 4. Reset del Ledger
Si un Webhook Sandbox corrompió tus saldos locales (un error de idempotencia):
```bash
pnpm demo:reset
pnpm demo:db:seed
```
Esto purgará el `token_ledger` y las compras Genesis, volviendo todo a 0. NUNCA correr en producción (las protecciones anti-prod te detendrán automáticamente de igual modo).
