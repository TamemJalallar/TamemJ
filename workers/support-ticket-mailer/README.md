# Support Ticket Mailer Worker

Cloudflare Worker endpoint for automatic Support Portal ticket email delivery and the private wedding-photo selection room.

This is designed for static deployments (GitHub Pages) where the frontend cannot send email directly.

## What it does

- Accepts POST JSON payloads from the Support Portal
- Verifies Cloudflare Turnstile token server-side
- Applies per-IP rate limiting (KV-backed)
- Sends email through Resend API
- Returns JSON success/error response
- Supports strict CORS for your site origin
- Authenticates each wedding selector with a separate private bearer token
- Stores Tamem's and his wife's photo-number arrays in two independent Cloudflare KV keys
- Returns the mutual selection as the intersection of both lists

## Files

- `src/index.ts`
- `wrangler.toml.example`

## Setup

1. Copy config:

```bash
cp workers/support-ticket-mailer/wrangler.toml.example workers/support-ticket-mailer/wrangler.toml
```

2. Edit `workers/support-ticket-mailer/wrangler.toml` values:

- `SUPPORT_EMAIL_TO` (target inbox)
- `SUPPORT_EMAIL_FROM` (verified Resend sender)
- `ALLOWED_ORIGIN` (your site origin, e.g. `https://tamemj.com`)
- `TURNSTILE_EXPECTED_HOSTNAME` (site hostname expected by Turnstile)
- `RATE_LIMIT_MAX_PER_MINUTE` (requests per IP per minute)
- `[[kv_namespaces]]` binding `RATE_LIMIT_KV` with your KV namespace id

3. Create KV namespace for rate limiting and update `id`:

```bash
cd workers/support-ticket-mailer
wrangler kv namespace create RATE_LIMIT_KV
```

4. Set secrets:

```bash
cd workers/support-ticket-mailer
wrangler secret put RESEND_API_KEY
wrangler secret put TURNSTILE_SECRET_KEY
```

5. Deploy:

```bash
wrangler deploy
```

6. Configure frontend build env:

```bash
NEXT_PUBLIC_SUPPORT_TICKET_EMAIL_TO=noreply@tamemj.com
NEXT_PUBLIC_SUPPORT_TICKET_EMAIL_ENDPOINT=https://<your-worker-subdomain>.workers.dev
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<your-turnstile-site-key>
```

## Request payload expected

```json
{
  "source": "support-portal",
  "ticket": {
    "id": "INC-...",
    "requesterEmail": "user@company.com"
  },
  "email": {
    "to": "noreply@tamemj.com",
    "subject": "[INC-...] Incident P2 - ...",
    "text": "..."
  },
  "turnstileToken": "<token>"
}
```

## Notes

- Frontend calls this endpoint directly over HTTPS.
- Keep `ALLOWED_ORIGIN` pinned to your production domain.
- If you skip KV binding, requests will not be rate-limited.
- The wedding selection endpoint is `GET`/`POST /wedding-selection` and requires the existing `RATE_LIMIT_KV` binding.
- The browser only sends selected photo numbers. Wedding images remain static assets on the website.
- The two raw wedding access tokens are not committed. Only their SHA-256 hashes appear in the Worker source.
- The first v2 read migrates the former per-photo v1 keys once. Normal synchronization then uses two KV reads and no list requests.
- The browser batches rapid choices into one role-specific array write and polls every 30 seconds only while visible.
