# PachaNova v2.0 - Frontend Design System

## 1. Concepto Visual
"Mission Control" es un ecosistema visual diseñado para plataformas RWA institucionales. Utiliza una estética **Dark-First**, sobria, territorial y altamente legible. Su objetivo es transmitir seguridad legal y tecnológica.

## 2. Design Tokens
Los tokens están inyectados en `apps/web/src/app/globals.css` bajo la directiva `@theme inline` de Tailwind v4.

- `--pn-bg`: `#050505` (Pitch Black) - Fondos de página.
- `--pn-bg-soft`: `#0A0A0A` (Midnight) - Fondos secundarios.
- `--pn-surface`: `rgba(255, 255, 255, 0.035)` - Background principal para Cards.
- `--pn-border`: `rgba(255, 255, 255, 0.10)` - Bordes pasivos.
- `--pn-gold` / `--pn-sand` / `--pn-terracotta`: Paleta territorial para métricas Genesis.
- `--pn-sage` / `--pn-blue`: Paleta tecnológica.

## 3. Componentes Principales (`components/mission/`)
- `MissionShell`: Wrapper maestro responsivo.
- `MissionHeader` & `MissionSidebar`: Navegación estandarizada.
- `MissionCard`: Componente atómico con backdrop-blur y variantes (`default`, `elevated`, `warning`).
- `MetricTile`: Componente para Data Display usando fuentes monoespaciadas.
- `RiskBadge` / `IntegrationStatusBadge`: Semántica estricta visual para estados.
- State Components: `LoadingState`, `ErrorState`, `EmptyState`, `DataState`.

## 4. Uso Correcto
- Usar siempre `.pn-card` o `MissionCard` para encapsular datos.
- Usar `Geist_Mono` (via `.pn-mono`) para USD, PACHA, m², timestamps y hashes.

## 5. Uso Incorrecto
- No inyectar `bg-black`, `bg-gray-900` u otros hardcodes en los componentes futuros.
- No utilizar botones gigantes ni sombras (Drop-shadows) pesadas. La profundidad se logra con `border` y `backdrop-blur`.

## 6. Copy Approved
- "Demo local", "External-ready", "Ready-but-disabled", "Pending credentials", "Pending Foundry", "Simulated", "No production connections".
- Unidades estrictas: "1 PACHA = 0.1 m²", "500,000 PACHA", "50,000 m²".

## 7. Claims Prohibidos
- "production-ready", "mainnet", "dinero real", "rentabilidad garantizada", "sin riesgo", "token real", "on-chain real", "MercadoPago conectado", "contratos conectados".

## 8. Responsive Rules
El `MissionShell` y `MissionCard` son full-width en mobile, adaptando `flex-col` mediante clases utilitarias estándares.

## 9. Accessibility
Uso de `focus-visible` (vía utilitario `.pn-focus`) para soporte de tabulación. 

## 10. Motion Rules
- Consumir animaciones desde `motion.ts` (`fadeInUp`, `softScale`).
- Respetar durations de 0.2s - 0.35s para mantener el tono "FinTech Snappy".

## 11. Próxima Fase: FRONT-3 Demo Routes
Implementar este Design System refactorizando progresivamente las rutas `/dashboard/investor`, `/dashboard/admin`, y `/dashboard/fideicomiso`.
