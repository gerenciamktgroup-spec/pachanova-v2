# MercadoPago Sandbox Preflight

**Fase:** 8A

Esta guía detalla cómo configurar de manera segura el entorno de Sandbox para MercadoPago en la plataforma PachaNova.

## 1. Dónde obtener credenciales TEST
Debes ingresar al [Developer Dashboard de MercadoPago](https://www.mercadopago.com/developers/panel) con una cuenta de desarrollador. Selecciona tu aplicación y ve a **Credenciales de Prueba**. Allí encontrarás `TEST_...` (Access Token y Public Key).
**Nunca** utilices las credenciales de producción (`APP_USR`).

## 2. Variables en `.env.demo.local`
Renombra `.env.demo.local.example` a `.env.demo.local` y reemplaza los valores de `TEST_placeholder` con las llaves que obtuviste.
Asegúrate de configurar `MERCADOPAGO_WEBHOOK_SECRET`. Si pruebas en Sandbox, puedes dejar un string temporal, pero MP te dará un Secret real si configuras Webhooks en el panel.

## 3. Levantar LocalTunnel / Ngrok
Para recibir webhooks, MercadoPago necesita una URL pública.
Ejecuta:
```bash
npx localtunnel --port 3000
```
Copia la URL (ej. `https://xxxx.loca.lt`) y pégala en `APP_BASE_URL` y `MERCADOPAGO_WEBHOOK_URL` dentro de `.env.demo.local`.

## 4. Webhook URL
Ve al panel de MercadoPago -> Webhooks y registra la URL: `https://xxxx.loca.lt/api/mercadopago/webhook`. Suscríbete a eventos de "Pagos" (Payments).

## 5. Ejecutar Preflight y Smoke
- Preflight: Ejecuta `pnpm mp:sandbox:preflight`. Este script verifica que la seguridad local sea correcta y que no tengas secretos de producción expuestos.
- Smoke: Ejecuta `pnpm mp:sandbox:smoke`. Solo llamará a MercadoPago si has cambiado los placeholders por llaves de prueba reales, para validar la conexión al SDK.

## Advertencias Estrictas
- **NO** hagas commit de `.env.demo.local`.
- **NO** uses `APP_USR`.
- **NO** actives bypass de firmas (`MP_WEBHOOK_ALLOW_UNSIGNED`) en redes expuestas a internet o en Sandbox completo.
