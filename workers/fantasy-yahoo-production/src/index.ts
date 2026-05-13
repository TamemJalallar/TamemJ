interface KVStore {
  get(key: string, type: "text"): Promise<string | null>;
  get<T>(key: string, type: "json"): Promise<T | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  put(key: string, value: ArrayBuffer | ArrayBufferView, options?: { expirationTtl?: number }): Promise<void>;
}

interface Env {
  FANTASY_CACHE: KVStore;
  YAHOO_CLIENT_ID: string;
  YAHOO_CLIENT_SECRET: string;
  YAHOO_REDIRECT_URI?: string;
  YAHOO_LEAGUE_KEY?: string;
  YAHOO_GAME_KEY?: string;
  YAHOO_REFRESH_TOKEN_SEED?: string;
  ADMIN_API_TOKEN?: string;
  CACHE_TTL_SECONDS?: string;
}

interface ExecutionContextLike {
  waitUntil(promise: Promise<unknown>): void;
}

interface ScheduledController {
  cron: string;
  scheduledTime: number;
}

interface YahooTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

interface YahooResolvedLeague {
  leagueKey: string;
  leagueId?: string;
  leagueName?: string;
  leagueUrl?: string;
}

interface LeagueSnapshotMeta {
  source: "yahoo";
  fetchedAt: string;
  requestedWeek?: number;
  currentWeek?: number;
}

interface LeagueSnapshot {
  league: {
    leagueKey: string;
    leagueId?: string;
    gameKey: string;
    season?: number;
    name?: string;
    url?: string;
    currentWeek?: number;
    startWeek?: number;
    endWeek?: number;
    numTeams?: number;
    scoringType?: string;
    draftStatus?: string;
    isFinished?: boolean;
    lastYahooUpdateAt?: string;
  };
  standings: Array<{
    teamKey: string;
    teamId?: string;
    name: string;
    managerNames: string[];
    rank?: number;
    wins?: number;
    losses?: number;
    ties?: number;
    percentage?: number;
    pointsFor?: number;
    pointsAgainst?: number;
    streak?: {
      type?: string;
      length?: number;
      text?: string;
    };
    logoUrl?: string;
  }>;
  matchups: Array<{
    matchupId: string;
    week: number;
    status: "upcoming" | "live" | "final";
    isPlayoffs?: boolean;
    isTied?: boolean;
    winnerTeamKey?: string;
    teams: Array<{
      teamKey: string;
      teamId?: string;
      name: string;
      managerNames: string[];
      points?: number;
      projectedPoints?: number;
      logoUrl?: string;
      isWinner?: boolean;
    }>;
  }>;
  meta: LeagueSnapshotMeta;
}

interface CachedSnapshotEnvelope {
  version: 1;
  cachedAt: string;
  expiresAt: string;
  lastSuccessfulRefreshAt: string;
  snapshot: LeagueSnapshot;
}

interface PublicResponseMeta {
  cacheState: "fresh" | "stale";
  cachedAt: string;
  expiresAt: string;
  lastSuccessfulRefreshAt: string;
  source: "kv" | "live-refresh" | "stale-kv";
  refreshReason?: string;
  warning?: string;
}

