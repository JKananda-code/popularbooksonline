import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createHash, timingSafeEqual } from 'crypto';
import { supabase } from '@/lib/supabase';
import { openai, MODEL } from '@/lib/llm';
import { signEntitlement, verifyEntitlement } from '@/lib/jwt';
import { NCB_META, NCB_CHAPTERS, NCB_SLUG } from '@/lib/ncb-content';
import { IDSHIELD_META, IDSHIELD_CHAPTERS, IDSHIELD_SLUG } from '@/lib/identity-shield-content';
import { ELEPHANT_META, ELEPHANT_CHAPTERS, ELEPHANT_SLUG } from '@/lib/scan-elephant-content';
import { SERIES, SERIES_BY_SLUG, bestAmazonUrl } from '@/lib/catalog';

export const maxDuration = 120;
export const dynamic = 'force-dynamic';

// ---------- Image generation (Gemini Nano Banana via Emergent proxy) ----------
const IMAGE_URL = process.env.EMERGENT_IMAGE_URL || 'https://integrations.emergentagent.com/llm/v1/images/generations';

async function generateCoverImage({ title, description, topic, style }) {
  const prompt = `A beautiful, painterly ebook cover artwork for a book titled "${title}". Subject/context: ${description || topic}. Style: ${style || 'elegant, atmospheric, vintage bookstore aesthetic'}. Rich color palette, high detail, cinematic composition, poster-quality illustration. Absolutely NO text, letters, words, titles or writing anywhere in the image.`;

  const res = await fetch(IMAGE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.EMERGENT_LLM_KEY}`,
    },
    body: JSON.stringify({
      model: 'gemini/gemini-2.5-flash-image',
      prompt,
      n: 1,
      size: '1024x1024',
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Image proxy ${res.status}: ${t.slice(0, 300)}`);
  }
  const data = await res.json();
  const item = data?.data?.[0] || {};
  let b64 = item.b64_json;
  if (!b64 && item.url) {
    const imgRes = await fetch(item.url);
    const buf = Buffer.from(await imgRes.arrayBuffer());
    b64 = buf.toString('base64');
  }
  if (!b64) throw new Error('No image bytes returned');
  return b64;
}

async function saveCover(ebookId, b64) {
  const { error: coverErr } = await supabase
    .from('covers')
    .upsert({ ebook_id: ebookId, image_base64: b64, updated_at: new Date().toISOString() }, { onConflict: 'ebook_id' });
  if (coverErr) throw new Error(`covers upsert: ${coverErr.message}`);
  const { error: flagErr } = await supabase
    .from('ebooks')
    .update({ has_cover: true })
    .eq('id', ebookId);
  if (flagErr) throw new Error(`ebooks flag update: ${flagErr.message}`);
}

// ---------- helpers ----------
// CORS: same-origin app. In the Emergent preview CORS_ORIGINS=* is set; on Vercel
// (CORS_ORIGINS unset) fall back to our own public origin instead of a wildcard.
function corsOrigin() {
  const configured = (process.env.CORS_ORIGINS || '').trim();
  if (configured && configured !== '*') return configured;
  if (process.env.VERCEL && process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  return '*';
}

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin(),
      'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Admin-Secret',
      'Cache-Control': 'no-store',
    },
  });
}

export async function OPTIONS() {
  return json({});
}

// ---------- security helpers ----------
// Admin auth: header-only (never query string), constant-time compare on SHA-256 digests
// so neither timing nor length of the secret leaks. Fails closed if ADMIN_SECRET is unset.
function isAdmin(request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    console.warn('[auth] ADMIN_SECRET is not configured — all admin routes are locked');
    return false;
  }
  const provided = request.headers.get('x-admin-secret') || '';
  const a = createHash('sha256').update(provided).digest();
  const b = createHash('sha256').update(secret).digest();
  return timingSafeEqual(a, b);
}

// Every route that writes to the DB, spends LLM budget, or exports PII.
const ADMIN_PATHS = new Set([
  'seed', 'ncb/seed', 'idshield/seed', 'elephant/seed',
  'ebooks/generate',
  'ncb/upload-cover', 'cover/upload',
  'leads',
]);
function isAdminRoute(method, path, segments) {
  if (ADMIN_PATHS.has(path)) return true;
  if (method === 'DELETE' || method === 'PUT') return true;
  if (segments[0] === 'ebooks' && segments[2] === 'cover-generate') return true;
  return false;
}

