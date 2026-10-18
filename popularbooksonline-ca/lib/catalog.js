// lib/catalog.js — Amazon KDP catalog (post-2026-08 pivot)
// Simplified: no payments, no shipping — we're an affiliate landing page now.
//
// Amazon ASINs are PUBLIC product identifiers, so the live ones are built in as defaults
// (verified on Amazon.ca 2026-10). An env var, if set, overrides the default — e.g. when
// Book 3 launches, set NEXT_PUBLIC_AMAZON_ELEPHANT_KINDLE / _PAPERBACK in Vercel (or edit below).
// An edition with no ASIN shows "Coming Soon — Notify Me" in the UI.
export const AMAZON_DEFAULTS = {
  BLUEPRINT_KINDLE: 'B0HF9L3KB7',     // New Canadian Blueprint — Kindle
  BLUEPRINT_PAPERBACK: 'B0HFXRWXHM',  // New Canadian Blueprint — Paperback (ISBN 979-8192217603)
  IDENTITY_KINDLE: 'B0HFQM6GQD',      // Identity Theft Protection — Kindle
  IDENTITY_PAPERBACK: 'B0HFWFT57P',   // Identity Theft Protection — Paperback
  ELEPHANT_KINDLE: '',                // Scan Whole Elephant — not on KDP yet
  ELEPHANT_PAPERBACK: '',
};

export const AMAZON_TLD = 'ca'; // Amazon.ca — matches the KDP publishing marketplace

// Helper to build a full Amazon URL from an ASIN or full URL.
export function amazonLink(asinOrUrl) {
  if (!asinOrUrl) return null;
  const s = String(asinOrUrl).trim();
  if (!s) return null;
  if (s.startsWith('http')) return s;
  return `https://www.amazon.${AMAZON_TLD}/dp/${s}`;
}

// Env var wins if present; otherwise fall back to the built-in default.
function asin(key) {
  const fromEnv = (process.env[`NEXT_PUBLIC_AMAZON_${key}`] || '').trim();
  return fromEnv || AMAZON_DEFAULTS[key] || '';
}

// The three-volume series. Each entry drives the landing page.
export const SERIES = [
  {
    order: 1,
    startHere: true,
    slug: 'new-canadian-blueprint',
    step: 'Step 1 · Foundation',
    title: 'New Canadian Blueprint',
    subtitle: 'The Foundation',
    tagline: 'Master your first 90 days and build the mental model of your new life.',
    hook: 'Written by an elder who walked every mile — warm voice, tactical playbooks, and the wisdom the settlement pamphlets never mention.',
    kindleUrl: amazonLink(asin('BLUEPRINT_KINDLE')),
    paperbackUrl: amazonLink(asin('BLUEPRINT_PAPERBACK')),
    // Verified on Amazon.ca (paperback listing B0HFXRWXHM): ISBN-13 979-8192217603, 75 pages
    isbn13: '979-8192217603',
    amazonTitle: 'New Canadian Blueprint: A Comprehensive Guide to Life, Work and Success in Canada: Your Strategic Pathway to Settlement, Finance and Career Success.',
    accent: '#7c2d12',
    freeChapter: true,
  },
  {
    order: 2,
    slug: 'identity-theft-protection-canada',
    step: 'Step 2 · Shield',
    title: 'Identity Theft Protection',
    subtitle: 'The Shield',
    tagline: 'Protect your SIN, credit, and digital life from scams targeting newcomers.',
    hook: '72-hour recovery playbook + 30-day family shield + Fridge Poster of the Golden Rule. Companion volume to the Blueprint.',
    kindleUrl: amazonLink(asin('IDENTITY_KINDLE')),
    paperbackUrl: amazonLink(asin('IDENTITY_PAPERBACK')),
    accent: '#0A1931',
    freeChapter: false,
  },
  {
    order: 3,
    slug: 'scan-whole-elephant',
    step: 'Step 3 · Deep Dive',
    title: 'Scan Whole Elephant',
    subtitle: 'The Deep Dive',
    tagline: 'Uncover every province, territory, and benefit Canada offers you.',
    hook: '13 provinces, 11 PNP streams, real newcomer stories — a field guide to Canada beyond Toronto and Vancouver.',
    kindleUrl: amazonLink(asin('ELEPHANT_KINDLE')),
    paperbackUrl: amazonLink(asin('ELEPHANT_PAPERBACK')),
    accent: '#2d4a2b',
    // Not on KDP yet: Chapter 1 is readable as a free preview, Chapters 2+ show as "Coming Soon".
    freeChapter: true,
  },
];

export const SERIES_BY_SLUG = Object.fromEntries(SERIES.map((b) => [b.slug, b]));

// Return the best Amazon URL for a book (Kindle preferred, then Paperback).
// Returns null if neither is live yet.
export function bestAmazonUrl(book) {
  if (!book) return null;
  return book.kindleUrl || book.paperbackUrl || null;
}