const YAHOO_TOKEN_URL = "https://api.login.yahoo.com/oauth2/get_token";
const YAHOO_FANTASY_API_BASE = "https://fantasysports.yahooapis.com/fantasy/v2";
const CACHE_KEY_SNAPSHOT = "fantasy:yahoo:league-snapshot";
const CACHE_KEY_REFRESH_TOKEN = "fantasy:yahoo:refresh-token";
const CACHE_KEY_LAST_ERROR = "fantasy:yahoo:last-refresh-error";
const DEFAULT_CACHE_TTL_SECONDS = 300;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContextLike): Promise<Response> {
    const url = new URL(request.url);

    try {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            Allow: "GET,POST,OPTIONS"
          }
        });
      }

      if (url.pathname === "/api/fantasy/league" && request.method === "GET") {
        return handlePublicLeague(env, ctx);
      }

      if (url.pathname === "/api/fantasy/standings" && request.method === "GET") {
        return handlePublicStandings(env, ctx);
      }

      if (url.pathname === "/api/fantasy/matchups" && request.method === "GET") {
        return handlePublicMatchups(request, env, ctx);
      }

      if (url.pathname === "/api/fantasy/oauth/callback" && request.method === "GET") {
        return new Response(renderCallbackInfoPage(), {
          status: 200,
          headers: {
            "Content-Type": "text/html; charset=utf-8"
          }
        });
      }

      if (url.pathname === "/api/fantasy/admin/bootstrap" && request.method === "POST") {
        ensureAdmin(request, env);
        return handleAdminBootstrap(env);
      }

      if (url.pathname === "/api/fantasy/admin/refresh" && request.method === "POST") {
        ensureAdmin(request, env);
        return handleAdminRefresh(env);
      }

      return json(
        {
          ok: false,
          error: "Not found"
        },
        404
      );
    } catch (error) {
      return handleError(error);
    }
  },

  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContextLike): Promise<void> {
    ctx.waitUntil(refreshLeagueSnapshot(env, `cron:${controller.cron}`));
  }
};

async function handlePublicLeague(env: Env, ctx: ExecutionContextLike): Promise<Response> {
  const result = await getSnapshotForRead(env, ctx, "public:league");
  return json({
    ok: true,
    data: result.envelope.snapshot,
    meta: result.meta
  });
}

async function handlePublicStandings(env: Env, ctx: ExecutionContextLike): Promise<Response> {
  const result = await getSnapshotForRead(env, ctx, "public:standings");
  return json({
    ok: true,
    data: {
      league: result.envelope.snapshot.league,
      standings: result.envelope.snapshot.standings,
      snapshotMeta: result.envelope.snapshot.meta
    },
    meta: result.meta
  });
}

async function handlePublicMatchups(request: Request, env: Env, ctx: ExecutionContextLike): Promise<Response> {
  const requestedWeek = readOptionalInteger(new URL(request.url).searchParams.get("week"));
  const result = await getSnapshotForRead(env, ctx, "public:matchups");
  const allMatchups = result.envelope.snapshot.matchups;
  const filtered = typeof requestedWeek === "number" ? allMatchups.filter((entry) => entry.week === requestedWeek) : allMatchups;

  return json({
    ok: true,
    data: {
      league: result.envelope.snapshot.league,
      requestedWeek,
      matchups: filtered,
      snapshotMeta: result.envelope.snapshot.meta
    },
    meta: result.meta
  });
}

async function handleAdminBootstrap(env: Env): Promise<Response> {
  const details = await bootstrapRefreshToken(env);
  return json({
    ok: true,
    message: "Yahoo production cache bootstrap completed.",
    details
  });
}

async function handleAdminRefresh(env: Env): Promise<Response> {
  const envelope = await refreshLeagueSnapshot(env, "admin:refresh");
  return json({
    ok: true,
    message: "Yahoo production cache refreshed.",
    data: envelope.snapshot,
    meta: {
      cacheState: "fresh",
      cachedAt: envelope.cachedAt,
      expiresAt: envelope.expiresAt,
      lastSuccessfulRefreshAt: envelope.lastSuccessfulRefreshAt,
      source: "live-refresh",
      refreshReason: "admin:refresh"
    } satisfies PublicResponseMeta
  });
}

async function getSnapshotForRead(
  env: Env,
  ctx: ExecutionContextLike,
  refreshReason: string
): Promise<{ envelope: CachedSnapshotEnvelope; meta: PublicResponseMeta }> {
  const cached = await readCachedSnapshot(env);
  if (cached && !isExpired(cached.expiresAt)) {
    return {
      envelope: cached,
      meta: createPublicMeta(cached, "fresh", "kv", refreshReason)
    };
  }

  try {
    const refreshed = await refreshLeagueSnapshot(env, refreshReason);
    return {
      envelope: refreshed,
      meta: createPublicMeta(refreshed, "fresh", "live-refresh", refreshReason)
    };
  } catch (error) {
    if (cached) {
      ctx.waitUntil(writeLastError(env, error));
      return {
        envelope: cached,
        meta: {
          ...createPublicMeta(cached, "stale", "stale-kv", refreshReason),
          warning: error instanceof Error ? error.message : "Refresh failed while serving stale cached league data."
        }
      };
    }

    throw error;
  }
}

