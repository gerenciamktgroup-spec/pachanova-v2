#!/bin/bash

echo "Iniciando limpieza de deuda técnica PachaNova V2.0..."

# 1. Limpieza Supabase
echo "-> Limpiando migraciones antiguas de Supabase..."
rm -f supabase/esquemas/08_pacha_stakes.sql
# NOTA: Mantenemos 20260604000000_init.sql porque contiene tablas core (system_parameters, audit_logs, investors).
# rm -f supabase/migrations/20260604000000_init.sql

# 2. Limpieza Drizzle ORM
echo "-> Limpiando esquemas Drizzle obsoletos..."
cd packages/database/src/schema/ || exit
find . -type f -not -name 'trusts.ts' -not -name 'assets.ts' -not -name 'users_identity.ts' -not -name 'users.ts' -not -name 'enums.ts' -not -name 'index.ts' -delete
cd ../../../..

echo "-> Desinstalando drizzle-kit (Ya no generamos migraciones con Drizzle)..."
npm uninstall drizzle-kit --workspace=@pachanova/database

# 3. Limpieza Smart Contracts
echo "-> Limpiando contratos antiguos de Foundry/Hardhat..."
cd packages/contracts/src/ || exit
find . -type f -name '*.sol' -not -name 'PachaNovaLandTrust.sol' -not -name 'IIdentityRegistry.sol' -delete
cd ../../..

echo "¡Limpieza completada! Arquitectura PachaNova V2.0 unificada."
