# PachaNova v2

PachaNova es una plataforma de referencia para operar activos inmobiliarios tokenizados (RWA): onboarding/KYC, compra Génesis, mercado P2P, ledger, gestión de PNC, fideicomiso y observabilidad de integraciones.

El runtime canónico es `apps/dashboard` (Next.js, puerto 3000). `apps/web` se conserva como frontend legado para comparación y migración; no debe arrancarse junto al dashboard salvo con `pnpm dev:all`. `apps/api` es una API de servicio Hono protegida por clave.

## Inicio local determinista

Requisitos: Node.js 20+, pnpm 9 y Docker Desktop con el motor activo.

```bash
pnpm install
pnpm demo:db:up
pnpm demo:reset
pnpm dev
```

Abrir `http://localhost:3000/dashboard/investor`. El reset ejecuta primero el push del esquema, limpia únicamente una base validada como demo/local y crea identidades, saldos, cinco PNC, una compra Génesis, un ledger inicial y una orden P2P reproducible.

Escenarios disponibles:

```bash
pnpm demo:scenario:happy
pnpm demo:scenario:rejected-payment
pnpm demo:scenario:duplicate-webhook
pnpm demo:scenario:kyc-pending
```

## Controles de calidad

```bash
pnpm typecheck
pnpm test
pnpm build
```

`pnpm test` incluye la suite Vitest de aceptación local (30 casos). Las pruebas E2E completas requieren la base demo y el servidor:

```bash
pnpm test:e2e:demo
```

## Alcance y verdad operativa

- Las mutaciones del modo demo sí persisten en PostgreSQL local y dejan auditoría/ledger.
- MercadoPago puede conectarse al sandbox cuando existen credenciales; nunca se debe usar una credencial de producción en modo demo.
- Contratos, KYC externo, oráculo y el puente ORQ son simulados o pendientes mientras el registro de integraciones no indique `CONNECTED`.
- El ledger local es evidencia hash-encadenada de la simulación; no equivale por sí mismo a liquidación en una blockchain pública.

La arquitectura y los límites detallados están en [docs/ARCHITECTURE_CURRENT.md](docs/ARCHITECTURE_CURRENT.md). La operación del dataset está en [docs/DEMO_RESET_AND_SEED.md](docs/DEMO_RESET_AND_SEED.md).
