-- PachaNova cofinanciamiento — schema inicial (base nueva, sin tokens).
-- Canon: docs/PRODUCT_CANON.md

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('admin', 'investor', 'client', 'operator', 'fiduciario', 'comite');
exception when duplicate_object then null; end $$;

do $$ begin
  create type kyc_status as enum ('pending', 'in_review', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_type as enum ('landbanking', 'building_sale', 'building_rent', 'other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_status as enum ('draft', 'funding', 'active', 'exiting', 'closed', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type round_status as enum ('planned', 'open', 'paused', 'closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type participation_status as enum ('committed', 'partially_paid', 'active', 'exited', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type capital_kind as enum ('contribution', 'refund', 'distribution', 'adjustment');
exception when duplicate_object then null; end $$;

do $$ begin
  create type money_status as enum ('pending', 'reconciled', 'failed', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type listing_kind as enum ('lot', 'unit_sale', 'rental');
exception when duplicate_object then null; end $$;

do $$ begin
  create type listing_status as enum ('draft', 'published', 'reserved', 'sold', 'rented', 'withdrawn');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('reserved', 'contracted', 'paying', 'delivered', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type milestone_status as enum ('pending', 'in_progress', 'done', 'skipped');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Profiles (se enlaza a auth.users cuando haya Supabase Auth)
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text not null unique,
  full_name text not null default '',
  phone text,
  role user_role not null default 'investor',
  secondary_role user_role,
  kyc_status kyc_status not null default 'pending',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists kyc_files (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  doc_type text not null,
  file_url text not null,
  status kyc_status not null default 'pending',
  notes text,
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  type project_type not null,
  status project_status not null default 'draft',
  location text not null default '',
  country text not null default 'PE',
  thesis text,
  currency text not null default 'USD',
  target_capital numeric(18,2) not null default 0,
  raised_capital numeric(18,2) not null default 0,
  round_status round_status not null default 'planned',
  cover_image_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  category text not null default 'general',
  file_url text not null,
  version int not null default 1,
  content_hash text,
  visibility text not null default 'admin', -- admin | investor | client | public
  uploaded_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  description text,
  status milestone_status not null default 'pending',
  evidence_url text,
  due_date date,
  completed_at timestamptz,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Investor participations + capital
-- ---------------------------------------------------------------------------
create table if not exists participations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete restrict,
  investor_id uuid not null references profiles(id) on delete restrict,
  committed_amount numeric(18,2) not null default 0,
  paid_amount numeric(18,2) not null default 0,
  ownership_pct numeric(9,6) not null default 0,
  status participation_status not null default 'committed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, investor_id)
);

create table if not exists capital_transactions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete restrict,
  participation_id uuid references participations(id) on delete set null,
  profile_id uuid not null references profiles(id) on delete restrict,
  kind capital_kind not null,
  amount numeric(18,2) not null,
  currency text not null default 'USD',
  status money_status not null default 'pending',
  method text not null default 'manual', -- manual | mercadopago
  external_id text,
  notes text,
  reconciled_by uuid references profiles(id),
  reconciled_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Client listings / orders / payments
-- ---------------------------------------------------------------------------
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete restrict,
  kind listing_kind not null,
  title text not null,
  description text,
  unit_code text,
  area_m2 numeric(12,2),
  price numeric(18,2) not null default 0,
  currency text not null default 'USD',
  status listing_status not null default 'draft',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists client_orders (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete restrict,
  client_id uuid not null references profiles(id) on delete restrict,
  status order_status not null default 'reserved',
  reserved_at timestamptz not null default now(),
  contracted_at timestamptz,
  delivered_at timestamptz,
  contract_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists client_payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references client_orders(id) on delete restrict,
  amount numeric(18,2) not null,
  currency text not null default 'USD',
  kind text not null default 'installment', -- down_payment | installment | rent
  status money_status not null default 'pending',
  method text not null default 'manual',
  external_id text,
  due_date date,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Audit
-- ---------------------------------------------------------------------------
create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  reason text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_events_entity_idx on audit_events (entity_type, entity_id);
create index if not exists participations_investor_idx on participations (investor_id);
create index if not exists listings_project_idx on listings (project_id);
create index if not exists client_orders_client_idx on client_orders (client_id);

-- ---------------------------------------------------------------------------
-- Seed mínimo (dev)
-- ---------------------------------------------------------------------------
insert into profiles (email, full_name, role, kyc_status)
values
  ('admin@pachanova.local', 'Administrador', 'admin', 'approved'),
  ('inversor@pachanova.local', 'Inversor Demo', 'investor', 'approved'),
  ('cliente@pachanova.local', 'Cliente Demo', 'client', 'pending')
on conflict (email) do nothing;

insert into projects (code, name, type, status, location, thesis, target_capital, round_status)
values
  (
    'PNC-PAR-001',
    'Paracas Landbanking',
    'landbanking',
    'funding',
    'Paracas, Ica',
    'Compra de tierra para madurar y vender. El inversor cofinancia; el cliente compra el lote al final.',
    500000,
    'open'
  )
on conflict (code) do nothing;