// Best-effort per-IP rate limiter for the public lead-capture endpoints.
// In-memory (per serverless instance) — cheap protection against form spam / enumeration.
const RATE = new Map();
const RATE_LIMIT_MAX = Math.max(1, parseInt(process.env.RATE_LIMIT_MAX || '20', 10));
const RATE_WINDOW_MS = 10 * 60 * 1000;
function clientIp(request) {
  return (
    (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
function rateLimited(request, bucket) {
  const now = Date.now();
  if (RATE.size > 5000) for (const [k, v] of RATE) if (now > v.reset) RATE.delete(k);
  const key = `${bucket}:${clientIp(request)}`;
  const entry = RATE.get(key);
  if (!entry || now > entry.reset) {
    RATE.set(key, { count: 1, reset: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

// Input sanitizers
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function cleanEmail(v) {
  const e = String(v ?? '').trim().toLowerCase();
  if (!e || e.length > 254 || !EMAIL_RE.test(e)) return null;
  return e;
}
function cleanText(v, max) {
  if (v === undefined || v === null) return null;
  const s = String(v).replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max);
  return s || null;
}
const ALLOWED_SOURCES = new Set(['newsletter', 'free_chapter', 'coming_soon_notify', 'publish_inquiry']);
function cleanSource(v, fallback = 'newsletter') {
  const s = String(v ?? '').trim();
  return ALLOWED_SOURCES.has(s) ? s : fallback;
}
function cleanInterests(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
  const books = Array.isArray(v.books)
    ? v.books.filter((b) => typeof b === 'string').map((b) => cleanText(b, 100)).filter(Boolean).slice(0, 10)
    : [];
  return books.length ? { books } : null;
}
function clientCountry(request, fallback = null) {
  const c = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry') || fallback || '';
  return /^[A-Za-z]{2}$/.test(c) ? c.toUpperCase() : null;
}
// CSV cell: quote, escape quotes, and neutralize spreadsheet formula triggers (= + - @ TAB CR)
function csvCell(v) {
  let s = String(v ?? '');
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}
// Public endpoints never echo raw DB/driver errors — log server-side, return a generic message.
function dbError(context, error, status = 500) {
  console.error(`[${context}]`, error?.message || error);
  return json({ error: 'temporarily unavailable' }, status);
}

const COVER_COLORS = [
  { from: '#7c2d12', to: '#b45309' },
  { from: '#1e3a8a', to: '#3730a3' },
  { from: '#064e3b', to: '#065f46' },
  { from: '#4c1d95', to: '#7c3aed' },
  { from: '#7f1d1d', to: '#b91c1c' },
  { from: '#134e4a', to: '#0f766e' },
  { from: '#831843', to: '#be185d' },
  { from: '#78350f', to: '#a16207' },
];
function hashCode(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i); return h; }
function pickColor(seed) {
  const idx = Math.abs(hashCode(seed || uuidv4())) % COVER_COLORS.length;
  return COVER_COLORS[idx];
}

// Map DB row (snake_case) → frontend shape (camelCase, with cover:{from,to} nested)
function rowToEbook(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug || null,
    title: row.title,
    author: row.author,
    description: row.description,
    emoji: row.emoji,
    cover: { from: row.cover_from, to: row.cover_to },
    topic: row.topic,
    style: row.style,
    audience: row.audience,
    chapters: row.chapters || [],
    wordCount: row.word_count,
    readMinutes: row.read_minutes,
    hasCover: !!row.has_cover,
    premium: !!row.premium,
    priceCents: row.price_cents || null,
    currency: row.currency || null,
    createdAt: row.created_at,
  };
}

// ---------- LLM: generate ebook (text) ----------
async function generateEbook({ topic, style = 'engaging', numChapters = 5, audience = 'general readers' }) {
  const prompt = `You are a bestselling ebook author. Write a complete short-form ebook on the topic below.

TOPIC: ${topic}
STYLE: ${style}
AUDIENCE: ${audience}
NUMBER OF CHAPTERS: ${numChapters}

Rules:
- Create a catchy book title (not just the topic).
- Invent a plausible author pen name.
- Write a 2-3 sentence back-cover description.
- Provide ${numChapters} chapters. Each chapter must have a compelling title AND full readable content of 350-500 words.
- Chapter content must be well-structured prose with paragraphs separated by blank lines. Do NOT use markdown headings inside chapter content.
- Return STRICT JSON matching this schema exactly:

{
  "title": string,
  "author": string,
  "description": string,
  "emoji": string (one single emoji that represents the book),
  "chapters": [ { "title": string, "content": string } ]
}

Return ONLY the JSON, no prose, no code fences.`;

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: 'You are an expert ebook writer that returns strict JSON only.' },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.85,
  });

  const raw = completion.choices[0].message.content;
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    const cleaned = raw.replace(/^```(json)?/i, '').replace(/```$/i, '').trim();
    data = JSON.parse(cleaned);
  }
  return data;
}

