import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const YAHOO_AUTH_URL = "https://api.login.yahoo.com/oauth2/request_auth";
const YAHOO_TOKEN_URL = "https://api.login.yahoo.com/oauth2/get_token";
const YAHOO_FANTASY_API_BASE = "https://fantasysports.yahooapis.com/fantasy/v2";
const LOCAL_ONLY_MESSAGE = "Yahoo local OAuth routes are only enabled in local development.";

export interface YahooTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  xoauth_yahoo_guid?: string;
}

export interface YahooResolvedLeague {
  leagueKey: string;
  leagueId?: string;
  leagueName?: string;
  leagueUrl?: string;
}

export function isLocalYahooOAuthAllowed(): boolean {
  const redirectUri = process.env.YAHOO_REDIRECT_URI?.trim() ?? "";
  const hasLocalRedirect = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//i.test(redirectUri);
  return hasLocalRedirect || process.env.NODE_ENV !== "production";
}

export function getYahooLocalOnlyMessage(): string {
  return LOCAL_ONLY_MESSAGE;
}

export function getYahooConfig() {
  return {
    clientId: process.env.YAHOO_CLIENT_ID?.trim() ?? "",
    clientSecret: process.env.YAHOO_CLIENT_SECRET?.trim() ?? "",
    redirectUri: process.env.YAHOO_REDIRECT_URI?.trim() ?? "",
    gameKey: process.env.YAHOO_GAME_KEY?.trim() || "nfl",
    leagueHint: process.env.YAHOO_LEAGUE_KEY?.trim() ?? ""
  };
}

export function getYahooConfigProblems(): string[] {
  const config = getYahooConfig();
  const problems: string[] = [];

  if (!config.clientId) problems.push("YAHOO_CLIENT_ID is missing.");
  if (!config.clientSecret) problems.push("YAHOO_CLIENT_SECRET is missing.");
  if (!config.redirectUri) problems.push("YAHOO_REDIRECT_URI is missing.");
  if (!config.gameKey) problems.push("YAHOO_GAME_KEY is missing.");

  return problems;
}

export function createYahooState(): string {
  return `${Date.now().toString(36)}-${crypto.randomUUID()}`;
}

export function buildYahooAuthorizationUrl(state: string): string {
  const config = getYahooConfig();
  const url = new URL(YAHOO_AUTH_URL);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("language", "en-us");
  url.searchParams.set("state", state);
  return url.toString();
}

export async function exchangeYahooCodeForToken(code: string): Promise<YahooTokenResponse> {
  const config = getYahooConfig();
  const basic = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    redirect_uri: config.redirectUri,
    code
  });

  const response = await fetch(YAHOO_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body,
    cache: "no-store"
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Yahoo token exchange failed (${response.status}): ${details}`);
  }

  return (await response.json()) as YahooTokenResponse;
}

async function fetchYahooJson(path: string, accessToken: string): Promise<unknown> {
  const url = `${YAHOO_FANTASY_API_BASE}${path}${path.includes("?") ? "&" : "?"}format=json`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Yahoo fantasy API request failed (${response.status}) for ${path}: ${details}`);
  }

  return response.json();
}

function collectLeagueObjects(input: unknown, results: YahooResolvedLeague[] = []): YahooResolvedLeague[] {
  if (Array.isArray(input)) {
    input.forEach((entry) => collectLeagueObjects(entry, results));
    return results;
  }

  if (!input || typeof input !== "object") {
    return results;
  }

  const record = input as Record<string, unknown>;
  const leagueKey = typeof record.league_key === "string" ? record.league_key : undefined;
  const leagueId =
    typeof record.league_id === "string"
      ? record.league_id
      : typeof record.league_id === "number"
        ? String(record.league_id)
        : undefined;

  if (leagueKey) {
    results.push({
      leagueKey,
      leagueId,
      leagueName: typeof record.name === "string" ? record.name : undefined,
      leagueUrl: typeof record.url === "string" ? record.url : undefined
    });
  }

  Object.values(record).forEach((value) => collectLeagueObjects(value, results));
  return results;
}

function extractLeagueIdFromHint(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const fullKeyMatch = trimmed.match(/\.l\.(\d+)/i);
  if (fullKeyMatch?.[1]) return fullKeyMatch[1];

  const urlMatch = trimmed.match(/\/f1\/(\d+)/i) ?? trimmed.match(/archive\/[a-z0-9]+\/\d+\/(\d+)/i);
  if (urlMatch?.[1]) return urlMatch[1];

  const numericMatch = trimmed.match(/(\d{3,})/);
  return numericMatch?.[1];
}

function extractExistingLeagueKey(value: string): string | undefined {
  const trimmed = value.trim();
  return /^[A-Za-z0-9]+\.l\.\d+$/i.test(trimmed) ? trimmed : undefined;
}

