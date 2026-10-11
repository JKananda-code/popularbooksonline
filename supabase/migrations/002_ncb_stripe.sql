-- Migration: Add columns for premium ebooks + entitlements + purchases tables
-- Run this once in Supabase SQL Editor (project: czatcngbzauwuythptsq)

-- 1) Extend ebooks table with slug + premium flags
ALTER TABLE ebooks ADD COLUMN IF NOT EXISTS slug text;
CREATE UNIQUE INDEX IF NOT EXISTS idx_ebooks_slug ON ebooks(slug) WHERE slug IS NOT NULL;
ALTER TABLE ebooks ADD COLUMN IF NOT EXISTS premium boolean DEFAULT false;
ALTER TABLE ebooks ADD COLUMN IF NOT EXISTS price_cents integer;
ALTER TABLE ebooks ADD COLUMN IF NOT EXISTS currency text DEFAULT 'cad';
ALTER TABLE ebooks ADD COLUMN IF NOT EXISTS is_locked_preview boolean DEFAULT false;

-- 2) Entitlements — one row per (email, ebook_slug); presence = unlocked
CREATE TABLE IF NOT EXISTS entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  ebook_slug text NOT NULL,
  stripe_session_id text,
  stripe_customer_id text,
  granted_by text DEFAULT 'stripe',
  created_at timestamptz DEFAULT now(),
  UNIQUE (email, ebook_slug)
);
CREATE INDEX IF NOT EXISTS idx_entitlements_email ON entitlements(email);
CREATE INDEX IF NOT EXISTS idx_entitlements_ebook_slug ON entitlements(ebook_slug);

-- 3) Purchases — full audit trail of every payment attempt
CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  ebook_slug text NOT NULL,
  amount_cents integer,
  currency text DEFAULT 'cad',
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  status text DEFAULT 'complete',
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(email);

-- RLS off (server-side only, service role bypasses anyway)
ALTER TABLE entitlements DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchases DISABLE ROW LEVEL SECURITY;
