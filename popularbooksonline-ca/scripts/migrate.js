// One-time migration runner for NCB tables/columns
// Usage: node scripts/migrate.js
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Missing env'); process.exit(1); }

const supabase = createClient(url, key, { auth: { persistSession: false } });

// We check whether a column exists; if not we prompt user to run SQL.
async function main() {
  // Attempt to read a row projecting the new columns. If it errors, table hasn't been migrated.
  const { data, error } = await supabase.from('ebooks').select('id,slug,premium,price_cents,currency').limit(1);
  if (error) {
    console.error('Migration required — please run this SQL in Supabase SQL Editor:');
    console.error(`
ALTER TABLE ebooks ADD COLUMN IF NOT EXISTS slug text;
CREATE UNIQUE INDEX IF NOT EXISTS idx_ebooks_slug ON ebooks(slug) WHERE slug IS NOT NULL;
ALTER TABLE ebooks ADD COLUMN IF NOT EXISTS premium boolean DEFAULT false;
ALTER TABLE ebooks ADD COLUMN IF NOT EXISTS price_cents integer;
ALTER TABLE ebooks ADD COLUMN IF NOT EXISTS currency text DEFAULT 'cad';

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

ALTER TABLE entitlements DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchases DISABLE ROW LEVEL SECURITY;
`);
    console.error('Error was:', error.message);
    process.exit(2);
  }
  console.log('OK - migration already applied. Columns exist on ebooks table.');

  // Also check entitlements + purchases tables exist
  const e = await supabase.from('entitlements').select('id').limit(1);
  if (e.error) { console.error('Missing entitlements table:', e.error.message); process.exit(3); }
  const p = await supabase.from('purchases').select('id').limit(1);
  if (p.error) { console.error('Missing purchases table:', p.error.message); process.exit(4); }
  console.log('OK - entitlements + purchases tables exist.');
}
main().catch(console.error);
