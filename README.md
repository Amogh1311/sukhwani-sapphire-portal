# Sukhwani Sapphire · Cultural Portal

A residential society portal with a members directory (WhatsApp click-to-chat),
society expenses, announcements (Canva-embeddable), and a dynamic festival theme
that swaps background + accent colors based on what's coming up.

## Stack

- **Frontend:** Vite + React 18 + TypeScript + Tailwind + React Router.
- **Backend:** Hono on Node, deployed as a Vercel serverless function at `/api/*`.
- **Database:** Postgres on Neon (free tier). Schema in [`db/init.sql`](db/init.sql).
- **Hosting:** Vercel (free Hobby plan) for both frontend + API.

## Local development

```bash
# 1. Install deps for both packages
npm run install:all

# 2. Create a Neon database (free tier) and run the schema once
psql "$DATABASE_URL" -f db/init.sql

# 3. Set env vars
cp .env.example .env.local
#   edit .env.local with your DATABASE_URL

# 4. Run frontend + backend together
npm run dev
#   API on http://localhost:8787
#   Client on http://localhost:5173 (proxies /api → :8787)
```

## Deploy to Vercel (free)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects:
   - Static frontend at `client/dist` (build via `npm install --prefix client && npm run build --prefix client`)
   - Serverless function at `api/index.ts` for all `/api/*` routes
4. Add these env vars in **Settings → Environment Variables**:
   - `DATABASE_URL` — Neon connection string
   - `ALLOWED_ORIGIN` — your Vercel URL, e.g. `https://sukhwani-sapphire.vercel.app`
5. Run `db/init.sql` once against your Neon DB (via Neon SQL editor or `psql`).
6. Deploy. Your URL is something like `https://sukhwani-sapphire-<hash>.vercel.app`.

### Custom domain (optional)

Buy a `.in` domain (₹500–800/year) and add it via **Settings → Domains** in
Vercel. Then update `ALLOWED_ORIGIN` env var to the new domain.

## Free-tier reality check

- **Serverless functions cold-start.** The first request after ~15 min of
  inactivity takes ~500ms–2s. Acceptable for a low-traffic society portal.
- **Postgres** stays warm on Neon's free tier (no cold sleeps on the DB).
- **No real auth.** Anyone with the link can read. Posting requires selecting
  a committee unit (D-401 by default) — but this is a soft gate. The server
  validates the `X-Unit` header, but if the link leaks, anyone can take over
  by picking D-401. Treat the link as the secret. Add a passphrase later if
  you need stronger guarantees.

## File layout

```
sukhwani-sapphire/
├── client/                  Vite + React frontend
├── api/
│   ├── index.ts             Vercel serverless function entry
│   ├── dev.ts               Local dev runner (`npm run dev` inside api/)
│   └── _lib/                Shared backend code (db, auth, routes)
├── db/init.sql              Schema + seed data
├── vercel.json              Vercel build config
└── package.json             Root scripts (`npm run dev` runs both)
```

## What runs where

| URL | Served by |
|---|---|
| `/` | Vercel static (client/dist) |
| `/members`, `/expenses`, `/announcements` | Vercel static (client-side routing) |
| `/api/health` | Vercel function → Hono |
| `/api/units` | Vercel function → Hono |
| `/api/expenses` (GET/POST/DELETE) | Vercel function → Hono → Postgres |
| `/api/announcements` (GET/POST/DELETE) | Vercel function → Hono → Postgres |

## Adding committee members

D-401 is the only committee unit by default. To grant edit access to another
unit (e.g. A-401 as treasurer), run:

```sql
UPDATE units SET is_committee = TRUE WHERE wing = 'A' AND flat = '401';
```

No app changes needed.

## Notifications

Whenever a resident (non-committee unit) posts an announcement, or any new
expense is added, the system fires notifications to recipients in the
`notification_recipients` table. D-401 is seeded by default with phone
`+919545208412`.

### Adding more recipients

```sql
INSERT INTO notification_recipients (phone, name, channels, event_types)
VALUES ('+919876543210', 'Treasurer A-401',
        '{whatsapp}', '{expense.created}');
```

- `channels` — ordered preference, e.g. `'{whatsapp,sms,email}'`. Each channel
  is tried in order until one succeeds.
- `event_types` — which events this recipient cares about. Default covers both.

### Delivery channels

Pluggable. If no channel env vars are set, notifications fall back to the
**log channel** — every event still gets a row in `notification_log`, just
no real delivery. Inspect with:

```sql
SELECT created_at, event_type, channel, status, error
FROM notification_log
ORDER BY created_at DESC
LIMIT 20;
```

To enable real delivery, set the relevant env vars in `.env.local` /
Vercel project settings:

| Channel | Env vars | Cost |
|---|---|---|
| WhatsApp (Meta Cloud API) | `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID` | Free up to 1000 conversations/month |
| SMS (Twilio) | `SMS_PROVIDER=twilio`, `SMS_ACCOUNT_SID`, `SMS_AUTH_TOKEN`, `SMS_FROM` | ~₹0.20/SMS |
| Email (Resend) | `EMAIL_PROVIDER=resend`, `EMAIL_API_KEY`, `EMAIL_FROM` | Free up to 100/day |

For WhatsApp you'll need to:

1. Create a Meta Business account at business.facebook.com.
2. Add the WhatsApp product, verify your business, get a WhatsApp Business
   phone number (can be a separate number from your personal one).
3. From the WhatsApp App dashboard, generate a permanent access token and
   copy the Phone Number ID into `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_ID`.

This onboarding is a one-time ~1-2 day process — outside the codebase.

## Adding a new festival

Edit [`client/src/config/festivals.ts`](client/src/config/festivals.ts) and
add an entry. The theme engine picks it up automatically — no code changes.
