# Guion de Presentación del Modelo de Negocio (Business Demo)
**Duración Estimada:** 15-20 minutos
**Entorno:** PachaNova v2.0 Demo Mirror Local

---

## 1. Introducción (2 min)
"Hola a todos. Bienvenidos a esta demostración de PachaNova, la plataforma RWA diseñada para estructurar, adquirir y transferir participaciones digitales sobre activos inmobiliarios."
"Lo que vamos a ver hoy es una simulación completa de nuestro modelo operativo. Es importante aclarar que todo el entorno que mostraremos es un Sandbox local y seguro: no estamos utilizando dinero real, ni conexiones productivas ni smart contracts en Mainnet."

## 2. El Modelo (2 min)
"Nuestro modelo transforma la Propiedad Exclusiva de activos tangibles en participaciones digitales llamadas PACHA. El flujo es simple: un fideicomiso salvaguarda la propiedad y aprueba la emisión; una vez emitidos los tokens en nuestro ledger inmutable, los inversores pueden adquirir PACHA primario, y posteriormente intercambiarlos de forma ágil en nuestro mercado secundario P2P."

## 3. Landing Page (2 min)
*(Navegar a la página principal `/`)*
"Como pueden ver en nuestra página de inicio, explicamos el proceso de forma transparente a través de 4 pasos clave: verificación de perfil (KYC), depósito de fondos, adquisición Genesis, y operación en mercado P2P. Aquí mismo aclaramos qué partes del proceso estamos simulando en esta demostración pedagógica."

## 4. Admin: Aprobar KYC demo (2 min)
*(Navegar a `/dashboard/admin/users` o hacer el login flow de Admin)*
"PachaNova requiere certidumbre sobre los actores institucionales. Empezamos en la vista del Administrador. Aquí podemos gestionar a los usuarios. Procederé a aprobar el perfil KYC de nuestro inversor de demostración, simulando la verificación de identidad institucional."
*(Acción: Aprobar KYC de un usuario demo)*

## 5. Inversor: Simular depósito (2 min)
*(Navegar a `/dashboard/investor` con rol inversor)*
"Ahora cambiamos al rol de Inversor. La plataforma me informa que mi KYC está aprobado. Para poder operar, primero necesito simular la carga de un saldo demo."
*(Acción: Clic en Cargar Saldo Demo)*
"Vemos cómo mi balance en USD virtuales se ha incrementado inmediatamente."

## 6. Genesis: Adquirir PACHA demo (3 min)
*(Navegar a `/dashboard/investor/genesis`)*
"Con saldo disponible, vamos a la ronda Genesis. Aquí selecciono cuántos tokens PACHA deseo adquirir simuladamente. El sistema calcula la equivalencia en metros cuadrados (m²) y en dólares."
*(Acción: Registrar intento demo)*
"Registramos la orden. Inmediatamente obtenemos el comprobante generado por nuestro sistema local."

## 7. Portafolio: Ver tokens y m² (1 min)
*(Volver a `/dashboard/investor`)*
"Al regresar a mi portafolio, observamos que ahora soy titular de tokens PACHA. Puedo ver mi saldo de tokens actualizado y su correspondencia en metros cuadrados físicos de San Bartolo."

## 8. P2P: Crear y ejecutar una orden demo (3 min)
*(Navegar a `/dashboard/investor/marketplace`)*
"El valor real de la tokenización es la liquidez ágil. En el mercado P2P, puedo publicar mis tokens para venta. Selecciono la cantidad y precio por token."
*(Acción: Publicar Oferta Demo)*
"Si miramos las ofertas, cualquier otro usuario calificado (o en este entorno demo, nosotros mismos para efectos de prueba) puede tomar esta orden y simular la compra de tokens PACHA en tiempo real, transfiriendo la titularidad sin fricciones."

## 9. Auditoría: Ver ledger y audit logs (1 min)
*(Navegar a `/demo/reports` o mostrar registros en pantalla)*
"Todas estas acciones están auditadas. Nuestro Ledger local ha registrado de manera inmutable (con hash simulado) el `MINT_GENESIS` y las transferencias `P2P`, proveyendo trazabilidad absoluta."

## 10. Fideicomiso: Ver supervisión (1 min)
*(Navegar a `/dashboard/fideicomiso`)*
"Este flujo está respaldado por un mecanismo de quórum. En el panel de Fideicomiso vemos cómo se autorizan las emisiones. Es la garantía legal reflejada en reglas técnicas."

## 11. Integraciones (1 min)
"Todo este flujo ocurrió en un silo. Para escalar a nivel institucional, hemos preparado los puentes conectores. En la página de estado de integración, vemos que MercadoPago está 'Pending Credentials' y los Smart Contracts de Foundry están listos para ser desplegados. La infraestructura ya contempla dónde 'enchufarlos'."

## 12. Cierre (1 min)
"Hemos recorrido el ciclo completo de negocio: desde el KYC hasta el mercado secundario P2P. La lógica transaccional, los dashboards y la base de datos están validados.
¿Qué sigue? En las próximas fases habilitaremos el Sandbox real de MercadoPago, levantaremos los Smart Contracts locales con Foundry y, eventualmente, migraremos a un Cloud Privado Institucional.
Muchas gracias por su tiempo."
