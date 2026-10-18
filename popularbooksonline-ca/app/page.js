'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { BookOpen, Loader2, ChevronLeft, ChevronRight, X, Library, Clock, ShoppingCart, Sparkles, Shield, Mail, ExternalLink, Check, Compass, Tablet, Book, Lock, Bell, PenLine, Send } from 'lucide-react';
import { ChapterBody } from '@/lib/chapter-parser';

// ============================================================
// Reader — full-screen chapter viewer (used for the free chapter unlock)
// ============================================================
function Reader({ ebook, onClose, onNotify }) {
  const [ch, setCh] = useState(0);
  const chapter = ebook.chapters?.[ch] || null;
  const total = ebook.totalChapters || ebook.chapters?.length || 0;
  const unlocked = ebook.chapters?.length || 0;
  const toc = Array.isArray(ebook.toc) && ebook.toc.length ? ebook.toc : (ebook.chapters || []).map((c, i) => ({ index: i, title: c.title, locked: false }));
  const comingSoon = !!ebook.comingSoon;

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' && ch < unlocked - 1) setCh(ch + 1);
      if (e.key === 'ArrowLeft' && ch > 0) setCh(ch - 1);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [ch, unlocked, onClose]);

  if (!chapter) return null;

  return (
    <div className="fixed inset-0 z-50 paper-texture overflow-y-auto">
      <div className="sticky top-0 z-10 bg-[#f8f1e7]/90 backdrop-blur border-b border-[#e6d5b8]">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="text-2xl">📘</div>
            <div className="min-w-0">
              <div className="font-serif font-bold text-sm truncate">{ebook.title}</div>
              <div className="text-xs text-[#7a5c3a] truncate">by {ebook.author}</div>
            </div>
            <div className="hidden sm:flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
              {comingSoon ? 'Free Preview · Coming Soon' : 'Free Chapter'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7a5c3a] hidden sm:inline" data-testid="reader-progress">Chapter {ch + 1} / {total}</span>
            <Button variant="ghost" size="icon" onClick={onClose} data-testid="reader-close"><X className="w-5 h-5"/></Button>
          </div>
        </div>
      </div>

      <article className="max-w-2xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-[0.3em] text-[#7a5c3a] mb-3">Chapter {ch + 1}</div>
          <h1 className="font-serif text-4xl font-bold text-[#2b1d10]">{chapter.title}</h1>
          <div className="mt-4 flex items-center justify-center gap-2 text-[#a17c4a]">
            <div className="h-px w-8 bg-[#c9a874]"/>
            <span className="text-lg">✦</span>
            <div className="h-px w-8 bg-[#c9a874]"/>
          </div>
        </div>

        <div className="font-reader text-[1.15rem] text-[#2b1d10] prose-reader">
          <ChapterBody content={chapter.content} />
        </div>

        {/* Table of contents — Chapter 1 unlocked, the rest locked */}
        {toc.length > 1 && (
          <section className="mt-14" data-testid="reader-toc">
            <div className="text-center mb-5">
              <div className="text-xs uppercase tracking-[0.3em] text-[#7a5c3a]">Inside the book</div>
              <h2 className="mt-2 font-serif text-2xl font-bold text-[#2b1d10]">
                {comingSoon ? `${total} chapters — Chapter 1 is ready, the rest are on the way` : `${total} chapters in the full book`}
              </h2>
            </div>
            <ol className="rounded-xl border border-[#e6d5b8] bg-[#fdf6e3] divide-y divide-[#efe2c9] overflow-hidden">
              {toc.map((t, i) => (
                <li key={i} className={`flex items-center gap-3 px-4 py-3 text-sm ${t.locked ? 'text-[#8b6b45]' : 'text-[#2b1d10]'}`} data-testid={`toc-item-${i}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${t.locked ? 'bg-[#efe2c9] text-[#8b6b45]' : 'bg-[#7c2d12] text-white'}`}>
                    {t.locked ? <Lock className="w-3 h-3"/> : <Check className="w-3.5 h-3.5"/>}
                  </span>
                  <span className={`flex-1 font-serif ${t.locked ? '' : 'font-bold'}`}>{t.title}</span>
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded shrink-0 ${t.locked ? (comingSoon ? 'bg-[#efe2c9] text-[#8b6b45]' : 'bg-[#131a22] text-[#ff9900]') : 'bg-green-100 text-green-800'}`}>
                    {t.locked ? (comingSoon ? 'Coming Soon' : 'Full Book') : 'Free'}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {comingSoon ? (
          <div className="mt-10 p-6 bg-[#fdf6e3] border-2 border-[#c9a874] rounded-lg text-center" data-testid="reader-cta-coming-soon">
            <Clock className="w-10 h-10 text-[#7c2d12] mx-auto mb-3"/>
            <h3 className="font-serif text-2xl font-bold text-[#2b1d10]">The rest of this book is coming soon.</h3>
            <p className="mt-2 text-[#5c4429] font-reader">
              <b>{ebook.title}</b> is being finished for Amazon Kindle &amp; Paperback. Leave your email and you&apos;ll be the first to know the day it launches.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button onClick={() => onNotify?.(ebook.title)} className="bg-[#7c2d12] hover:bg-[#5b1f0c] gap-2" data-testid="reader-notify-btn">
                <Bell className="w-4 h-4"/> Notify me at launch
              </Button>
              <Button variant="outline" onClick={onClose} className="border-[#7c2d12] text-[#7c2d12] gap-2">
                Back to the Series <ChevronRight className="w-4 h-4"/>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-10 p-6 bg-amber-50 border-2 border-amber-300 rounded-lg text-center" data-testid="reader-cta-buy">
            <BookOpen className="w-10 h-10 text-amber-600 mx-auto mb-3"/>
            <h3 className="font-serif text-2xl font-bold text-amber-900">Enjoying the first chapter?</h3>
            <p className="mt-2 text-amber-800 font-reader">Get the full book — plus the whole Blueprint Series — on Amazon Kindle and Paperback.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {ebook.kindleUrl && (
                <a href={ebook.kindleUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#ff9900] hover:bg-[#e88b00] text-[#131a22] font-bold rounded-md h-10 px-4 text-sm">
                  <Tablet className="w-4 h-4"/> Kindle on Amazon.ca <ExternalLink className="w-3.5 h-3.5 opacity-70"/>
                </a>
              )}
              {ebook.paperbackUrl && (
                <a href={ebook.paperbackUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#131a22] hover:bg-[#232f3e] text-[#ff9900] font-bold rounded-md h-10 px-4 text-sm">
                  <Book className="w-4 h-4"/> Paperback on Amazon.ca <ExternalLink className="w-3.5 h-3.5 opacity-70"/>
                </a>
              )}
              <Button variant="outline" onClick={onClose} className="border-amber-600 text-amber-800 gap-2">
                Back to the Series <ChevronRight className="w-4 h-4"/>
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-center">
          <div className="text-xs text-[#7a5c3a]">— end of preview —</div>
        </div>
      </article>
    </div>
  );
}

// ============================================================
// Book Cover — cover art rendered from Supabase or gradient fallback
// ============================================================
function BookCover({ book, ebookId, hasCover, coverVersion = 0, className = '' }) {
  const from = book.accent || '#7c2d12';
  const to = '#b45309';
  const coverUrl = hasCover && ebookId ? `/api/ebooks/${ebookId}/cover?v=${coverVersion}` : null;
  return (
    <div
      className={`relative w-full aspect-[3/4] rounded-lg overflow-hidden book-shadow ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {coverUrl ? (
        <img src={coverUrl} alt={book.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy"/>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-6xl text-[#fdf6e3]/80">📖</div>
      )}
      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
        <div className="text-[10px] uppercase tracking-widest text-amber-200 font-bold">{book.step}</div>
      </div>
    </div>
  );
}

// ============================================================
// Book Card — shows cover + tagline + Amazon buttons (Kindle / Paperback) or "Coming Soon"
// ============================================================
const AMAZON_BTN = 'inline-flex items-center justify-center gap-1.5 font-bold rounded-md h-10 px-3 text-sm transition-colors whitespace-nowrap';

function AmazonButton({ href, label, icon: Icon, variant = 'kindle', full = false, testId, title }) {
  const styles = variant === 'kindle'
    ? 'bg-[#ff9900] hover:bg-[#e88b00] text-[#131a22]'
    : 'bg-[#131a22] hover:bg-[#232f3e] text-[#ff9900] border border-[#131a22]';
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      data-testid={testId}
      className={`${AMAZON_BTN} ${styles} ${full ? 'w-full' : ''}`}
    >
      <Icon className="w-4 h-4"/> {label} <ExternalLink className="w-3.5 h-3.5 opacity-70"/>
    </a>
  );
}

function BookCard({ book, ebook, coverVersion, onFreeChapter, onNotify }) {
  const kindleUrl = book.kindleUrl || null;
  const paperbackUrl = book.paperbackUrl || null;
  const available = !!(kindleUrl || paperbackUrl);
  const both = !!(kindleUrl && paperbackUrl);
  const coverBook = ebook ? { ...book, hasCover: ebook.hasCover, ebookId: ebook.id } : { ...book, hasCover: false };
  return (
    <div className={`group relative rounded-2xl border bg-[#fdf6e3] p-5 flex flex-col shadow-sm hover:shadow-lg transition ${book.startHere ? 'border-[#b45309] ring-2 ring-[#b45309]/30' : 'border-[#e6d5b8]'}`} data-testid={`book-card-${book.slug}`}>
      {book.startHere && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1.5 rounded-full bg-[#b45309] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow" data-testid="start-here-badge">
          <Sparkles className="w-3 h-3"/> Book 1 · Start Here
        </div>
      )}
      <BookCover
        book={book}
        ebookId={ebook?.id}
        hasCover={!!ebook?.hasCover}
        coverVersion={coverVersion}
        className="mb-4"
      />
      <div className="flex-1">
        <h3 className="font-serif text-xl font-bold leading-tight text-[#2b1d10]">{book.title}</h3>
        <p className="text-xs uppercase tracking-widest text-[#7c2d12] font-bold mt-1">{book.subtitle}</p>
        <p className="text-sm text-[#5c4429] mt-2 leading-relaxed">{book.tagline}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-[#e6d5b8] space-y-2">
        {available ? (
          <>
            <p className="text-[11px] uppercase tracking-widest text-[#8b6b45] font-semibold text-center flex items-center justify-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-green-700"/> Available at Amazon.ca
            </p>
            {both ? (
              <div className="grid grid-cols-2 gap-2">
                <AmazonButton href={kindleUrl} label="Kindle" icon={Tablet} variant="kindle" testId={`buy-kindle-${book.slug}`} title="Kindle edition — read instantly on any device" />
                <AmazonButton href={paperbackUrl} label="Paperback" icon={Book} variant="paperback" testId={`buy-paperback-${book.slug}`} title={book.isbn13 ? `Paperback · ISBN ${book.isbn13}` : 'Paperback — printed & shipped by Amazon'} />
              </div>
            ) : kindleUrl ? (
              <AmazonButton href={kindleUrl} label="Kindle Edition" icon={Tablet} variant="kindle" full testId={`buy-kindle-${book.slug}`} title="Kindle edition — read instantly on any device" />
            ) : (
              <AmazonButton href={paperbackUrl} label="Paperback" icon={Book} variant="paperback" full testId={`buy-paperback-${book.slug}`} title={book.isbn13 ? `Paperback · ISBN ${book.isbn13}` : 'Paperback — printed & shipped by Amazon'} />
            )}
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-[#c9a874] bg-[#f8f1e7] p-3 text-center space-y-2" data-testid={`coming-soon-${book.slug}`}>
            <p className="text-[11px] uppercase tracking-widest text-[#8b6b45] font-semibold flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5"/> Coming Soon to Amazon.ca
            </p>
            <p className="text-xs text-[#5c4429] leading-relaxed">
              {book.freeChapter ? 'Chapter 1 is ready to read now. The rest of the book is on its way.' : 'Not yet available. Be first to know when it launches.'}
            </p>
            <Button
              onClick={onNotify}
              variant="outline"
              className="w-full border-[#7c2d12] text-[#7c2d12] hover:bg-[#7c2d12] hover:text-white gap-2 bg-white/60"
              data-testid={`notify-${book.slug}`}
            >
              <Bell className="w-4 h-4"/> Notify Me at Launch
            </Button>
          </div>
        )}
        {book.freeChapter && (
          <Button
            onClick={onFreeChapter}
            variant={available ? 'ghost' : 'default'}
            className={available
              ? 'w-full gap-2 text-[#5c4429] hover:bg-[#7c2d12]/10 hover:text-[#7c2d12]'
              : 'w-full gap-2 bg-[#7c2d12] hover:bg-[#5b1f0c] text-white'}
            data-testid={`free-chapter-${book.slug}`}
          >
            <BookOpen className="w-4 h-4"/> {available ? 'Read the first chapter — free' : 'Read Chapter 1 — free preview'}
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Why Section
// ============================================================
function WhySection() {
  const points = [
    { icon: Compass, title: 'The Right Order', body: 'Foundation, then defence, then abundance. Each book builds on the last.' },
    { icon: Clock, title: 'Save Time', body: 'Skip 6–12 months of Google searches. The path is mapped for you.' },
    { icon: Shield, title: 'Save Trouble', body: 'Every scam avoided and every benefit claimed is a real dollar in your pocket.' },
    { icon: Sparkles, title: 'Warm Voice', body: 'Written by an elder who walked every mile. Calm authority, tactical playbooks.' },
  ];
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 border-t border-[#e6d5b8]">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-block px-3 py-1 rounded-full bg-[#7c2d12]/10 text-[#7c2d12] text-xs uppercase tracking-widest">Why the Series</div>
        <h2 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-[#2b1d10]">
          More than books — an integration suite.
        </h2>
        <p className="mt-3 text-[#5c4429]">
          Three volumes designed to work together. Read one, and you&apos;re oriented. Read all three, and Canada stops feeling foreign.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {points.map((p, i) => (
          <div key={i} className="rounded-xl bg-[#fdf6e3] border border-[#e6d5b8] p-5">
            <div className="w-10 h-10 rounded-full bg-[#7c2d12]/10 flex items-center justify-center mb-3">
              <p.icon className="w-5 h-5 text-[#7c2d12]"/>
            </div>
            <div className="font-serif text-lg font-bold text-[#2b1d10]">{p.title}</div>
            <div className="text-sm text-[#5c4429] mt-1 leading-relaxed">{p.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// Free Chapter Dialog — capture email + return Chapter 1 content
// ============================================================
function FreeChapterDialog({ open, onOpenChange, onUnlocked, book }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const slug = book?.slug || 'new-canadian-blueprint';
  const title = book?.title || 'New Canadian Blueprint';
  const comingSoon = book ? !book.available : false;

  const submit = async () => {
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return toast.error('Please enter a valid email');
    setLoading(true);
    const t = toast.loading('Unlocking your free chapter…');
    try {
      const res = await fetch('/api/free-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), slug }),
      });
      const data = await res.json();
      if (!res.ok || !data.chapter) throw new Error(data?.message || data?.error || 'Failed to unlock');
      toast.success("Enjoy your read! We'll be in touch with more.", { id: t });
      onOpenChange(false);
      onUnlocked({
        slug: data.book?.slug || slug,
        title: data.book?.title || title,
        author: data.book?.author || 'Johana Baraka',
        chapters: [data.chapter],
        toc: data.toc || [],
        totalChapters: data.totalChapters || 1,
        comingSoon: !!data.book?.comingSoon,
        kindleUrl: data.book?.kindleUrl || null,
        paperbackUrl: data.book?.paperbackUrl || null,
      });
      setEmail('');
    } catch (e) {
      toast.error(e.message || 'Something went wrong', { id: t });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#fdf6e3] border-[#c9a874]" data-testid="free-chapter-dialog">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">{comingSoon ? 'Read Chapter 1 — free preview' : 'Get your free chapter'}</DialogTitle>
          <DialogDescription>
            The first chapter of <b>{title}</b> — right in your browser, no download needed.
            {comingSoon ? ' The rest of the book is coming soon to Amazon; we\u2019ll tell you the day it launches.' : ''}
            {' '}Your email joins our list; we&apos;ll only write to share new books and the newcomer forum when it launches.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <label className="text-sm font-medium">Your email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="bg-white/70 border-[#c9a874]"
            onKeyDown={(e) => { if (e.key === 'Enter' && !loading) submit(); }}
            data-testid="free-chapter-email"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button onClick={submit} disabled={loading} className="bg-[#7c2d12] hover:bg-[#5b1f0c] gap-2" data-testid="free-chapter-submit">
            {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <BookOpen className="w-4 h-4"/>}
            {loading ? 'Unlocking…' : 'Read Chapter 1'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// Publish With Us Dialog — inquiry form for other authors
// ============================================================
const PUBLISH_STAGES = [
  { value: 'idea', label: 'Just an idea' },
  { value: 'draft', label: 'Writing the draft' },
  { value: 'manuscript', label: 'Finished manuscript' },
  { value: 'published', label: 'Already published elsewhere' },
];

function PublishDialog({ open, onOpenChange }) {
  const [form, setForm] = useState({ name: '', email: '', bookTitle: '', genre: '', stage: 'manuscript', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.name.trim()) return toast.error('Please tell us your name');
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) return toast.error('Please enter a valid email');
    setLoading(true);
    try {
      const res = await fetch('/api/publish-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, email: form.email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to send');
      setSent(true);
      toast.success('Thank you — we\u2019ll be in touch soon.');
    } catch (e) {
      toast.error(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const close = (v) => {
    onOpenChange(v);
    if (!v) setTimeout(() => { setSent(false); setForm({ name: '', email: '', bookTitle: '', genre: '', stage: 'manuscript', message: '' }); }, 300);
  };

  const inputCls = 'bg-white/70 border-[#c9a874]';
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-lg bg-[#fdf6e3] border-[#c9a874]" data-testid="publish-dialog">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl flex items-center gap-2"><PenLine className="w-5 h-5 text-[#7c2d12]"/> Publish With Us</DialogTitle>
          <DialogDescription>
            Have a book in you? We help newcomer and community authors print and publish on Amazon Kindle &amp; Paperback — cover design, interior layout, and launch. Tell us a little about your project.
          </DialogDescription>
        </DialogHeader>
        {sent ? (
          <div className="py-6 text-center" data-testid="publish-success">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-3"><Check className="w-6 h-6"/></div>
            <h3 className="font-serif text-xl font-bold text-[#2b1d10]">Inquiry received</h3>
            <p className="mt-2 text-sm text-[#5c4429]">Thank you, {form.name.split(' ')[0]}. We read every message and will reply to <b>{form.email}</b> within a few days.</p>
            <Button onClick={() => close(false)} className="mt-5 bg-[#7c2d12] hover:bg-[#5b1f0c]">Done</Button>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Your name *</label>
                <Input value={form.name} onChange={set('name')} placeholder="Amina Okafor" className={inputCls} data-testid="publish-name"/>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email *</label>
                <Input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className={inputCls} data-testid="publish-email"/>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Working title</label>
                <Input value={form.bookTitle} onChange={set('bookTitle')} placeholder="My book's title" className={inputCls} data-testid="publish-title"/>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Genre / topic</label>
                <Input value={form.genre} onChange={set('genre')} placeholder="Memoir, guide, fiction…" className={inputCls} data-testid="publish-genre"/>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium">Where are you in the journey?</label>
                <select value={form.stage} onChange={set('stage')} className="flex h-9 w-full rounded-md border border-[#c9a874] bg-white/70 px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-[#7c2d12]" data-testid="publish-stage">
                  {PUBLISH_STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium">Tell us about the book</label>
                <textarea
                  value={form.message}
                  onChange={set('message')}
                  rows={4}
                  maxLength={1500}
                  placeholder="Who is it for, what it covers, and how we can help (print, Kindle, cover, editing)…"
                  className="flex w-full rounded-md border border-[#c9a874] bg-white/70 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-[#7c2d12] resize-y"
                  data-testid="publish-message"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={() => close(false)} disabled={loading}>Cancel</Button>
              <Button onClick={submit} disabled={loading} className="bg-[#7c2d12] hover:bg-[#5b1f0c] gap-2" data-testid="publish-submit">
                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4"/>}
                {loading ? 'Sending…' : 'Send Inquiry'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// Notify-Me Dialog — for books not yet on Amazon
// ============================================================
function NotifyDialog({ open, onOpenChange, bookTitle }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return toast.error('Please enter a valid email');
    setLoading(true);
    const t = toast.loading('Adding you to the list…');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          source: 'coming_soon_notify',
          interests: { books: [bookTitle] },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || data?.message || 'Failed');
      toast.success("You're on the list — we'll email you the day it launches.", { id: t });
      onOpenChange(false);
      setEmail('');
    } catch (e) {
      toast.error(e.message || 'Please try again', { id: t });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#fdf6e3] border-[#c9a874]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Notify me when it lands</DialogTitle>
          <DialogDescription>
            {bookTitle ? <b>{bookTitle}</b> : 'This book'} is on its way to Amazon Kindle &amp; Paperback. Drop your email and we&apos;ll send you the link the moment it&apos;s live.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <label className="text-sm font-medium">Your email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="bg-white/70 border-[#c9a874]"
            onKeyDown={(e) => { if (e.key === 'Enter' && !loading) submit(); }}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button onClick={submit} disabled={loading} className="bg-[#7c2d12] hover:bg-[#5b1f0c] gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Mail className="w-4 h-4"/>}
            {loading ? 'Adding…' : 'Notify Me'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// Inline Newsletter Signup — big footer form
// ============================================================
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return toast.error('Please enter a valid email');
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), source: 'newsletter' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || data?.message || 'Failed');
      setSubscribed(true);
      toast.success('Welcome aboard!');
      setEmail('');
    } catch (err) {
      toast.error(err.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border-t border-[#e6d5b8] bg-gradient-to-b from-[#fdf6e3] to-[#f5e6c5]">
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7c2d12]/10 text-[#7c2d12] text-xs uppercase tracking-widest">
          <Mail className="w-3 h-3"/> Newsletter
        </div>
        <h2 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-[#2b1d10]">
          Join the newsletter.
        </h2>
        <p className="mt-3 text-[#5c4429] max-w-xl mx-auto">
          One thoughtful email a month: new book launches, a chapter or two, and early access to the Blueprint newcomer community forum when it opens.
        </p>
        {subscribed ? (
          <div className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-100 text-emerald-800 font-medium">
            <Check className="w-5 h-5"/> You&apos;re in — thank you.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/80 border-[#c9a874] flex-1"
              disabled={loading}
            />
            <Button type="submit" disabled={loading} className="bg-[#7c2d12] hover:bg-[#5b1f0c] gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Mail className="w-4 h-4"/>}
              {loading ? 'Adding…' : 'Subscribe'}
            </Button>
          </form>
        )}
        <p className="mt-4 text-xs text-[#7a5c3a]">
          No spam. Unsubscribe anytime. We only use your email to send book news.
        </p>
      </div>
    </section>
  );
}

// ============================================================
// Main App — KDP Landing Page
// ============================================================
const App = () => {
  const [catalog, setCatalog] = useState(null);
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [freeChapterOpen, setFreeChapterOpen] = useState(false);
  const [freeChapterBook, setFreeChapterBook] = useState(null); // null → Book 1
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyBook, setNotifyBook] = useState('');
  const [publishOpen, setPublishOpen] = useState(false);
  const [readerEbook, setReaderEbook] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [catRes, ebRes] = await Promise.all([
          fetch('/api/catalog').then((r) => r.json()),
          fetch('/api/ebooks').then((r) => r.json()),
        ]);
        setCatalog(catRes);
        setEbooks(ebRes.ebooks || []);
      } catch (_e) {
        // fail silently — page still renders with placeholder covers
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Open the "Publish With Us" form via /#publish deep link
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#publish') setPublishOpen(true);
  }, []);

  // Deep link from emails: /?read=<slug> opens the free-chapter dialog for that book
  const [deepLinkHandled, setDeepLinkHandled] = useState(false);
  useEffect(() => {
    if (deepLinkHandled || typeof window === 'undefined') return;
    const list = catalog?.series || [];
    if (!list.length) return;
    const slug = new URLSearchParams(window.location.search).get('read');
    if (slug) {
      const b = list.find((x) => x.slug === slug && x.freeChapter);
      if (b) { setFreeChapterBook(b); setFreeChapterOpen(true); }
    }
    setDeepLinkHandled(true);
  }, [catalog, deepLinkHandled]);

  const ebookBySlug = (slug) => ebooks.find((eb) => eb.slug === slug) || null;
  // Always Book 1 → Book 2 → Book 3, regardless of API ordering
  const series = [...(catalog?.series || [])].sort((a, b) => (a.order || 99) - (b.order || 99));
  const book1 = series.find((b) => b.startHere) || series[0] || null;

  const openFreeChapter = (book) => { setFreeChapterBook(book || book1); setFreeChapterOpen(true); };
  const openNotify = (title) => { setNotifyBook(title); setNotifyOpen(true); };

  const scrollTo = (id) => {
    if (typeof window === 'undefined') return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen paper-texture">
      {/* Nav */}
      <header className="border-b border-[#e6d5b8] bg-[#f8f1e7]/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-[#7c2d12] to-[#b45309] flex items-center justify-center text-white">
              <Library className="w-5 h-5"/>
            </div>
            <div>
              <div className="font-serif text-xl font-bold leading-none">PopularBooksOnline</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#7a5c3a]">popularbooksonline.ca · the blueprint series</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => scrollTo('trilogy')} className="hidden md:inline-flex text-[#5c4429] hover:text-[#2b1d10]">
              The Trilogy
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollTo('newsletter')} className="hidden md:inline-flex text-[#5c4429] hover:text-[#2b1d10]">
              Newsletter
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setPublishOpen(true)} className="hidden sm:inline-flex text-[#7c2d12] hover:text-[#5b1f0c] hover:bg-[#7c2d12]/10 gap-1.5 font-semibold" data-testid="nav-publish">
              <PenLine className="w-4 h-4"/> Publish With Us
            </Button>
            <Button onClick={() => openFreeChapter(book1)} className="bg-[#7c2d12] hover:bg-[#5b1f0c] gap-2" data-testid="nav-free-chapter">
              <BookOpen className="w-4 h-4"/> Free Chapter
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7c2d12]/10 text-[#7c2d12] text-xs uppercase tracking-widest">
              <Library className="w-3 h-3"/> The Blueprint Series · Vol. 1–3
            </div>
            <h1 className="mt-4 font-serif text-5xl md:text-6xl font-bold leading-[1.05] text-[#2b1d10]">
              From Green to Integrated:
              <span className="italic text-[#7c2d12]"> your blueprint for Canada.</span>
            </h1>
            <p className="mt-5 text-lg text-[#3a2a17] max-w-xl font-reader">
              A three-volume field guide for newcomers navigating a brand-new life in Canada. Warm elder voice, tactical playbooks, and the wisdom the settlement pamphlets never mention. Available on Amazon Kindle &amp; Paperback.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => scrollTo('trilogy')} className="bg-[#7c2d12] hover:bg-[#5b1f0c] gap-2">
                <ShoppingCart className="w-4 h-4"/> See the Trilogy
              </Button>
              <Button size="lg" variant="outline" onClick={() => openFreeChapter(book1)} className="border-[#7c2d12] text-[#7c2d12] gap-2" data-testid="hero-free-chapter">
                <BookOpen className="w-4 h-4"/> Read a Free Chapter
              </Button>
            </div>
          </div>
          <div className="relative h-[380px] hidden md:block">
            <div className="absolute inset-0 rounded-2xl overflow-hidden book-shadow">
              <img src="/library-hero.jpg" alt="library" className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b1d10]/40 via-transparent to-transparent"/>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[#fdf6e3] border border-[#c9a874] rounded-lg px-4 py-3 shadow-lg">
              <div className="text-xs uppercase tracking-widest text-[#7a5c3a]">Published from</div>
              <div className="font-serif font-bold">Calgary, Canada 🍁</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Trilogy */}
      <section id="trilogy" className="max-w-6xl mx-auto px-6 py-14 border-t border-[#e6d5b8] scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-block px-3 py-1 rounded-full bg-[#7c2d12]/10 text-[#7c2d12] text-xs uppercase tracking-widest">Bridge to Integration</div>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-[#2b1d10]">The three steps across the bridge.</h2>
          <p className="mt-3 text-[#5c4429]">
            Read in order. Each volume builds on the last — foundation, then defence, then abundance. Kindle &amp; Paperback on Amazon.
          </p>
        </div>
        {loading ? (
          <div className="py-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#7c2d12]"/></div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {series.map((b) => (
              <BookCard
                key={b.slug}
                book={b}
                ebook={ebookBySlug(b.slug)}
                coverVersion={0}
                onFreeChapter={() => openFreeChapter(b)}
                onNotify={() => openNotify(b.title)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Why the Series */}
      <WhySection />

      {/* Free Chapter Big CTA */}
      <section className="max-w-4xl mx-auto px-6 py-14 border-t border-[#e6d5b8]">
        <div className="rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-[#f5e6c5] p-8 md:p-12 text-center shadow-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-amber-950 text-xs font-bold uppercase tracking-widest">
            ✨ Free · No Purchase Required
          </div>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl font-bold text-[#2b1d10]">
            Read the first chapter — on us.
          </h2>
          <p className="mt-3 text-[#5c4429] max-w-xl mx-auto">
            Get the opening chapter of <b>New Canadian Blueprint</b> right in your browser. See the voice, feel the rhythm, decide for yourself before you head to Amazon.
          </p>
          <Button
            size="lg"
            onClick={() => openFreeChapter(book1)}
            className="mt-6 bg-amber-600 hover:bg-amber-700 gap-2 h-12 text-base px-6"
            data-testid="cta-free-chapter"
          >
            <BookOpen className="w-5 h-5"/> Unlock Chapter 1 — Free
          </Button>
          <p className="mt-3 text-xs text-[#7a5c3a]">
            We&apos;ll email you when new volumes launch. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <div id="newsletter" className="scroll-mt-24">
        <NewsletterSection />
      </div>

      <footer className="border-t border-[#e6d5b8] py-8 text-center text-xs text-[#7a5c3a] space-y-1">
        <div className="font-serif text-sm text-[#2b1d10]">PopularBooksOnline</div>
        <div>popularbooksonline.ca · published in Calgary, Canada 🍁</div>
        <div>Available on Amazon Kindle &amp; Paperback · The Blueprint Series</div>
        <div className="pt-2">
          <button type="button" onClick={() => setPublishOpen(true)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7c2d12] hover:text-[#5b1f0c] underline-offset-4 hover:underline" data-testid="footer-publish">
            <PenLine className="w-4 h-4"/> Print Your Book · Publish With Us
          </button>
        </div>
        <div className="opacity-70">© {new Date().getFullYear()} PopularBooksOnline. All rights reserved.</div>
      </footer>

      {/* Dialogs */}
      <FreeChapterDialog
        open={freeChapterOpen}
        onOpenChange={setFreeChapterOpen}
        onUnlocked={(ebook) => setReaderEbook(ebook)}
        book={freeChapterBook || book1}
      />
      <NotifyDialog
        open={notifyOpen}
        onOpenChange={setNotifyOpen}
        bookTitle={notifyBook}
      />
      <PublishDialog open={publishOpen} onOpenChange={setPublishOpen} />
      {readerEbook && (
        <Reader
          ebook={readerEbook}
          onClose={() => setReaderEbook(null)}
          onNotify={(title) => { setReaderEbook(null); openNotify(title); }}
        />
      )}
    </div>
  );
};

export default App;
