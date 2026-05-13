# PachaNova V2.0 - Public Website Expansion Plan

## Visión Arquitectónica
La web pública dejará de ser una landing de una sola página y pasará a ser un hub educativo que prepare a los visitantes (sin perfil técnico o legal) para comprender el entorno Demo Mirror. 

## Estructura de Rutas y Priorización

### Prioridad P0 (Implementación Inmediata - UX-2)

1. **`/como-funciona`**
   - **Objetivo:** Explicar el ciclo de vida RWA en el contexto de PachaNova usando un lenguaje digerible.
   - **Componentes:** `HowItWorksSteps` (Timeline visual), `ExplainerSection`.
   - **Contenido:**
     - Qué es PachaNova y RWA.
     - Qué rol juega PACHA y el Fideicomiso.
     - Cómo el Ledger registra inmutablemente.
     - Claridad sobre lo que está simulado y lo que está pendiente.

2. **`/preguntas-frecuentes`**
   - **Objetivo:** Resolver dudas inmediatas y eliminar riesgos de "misunderstanding" sobre inversiones.
   - **Componentes:** `FAQAccordion`.
   - **Preguntas clave:** ¿Puedo hacer pagos?, ¿Qué representa PACHA?, ¿Qué significa Pending credentials?, ¿Esto es producción?, ¿Qué falta para Sandbox externo?

### Prioridad P1 (Next Steps - Post UX-2)

3. **`/activo-san-bartolo`**
   - Visualización de Pro-Rata (5 ha, 50,000 m², 500,000 PACHA).
   - Equivalencia matemática detallada (1 PACHA = 0.1 m²).

4. **`/fideicomiso`**
   - Explicación de Trust Anchors, multi-sig demo y quórum 2/3.

5. **`/seguridad-y-auditoria`**
   - Muestra visual del flujo de Webhooks, Ledger Local e Integration Events sin exposición productiva.

### Prioridad P2 (Futuro)

6. **`/data-room`**
   - Hub de reportes públicos (Project Inventory, Acceptance Reports, Gap Analysis).

## Integración P0 en Landing Page `/`
Se agregarán las siguientes secciones a `apps/web/src/app/page.tsx`:
- **"Cómo leer este demo"**: Un manual rápido en la página principal para setear expectativas.
- **"Qué está simulado vs. Qué se conectará después"**: Badges visuales explicando el aislamiento.
- **"CTAs Educativos"**: Botones de "Entender la Arquitectura" dirigiendo a `/como-funciona`.
