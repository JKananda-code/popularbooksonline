-- Migration 006: Newsletter subscribers + free chapter lead capture
-- Run this in Supabase → SQL Editor → New Query → Run
-- Safe to re-run (uses IF NOT EXISTS everywhere)

-- Ensure UUID generation is available (Supabase projects usually have this already)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Main table — the only lead capture surface after the KDP pivot
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  source text DEFAULT 'newsletter',
  -- Values: 'newsletter' | 'free_chapter' | 'coming_soon_notify'
  first_name text,
  country text,
  interests jsonb,
  -- e.g. { "books": ["new-canadian-blueprint"] }
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Helpful indexes for admin exports and filtering
CREATE INDEX IF NOT EXISTS idx_newsletter_source ON newsletter_subscribers(source);
CREATE INDEX IF NOT EXISTS idx_newsletter_country ON newsletter_subscribers(country);
CREATE INDEX IF NOT EXISTS idx_newsletter_created ON newsletter_subscribers(created_at DESC);

-- NOTE: Row Level Security is intentionally NOT enabled on this table.
-- Our server-side API uses the service role key which bypasses RLS anyway,
-- and leaving RLS off avoids any accidental lockout. The table is never
-- queried from the browser directly.

-- Verify the table was created
SELECT COUNT(*) AS "existing_rows" FROM newsletter_subscribers;
