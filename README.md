# TamemJ.com

Enterprise IT troubleshooting and resources site built with Next.js App Router + TypeScript + Tailwind, deployed as a static export behind Cloudflare.

## What this project includes

- Enterprise IT Tickets (`/support/tickets`, `/support/tickets/[slug]`)
- Corporate Tech Fixes + Builder (`/corporate-tech-fixes`, `/corporate-tech-fixes/[slug]`, `/corporate-tech-fixes/builder`)
- ITIL-style Support Portal (`/support/*`)
- Downloads hub + IT asset marketplace (`/downloads`, `/downloads/assets`, `/downloads/assets/[slug]`)
- AI Agents library (`/ai-agents`, `/ai-agents/[slug]`, `/ai-agents/category/[slug]`)
- GenAI prompt library (`/genai-prompts`, `/genai-prompts/[slug]`)
- PC Build Guides (`/pc-build-guides`, `/pc-build-guides/[slug]`)
- Donate page with provider links + crypto wallets (`/donate`)
- Optional Apps section (`/apps`, `/apps/[slug]`) behind feature flag

## Tech stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Static export (`next build` with `output: export`)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production check:

```bash
npm run build
```

Static export check:

```bash
npm run build:static
```

## Scripts

- `npm run dev` - local dev server
- `npm run build` - production build
- `npm run build:static` - static export build for GitHub Pages/Netlify
- `npm run sync:downloads` - sync download release metadata from GitHub releases
- `npm run scan:secrets` - run local gitleaks scan before push
- `npm start` - start production server (non-static hosts)

## Project layout

```text
app/                     # Route pages (App Router)
components/              # UI components and feature components
data/                    # JSON data (release sync targets, etc.)
lib/                     # Core registries, helpers, feature logic
src/content/             # Content registries (donate providers, GenAI prompts)
public/                  # Static assets (icons, crypto logos, etc.)
scripts/                 # Utility scripts (download release sync)
workers/                 # Cloudflare Worker templates
types/                   # Shared TypeScript models
```

## Content registries (where to edit)

### Core support content

- Ticket articles: `lib/support.kb.registry.ts`
- Service catalog: `lib/support.catalog.registry.ts`
- Corporate fixes: `lib/corporate-fixes.registry.ts`
- Published corporate fixes cache: `data/corporate-fixes.published.json`
- PC build guides: `lib/pc-build-guides.registry.ts`

### Downloads content

- App/software downloads: `lib/downloads.registry.ts`
- IT assets (scripts/templates/checklists): `lib/download-assets.registry.ts`
- Affiliate mappings/links: `lib/affiliate-links.ts`
- Download release sync targets: `data/download-release-sync.targets.json`
- Generated release metadata cache: `data/download-release-metadata.json`

### AI content

- AI agents: `lib/aiAgents.registry.ts`
- AI agent editorial intros: `lib/ai-agents.editorial.ts`
- GenAI prompts: `src/content/genai/genai-prompts.registry.ts`

### Donation content

- Donation providers (PayPal, Buy Me a Coffee): `src/content/donate/providers.ts`
- Crypto donation methods: `lib/crypto-donations.ts`

## Environment variables

Set these in local `.env.local` and in your deployment environment.

### Core/site behavior

- `NEXT_PUBLIC_SHOW_APPS_SECTION` - optional override (`true`/`false`) for `/apps` visibility (defaults to visible when unset)
- `NEXT_PUBLIC_ADSENSE_REVIEW_MODE` - `true` to index only core app/support pages for AdSense review
- `NEXT_PUBLIC_NEWEGG_AFFILIATE_SID` - enables Newegg affiliate deep links
- `NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG` - Amazon Associates tag used for PC build recommendations (default `tamemj-20`)

### Corporate Tech Fixes builder

- `NEXT_PUBLIC_CORPORATE_FIXES_BUILDER_AUTH_MODE`
  - `password` (default client-side hash check)
  - `cloudflare-access` (expect access protection at Cloudflare)
- `NEXT_PUBLIC_CORPORATE_FIXES_BUILDER_PASSWORD_SHA256`
- `NEXT_PUBLIC_CORPORATE_FIXES_PUBLISH_ENDPOINT_URL`

Generate password hash:

```bash
printf 'your-password' | shasum -a 256
```

### Support ticket email + anti-bot

- `NEXT_PUBLIC_SUPPORT_TICKET_EMAIL_TO`
- `NEXT_PUBLIC_SUPPORT_TICKET_EMAIL_ENDPOINT`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

### Supabase (accounts/profile/download tracking)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Crypto donation wallets

- `NEXT_PUBLIC_DONATION_BTC_ADDRESS`
- `NEXT_PUBLIC_DONATION_ETH_ADDRESS`
- `NEXT_PUBLIC_DONATION_SHIB_ADDRESS` (optional, falls back to ETH if omitted)
- `NEXT_PUBLIC_DONATION_BNB_ADDRESS`
- `NEXT_PUBLIC_DONATION_SOL_ADDRESS`
- `NEXT_PUBLIC_DONATION_LTC_ADDRESS`
- `NEXT_PUBLIC_DONATION_XRP_ADDRESS`
- `NEXT_PUBLIC_DONATION_XMR_ADDRESS`
- `NEXT_PUBLIC_DONATION_DOGE_ADDRESS`

