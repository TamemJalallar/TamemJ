import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.resolve(SCRIPT_DIR, '../data/leaguelegacy-public-seasons.json');
const ENV_PATH = path.resolve(SCRIPT_DIR, '../.env.local');
const LEAGUELEGACY_BASE_URL = 'https://leaguelegacy.io';
const SEASON_SOURCES = [
  { year: 2025, slug: '2025', url: 'https://leaguelegacy.io/leagues/uzbek-mafia/seasons/2025' },
  { year: 2024, slug: '2024', url: 'https://leaguelegacy.io/leagues/uzbek-mafia/seasons/2024' },
  { year: 2023, slug: '2023', url: 'https://leaguelegacy.io/leagues/uzbek-mafia/seasons/2023' },
  { year: 2022, slug: '2022', url: 'https://leaguelegacy.io/leagues/uzbek-mafia/seasons/2022' },
  { year: 2021, slug: '2021', url: 'https://leaguelegacy.io/leagues/uzbek-mafia/seasons/2021' }
];

const USER_AGENT = 'Mozilla/5.0 (compatible; TamemJFantasyLeagueBot/1.0; +https://tamemj.com/fantasy/)';
const PLAYER_NAME_OVERRIDES = new Map([
  ['41499', { name: 'Spencer Shrader' }],
  ['00-0039576', { name: 'Spencer Shrader' }],
  ['33495', { name: 'Michael Carter' }],
  ['00-0036924', { name: 'Michael Carter' }]
]);

async function hydrateLocalEnv() {
  try {
    const raw = await readFile(ENV_PATH, 'utf8');

    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      if (!key || process.env[key] !== undefined) continue;

      let value = trimmed.slice(separatorIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      process.env[key] = value;
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return;
    }

    throw error;
  }
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractPagePayload(html) {
  const match = html.match(/data-page="([\s\S]*?)"/);
  if (!match?.[1]) {
    throw new Error('Unable to locate LeagueLegacy data-page payload.');
  }

  return JSON.parse(decodeHtmlEntities(match[1]));
}

function pick(object, keys) {
  return Object.fromEntries(keys.map((key) => [key, object?.[key] ?? null]));
}

function parseMaybeJsonArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string' || value.trim() === '') return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseSetCookie(setCookieHeaders) {
  const jar = new Map();

  for (const header of setCookieHeaders) {
    const [pair] = header.split(';');
    const separatorIndex = pair.indexOf('=');
    if (separatorIndex === -1) continue;
    jar.set(pair.slice(0, separatorIndex), pair.slice(separatorIndex + 1));
  }

  return jar;
}

function mergeCookieJar(targetJar, setCookieHeaders) {
  for (const [key, value] of parseSetCookie(setCookieHeaders)) {
    targetJar.set(key, value);
  }
}

function getSetCookieHeaders(response) {
  if (typeof response.headers.getSetCookie === 'function') {
    return response.headers.getSetCookie();
  }

  const singleHeader = response.headers.get('set-cookie');
  return singleHeader ? [singleHeader] : [];
}

function cookieHeader(jar) {
  return [...jar.entries()].map(([key, value]) => `${key}=${value}`).join('; ');
}

function hasLeagueLegacyCredentials() {
  return Boolean(process.env.LEAGUELEGACY_EMAIL?.trim() && process.env.LEAGUELEGACY_PASSWORD?.trim());
}

