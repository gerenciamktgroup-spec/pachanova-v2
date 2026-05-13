# PachaNova v2.0 - Demo Mirror Environment

Este entorno permite simular, probar y visualizar la funcionalidad completa institucional de la plataforma PachaNova v2.0 sin utilizar recursos de production ni afectar bases de datos operativas.

## Modos de Operación

### 1. DEMO_OFFLINE
- Todo el flujo (contratos, pagos, kyc, oracle) es simulado localmente mediante mocks internos.
- Útil para QA visual y demostraciones guiadas donde no hay conexión a internet.

### 2. DEMO_SANDBOX
- Integración real con **MercadoPago Sandbox**.
- Base de datos local aislada en Postgres (puerto 5433).
- Contratos simulados pero infraestructura transaccional verificable.

### 3. DEMO_CONNECTED
- Contratos corriendo en Anvil (localhost:8545) o Polygon Amoy testnet.
- Oracle conectado y emitiendo datos.
- Firma estricta de webhooks.

## Cómo Iniciar (Local Sandbox)

1. Clonar y configurar entorno:
   ```bash
   pnpm install
   cp .env.demo.example .env.local
   ```
2. Levantar la base de datos de pruebas aislada:
   ```bash
   pnpm demo:db:up
   ```
3. Ejecutar migraciones Drizzle y el Seed (genera inversores dummy y saldos):
   ```bash
   pnpm demo:db:migrate
   pnpm demo:db:seed
   ```
4. Levantar la aplicación web:
   ```bash
   pnpm demo:start
   ```

El sistema estará disponible en `http://localhost:3000/demo`.

## Base de Datos (Aislada y Descartable)
Bajo ninguna circunstancia `db:migrate` impactará la base de producción si `DEMO_MODE=true` o el `DATABASE_URL` no contiene la cadena "demo". Los esquemas de auditoría marcarán todas las transacciones demo con el flag `simulated: true`.
