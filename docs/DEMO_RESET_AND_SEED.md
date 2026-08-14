# Reset, seed y escenarios demo

## Secuencia canónica

```bash
pnpm demo:db:up
pnpm demo:reset
```

`demo:reset` ejecuta en este orden:

1. `drizzle-kit push` para crear/actualizar el esquema.
2. Validación estricta de `DEMO_MODE` y `DATABASE_URL`.
3. Limpieza transaccional de webhooks, notificaciones, fideicomiso, P2P, ledger, transacciones, distribuciones, valuaciones, compras, órdenes, saldos, KYC, auditoría, integraciones, sesiones, propiedades, inversores y parámetros.
4. Seed determinista.

El validador acepta PostgreSQL local (`localhost`/`127.0.0.1`), una URL nombrada explícitamente como demo o el proyecto remoto demo aprobado. Bloquea referencias conocidas de producción y hosts remotos no aprobados.

## Dataset base

| Identidad | Rol | KYC | Uso |
|---|---|---|---|
| `gerencia.mktgroup@gmail.com` | admin | approved | consola administrativa |
| `demo.investor.approved@pachanova.local` | investor | approved | vendedor P2P inicial |
| `demo.investor.holder@pachanova.local` | investor | approved | identidad canónica del panel |
| `demo.investor.pending@pachanova.local` | investor | pending | bloqueo KYC |
| `demo.fiduciario@pachanova.local` | fiduciario | approved | operaciones fiduciarias |
| `demo.comite@pachanova.local` | comite | approved | segunda firma/gobierno |

También se crean cinco PNC (`PAR`, `VIV`, `YLD`, `HTL`, `MIX`), valuaciones 2026, saldos, una compra Génesis inicial, un movimiento de ledger y una oferta P2P abierta. El holder puede comprar esa oferta y también publicar la suya.

## Escenarios

```bash
pnpm demo:scenario:happy
pnpm demo:scenario:rejected-payment
pnpm demo:scenario:duplicate-webhook
pnpm demo:scenario:kyc-pending
```

Cada escenario ejecuta reset + seed antes de aplicar su variación. Las columnas SQL usadas están alineadas con el esquema Drizzle actual.

## Seguridad operativa

- No ejecutar el reset contra una base compartida: el comando limpia el dataset completo una vez validado como entorno demo.
- No copiar credenciales de producción a `.env.demo.local`.
- Los endpoints `/api/demo/reset` y `/api/demo/seed` requieren `DEMO_ADMIN_TOKEN` si se exponen con `NODE_ENV=production`.
- Los archivos `.env.local` y `.env.demo.local` son locales y no deben versionarse.
