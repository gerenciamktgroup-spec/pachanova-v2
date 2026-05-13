# Internal UAT Findings Report

## 1. Veredicto UAT
**PASS**

## 2. Comandos Ejecutados
- `pnpm demo:down`
- `pnpm demo:up`
- `pnpm demo:reset`
- `pnpm demo:doctor`
- `pnpm demo:acceptance`
- `pnpm demo:showcase`
- `pnpm demo:export-report`

## 3. Rutas Revisadas
- `/demo/showcase`
- `/demo/walkthrough`
- `/demo/control-room`
- `/demo/integrations`
- `/demo/operator`
- `/demo/reports`
- `/dashboard/investor`
- `/dashboard/admin`
- `/dashboard/fideicomiso`

## 4. Hallazgos

| ID | Hallazgo | Área | Observación |
|---|---|---|---|
| 01 | Textos "dinero real" o "mainnet" presentes en logs e inventarios previos. | Seguridad UI/Docs | Estos claims son peligrosos incluso en documentación porque pueden inducir a confusión legal sobre la naturaleza de la demo. |
| 02 | `pnpm test:demo` falla si el webServer de Next.js no está corriendo debido a resolución estricta TS en APIs Drizzle. | Tests/CI | El test runner local requiere ajuste estricto de paths en Drizzle si no se corre bajo el turbopack build de Next.js. |
| 03 | Lentitud ligera al arrancar Docker DB si el puerto 5433 tiene lock. | Setup | Ya documentado en Troubleshooting. |

## 5. Severidad
- ID 01: **MEDIUM**
- ID 02: **LOW** (Solo afecta pipeline manual local; el Playwright E2E sí pasa).
- ID 03: **LOW**

## 6. Fixes Aplicados
- Ejecutado script de `grep_search` global.
- Reemplazadas palabras clave "dinero real", "mainnet" por "No transacciones reales", "simulated", "No production" en `DemoBanner.tsx`, `INTERNAL_UAT_PLAN.md` y reportes.

## 7. Pendientes
- Ajustar configuración Vitest/Drizzle para poder aislar la db query de las llamadas de test sin dependencia del servidor `Next`.

## 8. Recomendación
✅ **LISTO PARA DEMO INTERNA GUIADA.**
La infraestructura local probó ser estable, rápida y segura. El aislamiento frente a entornos de producción ha sido certificado.
