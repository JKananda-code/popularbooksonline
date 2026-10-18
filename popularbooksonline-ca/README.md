# PopularBooksOnline

**popularbooksonline.ca** — an AI-powered ebook library. Type any topic and receive a fully-written ebook with a title, author pen name, chapters, and a painterly AI-generated cover in about a minute.

Built with:

- **Next.js 15 (App Router, JavaScript)** + Tailwind + shadcn/ui
- **Supabase** (Postgres, free tier) — persistent storage
- **Emergent Universal LLM proxy** — `gpt-4o-mini` for text, `gemini/gemini-2.5-flash-image` for cover art

---

## Local development

```bash
# 1. Install
yarn install

# 2. Environment
cp .env.example .env
# → edit .env: fill SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, EMERGENT_LLM_KEY

# 3. Create the two tables in your Supabase project
#    (run schema.sql in the Supabase SQL editor — see "Deploying" section below)

# 4. Run
yarn dev
# → http://localhost:3000
```

## API surface

All routes live in a single Next.js catch-all: `app/api/[[...path]]/route.js`.

| Method | Path                                    | Purpose                                   |
| ------ | --------------------------------------- | ----------------------------------------- |
| GET    | `/api/health`                           | Health check                              |
| GET    | `/api/ebooks`                           | List all ebooks (no chapter content)      |
| GET    | `/api/ebooks/:id`                       | Full ebook with chapters                  |
| POST   | `/api/ebooks/generate`                  | AI-generate an ebook + cover              |
| DELETE | `/api/ebooks/:id`                       | Remove ebook (cover cascades)             |
| GET    | `/api/ebooks/:id/cover`                 | Serve the cover image (PNG)               |
| POST   | `/api/ebooks/:id/cover-generate`        | Regenerate the cover                      |
| POST   | `/api/seed`                             | Seed 3 sample ebooks (only if empty)      |

---

## Database schema (Supabase / Postgres)

Run this once in the Supabase SQL editor:

```sql
CREATE TABLE ebooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  author text,
  description text,
  emoji text,
  cover_from text,
  cover_to text,
  topic text,
  style text,
  audience text,
  chapters jsonb,
  word_count int,
  read_minutes int,
  has_cover boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE covers (
  ebook_id uuid PRIMARY KEY REFERENCES ebooks(id) ON DELETE CASCADE,
  image_base64 text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ebooks DISABLE ROW LEVEL SECURITY;
ALTER TABLE covers DISABLE ROW LEVEL SECURITY;
```

RLS is disabled because all DB access happens from server-side API routes using the **service role key**, which bypasses RLS anyway.

---

## Deploying to Vercel + NameCheap DNS

You will connect:

- **GitHub** (`JKananda-code`) → holds the code
- **Vercel** (team `kanandarepos`) → builds & hosts
- **Supabase** (free tier) → Postgres database
- **NameCheap** → registrar for `popularbooksonline.ca`

### Step 1 — Set up Supabase

1. Go to https://supabase.com/dashboard → **New Project** (Free tier).
2. Name it `popularbooksonline`, save the DB password somewhere, pick a region close to your Vercel region.
3. Wait ~1 min for provisioning.
4. **SQL Editor → + New query** → paste the schema SQL above → **Run**.
5. **Project Settings → API** → copy:
   - **Project URL** (e.g. `https://czatcngbzauwuythptsq.supabase.co`) → this is `SUPABASE_URL`
   - **service_role** secret key (starts with `sb_secret_...` or a `eyJ...` JWT) → this is `SUPABASE_SERVICE_ROLE_KEY`

### Step 2 — Push code to GitHub

```bash
cd /app
git init
git add .
git commit -m "PopularBooksOnline: Supabase-powered initial deploy"
git branch -M main
git remote add origin https://github.com/JKananda-code/popularbooksonline.git
git push -u origin main
```

Create the repo `JKananda-code/popularbooksonline` at https://github.com/new first (private is fine).

### Step 3 — Import into Vercel

1. https://vercel.com/new → make sure you're in the `kanandarepos` team.
2. Select the GitHub repo → **Import**.
3. Framework preset auto-detects **Next.js**. Leave defaults.
4. Under **Environment Variables**, add:

   | Key                          | Value                                            |
   | ---------------------------- | ------------------------------------------------ |
   | `SUPABASE_URL`               | your Supabase project URL                        |
   | `SUPABASE_SERVICE_ROLE_KEY`  | your Supabase service_role secret                |
   | `EMERGENT_LLM_KEY`           | your `sk-emergent-…` key                         |
   | `NEXT_PUBLIC_BASE_URL`       | `https://popularbooksonline.ca`                 |
   | `CORS_ORIGINS`               | `*`                                              |

5. **Deploy**. First build takes ~2-3 min.
6. Once green, visit the `*.vercel.app` URL and click **Write my first ebook**.

> **Function duration** — ebook generation takes ~15-25s. The routes declare `export const maxDuration = 120;` which requires a **Vercel Pro/Team plan** (Hobby caps at 60s). You already have a subscription.

### Step 4 — Attach the custom domain

**In Vercel:**

1. Project → **Settings → Domains → Add** → `popularbooksonline.ca`.
2. Also add `www.popularbooksonline.ca` (Vercel will offer redirection).
3. Vercel shows the DNS records to configure.

**In NameCheap:**

1. Domain List → **Manage** next to `popularbooksonline.ca`.
2. **Advanced DNS** tab. Remove any parking / conflicting records.
3. Add:
   - **A Record** → Host `@` → Value `76.76.21.21` → TTL Automatic
   - **CNAME Record** → Host `www` → Value `cname.vercel-dns.com.` → TTL Automatic
4. Save. DNS propagates in minutes.

Vercel will flip domain status to ✅ *Valid* and auto-issue Let's Encrypt SSL. `https://popularbooksonline.ca` is live.

### Step 5 — Post-deploy checks

- `https://popularbooksonline.ca/` → landing page loads
- `https://popularbooksonline.ca/api/health` → `{ok:true,service:"popularbooksonline",db:"supabase",...}`
- Click **Write an ebook** → after ~20s a new book appears on the shelf, with cover art
- In Supabase → **Table Editor → ebooks** → confirm the new row exists

If cover generation fails but the ebook is saved, check Vercel function logs → confirm `EMERGENT_LLM_KEY` has budget.

---

## Ongoing deployment

Every `git push` to `main` → Vercel auto-deploys production. PRs get preview deployments.

Roll back: **Vercel → Deployments → pick previous → Promote to Production**.
