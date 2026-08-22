# PachaNova — Alcance de producto y rutas

Canon: `docs/PRODUCT_CANON.md`. Este archivo solo mapea rutas. Si hay conflicto, gana el canon.

Tokenización, RWA on-chain, P2P de fracciones, staking, DeFi y gobernanza DAO están **en cuarentena**. El código se conserva; la UI no los ofrece.

## 1. Matriz de rutas

| Path | Rol | Estado | Nota |
| --- | --- | --- | --- |
| `/` | Visitante | **ACTIVO** | Landing institucional |
| `/login` | Público | **ACTIVO** | |
| `/auth/register` | Público | **ACTIVO** | |
| `/como-funciona` | Público | **ACTIVO** | Cofinanciamiento, no token |
| `/preguntas-frecuentes` | Público | **ACTIVO** | |
| `/unauthorized` | Público | **ACTIVO** | |
| `/dashboard/investor` | Inversor | **ACTIVO** | Portafolio de participaciones |
| `/dashboard/investor/kyc` | Inversor | **ACTIVO** | |
| `/dashboard/investor/learn` | Inversor | **ACTIVO** | Educativo de cofinanciamiento |
| `/dashboard/investor/settings` | Inversor | **ACTIVO** | |
| `/dashboard/investor/wallet` | Inversor | **ACTIVO** | Capital / aportes (no wallet EVM) |
| `/dashboard/investor/borrow` | Inversor | **CUARENTENA** | DeFi |
| `/dashboard/investor/governance` | Inversor | **CUARENTENA** | DAO |
| `/dashboard/investor/marketplace` | Inversor | **CUARENTENA** | P2P fracciones |
| `/dashboard/investor/staking` | Inversor | **CUARENTENA** | |
| `/dashboard/admin` | Admin | **ACTIVO** | |
| `/dashboard/admin/kyc` | Admin | **ACTIVO** | |
| `/dashboard/admin/landbank` | Admin | **ACTIVO** | Hub de proyectos (landbanking + otros giros) |
| `/dashboard/admin/approvals` | Admin | **ACTIVO** | |
| `/dashboard/admin/audit` | Admin | **ACTIVO** | Trazabilidad |
| `/dashboard/admin/governance` | Admin | **CUARENTENA** | |
| `/dashboard/admin/treasury` | Admin | **CUARENTENA** | Tesorería token |
| `/dashboard/fideicomiso` | Interno | **ACTIVO** | Rol fiduciario/comité (interno, no producto público) |
| `/dashboard/client` | Cliente | **ACTIVO (shell)** | Comprador / arrendatario |
| `/dashboard/client/ofertas` | Cliente | **PLANIFICADO** | Fase 5 |
| `/dashboard/client/reservas` | Cliente | **PLANIFICADO** | Fase 5 |
| `/dashboard/client/contratos` | Cliente | **PLANIFICADO** | Fase 5 |
| `/dashboard/client/pagos` | Cliente | **PLANIFICADO** | Fase 5 |

## 2. APIs

### Activas (se mantienen)

- `/api/admin/kyc`
- `/api/admin/users`
- `/api/landbank`
- `/api/fideicomiso/status` y `/api/fideicomiso/audit`
- `/api/auth`
- `/api/mercadopago/*` (sandbox, para aportes/cuotas en Fase 7)

### Cuarentena (no se exponen en UI; no se expanden)

- `/api/admin/compliance`
- `/api/admin/distribute/batch`
- `/api/admin/treasury/liquidate`
- `/api/borrow`
- `/api/governance/*`
- `/api/p2p/*`
- `/api/treasury/*`
- `/api/yield/*`
- `/api/token-balance`
- `/api/oracle/valuation`
- `/api/perpetual`

## 3. Roles de producto

- `admin` — opera proyectos y la plataforma
- `investor` — cofinancia
- `client` — compra o arrienda el inmueble

Roles internos de código legado: `operator`, `fiduciario`, `comite`. No se promocionan como producto público.
