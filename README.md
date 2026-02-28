# tamemj.com Portfolio Website

Modern, minimal, mobile-first portfolio website for an independent iOS developer. Built with Next.js App Router + Tailwind CSS and structured around apps (not a blog or resume).

## Features

- App-focused portfolio home page
- JSON-driven apps listing (`/data/apps.json`)
- Dynamic app detail page template (`/apps/[slug]`)
- Downloads hub with store links + direct downloads (`/downloads`)
- Privacy policy page template
- Support page with FAQ + lightweight `mailto:` support form
- Contact page with `mailto:` form (no backend required)
- SEO-ready metadata, Open Graph tags, `robots.txt`, `sitemap.xml`, favicon
- Static export ready for fast hosting and GitHub Pages

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- TypeScript

## Project Structure

```text
app/
  apps/
    [slug]/
  downloads/
  contact/
  privacy/
  support/
  robots.ts
  sitemap.ts
  globals.css
  layout.tsx
  page.tsx
components/
data/
  apps.json
lib/
public/
  images/
types/
```

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Production build (local verification):

```bash
npm run build
```

Static export build (GitHub Pages / static hosting):

```bash
npm run build:static
```

Note: `npm run build:static` requires at least one app in `data/apps.json` because `/apps/[slug]` needs generated paths.

## Add a New App

1. Add a new object to `data/apps.json`
2. Add an app icon and screenshots under `public/images/apps/<slug>/`
3. Rebuild the site (`npm run build` for local, `npm run build:static` for static export)
4. Rebuild the site and verify the generated sitemap includes the new app URL (`/sitemap.xml`)

The `/apps` page and `/apps/[slug]` page are generated automatically from the JSON data.

## Corporate Tech Fixes (Registry Maintenance)

The corporate troubleshooting section is registry-driven and lives at:

- `app/corporate-tech-fixes/page.tsx` (catalog route)
- `app/corporate-tech-fixes/[slug]/page.tsx` (dynamic guide route)
- `app/corporate-tech-fixes/builder/page.tsx` (KB Builder authoring tool)
- `lib/corporate-fixes.registry.ts` (registry + merged data sources)
- `data/corporate-fixes.published.json` (remote-published fixes committed by Cloudflare Worker)
- `workers/corporate-fixes-publisher/` (Cloudflare Worker template for publish-to-site)

Use `/corporate-tech-fixes/builder` to draft entries in the browser, manage steps/tags, and copy a registry snippet + Markdown support doc template.

### Optional Builder Password Gate (Static Hosting Compatible)

The KB Builder supports a client-side password gate for GitHub Pages/static hosting:

- Route: `/corporate-tech-fixes/builder`
- Auth mode (build-time): `NEXT_PUBLIC_CORPORATE_FIXES_BUILDER_AUTH_MODE`
- Config variable (build-time): `NEXT_PUBLIC_CORPORATE_FIXES_BUILDER_PASSWORD_SHA256`
- Optional publish endpoint (build-time): `NEXT_PUBLIC_CORPORATE_FIXES_PUBLISH_ENDPOINT_URL`

Auth modes:

- `password` (default) — local client-side password gate using SHA-256 hash comparison
- `cloudflare-access` — no local password prompt; builder is expected to be protected externally by Cloudflare Zero Trust Access

Generate a SHA-256 hash for the password:

```bash
printf 'your-password' | shasum -a 256
```

Then set the hex output as `NEXT_PUBLIC_CORPORATE_FIXES_BUILDER_PASSWORD_SHA256` in your local `.env` / CI build environment and redeploy.

Important limitation: on static hosting this is a client-side gate (deterrent), not secure server-side authentication. It prevents casual access but is not equivalent to real auth.

If using Cloudflare Access instead, set:

```bash
NEXT_PUBLIC_CORPORATE_FIXES_BUILDER_AUTH_MODE=cloudflare-access
```

and protect `/corporate-tech-fixes/builder*` at the Cloudflare edge.

### Remote Publish-to-Site Pipeline (Cloudflare Worker -> GitHub Commit -> Pages Deploy)

