# Reporte de Auditoría y Limpieza de Deuda Técnica (PachaNova V2.0 - Fase 4)

Este documento detalla los hallazgos tras escanear el monorepo para consolidar la arquitectura de la Fase 4 (SQL-first nativo en Supabase, Smart Contracts ERC-3643, Hono y Server Actions Next.js).

## 1. Supabase (Migraciones y Esquemas)
**Archivos Obsoletos:**
- `supabase/esquemas/08_pacha_stakes.sql`
- `supabase/migrations/20260604000000_init.sql` (Sujeto a revisión, pero contiene tablas antiguas que chocan con la nueva arquitectura limpia de `trusts`, `assets` y `users_identity`).

**Justificación:**
Con la adopción del patrón "SQL-first" e idempotencia en nuestra migración principal `20260608125000_fase1_rwa_trusts_assets_kyc.sql`, las migraciones y esquemas previos generan conflictos estructurales o mantienen deuda de entidades antiguas (ej. `pacha_stakes`, viejas estructuras de `properties`).

## 2. Drizzle ORM (Paquete Database)
Al migrar a Supabase SQL-first, Drizzle se mantiene únicamente como *Query Builder* tipado para el backend (Hono) y el frontend (Next.js). Ya no es necesario usar Drizzle para generar migraciones, ni mantener decenas de esquemas que no están alineados a nuestro Core RWA actual.

**Archivos a Eliminar:**
- Todos los esquemas irrelevantes en `packages/database/src/schema/` (ej. `gamification.ts`, `demoAdditions.ts`, `p2p.ts`, `properties.ts`, `vaults.ts`, `fideicomiso_audits.ts`, `AIOptimizedVault.sol`, etc.). 
- **Solo conservaremos:** `trusts.ts`, `assets.ts`, `users_identity.ts`, `users.ts`, `enums.ts` e `index.ts`.

**Dependencias a Eliminar:**
- `drizzle-kit` de `package.json` en `packages/database`, ya que las migraciones ahora se escriben nativamente y a mano en Supabase.

## 3. Smart Contracts
La carpeta `packages/contracts/src/` contiene 24 contratos experimentales y tokens de prueba de las iteraciones pasadas.

**Contratos a Eliminar:**
- `AIOptimizedVault.sol`, `BridgedToken.sol`, `CDPEngine.sol`, `CrossChainBridge.sol`, `DePINOracle.sol`, `DividendDistributor.sol`, `DynamicDeedNFT.sol`, `ERCX.sol`, `FideicomisoTrustAnchor.sol`, `LandLending.sol`, `LandValuationOracle.sol`, `LegalWrapper.sol`, `OmnipoolVault.sol`, `P2PEscrow.sol`, `PachaGovernor.sol`, `PachaNovaAuction.sol`, `PachaNovaToken.sol`, `PachaSoulbound.sol`, `PachaStaking.sol`, `PachaUSD.sol`, `QRCRegistry.sol`, `RWALendingPool.sol`, `SingularityHandover.sol`, `SovereignPassport.sol`.

**Justificación:**
El único core contract que gestiona las 50 hectáreas y cumple el modelo ERC-3643 para el Land Banking de esta versión final de producción es `PachaNovaLandTrust.sol`.
