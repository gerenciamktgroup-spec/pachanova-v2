# Demo Troubleshooting Guide

## 1. Docker daemon no corre
- **Síntoma:** Error al ejecutar `pnpm demo:up`. `Cannot connect to the Docker daemon`.
- **Solución:** Abre la aplicación Docker Desktop (en Windows/Mac) o ejecuta `sudo systemctl start docker` (en Linux).

## 2. Puerto 5433 ocupado
- **Síntoma:** Error al levantar el contenedor de Postgres indicando que el puerto 5433 está en uso.
- **Solución:** Verifica qué proceso usa el puerto: `netstat -ano | findstr :5433` (Windows). Mata el proceso o cambia el puerto local en `docker-compose.demo.yml`.

## 3. `pnpm install` falla
- **Síntoma:** Errores de dependencias o `ERR_PNPM_LOCKFILE_MISSING`.
- **Solución:** Ejecuta `pnpm config set auto-install-peers true` y luego limpia el caché con `pnpm store prune`, seguido de `pnpm install`.

## 4. Build falla
- **Síntoma:** `pnpm build` falla en `@pachanova/contracts` o `web`.
- **Solución:** Ejecuta `pnpm lint` y `pnpm typecheck` para encontrar el error exacto en TypeScript.

## 5. Playwright Chromium no instalado
- **Síntoma:** Al ejecutar `pnpm test:e2e:demo`, dice `Executable doesn't exist at...`
- **Solución:** Corre el comando: `npx playwright install chromium`.

## 6. DB Seed falla
- **Síntoma:** Violación de llave única al hacer `pnpm demo:db:seed`.
- **Solución:** Ejecuta un reset completo: `pnpm demo:reset` (o `pnpm demo:db:migrate` y luego `seed`).

## 7. Rutas devuelven 500
- **Síntoma:** La UI muestra errores de red al consultar APIs.
- **Solución:** Revisa el archivo `.env.demo`. Asegúrate de que `DATABASE_URL` sea correcta.

## 8. IntegrationRegistry misconfigured
- **Síntoma:** `pnpm demo:health` dice que `/api/demo/integrations` falla con 500.
- **Solución:** Asegúrate de tener `.env.demo.local` configurado y que el archivo exponga variables base, ej: `DEMO_PROFILE=offline`.

## 9. Security scan con hallazgos
- **Síntoma:** El script `demo:acceptance` falla en la etapa del `grep`.
- **Solución:** Revisar el archivo indicado. Has subido un token productivo o contraseña a Github. Elimínalo inmediatamente, rota la clave productiva y sigue el `SECURITY_ROTATION_REQUIRED.md`.

## 10. Variables de entorno incorrectas
- **Síntoma:** Next.js se queja de `NEXT_PUBLIC_...` no definidos.
- **Solución:** Asegúrate de copiar `cp .env.demo.example .env.demo` para cargar todos los defaults en entorno Demo.