The KB Builder now supports a `Publish to Site` action that sends the current KB entry to a Cloudflare Worker endpoint. The Worker validates the payload and commits it into:

- `data/corporate-fixes.published.json`

That commit triggers the existing GitHub Pages workflow (push to `main`) and the new KB appears publicly after the deploy finishes.

Builder-side endpoint configuration:

```bash
NEXT_PUBLIC_CORPORATE_FIXES_PUBLISH_ENDPOINT_URL=/api/corporate-tech-fixes/publish
```

If omitted, the builder defaults to `/api/corporate-tech-fixes/publish`.

Worker setup files:

- `workers/corporate-fixes-publisher/src/index.ts`
- `workers/corporate-fixes-publisher/wrangler.toml.example`
- `workers/corporate-fixes-publisher/README.md`

Recommended security:

- Protect the builder route with Cloudflare Access
- Protect the Worker publish route with Cloudflare Access (separate self-hosted app or path rule)
- Keep GitHub repo write token only in Worker secrets (`wrangler secret put GITHUB_TOKEN`)

Publish flow behavior:

- `Publish to Site` performs an upsert by slug (creates or updates)
- Builder also syncs the entry to local preview storage so you can test immediately on your device
- Public site updates after GitHub Pages redeploy completes

### How to Add a New Fix

1. Choose a publish method:
   - Use `/corporate-tech-fixes/builder` and click `Publish to Site` (recommended once Worker is deployed)
   - Or manually add a new object to `lib/corporate-fixes.registry.ts`
2. Create a unique `slug` (used for `/corporate-tech-fixes/<slug>/`)
3. Choose a supported category (`Windows`, `macOS`, `O365`, `Networking`, `Printers`, `Security`, `Adobe`, `Figma`, `Browsers`)
4. Add tags that improve search/filter discoverability (product, platform, symptom, policy)
5. Write step entries with `type` values:
   - `info` for validation/troubleshooting actions
   - `command` for copyable PowerShell/Terminal commands
   - `warning` for risk notices, escalation points, or policy-sensitive actions
6. Rebuild the site (`npm run build`) and test the new route locally (manual flow) or wait for GitHub Pages deploy (remote publish flow)

### Registry Maintenance Guidelines

- Keep entries self-contained and practical; the UI renders directly from the registry
- Prefer stable wording in titles (symptom-first naming improves search and reuse)
- Keep tags consistent (`sharepoint` vs `SharePoint`, `vpn`, `mfa`, etc.) because filters are exact matches
- Update estimated time and access level (`User Safe` vs `Admin Required`) when procedures change
- Preserve enterprise-safe guidance: no policy bypasses, no disabling security controls, no personal-account workarounds
- Add explicit escalation warnings for identity, security, DLP, Conditional Access, or tenant policy issues
- Use commands only where they help diagnosis or approved remediation; avoid destructive commands in generic runbooks

### Enterprise-Safe Documentation Best Practices

- Start with scope validation (one user vs many users, one device vs service-wide)
- Prefer least-risk steps first (observe, verify, test, then reset)
- Call out prerequisites (admin rights, user impact, sign-out/restart expectations)
- Separate user-safe actions from admin-only actions clearly
- Document escalation criteria early so analysts know when to stop and hand off
- Avoid instructions that weaken compliance, monitoring, endpoint protection, or authentication controls
- For major content changes, rebuild the site so the generated `app/sitemap.ts` output is refreshed

## Downloads Hub (Store Links + Direct Downloads)

The downloads page is registry-driven and lives at:

- `app/downloads/page.tsx`
- `components/downloads/downloads-browser.tsx`
- `lib/downloads.registry.ts`
- `types/download.ts`
- `data/download-release-sync.targets.json` (GitHub sync mapping)
- `data/download-release-metadata.json` (generated metadata cache)
- `scripts/sync-download-release-metadata.mjs` (sync tool)

### What It Supports

