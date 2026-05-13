# UX ORCHESTRATION AUDIT (FASE UX-1)

## 1. Visitante No Técnico
- **Punto de entrada:** Landing Page (`/`).
- **Primeros 30 segundos:** Ve un portal sobrio con métricas inmobiliarias, pero los términos como "RWA" o "External-ready" pueden resultarle crípticos.
- **Objetivo principal:** Entender si esto es un producto real, un juego, o una prueba, y hacer clic en el demo.
- **Rutas críticas:** `/`, `/demo/walkthrough`.
- **Términos confusos:** RWA, Fideicomiso, Pending Foundry.
- **Botones confusos:** "Revisar integraciones" (¿qué integraciones?).
- **Lugar donde puede perderse:** Si entra al `/dashboard/admin` sin contexto.
- **Fricciones visuales:** Muchos badges que parecen advertencias técnicas.
- **Fricciones narrativas:** Mezcla de terminología bancaria y criptográfica.
- **Mejoras necesarias:** Landing simplificada (Sección K), "Cómo leer este demo" y tooltips explicativos (InfoHint).
- **Criterio GO:** El visitante lee la landing, usa un tooltip sobre "PACHA" y hace clic en "Iniciar Walkthrough" entendiendo que es un entorno de prueba.

## 2. Inversor Interno
- **Punto de entrada:** `/dashboard/investor`.
- **Primeros 30 segundos:** Ve su posición y un gráfico pro-rata, pero no sabe si el dinero es real o simulado a pesar de que hay un badge diminuto.
- **Objetivo principal:** Ver el flujo de tokenización, simular una compra (Genesis Demo) y ver sus tokens.
- **Rutas críticas:** `/dashboard/investor/genesis`, `/dashboard/investor/ledger`.
- **Términos confusos:** Trust Anchor, Pending credentials.
- **Botones confusos:** "Comprar" (si existiera), debe ser "Simular flujo Genesis".
- **Lugar donde puede perderse:** En la pestaña de divulgación legal (Disclosures) si no tiene un CTA claro de retorno.
- **Fricciones visuales:** Falta de indicador del paso actual en el viaje del inversor.
- **Fricciones narrativas:** Sensación de riesgo financiero si el copy no lo calma.
- **Mejoras necesarias:** NextStepCard claro "Estás en el panel inversor demo...", JourneyProgressRail.
- **Criterio GO:** El inversor simula una adquisición con confianza, sabiendo que el saldo está aislado.

## 3. Admin Operativo
- **Punto de entrada:** `/dashboard/admin`.
- **Primeros 30 segundos:** Entiende que tiene control sobre tablas de datos (usuarios, logs), pero no tiene claro qué se espera que autorice.
- **Objetivo principal:** Revisar KYC de usuarios simulados y auditar el sistema.
- **Rutas críticas:** `/dashboard/admin/users`, `/dashboard/admin/audit`.
- **Términos confusos:** Token order demo.
- **Botones confusos:** "Aprobar usuario" vs "Revisión Demo".
- **Lugar donde puede perderse:** En los logs de auditoría si la tabla es infinita.
- **Fricciones visuales:** Tablas sin acciones o estados muertos.
- **Fricciones narrativas:** No sabe si sus clics afectan una base real.
- **Mejoras necesarias:** RoleSwitcherDemo (para entender que es "modo admin"), ActionIntent claro ("simulate" / "review").
- **Criterio GO:** Completa el flujo de aprobar KYC sabiendo que es una simulación local.

## 4. Fiduciario / Compliance
- **Punto de entrada:** `/dashboard/fideicomiso`.
- **Primeros 30 segundos:** Verifica que el respaldo legal RWA exista, pero nota que el sistema on-chain está en "Pending Foundry".
- **Objetivo principal:** Autorizar de forma simulada (Multi-sig 2/3) las operaciones de emisión.
- **Rutas críticas:** `/dashboard/fideicomiso/operations`, `/dashboard/fideicomiso/signatures`.
- **Términos confusos:** Ninguno, están familiarizados con Quorum y Firmas.
- **Botones confusos:** "Firmar" (debe ser "Firmar simuladamente").
- **Lugar donde puede perderse:** En operaciones pendientes sin contexto de la propuesta.
- **Fricciones visuales:** Falta de distinción entre firmas recogidas y pendientes.
- **Fricciones narrativas:** Preocupación si los textos dicen que están impactando la mainnet.
- **Mejoras necesarias:** Copy de Status Model unificado, InfoHint en Quorum 2/3.
- **Criterio GO:** Completa la firma simulada, visualizando la advertencia de que la ejecución está "Pending Foundry".

## 5. Operador Demo
- **Punto de entrada:** `/demo/showcase` o `/demo/operator`.
- **Primeros 30 segundos:** Ve la sala de control, pero no tiene un flujo lineal para la demo, debe saltar entre pestañas.
- **Objetivo principal:** Guiar a un tercero a través de la plataforma inyectando escenarios o reseteando la DB.
- **Rutas críticas:** `/demo/operator`, `/demo/scenarios`, `/demo/integrations`.
- **Términos confusos:** Scenarios vs Integrations.
- **Botones confusos:** "Reset DB" (¿Borra Neon?).
- **Lugar donde puede perderse:** Al perder el guion de la presentación.
- **Fricciones visuales:** UI estéril para operaciones complejas.
- **Fricciones narrativas:** Necesita saber cómo alternar perspectivas.
- **Mejoras necesarias:** RoleSwitcherDemo, GuidedModeToggle, NextStepCard orientadas a la presentación.
- **Criterio GO:** Ejecuta el reset, inyecta el escenario y cambia a vista Inversor fluidamente.
