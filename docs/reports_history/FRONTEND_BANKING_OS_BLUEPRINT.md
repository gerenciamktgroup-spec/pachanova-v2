# PachaNova Banking-Grade Frontend OS Blueprint

## 1. Executive Summary
El PachaNova Demo Mirror actual posee un Design System premium, validación E2E y pruebas unitarias exitosas, pero estructuralmente se comporta como un conjunto de páginas aisladas. Este Blueprint diseña la metamorfosis del front-end hacia un ecosistema integrado "Banking-Grade", habilitando flujos completos y navegables entre los diferentes roles (Inversor, Administrador, Fideicomiso, Operador Local) mediante una arquitectura `AppShell` consistente.

## 2. Problema Actual
- **Rutas Huérfanas:** Páginas como `/demo/integrations` o `/demo/reports` carecen de acceso orgánico desde los paneles.
- **Falta de Botones / CTAs:** Faltan acciones para extraer reportes de auditoría, ejecutar firmas multi-firma o desplegar comprobantes transaccionales.
- **Estados Inmaduros:** Ausencia generalizada de indicadores visuales (Empty States, Loading Skeletons, Error boundaries interactivos) al realizar cargas asíncronas.
- **Ausencia de Role-Based Navigation:** No existe un contenedor que exponga dinámicamente las herramientas según el actor interactuando con la demo.

## 3. Principios de Producto
1. **Veracidad Visual:** Nunca usar "Conectado" si la integración está apagada o simulada.
2. **Jerarquía Legal:** En el flujo de inversión y fideicomiso, el token *no* representa el suelo sino el *derecho de fideicomiso* (1 PACHA = 0.1 m²).
3. **Auditable UI:** Toda acción debe reflejarse en un `AuditLogView` o un `IntegrationStatusView`.
4. **Data-Type Strictness:** No exponer filas crudas de la BD. Todos los componentes consumirán "ViewModels" (Ej. `InvestorSummary`).

## 4. Route Map Completo (Route Registry)
El mapeo de la aplicación está unificado en `routeRegistry.ts`. Las rutas se dividen en 4 áreas funcionales (Roles):

| Path | Role | Status | Descripción |
|---|---|---|---|
| `/demo/showcase` | Public | Active | Hub Central de ingreso. |
| `/demo/design-system`| Public | Active | Playground visual y auditoría de UI. |
| `/dashboard/investor`| Investor | Active | Panel de propiedad (ProRataLandCard). |
| `/dashboard/investor/ledger`| Investor | Planned | Historial inmutable y transferencias simuladas. |
| `/dashboard/admin` | Admin | Active | Tesorería y resumen macro. |
| `/dashboard/admin/users` | Admin | Planned | CRM de Inversores y estatus KYC. |
| `/dashboard/admin/audit` | Admin | Planned | Logs de auditoría premium. |
| `/dashboard/fideicomiso` | Fiduciario | Active | Portal de operaciones institucionales. |
| `/demo/operator` | Operator | Active | Hard reset y health checks locales. |

## 5. Flujos Completos

### 1. Investor Flow
* **Entrada:** `/demo/showcase` -> Clic en "Investor View".
* **Dashboard:** Visualización del balance en el `MetricTile` y área proporcional `ProRataLandCard`.
* **Action:** Clic en "Adquirir Tokens (Simulado)". 
* **State:** Se muestra el `LoadingState`, se envía post al backend, se inserta registro en DB.
* **Feedback:** El balance se actualiza, la Card 3D brilla o recalcula geometría. Aparece un link hacia `/dashboard/investor/ledger`.

### 2. Admin Flow
* **Entrada:** `/demo/showcase` -> Clic en "Admin Console".
* **Dashboard:** Overview de tesorería y DataGrid de usuarios.
* **Navigation:** Usa el `MissionSidebar` para ir a Audit Logs.
* **Action:** Inspeccionar un hash particular (abre `UserDetailDrawer` o Modal de log).
* **CTAs:** Botón "Export CSV" que genera archivo de logs.

### 3. Fideicomiso Flow
* **Dashboard:** Ingresa a `/dashboard/fideicomiso`.
* **View:** Lee el `LegalTrustCard`.
* **Action:** Clic en "Nueva Operación Fiduciaria" -> Selecciona "Emisión Genesis".
* **Multi-Sig:** Requiere 2 firmas. El usuario presiona "Firmar como Representante 1". La UI muestra estado `1/2`.
* **Complete:** Clic en "Firmar como Representante 2". La UI habilita el botón "Ejecutar Operación".

## 6. AppShell Global
Se rediseñará `apps/web/src/app/layout.tsx` (o un layout interno `/dashboard/layout.tsx`) utilizando los componentes `MissionControl`:
- **`MissionShell`:** Contenedor maestro con máximo ancho (`max-w-7xl`).
- **`DemoStatusRibbon`:** Absolutamente siempre arriba.
- **`MissionHeader`:** Logo y links directos.
- **`MissionSidebar`:** Menú lateral responsivo. (Colapsable en mobile).
- **`RouteBreadcrumbs`:** Migas de pan bajo el Header para ubicación.

## 7. Component Map (Nuevos a implementar)
Dentro de `apps/web/src/components/product/`:
- `AppRouteCard`: Tarjetas visuales de navegación para Showcase.
- `TransactionReviewPanel`: Resumen de orden antes de confirmar compra simulada.
- `DataGrid`: Tablas paginadas premium para usuarios/logs.
- `TokenAmount` / `MoneyAmount`: Componentes puros para renderizar divisas.
- `AuditTimeline`: Timeline interactiva conectada a los AuditLogs reales de la DB.
- `UserDetailDrawer`: Slide-over lateral (Drawer) con la ficha KYC y Balance de un usuario.

## 8. Data Contracts (ViewModels)
Implementado en `apps/web/src/types/product.ts`.
- Garantiza strictness en TS. 
- Elimina mapeos sucios en los `.tsx`.
- Interfaces base: `TokenBalanceView`, `InvestorSummary`, `LedgerEntryView`, `AuditLogView`.

## 9. Copywriting Standard
Implementado en `apps/web/src/lib/copy/productCopy.ts`.
- Mantiene a la plataforma dentro del marco legal RWA.
- Regla cardinal: Si MercadoPago no está usando API Keys productivas, siempre es "Simulated". Si Foundry no está prendido, el contrato es "Pending Foundry".

## 10. Implementación por Fases (Próximos Pasos)
Esta auditoría da pie a una cadencia de ejecución segura que no romperá el Release Candidate actual:

- **FRONT-3B (AppShell + Registry):** Envolver todas las páginas existentes en el `MissionShell` global e integrar el `MissionSidebar` real. Refactor global visual.
- **FRONT-3C (Demo Routes Refactor):** Rediseñar Showcase, Walkthrough, Operator y Reports con el Design System, sin tocar Dashboards.
- **FRONT-3D (Dashboards):** Implementar Investor, Admin y Fideicomiso usando los `ViewModels` (`product.ts`).
- **FRONT-3E (Workflow Actions):** Agregar CTAs funcionales (Drawer de usuario, firmas multi-firma simuladas, botones de export).
- **FRONT-3F (QA & Polish):** Playwright E2E fix, validación de estado de integración MercadoPago y final RC Tag.

---
*Fin del Blueprint. Listo para ejecución FRONT-3B.*
