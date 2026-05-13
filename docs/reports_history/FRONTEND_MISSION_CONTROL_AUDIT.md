# PachaNova v2.0 - Frontend Mission Control Audit & Blueprint

## 1. Diagnóstico Visual Actual
El estado actual de PachaNova Demo Mirror tiene un nivel arquitectónico sólido bajo Next.js 15, Tailwind v4, y React Three Fiber. Sin embargo, la capa visual sufre de alta fragmentación e inconsistencia en sus directrices de diseño. La falta de un "Design System" unificado hace que la interfaz se sienta fragmentada (ej. `AdminDashboard` usa `bg-[#0A0A0A]`, mientras que `ShowcasePage` usa `bg-gray-900` y `FideicomisoPage` `bg-black`). 

## 2. Problemas Críticos
- **Inconsistencia Temática:** Mezcla de Light y Dark mode no controlada entre páginas. Fideicomiso no tiene estilos definidos.
- **Fragmentación de Paleta:** Se combinan estilos raw de tailwind (`bg-gray-900`, `text-blue-400`) con códigos hex hardcodeados (`bg-[#0A0A0A]`).
- **Navegación Ausente:** No existe una barra de navegación (NavBar) global ni menús laterales (Sidebars) consistentes para facilitar el cambio entre paneles institucionales.
- **Micro-interacciones Pobres:** Salvo el efecto hover en el Showcase, no hay transiciones animadas ni feedback visual contundente entre estados (loading, vacíos, erroes).
- **Glass-card Aislada:** El componente `GlassCard` se usa en algunos dashboards pero no forma parte de una jerarquía de sistema global.
- **Páginas Huérfanas:** `FideicomisoPage` es solo un texto sin estructura.

## 3. Nuevo Concepto Visual: “PachaNova Mission Control”
El nuevo concepto "Mission Control" elevará el estándar hacia un look and feel **Ultra-Premium, Dark Mode nativo y de Grado Institucional FinTech**. Se asemejará a la terminal de control de un operador financiero o plataforma RWA (Real World Assets) de alto perfil, priorizando los contrastes absolutos (Negros profundos), tipografías monoespaciadas para métricas, acentos de luz neón sutil y componentes con alto nivel de `backdrop-blur`.

## 4. Design Principles
1. **Institutional Dark-First:** El entorno oficial de control será exclusivamente Dark Mode para transmitir sofisticación y reducir la fatiga visual en la lectura de datos numéricos.
2. **Glassmorphism Funcional:** Usar fondos semi-transparentes sobre negros profundos para separar jerarquías sin saturar de bordes grises.
3. **Data-Centric:** Los números (PACHA, m², USD) son los héroes. Deben ser grandes, legibles y preferiblemente usar fuentes monoespaciadas (`Geist_Mono`).
4. **Clear Boundaries:** Cada módulo debe verse encapsulado y auditable, utilizando "Cards" uniformes.

## 5. Paleta Propuesta
- **Background:** `#000000` (Pitch Black) para el layout principal y `#0A0A0A` (Midnight) para fondos de contenedores.
- **Surface (Cards):** `rgba(255, 255, 255, 0.03)` con `backdrop-blur-xl`.
- **Borders:** `rgba(255, 255, 255, 0.1)` en modo reposo; `rgba(255, 255, 255, 0.2)` al interactuar.
- **Primary Accent:** `#10B981` (Emerald 500) para métricas de valor, confirmaciones y tokenización activa.
- **Secondary Accent:** `#3B82F6` (Blue 500) para métricas informativas y enlaces.
- **Text:** `#EDEDED` (High emphasis), `#A3A3A3` (Medium emphasis), `#525252` (Low emphasis).

## 6. Tipografía Propuesta
Usaremos estrictamente las fuentes ya importadas en Next.js por su estética moderna y excelente legibilidad de números:
- **Display & Body:** `Geist Sans` (San Francisco/Inter feel).
- **Métricas, Tokens, Direcciones, Logs:** `Geist Mono`.

## 7. Component Inventory
Componentes base a consolidar y rediseñar:
- `MissionControlLayout`: Layout global con NavBar y Sidebar/Command Menu.
- `PremiumGlassCard`: Evolución del `GlassCard` actual con mejor control de gradientes y bordes de 1px.
- `MetricWidget`: Componente estándar para mostrar (Etiqueta + Valor numérico + Badge de variación).
- `DataGrid`: Tabla premium unificada para Logs de Auditoría, Inversores e Integraciones.
- `StatusBadge`: Badges estandarizados (`🟢 ACTIVE`, `🟡 SIMULATED`, `⚪ PENDING`).

