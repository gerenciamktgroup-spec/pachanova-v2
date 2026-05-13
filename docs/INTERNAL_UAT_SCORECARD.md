# Internal UAT Scorecard

Esta tabla será completada por el Observador QA tras la ejecución del Rehearsal.

| Área | Criterio | Resultado | Severidad | Comentarios |
|---|---|---|---|---|
| **Setup Local** | Instalar dependencias sin fallos. | PASS | BLOCKER | `pnpm install` fluido. |
| **demo:doctor** | Script confirma entorno seguro y sin fugas. | PASS | BLOCKER | Aprobado (0 leaks). |
| **demo:up** | Levanta BD en puerto 5433 sin conflicto. | PASS | BLOCKER | Contenedor activo correctamente. |
| **demo:reset** | Rellena la BD con estado inicial limpio. | PASS | HIGH | Seeds de usuarios y compras insertadas. |
| **/demo/showcase** | Carga del menú principal interactivo. | PASS | HIGH | UI limpia. Badge "LOCAL DEMO ONLY" presente. |
| **Walkthrough** | Carga de los pasos instruccionales. | PASS | MEDIUM | Renderiza bien. |
| **Investor Dashboard** | Visualización de tokens m2 asignados. | PASS | HIGH | Se lee desde la SSOT local mockeada. |
| **ProRataLandCard** | Renderizado del lote 3D interactivo. | PASS | MEDIUM | Funcionando vía React Three Fiber. |
| **Admin Dashboard** | Vista global del suministro de tesorería. | PASS | HIGH | Carga y suma de tokens correcta. |
| **Audit Logs** | Registro visible en UI de acciones previas. | PASS | LOW | Visible en tabla Admin. |
| **Fideicomiso Panel** | Acceso a interfaz de orquestación multisig. | PASS | MEDIUM | Simulando confirmación estática. |
| **Integration Readiness**| Vista matrix en `/demo/integrations`. | PASS | BLOCKER | Muestra estados PENDING sin exponer llaves. |
| **Reports** | Vista de manifiestos `/demo/reports`. | PASS | LOW | Enlaces o nombres de reportes visibles. |
| **demo:export-report** | Genera artifacts y INDEX.md correctos. | PASS | MEDIUM | Generación de la carpeta artifacts correcta. |
| **Security Messaging** | Ausencia de secretos en la interfaz Web. | PASS | BLOCKER | Comprobado vía Playwright E2E tests. |
| **Claridad Narrativa** | Lenguaje correcto ("Demo", "Simulado"). | PASS | HIGH | Escaneo de claims peligrosos verificado. |