function createPublicMeta(
  envelope: CachedSnapshotEnvelope,
  cacheState: "fresh" | "stale",
  source: "kv" | "live-refresh" | "stale-kv",
  refreshReason?: string
): PublicResponseMeta {
  return {
    cacheState,
    cachedAt: envelope.cachedAt,
    expiresAt: envelope.expiresAt,
    lastSuccessfulRefreshAt: envelope.lastSuccessfulRefreshAt,
    source,
    refreshReason
  };
}

async function refreshLeagueSnapshot(env: Env, refreshReason: string): Promise<CachedSnapshotEnvelope> {
  await bootstrapRefreshToken(env);
  const leagueSnapshot = await fetchNormalizedLeagueSnapshot(env);
  const now = new Date();
  const ttlSeconds = getCacheTtlSeconds(env);

  const envelope: CachedSnapshotEnvelope = {
    version: 1,
    cachedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + ttlSeconds * 1000).toISOString(),
    lastSuccessfulRefreshAt: now.toISOString(),
    snapshot: {
      ...leagueSnapshot,
      meta: {
        ...leagueSnapshot.meta
      }
    }
  };

  await env.FANTASY_CACHE.put(CACHE_KEY_SNAPSHOT, JSON.stringify(envelope), {
    expirationTtl: Math.max(ttlSeconds * 3, ttlSeconds + 60)
  });
  await env.FANTASY_CACHE.put(CACHE_KEY_LAST_ERROR, JSON.stringify({ ok: true, refreshedAt: now.toISOString(), refreshReason }), {
    expirationTtl: Math.max(ttlSeconds * 3, ttlSeconds + 60)
  });

  return envelope;
}

async function readCachedSnapshot(env: Env): Promise<CachedSnapshotEnvelope | null> {
  const value = await env.FANTASY_CACHE.get<CachedSnapshotEnvelope>(CACHE_KEY_SNAPSHOT, "json");
  if (!value || value.version !== 1) {
    return null;
  }

  return value;
}

async function bootstrapRefreshToken(env: Env): Promise<{ seededFromSecret: boolean; hasKvRefreshToken: boolean }> {
  const existing = await env.FANTASY_CACHE.get(CACHE_KEY_REFRESH_TOKEN, "text");
  if (existing?.trim()) {
    return { seededFromSecret: false, hasKvRefreshToken: true };
  }

  const seed = env.YAHOO_REFRESH_TOKEN_SEED?.trim();
  if (!seed) {
    throw new Error("Yahoo refresh token is missing. Set YAHOO_REFRESH_TOKEN_SEED or seed fantasy:yahoo:refresh-token in KV.");
  }

  await env.FANTASY_CACHE.put(CACHE_KEY_REFRESH_TOKEN, seed);
  return { seededFromSecret: true, hasKvRefreshToken: true };
}

async function fetchNormalizedLeagueSnapshot(env: Env): Promise<LeagueSnapshot> {
  const token = await refreshYahooAccessToken(env);
  const resolvedLeague = await resolveLeagueKey(env, token.access_token);
  const leagueKey = resolvedLeague.leagueKey;
  const metadataRaw = await fetchYahooJson(`/league/${leagueKey}/metadata`, token.access_token);
  const standingsRaw = await fetchYahooJson(`/league/${leagueKey}/standings`, token.access_token);
  const leagueMetadata = parseLeagueMetadata(metadataRaw, leagueKey, env.YAHOO_GAME_KEY?.trim() || "nfl");
  const requestedWeek = leagueMetadata.currentWeek;
  const scoreboardRaw = typeof requestedWeek === "number"
    ? await fetchYahooJson(`/league/${leagueKey}/scoreboard;week=${requestedWeek}`, token.access_token)
    : await fetchYahooJson(`/league/${leagueKey}/scoreboard`, token.access_token);

  return {
    league: {
      ...leagueMetadata,
      name: resolvedLeague.leagueName ?? leagueMetadata.name,
      url: resolvedLeague.leagueUrl ?? leagueMetadata.url
    },
    standings: parseStandings(standingsRaw),
    matchups: parseMatchups(scoreboardRaw, requestedWeek, leagueMetadata.currentWeek),
    meta: {
      source: "yahoo",
      fetchedAt: new Date().toISOString(),
      requestedWeek,
      currentWeek: leagueMetadata.currentWeek
    }
  };
}