function buildEbookRow(ai, meta) {
  const id = uuidv4();
  const color = pickColor(ai.title || id);
  const chapters = (ai.chapters || []).map((c) => ({
    id: uuidv4(),
    title: c.title,
    content: c.content,
  }));
  const wordCount = chapters.reduce((sum, c) => sum + (c.content || '').split(/\s+/).length, 0);
  return {
    id,
    title: ai.title,
    author: ai.author,
    description: ai.description,
    emoji: ai.emoji || '📖',
    cover_from: color.from,
    cover_to: color.to,
    topic: meta.topic,
    style: meta.style,
    audience: meta.audience || 'general readers',
    chapters, // jsonb
    word_count: wordCount,
    read_minutes: Math.max(1, Math.round(wordCount / 220)),
    has_cover: false,
    created_at: new Date().toISOString(),
  };
}

async function seedIfEmpty() {
  const SEED_EBOOKS = [
    { topic: 'The Art of Deep Work in a Distracted World', style: 'insightful and practical', numChapters: 4 },
    { topic: 'A Traveler\'s Guide to the Hidden Cafés of Lisbon', style: 'atmospheric and poetic', numChapters: 4 },
    { topic: 'Learning to Cook Like Your Grandmother', style: 'warm and nostalgic', numChapters: 4 },
  ];
  const { count, error } = await supabase.from('ebooks').select('*', { count: 'exact', head: true });
  if (error) throw new Error(error.message);
  if ((count || 0) > 0) return { seeded: false, count };

  const results = [];
  for (const s of SEED_EBOOKS) {
    try {
      const ai = await generateEbook(s);
      const row = buildEbookRow(ai, s);
      await supabase.from('ebooks').insert(row);
      // best-effort cover
      try {
        const b64 = await generateCoverImage({ title: row.title, description: row.description, topic: s.topic, style: s.style });
        await saveCover(row.id, b64);
      } catch (imgErr) {
        console.error('seed cover failed:', imgErr?.message);
      }
      results.push(row.id);
    } catch (e) {
      console.error('Seed failure', e?.message);
    }
  }
  return { seeded: true, ids: results };
}

// ---------- Seed New Canadian Blueprint (idempotent) ----------
async function seedNewCanadianBlueprint() {
  // Check if it already exists
  const { data: existing } = await supabase.from('ebooks').select('id,has_cover').eq('slug', NCB_SLUG).maybeSingle();

  const chapters = NCB_CHAPTERS.map((c) => ({
    id: uuidv4(),
    title: c.title,
    content: c.content,
  }));
  const wordCount = chapters.reduce((sum, c) => sum + (c.content || '').split(/\s+/).length, 0);
  const row = {
    id: existing?.id || uuidv4(),
    slug: NCB_META.slug,
    title: NCB_META.title,
    author: NCB_META.author,
    description: NCB_META.description,
    emoji: NCB_META.emoji,
    cover_from: NCB_META.cover_from,
    cover_to: NCB_META.cover_to,
    topic: NCB_META.topic,
    style: NCB_META.style,
    audience: NCB_META.audience,
    chapters,
    word_count: wordCount,
    read_minutes: Math.max(1, Math.round(wordCount / 220)),
    premium: true,
    price_cents: NCB_META.price_cents,
    currency: NCB_META.currency,
    has_cover: !!existing?.has_cover,
    created_at: new Date().toISOString(),
  };

  if (existing) {
    // Update in place, preserving cover
    const { has_cover, ...update } = row;
    await supabase.from('ebooks').update(update).eq('id', existing.id);
  } else {
    await supabase.from('ebooks').insert(row);
  }

  // Best-effort cover generation if not present
  let coverGenerated = !!existing?.has_cover;
  if (!coverGenerated) {
    try {
      const b64 = await generateCoverImage({
        title: NCB_META.title,
        description: 'A guide for African immigrants arriving in Canada — warm elder wisdom, maple leaves, an open book, autumn colours, painterly illustration',
        topic: NCB_META.topic,
        style: 'warm, hopeful, gently patriotic, painterly, autumn maple leaves and Canadian landscape',
      });
      await saveCover(row.id, b64);
      coverGenerated = true;
    } catch (e) {
      console.error('NCB cover failed (non-fatal):', e?.message);
    }
  }

  return { ok: true, id: row.id, slug: row.slug, updated: !!existing, hasCover: coverGenerated };
}

