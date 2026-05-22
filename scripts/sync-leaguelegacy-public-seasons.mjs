import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const OUTPUT_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../data/leaguelegacy-public-seasons.json');
const SEASON_SOURCES = [
  { year: 2025, url: 'https://leaguelegacy.io/leagues/uzbek-mafia/seasons/2025' },
  { year: 2024, url: 'https://leaguelegacy.io/leagues/uzbek-mafia/seasons/2024' },
  { year: 2023, url: 'https://leaguelegacy.io/leagues/uzbek-mafia/seasons/2023' },
  { year: 2022, url: 'https://leaguelegacy.io/leagues/uzbek-mafia/seasons/2022' },
  { year: 2021, url: 'https://leaguelegacy.io/leagues/uzbek-mafia/seasons/2021' }
];

const USER_AGENT = 'Mozilla/5.0 (compatible; TamemJFantasyLeagueBot/1.0; +https://tamemj.com/fantasy/)';

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
      ? transaction.items.map((item) =>
          pick(item, [
            'id',
            'type',
            'status',
            'direction',
            'player_name',
            'player_position',
            'player_team',
            'faab_bid',
            'value'
          ])
        )
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

async function fetchSeasonSnapshot(source) {
  const response = await fetch(source.url, {
    headers: {
      'user-agent': USER_AGENT,
      accept: 'text/html,application/xhtml+xml'
    }
  });

  if (!response.ok) {
    throw new Error(`LeagueLegacy request for ${source.year} failed with ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const payload = extractPagePayload(html);
  const props = payload.props ?? {};
  const season = props.season ?? {};
  const league = props.league ?? {};

  return {
    seasonYear: source.year,
    sourceUrl: source.url,
    fetchedAt: new Date().toISOString(),
    component: payload.component,
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
      matchups: Array.isArray(season.matchups) ? season.matchups.map(mapMatchup) : [],
      draftResults: Array.isArray(season.draft_results) ? season.draft_results.map(mapDraftResult) : [],
      annotations: Array.isArray(season.annotations) ? season.annotations.map(mapAnnotation) : [],
      newsletters: Array.isArray(season.newsletters_published) ? season.newsletters_published.map(mapNewsletter) : []
    },
    transactions: Array.isArray(props.transactions) ? props.transactions.map(mapTransaction) : [],
    hiddenPicks: Array.isArray(props.hiddenPicks) ? props.hiddenPicks : []
  };
}

const seasons = [];
for (const source of SEASON_SOURCES) {
  console.log(`Fetching LeagueLegacy public season ${source.year}...`);
  seasons.push(await fetchSeasonSnapshot(source));
}

const snapshot = {
  sourceLabel: 'LeagueLegacy public season pages',
  leagueSlug: 'uzbek-mafia',
  fetchedAt: new Date().toISOString(),
  seasonCount: seasons.length,
  caveats: [
    'Season data was extracted from the public LeagueLegacy Inertia payload embedded in the HTML.',
    'Weekly matchup rows include roster, optimal points, coach score, and luck.',
    'Some matchup roster player_name values may be serialized as "tbd" in the public payload; team-level lineup efficiency remains usable even when player labels are obfuscated.'
  ],
  seasons
};

await writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
console.log(`Saved ${snapshot.seasonCount} public LeagueLegacy seasons to ${OUTPUT_PATH}`);
