# Demo Reset and Seed

## Objetivo
Explicar cómo restablecer el estado del entorno Demo entre presentaciones y documentar los usuarios disponibles.

## ¿Qué limpia `demo:reset`?
El comando `pnpm demo:reset` elimina y recrea todas las tablas del esquema en Postgres local (puerto 5433).
1. Borra `audit_logs`, `integration_events`, `token_orders`.
2. Borra `genesis_purchases` y `balances`.
3. Borra `users` y `properties`.
4. Rellena (seeds) los usuarios demo, la propiedad y compras iniciales simuladas.

## Aislamiento (No toca producción)
Este comando **NO TOCA PRODUCCIÓN**. Contiene un chequeo agresivo en `validateDemoDatabaseUrl` que detecta cadenas relacionadas con producción (`neon.tech`, `cloudsql`) y lanza un error `Panic` impidiendo que Drizzle ejecute ningún DELETE o DROP.

## Usuarios Demo
Las contraseñas no se especifican por seguridad, pero todos estos usuarios usan la clave estandarizada de testing (o mock auth passthrough).

1. `demo_investor@pachanova.com` - Rol: Inversor (Posee balance de tokens para UI).
2. `demo_admin@pachanova.com` - Rol: Admin (Accede a tesorería).
3. `demo_fideicomiso@pachanova.com` - Rol: Fideicomiso (Aprueba firmas multisig).
