# External Integrations Backlog

## 1. MercadoPago Sandbox
- **Estado actual:** `READY-BUT-PENDING-CREDENTIALS`
- **Prerequisitos:** Cuenta MP Developers.
- **Variables:** `MERCADOPAGO_ACCESS_TOKEN=TEST_...`, `MERCADOPAGO_PUBLIC_KEY=TEST_...`, `MERCADOPAGO_WEBHOOK_SECRET`
- **Criterio GO:** Webhook válido recibido y token_order marcada aprobada.
- **Riesgos:** Exposición del webhook real.
- **Rollback seguro:** `pnpm mp:sandbox:disable` (apaga variables).

## 2. Foundry / Anvil / Amoy
- **Estado actual:** `READY-BUT-PENDING-FOUNDRY`
- **Prerequisitos:** Instalación local de Foundry.
- **Variables:** `RPC_URL=http://localhost:8545`, `PRIVATE_KEY=0x...`, `TOKEN_ADDRESS=0x...`
- **Criterio GO CONDICIONAL:** Despliegue en Anvil local exitoso.
- **Criterio GO:** Despliegue en red testnet Amoy Polygon.
- **Criterio NO-GO:** Mainnet Deploy.
- **Riesgos:** Diferencia entre ledger local y blockchain.
- **Rollback seguro:** Apagar Anvil.

## 3. KYC Provider (Suma / SumSub)
- **Estado actual:** `SIMULATED`
- **Prerequisitos:** API Key Test del partner de KYC.
- **Variables:** `KYC_API_KEY`
- **Criterio GO:** Redirección iframe de SumSub.
- **Riesgos:** Ninguno en Sandbox.

## 4. Oracle Provider (Chainlink / Internal)
- **Estado actual:** `SIMULATED` (hardcode 0.1 ratio).
- **Prerequisitos:** Contrato Oracle alimentado.
- **Variables:** `ORACLE_RPC_URL`
- **Criterio GO:** Fetching real del NAV del Smart Contract.

## 5. AI Provider (OpenAI)
- **Estado actual:** `SIMULATED`
- **Prerequisitos:** API Key OpenAI/Gemini.
- **Variables:** `OPENAI_API_KEY`
- **Criterio GO:** AI Assistant responde en Dashboard.

## 6. Email Provider (Resend / SendGrid)
- **Estado actual:** `SIMULATED`
- **Prerequisitos:** Dominio verificado.
- **Variables:** `RESEND_API_KEY`
- **Criterio GO:** Email de confirmación de tokens llega a buzón test.

## Integración de Security Middleware
- [ ] **Protección Rate Limiter:** Implementar rate limiting (ej. Upstash Redis) para todas las rutas `/api/demo/*` antes de exponer el sandbox de forma pública, o bloquearlas por completo en despliegues Cloud.
- **Riesgo Actual:** `/api/demo/*` carece de mitigación nativa contra ataques DDoS volumétricos en capa aplicativo si se expone a internet.
