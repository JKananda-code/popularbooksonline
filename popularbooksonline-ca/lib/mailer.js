// lib/mailer.js — Gmail SMTP (App Password) via Nodemailer.
// Sends (1) an owner notification for every new lead and (2) a welcome email to the reader.
// Fully optional: if GMAIL_USER / GMAIL_APP_PASSWORD are not set, every call is a silent no-op.
import nodemailer from 'nodemailer';

const SMTP_TIMEOUT_MS = 6000;
const SITE_NAME = 'PopularBooksOnline';

function siteUrl() {
  return (process.env.NEXT_PUBLIC_BASE_URL || 'https://popularbooksonline.ca').replace(/\/$/, '');
}

export function mailerConfigured() {
  return !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

let _transport = null;
function transport() {
  if (_transport) return _transport;
  const user = (process.env.GMAIL_USER || '').trim();
  // Google displays the app password as 4 groups of 4 — strip any whitespace.
  const pass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
  _transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
    tls: { minVersion: 'TLSv1.2' },
  });
  return _transport;
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)),
  ]);
}

export function escapeHtml(v) {
  return String(v ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// ---------- shared layout ----------
const C = { bg: '#f8f1e7', card: '#fdf6e3', border: '#e6d5b8', ink: '#2b1d10', muted: '#5c4429', accent: '#7c2d12', gold: '#b45309', amazon: '#ff9900', amazonInk: '#131a22' };

function button(href, label, variant = 'accent') {
  const styles = {
    accent: `background:${C.accent};color:#ffffff;`,
    kindle: `background:${C.amazon};color:${C.amazonInk};`,
    paperback: `background:${C.amazonInk};color:${C.amazon};`,
  }[variant];
  return `<a href="${escapeHtml(href)}" style="display:inline-block;${styles}font-weight:700;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;margin:4px 6px 4px 0">${escapeHtml(label)}</a>`;
}

function amazonButtons(book) {
  if (!book) return '';
  const parts = [];
  if (book.kindleUrl) parts.push(button(book.kindleUrl, `Kindle — ${book.title}`, 'kindle'));
  if (book.paperbackUrl) parts.push(button(book.paperbackUrl, `Paperback — ${book.title}`, 'paperback'));
  return parts.join('');
}

function layout({ preheader, title, bodyHtml, footerNote }) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:${C.bg};font-family:Georgia,'Times New Roman',serif;color:${C.ink}">
  <span style="display:none!important;opacity:0;color:transparent;height:0;width:0;overflow:hidden">${escapeHtml(preheader || '')}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${C.bg};padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:${C.card};border:1px solid ${C.border};border-radius:16px;overflow:hidden">
        <tr><td style="padding:22px 28px;border-bottom:1px solid ${C.border}">
          <div style="font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:${C.gold};font-weight:700">${SITE_NAME}</div>
          <div style="font-size:22px;font-weight:700;margin-top:6px;color:${C.ink}">${escapeHtml(title)}</div>
        </td></tr>
        <tr><td style="padding:24px 28px;font-size:16px;line-height:1.65;color:${C.ink}">${bodyHtml}</td></tr>
        <tr><td style="padding:16px 28px 22px;border-top:1px solid ${C.border};font-size:12px;color:${C.muted};font-family:Arial,sans-serif;line-height:1.5">
          ${footerNote ? `<div style="margin-bottom:8px">${footerNote}</div>` : ''}
          <div>The Blueprint Series by Johana Baraka · <a href="${siteUrl()}" style="color:${C.accent}">${siteUrl().replace(/^https?:\/\//, '')}</a></div>
          <div style="margin-top:6px">You're receiving this because you entered your email on our website. Reply to this email to reach us or to unsubscribe.</div>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

// ---------- reader (welcome) templates ----------
// ctx: { type, email, name, book: {slug,title,kindleUrl,paperbackUrl,comingSoon}, series: [...], inquiry: {...} }
function readerTemplate(ctx) {
  const first = (ctx.name || '').trim().split(/\s+/)[0] || 'there';
  const site = siteUrl();
  const readLink = (slug) => `${site}/?read=${encodeURIComponent(slug)}`;
  const book1 = (ctx.series || []).find((b) => b.slug === 'new-canadian-blueprint');
  const book2 = (ctx.series || []).find((b) => b.slug === 'identity-theft-protection-canada');
  const liveBooks = (ctx.series || []).filter((b) => b.kindleUrl || b.paperbackUrl);
  const liveButtons = liveBooks.map(amazonButtons).join('');

  switch (ctx.type) {
    case 'free_chapter': {
      const b = ctx.book || book1;
      if (b?.comingSoon) {
        return {
          subject: `Your free preview of ${b.title} — Chapter 1 inside`,
          preheader: 'Chapter 1 is ready to read. The rest of the book is coming soon to Amazon.',
          title: `Chapter 1 of ${b.title} is yours`,
          body: `<p>Hi ${escapeHtml(first)},</p>
<p>Thank you for reading. <b>${escapeHtml(b.title)}</b> is being finished for Amazon Kindle &amp; Paperback — Chapter 1 is ready for you now, and you're on the list to hear the day the full book launches.</p>
<p style="text-align:center;margin:22px 0">${button(readLink(b.slug), 'Read Chapter 1 now')}</p>
<p>While you wait, the first two volumes of the Blueprint Series are available on Amazon.ca:</p>
<p>${liveButtons}</p>
<p>Warmly,<br>Johana Baraka</p>`,
        };
      }
      return {
        subject: `Your free chapter of ${b?.title || 'New Canadian Blueprint'} is ready`,
        preheader: 'Read Chapter 1 in your browser — then get the full book on Amazon.ca.',
        title: 'Your free chapter is ready',
        body: `<p>Hi ${escapeHtml(first)},</p>
<p>Thank you for reading <b>${escapeHtml(b?.title || 'New Canadian Blueprint')}</b>. Chapter 1 opens right in your browser — no download needed.</p>
<p style="text-align:center;margin:22px 0">${button(readLink(b?.slug || 'new-canadian-blueprint'), 'Read Chapter 1 now')}</p>
<p>When you're ready for the full book, it's on Amazon.ca in both editions:</p>
<p>${amazonButtons(b || book1)}</p>
${book2 ? `<p style="font-size:14px;color:${C.muted}">Also in the series: ${amazonButtons(book2)}</p>` : ''}
<p>Warmly,<br>Johana Baraka</p>`,
      };
    }
    case 'coming_soon_notify': {
      const title = ctx.bookTitle || ctx.book?.title || 'Scan Whole Elephant';
      return {
        subject: `You're on the list: ${title}`,
        preheader: `We'll email you the day ${title} launches on Amazon.`,
        title: `You're on the launch list`,
        body: `<p>Hi ${escapeHtml(first)},</p>
<p>You'll be the first to know the day <b>${escapeHtml(title)}</b> goes live on Amazon Kindle &amp; Paperback.</p>
${ctx.book?.slug ? `<p>Can't wait? Chapter 1 is already free to read:</p><p style="text-align:center;margin:18px 0">${button(readLink(ctx.book.slug), 'Read Chapter 1 free')}</p>` : ''}
<p>In the meantime, the first two volumes of the Blueprint Series are available now:</p>
<p>${liveButtons}</p>
<p>Warmly,<br>Johana Baraka</p>`,
      };
    }
    case 'publish_inquiry': {
      const q = ctx.inquiry || {};
      const row = (k, v) => (v ? `<tr><td style="padding:4px 10px 4px 0;color:${C.muted};white-space:nowrap">${k}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>` : '');
      return {
        subject: 'We received your publishing inquiry',
        preheader: 'Thank you — we read every message and reply within a few days.',
        title: 'Thank you for reaching out',
        body: `<p>Hi ${escapeHtml(first)},</p>
<p>We received your <b>Publish With Us</b> inquiry and will reply to this address within a few days. Here is what you sent:</p>
<table role="presentation" cellspacing="0" cellpadding="0" style="font-size:15px;margin:8px 0 16px">
${row('Working title', q.bookTitle)}${row('Genre / topic', q.genre)}${row('Stage', q.stage)}${row('Message', q.message)}
</table>
<p>Just reply to this email if you'd like to add anything.</p>
<p>Warmly,<br>Johana Baraka<br><span style="font-size:13px;color:${C.muted}">${SITE_NAME}</span></p>`,
      };
    }
    case 'newsletter':
    default:
      return {
        subject: 'Welcome to PopularBooksOnline',
        preheader: 'New books, the free chapter, and the newcomer forum — straight to your inbox.',
        title: 'Welcome aboard',
        body: `<p>Hi ${escapeHtml(first)},</p>
<p>Thank you for joining. You'll hear from us when a new Blueprint Series book launches, when the newcomer forum opens, and occasionally with practical tips for life in Canada — never spam.</p>
<p>Start with a free chapter, right in your browser:</p>
<p style="text-align:center;margin:18px 0">${button(readLink('new-canadian-blueprint'), 'Read Chapter 1 free')}</p>
<p>Or jump straight to the books on Amazon.ca:</p>
<p>${liveButtons}</p>
<p>Warmly,<br>Johana Baraka</p>`,
      };
  }
}

// ---------- owner notification ----------
const TYPE_LABEL = {
  newsletter: 'Newsletter signup',
  free_chapter: 'Free chapter unlocked',
  coming_soon_notify: 'Coming-soon waitlist',
  publish_inquiry: 'Publish With Us inquiry',
};

function ownerTemplate(ctx) {
  const label = TYPE_LABEL[ctx.type] || ctx.type;
  const rows = [
    ['Type', label],
    ['Email', ctx.email],
    ['Name', ctx.name],
    ['Book', ctx.book?.title || ctx.bookTitle],
    ['Country', ctx.country],
    ['Working title', ctx.inquiry?.bookTitle],
    ['Genre', ctx.inquiry?.genre],
    ['Stage', ctx.inquiry?.stage],
    ['Message', ctx.inquiry?.message],
    ['When', new Date().toUTCString()],
  ].filter(([, v]) => v);
  const table = rows
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:${C.muted};font-family:Arial,sans-serif;font-size:13px;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 0;font-size:15px">${escapeHtml(v).replaceAll('\n', '<br>')}</td></tr>`)
    .join('');
  const who = ctx.name ? `${ctx.name} <${ctx.email}>` : ctx.email;
  return {
    subject: `[${SITE_NAME}] ${label}: ${who}`,
    preheader: `${label} from ${who}`,
    title: label,
    body: `<table role="presentation" cellspacing="0" cellpadding="0">${table}</table>
<p style="margin-top:18px;font-size:14px;color:${C.muted};font-family:Arial,sans-serif">Reply to this email to answer ${escapeHtml(ctx.name || 'the reader')} directly. Export all leads: <code>${siteUrl()}/api/leads?format=csv</code> (X-Admin-Secret header).</p>`,
    footerNote: 'Owner notification — sent automatically by your website.',
  };
}

// ---------- public API ----------
/**
 * Send owner notification + reader welcome for a new lead. Never throws.
 * ctx: { type, email, name?, country?, book?, bookTitle?, series?, inquiry?, skipReader? }
 * Returns { owner: 'sent'|'failed'|'skipped', reader: 'sent'|'failed'|'skipped' }
 */
export async function notifyLead(ctx) {
  const result = { owner: 'skipped', reader: 'skipped' };
  if (!mailerConfigured()) return result;
  const from = `${SITE_NAME} <${(process.env.GMAIL_USER || '').trim()}>`;
  const owner = (process.env.OWNER_EMAIL || process.env.GMAIL_USER || '').trim();
  const t = transport();
  const jobs = [];

  if (owner) {
    const o = ownerTemplate(ctx);
    jobs.push(['owner', t.sendMail({
      from,
      to: owner,
      replyTo: ctx.email,
      subject: o.subject,
      html: layout({ preheader: o.preheader, title: o.title, bodyHtml: o.body, footerNote: o.footerNote }),
      text: `${o.title}\n\n${ctx.type} — ${ctx.email}${ctx.name ? ` (${ctx.name})` : ''}`,
    })]);
  }
  if (ctx.email && !ctx.skipReader) {
    const r = readerTemplate(ctx);
    jobs.push(['reader', t.sendMail({
      from,
      to: ctx.email,
      replyTo: owner || undefined,
      subject: r.subject,
      html: layout({ preheader: r.preheader, title: r.title, bodyHtml: r.body }),
      text: `${r.title}\n\nOpen ${siteUrl()} to read your free chapter and find the books on Amazon.ca.`,
    })]);
  }

  const settled = await Promise.allSettled(jobs.map(([, p]) => withTimeout(p, SMTP_TIMEOUT_MS + 2000, 'sendMail')));
  settled.forEach((s, i) => {
    const key = jobs[i][0];
    result[key] = s.status === 'fulfilled' ? 'sent' : 'failed';
    if (s.status === 'rejected') console.error(`[mailer] ${key} email failed:`, s.reason?.message || s.reason);
  });
  return result;
}

/** Verify SMTP credentials (used by the admin test route). */
export async function verifyMailer() {
  if (!mailerConfigured()) return { ok: false, error: 'GMAIL_USER / GMAIL_APP_PASSWORD not configured' };
  try {
    await withTimeout(transport().verify(), SMTP_TIMEOUT_MS + 2000, 'verify');
    return { ok: true, user: (process.env.GMAIL_USER || '').trim() };
  } catch (e) {
    return { ok: false, error: e?.message || String(e) };
  }
}
