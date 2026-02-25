# Corporate Fixes Publisher Worker

Cloudflare Worker endpoint that accepts KB entries from the `Corporate Tech Fixes` builder and commits them to:

- `data/corporate-fixes.published.json`

That commit triggers your existing GitHub Pages deployment workflow (`push` to `main`).

## Endpoint

- Default path: `/api/corporate-tech-fixes/publish`
- Methods:
  - `GET` health/config summary
  - `POST` publish/upsert KB entry

## Security Model

- Protect the worker route with **Cloudflare Access** (same login pattern used for the builder)
- Worker also checks `cf-access-authenticated-user-email` by default
- Optional `ALLOWED_EMAILS` env var provides a second allowlist
- GitHub token is kept in Worker secrets only (never exposed to the browser)

## Request Payload (POST)

```json
{
  "fix": {
    "slug": "outlook-search-not-returning-results",
    "title": "Outlook Search Not Returning Results",
    "category": "O365",
    "severity": "Medium",
    "accessLevel": "User Safe",
    "estimatedTime": "10-20 min",
    "tags": ["outlook", "search", "microsoft-365"],
    "description": "Enterprise-safe troubleshooting guide...",
    "steps": [
      {
        "title": "Confirm scope",
        "type": "info",
        "content": "Verify impact and error messages."
      }
    ]
  },
  "source": "corporate-tech-fixes-builder"
}
```

## Deploy

1. Copy `wrangler.toml.example` to `wrangler.toml`
2. Update route/domain/repo vars
3. Set secrets:
   - `wrangler secret put GITHUB_TOKEN`
4. Deploy:
   - `wrangler deploy`

## GitHub Token Permissions (fine-grained PAT)

Repository permissions:

- `Contents: Read and write`
- `Metadata: Read`

The worker commits directly to `main` (or your configured branch). Each commit should trigger GitHub Pages deployment via your existing workflow.

## Cloudflare Access Setup

Protect the worker route path with a self-hosted Access app, for example:

- `tamemj.com/api/corporate-tech-fixes/publish*`

Use the same GitHub or Google IdP policy as the KB builder, but restrict to your account only.
