# Business Demo Manual UAT Checklist
**Versión:** PachaNova v2.0 Business Demo RC Local
**Fecha de Ejecución:** ______________
**Ejecutor:** ______________

Este documento define las pruebas manuales (Smoke Tests) necesarias para validar la demostración pedagógica del Modelo de Negocio de PachaNova sin conectividad externa ni uso de producción.

## Checklist de Smoke Test Manual

| ID | Ruta | Acción a realizar | Resultado Esperado | Evidencia Visual (Ej. "Ver Ledger") | Estado (PASS/FAIL) | Notas |
|:---|:---|:---|:---|:---|:---|:---|
| 1 | `/` (Landing) | Verificar explicación del modelo | Aparecen los 4 pasos operativos. | Se visualiza "Qué está simulado vs qué se conectará después". | [ ] | |
| 2 | `/demo/business-flow` | Navegar al Business Flow | Carga la página interactiva con los 6 pasos. | Interfaz de "Stepper" funcional. | [ ] | |
| 3 | `/dashboard/admin/users` | Admin aprueba KYC demo | Cambiar estado de "Pending" a "Approved". | Toast de éxito y KYC en verde para el usuario. | [ ] | |
| 4 | `/dashboard/investor` | Inversor simula depósito | Hacer clic en "Cargar Saldo Demo". | Saldo ficticio depositado con éxito. Balance en USD incrementa. | [ ] | |
| 5 | `/dashboard/investor/genesis` | Adquisición Genesis demo | Completar formulario y "Registrar intento demo". | Pantalla de confirmación con detalles de los tokens adquiridos. | [ ] | |
| 6 | `/dashboard/investor` | Revisar Portafolio (PACHA) | Navegar a inicio del panel de inversor. | Balance refleja correctamente la cantidad de PACHA adquirida. | [ ] | |
| 7 | `/dashboard/investor` | Revisar Portafolio (m²) | Verificar equivalencia visual. | Balance refleja la fracción correcta de m² correspondiente al PACHA. | [ ] | |
| 8 | `/dashboard/fideicomiso` (o DB) | Ledger muestra operación | Consultar timeline o registros inmutables. | Aparece el evento de `MINT_GENESIS` o `mint`. | [ ] | |
| 9 | `/dashboard/investor/marketplace` | Crear orden P2P demo | Ingresar cantidad y precio para vender y publicar. | Orden listada como "Abierta" en el marketplace local. | [ ] | |
| 10 | `/dashboard/investor/marketplace` | Comprar orden P2P demo | (Con otro usuario o el mismo si lo permite) Comprar PACHA listado. | Los tokens cambian de dueño, la orden pasa a `completed`. | [ ] | |
| 11 | `/dashboard/admin` | Admin ve orden/trade | Revisar registros de operaciones. | Trade registrado en el dashboard del Administrador. | [ ] | |
| 12 | `/demo/reports` | Audit logs de eventos | Revisar logs de auditoría. | Eventos P2P y Genesis constan con su respectivo "simulated_hash". | [ ] | |
| 13 | `/dashboard/fideicomiso` | Supervisión Institucional | Revisar el rol de Fideicomiso. | Existen quórums y trazas de las emisiones de tokens. | [ ] | |
| 14 | Múltiples rutas | No hay llamadas externas | Monitorear red en DevTools. | 0 llamadas a endpoints de MercadoPago, Foundry o APIs foráneas. | [ ] | |
| 15 | Múltiples rutas | Lenguaje No Productivo | Revisar copy de alertas y botones. | Uso consistente de "simulado", "demo", "sandbox". Sin promesa de ROI garantizado ni ofertas formales. | [ ] | |

## Instrucciones de Firma
Si todos los ítems resultan en PASS, el sistema está verificado y se confirma su estatus de **Business Demo RC Local**.
