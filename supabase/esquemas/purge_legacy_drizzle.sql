-- ==============================================================================
-- PachaNova V2.0 - PURGA DE TABLAS LEGACY (DRIZZLE ORM)
-- Ejecutar esto en el SQL Editor de Supabase (Panel Web)
-- ==============================================================================

-- Advertencia: Esto borrará las tablas de las fases 1-150 que ya no se utilizan
-- en la arquitectura V2.0 SQL-First. No afectará a las tablas nuevas (trusts, assets).

DROP TABLE IF EXISTS "properties" CASCADE;
DROP TABLE IF EXISTS "balances" CASCADE;
DROP TABLE IF EXISTS "distributions" CASCADE;
DROP TABLE IF EXISTS "transactions" CASCADE;
DROP TABLE IF EXISTS "stakes" CASCADE;
DROP TABLE IF EXISTS "yield_injections" CASCADE;
DROP TABLE IF EXISTS "gamificationLedger" CASCADE;
DROP TABLE IF EXISTS "integrationEvents" CASCADE;
DROP TABLE IF EXISTS "genesisPurchases" CASCADE;
DROP TABLE IF EXISTS "kycRequests" CASCADE;

-- Si Drizzle creó alguna tabla de migraciones interna:
DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE;

SELECT 'Purga completada exitosamente. El esquema ahora es 100% V2.0 Nativo.' as status;
