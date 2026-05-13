# PachaNova v2.0 - Demo Operator Runbook

Esta guía instruye al Operador responsable de presentar el Demo Local de PachaNova a inversores internos o stakeholders.

## 1. Significado de los Estados
- **READY-BUT-DISABLED**: El código para integrar al proveedor existe y está probado, pero por seguridad se mantiene apagado.
- **PENDING_CREDENTIALS**: Falta un Token de API o llave secreta en el archivo `.env.demo.local` para poder conectarse.
- **PENDING_FOUNDRY**: Falta compilar y levantar el entorno blockchain local (`Anvil`).

## 2. Instalación y Preparación (Día Cero)
1. Asegurar Node.js >=18, pnpm 9, y Docker corriendo.
2. Clonar repo y correr `pnpm install`.
3. Validar variables: Copiar `.env.demo.example` a `.env.demo` y asegurar `DEMO_MODE=true`.

## 3. Levantar Demo desde cero
Antes de cada presentación, asegúrate de levantar el sistema limpio:
```bash
pnpm demo:up       # Levanta Postgres en puerto 5433
pnpm demo:reset    # Trunca y rellena la BD con usuarios de prueba
pnpm demo:start    # Levanta la UI de Next.js
```

## 4. Validar Demo
Ejecuta el script Doctor para certificar que el entorno no puede dañar producción:
```bash
pnpm demo:doctor
```

## 5. Presentar Demo
Abre el navegador en [http://localhost:3000/demo/showcase](http://localhost:3000/demo/showcase). Sigue el `DEMO_PRESENTATION_SCRIPT.md`.

## 6. Resetear Demo
Si realizaste transacciones de prueba que deseas borrar para otra presentación:
1. Ve a `/demo/operator` y pulsa "Reset Demo Database".
2. O ejecuta en consola: `pnpm demo:reset`.

## 7. Apagar Demo
Al terminar el día:
```bash
pnpm demo:down
```

## 8. Qué NO hacer
- NUNCA pongas una llave productiva de MercadoPago en el `.env`.
- NUNCA conectes la base de datos a Neon.tech o CloudSQL.
- NUNCA cambies `DEMO_MODE=false` a menos que estés en un entorno Vercel de producción real.
