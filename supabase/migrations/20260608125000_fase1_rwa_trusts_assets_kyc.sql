-- Migration: Fase 1 RWA (Trusts, Assets, KYC Identity)
-- Master manual sacred: Gestión integral de desarrollo inmobiliario "Fideicomiso Rutas del Sol - Paracas" (50 Hectáreas completas)

-- 1. Tabla de Fideicomisos Maestros
CREATE TABLE IF NOT EXISTS public.trusts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    legal_document_ref TEXT,
    audit_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Habilitar RLS en trusts
ALTER TABLE public.trusts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Lectura pública, modificación solo admins/service_role
CREATE POLICY "Lectura publica de fideicomisos" ON public.trusts
    FOR SELECT USING (true);

-- 2. Tabla de Propiedades/Lotes (Assets)
CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trust_id UUID NOT NULL REFERENCES public.trusts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    valor_fiat_inicial NUMERIC(12,2) NOT NULL,
    valor_fiat_actual NUMERIC(12,2) NOT NULL,
    estado TEXT CHECK (estado IN ('active', 'in_liquidation', 'liquidated')) DEFAULT 'active' NOT NULL,
    success_fee_percentage NUMERIC(5,2) DEFAULT 15.00 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Habilitar RLS en assets
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura publica de assets" ON public.assets
    FOR SELECT USING (true);

-- 3. Tabla de Identidad (users_identity)
CREATE TABLE IF NOT EXISTS public.users_identity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL, -- Referencia lógica a la tabla auth.users o public.users existente
    kyc_status TEXT CHECK (kyc_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending' NOT NULL,
    smart_wallet_address TEXT UNIQUE CHECK (char_length(smart_wallet_address) = 42),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Intentar relacionar fuertemente con public.users si la tabla ya existe
DO $$ BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        ALTER TABLE public.users_identity 
        ADD CONSTRAINT users_identity_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
    END IF;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Habilitar RLS en users_identity
ALTER TABLE public.users_identity ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Solo el propio usuario puede leer su identidad. Escritura reservada al sistema backend (service_role) o administradores.
CREATE POLICY "Usuarios pueden leer su propia identidad" ON public.users_identity
    FOR SELECT USING (auth.uid() = user_id);
