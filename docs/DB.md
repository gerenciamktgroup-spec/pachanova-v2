# Base de datos (nueva)

La base vieja de Supabase quedó muerta. Esta es la base **nueva**, local, vacía de tokens.

## Cómo está levantada

```bash
docker compose up -d db
```

- Host: `127.0.0.1:5433`
- DB: `pachanova`
- User/pass: `postgres` / `pachanova_dev` (solo local)
- Volumen: `pachanova_cofinanciamiento_data` (no reusa el demo token)

Schema: `supabase/migrations/20260822000000_cofinanciamiento_init.sql`

Tablas: `profiles`, `kyc_files`, `projects`, `project_documents`, `project_milestones`, `participations`, `capital_transactions`, `listings`, `client_orders`, `client_payments`, `audit_events`.

Seeds: admin / inversor / cliente + proyecto `PNC-PAR-001` landbanking.

## Auth

Postgres local **no** incluye GoTrue. El login real de Supabase espera un proyecto cloud **nuevo**. Hasta entonces `DEMO_MODE=true`.

Cuando haya un Supabase cloud nuevo, se aplica el mismo SQL allá y se cambian las keys. No se revive el proyecto viejo.
