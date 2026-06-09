# Flujograma del Cliente (Fricción Cero RWA)

Este diagrama detalla el viaje de un inversor retail en PachaNova V2.0, desde el registro hasta la visualización de su portafolio, abstrayendo toda la complejidad de la blockchain.

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as Inversor Retail
    participant NextJS as Frontend (Dashboard)
    participant Auth as Supabase Auth & DB
    participant Hono as Orquestador (API Hono)
    participant Fiat as Pasarela Fiat (Stripe/MP)
    participant SC as Smart Contract (ERC-3643)

    Cliente->>NextJS: 1. Registro / Login con Email
    NextJS->>Auth: Crea sesión JWT
    NextJS->>Cliente: Muestra panel (KYC Pendiente)
    
    Cliente->>NextJS: 2. Sube documentos KYC
    NextJS->>Auth: Guarda documentos (kyc_documents)
    
    Note over Hono: Backoffice aprueba KYC manualmente
    Hono->>Auth: 3. Actualiza estado a "approved"
    Hono->>Hono: 4. Genera Smart Wallet EVM (Account Abstraction)
    Hono->>Auth: Guarda wallet_address en users_identity
    Hono->>SC: 5. Registra Identity en IIdentityRegistry
    
    Cliente->>NextJS: 6. Clic en "Invertir $50k" (Fideicomiso)
    NextJS->>Auth: Verifica Sesión y KYC (Drizzle/Supabase)
    NextJS->>Fiat: 7. Inicia Payment Intent ("Aporte a Fideicomiso")
    Fiat-->>NextJS: Confirmación de Pago Exitoso
    
    NextJS->>Hono: 8. POST /api/webhooks/investment-success
    Hono->>SC: 9. Minting/Asignación de Token ERC-3643 a Smart Wallet
    SC-->>Hono: Emite Evento (Transfer)
    Hono->>Auth: 10. Actualiza balance/asset en DB
    
    NextJS->>Cliente: 11. Redirige a /dashboard/portfolio
    Cliente->>NextJS: Visualiza "Quiet Luxury" Portfolio (Sincronizado)
```

### Explicación del Flujo "Fricción Cero":
1. **El cliente nunca toca Metamask ni guarda Seed Phrases.** La "Smart Wallet" se genera en el paso 4 en el background.
2. **El cliente paga con tarjeta o transferencia bancaria local.** El paso 7 usa Stripe/MercadoPago, pasando el compliance bancario bajo el concepto legal de "Aporte a Fideicomiso".
3. **Sincronización Web2-Web3.** El Orquestador Hono (Paso 8 y 9) firma las transacciones on-chain con su llave privada administradora, asignando los derechos reales al usuario de forma invisible.
