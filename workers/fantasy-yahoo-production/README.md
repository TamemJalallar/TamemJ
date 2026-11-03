# Fantasy Yahoo production worker

Cloudflare Worker for `tamemj.com/api/fantasy*` that keeps Yahoo Fantasy access server-side, stores the Yahoo refresh token in KV, and serves public normalized league data without requiring visitor login.

## Endpoints

- `GET /api/fantasy/league`
  - Returns the cached normalized league payload: league metadata, standings, current-week matchups, and cache metadata.
- `GET /api/fantasy/standings`
  - Returns the normalized standings subset.
- `GET /api/fantasy/matchups?week=7`
  - Returns current cached matchups, optionally filtered to a specific week.
- `POST /api/fantasy/admin/bootstrap`
  - Private endpoint. Copies `YAHOO_REFRESH_TOKEN_SEED` into KV if the KV refresh token is missing.
- `POST /api/fantasy/admin/refresh`
  - Private endpoint. Forces a live Yahoo refresh and overwrites the cached snapshot in KV.

Private admin routes require `Authorization: Bearer <ADMIN_API_TOKEN>` when `ADMIN_API_TOKEN` is configured.

## KV layout

- `fantasy:yahoo:refresh-token`
  - Canonical refresh token used for production refreshes. The worker updates this key if Yahoo rotates the refresh token.
- `fantasy:yahoo:league-snapshot`
  - Cached normalized league payload served to public visitors.
- `fantasy:yahoo:last-refresh-error`
  - Last refresh status payload for debugging.

## Required configuration

Worker vars in `wrangler.toml`:

- `YAHOO_GAME_KEY`
  - Usually `nfl`.
- `YAHOO_LEAGUE_KEY`
  - Preferred explicit Yahoo league key, for example `461.l.123456`.
- `YAHOO_REDIRECT_URI`
  - Production callback URI registered in Yahoo, for example `https://tamemj.com/api/fantasy/oauth/callback`.
- `CACHE_TTL_SECONDS`
  - Public cache freshness window in seconds. Default in this worker is `300`.

Worker secrets:

- `YAHOO_CLIENT_ID`
- `YAHOO_CLIENT_SECRET`
- `YAHOO_REFRESH_TOKEN_SEED`
- `ADMIN_API_TOKEN` optional

## Deploy

1. Create a KV namespace for the fantasy worker.
2. Copy `wrangler.toml.example` to `wrangler.toml` if you do not want to edit the committed file directly.
3. Fill the KV namespace IDs and the production Yahoo league key.
4. Set secrets with Wrangler:
   - `wrangler secret put YAHOO_CLIENT_ID`
   - `wrangler secret put YAHOO_CLIENT_SECRET`
   - `wrangler secret put YAHOO_REFRESH_TOKEN_SEED`
   - `wrangler secret put ADMIN_API_TOKEN` optional
5. Bootstrap once after deploy if KV does not already contain the refresh token:
   - `curl -X POST https://tamemj.com/api/fantasy/admin/bootstrap -H 'Authorization: Bearer <ADMIN_API_TOKEN>'`
6. Force an initial fetch:
   - `curl -X POST https://tamemj.com/api/fantasy/admin/refresh -H 'Authorization: Bearer <ADMIN_API_TOKEN>'`
7. Deploy:
   - `wrangler deploy`

## Notes

- Public requests never redirect to Yahoo and never require Yahoo login.
- If the cached snapshot is stale and live Yahoo refresh fails, the worker serves stale KV data when available instead of failing closed.
- The cron trigger is configured for every 5 minutes in UTC.
