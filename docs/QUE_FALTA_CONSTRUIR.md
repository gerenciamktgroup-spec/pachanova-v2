# Qué falta construir (fullstack)

Canon: `PRODUCT_CANON.md`. Esto es el hueco real, no el demo token.

Hoy hay **cáscaras de UI** (admin, inversor, fideicomiso, landing) al ~60–80% de una demo.  
No hay el producto de cofinanciamiento. El cliente es un shell. El schema habla de tokens.

Leyenda: **Hay** = existe y se puede reusar · **A medias** = pantalla o tabla, modelo incorrecto · **No hay** = hay que construir.

---

## 1. Cimientos (bloquea todo lo demás)

| Pieza | Estado | Qué construir |
|---|---|---|
| Un solo repo / una sola app | **Hay** | `apps/dashboard`. No abrir otras copias. |
| Roles `admin` / `investor` / `client` | **A medias** | Enum y seeds tienen admin/inversor. **Falta `client` en DB.** RBAC casi no está cableado (`requireRole` casi no se usa). |
| Schema de negocio | **No hay** | Hoy: `properties.tokenPriceUsd`, `totalTokens`, balances de token. Falta: `Project`, `Participation`, `Listing`, `ClientOrder`, `ClientPayment`, `CapitalTransaction`, `ProjectDocument`, `Milestone`, `AuditLog` usable. |
| Auth de verdad por rol | **A medias** | Login/registro existen. Falta: al entrar, mandar a su panel; bloquear API y páginas; un usuario puede ser inversor **y** cliente. |
| Copy institucional | **A medias** | Canon y learn ya no venden token. Landing y varios componentes holograma siguen en lenguaje RWA. |

**Entregable de esta capa:** migración + seeds de 3 roles + middleware que no deje al inversor en admin ni al cliente en cap table.

---

## 2. Administrador — operar proyectos

| Pieza | Estado | Qué construir |
|---|---|---|
| Alta de proyecto con **tipo** | **A medias** | Landbank hub existe, pero el tipo no es ciudadano: landbanking / edificio-venta / edificio-renta. |
| Data room (títulos, tasación, planos, KML, contratos) | **A medias** | Fideicomiso y docs sueltos. Falta versionado, clasificación, quién puede ver qué. |
| Ronda de cofinanciamiento | **No hay** | Abrir / pausar / cerrar meta de capital. No es “mint de tokens”. |
| KYC de inversores y clientes | **A medias** | Panel de aprobación existe. Falta cola unificada y estados por rol. |
| Conciliar aportes | **No hay** | Registrar transferencia/pasarela contra una participación. |
| Hitos del proyecto | **A medias** | Milestones en schema viejo. Falta declarar evidencia (compra de tierra, partida de obra, renta, venta). |
| Ofertas al cliente (lote / unidad / alquiler) | **No hay** | Inventario vendible o arrendable, distinto del cap table. |
| Pipeline de reservas y contratos | **No hay** | |
| Distribución a inversores | **A medias** | Yield token. Falta: caja real del proyecto → prorrateo por % de participación. |
| Override con motivo | **A medias** | Superadmin/orq. Falta audit simple: quién, qué, por qué. |

**Entregable:** un admin arma un landbanking (ej. Paracas) de cero: datos, docs, ronda, hitos. Sin hologramas ni P2P.

---

## 3. Inversor — cofinanciar

| Pieza | Estado | Qué construir |
|---|---|---|
| Catálogo de proyectos abiertos | **A medias** | Hay “marketplace” cuarentenado (P2P). Falta catálogo de **proyectos**, no de fracciones. |
| Ficha del proyecto (tesis, tipo, hitos, docs permitidos) | **A medias** | |
| KYC | **Hay** | Completar y conectar a poder aportar. |
| Compromiso + aporte de capital | **No hay** | Sustituye `genesis_purchases` / compra de token. |
| Posición: monto, %, estado, documentos | **A medias** | Hoy holdings en m²/tokens. |
| Reportes y distribuciones **suyas** | **A medias** | Números de orq/demo. Falta reporte ligado a `CapitalTransaction`. |
| Trazabilidad de su dinero | **No hay** | Timeline: aporte → conciliación → hito → distribución. |

**Entregable:** inversor recorre catálogo → KYC → aportar → ver posición. Cero tokens en pantalla.

---

## 4. Cliente — comprar o arrendar

| Pieza | Estado | Qué construir |
|---|---|---|
| Home del rol | **Hay** | Shell Fase 1. |
| Catálogo de ofertas inmobiliarias | **No hay** | Lotes, departamentos, alquileres publicados por admin. |
| Reserva | **No hay** | |
| Contrato (minuta / compraventa / arriendo) | **No hay** | |
| Pagos (inicial, cuotas, renta) | **No hay** | Distintos de los aportes del inversor. |
| Estado de entrega / escrituración / vigencia | **No hay** | |
| Trazabilidad de **su** operación | **No hay** | |

**Entregable:** cliente reserva un lote o una unidad, ve contrato y estado. No ve cap table.

---

## 5. Trazabilidad (columna de todos)

| Pieza | Estado | Qué construir |
|---|---|---|
| Audit log de verdad | **A medias** | Tabla existe; muchos eventos son teatro on-chain. |
| Timeline por entidad | **No hay** | Proyecto, participación, orden de cliente. |
| Hash/versión de documentos | **A medias** | Fideicomiso. Extender al data room y contratos de cliente. |
| Export (PDF/CSV) para un proyecto | **No hay** | |

---

## 6. Pagos y ops

| Pieza | Estado | Qué construir |
|---|---|---|
| MercadoPago sandbox | **A medias** | Código de preference/webhook. Falta: aporte de inversor **y** cuota/renta de cliente, idempotente, conciliado. |
| Carga manual de transferencia | **No hay** | Admin pega comprobante + monto + destino (proyecto o orden). |
| Notificaciones (mail) | **No hay** como producto | KYC, ronda abierta, reserva, distribución. |

---

## 7. Front público

| Pieza | Estado | Qué construir |
|---|---|---|
| Landing | **A medias** | Reescribir: cofinanciamiento, tres giros, tres roles. Sacar tesis token/PACHA/m². |
| Cómo funciona / FAQ | **A medias** | Alinear al canon. |
| App móvil | **No hay** | `apps/mobile` es stub. Fuera de alcance hasta que el web cierre Fase 5–6. |

---

## 8. Qué no construir ahora

- Smart contracts, wallet EVM, P2P de fracciones, staking, DAO, DeFi, “verificación blockchain”
- Orquestadores 15/30/60 min, yield perpetuo, hologramas PNC como producto
- Segunda app (Nest, MVP Vite, fullstack orq)
- App móvil

Eso está archivado o en cuarentena. Se reabre solo con decisión explícita.

---

## Orden de construcción (fullstack)

El orden no se salta. Cada fase cierra con un flujo de un usuario real, no con más pantallas demo.

1. **Dominio + RBAC** — tablas y 3 roles que el código respeta.
2. **Admin CRUD de proyecto** — los 3 tipos + data room + ronda.
3. **Inversor** — catálogo, aporte, posición.
4. **Cliente** — oferta, reserva, contrato, pago.
5. **Trazabilidad + conciliación** — un timeline por entidad y pagos sandbox.
6. **Landing + UAT de los 3 roles** — staging.

Estimación honesta: eso es el producto. Lo que hay hoy se **reusa como cáscara y auth**, no como modelo de negocio.
