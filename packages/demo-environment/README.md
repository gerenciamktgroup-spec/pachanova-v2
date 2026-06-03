# @pachanova/demo-environment

Gestor centralizado del entorno de demostración (Demo Mirror) de PachaNova.

## Objetivo

Este paquete tiene como objetivo centralizar toda la lógica relacionada con:

- Reset del entorno de demo
- Seed de datos de demostración
- Aplicación de escenarios predefinidos (happy path, rejected payment, KYC pending, etc.)
- Validación del estado del entorno

## Uso básico

```ts
import { createDemoEnvironmentManager } from '@pachanova/demo-environment';

const demo = createDemoEnvironmentManager({
  mode: 'demo',
});

await demo.reset();
await demo.seed();
await demo.applyScenario('happy');
```

## Estado actual

Este paquete está en fase inicial de implementación (Fase 1 del plan de mejoras del Demo Mirror).

### Escenarios disponibles

Los escenarios ahora son **inteligentes**:
- Controlan su propio ciclo de vida (`reset()` + `seed()`).
- Pueden inyectar datos reales usando `withDb()` (eventos de integración, estados de KYC, etc.).

Escenarios actuales:
- `happy` — Flujo exitoso + historial + audit logs
- `rejected-payment` — Compra fallida + evento de rechazo
- `kyc-pending` — KYC pendiente + documentos subidos
- `duplicate-webhook` — Webhook duplicado (demuestra idempotencia)

Más escenarios se pueden agregar fácilmente.

## Estructura

```
src/
├── DemoEnvironmentManager.ts   # Clase principal (orquestador)
├── types.ts
├── scenarios/                  # Escenarios disponibles
│   ├── happy.ts
│   ├── rejected-payment.ts
│   ├── kyc-pending.ts
│   └── duplicate-webhook.ts
└── scripts/                    # CLI scripts
```

## Comandos disponibles

Desde la raíz del monorepo:

```bash
# Reset del entorno de demo
pnpm --filter @pachanova/demo-environment run demo:reset

# Seed del entorno de demo
pnpm --filter @pachanova/demo-environment run demo:seed
```

Desde la raíz del monorepo (recomendado):

```bash
pnpm demo:reset:manager
pnpm demo:seed:manager

# Ver estado actual del entorno de demo
pnpm demo:status

# Ejecutar el doctor completo (incluye ahora el estado del manager)
pnpm demo:doctor

# Aplicar escenarios
pnpm demo:scenario happy
pnpm demo:scenario rejected-payment
pnpm demo:scenario kyc-pending
pnpm demo:scenario duplicate-webhook
```

Desde dentro del paquete:

```bash
pnpm demo:reset
pnpm demo:seed
pnpm demo:scenario happy
pnpm demo:scenario rejected-payment
pnpm demo:scenario kyc-pending
pnpm demo:scenario duplicate-webhook
```

## Notas

- Estos comandos delegan actualmente en los scripts existentes de `@pachanova/database`.
- El objetivo es que este paquete se convierta progresivamente en el único lugar desde donde se gestione el Demo Mirror.
- Próximamente se agregará soporte completo para escenarios (`demo:scenario <nombre>`).
