# PachaNova — Canon de producto (cofinanciamiento)

**Estado:** congelado 2026-08-22  
**Copia canónica:** `C:\Users\LENOVO\Desktop\labotarorio lihue\pachanova`  
**Repo:** `gerenciamktgroup-spec/pachanova-v2`  
**Rama de trabajo:** `product47-cofinanciamiento`  
**Tokenización / RWA on-chain / blockchain:** fuera de alcance hasta una fase posterior explícita.

Este documento manda sobre planes viejos, orquestadores, copys de “token”, y loops autónomos. Si hay conflicto, gana este archivo.

---

## 1. Qué es PachaNova ahora

PachaNova es una **plataforma de cofinanciamiento inmobiliario** con trazabilidad.

Sirve para estructurar, operar y auditar proyectos reales donde:

1. La empresa (o un SPV / fideicomiso) arma un proyecto.
2. **Inversores** aportan capital para cofinanciarlo.
3. El proyecto se ejecuta (compra de tierra, desarrollo, operación).
4. **Clientes** compran o arriendan el producto inmobiliario final.
5. Cada peso, documento, hito y aprobación queda registrado.

No es un exchange. No es un token. No es DeFi. No es un marketplace P2P de fracciones.

---

## 2. Giros del negocio (módulos)

Cada proyecto es de **un tipo**. El tipo define el ciclo, quién paga, quién cobra y qué ve cada rol.

| Tipo | Tesis | Qué hace el inversor | Qué hace el cliente | Cómo sale el dinero |
|---|---|---|---|---|
| **Landbanking** | Comprar tierra barata, madurar, vender cara | Cofinancia la compra y la tenencia | Compra el lote, parcela o paquete de salida | Venta del activo / plusvalía |
| **Edificio en venta** | Desarrollar o adquirir para vender unidades | Cofinancia el desarrollo | Compra departamento / local | Preventa y escrituración |
| **Edificio en alquiler** | Desarrollar o adquirir para renta | Cofinancia el activo en operación | Arrienda la unidad | Renta periódica + eventual venta |
| **Otros giros** | Hotel, mixto, servicios, etc. | Misma lógica de participación | Según el giro | Según contrato del proyecto |

La **trazabilidad** no es un giro: es la columna vertebral de todos.

Tokenización, secondary P2P, staking, gobernanza DAO y préstamos DeFi **no** son giros de esta etapa. Quedan en cuarentena.

---

## 3. Roles

Hay tres roles de producto. Fiduciario / comité / operador existen en código legado y se tratan como **roles internos de administración**, no como el producto público.

### 3.1 Administrador

Opera la plataforma y los proyectos.

**Puede**

- Crear y editar proyectos (tipo, ubicación, tesis, montos, hitos).
- Cargar y versionar el data room (títulos, tasaciones, contratos, planos, KML).
- Abrir / pausar / cerrar rondas de cofinanciamiento.
- Aprobar o rechazar KYC de inversores y clientes.
- Registrar aportes recibidos y marcarlos conciliados.
- Declarar hitos (compra de tierra, partida de obra, renta, venta).
- Cargar ofertas al cliente (unidades, lotes, alquileres).
- Registrar reservas, contratos y pagos de clientes.
- Distribuir resultados a inversores cuando el proyecto genera caja.
- Ver toda la auditoría. Override manual con motivo escrito.

**No puede (en esta etapa)**

- Mintear tokens, conectar wallets, liquidar on-chain.
- Prometer rentabilidad fija ni “propiedad tokenizada”.
- Borrar el historial de auditoría.

### 3.2 Inversor

Cofinancia proyectos. No es el comprador final del depto/lote, salvo que además se registre como cliente.

**Puede**

- Ver catálogo de proyectos abiertos a cofinanciamiento.
- Completar onboarding y KYC.
- Ver data room de proyectos en los que puede o ya participa.
- Comprometer / aportar capital a un proyecto (participación).
- Ver su posición: monto aportado, % económico, estado, hitos, documentos.
- Ver reportes y distribuciones de **sus** proyectos.
- Ver la trazabilidad de **su** dinero.

**No puede**

- Ver datos PII de otros inversores o clientes.
- Editar el proyecto.
- Aprobar KYC ajeno.
- Operar P2P, staking, borrow, gobernanza (cuarentena).
- Actuar como comprador/arrendatario sin rol cliente.

