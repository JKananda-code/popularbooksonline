# PopularBooksOnline.ca — Deploy from your desktop (GitHub Desktop → Vercel)

This folder is the complete, production-ready code for popularbooksonline.ca
(Next.js 15, Supabase, Amazon KDP landing page). It contains NO secrets.

## 1. Replace your local repository contents

1. Open the folder on your computer that GitHub Desktop manages for this site
   (the one connected to Vercel).
2. Delete EVERYTHING inside it EXCEPT the hidden `.git` folder.
   (Old files such as `app/purchase`, `app/paperback`, `lib/stripe.js`,
   `lib/shopify.js` must disappear — that is why we clear the folder first.)
3. Copy everything from this unzipped folder into it.

## 2. Commit and push

1. Open GitHub Desktop → you will see the changed files.
2. Summary: `KDP finale: Book 3 preview, Publish With Us, security fixes`
3. Click **Commit to main** → then **Push origin**.
4. Vercel detects the push and builds automatically (about 2 minutes).

## 3. Vercel environment variables (REQUIRED — one time)

Without these the site loads, but Free Chapter, Newsletter, Notify Me, Publish With Us
and the leads export all fail. Vercel → your project → Settings → Environment Variables →
paste the 5 lines (real values are in the chat / your Supabase dashboard):

    SUPABASE_URL
    SUPABASE_SERVICE_ROLE_KEY
    ADMIN_SECRET
    JWT_LICENSE_SECRET
    NEXT_PUBLIC_BASE_URL = https://popularbooksonline.ca

Email notifications (Gmail App Password) — add these 3 as well:

    GMAIL_USER = jkananda5@gmail.com
    GMAIL_APP_PASSWORD = <16-character app password>
    OWNER_EMAIL = jkananda5@gmail.com

Every new lead then triggers (a) a notification to OWNER_EMAIL with Reply-To set to the
reader, and (b) a welcome email to the reader (free chapter link + Amazon buttons).
Test after deploy:  POST /api/admin/mail-test  with header X-Admin-Secret.

Amazon links are built into the code (lib/catalog.js → AMAZON_DEFAULTS), so no Amazon
variables are needed. When Book 3 launches, add NEXT_PUBLIC_AMAZON_ELEPHANT_KINDLE and
NEXT_PUBLIC_AMAZON_ELEPHANT_PAPERBACK (or edit AMAZON_DEFAULTS) and redeploy.

After adding variables you MUST redeploy: Deployments → ⋯ on the latest → Redeploy.

## 4. Verify

- https://popularbooksonline.ca/api/catalog  → JSON with 3 books
- Homepage shows "Publish With Us" in the top bar and the "Book 1 · Start Here" badge
- Book 3 card shows "Coming Soon to Amazon.ca" + "Read Chapter 1 — free preview"

## Admin: export your leads

    GET https://popularbooksonline.ca/api/leads?format=csv
    Header:  X-Admin-Secret: <your ADMIN_SECRET>

Rows include newsletter signups, free-chapter readers, Book 3 waitlist
(coming_soon_notify) and Publish-With-Us inquiries (publish_inquiry, details column).