Example:

```env
NEXT_PUBLIC_SHOW_APPS_SECTION=false
NEXT_PUBLIC_ADSENSE_REVIEW_MODE=true
NEXT_PUBLIC_NEWEGG_AFFILIATE_SID=4670565

NEXT_PUBLIC_CORPORATE_FIXES_BUILDER_AUTH_MODE=cloudflare-access
NEXT_PUBLIC_CORPORATE_FIXES_PUBLISH_ENDPOINT_URL=/api/corporate-tech-fixes/publish

NEXT_PUBLIC_SUPPORT_TICKET_EMAIL_TO=noreply@tamemj.com
NEXT_PUBLIC_SUPPORT_TICKET_EMAIL_ENDPOINT=https://example.workers.dev/api/support-ticket
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key

NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

NEXT_PUBLIC_DONATION_BTC_ADDRESS=bc1...
NEXT_PUBLIC_DONATION_ETH_ADDRESS=0x...
NEXT_PUBLIC_DONATION_BNB_ADDRESS=0x...
NEXT_PUBLIC_DONATION_SOL_ADDRESS=...
NEXT_PUBLIC_DONATION_LTC_ADDRESS=ltc1...
NEXT_PUBLIC_DONATION_XRP_ADDRESS=r...
NEXT_PUBLIC_DONATION_XMR_ADDRESS=4A...
NEXT_PUBLIC_DONATION_DOGE_ADDRESS=D...
```

## Feature notes

### Apps section toggle

Apps can be hidden with an environment override:

- navigation link hidden
- `/apps` and `/apps/[slug]` return 404
- apps URLs excluded from sitemap

To re-enable later:

```env
NEXT_PUBLIC_SHOW_APPS_SECTION=true
```

### AdSense review mode

To prepare for AdSense review, enable:

```env
NEXT_PUBLIC_ADSENSE_REVIEW_MODE=true
```

When enabled:

- only core pages are indexable (`/`, `/apps`, `/apps/[slug]`, `/privacy`, `/support`, `/contact`)
- sitemap output is trimmed to core pages + app detail pages
- robots rules block non-core sections from crawling
- header/footer navigation is reduced to core links during review mode

### Static export compatibility

This repo supports static export even with zero published apps. A hidden placeholder slug is generated for `/apps/[slug]` at build time to satisfy static generation.

### Corporate Ticket Builder publishing

`Publish to Site` sends builder payloads to a Cloudflare Worker, which commits into `data/corporate-fixes.published.json` and triggers GitHub Pages deploy.

Worker templates:

- `workers/corporate-fixes-publisher/`

### Support ticket email delivery

Incident/catalog submissions can send email through a public endpoint (Cloudflare Worker recommended).

Worker template:

- `workers/support-ticket-mailer/`

Expected Worker secrets/bindings (see worker README for exact setup):

- `RESEND_API_KEY`
- `TURNSTILE_SECRET_KEY`
- `ALLOWED_ORIGIN`
- `TURNSTILE_EXPECTED_HOSTNAME`
- `RATE_LIMIT_MAX_PER_MINUTE`
- `RATE_LIMIT_KV`

## Supabase schema (minimum)

Run once in Supabase SQL editor:

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  company text,
  role text,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.download_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  app_slug text not null,
  app_name text not null,
  channel_label text not null,
  channel_type text not null,
  platform text,
  url text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.download_events enable row level security;

create policy "users own profile read" on public.profiles
for select using (auth.uid() = id);
create policy "users own profile upsert" on public.profiles
for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "users own download events read" on public.download_events
for select using (auth.uid() = user_id);
create policy "users own download events insert" on public.download_events
for insert with check (auth.uid() = user_id);
```

## Deployment

### GitHub Pages (current primary)

1. Push to `main`
2. `Settings -> Pages -> Source: GitHub Actions`
3. Workflow builds and deploys static output from `out/`
4. Keep `public/CNAME` committed for `tamemj.com`

Files:

- `.github/workflows/deploy-gh-pages.yml`
- `public/CNAME`
- `public/.nojekyll`

### Vercel

- Build command: `npm run build`
- No output directory
- Add custom domain in project settings

### Netlify

- Build command: `npm run build:static`
- Publish directory: `out`
- Uses `netlify.toml`

## SEO/operational reminders

- Keep article slugs symptom-first and stable.
- Use consistent lowercase tags for reliable filtering.
- Add `lastVerified` updates on major ticket changes.
- Add related-article links between support docs and downloads.
- For direct binary downloads, prefer official vendor links or GitHub Releases and include checksums when possible.

## Security and enterprise-safe content guardrails

- Do not publish security bypass steps.
- Separate `User Safe` and `Admin Required` actions clearly.
- Add escalation criteria for identity/security/conditional-access issues.
- Prefer reversible, low-risk troubleshooting steps before destructive remediations.

## Local secret scanning (no CI scan)

Secret scanning is intentionally local-only (GitHub workflow removed for faster pushes).

Install gitleaks once:

```bash
brew install gitleaks
```

Run before push:

```bash
npm run scan:secrets
```
