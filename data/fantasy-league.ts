import fantasyLeagueArchive from "@/data/fantasy-league.archive.json";
import fantasyProsPprSnapshot from "@/data/fantasypros-ppr-cheatsheet.json";
import fantasyLeagueTrades from "@/data/fantasy-league.trades.json";
import type {
  FantasyDraftPick,
  FantasyKeeperCandidate,
  FantasyKeeperRules,
  FantasyKeeperSelection,
  FantasyLeagueAward,
  FantasyLeagueDataset,
  FantasyLeagueIdentity,
  FantasyManagerProfile,
  FantasyManagerSeasonRoster,
  FantasyManagerSeasonSnapshot,
  FantasyLeagueRecord,
  FantasyMatchup,
  FantasyMember,
  FantasyPlayer,
  FantasyPlayerPosition,
  FantasySeason,
  FantasySeasonDraftTendency,
  FantasyStanding,
  FantasyTeamIdentity,
  FantasyTrade
} from "@/types/fantasy";

type ArchiveMember = {
  id: string;
  displayName: string;
  slug: string;
  avatarUrl?: string | null;
  color?: string | null;
  isCommissioner?: boolean;
};

type ArchiveSeasonTeam = {
  memberId: string;
  seasonTeamId: string;
  teamKey?: string | null;
  teamName: string;
  slug?: string | null;
  wins: number;
  losses: number;
  ties: number;
  overallWins: number;
  overallLosses: number;
  overallTies: number;
  pointsFor: number;
  pointsAgainst: number;
  playoffSeed?: number | null;
  playoffWins: number;
  playoffLosses: number;
  draftGrade?: string | null;
  draftRank?: number | null;
  coachRank?: number | null;
  numMoves: number;
  numTrades: number;
  avgPoints: number;
  rank?: number | null;
  regularSeasonRank?: number | null;
  score?: number | null;
  memberColor?: string | null;
};

type ArchiveSeason = {
  id: string;
  year: number;
  name: string;
  slug: string;
  serviceKey?: string | null;
  draftAt?: string | null;
  draftType?: string | null;
  numTeams: number;
  numWeeks: number;
  avgPoints: number;
  numPlayoffTeams: number;
  playoffStartWeek?: number | null;
  status: string;
  teams: ArchiveSeasonTeam[];
};

type ArchiveDraftResult = {
  id: string;
  seasonId: string;
  memberId: string;
  seasonTeamId: string;
  overallPick: number;
  round: number;
  pickInRound: number;
  isKeeper: boolean;
  value?: number | null;
  teamName?: string | null;
  player: {
    id: string;
    name: string;
    position: string;
    nflTeam: string;
    yahooId?: string | null;
  };
};

type ArchiveRecordHighlight = {
  bucket: string;
  key: string;
  name: string;
  label?: string | null;
  category?: string | null;
  displayType?: string | null;
  displayFormat?: string | null;
  isPositive?: boolean;
  description?: string | null;
  holderMemberId?: string | null;
  opponentMemberId?: string | null;
  seasonId?: string | null;
  week?: number | null;
  value?: string | number | null;
  valueDisplay?: string | null;
  playerDisplay?: string | null;
  numHeld?: number | null;
};

type ArchiveTopHolder = {
  league_member_id: number;
  positive_records: number;
  positive_ranked_records: number;
  negative_records: number;
  negative_ranked_records: number;
  total_records: number;
  total_ranked_records: number;
};

type ArchiveData = {
  league: {
    sourceName: string;
    sourceSlug: string;
    establishedYear: number;
    memberCount: number;
    seasonCount: number;
  };
  members: ArchiveMember[];
  seasons: ArchiveSeason[];
  draftResults: ArchiveDraftResult[];
  recordHighlights: ArchiveRecordHighlight[];
  topHolders: ArchiveTopHolder[];
  h2h: Record<string, Record<string, string>>;
  draftStats: Record<string, unknown>;
  transactionStats: {
    numTransactions?: number;
    numWaivers?: number;
    numTrades?: number;
    bestSeason?: { league_member_id: number; season_id: number; value: number };
    worstSeason?: { league_member_id: number; season_id: number; value: number };
    bestTradeSeason?: { league_member_id: number; season_id: number; value: number };
    worstTradeSeason?: { league_member_id: number; season_id: number; value: number };
    mostTransactedPlayer?: { player: string; count: number };
    mostValueByPlayer?: { player: string; value: number };
    mostValueByTeam?: { team: string; value: number };
  };
};

type FantasyProsPprSnapshot = {
  sourceUrl: string;
  sourceLabel: string;
  seasonYear: number;
  scoring: string;
  fetchedAt: string;
  updatedDisplay?: string;
  accessed?: string;
  playerCount: number;
  players: Array<{
    key: string;
    playerId: number;
    name: string;
    nflTeam: string;
    position: string;
    ecrRank: number;
    adp?: number;
    pageUrl?: string;
  }>;
};

const archive = fantasyLeagueArchive as ArchiveData;
const fantasyProsSnapshot = fantasyProsPprSnapshot as FantasyProsPprSnapshot;
const archivedTrades = fantasyLeagueTrades as FantasyTrade[];
const archiveMembers = archive.members;
const archiveSeasons = [...archive.seasons].sort((left, right) => left.year - right.year);
const latestCompletedSeason = archiveSeasons[archiveSeasons.length - 1];
const latestSeasonYear = latestCompletedSeason.year;
const nextSeasonYear = latestSeasonYear + 1;
const KEEPERS_START_AFTER_ROUND = 9;
const FUTURE_ADP_RULE_START_SEASON = 2027;
const FUTURE_ADP_ROUND_PENALTY = 2;
const PICKS_PER_ROUND = archive.league.memberCount;
const currentKeeperPickPenalty = FUTURE_ADP_ROUND_PENALTY * PICKS_PER_ROUND;

function createPlayerId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const fantasyProsPlayersById = new Map(
  fantasyProsSnapshot.players.map((player) => [player.key, player] as const)
);

