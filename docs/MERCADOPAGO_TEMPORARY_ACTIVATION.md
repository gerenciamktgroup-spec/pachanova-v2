# MercadoPago Sandbox - Activación Temporal

Este documento detalla el procedimiento oficial y seguro para activar la integración con **MercadoPago Sandbox** de manera temporal durante sesiones de QA y pruebas E2E, sin exponer credenciales productivas ni ensuciar los archivos base del entorno.

## Prerrequisitos
1. El proyecto debe estar operando localmente (`pnpm dev:demo` o `pnpm start:demo`).
2. Disponer de credenciales TEST reales extraídas del Panel de Developers de MercadoPago:
   - `MERCADOPAGO_ACCESS_TOKEN` (que empiece con `TEST_`).
   - `MERCADOPAGO_PUBLIC_KEY` (que empiece con `TEST_`).
   - `MERCADOPAGO_WEBHOOK_SECRET` (Generado al registrar el webhook en el panel).
3. Tener `localtunnel` o `ngrok` instalado para exponer el puerto 3000 a internet.

## Activación
1. **Localtunnel:** Ejecuta `npx localtunnel --port 3000` y copia la URL generada (`https://xxxx.loca.lt`).
2. **Configuración Webhook:** Ve al panel de MP Developers e inscribe la URL: `https://xxxx.loca.lt/api/mercadopago/webhook`. Copia el `secret` que te proveen.
3. **Archivo Local:** Edita (o crea) el archivo no versionado `.env.demo.local`.
   ```env
   DEMO_PROFILE=sandbox
   PAYMENTS_EXTERNAL_ENABLED=true
   MERCADOPAGO_WEBHOOK_URL=https://xxxx.loca.lt/api/mercadopago/webhook
   MERCADOPAGO_ACCESS_TOKEN=TEST_real_token
   MERCADOPAGO_PUBLIC_KEY=TEST_real_key
   MERCADOPAGO_WEBHOOK_SECRET=real_secret
   ```
4. **Verificación Inicial:** Ejecuta `pnpm mp:sandbox:smoke`. Si es exitoso, verás el enlace de pago sandbox generado y el `orderId`.

## Desactivación Segura
Para retornar al estado pasivo (`demo_offline`) de manera segura:
1. Revierte los valores en `.env.demo.local`:
   ```env
   DEMO_PROFILE=offline
   PAYMENTS_EXTERNAL_ENABLED=false
   ```
2. Borra o vacía las credenciales `TEST_` y el `SECRET` del archivo si lo deseas.
3. Cierra `localtunnel` o `ngrok`.
4. Ejecuta `pnpm demo:health` para comprobar que las rutas siguen respondiendo en modo mock (SIMULATED).

## Criterios de Aceptación (GO)
- Al completar una compra vía Sandbox, el webhook es recibido y validado (el `x-signature` debe hacer match).
- El sistema acredita tokens correctamente (`approved`) en BD local sin duplicar (`duplicate`).
- La UI en `/demo/integrations` refleja estado `CONNECTED` en payments.

## Criterios de Bloqueo (NO-GO)
- Si usas tokens ficticios (ej. `TEST_placeholder`), el sistema forzará `NO-GO` o arrojará 401 en los flujos.
- Intentar usar tokens reales productivos (`APP_USR`). El entorno arrojará un Panic y no levantará.
- Hacer deploy con `DEMO_PROFILE=sandbox` a un Vercel/Cloud en producción.