export async function resolveYahooLeague(accessToken: string): Promise<YahooResolvedLeague | undefined> {
  const config = getYahooConfig();
  const desiredLeagueId = extractLeagueIdFromHint(config.leagueHint);
  const candidateKeys = new Set<string>();
  const existingKey = extractExistingLeagueKey(config.leagueHint);

  if (existingKey) {
    candidateKeys.add(existingKey);
  }

  if (desiredLeagueId) {
    candidateKeys.add(`${config.gameKey}.l.${desiredLeagueId}`);
  }

  for (const key of candidateKeys) {
    try {
      const metadata = await fetchYahooJson(`/league/${key}`, accessToken);
      const found = collectLeagueObjects(metadata).find((league) => league.leagueKey === key) ?? collectLeagueObjects(metadata)[0];
      if (found) return found;
    } catch {
      // Fall back to user leagues lookup.
    }
  }

  const leagueLookups = [
    `/users;use_login=1/games;game_keys=${config.gameKey}/leagues`,
    `/users;use_login=1/games/leagues`
  ];
  let leagues: YahooResolvedLeague[] = [];

  for (const path of leagueLookups) {
    try {
      const userLeagues = await fetchYahooJson(path, accessToken);
      leagues = collectLeagueObjects(userLeagues);
      if (leagues.length > 0) {
        break;
      }
    } catch {
      // Try the next shape before surfacing the error.
    }
  }

  if (leagues.length === 0) {
    throw new Error("Yahoo returned a token, but no league metadata could be resolved for this account.");
  }

  if (desiredLeagueId) {
    return leagues.find((league) => league.leagueId === desiredLeagueId) ?? leagues.find((league) => league.leagueUrl?.includes(`/${desiredLeagueId}`));
  }

  return leagues[0];
}

export function maskSecret(value: string | undefined): string {
  if (!value) return "missing";
  if (value.length <= 8) return "set";
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

export async function upsertLocalEnvValues(updates: Record<string, string | undefined>): Promise<void> {
  const envPath = join(process.cwd(), ".env.local");
  const existing = await readFile(envPath, "utf8").catch(() => "");
  const lines = existing.length > 0 ? existing.split(/\r?\n/) : [];
  const pending = new Map<string, string>();

  Object.entries(updates).forEach(([key, value]) => {
    if (value && value.trim().length > 0) {
      pending.set(key, value);
    }
  });

  const nextLines = lines.map((line) => {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) return line;
    const key = match[1];
    if (!pending.has(key)) return line;
    const value = pending.get(key) ?? "";
    pending.delete(key);
    return `${key}=${value}`;
  });

  pending.forEach((value, key) => {
    nextLines.push(`${key}=${value}`);
  });

  const normalized = `${nextLines.filter((line, index, arr) => !(line === "" && index === arr.length - 1)).join("\n")}\n`;
  await writeFile(envPath, normalized, "utf8");
}

export function renderYahooResultPage(options: {
  title: string;
  body: string;
  details?: string[];
  success?: boolean;
}): string {
  const escapeHtml = (value: string) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\"", "&quot;")
      .replaceAll("'", "&#39;");

  const detailMarkup = options.details?.length
    ? `<ul>${options.details.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(options.title)}</title>
    <style>
      :root { color-scheme: dark; }
      body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #020617; color: #e2e8f0; }
      main { max-width: 760px; margin: 64px auto; padding: 24px; }
      .card { border: 1px solid rgba(148,163,184,0.18); background: rgba(15,23,42,0.92); border-radius: 24px; padding: 28px; box-shadow: 0 18px 48px rgba(0,0,0,0.35); }
      .eyebrow { display:inline-block; border:1px solid rgba(59,130,246,0.28); background: rgba(59,130,246,0.12); color:#93c5fd; border-radius:999px; padding:6px 12px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; }
      h1 { margin: 18px 0 0; font-size: 32px; line-height: 1.15; color: #f8fafc; }
      p { margin: 14px 0 0; line-height: 1.7; color: #cbd5e1; }
      ul { margin: 18px 0 0; padding-left: 20px; color: #cbd5e1; }
      li { margin-top: 10px; }
      .success { color: #6ee7b7; }
      .error { color: #fca5a5; }
      a { color: #93c5fd; }
      code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: #f8fafc; }
    </style>
  </head>
  <body>
    <main>
      <section class="card">
        <span class="eyebrow">Yahoo Fantasy OAuth</span>
        <h1 class="${options.success ? "success" : "error"}">${escapeHtml(options.title)}</h1>
        <p>${escapeHtml(options.body)}</p>
        ${detailMarkup}
      </section>
    </main>
  </body>
</html>`;
}
