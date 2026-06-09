# Auditoría Final PachaNova V2.0 y Pasos para Lanzamiento (Vercel)

He realizado una auditoría profunda de la configuración de Vercel, Supabase, GitHub y del código del monorepo. Aquí tienes el diagnóstico y exactamente qué falta para poder lanzar a producción.

## 1. El Bloqueante Principal (Drizzle vs Vercel) 🚨
**Hallazgo Crítico en `apps/dashboard/package.json`:**
Actualmente el script de build de tu frontend es:
`"build": "npm --prefix ../../packages/database run db:migrate && node --max-old-space-size=4096 node_modules/next/dist/bin/next build"`

**El problema:** En la Fase 1 limpiamos el paquete de base de datos y borramos `drizzle-kit` porque decidimos hacer las migraciones de forma nativa en el SQL de Supabase (SQL-first). Cuando Vercel intente hacer el build del proyecto, buscará ejecutar `db:migrate`, el cual invocará a `drizzle-kit push` (definido en `packages/database/package.json`) y **el build fallará rotundamente** porque esa dependencia ya no existe.

**La Solución (Lo que falta hacer):**
Debemos editar `apps/dashboard/package.json` y cambiar el script de build a simplemente:
`"build": "node --max-old-space-size=4096 node_modules/next/dist/bin/next build"`
*(Te sugiero hacer este cambio antes del primer push a main).*

## 2. Auditoría de Variables de Entorno (Vercel + Supabase) 🔑
Para que el despliegue en Vercel sea exitoso, tu proyecto en Vercel debe configurarse como un **Monorepo** (eligiendo la carpeta `apps/dashboard` como Root Directory o usando Turborepo). Además, debes inyectar obligatoriamente las siguientes variables en la configuración de Vercel:

| Variable | Dónde se usa | Propósito |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend & Hono | Conexión al proyecto de Supabase en producción. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend | Para crear la sesión JWT y leer assets con RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend (Hono) | Para orquestar y saltarse el RLS al aprobar KYC. |
| `INTERNAL_API_URL` | Server Actions | URL de despliegue de tu API Hono (para los webhooks). |
| `INTERNAL_API_KEY` | Server Actions | Llave secreta para que NextJS se autentique con Hono. |
| `ADMIN_PRIVATE_KEY` | Backend (Hono) | Llave privada EVM de la wallet administradora del contrato RWA. |

## 3. Configuración de API Hono (Vercel Functions) ⚙️
No encontré un `vercel.json` en `apps/api/`. Hono necesita un adaptador para correr nativamente en Vercel. 
**Lo que falta:** Asegurarte de que en `apps/api/src/index.ts` estés usando el adaptador de Vercel (`import { handle } from 'hono/vercel'`) y que se exporte la app correctamente, o añadir un archivo `vercel.json` en esa ruta que dirija el tráfico al handler de Node.js.

## 4. GitHub Actions (CI/CD) 🐙
La carpeta `.github/workflows/` no existe. 
**Estado:** Vercel se encarga del CI/CD automáticamente cuando conectas la rama `main` de GitHub al proyecto de Vercel. Por ende, no es estrictamente necesario crear Actions para el despliegue, a menos que desees compilar los Smart Contracts (con Foundry/Hardhat) de forma remota antes de cada release.

## 5. Auditoría de la Capa de Datos (Supabase) 🗄️
**Estado:** Excelente. La migración `20260608125000_fase1_rwa_trusts_assets_kyc.sql` es robusta, idempotente y limpia. 
**Lo que falta:** Antes de lanzar a producción, asegúrate de ejecutar este archivo `.sql` manualmente en el panel de Supabase de Producción. Si no ejecutas esto, Vercel compilará bien, pero los usuarios verán errores 500 al intentar visualizar su portafolio porque las tablas `trusts` y `assets` no existirán en la nube.

---

### Resumen de tu Check-List para Hoy:
1. [ ] Eliminar `run db:migrate` del script de `build` en el `package.json` del dashboard.
2. [ ] Ejecutar el script SQL de Fase 1 en tu Supabase de Producción.
3. [ ] Crear un nuevo proyecto en Vercel conectado a este repositorio.
4. [ ] Pegar todas las Variables de Entorno mencionadas en Vercel.
5. [ ] Configurar el backend Hono para Vercel Serverless (si lo vas a desplegar en Vercel separado del Dashboard).
