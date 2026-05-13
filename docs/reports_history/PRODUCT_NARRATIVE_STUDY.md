# PachaNova V2.0 - Product Narrative Study

## Objetivo
Establecer la narrativa institucional y educativa de PachaNova V2.0 Demo Mirror. El lenguaje debe ser estrictamente explicativo, sin marketing financiero ni promesas de rentabilidad, dejando claro el estado aislado del Sandbox.

## Respuestas a las 16 Preguntas Clave

**1. ¿Qué es PachaNova?**
PachaNova es una plataforma tecnológica e institucional diseñada para orquestar la tokenización de activos del mundo real (RWA) mediante un entorno fiduciario automatizado.

**2. ¿Qué problema resuelve?**
Demuestra cómo la tecnología blockchain puede reducir fricciones en la fragmentación y transferencia de activos inmobiliarios, dotando a cada fracción de trazabilidad inmutable y respaldo legal.

**3. ¿Qué es un RWA?**
Un Real World Asset (RWA) o Activo del Mundo Real, representa un bien físico (en este caso, un terreno) cuyos derechos económicos están vinculados a tokens digitales en una red blockchain.

**4. ¿Qué es San Bartolo dentro del demo?**
San Bartolo es el activo inmobiliario de prueba utilizado en esta simulación. Representa un terreno de 5 hectáreas (50,000 m²) ubicado conceptualmente en un entorno controlado para fines de demostración técnica.

**5. ¿Qué representa PACHA?**
PACHA es la unidad digital (token) de esta demostración. Representa una fracción matemática de los derechos fiduciarios sobre el activo San Bartolo.

**6. ¿Por qué 1 PACHA = 0.1 m²?**
Para facilitar la accesibilidad, el activo de 50,000 m² se divide en 500,000 tokens PACHA. Matemáticamente, esto asigna a cada token el equivalente a 0.1 metros cuadrados.

**7. ¿Qué hace el fideicomiso?**
El fideicomiso actúa como la entidad legal ancla. En este entorno, demuestra cómo un ente neutral (con quórum 2/3) valida y custodia jurídicamente los activos antes de permitir su tokenización, asegurando el respaldo físico de cada PACHA digital.

**8. ¿Qué hace el ledger?**
El Ledger Local es el registro inmutable de transacciones del Sandbox. Funciona como una base de datos segura que audita cada movimiento, simulando el comportamiento de un contrato inteligente (Smart Contract) en blockchain.

**9. ¿Qué hace la consola admin?**
La Consola Administrativa permite a los operadores institucionales monitorear el sistema, auditar eventos técnicos, aprobar validaciones de identidad (KYC) y revisar el estado general del entorno de pruebas.

**10. ¿Qué significa external-ready?**
Significa que la arquitectura del sistema está preparada para conectarse con proveedores externos (pasarelas de pago, redes blockchain públicas, oráculos de precios), pero dichas conexiones se mantienen desactivadas por diseño en esta fase.

**11. ¿Qué significa pending credentials?**
Indica que un módulo (como MercadoPago) está listo a nivel de código, pero intencionalmente carece de las credenciales de acceso necesarias para procesar transacciones reales o en sandbox externo.

**12. ¿Qué significa pending Foundry?**
Informa que el entorno local de simulación blockchain (Foundry/Anvil) no está conectado, por lo que las operaciones criptográficas avanzadas se están registrando en el Ledger Local y no en una red on-chain.

**13. ¿Cómo sería el flujo Genesis cuando MercadoPago Sandbox esté conectado?**
El usuario seleccionaría la cantidad de PACHA a adquirir, el sistema generaría una "Preference" de pago temporal, y redirigiría al checkout de MercadoPago Sandbox. Tras el pago simulado, un Webhook validaría criptográficamente el recibo y el Ledger acreditaría los tokens.

**14. ¿Qué puede hacer hoy un usuario en modo demo?**
Puede navegar por todos los perfiles institucionales (Inversor, Administrador, Fiduciario), visualizar cómo se estructuran los dashboards, y simular el inicio de flujos operativos interactuando con los componentes UI, generando logs locales.

**15. ¿Qué NO puede hacer todavía?**
No puede realizar transferencias de fondos reales, no puede interactuar con redes blockchain públicas, y no puede adquirir tokens con valor económico fuera del Sandbox Local.

**16. ¿Qué riesgos y límites deben explicarse?**
Debe quedar estrictamente claro que este entorno no es una oferta pública de inversión. Las métricas, precios (ej. US$8.40) y balances exhibidos son ficticios y existen únicamente para validar la viabilidad técnica y arquitectónica del software.
