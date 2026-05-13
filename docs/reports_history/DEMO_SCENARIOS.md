# Demo Scenarios

El Demo Mirror incluye un **Control Room** (`/demo/control-room`) y scripts CLI (`pnpm demo:scenario:*`) para cambiar el comportamiento del entorno:

- **`demo:scenario:happy`**: Inyecta saldo, kyc aprobado y flujos exitosos.
- **`demo:scenario:kyc-pending`**: Simula que el IdentityRegistry y el sistema off-chain no han aprobado al usuario. La compra se bloquea.
- **`demo:scenario:rejected-payment`**: El webhook simula o dispara un evento `rejected`.
- **`demo:scenario:duplicate-webhook`**: Dispara intencionalmente el mismo `mp_payment_id`. El ledger verificará idempotencia y no otorgará saldo doble.

Para ejecutar los escenarios guiados manualmente, navega a `http://localhost:3000/demo/walkthrough`.
