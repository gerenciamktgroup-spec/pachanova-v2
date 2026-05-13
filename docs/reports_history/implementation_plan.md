# FASE FRONT-2 — PACHANOVA DESIGN SYSTEM PREMIUM

Este plan detalla la ejecución para la implementación del Design System "Mission Control" para PachaNova, enfocado en lograr una interfaz RWA (Real World Assets) de alto perfil, siguiendo directrices estrictas de "Dark-First".

## User Review Required
Por favor, revisa la paleta de colores (`globals.css`) y la arquitectura de componentes propuesta a continuación antes de que inicie la generación de código. Esto asegurará que el "Look and feel" sea el esperado.

## Proposed Changes

### 1. `apps/web/src/app/globals.css`
#### [MODIFY] `globals.css`
- **Design Tokens (Variables CSS):** Inyección de `--pn-bg`, `--pn-bg-soft`, `--pn-surface`, `--pn-border`, `--pn-text`, y colores de acento (Gold, Sand, Terracotta, Sage, Blue, Danger, Warning, Success).
- **Utility Classes:** Creación de `.pn-page`, `.pn-shell`, `.pn-card`, `.pn-card-hover`, `.pn-border`, `.pn-glow-soft`, `.pn-mono`, `.pn-focus`, `.pn-grid-bg`, y `.pn-gradient-radial`.

### 2. Componentes Mission Control
Se crearán dentro de `apps/web/src/components/mission/`:

#### [NEW] `motion.ts`
Exportación de micro-animaciones reutilizables con `framer-motion` (ej. `fadeInUp`, `staggerContainer`, `softScale`), asegurando el soporte a `prefers-reduced-motion`.

#### [NEW] Core Layout Components
- `MissionShell.tsx`: Wrapper principal con constraints de ancho.
- `MissionHeader.tsx`: Navbar superior con el logo textual de PachaNova y los links de navegación rápida de la demo.
- `MissionSidebar.tsx`: Navegación lateral desktop/mobile amigable.
- `RouteBreadcrumbs.tsx`: Helper de navegación.

#### [NEW] Data & Display Components
- `MissionCard.tsx`: Reemplazo de `GlassCard`, incorporando las clases `.pn-card` y soporte para variantes (elevated, warning, data, etc.).
- `MetricTile.tsx`: Componente de lectura de métricas clave (m², PACHA, USD), usando fuentes `Geist_Mono`.
- `SectionHeader.tsx`: Títulos de sección consistentes con Action Slots.
- `TimelineRail.tsx`: Componente vertical para Walkthrough y Audit Logs.

#### [NEW] Badges & Status Indicators
- `DemoStatusRibbon.tsx`: Cinta oficial que anuncia "DEMO / SANDBOX — Simulated, No production".
- `RiskBadge.tsx`: Badges para métricas de riesgo estáticas.
- `IntegrationStatusBadge.tsx`: Indicadores de los estados (SIMULATED, READY-BUT-DISABLED, CONNECTED, NO-GO).

#### [NEW] State Management & Utilities
- `EmptyState.tsx`, `LoadingState.tsx`, `ErrorState.tsx`, `DataState.tsx`.
- `LegalTrustCard.tsx`: Tarjeta de advertencias y disclaimers legales RWA.
- `ExternalReadyNotice.tsx`, `ReportLinkCard.tsx`, `CommandButton.tsx`.

### 3. Página de Previsualización (Preview)
#### [NEW] `apps/web/src/app/demo/design-system/page.tsx`
Ruta aislada que renderea la totalidad de la librería de componentes (`MissionCard`, `MetricTile`, `IntegrationStatusBadge`, etc.) bajo el entorno de pruebas, para verificar contrastes y responsive sin afectar los flujos reales.

### 4. Documentación Oficial
#### [NEW] `docs/FRONTEND_DESIGN_SYSTEM.md`
Guía oficial del sistema de diseño, lineamientos visuales, diccionario de Copywriting aprobado y prohibido, y estrategias de motion & accessibility.

## Verification Plan

### Automated Tests
1. **Lint & Typecheck:** `pnpm lint` y `pnpm typecheck` para asegurar que los nuevos componentes cumplan las reglas estrictas de Next.js y TS sin usar `@ts-ignore` nuevos o `any` innecesarios.
2. **Build:** `pnpm build` para asegurar la compilación Turbopack exitosa.
3. **Unit Tests:** `pnpm test:demo` para confirmar que las funciones matemáticas de token-balance y utilidades no se han visto afectadas.
4. **E2E Playwright:** `pnpm test:e2e:demo` asegurando que la navegación existente y los claims en los componentes actualizados no disparen fallos críticos.
