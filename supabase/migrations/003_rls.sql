-- 003_rls.sql — Enable Row Level Security (RLS) on all tables
--
-- WHY: The anon (public) key is exposed in the frontend and could otherwise
-- read/write ANY row. RLS enforces per-row access rules even when the anon
-- key is used. The service_role key (used by our Next.js API routes)
-- BYPASSES RLS by design, so nothing on the backend breaks.
--
-- Effect after running this:
--   - `ebooks`     → anyone with the anon key can READ (needed for the library
--                    page rendering). No inserts/updates/deletes with anon.
--   - `entitlements` → completely locked from the anon key (deny by default).
--                     Only reachable via server-side service_role key.
--   - `purchases`  → completely locked from the anon key.
--
-- HOW TO APPLY: Paste this whole file into Supabase Studio → SQL Editor → Run.
--   (Or run: `supabase db push` if you have the CLI wired up.)
-- This migration is safe to re-run — every statement is idempotent via IF checks.

-- 1) ebooks — public read is required, but everything else must be blocked.
ALTER TABLE IF EXISTS public.ebooks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ebooks_public_read" ON public.ebooks;
CREATE POLICY "ebooks_public_read"
  ON public.ebooks
  FOR SELECT
  USING (true);

-- Explicitly do NOT create any INSERT/UPDATE/DELETE policies for ebooks.
-- With RLS enabled and no policy for those verbs, all writes from the anon
-- role are rejected. The service_role key bypasses RLS entirely, so our
-- server-side seeding and cover-upload endpoints continue to work.

-- 2) entitlements — total lockdown from anon.
ALTER TABLE IF EXISTS public.entitlements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "entitlements_anon_no_access" ON public.entitlements;
-- No policy created → default deny for anon/authenticated. service_role bypasses.

-- 3) purchases — total lockdown from anon.
ALTER TABLE IF EXISTS public.purchases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "purchases_anon_no_access" ON public.purchases;
-- Same pattern: no policy = deny for anon.

-- Sanity checks (safe to run — just log):
--   select tablename, rowsecurity from pg_tables where schemaname = 'public';
--   -- rowsecurity should be `t` (true) for ebooks, entitlements, purchases.

-- 4) Ensure the storage bucket used for covers is NOT public via anon writes.
-- If you use Supabase Storage for anything, uncomment and adjust:
-- ALTER POLICY "Public read" ON storage.objects USING (bucket_id = 'covers');
