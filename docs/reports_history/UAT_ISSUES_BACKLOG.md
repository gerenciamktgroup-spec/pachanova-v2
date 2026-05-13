# UAT Issues Backlog

Durante la ejecución del UAT-1 Guiado (Business Demo), se han registrado los siguientes hallazgos y oportunidades de mejora menores. No se han encontrado bloqueadores (BLOCKER/HIGH).

| ID | Área | Ruta | Hallazgo | Severidad | Recomendación | Bloquea UAT |
|---|---|---|---|---|---|---|
| UAT-01 | Fideicomiso | `/dashboard/fideicomiso` | El panel de Fideicomiso es mayormente estático en la UI (solo muestra quorum 2/3 simulado en timeline). | LOW | Implementar botones de simulación de firma fiduciaria en la interfaz (actualmente cubierto vía API en tests). | NO |
| UAT-02 | Integraciones | `/demo/integrations` | MercadoPago aparece como `PENDING_CREDENTIALS` pero el usuario no técnico puede no saber qué significa. | LOW | Añadir un tooltip explicando que es un candado intencional de seguridad local. | NO |
| UAT-03 | Copy | `/dashboard/investor` | El balance de m² se muestra como `0.1 m²` por PACHA. Para compras pequeñas, puede mostrar muchos decimales. | LOW | Formatear visualización de metros cuadrados a máximo 4 decimales. | NO |
| UAT-04 | UX | `/dashboard/investor/marketplace` | No hay indicador visual de "Cargando" tras hacer clic en "Comprar PACHA" simulado en P2P (es instantáneo). | LOW | Agregar estado de `isSubmitting` al botón de compra P2P para mejor feedback visual. | NO |

## Resumen de Severidades
- **BLOCKER:** 0
- **HIGH:** 0
- **MEDIUM:** 0
- **LOW:** 4