async function refreshYahooAccessToken(env: Env): Promise<YahooTokenResponse> {
  const refreshToken = (await env.FANTASY_CACHE.get(CACHE_KEY_REFRESH_TOKEN, "text"))?.trim();
  if (!refreshToken) {
    throw new Error("KV refresh token not found. Bootstrap the worker before serving fantasy data.");
  }

  const clientId = env.YAHOO_CLIENT_ID?.trim();
  const clientSecret = env.YAHOO_CLIENT_SECRET?.trim();
  const redirectUri = env.YAHOO_REDIRECT_URI?.trim();
  if (!clientId || !clientSecret) {
    throw new Error("Yahoo client credentials are missing. Set YAHOO_CLIENT_ID and YAHOO_CLIENT_SECRET as Worker secrets.");
  }
  if (!redirectUri) {
    throw new Error("Yahoo redirect URI is missing. Set YAHOO_REDIRECT_URI in the worker vars.");
  }

  const basic = btoa(`${clientId}:${clientSecret}`);
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    redirect_uri: redirectUri
  });

  const response = await fetch(YAHOO_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body.toString()
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Yahoo token refresh failed (${response.status}): ${details}`);
  }

  const token = (await response.json()) as YahooTokenResponse;
  if (token.refresh_token?.trim()) {
    await env.FANTASY_CACHE.put(CACHE_KEY_REFRESH_TOKEN, token.refresh_token.trim());
  }

  return token;
}

async function fetchYahooJson(path: string, accessToken: string): Promise<unknown> {
  const url = `${YAHOO_FANTASY_API_BASE}${path}${path.includes("?") ? "&" : "?"}format=json`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Yahoo fantasy API request failed (${response.status}) for ${path}: ${details}`);
  }

  return response.json();
}

async function resolveLeagueKey(env: Env, accessToken: string): Promise<YahooResolvedLeague> {
  const configuredLeagueKey = env.YAHOO_LEAGUE_KEY?.trim();
  const gameKey = env.YAHOO_GAME_KEY?.trim() || "nfl";
  const candidateKeys = new Set<string>();
  const desiredLeagueId = extractLeagueIdFromHint(configuredLeagueKey ?? "");
  const existingKey = extractExistingLeagueKey(configuredLeagueKey ?? "");

  if (existingKey) {
    candidateKeys.add(existingKey);
  }

  if (desiredLeagueId) {
    candidateKeys.add(`${gameKey}.l.${desiredLeagueId}`);
  }

  for (const key of candidateKeys) {
    try {
      const metadata = await fetchYahooJson(`/league/${key}/metadata`, accessToken);
      const found = collectLeagueObjects(metadata).find((league) => league.leagueKey === key) ?? collectLeagueObjects(metadata)[0];
      if (found) {
        return found;
      }
    } catch {
      // Fall back to user leagues lookup.
    }
  }

  const leagueLookups = [
    `/users;use_login=1/games;game_keys=${gameKey}/leagues`,
    "/users;use_login=1/games/leagues"
  ];

  for (const path of leagueLookups) {
    try {
      const leagues = collectLeagueObjects(await fetchYahooJson(path, accessToken));
      if (leagues.length === 0) {
        continue;
      }

      if (desiredLeagueId) {
        const match =
          leagues.find((league) => league.leagueId === desiredLeagueId) ??
          leagues.find((league) => league.leagueUrl?.includes(`/${desiredLeagueId}`));
        if (match) {
          return match;
        }
      }

      return leagues[0];
    } catch {
      // Try the next lookup shape.
    }
  }

  throw new Error("Unable to resolve a Yahoo league key for the configured account.");
}