async function loginToLeagueLegacy() {
  const jar = new Map();

  const csrfResponse = await fetch(`${LEAGUELEGACY_BASE_URL}/sanctum/csrf-cookie`, {
    redirect: 'manual',
    headers: {
      'user-agent': USER_AGENT,
      accept: 'text/html,application/xhtml+xml'
    }
  });
  mergeCookieJar(jar, getSetCookieHeaders(csrfResponse));

  const xsrfToken = decodeURIComponent(jar.get('XSRF-TOKEN') || '');
  if (!xsrfToken) {
    throw new Error('LeagueLegacy login could not acquire an XSRF token.');
  }

  const loginResponse = await fetch(`${LEAGUELEGACY_BASE_URL}/login`, {
    method: 'POST',
    redirect: 'manual',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'x-xsrf-token': xsrfToken,
      'x-requested-with': 'XMLHttpRequest',
      origin: LEAGUELEGACY_BASE_URL,
      referer: `${LEAGUELEGACY_BASE_URL}/login`,
      cookie: cookieHeader(jar),
      accept: 'text/html,application/xhtml+xml,application/json',
      'user-agent': USER_AGENT
    },
    body: new URLSearchParams({
      email: process.env.LEAGUELEGACY_EMAIL?.trim() || '',
      password: process.env.LEAGUELEGACY_PASSWORD?.trim() || '',
      remember: 'on'
    }).toString()
  });
  mergeCookieJar(jar, getSetCookieHeaders(loginResponse));

  if (loginResponse.status !== 302 || !jar.has('league_legacy_session')) {
    throw new Error(`LeagueLegacy login failed with status ${loginResponse.status}.`);
  }

  return jar;
}

