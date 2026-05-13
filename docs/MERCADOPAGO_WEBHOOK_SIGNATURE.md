# MercadoPago Webhook Signature Readiness

Esta documentación explica la arquitectura de validación de firmas criptográficas para PachaNova Sandbox.

## 1. El Problema
Los webhooks de MercadoPago (notificaciones HTTP de pago aprobado/rechazado) llegan de manera asíncrona a `POST /api/mercadopago/webhook`. Si un atacante descubre esta URL, podría enviar un payload falso (`{"status": "approved", "id": 1234}`) y forzar la emisión fraudulenta de tokens `PACHA`.

## 2. Implementación de HMAC-SHA256
Para garantizar que el payload viene de MercadoPago, PachaNova implementa la validación recomendada de firmas (MercadoPago Signature Validation):

1. **Extracción de Headers**: Leemos `x-signature` y `x-request-id`.
2. **Parsing**: MercadoPago envía la firma como `ts=xxx,v1=yyy`. Extraemos el timestamp (`ts`) y el hash esperado (`v1`).
3. **Data ID**: Leemos `data.id` del payload JSON.
4. **Normalización (Edge Case MP)**: En ocasiones, si `data.id` es alfanumérico, MercadoPago lo usa en minúsculas para firmar, aunque lo envíe original en el payload. Nuestra función normaliza a `lowercase` dinámicamente.
5. **Construcción del Manifest**: `id:{data.id};request-id:{x-request-id};ts:{ts};`
6. **Hashing Fuerte**: Generamos nuestro propio hash usando `crypto.createHmac('sha256', secret)` con tu `MERCADOPAGO_WEBHOOK_SECRET`.
7. **Timing Safe Equal**: Comparamos el hash generado con `v1` utilizando `crypto.timingSafeEqual`. Esto previene ataques de *timing* (medición de tiempos de respuesta del procesador).

## 3. Prevención de Bypass
El sistema soporta un flag local `MP_WEBHOOK_ALLOW_UNSIGNED` para tests offline manuales con Postman.
Sin embargo, **si estás corriendo `DEMO_PROFILE=sandbox`**, el enrutador anulará automáticamente el intento de bypass y obligará a que la firma sea evaluada y correcta.
