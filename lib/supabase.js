import { createClient } from '@supabase/supabase-js';

let _client = null;

export function getSupabase() {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY at runtime');
  }
  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

// Proxy so existing `supabase.from(...)` / `supabase.storage` calls work unchanged.
// Access is deferred until the first property lookup, avoiding build-time env checks.
export const supabase = new Proxy({}, {
  get(_target, prop) {
    return getSupabase()[prop];
  }
});
