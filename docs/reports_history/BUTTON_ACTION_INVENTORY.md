# PachaNova V2.0 - Button Action Inventory

Esta tabla audita todos los CTAs (Call to Actions) para asegurar consistencia, claridad y cumplimiento con la política de simulación.

| Ruta | Botón / CTA | Intención | Acción real | Estado | Problema / Riesgo | Fix a aplicar |
|---|---|---|---|---|---|---|
| Landing `/` | "Ver cómo funciona" | `navigate` | Redirige a `/demo/business-flow` | OK | Ninguno | Mantener |
| Landing `/` | "Entrar al simulador" | `navigate` | Redirige a `/demo/showcase` | OK | Ninguno | Mantener |
| Landing `/` | "Explorar panel inversor" | `navigate` | Redirige a `/dashboard/investor` | OK | Ninguno | Mantener |
| Demo `/demo/showcase` | "Role Switcher" | `simulate` | Cambia estado UI de sesión | OK | Ninguno | Mantener |
| Investor `/dashboard/investor` | "Cargar Saldo Demo" | `simulate` | POST a `/simulated-deposit` | OK | Ninguno | Mantener |
| Investor `/dashboard/investor` | "Simular adquisición Genesis" | `navigate` | Redirige a `/dashboard/investor/genesis` | OK | Decía "Comprar" en versiones viejas | Mantener "Simular adquisición" |
| Investor `/dashboard/investor/genesis` | "Registrar intento demo" | `simulate` | POST a `/genesis-demo-purchase` | OK | Terminología corregida | Mantener |
| Investor `/dashboard/investor/marketplace` | "Publicar Oferta Demo" | `simulate` | POST a `/p2p/create-order` | OK | Ninguno | Mantener |
| Investor `/dashboard/investor/marketplace` | "Simular Compra PACHA" | `simulate` | POST a `/p2p/buy-order` | OK | Evita confusión de dinero real | Mantener |
| Admin `/dashboard/admin/users` | "Aprobar/Rechazar" | `simulate` | Update DB local `/kyc-status` | OK | Ninguno | Mantener |
| Admin `/dashboard/admin/users` | "Marcar para revisión general" | `simulate` | POST a `/admin-user-review` | OK | Ninguno | Mantener |
| Fideicomiso `/dashboard/fideicomiso` | "Firmar Operación" | `simulate` | Update DB local (Quorum) | OK | Ninguno | Mantener |

## Reglas de Corrección
- **Cero botones muertos.**
- **Disabled con razón:** Todo botón inactivo debe explicar el porqué usando `InfoHint` o `actionIntent` de `SafeActionButton`.
- **Nomenclatura Genesis:** "Registrar intento demo", "Simular adquisición", nunca "Pagar" ni "Invertir".