## 8. Page-by-page Redesign Plan
1. **Layout Global (`/layout.tsx`):** Añadir una Navbar global pegada al tope superior con el logotipo PachaNova, enlace rápido a Showcase y el `DemoBanner` rediseñado de forma elegante.
2. **Showcase (`/demo/showcase`):** Transformar en el menú de acceso "Mission Control". Estilo grid estilo Dashboard de Vercel/Stripe.
3. **Investor Dashboard (`/dashboard/investor`):** Integrar la `ProRataLandCard` a la izquierda y el widget de compra/status a la derecha. Consolidar el fondo a Negro puro.
4. **Admin Dashboard (`/dashboard/admin`):** Convertir las tablas crudas de `Inversores` y `Audit Logs` en un DataGrid premium con fuentes monoespaciadas para timestamps y hashes.
5. **Fideicomiso (`/dashboard/fideicomiso`):** Diseñar la UI completa simulando la firma multi-firma (Multi-Sig), mostrando el estado "2/3 firmas pendientes" con un visualizador de progreso estético.
6. **Integrations (`/demo/integrations`):** Presentar la matriz en un layout de "Connection Terminal" con luces de estado.

## 9. Copywriting Plan
Garantizar consistencia y erradicar ambigüedad legal:
- No más de una mezcla de inglés y español (Consolidar español corporativo con jerga técnica en inglés).
- Siempre mostrar: "1 Token = 0.1 m²", "US$ 8.40".
- Estandarizar claims aprobados: "Simulated", "External-ready", "No production".

## 10. Motion/Animation Strategy
- **Framer Motion:** Integrar `layout` animations para reordenamiento de tablas. Animaciones de entrada (Fade-in-up) sutiles (duración: 0.3s) al cargar los Dashboards.
- **Micro-interacciones:** Hover effects en botones e items de menú usando transiciones tailwind de escala (`hover:scale-[1.02]`).

## 11. 3D Strategy
- Mantener `React Three Fiber` en `ProRataLandCard`.
- Reducir el parpadeo de carga: Añadir un estado de carga "Esqueleto (Skeleton)" estilizado que iguale la geometría aproximada mientras el modelo GLTF descarga.
- Mejorar la luz ambiental del canvas para integrarse a la paleta Dark-First.

## 12. Accessibility Plan
- Contrast Ratio estricto (Textos High emphasis sobre fondos oscuros).
- Todo botón y enlace debe ser navegable por teclado (`tabindex` coherente y focus rings `focus:ring-emerald-500`).

## 13. Mobile/Responsive Plan
- Los dashboards deben fluir de 3 columnas (Desktop) a 1 columna (Mobile).
- La vista de tabla (Admin/Logs) debe contar con desplazamiento horizontal oculto (`overflow-x-auto`) con una sombra indicadora.
- El canvas 3D debe reescalar dinámicamente (`width: 100%, aspect-ratio: 1/1` en mobile).

## 14. Performance Plan
- Utilizar Server Components donde no se requiera interactividad para aligerar la hidratación en el cliente.
- Suspense boundaries para que las llamadas API `/api/admin/...` muestren Skeletons inmediatos en lugar de un `loading` estático que bloquea el pintado de la Card de contenedor.

## 15. Tests Necesarios
- Modificar suite E2E de Playwright si el rediseño altera text-labels de los botones de interacción ("Comprar Tokens" -> "Adquirir Tokens").
- Tests visuales para constatar que el NavBar no oculta contenido crítico.

## 16. Lista Exacta de Archivos a Modificar
1. `apps/web/src/app/globals.css` (Para inyectar Design System variables).
2. `apps/web/src/app/layout.tsx` (Inyección de Navbar).
3. `apps/web/src/components/ui/glass-card.tsx` (Rediseño de componente core).
4. `apps/web/src/components/ui/metric-widget.tsx` (NUEVO).
5. `apps/web/src/components/ui/status-badge.tsx` (NUEVO).
6. `apps/web/src/components/ProRataLandCard.tsx` (Update de estilo y Skeleton de R3F).
7. `apps/web/src/app/demo/showcase/page.tsx`
8. `apps/web/src/app/dashboard/investor/page.tsx`
9. `apps/web/src/app/dashboard/admin/page.tsx`
10. `apps/web/src/app/dashboard/fideicomiso/page.tsx`
11. `apps/web/src/app/demo/integrations/page.tsx`
12. `apps/web/src/app/demo/operator/page.tsx`
13. `apps/web/src/app/demo/reports/page.tsx`
14. `apps/web/src/app/demo/walkthrough/page.tsx`
15. `apps/web/tailwind.config.ts` o equivalente de Tailwind v4 en CSS.
