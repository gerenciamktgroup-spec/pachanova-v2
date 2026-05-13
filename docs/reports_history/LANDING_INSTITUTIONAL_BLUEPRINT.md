# LANDING INSTITUTIONAL BLUEPRINT (FASE LANDING-1)

## 1. Objetivo de la Landing
Actuar como la puerta de entrada premium y corporativa al ecosistema **PachaNova v2.0 Demo Mirror**. Debe explicar claramente la tesis de Real World Assets (RWA), el modelo de tokenización del proyecto "San Bartolo", y proporcionar puntos de acceso directos (Mission Control) hacia las vistas internas simuladas (Investor, Admin, Fideicomiso), dejando claro en todo momento que se trata de un entorno Sandbox local sin conexión a producción.

## 2. Audiencia
- **Inversores Internos:** Interesados en visualizar la experiencia de usuario y el flujo de adquisición de activos.
- **Aliados Estratégicos:** Partners tecnológicos o financieros evaluando la solidez de la arquitectura (Next.js, Drizzle, Playwright).
- **Fiduciario / Compliance:** Auditores verificando la estricta adherencia a los disclaimers, mitigación de riesgos legales y separación de entornos (cero productivo).
- **Operadores Demo:** Presentadores técnicos que usarán la landing como punto de partida unificado para mostrar las capacidades de la plataforma.

## 3. Arquitectura de Información
La landing será una página única (Single Page Application flow) estructurada de forma secuencial, llevando al usuario desde la propuesta de valor macro (RWA) hasta la demostración técnica específica de la arquitectura PachaNova.
- **Header:** Navegación ancla (Concepto, Activo, Arquitectura) y CTA global "Acceder al Demo".
- **Body:** Flujo narrativo vertical intercalado con visualizaciones 2D o renders.
- **Footer:** Links legales, reporte de integraciones, versión técnica.

## 4. Secciones Propuestas
1. **Hero:** Título imponente, subtítulo aclarando el estado "Demo Mirror", y botones primarios para ingresar a la vista de inversor o admin.
2. **Qué es PachaNova:** Explicación del modelo de fraccionalización RWA bajo marco legal fiduciario.
3. **Activo San Bartolo:** Datos simulados de la propiedad subyacente (Superficie total, valuación).
4. **1 PACHA = 0.1 m²:** Explicación matemática de la unidad de medida y paridad del token.
5. **Fideicomiso Demo:** Introducción al panel multi-sig y al control operativo simulado.
6. **Ledger y Auditoría:** Explicación de la trazabilidad y la vista de consola Admin.
7. **Integraciones external-ready:** Mención técnica a la arquitectura modular (MercadoPago `PENDING_CREDENTIALS`, Smart Contracts `PENDING_FOUNDRY`).
8. **Accesos por rol:** Tarjetas tipo "Mission Card" con accesos directos a `/dashboard/investor`, `/dashboard/admin`, `/dashboard/fideicomiso`.
9. **Data room/reportes:** Acceso a los reportes de aceptación y documentación técnica generados.
10. **Disclaimers:** Sección destacada recalcando el entorno sandbox y la simulación.
11. **CTA final:** Invitación a comenzar el "Walkthrough".

## 5. Copywriting Aprobado
- **Tono:** Corporativo, bancario, sobrio, técnico.
- **Términos Permitidos:** "Sandbox Local", "Demo Mirror", "Módulo Inversor", "Consola Admin", "Tesis RWA", "Trust Anchor", "Arquitectura External-Ready".
- **Aclaraciones Obligatorias:** "Esta es una demostración de software." "Las operaciones no generan impacto on-chain."

## 6. Claims Prohibidos
- 🚫 "Production-ready" o "Listo para producción".
- 🚫 "Dinero real", "Compra ahora", "Invierte tu dinero".
- 🚫 "Rentabilidad garantizada", "Riesgo cero", "Altos retornos".
- 🚫 "Conectado a mainnet" o referencias a tokens reales.

## 7. Componentes Necesarios (Reutilizando el Design System)
- `MissionShell` y `MissionHeader` adaptados o un layout propio `LandingLayout`.
- `SafeActionButton` y `CommandButton` para todos los CTAs.
- `RiskBadge` y `IntegrationStatusBadge` para mostrar estados (PENDING_FOUNDRY, READY-BUT-DISABLED).
- `MetricTile` para las estadísticas simuladas del Activo San Bartolo.

## 8. Rutas de Destino (Enrutamiento del App)
Los CTAs de la landing apuntarán estrictamente a las siguientes rutas pre-existentes y validadas:
- `/dashboard/investor`
- `/dashboard/admin`
- `/dashboard/fideicomiso`
- `/demo/showcase`
- `/demo/walkthrough`

## 9. Diseño Responsive
- **Mobile (390px):** Menú hamburguesa (si aplica) o header simplificado. Stacking vertical de las "Mission Cards" de acceso.
- **Tablet (768px):** Grillas de 2 columnas para beneficios y roles.
- **Desktop (1440px):** Layout extenso aprovechando márgenes, manteniendo anchos máximos (`max-w-7xl`) para legibilidad institucional.

## 10. Plan de Implementación LANDING-2
1. **P0 (Setup):** Crear layout público `apps/web/src/app/(public)/layout.tsx` (si no existe) para aislarlo de los dashboards.
2. **P1 (Core Blocks):** Desarrollar en `page.tsx` el Hero, la sección de concepto RWA (San Bartolo) y la explicación del token.
3. **P2 (Gateways):** Implementar la grilla de accesos (Mission Cards) apuntando a los 3 dashboards principales y a la suite de demo.
4. **P3 (Disclaimers & Footer):** Consolidar la barra de compliance inferior.
5. **P4 (QA):** Re-correr la pipeline completa (`demo:acceptance`).

## 11. Tests E2E Necesarios
- **Carga de Landing:** Verificar HTTP 200 en `/`.
- **Navegación:** Comprobar que los botones redirigen correctamente a `/dashboard/investor`, `/dashboard/admin`, `/demo/walkthrough`.
- **Responsive:** Test de captura y de visualización en Mobile, comprobando que las mallas de CSS colapsen correctamente.
- **Compliance:** Comprobar que no se escapen palabras clave prohibidas en el renderizado final.

## 12. Riesgos Legales / Compliance
- **Riesgo:** Un tercero puede confundir la landing con una solicitud activa de capital o inversión.
- **Mitigación:** Presencia perpetua de un `DemoStatusRibbon` o banner superior indicando el modo Sandbox. Uso intensivo de la palabra "Simulación".
- **Riesgo:** Entidades regulatorias rastreando promesas de retorno.
- **Mitigación:** Estricto chequeo de palabras (Cero menciones a tasas de interés, rendimiento o TNA).