// ---------- Seed Identity Theft Protection (idempotent) ----------
// Uses the static JPG bundled in /app/public/covers/ as the cover source (no LLM image generation).
async function seedIdentityTheftProtection() {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');

  const { data: existing } = await supabase.from('ebooks').select('id,has_cover').eq('slug', IDSHIELD_SLUG).maybeSingle();

  const chapters = IDSHIELD_CHAPTERS.map((c) => ({
    id: uuidv4(),
    title: c.title,
    content: c.content,
  }));
  const wordCount = chapters.reduce((sum, c) => sum + (c.content || '').split(/\s+/).length, 0);
  const row = {
    id: existing?.id || uuidv4(),
    slug: IDSHIELD_META.slug,
    title: IDSHIELD_META.title,
    author: IDSHIELD_META.author,
    description: IDSHIELD_META.description,
    emoji: IDSHIELD_META.emoji,
    cover_from: IDSHIELD_META.cover_from,
    cover_to: IDSHIELD_META.cover_to,
    topic: IDSHIELD_META.topic,
    style: IDSHIELD_META.style,
    audience: IDSHIELD_META.audience,
    chapters,
    word_count: wordCount,
    read_minutes: Math.max(1, Math.round(wordCount / 220)),
    premium: true,
    price_cents: IDSHIELD_META.price_cents,
    currency: IDSHIELD_META.currency,
    has_cover: !!existing?.has_cover,
    created_at: new Date().toISOString(),
  };

  if (existing) {
    const { has_cover, ...update } = row;
    await supabase.from('ebooks').update(update).eq('id', existing.id);
  } else {
    await supabase.from('ebooks').insert(row);
  }

  // Cover: read the bundled JPG (print-ready 1600x2560 300DPI) and save to Supabase covers table.
  let coverSaved = !!existing?.has_cover;
  if (!coverSaved) {
    try {
      const coverPath = path.join(process.cwd(), 'public', 'covers', 'identity-theft-protection-canada-cover-1600x2560.jpg');
      const buf = await fs.readFile(coverPath);
      const b64 = buf.toString('base64');
      await saveCover(row.id, b64);
      coverSaved = true;
    } catch (e) {
      console.error('IDSHIELD cover load failed (non-fatal):', e?.message);
    }
  }

  return { ok: true, id: row.id, slug: row.slug, updated: !!existing, hasCover: coverSaved, wordCount };
}

// ---------- Seed Scan Whole Elephant (idempotent) ----------
// No pre-supplied cover art — the BookSpine will render the gradient (forest → gold) with emoji until
// a JPG is uploaded via /api/ncb/upload-cover-generic in a future step.
async function seedScanWholeElephant() {
  const { data: existing } = await supabase.from('ebooks').select('id,has_cover').eq('slug', ELEPHANT_SLUG).maybeSingle();

  const chapters = ELEPHANT_CHAPTERS.map((c) => ({
    id: uuidv4(),
    title: c.title,
    content: c.content,
  }));
  const wordCount = chapters.reduce((sum, c) => sum + (c.content || '').split(/\s+/).length, 0);
  const row = {
    id: existing?.id || uuidv4(),
    slug: ELEPHANT_META.slug,
    title: ELEPHANT_META.title,
    author: ELEPHANT_META.author,
    description: ELEPHANT_META.description,
    emoji: ELEPHANT_META.emoji,
    cover_from: ELEPHANT_META.cover_from,
    cover_to: ELEPHANT_META.cover_to,
    topic: ELEPHANT_META.topic,
    style: ELEPHANT_META.style,
    audience: ELEPHANT_META.audience,
    chapters,
    word_count: wordCount,
    read_minutes: Math.max(1, Math.round(wordCount / 220)),
    premium: true,
    price_cents: ELEPHANT_META.price_cents,
    currency: ELEPHANT_META.currency,
    has_cover: !!existing?.has_cover,
    created_at: new Date().toISOString(),
  };

  if (existing) {
    const { has_cover, ...update } = row;
    await supabase.from('ebooks').update(update).eq('id', existing.id);
  } else {
    await supabase.from('ebooks').insert(row);
  }

  return { ok: true, id: row.id, slug: row.slug, updated: !!existing, hasCover: !!existing?.has_cover, wordCount };
}