async function fetchText(url, sessionJar) {
  const response = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
      accept: 'text/html,application/xhtml+xml',
      ...(sessionJar ? { cookie: cookieHeader(sessionJar) } : {})
    }
  });

  if (!response.ok) {
    throw new Error(`LeagueLegacy request for ${url} failed with ${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function fetchJson(url, sessionJar, referer) {
  if (!sessionJar) {
    throw new Error(`LeagueLegacy authenticated JSON fetch requires a session: ${url}`);
  }

  const response = await fetch(url, {
    headers: {
      cookie: cookieHeader(sessionJar),
      accept: 'application/json,text/plain,*/*',
      'x-requested-with': 'XMLHttpRequest',
      referer,
      'user-agent': USER_AGENT
    },
    redirect: 'manual'
  });

  if (!response.ok) {
    throw new Error(`LeagueLegacy API request for ${url} failed with ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function mapMember(member) {
  return pick(member, [
    'id',
    'name',
    'slug',
    'photo',
    'is_commissioner',
    'is_manager',
    'elo_rating',
    'status'
  ]);
}

function mapTeam(team) {
  return pick(team, [
    'id',
    'league_member_id',
    'team_key',
    'name',
    'display_name',
    'slug',
    'num_moves',
    'num_trades',
    'draft_grade',
    'draft_rank',
    'coach_score',
    'coach_rank',
    'wins',
    'losses',
    'ties',
    'rank',
    'regular_season_rank',
    'playoff_seed',
    'playoff_wins',
    'playoff_losses',
    'total_points',
    'total_projected_points',
    'total_optimal_points',
    'total_optimal_points_rank',
    'schedule_strength',
    'luck'
  ]);
}

function mapRosterPlayer(player) {
  return pick(player, [
    'player_id',
    'service_player_id',
    'player_name',
    'player_team',
    'player_position',
    'lineup_position',
    'points',
    'points_ppr',
    'started',
    'is_optimal'
  ]);
}

function mapMatchup(matchup) {
  return {
    ...pick(matchup, [
      'id',
      'matchup_guid',
      'season_team_id',
      'league_member_id',
      'week',
      'week_multi',
      'week_start',
      'week_end',
      'points',
      'points_ppr',
      'projected_points',
      'optimal_points',
      'points_rank',
      'optimal_points_rank',
      'points_share',
      'coach_score',
      'coach_rank',
      'luck',
      'opponent_season_team_id',
      'opponent_league_member_id',
      'opponent_points',
      'opponent_points_ppr',
      'opponent_projected_points',
      'opponent_points_rank',
      'opponent_points_share',
      'is_game_of_week'
    ]),
    team: matchup.team ? mapTeam(matchup.team) : null,
    opponent: matchup.opponent ? mapTeam(matchup.opponent) : null,
    roster: parseMaybeJsonArray(matchup.roster).map(mapRosterPlayer),
    opponentRoster: parseMaybeJsonArray(matchup.inverse_relation?.roster ?? matchup.opponent_roster).map(mapRosterPlayer)
  };
}

function mapDraftResult(result) {
  return {
    ...pick(result, [
      'id',
      'season_team_id',
      'player_id',
      'service_player_id',
      'player_team',
      'draft_round',
      'draft_round_pick',
      'draft_pick',
      'is_keeper',
      'from_trade',
      'comment',
      'value'
    ]),
    player: result.player
      ? pick(result.player, ['id', 'fantasypros_id', 'name', 'position', 'position_alt', 'team'])
      : null,
    team: result.team ? mapTeam(result.team) : null
  };
}

function mapTransaction(transaction) {
  return {
    ...pick(transaction, [
      'id',
      'season_team_id',
      'trade_partner_season_team_id',
      'service_key',
      'type',
      'faab_bid',
      'waiver_priority',
      'trade_initiator',
      'value',
      'transaction_week',
      'transaction_at',
      'position_added',
      'player_added',
      'value_added',
      'position_dropped',
      'player_dropped',
      'value_dropped',
      'week_display'
    ]),
    team: transaction.team ? mapTeam(transaction.team) : null,
    tradePartnerTeam: transaction.trade_partner_team ? mapTeam(transaction.trade_partner_team) : null,
    items: Array.isArray(transaction.items)
      ? transaction.items.map((item) => ({
          ...pick(item, [
            'id',
            'type',
            'status',
            'direction',
            'player_id',
            'service_player_id',
            'player_name',
            'player_position',
            'player_team',
            'faab_bid',
            'value'
          ]),
          player: item.player ? pick(item.player, ['id', 'name', 'team', 'position', 'fantasypros_id']) : null
        }))
      : []
  };
}

function mapAnnotation(annotation) {
  return pick(annotation, [
    'id',
    'season_team_id',
    'week',
    'matchup_guid',
    'type',
    'title',
    'text',
    'system_created'
  ]);
}

function mapNewsletter(newsletter) {
  return {
    ...pick(newsletter, ['id', 'type', 'name', 'slug', 'week', 'intro', 'preview', 'issued_at', 'published_at']),
    previews: Array.isArray(newsletter.previews)
      ? newsletter.previews.map((preview) => ({
          ...pick(preview, ['id', 'team_id', 'matchup_id', 'matchup_key', 'matchup_guid', 'summary']),
          matchup: preview.matchup ? mapMatchup(preview.matchup) : null
        }))
      : [],
    recaps: Array.isArray(newsletter.recaps)
      ? newsletter.recaps.map((recap) => ({
          ...pick(recap, ['id', 'team_id', 'matchup_id', 'matchup_key', 'matchup_guid', 'summary']),
          matchup: recap.matchup ? mapMatchup(recap.matchup) : null
        }))
      : []
  };
}

function buildPlayerNameLookup(draftResults, transactions) {
  const lookup = new Map();

  const addPlayer = (playerLike) => {
    if (!playerLike) return;

    const name = (playerLike.name || playerLike.player_name || '').trim();
    if (!name || name === 'tbd') return;

    const team = playerLike.team || playerLike.player_team || null;
    const position = playerLike.position || playerLike.player_position || null;
    const aliases = [
      playerLike.id,
      playerLike.player_id,
      playerLike.service_player_id,
      playerLike.yahoo_id,
      playerLike.espn_id,
      playerLike.sleeper_id,
      playerLike.gsis_id,
      playerLike.fantasypros_id
    ]
      .filter(Boolean)
      .map((value) => String(value));

    for (const alias of aliases) {
      if (!lookup.has(alias)) {
        lookup.set(alias, { name, team, position });
      }
    }
  };

  for (const result of draftResults) {
    addPlayer(result.player);
    addPlayer({
      player_id: result.player_id,
      service_player_id: result.service_player_id,
      player_team: result.player_team,
      player_position: result.player?.position,
      name: result.player?.name
    });
  }

  for (const transaction of transactions) {
    for (const item of transaction.items ?? []) {
      addPlayer(item.player);
      addPlayer(item);
    }
  }

  return lookup;
}

function resolvePlayerName(player, lookup) {
  const currentName = typeof player?.player_name === 'string' ? player.player_name.trim() : '';
  if (currentName && currentName !== 'tbd') {
    return {
      name: currentName,
      team: player.player_team ?? null,
      position: player.player_position ?? null,
      resolved: false
    };
  }

  const aliases = [player?.player_id, player?.service_player_id]
    .filter(Boolean)
    .map((value) => String(value));

  for (const alias of aliases) {
    const match = lookup.get(alias);
    if (match) {
      return {
        ...match,
        resolved: true
      };
    }
  }

  for (const alias of aliases) {
    const override = PLAYER_NAME_OVERRIDES.get(alias);
    if (override) {
      return {
        name: override.name,
        team: player?.player_team ?? override.team ?? null,
        position: player?.player_position ?? override.position ?? null,
        resolved: true
      };
    }
  }

  return {
    name: currentName || 'tbd',
    team: player?.player_team ?? null,
    position: player?.player_position ?? null,
    resolved: false
  };
}

function enrichRosterPlayers(players, lookup) {
  return players.map((player) => {
    const resolved = resolvePlayerName(player, lookup);
    return mapRosterPlayer({
      ...player,
      player_name: resolved.name,
      player_team: player.player_team ?? resolved.team,
      player_position: player.player_position ?? resolved.position
    });
  });
}

function getRosterResolutionStats(matchups) {
  let totalSlots = 0;
  let resolvedSlots = 0;
  let unresolvedSlots = 0;
  let unresolvedStartedSlots = 0;

  for (const matchup of matchups) {
    for (const roster of [matchup.roster, matchup.opponentRoster]) {
      for (const player of roster ?? []) {
        totalSlots += 1;
        if (player.player_name && player.player_name !== 'tbd') {
          resolvedSlots += 1;
        } else {
          unresolvedSlots += 1;
          if (player.started) unresolvedStartedSlots += 1;
        }
      }
    }
  }

  return {
    totalSlots,
    resolvedSlots,
    unresolvedSlots,
    unresolvedStartedSlots,
    resolutionRate: totalSlots > 0 ? resolvedSlots / totalSlots : 1
  };
}

async function fetchSeasonEnrichment(source, sessionJar) {
  if (!sessionJar) return null;

  const referer = source.url;
  const draftJson = await fetchJson(`${LEAGUELEGACY_BASE_URL}/api/leagues/uzbek-mafia/draft/seasons/${source.slug}`, sessionJar, referer);
  const transactionJson = await fetchJson(`${LEAGUELEGACY_BASE_URL}/api/leagues/uzbek-mafia/transactions/seasons/${source.slug}`, sessionJar, referer);

  return {
    draftResults: Array.isArray(draftJson?.season?.draft_results) ? draftJson.season.draft_results : [],
    transactions: Array.isArray(transactionJson?.transactions) ? transactionJson.transactions : []
  };
}

async function fetchSeasonSnapshot(source, sessionJar) {
  const html = await fetchText(source.url, sessionJar);
  const payload = extractPagePayload(html);
  const props = payload.props ?? {};
  const season = props.season ?? {};
  const league = props.league ?? {};

  const enrichment = await fetchSeasonEnrichment(source, sessionJar);
  const draftResultsSource = enrichment?.draftResults ?? (Array.isArray(season.draft_results) ? season.draft_results : []);
  const transactionsSource = enrichment?.transactions ?? (Array.isArray(props.transactions) ? props.transactions : []);
  const playerNameLookup = buildPlayerNameLookup(draftResultsSource, transactionsSource);

  const mappedMatchups = Array.isArray(season.matchups) ? season.matchups.map(mapMatchup) : [];
  const enrichedMatchups = mappedMatchups.map((matchup) => ({
    ...matchup,
    roster: enrichRosterPlayers(matchup.roster, playerNameLookup),
    opponentRoster: enrichRosterPlayers(matchup.opponentRoster, playerNameLookup)
  }));
  const rosterNameResolution = getRosterResolutionStats(enrichedMatchups);

  return {
    seasonYear: source.year,
    sourceUrl: source.url,
    fetchedAt: new Date().toISOString(),
    component: payload.component,
    usedAuthenticatedEnrichment: Boolean(sessionJar),
    rosterNameResolution,
    league: {
      ...pick(league, [
        'id',
        'sport',
        'name',
        'slug',
        'theme',
        'theme_dark',
        'is_private',
        'use_draft',
        'use_schedule',
        'use_transactions',
        'use_record_book',
        'history_include_playoffs',
        'history_include_consolation',
        'roster_positions'
      ]),
      members: Array.isArray(league.members) ? league.members.map(mapMember) : []
    },
    season: {
      ...pick(season, [
        'id',
        'service_type',
        'service_key',
        'season',
        'season_name',
        'name',
        'slug',
        'num_teams',
        'num_weeks',
        'start_week',
        'end_week',
        'last_import_week',
        'scoring_type',
        'avg_points',
        'roster_positions',
        'use_median_scoring',
        'use_h2h_tiebreaker',
        'use_keepers',
        'draft_type',
        'draft_player_pool',
        'has_playoffs',
        'playoff_type',
        'num_playoff_teams',
        'playoff_start_week',
        'has_multiweek_playoffs',
        'has_multiweek_championship',
        'use_matchups',
        'use_season_recaps',
        'use_ppr_optimal_points',
        'status'
      ]),
      teams: Array.isArray(season.teams) ? season.teams.map(mapTeam) : [],
      matchups: enrichedMatchups,
      draftResults: draftResultsSource.map(mapDraftResult),
      annotations: Array.isArray(season.annotations) ? season.annotations.map(mapAnnotation) : [],
      newsletters: Array.isArray(season.newsletters_published) ? season.newsletters_published.map(mapNewsletter) : []
    },
    transactions: transactionsSource.map(mapTransaction),
    hiddenPicks: Array.isArray(props.hiddenPicks) ? props.hiddenPicks : []
  };
}

await hydrateLocalEnv();

let sessionJar = null;
if (hasLeagueLegacyCredentials()) {
  console.log('LeagueLegacy credentials found. Enabling authenticated player-name enrichment...');
  sessionJar = await loginToLeagueLegacy();
} else {
  console.log('No LeagueLegacy credentials found. Syncing public season payloads only.');
}

const seasons = [];
for (const source of SEASON_SOURCES) {
  console.log(`Fetching LeagueLegacy season ${source.year}...`);
  seasons.push(await fetchSeasonSnapshot(source, sessionJar));
}

const totalResolution = seasons.reduce(
  (summary, season) => {
    summary.totalSlots += season.rosterNameResolution.totalSlots;
    summary.resolvedSlots += season.rosterNameResolution.resolvedSlots;
    summary.unresolvedSlots += season.rosterNameResolution.unresolvedSlots;
    summary.unresolvedStartedSlots += season.rosterNameResolution.unresolvedStartedSlots;
    return summary;
  },
  {
    totalSlots: 0,
    resolvedSlots: 0,
    unresolvedSlots: 0,
    unresolvedStartedSlots: 0
  }
);
const overallResolutionRate = totalResolution.totalSlots > 0 ? totalResolution.resolvedSlots / totalResolution.totalSlots : 1;

const snapshot = {
  sourceLabel: sessionJar
    ? 'LeagueLegacy season pages with authenticated draft and transaction enrichment'
    : 'LeagueLegacy public season pages',
  leagueSlug: 'uzbek-mafia',
  fetchedAt: new Date().toISOString(),
  seasonCount: seasons.length,
  usedAuthenticatedEnrichment: Boolean(sessionJar),
  rosterNameResolution: {
    ...totalResolution,
    resolutionRate: overallResolutionRate
  },
  caveats: [
    'Season scaffolding comes from the LeagueLegacy Inertia payload embedded in each season page.',
    'Weekly matchup rows include roster, optimal points, coach score, and luck.',
    sessionJar
      ? `Authenticated draft and transaction feeds were joined against weekly roster IDs to resolve player names for ${totalResolution.resolvedSlots} of ${totalResolution.totalSlots} roster slots.`
      : 'Without LeagueLegacy credentials, some matchup roster player_name values may remain serialized as "tbd".',
    totalResolution.unresolvedSlots > 0
      ? `${totalResolution.unresolvedSlots} roster slots remain unresolved after enrichment, including ${totalResolution.unresolvedStartedSlots} started slots.`
      : 'All roster slots resolved cleanly during enrichment.'
  ],
  seasons
};

await writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
console.log(`Saved ${snapshot.seasonCount} LeagueLegacy seasons to ${OUTPUT_PATH}`);
console.log(
  `Roster name resolution: ${totalResolution.resolvedSlots}/${totalResolution.totalSlots} (${(overallResolutionRate * 100).toFixed(1)}%)`
);
