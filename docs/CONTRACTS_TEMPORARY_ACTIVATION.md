# Smart Contracts - Activación Temporal

Este documento detalla el procedimiento oficial y seguro para enlazar el entorno **Demo Mirror** a una instancia local de **Foundry (Anvil)** o una Testnet configurada, activando la firma real y las interacciones Web3.

## Requisitos Previos
- **Foundry/Anvil** instalado localmente.
- Los scripts de despliegue en `packages/contracts/script/DeployDemo.s.sol`.
- Proyecto web levantado localmente.

## Activación
1. **Levantar Anvil:** En una terminal, ejecuta:
   ```bash
   anvil --chain-id 31337
   ```
2. **Despliegue Local:** Ejecuta el script de Foundry para desplegar los contratos mock en Anvil.
   ```bash
   forge script script/DeployDemo.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
   ```
3. **Extraer Direcciones:** El paso anterior generará un JSON de salida o logs con las direcciones de los contratos (Token, Identity, Compliance, etc).
4. **Actualizar `.env.demo.local`:**
   ```env
   DEMO_PROFILE=connected
   CONTRACTS_EXTERNAL_ENABLED=true
   RPC_URL=http://127.0.0.1:8545
   CHAIN_ID=31337
   CONTRACT_TOKEN_ADDRESS=0x...
   CONTRACT_IDENTITY_ADDRESS=0x...
   ```
5. **Reinicio y Verificación:** Reinicia el servidor web. Al ingresar a `/demo/integrations`, el estado de `contracts` debe mostrar `CONNECTED` en lugar de `SIMULATED` o `PENDING_DEPLOY`.

## Desactivación
Para volver a usar los validadores mockeados y desenganchar Web3:
1. Edita `.env.demo.local`:
   ```env
   DEMO_PROFILE=offline
   CONTRACTS_EXTERNAL_ENABLED=false
   ```
2. Cierra el proceso de `anvil`.
3. Borra las direcciones de los contratos de las variables de entorno para evitar confusiones futuras.

## Aclaraciones
- Si intentas conectarte a **Mainnet** (ej. Polygon o Ethereum real) con el flag `DEMO_MODE=true` activado, la validación de entorno arrojará error y bloqueará las transacciones financieras para proteger los fondos reales.