// ---------- Router ----------
async function handle(request, method, segments) {
  const path = segments.join('/');

  // GET /api/ — health
  if (method === 'GET' && (path === '' || path === 'health')) {
    return json({ ok: true, service: 'popularbooksonline', db: 'supabase', time: new Date().toISOString() });
  }

  // ---- Auth gate: destructive / costly / PII routes require X-Admin-Secret ----
  if (isAdminRoute(method, path, segments) && !isAdmin(request)) {
    return json({ error: 'unauthorized' }, 401);
  }

  // POST /api/seed (admin)
  if (method === 'POST' && path === 'seed') {
    try {
      const result = await seedIfEmpty();
      return json(result);
    } catch (e) {
      return json({ error: 'Seed failed', detail: e.message }, 500);
    }
  }

  // GET /api/ebooks
  if (method === 'GET' && path === 'ebooks') {
    // Defensive: use SELECT * so it works whether or not the new columns exist yet.
    // rowToEbook safely defaults missing columns to null / false.
    const { data, error } = await supabase
      .from('ebooks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) return dbError('ebooks:list', error);
    const ebooks = (data || []).map((row) => ({ ...rowToEbook({ ...row, chapters: [] }), chapters: undefined }));
    return json({ ebooks });
  }

  // POST /api/ebooks/generate (admin)
  if (method === 'POST' && path === 'ebooks/generate') {
    const body = await request.json().catch(() => ({}));
    const topic = cleanText(body.topic, 200);
    if (!topic) return json({ error: 'topic required' }, 400);
    const style = cleanText(body.style, 100) || 'engaging';
    const numChapters = Math.min(Math.max(parseInt(body.numChapters || 4, 10) || 4, 2), 8);
    const audience = cleanText(body.audience, 100) || 'general readers';

    try {
      const ai = await generateEbook({ topic, style, numChapters, audience });
      const row = buildEbookRow(ai, { topic, style, audience });
      const { error: insErr } = await supabase.from('ebooks').insert(row);
      if (insErr) return json({ error: 'DB insert failed', detail: insErr.message }, 500);

      // best-effort cover
      let hasCover = false;
      try {
        const b64 = await generateCoverImage({ title: row.title, description: row.description, topic, style });
        await saveCover(row.id, b64);
        hasCover = true;
      } catch (imgErr) {
        console.error('Cover generation failed (non-fatal):', imgErr?.message);
      }

      return json({ ebook: rowToEbook({ ...row, has_cover: hasCover }) });
    } catch (e) {
      console.error('Generate error:', e?.message, e?.status);
      return json({ error: 'Failed to generate ebook', detail: e?.message || String(e) }, 500);
    }
  }

  // GET /api/ebooks/:id/cover
  if (method === 'GET' && segments[0] === 'ebooks' && segments[2] === 'cover' && segments.length === 3) {
    const id = segments[1];
    const { data, error } = await supabase
      .from('covers')
      .select('image_base64')
      .eq('ebook_id', id)
      .maybeSingle();
    if (error || !data?.image_base64) return json({ error: 'no cover' }, 404);
    const buf = Buffer.from(data.image_base64, 'base64');
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // POST /api/ebooks/:id/cover-generate (admin)
  if (method === 'POST' && segments[0] === 'ebooks' && segments[2] === 'cover-generate' && segments.length === 3) {
    const id = segments[1];
    const { data: ebook, error: fetchErr } = await supabase.from('ebooks').select('*').eq('id', id).maybeSingle();
    if (fetchErr) return dbError('cover-generate:fetch', fetchErr);
    if (!ebook) return json({ error: 'not found' }, 404);
    try {
      const body = await request.json().catch(() => ({}));
      const stylePrompt = cleanText(body.stylePrompt, 300) || '';
      const b64 = await generateCoverImage({
        title: ebook.title,
        description: ebook.description,
        topic: ebook.topic,
        style: stylePrompt || ebook.style,
      });
      await saveCover(id, b64);
      return json({ ok: true, hasCover: true });
    } catch (e) {
      console.error('Cover-generate error:', e?.message);
      return json({ error: 'Failed to generate cover', detail: e?.message }, 500);
    }
  }

  // GET /api/ebooks/slug/:slug — fetch by slug (used for New Canadian Blueprint)
  if (method === 'GET' && segments[0] === 'ebooks' && segments[1] === 'slug' && segments.length === 3) {
    const slug = segments[2];
    const { data, error } = await supabase.from('ebooks').select('*').eq('slug', slug).maybeSingle();
    if (error) return dbError('ebooks:slug', error);
    if (!data) return json({ error: 'not found' }, 404);

    // Gate: if premium, only return chapter previews unless a valid entitlement JWT is presented
    const ebook = rowToEbook(data);
    if (ebook.premium) {
      const authHeader = request.headers.get('authorization') || '';
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      const claim = verifyEntitlement(token);
      const hasEntitlement = claim && claim.slug === ebook.slug;

      if (!hasEntitlement) {
        // Return only first chapter as preview + surface true total so the buy dialog
        // shows the real chapter count instead of "1 chapters"
        const totalChapters = (ebook.chapters || []).length;
        const preview = (ebook.chapters || []).slice(0, 1).map((c, i) => ({
          ...c,
          content: i === 0 ? c.content : '',
        }));
        return json({ ebook: { ...ebook, chapters: preview, totalChapters, locked: true } });
      }
    }
    return json({ ebook });
  }

  // GET /api/ebooks/:id
  if (method === 'GET' && segments[0] === 'ebooks' && segments.length === 2) {
    const id = segments[1];
    const { data, error } = await supabase.from('ebooks').select('*').eq('id', id).maybeSingle();
    if (error) return dbError('ebooks:get', error);
    if (!data) return json({ error: 'not found' }, 404);

    // Same gate on premium if fetched by id
    const ebook = rowToEbook(data);
    if (ebook.premium) {
      const authHeader = request.headers.get('authorization') || '';
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      const claim = verifyEntitlement(token);
      const hasEntitlement = claim && claim.slug === ebook.slug;
      if (!hasEntitlement) {
        const totalChapters = (ebook.chapters || []).length;
        const preview = (ebook.chapters || []).slice(0, 1);
        return json({ ebook: { ...ebook, chapters: preview, totalChapters, locked: true } });
      }
    }
    return json({ ebook });
  }

  // DELETE /api/ebooks/:id (admin)
  if (method === 'DELETE' && segments[0] === 'ebooks' && segments.length === 2) {
    const id = segments[1];
    const { error } = await supabase.from('ebooks').delete().eq('id', id);
    if (error) return dbError('ebooks:delete', error);
    // covers cascade automatically via FK
    return json({ ok: true });
  }

  // ==========================================================================
  // Payments and fulfillment are handled entirely by Amazon KDP (off-platform).
  // What lives here: read-only ebook access + lead capture (newsletter, free
  // chapter, coming-soon notify, publish-with-us inquiries).
  // ==========================================================================

  // POST /api/newsletter — subscribe an email to the newsletter list
  // Body: { email, first_name?, source?='newsletter', country?, interests? }
  if (method === 'POST' && path === 'newsletter') {
    if (rateLimited(request, 'newsletter')) return json({ error: 'too many requests, please try again later' }, 429);
    try {
      const body = await request.json().catch(() => ({}));
      const email = cleanEmail(body.email);
      if (!email) return json({ error: 'valid email required' }, 400);

      // Only whitelisted columns, all sanitized — clients cannot set confirmed_at/unsubscribed_at etc.
      const row = {
        email,
        source: cleanSource(body.source, 'newsletter'),
        first_name: cleanText(body.first_name, 80),
        country: clientCountry(request, body.country),
        interests: cleanInterests(body.interests),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('newsletter_subscribers')
        .upsert(row, { onConflict: 'email' });

      if (error) {
        console.error('[newsletter] upsert error:', error.message);
        // If the table doesn't exist yet, provide a friendly (non-leaky) hint
        if (/relation.*does not exist|Could not find the table|schema cache|PGRST205/i.test(error.message)) {
          return json({
            error: 'newsletter_table_missing',
            message: 'Newsletter is not set up yet. Please try again later.',
          }, 503);
        }
        return json({ error: 'subscribe failed' }, 500);
      }

      return json({ ok: true, email, source: row.source });
    } catch (e) {
      console.error('[newsletter] error:', e?.message);
      return json({ error: 'subscribe failed' }, 500);
    }
  }

  // POST /api/free-chapter — capture email + return Chapter 1 of a preview-enabled book
  // Body: { email, slug? }  (slug defaults to Book 1; must be a SERIES entry with freeChapter:true)
  if (method === 'POST' && path === 'free-chapter') {
    if (rateLimited(request, 'free-chapter')) return json({ error: 'too many requests, please try again later' }, 429);
    try {
      const body = await request.json().catch(() => ({}));
      const email = cleanEmail(body.email);
      if (!email) return json({ error: 'valid email required' }, 400);

      const requestedSlug = cleanText(body.slug, 100) || 'new-canadian-blueprint';
      const series = SERIES_BY_SLUG[requestedSlug];
      if (!series || !series.freeChapter) return json({ error: 'no free chapter for this book' }, 404);
      const slug = series.slug;

      // Persist as newsletter subscriber (idempotent via ON CONFLICT email)
      const upsertRes = await supabase
        .from('newsletter_subscribers')
        .upsert({
          email,
          source: 'free_chapter',
          country: clientCountry(request),
          interests: { books: [slug] },
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });
      // Non-fatal: even if the table doesn't exist yet, still return the chapter.
      if (upsertRes.error) {
        console.warn('[free-chapter] subscribe non-fatal:', upsertRes.error.message);
      }

      // Chapter 1 from the seeded ebook; remaining chapters are returned as a locked table of contents.
      const { data: eb, error: e1 } = await supabase
        .from('ebooks')
        .select('id, title, author, description, chapters, has_cover')
        .eq('slug', slug)
        .maybeSingle();
      if (e1) console.error('[free-chapter] ebook fetch:', e1.message);
      if (e1 || !eb) return json({ error: 'sample not available yet' }, 404);

      const chapters = Array.isArray(eb.chapters) ? eb.chapters : [];
      const first = chapters[0] || null;
      const toc = chapters.map((c, i) => ({ index: i, title: c?.title || `Chapter ${i + 1}`, locked: i > 0 }));
      const available = !!bestAmazonUrl(series);

      return json({
        ok: true,
        email,
        book: {
          id: eb.id,
          slug,
          title: eb.title,
          author: eb.author,
          description: eb.description,
          hasCover: !!eb.has_cover,
          available,
          comingSoon: !available,
          kindleUrl: series.kindleUrl,
          paperbackUrl: series.paperbackUrl,
        },
        chapter: first,
        toc,
        totalChapters: chapters.length,
      });
    } catch (e) {
      console.error('[free-chapter] error:', e?.message);
      return json({ error: 'free chapter failed' }, 500);
    }
  }

  // POST /api/publish-inquiry — "Publish With Us" form for other authors
  // Body: { name, email, bookTitle?, genre?, stage?, message? }
  // Stored in newsletter_subscribers with source='publish_inquiry' (no extra table needed);
  // details live in interests.publish and are exported in the /api/leads CSV "details" column.
  if (method === 'POST' && path === 'publish-inquiry') {
    if (rateLimited(request, 'publish-inquiry')) return json({ error: 'too many requests, please try again later' }, 429);
    try {
      const body = await request.json().catch(() => ({}));
      const email = cleanEmail(body.email);
      const name = cleanText(body.name, 80);
      if (!email) return json({ error: 'valid email required' }, 400);
      if (!name) return json({ error: 'name required' }, 400);

      const publish = {
        bookTitle: cleanText(body.bookTitle, 200),
        genre: cleanText(body.genre, 80),
        stage: cleanText(body.stage, 40),
        message: cleanText(body.message, 1500),
        submittedAt: new Date().toISOString(),
      };

      // Keep any existing interests (e.g. books) if this email is already a subscriber
      const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('interests')
        .eq('email', email)
        .maybeSingle();
      const prior = existing?.interests && typeof existing.interests === 'object' && !Array.isArray(existing.interests) ? existing.interests : {};

      const { error } = await supabase
        .from('newsletter_subscribers')
        .upsert({
          email,
          first_name: name,
          source: 'publish_inquiry',
          country: clientCountry(request),
          interests: { ...prior, publish },
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });

      if (error) {
        console.error('[publish-inquiry] upsert error:', error.message);
        return json({ error: 'could not submit inquiry' }, 500);
      }
      return json({ ok: true, email, name });
    } catch (e) {
      console.error('[publish-inquiry] error:', e?.message);
      return json({ error: 'could not submit inquiry' }, 500);
    }
  }

  // GET /api/leads — admin-only export of newsletter subscribers (CSV/JSON)
  // Auth: X-Admin-Secret header (enforced by the auth gate above; query-string secrets are NOT accepted)
  if (method === 'GET' && path === 'leads') {
    try {
      const url = new URL(request.url);
      const format = (url.searchParams.get('format') || 'json').toLowerCase();

      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('email, first_name, source, country, interests, created_at, confirmed_at, unsubscribed_at')
        .order('created_at', { ascending: false })
        .limit(10000);
      if (error) return dbError('leads:select', error);

      if (format === 'csv') {
        const rows = data || [];
        const header = 'email,first_name,source,country,details,created_at,confirmed_at,unsubscribed_at';
        const body = rows
          .map((r) => [r.email, r.first_name, r.source, r.country, r.interests ? JSON.stringify(r.interests) : '', r.created_at, r.confirmed_at, r.unsubscribed_at]
            .map(csvCell).join(','))
          .join('\n');
        return new Response(header + '\n' + body, {
          status: 200,
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="leads.csv"',
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff',
          },
        });
      }
      return json({ ok: true, count: (data || []).length, rows: data });
    } catch (e) {
      console.error('[leads] error:', e?.message);
      return json({ error: 'leads export failed' }, 500);
    }
  }

  // GET /api/geo — lightweight country detection (Amazon KDP handles all pricing)
  if (method === 'GET' && path === 'geo') {
    const country = clientCountry(request) || 'CA';
    return json({ country, isCanada: country === 'CA' });
  }

  // GET /api/catalog — return the Amazon KDP catalog for the landing page
  if (method === 'GET' && path === 'catalog') {
    const country = (
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') ||
      'CA'
    ).toUpperCase();
    return json({
      country,
      series: [...SERIES]
        .sort((a, b) => (a.order || 99) - (b.order || 99))
        .map((b) => ({
        slug: b.slug,
        order: b.order || null,
        startHere: !!b.startHere,
        step: b.step,
        title: b.title,
        subtitle: b.subtitle,
        tagline: b.tagline,
        hook: b.hook,
        accent: b.accent,
        kindleUrl: b.kindleUrl,
        paperbackUrl: b.paperbackUrl,
        isbn13: b.isbn13 || null,
        amazonTitle: b.amazonTitle || null,
        amazonUrl: bestAmazonUrl(b),
        available: !!bestAmazonUrl(b),
        freeChapter: !!b.freeChapter,
      })),
    });
  }


  // POST /api/entitlements/check — { email, slug } → issue JWT if entitlement exists (legacy)
  if (method === 'POST' && path === 'entitlements/check') {
    if (rateLimited(request, 'entitlements')) return json({ error: 'too many requests, please try again later' }, 429);
    try {
      const body = await request.json().catch(() => ({}));
      const email = cleanEmail(body.email);
      const slug = cleanText(body.slug, 100);
      if (!email || !slug) return json({ error: 'email and slug required' }, 400);
      const { data, error } = await supabase
        .from('entitlements')
        .select('id,created_at')
        .eq('email', email)
        .eq('ebook_slug', slug)
        .maybeSingle();
      if (error) return dbError('entitlements:select', error);
      if (!data) return json({ entitled: false }, 200);
      const token = signEntitlement({ email, ebookSlug: slug });
      return json({ entitled: true, token, since: data.created_at });
    } catch (e) {
      console.error('[entitlements] error:', e?.message);
      return json({ error: 'lookup failed' }, 500);
    }
  }

  // POST /api/ncb/upload-cover (admin) — upload custom cover from base64 for any slug
  // Body: { slug?: string (default: 'new-canadian-blueprint'), imageBase64: string, contentType?: string }
  if (method === 'POST' && (path === 'ncb/upload-cover' || path === 'cover/upload')) {
    try {
      const body = await request.json().catch(() => ({}));
      const b64 = typeof (body.imageBase64 || body.b64) === 'string' ? (body.imageBase64 || body.b64) : '';
      const contentType = cleanText(body.contentType, 50) || 'image/jpeg';
      const slug = cleanText(body.slug, 100) || 'new-canadian-blueprint';
      if (!b64) return json({ error: 'imageBase64 required' }, 400);
      if (b64.length > 6 * 1024 * 1024) return json({ error: 'image too large (max ~4.5MB)' }, 413);
      const { data: eb, error: e1 } = await supabase.from('ebooks').select('id').eq('slug', slug).maybeSingle();
      if (e1 || !eb) return json({ error: 'ebook not found', slug }, 404);
      await supabase
        .from('covers')
        .upsert({ ebook_id: eb.id, image_base64: b64, updated_at: new Date().toISOString() }, { onConflict: 'ebook_id' });
      await supabase.from('ebooks').update({ has_cover: true }).eq('id', eb.id);
      return json({ ok: true, ebookId: eb.id, slug, contentType });
    } catch (e) {
      return json({ error: 'upload failed', detail: e?.message }, 500);
    }
  }

  // POST /api/ncb/seed — pre-seed New Canadian Blueprint into ebooks table (idempotent)
  if (method === 'POST' && path === 'ncb/seed') {
    try {
      const result = await seedNewCanadianBlueprint();
      return json(result);
    } catch (e) {
      return json({ error: 'ncb seed failed', detail: e?.message }, 500);
    }
  }

  // POST /api/idshield/seed — pre-seed Identity Theft Protection into ebooks table (idempotent)
  if (method === 'POST' && path === 'idshield/seed') {
    try {
      const result = await seedIdentityTheftProtection();
      return json(result);
    } catch (e) {
      return json({ error: 'idshield seed failed', detail: e?.message }, 500);
    }
  }

  // POST /api/elephant/seed — pre-seed Scan Whole Elephant into ebooks table (idempotent)
  if (method === 'POST' && path === 'elephant/seed') {
    try {
      const result = await seedScanWholeElephant();
      return json(result);
    } catch (e) {
      return json({ error: 'elephant seed failed', detail: e?.message }, 500);
    }
  }

  return json({ error: 'not found', path, method }, 404);
}

export async function GET(request, { params }) {
  const p = await params;
  return handle(request, 'GET', p?.path || []);
}
export async function POST(request, { params }) {
  const p = await params;
  return handle(request, 'POST', p?.path || []);
}
export async function DELETE(request, { params }) {
  const p = await params;
  return handle(request, 'DELETE', p?.path || []);
}
export async function PUT(request, { params }) {
  const p = await params;
  return handle(request, 'PUT', p?.path || []);
}