- Mac App Store links (`Mac App Store` button style)
- Microsoft Store links (`Microsoft Store` button style)
- GitHub Releases links
- Direct download rows (hosted externally, e.g. GitHub Releases or Cloudflare R2)
- Curated "Popular GitHub Downloads" examples

### How to Add a Download

1. Add a new entry to `lib/downloads.registry.ts`
2. Choose channels in `channels`:
   - `Mac App Store`
   - `Microsoft Store`
   - `GitHub Releases`
   - `Direct Download`
   - `Source Code`
3. Add `directDownloads` rows if you want per-platform download buttons and metadata (file type, version, size, checksum)
4. Rebuild and test `/downloads`

### Auto-Sync GitHub Release Metadata (Version, Size, SHA-256)

For GitHub-hosted direct downloads, use the sync tool to prefill metadata and direct asset URLs:

```bash
npm run sync:downloads
```

What it does:

- Reads `data/download-release-sync.targets.json`
- Fetches latest GitHub release + asset metadata for each mapped repo
- Resolves exact asset URLs for each artifact label
- Prefills `version`, `fileSize`, and `checksumSha256` (when available from digest/checksum files)
- Writes the generated cache to `data/download-release-metadata.json`

Optional:

- Set `GITHUB_TOKEN` to avoid unauthenticated API rate limits:

```bash
GITHUB_TOKEN=ghp_xxx npm run sync:downloads
```

- To compute missing SHA-256 values by downloading assets (when release digests/checksum files are not published):

```bash
DOWNLOAD_SYNC_COMPUTE_SHA256=1 npm run sync:downloads
```

- Optional max download size for checksum computation (default: `100000000` bytes):

```bash
DOWNLOAD_SYNC_COMPUTE_SHA256=1 DOWNLOAD_SYNC_CHECKSUM_MAX_BYTES=200000000 npm run sync:downloads
```

After syncing, run:

```bash
npm run build
```

so the updated metadata is included in the generated site.

### Free Hosting Recommendation for Direct Downloads

- Preferred default: `GitHub Releases` (free, versioned, easy release notes)
- Alternative: `Cloudflare R2` (free tier, custom URLs)
- Do not host installer binaries in GitHub Pages itself (site storage/bandwidth limits)

### Legal / Trust Notes

- Use official Apple/Microsoft store badges according to their brand guidelines if you add branded assets
- Sign and notarize macOS builds; sign Windows installers for better trust and fewer warnings
- Publish SHA-256 checksums for direct downloads whenever possible

## ServiceNow-Style Support Portal (ITIL-lite Demo)

The support portal now lives under `app/support/*` and includes:

- Knowledge Base (`/support/kb`, `/support/kb/[slug]`)
- Service Catalog (`/support/catalog`, `/support/catalog/[slug]`)
- Incident intake (`/support/incident/new`)
- My Tickets (`/support/tickets`)
- Analytics (`/support/analytics`)
- Admin tools (`/support/admin`, hidden behind local admin toggle)

It is static-hosting compatible (GitHub Pages safe) and stores all demo state locally in the browser.

### Key Files

- `lib/support.kb.registry.ts` — KB article registry (60 seeded articles)
- `lib/support.catalog.registry.ts` — service catalog registry
- `types/support.ts` — KB, catalog, ticket, and analytics TypeScript models
- `lib/support-portal.storage.ts` — local storage persistence (tickets, portal state, helpful votes)
- `lib/support-portal.analytics.ts` — analytics event tracking + aggregation
- `components/support-portal/` — shared portal UI library and feature components

### How to Add KB Articles

1. Add a new `KBSeed` entry to `lib/support.kb.registry.ts`
2. Provide a unique `slug` (used by `/support/kb/<slug>/`)
3. Fill in enterprise-safe content:
   - symptoms
   - likely causes
   - remediation guidance (safe-first)
   - escalation criteria
   - commands (or allow the fallback command generator)
4. Use correct metadata fields:
   - `category` (e.g., `Microsoft 365`, `Adobe`, `Figma`, `Browsers`)
   - `productFamily` (`Microsoft`, `Adobe`, `Figma`, etc.)
   - `severity`, `accessLevel`, `environment`, `estimatedTime`