function parseLeagueMetadata(raw: unknown, leagueKey: string, gameKey: string): LeagueSnapshot["league"] {
  const league =
    collectRecords(raw).find((entry) => toStringValue(entry.league_key) === leagueKey) ??
    collectRecords(raw).find((entry) => typeof entry.league_key !== "undefined") ??
    {};

  return {
    leagueKey,
    leagueId: toStringValue(league.league_id),
    gameKey: toStringValue(league.game_key) ?? gameKey,
    season: toNumberValue(league.season),
    name: toStringValue(league.name),
    url: toStringValue(league.url),
    currentWeek: toNumberValue(league.current_week),
    startWeek: toNumberValue(league.start_week),
    endWeek: toNumberValue(league.end_week),
    numTeams: toNumberValue(league.num_teams),
    scoringType: toStringValue(league.scoring_type),
    draftStatus: toStringValue(league.draft_status),
    isFinished: toBooleanFlag(league.is_finished),
    lastYahooUpdateAt: toTimestampIso(league.league_update_timestamp)
  };
}

function parseStandings(raw: unknown): LeagueSnapshot["standings"] {
  const teamRecords = uniqueBy(
    collectRecords(raw).filter((entry) => typeof entry.team_key !== "undefined" && typeof entry.name !== "undefined"),
    (entry) => toStringValue(entry.team_key) ?? crypto.randomUUID()
  );

  return teamRecords
    .map((team) => {
      const teamKey = toStringValue(team.team_key);
      if (!teamKey) {
        return null;
      }

      const standings = asRecord(team.team_standings);
      const outcomeTotals = asRecord(standings.outcome_totals);
      const streak = asRecord(standings.streak);
      const pointsFor = asRecord(standings.points_for);
      const pointsAgainst = asRecord(standings.points_against);

      return {
        teamKey,
        teamId: toStringValue(team.team_id),
        name: toStringValue(team.name) ?? teamKey,
        managerNames: extractManagerNames(team),
        rank: toNumberValue(standings.rank),
        wins: toNumberValue(outcomeTotals.wins),
        losses: toNumberValue(outcomeTotals.losses),
        ties: toNumberValue(outcomeTotals.ties),
        percentage: toNumberValue(outcomeTotals.percentage),
        pointsFor: toNumberValue(pointsFor.total),
        pointsAgainst: toNumberValue(pointsAgainst.total),
        streak: {
          type: toStringValue(streak.type),
          length: toNumberValue(streak.value),
          text: buildStreakText(streak)
        },
        logoUrl: extractTeamLogoUrl(team)
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .sort((left, right) => (left.rank ?? Number.MAX_SAFE_INTEGER) - (right.rank ?? Number.MAX_SAFE_INTEGER));
}

function parseMatchups(
  raw: unknown,
  requestedWeek?: number,
  currentWeek?: number
): LeagueSnapshot["matchups"] {
  const matchups = uniqueBy(
    collectRecords(raw).filter((entry) => typeof entry.teams !== "undefined" && typeof entry.week !== "undefined"),
    (entry, index) => {
      const explicitId = toStringValue(entry.matchup_id);
      if (explicitId) return explicitId;
      const week = toNumberValue(entry.week) ?? requestedWeek ?? currentWeek ?? 0;
      return `${week}-${index}`;
    }
  );

  return matchups
    .map((matchup, index) => {
      const week = toNumberValue(matchup.week) ?? requestedWeek;
      if (typeof week !== "number") {
        return null;
      }

      const teams = uniqueBy(
        collectRecords(matchup.teams).filter((entry) => typeof entry.team_key !== "undefined" && typeof entry.name !== "undefined"),
        (entry) => toStringValue(entry.team_key) ?? crypto.randomUUID()
      ).map((team) => {
        const teamKey = toStringValue(team.team_key) ?? "unknown";
        const points = toNumberValue(asRecord(team.team_points).total);
        const projectedPoints = toNumberValue(asRecord(team.team_projected_points).total);
        return {
          teamKey,
          teamId: toStringValue(team.team_id),
          name: toStringValue(team.name) ?? teamKey,
          managerNames: extractManagerNames(team),
          points,
          projectedPoints,
          logoUrl: extractTeamLogoUrl(team),
          isWinner: undefined as boolean | undefined
        };
      });

      const winnerTeamKey = toStringValue(matchup.winner_team_key);
      const isTied = toBooleanFlag(matchup.is_tied);
      const finalizedTeams = teams.map((team) => ({
        ...team,
        isWinner: winnerTeamKey ? team.teamKey === winnerTeamKey : undefined
      }));

      return {
        matchupId: toStringValue(matchup.matchup_id) ?? `week-${week}-${index + 1}`,
        week,
        status: resolveMatchupStatus(matchup, week, currentWeek, Boolean(winnerTeamKey)),
        isPlayoffs: toBooleanFlag(matchup.is_playoffs),
        isTied,
        winnerTeamKey,
        teams: finalizedTeams
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .sort((left, right) => left.week - right.week);
}

function resolveMatchupStatus(
  matchup: Record<string, unknown>,
  week: number,
  currentWeek?: number,
  hasWinner = false
): "upcoming" | "live" | "final" {
  const explicitStatus = toStringValue(matchup.status)?.toLowerCase();
  if (explicitStatus === "postevent" || explicitStatus === "final") {
    return "final";
  }
  if (explicitStatus === "preevent" || explicitStatus === "upcoming") {
    return "upcoming";
  }
  if (explicitStatus === "live" || explicitStatus === "inprogress") {
    return "live";
  }
  if (hasWinner) {
    return "final";
  }
  if (typeof currentWeek === "number") {
    if (week < currentWeek) return "final";
    if (week > currentWeek) return "upcoming";
  }
  return "live";
}

function extractManagerNames(team: Record<string, unknown>): string[] {
  const managersContainer = team.managers;
  if (!managersContainer) {
    return [];
  }

  const names = uniqueBy(
    collectRecords(managersContainer)
      .map((entry) => toStringValue(entry.nickname) ?? toStringValue(entry.email) ?? toStringValue(entry.guid))
      .filter((value): value is string => Boolean(value)),
    (value) => value.toLowerCase()
  );

  return names;
}

function extractTeamLogoUrl(team: Record<string, unknown>): string | undefined {
  const logo = collectRecords(team.team_logos)
    .map((entry) => toStringValue(entry.url))
    .find((value): value is string => Boolean(value));
  return logo;
}

function buildStreakText(streak: Record<string, unknown>): string | undefined {
  const type = toStringValue(streak.type);
  const length = toNumberValue(streak.value);
  if (!type || typeof length !== "number") {
    return undefined;
  }

  const shortType = type.toLowerCase().startsWith("win") ? "W" : type.toLowerCase().startsWith("loss") ? "L" : type.toUpperCase();
  return `${shortType}${length}`;
}

function collectLeagueObjects(input: unknown, results: YahooResolvedLeague[] = []): YahooResolvedLeague[] {
  if (Array.isArray(input)) {
    input.forEach((entry) => collectLeagueObjects(entry, results));
    return results;
  }

  if (!isRecord(input)) {
    return results;
  }

  const leagueKey = toStringValue(input.league_key);
  const leagueId = toStringValue(input.league_id);

  if (leagueKey) {
    results.push({
      leagueKey,
      leagueId,
      leagueName: toStringValue(input.name),
      leagueUrl: toStringValue(input.url)
    });
  }

  Object.values(input).forEach((value) => collectLeagueObjects(value, results));
  return results;
}

function collectRecords(input: unknown, results: Record<string, unknown>[] = []): Record<string, unknown>[] {
  if (Array.isArray(input)) {
    input.forEach((entry) => collectRecords(entry, results));
    return results;
  }

  if (!isRecord(input)) {
    return results;
  }

  results.push(input);
  Object.values(input).forEach((value) => collectRecords(value, results));
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

function ensureAdmin(request: Request, env: Env): void {
  const expected = env.ADMIN_API_TOKEN?.trim();
  if (!expected) {
    throw new HttpError(503, "ADMIN_API_TOKEN is not configured for admin endpoints.");
  }

  const supplied = request.headers.get("authorization")?.trim();
  if (!supplied || supplied !== `Bearer ${expected}`) {
    throw new HttpError(401, "Missing or invalid admin bearer token.");
  }
}

function getCacheTtlSeconds(env: Env): number {
  const parsed = Number.parseInt(env.CACHE_TTL_SECONDS?.trim() ?? String(DEFAULT_CACHE_TTL_SECONDS), 10);
  if (!Number.isFinite(parsed) || parsed < 60) {
    return DEFAULT_CACHE_TTL_SECONDS;
  }
  return parsed;
}

async function writeLastError(env: Env, error: unknown): Promise<void> {
  await env.FANTASY_CACHE.put(
    CACHE_KEY_LAST_ERROR,
    JSON.stringify({
      ok: false,
      refreshedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown refresh error"
    }),
    { expirationTtl: getCacheTtlSeconds(env) * 3 }
  );
}

function isExpired(isoTimestamp: string): boolean {
  const value = Date.parse(isoTimestamp);
  return Number.isNaN(value) || value <= Date.now();
}

function readOptionalInteger(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toTimestampIso(value: unknown): string | undefined {
  const numeric = toNumberValue(value);
  if (typeof numeric !== "number") {
    return undefined;
  }

  return new Date(numeric * 1000).toISOString();
}

function toNumberValue(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function toStringValue(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return undefined;
}

function toBooleanFlag(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }
  const stringValue = toStringValue(value)?.toLowerCase();
  if (stringValue === "1" || stringValue === "true") {
    return true;
  }
  if (stringValue === "0" || stringValue === "false") {
    return false;
  }
  return undefined;
}

function asRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function uniqueBy<T>(items: T[], getKey: (item: T, index: number) => string): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  items.forEach((item, index) => {
    const key = getKey(item, index);
    if (!key || seen.has(key)) {
      return;
    }
    seen.add(key);
    result.push(item);
  });

  return result;
}

function json(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function renderCallbackInfoPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Fantasy Yahoo Callback</title>
    <style>
      :root { color-scheme: dark; }
      body { margin: 0; background: #020617; color: #e2e8f0; font-family: Inter, system-ui, sans-serif; }
      main { max-width: 760px; margin: 64px auto; padding: 24px; }
      section { border: 1px solid rgba(148,163,184,0.16); background: rgba(15,23,42,0.92); border-radius: 24px; padding: 28px; box-shadow: 0 18px 48px rgba(0,0,0,0.35); }
      .eyebrow { display:inline-block; border:1px solid rgba(59,130,246,0.28); background: rgba(59,130,246,0.12); color:#93c5fd; border-radius:999px; padding:6px 12px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; }
      h1 { margin: 18px 0 0; font-size: 32px; line-height: 1.15; color: #f8fafc; }
      p { margin: 14px 0 0; line-height: 1.7; color: #cbd5e1; }
      code { color: #f8fafc; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    </style>
  </head>
  <body>
    <main>
      <section>
        <span class="eyebrow">Fantasy Yahoo Worker</span>
        <h1>Production callback route is reserved</h1>
        <p>This path exists so the Yahoo app can reference a production redirect URI. The public fantasy pages do not use visitor OAuth; production data is served from the worker cache instead.</p>
        <p>Use <code>POST /api/fantasy/admin/bootstrap</code> and <code>POST /api/fantasy/admin/refresh</code> for admin-side token seeding and refresh actions.</p>
      </section>
    </main>
  </body>
</html>`;
}

function handleError(error: unknown): Response {
  if (error instanceof HttpError) {
    return json({ ok: false, error: error.message }, error.status);
  }

  return json(
    {
      ok: false,
      error: error instanceof Error ? error.message : "Unexpected worker error"
    },
    500
  );
}

class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}
