# Guion de Presentación PachaNova (12-15 min)

## 1. Apertura Institucional (2 min)
"Bienvenidos. Hoy presentamos la arquitectura tecnológica detrás de PachaNova. Esta demostración se ejecuta en un **Demo local, external-ready**, diseñado para asegurar total aislamiento de producción."

## 2. El Proyecto: San Bartolo (2 min)
"PachaNova tokeniza activos del mundo real. Para este demo, utilizamos el proyecto **San Bartolo**, compuesto por **5 hectáreas (50,000 m²)**."
"Hemos emitido un suministro génesis de **500,000 tokens PACHA**."
"La matemática es simple pero auditable: **1 token equivale a 0.1 m²**."

## 3. Estado Génesis (1 min)
"Empecemos visualizando el estado Génesis de la base de datos Demo. El sistema está limpio y preparado para simular interacciones de mercado sin arriesgar datos de usuarios reales."

## 4. Dashboard del Inversor (3 min)
*(Navega a /dashboard/investor)*
"Este es el Dashboard del Inversor. Aquí, los inversores pueden ver sus tenencias en tiempo real."
"Destacamos la **ProRataLandCard**, un componente interactivo 3D que visualiza gráficamente la proporción de la tierra que representa el balance de tokens del inversor sobre el lote total."

## 5. Dashboard del Administrador y Fideicomiso (3 min)
*(Navega a /dashboard/admin)*
"Desde el panel de administración, controlamos la tesorería global. Toda acción queda registrada."
*(Muestra los audit_logs)* "Aquí pueden ver el registro inmutable de auditoría local."
*(Navega a /dashboard/fideicomiso)* "El Panel de Fideicomiso permite la orquestación Multi-firma. Este panel aprueba operaciones de capital."

## 6. Integration Readiness (2 min)
*(Navega a /demo/integrations)*
"Nuestro sistema es 'External-Ready'. Hemos implementado un Integration Registry. Fíjense cómo indica que proveedores de Pagos y Contratos están en estado 'SIMULATED' o 'READY-BUT-DISABLED'. Esto demuestra que la plataforma está codificada para conectarse al mundo real, pero protegida para uso demostrativo."

## 7. Próximos Pasos (1 min)
"Nuestros próximos pasos incluyen la transición hacia el entorno Cloud y habilitar progresivamente las integraciones externas (Sandbox) para UAT."
