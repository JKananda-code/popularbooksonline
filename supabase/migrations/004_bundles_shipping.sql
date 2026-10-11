-- Migration 004: Bundle support + physical shipping fields on purchases
-- Run once in Supabase SQL Editor.

-- 1) Add SKU column so purchases can distinguish digital, paperback, bundles
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS sku text;
CREATE INDEX IF NOT EXISTS idx_purchases_sku ON purchases(sku);

-- 2) Shipping address & fulfilment tracking for physical/paperback orders
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS shipping_required boolean DEFAULT false;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS shipping_address jsonb;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS shipping_name text;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS shipping_country text;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS fulfillment_status text DEFAULT 'not_required';
-- values: 'not_required' (digital-only), 'pending', 'in_progress', 'shipped', 'delivered', 'cancelled'

CREATE INDEX IF NOT EXISTS idx_purchases_fulfillment ON purchases(fulfillment_status);

-- 3) Track bundle metadata (which slugs were unlocked by which bundle)
ALTER TABLE entitlements ADD COLUMN IF NOT EXISTS source_sku text;
CREATE INDEX IF NOT EXISTS idx_entitlements_source_sku ON entitlements(source_sku);

-- 4) RLS reminder — remain locked from anon (already handled in 003_rls.sql)