5. Rebuild (`npm run build`) to ensure the static params and metadata generate cleanly

The registry automatically links related articles based on product/category/tag similarity.

### How to Add Catalog Items

1. Add a new `CatalogItem` object in `lib/support.catalog.registry.ts`
2. Define `requiredFields` using the typed field schema (`text`, `textarea`, `select`, `checkbox`, `multiselect`)
3. Add:
   - `expectedFulfillmentTime`
   - `approvalNote`
   - `workflowSummary`
   - tags for search/filtering
4. Rebuild and test `/support/catalog/<slug>/`

Catalog submissions create local demo request tickets in `My Tickets` (no backend ticket creation).

### Analytics (Local Schema + Reset)

Analytics is stored locally using an event log schema:

- Key: `supportPortal:analytics:v1`
- Shape:
  - `version: 1`
  - `events: AnalyticsEvent[]`

Tracked event types include:

- `kb_view`
- `search`
- `search_click`
- `kb_helpful_vote`
- `catalog_submit`
- `incident_submit`
- `ticket_note_added`
- `ticket_comment_added`
- `admin_action`

Reset options are available in `/support/admin` (after enabling Admin Mode from the sidebar):

- Reset Analytics
- Reset KB Helpful Votes
- Reset Tickets
- Seed Demo Tickets

### How Tickets Are Stored Locally

Tickets are stored in browser `localStorage` using typed `Ticket` objects:

- Key: `supportPortal:tickets:v1`
- Each ticket includes:
  - `id`, `createdAt`, `updatedAt`
  - `type`, `status`, `priority`
  - `impact`, `urgency`
  - `category`, `subcategory`, `product`
  - `summary`, `description`
  - `preferredContactMethod`
  - `attachments` (filenames only in demo mode)
  - `activityLog` timeline entries

Related local keys:

- `supportPortal:kbHelpfulVotes:v1` — per-article Yes/No feedback state
- `supportPortal:state:v1` — admin toggle + sidebar collapse state

## Deployment

Deployment configs included in this repo:

- `vercel.json`
- `netlify.toml`
- `.github/workflows/deploy-gh-pages.yml`
- `public/CNAME`
- `public/.nojekyll`

### Vercel

1. Push the project to GitHub/GitLab/Bitbucket
2. Import the repository in Vercel
3. Build command: `npm run build`
4. Do not set an output directory (standard Next.js deployment)
5. Add custom domain `tamemj.com` in Vercel project settings
6. Redeploy after setting environment/domain settings if needed

### Netlify

1. Create a new site from your repository
2. Netlify will read `netlify.toml` automatically (`npm run build:static`, publish `out`)
3. If prompted manually:
   - Build command: `npm run build:static`
   - Publish directory: `out`
4. Add custom domain `tamemj.com`

### GitHub Pages (Static)

This project is configured for static export and includes a GitHub Actions workflow for Pages deploy.

Note: GitHub Pages deployment requires at least one app entry in `data/apps.json` (because static export must generate at least one `/apps/[slug]` page path).

1. Push to the `main` branch
2. In GitHub: `Settings` → `Pages`
3. Set Source to `GitHub Actions`
4. The workflow `.github/workflows/deploy-gh-pages.yml` will build and deploy `out/`
5. Set the custom domain to `tamemj.com`
6. Keep `public/CNAME` in the repo so the domain is preserved

If your default branch is not `main`, update the workflow trigger branch name.

## Notes for Future Scalability

- Add analytics later (Plausible, Umami, GA4) in `app/layout.tsx`
- Add a blog section with a new route group (e.g. `app/(content)/blog`)
- Add newsletter signup by replacing `mailto:` forms with API-backed forms
- Continue using `data/apps.json` or move to a CMS when app count grows

## Performance Notes

- Uses static export for fast global delivery
- The repo starts with no sample apps; add your own optimized assets under `public/images/apps/`
- `next/image` is used for lazy loading screenshots
- Prefer WebP/AVIF screenshots for production app assets
