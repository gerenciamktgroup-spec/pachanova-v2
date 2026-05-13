# Internal UAT Plan - PachaNova v2.0 Demo Mirror

## 1. Objetivo de la UAT
Validar integralmente el correcto funcionamiento, narrativa y aislamiento del entorno Demo Local antes de presentarlo formalmente a inversores internos o stakeholders. Se busca garantizar que la experiencia sea fluida y que no exista ningún riesgo de fuga de datos ni interacciones accidentales con producción.

## 2. Roles Participantes
- **Operador Demo:** Encargado de orquestar los scripts de levantamiento (`demo:up`, `demo:reset`, `demo:start`) y de conducir la presentación siguiendo el Runbook.
- **Inversor Interno:** Rol simulado para navegar el Dashboard del Inversor y verificar balances.
- **Admin Interno:** Rol simulado para verificar la vista de tesorería y logs de auditoría.
- **Fiduciario Demo:** Rol simulado para verificar el flujo multisig de aprobación.
- **Observador QA:** Encargado de registrar tiempos de carga, fallos de UI o mensajes ambiguos.

## 3. Alcance
- **Solo Demo Local:** La prueba se restringe a `localhost:3000` y al Postgres local (`localhost:5433`).
- **Sin transacciones financieras:** MercadoPago está desconectado o en modo offline simulado.
- **Sin blockchain real:** Smart Contracts se simulan vía base de datos relacional.
- **Sin servicios externos:** KYC, Oráculos, Email e IA están operando en modo Mock/Local.

## 4. Criterios GO / NO-GO
- **GO:** La plataforma arranca en menos de 2 minutos sin errores; todos los Dashboards cargan y muestran datos pre-sembrados; `demo:doctor` y `demo:acceptance` pasan al 100%. Los copys de la UI dejan explícito que es un entorno Demo.
- **NO-GO:** Cualquier fallo de compilación, error 500 en las API, exposición de variables de producción, o textos que afirmen que el dinero invertido es real.

## 5. Checklist antes de iniciar
- [ ] Docker Daemon corriendo.
- [ ] Variables de entorno revisadas (`DEMO_MODE=true` en `.env.demo`).
- [ ] Ejecución exitosa de `pnpm demo:doctor`.
- [ ] Ejecución de `pnpm demo:up` y `pnpm demo:reset`.

## 6. Checklist durante la demo
- [ ] `/demo/showcase` carga correctamente.
- [ ] Redirecciones funcionales hacia los Dashboards.
- [ ] El Investor Dashboard renderiza la `ProRataLandCard` 3D sin crasheos.
- [ ] El panel de Admin carga la tabla de Audit Logs.
- [ ] La matriz de Integraciones (`/demo/integrations`) exhibe los estados correctos (`PENDING_CREDENTIALS`, `PENDING_FOUNDRY`, etc).

## 7. Checklist después de la demo
- [ ] `pnpm demo:export-report` genera los artefactos sin filtrar secretos.
- [ ] `pnpm demo:down` apaga limpiamente los contenedores.
- [ ] Repaso con QA de los hallazgos.

## 8. Formato para Registrar Hallazgos
*Cualquier anomalía debe documentarse en el `INTERNAL_UAT_FINDINGS_REPORT.md` clasificándola por Severidad (BLOCKER, HIGH, MEDIUM, LOW) y proponer un fix.*