### 3.3 Cliente (comprador o arrendatario)

Usa el producto inmobiliario final. No cofinancia.

**Puede**

- Ver ofertas de lotes / unidades / alquileres publicados.
- Reservar una unidad o lote.
- Cargar identidad y documentos de compraventa / arrendamiento.
- Firmar / descargar su contrato.
- Pagar cuotas o renta según el esquema del proyecto.
- Ver estado de entrega, escrituración o vigencia de alquiler.
- Ver la trazabilidad de **su** operación.

**No puede**

- Ver cap table de inversores ni rendimientos del proyecto.
- Cofinanciar (eso es rol inversor).
- Administrar proyectos.

Un mismo humano puede tener **los dos roles** (inversor y cliente) con perfiles y paneles separados.

### 3.4 Visitante (público)

Landing, cómo funciona, FAQ, login/registro. Sin datos operativos.

---

## 4. Reglas por apartado

| Apartado | Admin | Inversor | Cliente |
|---|---|---|---|
| Catálogo de proyectos | CRUD, publicar, pausar | Ver publicados + detalle de tesis | No ve tesis de inversión; ve ofertas inmobiliarias |
| Data room | Carga, versiona, clasifica | Lectura de proyectos donde participa o está habilitado | Solo docs de **su** operación (minuta, contrato, boleta) |
| KYC | Aprueba / rechaza | Carga los suyos | Carga los suyos (comprador/arrendatario) |
| Aportes / participaciones | Conciliar, reversar con audit | Crear compromiso, ver estado | No aplica |
| Ofertas inmobiliarias | Publicar unidades/lotes/rentas | No compra desde este panel | Reservar y seguir |
| Reservas y contratos | Gestionar pipeline | No aplica | Ver y firmar los suyos |
| Pagos | Conciliar (pasarela o manual) | Aportes de capital | Cuotas / renta / inicial |
| Hitos del proyecto | Declarar evidencia | Lectura | Lectura solo si afecta su unidad (entrega) |
| Distribuciones | Calcular y ejecutar | Ver las suyas | No aplica |
| Auditoría / trazabilidad | Todo el sistema | Solo lo suyo | Solo lo suyo |
| Token / chain / P2P / DeFi / DAO | Oculto | Oculto | Oculto |

Copy institucional permitido: respaldo documental, estructura fiduciaria, derechos económicos sujetos a contrato, distribuciones sujetas al desempeño del activo, trazabilidad, auditoría.

Copy prohibido: garantizado, sin riesgo, liquidez asegurada, renta fija, ganancia garantizada, propiedad directa por token, 100% seguro.

---

## 5. Modelo de dominio (objetivo, no improvisar)

Fase 2 reconstruye el schema. Hasta entonces no se inventan tablas token.

Entidades canónicas:

1. **User** + **Role** (`admin`, `investor`, `client`; internos: `operator`, `fiduciario`, `comite`)
2. **Project** (tipo: `landbanking` \| `building_sale` \| `building_rent` \| `other`)
3. **ProjectDocument** (data room + hash + versión)
4. **Milestone**
5. **Participation** (inversor ↔ proyecto, monto, %, estado)
6. **CapitalTransaction** (aportes, devoluciones, distribuciones)
7. **Listing** (oferta al cliente: unidad, lote, renta)
8. **ClientOrder** (reserva / contrato / entrega)
9. **ClientPayment**
10. **AuditLog** (quién, qué, cuándo, motivo, entidad)

El schema actual (`properties.tokenPriceUsd`, `totalTokens`, P2P, stakes, votes) es **legado**. Se mantiene por compatibilidad. No se expande.

---

## 6. Qué está vivo vs cuarentena

### Vivo (se mejora, no se tira)

- Auth, landing, FAQ, cómo funciona
- Panel admin, KYC, aprobaciones, landbank/proyectos, audit, fideicomiso
- Panel inversor (portafolio, KYC, perfil, wallet de capital)
- Data room / documentos
- Trazabilidad (audit log)

### Cuarentena (código se queda, UI no lo ofrece)

