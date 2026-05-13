# MercadoPago Sandbox Execution

**Fase:** 8B (Próxima)

Esta guía explica cómo ejecutar las pruebas funcionales del Sandbox de MercadoPago tras pasar el Preflight.

## 1. Prerrequisitos
- Haber completado `pnpm mp:sandbox:preflight` con resultado `PREFLIGHT_GO`.
- Tener `.env.demo.local` configurado con llaves `TEST_` genuinas.
- Túnel `localtunnel` o `ngrok` apuntando a tu localhost activo.
- Aplicación corriendo (`pnpm demo:start`).

## 2. Ejecutar Compra (Approved)
1. Entra a `/dashboard/investor/genesis` simulando el frontend.
2. Inicia una compra. El backend creará una orden `pending` y se comunicará con MercadoPago.
3. Serás redirigido al `init_point` (Checkout de MercadoPago Sandbox).
4. Usa una tarjeta de prueba aprobada (ej. VISA terminada en 0000 0000 0000 0000 - según tu país).
5. Se disparará el webhook. Verifica en tu BD que `tokenOrders` está `completed`, se creó un `tokenLedger` y tienes más `balances`.

## 3. Probar Rechazo (Rejected)
1. Repite el paso de compra.
2. Usa una tarjeta de prueba de *Fondos Insuficientes* o *Rechazada* (revisa docs de MercadoPago para el número específico).
3. MercadoPago disparará un webhook con status `rejected`.
4. El sistema devolverá `200 OK` pero NO acreditará los tokens a tu balance.

## 4. Probar Idempotencia (Duplicate)
1. Consigue el `paymentId` de un evento ya aprobado en tus `integration_events`.
2. Lanza una llamada POST manual al webhook usando Postman o ThunderClient enviando el payload con el mismo `id`.
3. (Debes calcular el HMAC-SHA256 correcto para tu `data.id` en Postman si no tienes bypass, o levantar la app en `offline` con allowUnsigned=true).
4. El sistema responderá `idempotent_duplicate` y tu balance no aumentará.

## 5. Qué NO Hacer
- **NUNCA** uses credenciales `APP_USR` en el entorno Demo.
- No intentes comprar tokens si tu KYC está `pending`, el servidor debe rechazar la solicitud en `preference`.