function teamIdForMember(memberId: string): string {
  return `member-${memberId}`;
}

function parseArchiveDate(value: string): string {
  return new Date(`${value.replace(" ", "T")}Z`).toISOString();
}

function addOneYear(value: string): string {
  const parsed = new Date(value);
  parsed.setUTCFullYear(parsed.getUTCFullYear() + 1);
  return parsed.toISOString();
}

function subtractDays(value: string, days: number): string {
  const parsed = new Date(value);
  parsed.setUTCDate(parsed.getUTCDate() - days);
  return parsed.toISOString();
}

function ordinal(value: number): string {
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return `${value}st`;
  if (mod10 === 2 && mod100 !== 12) return `${value}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${value}rd`;
  return `${value}th`;
}

function formatNumber(value: number): string {
  return value.toFixed(2).replace(/\.00$/, "");
}

function formatRecord(wins: number, losses: number, ties: number): string {
  return `${wins}-${losses}${ties ? `-${ties}` : ""}`;
}

function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function buildShortName(name: string): string {
  if (name.length <= 16) return name;
  const words = name
    .replace(/[^a-z0-9'’]+/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const initials = words
    .filter((word) => !["the", "a", "an", "and", "of"].includes(word.toLowerCase()))
    .slice(0, 4)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  if (initials.length >= 2 && initials.length <= 4) {
    return initials;
  }

  return words.slice(0, 2).join(" ").slice(0, 16).trim();
}

function normalizePosition(position: string): FantasyPlayerPosition {
  const normalized = position.toUpperCase();
  if (normalized === "DEF") return "DST";
  if (normalized === "QB" || normalized === "RB" || normalized === "WR" || normalized === "TE" || normalized === "K" || normalized === "DST") {
    return normalized;
  }
  return "WR";
}

function roundToOverallPick(round: number, pickInRound = 1): number {
  return (round - 1) * PICKS_PER_ROUND + pickInRound;
}

function overallPickToRound(overallPick: number): number {
  return Math.max(1, Math.ceil(overallPick / PICKS_PER_ROUND));
}

function mixHex(hex: string, targetHex: string, ratio: number): string {
  const source = hex.replace("#", "");
  const target = targetHex.replace("#", "");
  const src = [0, 2, 4].map((index) => Number.parseInt(source.slice(index, index + 2), 16));
  const dst = [0, 2, 4].map((index) => Number.parseInt(target.slice(index, index + 2), 16));
  const mixed = src.map((value, index) => Math.round(value + (dst[index] - value) * ratio));
  return `#${mixed.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}

const membersById = new Map(archiveMembers.map((member) => [member.id, member]));
const seasonsById = new Map(archiveSeasons.map((season) => [season.id, season]));

const latestSeasonTeamsByMemberId = new Map(latestCompletedSeason.teams.map((team) => [team.memberId, team]));
const legacyNamesByMemberId = new Map<string, string[]>();
const memberSeasonHistory = new Map<string, ArchiveSeasonTeam[]>();

for (const member of archiveMembers) {
  const names: string[] = [];
  const history: ArchiveSeasonTeam[] = [];

  for (const season of [...archiveSeasons].sort((left, right) => right.year - left.year)) {
    const seasonTeam = season.teams.find((team) => team.memberId === member.id);
    if (!seasonTeam) continue;
    history.push(seasonTeam);
    if (!names.includes(seasonTeam.teamName)) {
      names.push(seasonTeam.teamName);
    }
  }

  legacyNamesByMemberId.set(member.id, names);
  memberSeasonHistory.set(member.id, history);
}

const playersRegistry = new Map<string, FantasyPlayer>();
for (const result of archive.draftResults) {
  const playerId = createPlayerId(result.player.name);
  const fantasyProsPlayer = fantasyProsPlayersById.get(playerId);
  if (!playersRegistry.has(playerId)) {
    playersRegistry.set(playerId, {
      id: playerId,
      name: result.player.name,
      position: normalizePosition(result.player.position),
      nflTeam: result.player.nflTeam,
      adp: fantasyProsPlayer?.adp
    });
  }
}
const players = [...playersRegistry.values()].sort((left, right) => left.name.localeCompare(right.name));

function roundCost(previousDraftRound?: number): number | undefined {
  if (!previousDraftRound || previousDraftRound <= KEEPERS_START_AFTER_ROUND) return undefined;
  return previousDraftRound;
}

function futureAdpKeeperCostOverallPick(adp?: number): number | undefined {
  if (typeof adp !== "number" || !Number.isFinite(adp)) return undefined;
  return Math.max(1, Math.round(adp + FUTURE_ADP_ROUND_PENALTY * PICKS_PER_ROUND));
}

function buildProfileTag(memberId: string, championships: number, playoffAppearances: number): string {
  const member = membersById.get(memberId);
  if (member?.isCommissioner) return "Commissioner";
  if (championships > 0) return `${championships} title${championships === 1 ? "" : "s"}`;
  if (playoffAppearances > 0) return `${playoffAppearances} playoff trips`;
  return "Room regular";
}

function buildRivalryNote(memberId: string): string {
  const entries = Object.entries(archive.h2h[memberId] ?? {});
  if (entries.length === 0) {
    return "Still waiting for the rivalry board to pick a favorite enemy.";
  }

  const best = entries
    .map(([opponentId, record]) => {
      const [winsText, lossesText] = record.split("-");
      const wins = Number.parseInt(winsText, 10) || 0;
      const losses = Number.parseInt(lossesText, 10) || 0;
      const total = wins + losses;
      return { opponentId, record, wins, losses, total, margin: Math.abs(wins - losses) };
    })
    .sort((left, right) => right.total - left.total || left.margin - right.margin)[0];

  const rivalName = latestSeasonTeamsByMemberId.get(best.opponentId)?.teamName ?? membersById.get(best.opponentId)?.displayName ?? "league rival";
  return `Most tracked head-to-head is against ${rivalName} at ${best.record} across ${best.total} meetings.`;
}

function formatOrdinal(value: number): string {
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return `${value}st`;
  if (mod10 === 2 && mod100 !== 12) return `${value}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${value}rd`;
  return `${value}th`;
}

function buildStrategyLabel(openingPositions: FantasyPlayerPosition[], qbRound?: number, teRound?: number): string {
  const rbCount = openingPositions.filter((position) => position === "RB").length;
  const wrCount = openingPositions.filter((position) => position === "WR").length;

  if (rbCount >= 3) return "RB pressure start";
  if (wrCount >= 3) return "WR pressure start";
  if (qbRound && qbRound <= 4) return "Early-QB swing";
  if (teRound && teRound <= 4) return "Premium TE build";
  if (openingPositions[0] === "RB" && rbCount === 1) return "Hero-RB lean";
  if (openingPositions[0] === "WR" && wrCount === 1) return "Hero-WR lean";
  return "Balanced board read";
}

function buildDraftSummary({
  seasonYear,
  openingPositions,
  qbRound,
  teRound,
  draftGrade
}: {
  seasonYear: number;
  openingPositions: FantasyPlayerPosition[];
  qbRound?: number;
  teRound?: number;
  draftGrade?: string | null;
}): string {
  const openingText = openingPositions.join(" / ");
  const qbText = qbRound
    ? qbRound <= 4
      ? `grabbed QB in Round ${qbRound}`
      : `waited until Round ${qbRound} for a QB`
    : "never bothered to draft a QB on the board we have";
  const teText = teRound
    ? teRound <= 4
      ? `paid up for TE in Round ${teRound}`
      : `held TE until Round ${teRound}`
    : "left TE off the board entirely";
  const gradeText = draftGrade ? ` Draft grade ${draftGrade}.` : "";
  return `${seasonYear}: opened ${openingText}, ${qbText}, and ${teText}.${gradeText}`;
}

function buildDraftTendenciesForMember(memberId: string): FantasySeasonDraftTendency[] {
  return [...archiveSeasons]
    .sort((left, right) => right.year - left.year)
    .flatMap((season) => {
      const seasonTeam = season.teams.find((team) => team.memberId === memberId);
      const seasonPicks = archive.draftResults
        .filter((result) => result.seasonId === season.id && result.memberId === memberId)
        .sort((left, right) => left.overallPick - right.overallPick);

      if (!seasonTeam || seasonPicks.length === 0) {
        return [];
      }

      const openingPicks = seasonPicks.slice(0, 4).map((pick) => ({
        playerId: createPlayerId(pick.player.name),
        playerName: pick.player.name,
        position: normalizePosition(pick.player.position),
        nflTeam: pick.player.nflTeam,
        round: pick.round,
        overallPick: pick.overallPick
      }));
      const openingPositions = openingPicks.map((pick) => pick.position);
      const firstPositionRounds = seasonPicks.reduce<Partial<Record<FantasyPlayerPosition, number>>>((positions, pick) => {
        const normalized = normalizePosition(pick.player.position);
        if (!(normalized in positions)) {
          positions[normalized] = pick.round;
        }
        return positions;
      }, {});
      const qbRound = seasonPicks.find((pick) => normalizePosition(pick.player.position) === "QB")?.round;
      const teRound = seasonPicks.find((pick) => normalizePosition(pick.player.position) === "TE")?.round;
      const keeperCount = seasonPicks.filter((pick) => pick.isKeeper).length;

      return [
        {
          seasonId: season.id,
          seasonYear: season.year,
          teamId: teamIdForMember(memberId),
          teamName: seasonTeam.teamName,
          strategyLabel: buildStrategyLabel(openingPositions, qbRound, teRound),
          summary: buildDraftSummary({
            seasonYear: season.year,
            openingPositions,
            qbRound,
            teRound,
            draftGrade: seasonTeam.draftGrade
          }),
          openingPositions,
          openingPicks,
          firstPositionRounds,
          qbRound,
          teRound,
          keeperCount,
          totalPicks: seasonPicks.length,
          draftGrade: seasonTeam.draftGrade,
          draftRank: seasonTeam.draftRank,
          coachRank: seasonTeam.coachRank
        }
      ];
    });
}

function buildDraftTendency(memberId: string, tendencies: FantasySeasonDraftTendency[]): string {
  const latestTendency = tendencies[0];
  if (!latestTendency) {
    return "Still waiting on enough picks to build a proper draft personality profile.";
  }

  const highlightPlayer = latestTendency.openingPicks[0];
  const highlightText = highlightPlayer
    ? `Started ${latestTendency.seasonYear} with ${highlightPlayer.playerName} in the ${formatOrdinal(highlightPlayer.overallPick)} slot.`
    : `Started ${latestTendency.seasonYear} with ${latestTendency.openingPositions.join(" / ")}.`;

  return `${highlightText} ${latestTendency.strategyLabel}; ${latestTendency.summary.replace(`${latestTendency.seasonYear}: `, "")}`;
}

function buildTeamNote(memberId: string, championships: number): string {
  const latestTeam = latestSeasonTeamsByMemberId.get(memberId);
  if (!latestTeam) {
    return "Fresh season receipts still loading.";
  }

  const titleNote = championships > 0 ? `${championships} championship${championships === 1 ? "" : "s"} already on the shelf.` : "Still chasing the first banner.";
  const grade = latestTeam.draftGrade ? ` Draft grade ${latestTeam.draftGrade}.` : "";
  return `${latestCompletedSeason.year} finished ${formatRecord(latestTeam.wins, latestTeam.losses, latestTeam.ties)} with ${formatNumber(latestTeam.pointsFor)} points scored.${grade} ${titleNote}`.trim();
}

const teams: FantasyTeamIdentity[] = archiveMembers.map((member) => {
  const latestTeam = latestSeasonTeamsByMemberId.get(member.id);
  const history = memberSeasonHistory.get(member.id) ?? [];
  const legacyNames = legacyNamesByMemberId.get(member.id) ?? [member.displayName];
  const championships = archiveSeasons.filter((season) => season.teams.find((team) => team.memberId === member.id)?.rank === 1).length;
  const playoffAppearances = archiveSeasons.filter((season) => (season.teams.find((team) => team.memberId === member.id)?.playoffSeed ?? null) !== null).length;
  const overallReference = history[0] ?? latestTeam;
  const primaryColor = latestTeam?.memberColor ?? member.color ?? "#2563eb";

  return {
    id: teamIdForMember(member.id),
    memberId: member.id,
    teamName: latestTeam?.teamName ?? member.displayName,
    shortName: buildShortName(latestTeam?.teamName ?? member.displayName),
    mascot: buildShortName(member.displayName),
    colors: {
      primary: primaryColor,
      secondary: mixHex(primaryColor, "#f8fafc", 0.28)
    },
    championships,
    playoffAppearances,
    allTimeRecord: {
      wins: overallReference?.overallWins ?? 0,
      losses: overallReference?.overallLosses ?? 0,
      ties: overallReference?.overallTies ?? 0
    },
    legacyNames,
    notes: buildTeamNote(member.id, championships)
  };
});

const teamsById = new Map(teams.map((team) => [team.id, team]));
const draftTendenciesByMemberId = new Map<string, FantasySeasonDraftTendency[]>();

for (const member of archiveMembers) {
  draftTendenciesByMemberId.set(member.id, buildDraftTendenciesForMember(member.id));
}

const members: FantasyMember[] = archiveMembers.map((member) => {
  const team = teams.find((entry) => entry.memberId === member.id);
  const draftTendencies = draftTendenciesByMemberId.get(member.id) ?? [];
  return {
    id: member.id,
    slug: member.slug,
    managerName: member.displayName,
    avatarUrl: member.avatarUrl ?? undefined,
    favoriteTeam: buildProfileTag(member.id, team?.championships ?? 0, team?.playoffAppearances ?? 0),
    rivalryNote: buildRivalryNote(member.id),
    draftTendency: buildDraftTendency(member.id, draftTendencies),
    draftTendenciesBySeason: draftTendencies,
    bio: `${member.displayName} has ${team?.playoffAppearances ?? 0} playoff appearances and ${team?.championships ?? 0} titles on the board.`
  };
});

const memberDisplayNamesById = new Map(members.map((member) => [member.id, member.managerName]));

function buildDraftPicksForSeason(season: ArchiveSeason): FantasyDraftPick[] {
  return archive.draftResults
    .filter((result) => result.seasonId === season.id)
    .sort((left, right) => left.overallPick - right.overallPick)
    .map((result) => ({
      id: result.id,
      seasonYear: season.year,
      round: result.round,
      pickInRound: result.pickInRound,
      overallPick: result.overallPick,
      teamId: teamIdForMember(result.memberId),
      teamDisplayName: result.teamName ?? latestSeasonTeamsByMemberId.get(result.memberId)?.teamName ?? memberDisplayNamesById.get(result.memberId),
      teamShortName: buildShortName(result.teamName ?? latestSeasonTeamsByMemberId.get(result.memberId)?.teamName ?? memberDisplayNamesById.get(result.memberId) ?? result.memberId),
      playerId: createPlayerId(result.player.name),
      isKeeper: result.isKeeper,
      keeperCostRound: result.isKeeper ? roundCost(result.round) : undefined,
      notes: typeof result.value === "number" ? `Archive draft value ${formatNumber(result.value)}` : undefined
    }));
}

function buildSeasonTeamOrder(season: ArchiveSeason, draftPicks: FantasyDraftPick[]): string[] {
  const orderFromRoundOne = draftPicks
    .filter((pick) => pick.round === 1)
    .sort((left, right) => left.pickInRound - right.pickInRound)
    .map((pick) => pick.teamId);

  if (orderFromRoundOne.length > 0) {
    return uniqueStrings(orderFromRoundOne);
  }

  return season.teams
    .slice()
    .sort((left, right) => (left.regularSeasonRank ?? left.rank ?? 99) - (right.regularSeasonRank ?? right.rank ?? 99))
    .map((team) => teamIdForMember(team.memberId));
}

function buildStandings(season: ArchiveSeason): FantasyStanding[] {
  return season.teams
    .slice()
    .sort((left, right) => (left.regularSeasonRank ?? left.rank ?? 99) - (right.regularSeasonRank ?? right.rank ?? 99) || right.pointsFor - left.pointsFor)
    .map((team, index) => ({
      teamId: teamIdForMember(team.memberId),
      rank: team.regularSeasonRank ?? team.rank ?? index + 1,
      displayName: team.teamName,
      shortName: buildShortName(team.teamName),
      wins: team.wins,
      losses: team.losses,
      ties: team.ties,
      pointsFor: team.pointsFor,
      pointsAgainst: team.pointsAgainst,
      streak: team.playoffSeed ? `Seed ${team.playoffSeed}` : "Missed playoffs",
      playoffSeed: team.playoffSeed,
      playoffWins: team.playoffWins,
      playoffLosses: team.playoffLosses,
      finishRank: team.rank
    }));
}

function byFinalRank(a: ArchiveSeasonTeam, b: ArchiveSeasonTeam): number {
  return (a.rank ?? 99) - (b.rank ?? 99) || b.pointsFor - a.pointsFor;
}

function byRegularSeasonRank(a: ArchiveSeasonTeam, b: ArchiveSeasonTeam): number {
  return (a.regularSeasonRank ?? 99) - (b.regularSeasonRank ?? 99) || b.pointsFor - a.pointsFor;
}

function buildSeasonSummary(season: ArchiveSeason) {
  const champion = season.teams.slice().sort(byFinalRank)[0];
  const runnerUp = season.teams.slice().sort(byFinalRank)[1] ?? champion;
  const regularSeasonWinner = season.teams.slice().sort(byRegularSeasonRank)[0] ?? champion;
  const highestScoring = season.teams.slice().sort((left, right) => right.pointsFor - left.pointsFor)[0] ?? champion;
  const worstRecord = season.teams.slice().sort((left, right) => {
    const leftPct = (left.wins + left.ties * 0.5) / Math.max(1, left.wins + left.losses + left.ties);
    const rightPct = (right.wins + right.ties * 0.5) / Math.max(1, right.wins + right.losses + right.ties);
    return leftPct - rightPct || left.pointsFor - right.pointsFor;
  })[0] ?? champion;

  return {
    championTeamId: teamIdForMember(champion.memberId),
    championDisplayName: champion.teamName,
    runnerUpTeamId: teamIdForMember(runnerUp.memberId),
    runnerUpDisplayName: runnerUp.teamName,
    regularSeasonWinnerTeamId: teamIdForMember(regularSeasonWinner.memberId),
    regularSeasonWinnerDisplayName: regularSeasonWinner.teamName,
    highestScoringTeamId: teamIdForMember(highestScoring.memberId),
    highestScoringTeamDisplayName: highestScoring.teamName,
    worstRecordTeamId: teamIdForMember(worstRecord.memberId),
    worstRecordTeamDisplayName: worstRecord.teamName
  };
}

const seasons: FantasySeason[] = archiveSeasons.map((season) => {
  const draftPicks = buildDraftPicksForSeason(season);
  const standings = buildStandings(season);
  return {
    id: `season-${season.year}`,
    year: season.year,
    label: `${season.year} archive`,
    status: "completed",
    weekLabel: `${season.numWeeks} regular-season weeks`,
    teamOrder: buildSeasonTeamOrder(season, draftPicks),
    standings,
    matchups: [] as FantasyMatchup[],
    draftPicks,
    draftDate: parseArchiveDate(season.draftAt ?? `${season.year}-08-20 00:00:00`),
    draftRounds: Math.max(...draftPicks.map((pick) => pick.round), 0),
    numPlayoffTeams: season.numPlayoffTeams,
    playoffStartWeek: season.playoffStartWeek ?? null,
    keeperSelections: draftPicks
      .filter((pick) => pick.isKeeper)
      .map((pick) => ({
        seasonYear: season.year,
        teamId: pick.teamId,
        playerId: pick.playerId,
        keeperCostRound: pick.keeperCostRound,
        locked: true
      })) as FantasyKeeperSelection[],
    summary: buildSeasonSummary(season),
    seasonNotes: [
      `${season.numTeams} teams with ${season.numPlayoffTeams} playoff spots.`,
      `${season.draftType === "snake" ? "Snake" : "Auction"} draft archived from LeagueLegacy.`,
      `Average team output: ${formatNumber(season.avgPoints)} points per week.`
    ]
  };
});

const nextDraftDate = addOneYear(parseArchiveDate(latestCompletedSeason.draftAt ?? `${latestSeasonYear}-08-22 00:00:00`));
const keeperDeadline = subtractDays(nextDraftDate, 7);

const league: FantasyLeagueIdentity = {
  name: "New Uzbek Mafia",
  slug: "new-uzbek-mafia",
  tagline: "League history, draft receipts, rivalry records, and keeper planning for the New Uzbek Mafia room.",
  seasonYear: nextSeasonYear,
  establishedYear: archive.league.establishedYear,
  logoText: "NUM",
  currentWeekLabel: "Predraft",
  location: "New York / New Jersey",
  nextDraftDate,
  platformReadiness: ["Yahoo", "Sleeper", "ESPN", "Manual"],
  leagueSize: archive.league.memberCount
};

const keeperRules: FantasyKeeperRules = {
  maxKeepers: 1,
  sourceSeasonYear: latestSeasonYear,
  targetSeasonYear: nextSeasonYear,
  deadline: keeperDeadline,
  costRule: `Only players drafted after Round ${KEEPERS_START_AFTER_ROUND} qualify. Current cost uses FantasyPros PPR overall rank plus ${currentKeeperPickPenalty} picks, then converts that slot back to a round.`,
  roundPenaltyRule: `Example: a FantasyPros overall slot of 65 becomes Pick 85 in a ${PICKS_PER_ROUND}-team league, which lands in Round ${overallPickToRound(85)}.`,
  defaultWaiverCost: "Waiver pickups default to a Round 8 keeper cost unless the commissioner records a different value.",
  ineligiblePlayersRule: `Anyone drafted in Round ${KEEPERS_START_AFTER_ROUND} or earlier stays ineligible. Costs stay editable only when a FantasyPros ranking is missing.`,
  notes: [
    `Eligibility is locked to players drafted in Round ${KEEPERS_START_AFTER_ROUND + 1} or later.`,
    `FantasyPros source: ${fantasyProsSnapshot.sourceLabel} (${fantasyProsSnapshot.updatedDisplay ?? "latest update"}) with ${fantasyProsSnapshot.playerCount} players synced from ${fantasyProsSnapshot.sourceUrl}.`,
    `Keeper cost = FantasyPros overall slot plus ${currentKeeperPickPenalty} picks, then rounded back to the closest draft round.`
  ]
};

const sourceSeason = seasons.find((season) => season.year === latestSeasonYear)!;
const keeperCandidates: FantasyKeeperCandidate[] = sourceSeason.draftPicks.map((pick) => {
  const player = playersRegistry.get(pick.playerId);
  const legacyRoundCost = roundCost(pick.round);
  const fantasyProsOverallSlot = player?.adp;
  const futureOverallPick = futureAdpKeeperCostOverallPick(fantasyProsOverallSlot);
  const currentRuleRoundCost = futureOverallPick ? overallPickToRound(futureOverallPick) : undefined;
  const eligible = pick.round > KEEPERS_START_AFTER_ROUND;

  return {
    id: `${pick.teamId}-${pick.playerId}`,
    seasonYear: latestSeasonYear,
    teamId: pick.teamId,
    playerId: pick.playerId,
    previousDraftRound: pick.round,
    keeperCostRound: currentRuleRoundCost,
    keeperCostOverallPick: futureOverallPick,
    yearsKept: 0,
    eligible,
    notes: !eligible
      ? `Ineligible because this player was drafted in Round ${pick.round}. Only Round ${KEEPERS_START_AFTER_ROUND + 1}+ players qualify.`
      : futureOverallPick && fantasyProsOverallSlot
        ? `Drafted in Round ${legacyRoundCost}. FantasyPros PPR slot ${fantasyProsOverallSlot} pulls the keeper cost to Pick ${futureOverallPick} (Round ${currentRuleRoundCost}).`
        : `Drafted in Round ${legacyRoundCost}. Add a FantasyPros PPR slot to lock the keeper cost.`
  };
});

function recordFromHighlight(
  highlightKey: string,
  label: string,
  category: FantasyLeagueRecord["category"],
  contextBuilder?: (highlight: ArchiveRecordHighlight) => string
): FantasyLeagueRecord | null {
  const highlight = archive.recordHighlights.find((entry) => entry.key === highlightKey);
  if (!highlight || !highlight.holderMemberId) return null;
  const seasonYear = highlight.seasonId ? (seasonsById.get(highlight.seasonId)?.year ?? latestSeasonYear) : latestSeasonYear;
  const team = latestSeasonTeamsByMemberId.get(highlight.holderMemberId);
  const value = highlight.valueDisplay ?? String(highlight.value ?? "—");
  return {
    id: `record-${highlightKey}`,
    label,
    category,
    value,
    seasonYear,
    teamId: teamIdForMember(highlight.holderMemberId),
    memberId: highlight.holderMemberId,
    context: contextBuilder ? contextBuilder(highlight) : `${team?.teamName ?? memberDisplayNamesById.get(highlight.holderMemberId) ?? "League member"} owns this ${label.toLowerCase()} marker from ${seasonYear}.`
  };
}

const allSeasonTeams = archiveSeasons.flatMap((season) => season.teams.map((team) => ({ season, team })));
const highestScoringSeason = allSeasonTeams.slice().sort((left, right) => right.team.pointsFor - left.team.pointsFor)[0];
const lowestScoringSeason = allSeasonTeams.slice().sort((left, right) => left.team.pointsFor - right.team.pointsFor)[0];
const bestRecordSeason = allSeasonTeams.slice().sort((left, right) => {
  const leftPct = (left.team.wins + left.team.ties * 0.5) / Math.max(1, left.team.wins + left.team.losses + left.team.ties);
  const rightPct = (right.team.wins + right.team.ties * 0.5) / Math.max(1, right.team.wins + right.team.losses + right.team.ties);
  return rightPct - leftPct || right.team.pointsFor - left.team.pointsFor;
})[0];
const roughestRecordSeason = allSeasonTeams.slice().sort((left, right) => {
  const leftPct = (left.team.wins + left.team.ties * 0.5) / Math.max(1, left.team.wins + left.team.losses + left.team.ties);
  const rightPct = (right.team.wins + right.team.ties * 0.5) / Math.max(1, right.team.wins + right.team.losses + right.team.ties);
  return leftPct - rightPct || left.team.pointsFor - right.team.pointsFor;
})[0];
const bestDraftPick = archive.draftResults.filter((result) => typeof result.value === "number").sort((left, right) => (right.value ?? -999) - (left.value ?? -999))[0];
const worstDraftPick = archive.draftResults.filter((result) => typeof result.value === "number").sort((left, right) => (left.value ?? 999) - (right.value ?? 999))[0];
const topHolder = archive.topHolders[0];

const records: FantasyLeagueRecord[] = [
  {
    id: "record-highest-season-score",
    label: "Highest scoring season",
    category: "season",
    value: `${formatNumber(highestScoringSeason.team.pointsFor)} pts`,
    seasonYear: highestScoringSeason.season.year,
    teamId: teamIdForMember(highestScoringSeason.team.memberId),
    memberId: highestScoringSeason.team.memberId,
    context: `${highestScoringSeason.team.teamName} posted the archive's biggest season at ${formatNumber(highestScoringSeason.team.pointsFor)} points in ${highestScoringSeason.season.year}.`
  },
  {
    id: "record-lowest-season-score",
    label: "Lowest scoring season",
    category: "season",
    value: `${formatNumber(lowestScoringSeason.team.pointsFor)} pts`,
    seasonYear: lowestScoringSeason.season.year,
    teamId: teamIdForMember(lowestScoringSeason.team.memberId),
    memberId: lowestScoringSeason.team.memberId,
    context: `${lowestScoringSeason.team.teamName} had the leanest archive season at ${formatNumber(lowestScoringSeason.team.pointsFor)} points in ${lowestScoringSeason.season.year}.`
  },
  {
    id: "record-best-season-record",
    label: "Best season record",
    category: "season",
    value: formatRecord(bestRecordSeason.team.wins, bestRecordSeason.team.losses, bestRecordSeason.team.ties),
    seasonYear: bestRecordSeason.season.year,
    teamId: teamIdForMember(bestRecordSeason.team.memberId),
    memberId: bestRecordSeason.team.memberId,
    context: `${bestRecordSeason.team.teamName} turned in the archive's strongest regular-season mark in ${bestRecordSeason.season.year}.`
  },
  {
    id: "record-roughest-season-record",
    label: "Roughest season record",
    category: "season",
    value: formatRecord(roughestRecordSeason.team.wins, roughestRecordSeason.team.losses, roughestRecordSeason.team.ties),
    seasonYear: roughestRecordSeason.season.year,
    teamId: teamIdForMember(roughestRecordSeason.team.memberId),
    memberId: roughestRecordSeason.team.memberId,
    context: `${roughestRecordSeason.team.teamName} absorbed the toughest archived season record in ${roughestRecordSeason.season.year}.`
  },
  recordFromHighlight("league-playoff-wins", "Most playoff wins", "manager"),
  recordFromHighlight("league-playoff-points", "Most playoff points", "manager"),
  recordFromHighlight("matchup-playoffs-margin", "Biggest playoff blowout", "matchup", (highlight) => {
    const opponentName = highlight.opponentMemberId ? latestSeasonTeamsByMemberId.get(highlight.opponentMemberId)?.teamName ?? memberDisplayNamesById.get(highlight.opponentMemberId) : "their opponent";
    return `${memberDisplayNamesById.get(highlight.holderMemberId ?? "") ?? "A league member"} owns the archive's biggest playoff margin over ${opponentName}.`;
  }),
  recordFromHighlight("matchup-playoffs-points", "Most playoff matchup points", "weekly"),
  bestDraftPick
    ? {
        id: "record-best-draft-pick",
        label: "Best draft value pick",
        category: "draft",
        value: `${formatNumber(bestDraftPick.value ?? 0)} value`,
        seasonYear: seasonsById.get(bestDraftPick.seasonId)?.year ?? latestSeasonYear,
        teamId: teamIdForMember(bestDraftPick.memberId),
        memberId: bestDraftPick.memberId,
        context: `${bestDraftPick.player.name} became the archive's best value draft hit at pick ${bestDraftPick.overallPick}.`
      }
    : null,
  worstDraftPick
    ? {
        id: "record-worst-draft-pick",
        label: "Toughest draft miss",
        category: "draft",
        value: `${formatNumber(worstDraftPick.value ?? 0)} value`,
        seasonYear: seasonsById.get(worstDraftPick.seasonId)?.year ?? latestSeasonYear,
        teamId: teamIdForMember(worstDraftPick.memberId),
        memberId: worstDraftPick.memberId,
        context: `${worstDraftPick.player.name} carried the roughest archive draft return relative to slot at pick ${worstDraftPick.overallPick}.`
      }
    : null,
  recordFromHighlight("roster-passing-yards-stat", "Most passing yards all-time", "manager")
].filter((record): record is FantasyLeagueRecord => Boolean(record));

const latestSeasonSummary = sourceSeason.summary;
const latestChampion = latestSeasonTeamsByMemberId.get(latestSeasonSummary.championTeamId.replace("member-", ""));
const latestRegularSeasonWinner = latestSeasonTeamsByMemberId.get(latestSeasonSummary.regularSeasonWinnerTeamId.replace("member-", ""));
const latestHighestScorer = latestSeasonTeamsByMemberId.get(latestSeasonSummary.highestScoringTeamId.replace("member-", ""));
const bestTransactionSeason = archive.transactionStats.bestSeason;
const bestTradeSeason = archive.transactionStats.bestTradeSeason;
const draftRoomWinner = latestCompletedSeason.teams.slice().sort((left, right) => (left.draftRank ?? 99) - (right.draftRank ?? 99))[0];
const bestTradeSeasonYear = bestTradeSeason ? seasonsById.get(String(bestTradeSeason.season_id))?.year ?? latestSeasonYear : latestSeasonYear;
const bestTransactionSeasonYear = bestTransactionSeason ? seasonsById.get(String(bestTransactionSeason.season_id))?.year ?? latestSeasonYear : latestSeasonYear;

const awards: FantasyLeagueAward[] = [
  {
    id: `award-${latestCompletedSeason.year}-champion`,
    title: `${latestCompletedSeason.year} Champion`,
    seasonYear: latestCompletedSeason.year,
    teamId: latestSeasonSummary.championTeamId,
    memberId: latestSeasonSummary.championTeamId.replace("member-", ""),
    summary: `${latestChampion?.teamName ?? "The champion"} closed the most recent archived season on top and now sets the benchmark for the rest of the room.`
  },
  {
    id: `award-${latestCompletedSeason.year}-regular-season`,
    title: `${latestCompletedSeason.year} Regular-Season Pace Car`,
    seasonYear: latestCompletedSeason.year,
    teamId: latestSeasonSummary.regularSeasonWinnerTeamId,
    memberId: latestSeasonSummary.regularSeasonWinnerTeamId.replace("member-", ""),
    summary: `${latestRegularSeasonWinner?.teamName ?? "The top seed"} owned the regular-season table and also led the archive into the playoff bracket.`
  },
  {
    id: `award-${bestTransactionSeasonYear}-transaction-heater`,
    title: `${bestTransactionSeasonYear} Transaction Heater`,
    seasonYear: bestTransactionSeasonYear,
    teamId: bestTransactionSeason ? teamIdForMember(String(bestTransactionSeason.league_member_id)) : undefined,
    memberId: bestTransactionSeason ? String(bestTransactionSeason.league_member_id) : undefined,
    summary: bestTransactionSeason
      ? `${latestSeasonTeamsByMemberId.get(String(bestTransactionSeason.league_member_id))?.teamName ?? memberDisplayNamesById.get(String(bestTransactionSeason.league_member_id)) ?? "This member"} posted the strongest transaction value season in the archive at ${formatNumber(bestTransactionSeason.value)}.`
      : "Transaction value awards will populate once the archive exposes a best season record."
  },
  {
    id: `award-${bestTradeSeasonYear}-trade-value`,
    title: `${bestTradeSeasonYear} Trade Value Winner`,
    seasonYear: bestTradeSeasonYear,
    teamId: bestTradeSeason ? teamIdForMember(String(bestTradeSeason.league_member_id)) : undefined,
    memberId: bestTradeSeason ? String(bestTradeSeason.league_member_id) : undefined,
    summary: bestTradeSeason
      ? `${latestSeasonTeamsByMemberId.get(String(bestTradeSeason.league_member_id))?.teamName ?? memberDisplayNamesById.get(String(bestTradeSeason.league_member_id)) ?? "This member"} landed the strongest trade-value season the archive tracks at ${formatNumber(bestTradeSeason.value)}.`
      : "Trade value awards will populate once the archive exposes a best trade season."
  },
  {
    id: `award-${latestCompletedSeason.year}-draft-room`,
    title: `${latestCompletedSeason.year} Draft Room Favorite`,
    seasonYear: latestCompletedSeason.year,
    teamId: draftRoomWinner ? teamIdForMember(draftRoomWinner.memberId) : undefined,
    memberId: draftRoomWinner?.memberId,
    summary: draftRoomWinner
      ? `${draftRoomWinner.teamName} earned the best archived draft rank in ${latestCompletedSeason.year}${draftRoomWinner.draftGrade ? ` with a ${draftRoomWinner.draftGrade} grade` : ""}.`
      : "Draft room awards will populate once the archive exposes team draft ranks."
  },
  {
    id: `award-${latestCompletedSeason.year}-record-collector`,
    title: `Archive Record Collector`,
    seasonYear: latestCompletedSeason.year,
    teamId: topHolder ? teamIdForMember(String(topHolder.league_member_id)) : undefined,
    memberId: topHolder ? String(topHolder.league_member_id) : undefined,
    summary: topHolder
      ? `${memberDisplayNamesById.get(String(topHolder.league_member_id)) ?? "This member"} currently holds ${topHolder.total_records} tracked record-book marks across the archive.`
      : "Record-collector awards will populate once the archive exposes top holders."
  },
  {
    id: `award-${latestCompletedSeason.year}-waiver-spotlight`,
    title: `Waiver Spotlight`,
    seasonYear: latestCompletedSeason.year,
    summary: archive.transactionStats.mostValueByPlayer
      ? `${archive.transactionStats.mostValueByPlayer.player} generated the biggest transaction value bump in the archive at ${formatNumber(archive.transactionStats.mostValueByPlayer.value)}.`
      : "Waiver spotlight will populate once transaction value data is available."
  },
  {
    id: `award-${latestCompletedSeason.year}-highest-scorer`,
    title: `${latestCompletedSeason.year} Points Leader`,
    seasonYear: latestCompletedSeason.year,
    teamId: latestSeasonSummary.highestScoringTeamId,
    memberId: latestSeasonSummary.highestScoringTeamId.replace("member-", ""),
    summary: `${latestHighestScorer?.teamName ?? "The scoring leader"} finished ${latestCompletedSeason.year} with the highest total points in the room.`
  }
];

const trades: FantasyTrade[] = archivedTrades.map((trade) => ({
  ...trade,
  trader: {
    ...trade.trader,
    teamName: trade.trader.teamName ?? memberDisplayNamesById.get(trade.trader.memberId ?? "")
  },
  tradee: {
    ...trade.tradee,
    teamName: trade.tradee.teamName ?? memberDisplayNamesById.get(trade.tradee.memberId ?? "")
  }
}));

export const fantasyLeagueData: FantasyLeagueDataset = {
  league,
  keeperRules,
  members,
  teams,
  players,
  seasons,
  keeperCandidates,
  records,
  awards,
  trades
};

export function getFantasyLeague(): FantasyLeagueDataset {
  return fantasyLeagueData;
}

export function getFantasyManagerProfileSlugs(): string[] {
  return fantasyLeagueData.members.map((member) => member.slug);
}

export function getFantasyManagerProfileBySlug(slug: string): FantasyManagerProfile | undefined {
  const member = fantasyLeagueData.members.find((entry) => entry.slug === slug);
  if (!member) {
    return undefined;
  }

  const team = fantasyLeagueData.teams.find((entry) => entry.memberId === member.id);
  if (!team) {
    return undefined;
  }

  const seasonHistory: FantasyManagerSeasonSnapshot[] = [...archiveSeasons]
    .sort((left, right) => right.year - left.year)
    .flatMap((season) => {
      const seasonTeam = season.teams.find((entry) => entry.memberId === member.id);
      if (!seasonTeam) {
        return [];
      }

      return [
        {
          seasonId: season.id,
          seasonYear: season.year,
          teamId: teamIdForMember(member.id),
          teamName: seasonTeam.teamName,
          numPlayoffTeams: season.numPlayoffTeams,
          wins: seasonTeam.wins,
          losses: seasonTeam.losses,
          ties: seasonTeam.ties,
          pointsFor: seasonTeam.pointsFor,
          pointsAgainst: seasonTeam.pointsAgainst,
          regularSeasonRank: seasonTeam.regularSeasonRank,
          finishRank: seasonTeam.rank,
          playoffSeed: seasonTeam.playoffSeed,
          playoffWins: seasonTeam.playoffWins,
          playoffLosses: seasonTeam.playoffLosses,
          draftGrade: seasonTeam.draftGrade,
          draftRank: seasonTeam.draftRank,
          coachRank: seasonTeam.coachRank,
          numMoves: seasonTeam.numMoves,
          numTrades: seasonTeam.numTrades,
          avgPoints: seasonTeam.avgPoints
        }
      ];
    });

  const seasonRosters: FantasyManagerSeasonRoster[] = [...archiveSeasons]
    .sort((left, right) => right.year - left.year)
    .flatMap((season) => {
      const seasonTeam = season.teams.find((entry) => entry.memberId === member.id);
      if (!seasonTeam) {
        return [];
      }

      const players = archive.draftResults
        .filter((result) => result.seasonId === season.id && result.memberId === member.id)
        .sort((left, right) => left.overallPick - right.overallPick)
        .map((result) => ({
          playerId: createPlayerId(result.player.name),
          playerName: result.player.name,
          position: normalizePosition(result.player.position),
          nflTeam: result.player.nflTeam,
          round: result.round,
          overallPick: result.overallPick,
          potentialKeeper: result.round > KEEPERS_START_AFTER_ROUND
        }));

      return [
        {
          seasonId: season.id,
          seasonYear: season.year,
          teamId: teamIdForMember(member.id),
          teamName: seasonTeam.teamName,
          players
        }
      ];
    });

  const championshipYears = seasonHistory
    .filter((season) => season.finishRank === 1)
    .map((season) => season.seasonYear);

  const trades = fantasyLeagueData.trades
    .filter((trade) => trade.trader.memberId === member.id || trade.tradee.memberId === member.id)
    .sort((left, right) => {
      const leftTime = left.postedAt ? Date.parse(left.postedAt) : 0;
      const rightTime = right.postedAt ? Date.parse(right.postedAt) : 0;
      return rightTime - leftTime || right.seasonYear - left.seasonYear;
    });

  return {
    member,
    team,
    seasonHistory,
    seasonRosters,
    draftTendencies: member.draftTendenciesBySeason,
    trades,
    championshipYears
  };
}
