# Staging Entry Criteria

Antes de poder clasificar el entorno como "Staging-Ready" y prepararlo para un despliegue Cloud público, se deben cumplir todas las siguientes condiciones operativas, técnicas y legales:

## Condiciones Mínimas Obligatorias

1. **MercadoPago Sandbox GO:** Haber ejecutado pruebas End-to-End con webhook real expuesto públicamente recibiendo firmas HMAC válidas.
2. **Contracts Demo_Connected GO:** Haber desplegado el ERC-3643 en Anvil local y verificado la firma Web3 E2E usando el Dashboard Fideicomiso.
3. **KYC Gate:** Proveedor de KYC (Suma / Sumsub) integrado en entorno Sandbox y devolviendo webhooks válidos.
4. **CI Verde:** Todas las pipelines `pnpm test:e2e:demo` pasadas sin *flakiness*.
5. **Secret Scan Limpio:** 0 fugas detectadas mediante el escáner de seguridad en el historial de commits.
6. **Secret Rotation:** Si en alguna etapa anterior se comprometió una llave real, presentar evidencia de revocación.
7. **Audit Logs Verificados:** Comprobación de que cada acción sensible registra un hash en la tabla `audit_logs`.
8. **Ledger Verificado:** Token Math y equivalencias testeadas contra edge cases (ej. fraccionamiento indebido).
9. **No Production Credentials:** Estricta garantía de que el repositorio y el servidor CI no almacenan `DATABASE_URL` de bases productivas en su configuración general de build.
10. **Smoke Tests Completos:** Script `mp:sandbox:smoke` pasando con HTTP 200.
11. **Disclaimer Legal/KYC:** Documentación legal básica redactada y mostrada como pop-up/Terms & Conditions en el Dashboard de inversor antes de crear cualquier "Payment Preference".
