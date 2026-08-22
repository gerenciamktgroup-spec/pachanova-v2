# PachaNova

**Este es el único proyecto de producto.**  
Ruta: `C:\Users\LENOVO\Desktop\labotarorio lihue\pachanova`  
Repo: `gerenciamktgroup-spec/pachanova-v2`  
Rama de trabajo: `product47-cofinanciamiento`

PachaNova es una plataforma de **cofinanciamiento inmobiliario** con trazabilidad.

- El **administrador** opera proyectos.
- El **inversor** cofinancia.
- El **cliente** compra o arrienda el inmueble.

No es un exchange. No es un token. No es DeFi.

## Cómo entrar

```bash
pnpm install
pnpm --filter dashboard dev
```

App: `apps/dashboard` (Next.js) en el puerto 3000.

## Documentos que mandan

1. [`docs/PRODUCT_CANON.md`](docs/PRODUCT_CANON.md) — qué es el producto
2. [`docs/QUE_FALTA_CONSTRUIR.md`](docs/QUE_FALTA_CONSTRUIR.md) — backlog fullstack
3. [`docs/PRODUCT_SCOPE.md`](docs/PRODUCT_SCOPE.md) — rutas vivas vs cuarentena
4. [`docs/negocio/`](docs/negocio/) — business plan y estudio de mercado (origen)

Ignorá `docs/reports_history/` y los loops `orchestrate*` — son ruido de la etapa token/RWA.

## Qué no es este repo

Las copias viejas están en el Escritorio: `_archivo_pachanova`.  
`laboratorio-lihue-core` es el laboratorio, no la app.
