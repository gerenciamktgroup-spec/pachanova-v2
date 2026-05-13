# Business Demo Release Candidate

## 1. Versión
**PachaNova v2.0 Business Demo RC Local**

## 2. Estados de Componentes
- **Business Model Demo Flow:** GO
- **KYC Demo Flow:** GO
- **Simulated Deposit:** GO
- **Genesis Demo Purchase:** GO
- **P2P Demo Marketplace:** GO
- **Admin Operations:** GO
- **Fideicomiso Role:** GO
- **Local Demo Acceptance:** GO
- **External Integrations:** READY-BUT-DISABLED
- **MercadoPago:** PENDING_CREDENTIALS
- **Contracts:** PENDING_FOUNDRY
- **Production/Staging:** NO-GO

## 3. Qué puede demostrar el sistema actual
- **Modelo Operativo:** Explicación pedagógica de los pasos de tokenización en la Landing y `/demo/business-flow`.
- **Adquisición Genesis Demo:** El flujo primario simulando compra de PACHA con KYC y depósito previos.
- **P2P Demo:** Un mercado secundario plenamente funcional sobre base de datos in-memory o SQLite/Postgres local, donde el Inversor lista órdenes y las transa simuladamente.
- **Ledger:** Trazabilidad inmutable simulada, validable en la DB de demo.
- **Auditoría:** Los registros de actividades se exponen en reportes para validación de transparencia.
- **Fideicomiso:** Rol administrativo con visualización de quórums institucionales para simular la emisión.
- **Admin Controls:** Aprobar KYC y marcar usuarios para revisión a nivel de backoffice.

## 4. Qué NO puede demostrar todavía
- **Pagos con dinero real (MercadoPago reales/Sandbox):** Deshabilitado hasta obtener y validar las credenciales correctas.
- **Smart Contracts conectados en on-chain (Foundry/Amoy):** Faltan despliegues.
- **KYC por proveedor real:** Se usa simulación interna para propósitos educativos.
- **Infraestructura Cloud privado / Staging / Producción:** Todo reside en localhost hasta asegurar integraciones.

## 5. Riesgos Conocidos
- **Test Paralelo Fideicomiso:** Documentado como limitación (dependencia de DB para quorum).
- **MercadoPago Pendiente:** El preflight está listo, pero faltan credenciales `TEST_` reales inyectables.
- **Foundry Pendiente:** Falta integración del RPC.
- **Cloud Pendiente:** Dependencia de empaquetar con Docker y subir a GCP.
- **Legal/Compliance Pendiente:** Todo texto en el sistema asume estado de prueba; si alguien interpreta como oferta real hay riesgo, de ahí los disclaimers.

## 6. Próxima fase recomendada
**UAT-1** antes de conectar MercadoPago/Foundry. Se sugiere ejecutar el `BUSINESS_DEMO_MANUAL_UAT_CHECKLIST.md` de forma guiada para recolectar feedback humano.