- Token PACHA, wallet EVM, contratos Solidity
- Marketplace P2P de fracciones
- Staking, gobernanza DAO, préstamos DeFi, treasury on-chain
- Yield perpetuo, oráculos de chain, “verificación blockchain” como producto
- Loops autónomos 15/30/60 min que agregan features RWA/token

### Aún no existe y hay que construirlo (Fase 2+)

- Rol `client` de verdad (hoy solo shell)
- Catálogo de ofertas inmobiliarias
- Reservas / contratos / pagos de cliente
- Participación de inversor desacoplada de “tokens”
- Tipos de proyecto como primer ciudadano (no solo land tokenizado)

---

## 7. Copias que NO son canónicas

| Ruta | Qué es | Qué hacer |
|---|---|---|
| `Desktop\labotarorio lihue\pachanova` | Producto | **Única base** |
| `Desktop\pachanova-v2-git` | Mismo repo, `main` más viejo/distinto | No editar |
| `Desktop\pachanova-v2` | Fork Nest+Prisma+chain | Archivo |
| `Documents\GitHub\pachanovafullstack` | Orquestador, no app | No meter producto aquí |
| `Documents\laboratorio-lihue-core` | Hub Antigravity / orq | Consultar, no redefinir producto |

---

## 8. Cómo trabaja el agente (roles y automatización)

Asignados para esta reconstrucción:

| Rol del agente | Hace | No hace |
|---|---|---|
| **Arquitecto / Antigravity planner** | Canon, límites, plan por fases, issues | Features sueltas sin plan |
| **Fullstack executor** | Front + back de la fase activa | Reescribir todo el monorepo de un golpe |
| **Guardian de alcance** | Rechaza token/chain/P2P/DeFi hasta la fase que lo pida | “Ya que estamos, agrego yield” |
| **QA de flujos por rol** | Prueba admin / inversor / cliente al cerrar cada fase | Dar por bueno un screenshot |

Automatizaciones permitidas:

- Planes en `docs/plan_*.txt` + este canon
- Rama `product47-*`, PRs, nunca push directo a `main`
- Subagentes explore / implement / review **dentro de la fase activa**
- Tests del flujo de la fase

Automatizaciones **prohibidas hasta que el canon esté estable en producto** (Fase 4+):

- Schedulers 15/30/60 min
- Orquestadores que inserten yield, tokens, P2P, on-chain
- Loops “nunca pares” que inventen el siguiente feature

---

## 9. Plan por fases (no saltar)

| Fase | Qué | Criterio de salida |
|---|---|---|
| **0** | Canon escrito, copias congeladas, loops parados | Este archivo existe y es la fuente |
| **1** | Cuarentena UI token/chain; nav por 3 roles; shell cliente | Menú no ofrece DeFi/P2P/token; cliente tiene home |
| **2** | Dominio: Project / Participation / Listing / ClientOrder / Audit | Schema y APIs hablan cofinanciamiento, no tokens |
| **3** | Panel admin operable (CRUD proyecto, docs, hitos, KYC, conciliación) | Admin arma un proyecto landbanking de punta a punta |
| **4** | Flujo inversor (catálogo → KYC → aporte → posición → reporte) | Inversor recorre el ciclo sin ver tokens |
| **5** | Flujo cliente (oferta → reserva → contrato → pago → estado) | Cliente recorre el ciclo sin ver cap table |
| **6** | Trazabilidad unificada (timeline por entidad, exportable) | Cada movimiento tiene autor, documento y estado |
| **7** | Pagos sandbox (MercadoPago) para aportes y cuotas | Idempotente, con webhook y conciliación |
| **8** | Staging + UAT de los 3 roles | Build limpio, RLS, copy institucional |
| **Luego** | Tokenización / RWA / chain | Solo con decisión explícita nueva |

Fase 0 y Fase 1 se ejecutan juntas en esta entrega.

---

## 10. Decisiones cerradas (2026-08-22)

1. Canon de código: Laboratorio Lihue / pachanova.
2. Cliente = comprador o arrendatario del inmueble, no el inversor.
3. Tokenización y blockchain se trabajan después, no ahora.
4. Loops autónomos de token/yield/on-chain quedan parados.
5. Se puede reconstruir y optimizar, siempre contra este plan.
6. No push a `main`. No deploy a producción en estas fases.
7. Cuarentena = ocultar en UI, no borrar el código legado.
