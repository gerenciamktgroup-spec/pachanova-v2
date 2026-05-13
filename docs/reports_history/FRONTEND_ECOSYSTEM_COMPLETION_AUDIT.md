# FRONTEND ECOSYSTEM COMPLETION AUDIT (FRONT-4)

## 1. Problemas de Duplicación de Shell
Se ha detectado una duplicación crítica de la arquitectura base de la interfaz de usuario, debido a que el componente `MissionShell` está siendo importado y renderizado tanto a nivel de `layout.tsx` como en las páginas individuales `page.tsx`.

| Ruta Afectada | Problema Encontrado | Fix Propuesto | Prioridad |
| --- | --- | --- | --- |
| `/dashboard/investor` | `MissionShell`, `MissionSidebar`, `MissionHeader` renderizados 2 veces. | Eliminar wrap de `MissionShell` en `page.tsx`. Depender de `app/dashboard/layout.tsx`. | P0 |
| `/dashboard/admin` | `MissionShell`, `MissionSidebar`, `MissionHeader` duplicados. | Eliminar wrap de `MissionShell` en `page.tsx`. | P0 |
| `/dashboard/fideicomiso` | `MissionShell`, `MissionSidebar`, `MissionHeader` duplicados. | Eliminar wrap de `MissionShell` en `page.tsx`. | P0 |
| `/demo/design-system` | `MissionShell` renderizado 2 veces. | Eliminar wrap de `MissionShell` en `page.tsx`. Depender de `app/demo/layout.tsx`. | P0 |

## 2. Rutas Faltantes (PLANNED) y Tareas de Completitud
Existen rutas definidas en el `routeRegistry` y requeridas por el ecosistema bancario institucional que actualmente no están implementadas y devuelven 404 o muestran botones bloqueados injustificadamente.

| Área | Ruta Requerida | Estado Actual | Fix Propuesto | Prioridad |
| --- | --- | --- | --- | --- |
| Investor | `/dashboard/investor/ledger` | 404 (Missing) | Implementar tabla histórica del ledger. | P1 |
| Investor | `/dashboard/investor/genesis` | 404 (Missing) | Implementar tracking de historial de inversión Genesis. | P1 |
| Investor | `/dashboard/investor/disclosures` | 404 (Missing) | Implementar portal legal/disclaimers. | P1 |
| Admin | `/dashboard/admin/users` | PLANNED (Missing) | Implementar DataGrid completo y KYC controls. | P1 |
| Admin | `/dashboard/admin/audit` | PLANNED (Missing) | Implementar visor de Audit Logs. | P1 |
| Admin | `/dashboard/admin/integrations` | PLANNED (Missing) | Mover y expandir dashboard de integraciones. | P1 |
| Admin | `/dashboard/admin/token-orders` | 404 (Missing) | Implementar visor de órdenes. | P1 |
| Fideicomiso | `/dashboard/fideicomiso/operations` | PLANNED (Missing) | Implementar panel de multisig proposals. | P1 |
| Fideicomiso | `/dashboard/fideicomiso/signatures` | 404 (Missing) | Implementar auditoría de firmas. | P1 |
| Fideicomiso | `/dashboard/fideicomiso/legal-backing` | 404 (Missing) | Mostrar detalles legales de terrenos y tokens. | P1 |
| Demo | `/demo/scenarios` | 404 (Missing) | Crear panel centralizado para inyectar estados demo. | P1 |
| Demo | `/demo/legal` | 404 (Missing) | Portal legal demo. | P2 |

## 3. Copywriting y Lenguaje (Banking-Grade)
- Existen etiquetas mixtas de idiomas en `routeRegistry` (`Investor Panel` vs `Panel Inversor`). **Fix:** Estandarizar a Español corporativo.
- Algunos botones podrían estar muertos o sin `href`. **Fix:** Implementar componente `SafeActionButton`.
- En `InvestorOverview`, el map fallback dice "MAP UI ENGINE DISABLED". **Fix:** Cambiar por Visualización 2D usando `ProRataLandCardV2`.

## 4. Conclusión de la Auditoría Previa
El proyecto necesita un saneamiento profundo en su capa de Routing y Componentes estructurales. El ecosistema es funcional a nivel acciones de mutación local, pero visualmente y experiencialmente incompleto. La Fase FRONT-4 resolverá esto estableciendo el estándar absoluto de producto terminado previo al despliegue.
