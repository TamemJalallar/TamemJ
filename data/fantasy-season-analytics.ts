import publicLeagueLegacySeasons from '@/data/leaguelegacy-public-seasons.json';
import type {
  FantasyAllPlayRow,
  FantasyLineupEfficiencyRow,
  FantasyPlayoffOddsCheckpoint,
  FantasyPlayoffOddsRow,
  FantasyPowerRankingRow,
  FantasySeasonAnalytics,
  FantasyWeeklyPowerRanking,
  FantasyWeeklyRecap,
  FantasyWeeklyRecapMatchup
} from '@/types/fantasy';

type PublicLeagueLegacySnapshot = {
  seasonCount: number;
  seasons: PublicSeasonSnapshot[];
};

type PublicSeasonSnapshot = {
  seasonYear: number;
  league: {
    members: Array<{
      id: number | string;
      name: string;
      slug?: string | null;
    }>;
  };
  season: {
    num_teams: number;
    num_weeks: number;
    playoff_start_week?: number | null;
    num_playoff_teams: number;
    teams: PublicTeam[];
    matchups: PublicMatchup[];
    annotations: Array<{
      week?: number | string | null;
      title?: string | null;
      text?: string | null;
      type?: string | null;
    }>;
    newsletters: Array<{
      week?: number | string | null;
      intro?: string | null;
      preview?: string | null;
    }>;
  };
};

type PublicTeam = {
  id: number | string;
  league_member_id: number | string;
  name: string;
  display_name?: string | null;
  slug?: string | null;
  wins: number;
  losses: number;
  ties: number;
  rank?: number | null;
  playoff_seed?: number | null;
  playoff_wins?: number | null;
  playoff_losses?: number | null;
  total_points: number;
  total_optimal_points?: number | null;
  coach_score?: number | null;
  draft_grade?: string | null;
  draft_rank?: number | null;
  luck?: number | null;
};

type PublicRosterPlayer = {
  service_player_id?: string | null;
  player_id?: string | null;
  player_name?: string | null;
  player_team?: string | null;
  player_position?: string | null;
  lineup_position?: string | null;
  points?: number | string | null;
  points_ppr?: number | string | null;
  started?: boolean | null;
  is_optimal?: boolean | null;
};

type PublicMatchup = {
  matchup_guid: string;
  season_team_id: number | string;
  league_member_id: number | string;
  week: number | string;
  points: number;
  optimal_points?: number | null;
  coach_score?: number | null;
  luck?: number | null;
  opponent_season_team_id: number | string;
  opponent_league_member_id: number | string;
  opponent_points: number;
  team: PublicTeam | null;
  opponent: PublicTeam | null;
  roster: PublicRosterPlayer[];
  opponentRoster: PublicRosterPlayer[];
};

type TeamWeekRow = {
  seasonTeamId: string;
  memberId: string;
  teamName: string;
  managerName: string;
  week: number;
  matchupGuid: string;
  points: number;
  opponentPoints: number;
  optimalPoints: number;
  coachScore: number;
  luck: number;
  roster: PublicRosterPlayer[];
  team: PublicTeam;
  opponentSeasonTeamId: string;
};

type Pairing = {
  week: number;
  matchupId: string;
  left: TeamWeekRow;
  right: TeamWeekRow;
  margin: number;
};

type TeamStandingState = {
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
};

const publicSnapshot = publicLeagueLegacySeasons as PublicLeagueLegacySnapshot;
const PLAYOFF_SIMULATIONS = 250;

function toNumber(value: number | string | null | undefined, fallback = 0): number {
  const numeric = typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''));
  return Number.isFinite(numeric) ? numeric : fallback;
}

function formatRecord(wins: number, losses: number, ties: number): string {
  return `${wins}-${losses}${ties ? `-${ties}` : ''}`;
}

function formatWeekLabel(week: number, regularSeasonWeeks: number): string {
  if (week <= regularSeasonWeeks) {
    return `Week ${week}`;
  }

  return `Playoffs ${week - regularSeasonWeeks}`;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function normalize(value: number, min: number, max: number): number {
  if (max - min === 0) return 1;
  return (value - min) / (max - min);
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = Math.imul(1664525, state) + 1013904223;
    return ((state >>> 0) / 4294967296);
  };
}

function sampleScore(teamSamples: number[], leagueSamples: number[], random: () => number): number {
  const localSamples = teamSamples.length > 0 ? teamSamples : leagueSamples;
  const teamValue = localSamples[Math.floor(random() * localSamples.length)] ?? average(leagueSamples);
  const leagueValue = leagueSamples[Math.floor(random() * leagueSamples.length)] ?? teamValue;
  return teamValue * 0.75 + leagueValue * 0.25;
}

function buildMemberNameMap(season: PublicSeasonSnapshot): Map<string, string> {
  return new Map(season.league.members.map((member) => [String(member.id), member.name]));
}

function buildTeamWeekRows(season: PublicSeasonSnapshot): TeamWeekRow[] {
  const managerById = buildMemberNameMap(season);
  const rows = new Map<string, TeamWeekRow>();

  for (const matchup of season.season.matchups) {
    if (!matchup.team) continue;
    const week = toNumber(matchup.week);
    const seasonTeamId = String(matchup.season_team_id);
    const key = `${week}:${seasonTeamId}`;
    if (rows.has(key)) continue;

    rows.set(key, {
      seasonTeamId,
      memberId: String(matchup.league_member_id),
      teamName: matchup.team.display_name ?? matchup.team.name,
      managerName: managerById.get(String(matchup.league_member_id)) ?? matchup.team.display_name ?? matchup.team.name,
      week,
      matchupGuid: matchup.matchup_guid,
      points: toNumber(matchup.points),
      opponentPoints: toNumber(matchup.opponent_points),
      optimalPoints: toNumber(matchup.optimal_points),
      coachScore: toNumber(matchup.coach_score),
      luck: toNumber(matchup.luck),
      roster: Array.isArray(matchup.roster) ? matchup.roster : [],
      team: matchup.team,
      opponentSeasonTeamId: String(matchup.opponent_season_team_id)
    });
  }

  return [...rows.values()].sort((left, right) => left.week - right.week || left.teamName.localeCompare(right.teamName));
}

function buildPairings(rows: TeamWeekRow[]): Pairing[] {
  const grouped = new Map<string, TeamWeekRow[]>();
  for (const row of rows) {
    const key = `${row.week}:${row.matchupGuid}`;
    const bucket = grouped.get(key) ?? [];
    if (!bucket.some((entry) => entry.seasonTeamId === row.seasonTeamId)) {
      bucket.push(row);
    }
    grouped.set(key, bucket);
  }

  return [...grouped.entries()]
    .map(([key, bucket]) => {
      if (bucket.length < 2) return null;
      const [left, right] = bucket.sort((a, b) => a.teamName.localeCompare(b.teamName));
      const week = toNumber(key.split(':')[0]);
      return {
        week,
        matchupId: key,
        left,
        right,
        margin: Math.abs(left.points - right.points)
      } satisfies Pairing;
    })
    .filter((pairing): pairing is Pairing => Boolean(pairing))
    .sort((left, right) => left.week - right.week || right.margin - left.margin);
}

function buildWeekRowsMap(rows: TeamWeekRow[]): Map<number, TeamWeekRow[]> {
  return rows.reduce((map, row) => {
    const bucket = map.get(row.week) ?? [];
    bucket.push(row);
    map.set(row.week, bucket);
    return map;
  }, new Map<number, TeamWeekRow[]>());
}

function buildWeekPairingsMap(pairings: Pairing[]): Map<number, Pairing[]> {
  return pairings.reduce((map, pairing) => {
    const bucket = map.get(pairing.week) ?? [];
    bucket.push(pairing);
    map.set(pairing.week, bucket);
    return map;
  }, new Map<number, Pairing[]>());
}

function buildAllPlayTable(season: PublicSeasonSnapshot, rows: TeamWeekRow[], regularSeasonWeeks: number): FantasyAllPlayRow[] {
  const weekRowsMap = buildWeekRowsMap(rows.filter((row) => row.week <= regularSeasonWeeks));
  const teamStats = new Map<string, FantasyAllPlayRow>();

  for (const team of season.season.teams) {
    const teamId = String(team.id);
    const managerName = buildMemberNameMap(season).get(String(team.league_member_id)) ?? (team.display_name ?? team.name);
    teamStats.set(teamId, {
      teamId,
      teamName: team.display_name ?? team.name,
      managerName,
      actualWins: toNumber(team.wins),
      actualLosses: toNumber(team.losses),
      actualTies: toNumber(team.ties),
      actualWinPct: 0,
      allPlayWins: 0,
      allPlayLosses: 0,
      allPlayTies: 0,
      allPlayWinPct: 0,
      expectedWins: 0,
      luckDeltaWins: 0,
      scheduleLuckScore: toNumber(team.luck),
      pointsFor: toNumber(team.total_points),
      averageScore: 0
    });
  }

  for (const [week, weekRows] of weekRowsMap.entries()) {
    void week;
    const sortedScores = [...weekRows].map((row) => row.points);
    for (const row of weekRows) {
      const entry = teamStats.get(String(row.team.id));
      if (!entry) continue;

      let wins = 0;
      let losses = 0;
      let ties = 0;
      for (const score of sortedScores) {
        if (score < row.points) wins += 1;
        else if (score > row.points) losses += 1;
        else ties += 1;
      }
      ties = Math.max(0, ties - 1);

      entry.allPlayWins += wins;
      entry.allPlayLosses += losses;
      entry.allPlayTies += ties;
      entry.averageScore += row.points;
    }
  }

  return [...teamStats.values()]
    .map((entry) => {
      const games = entry.actualWins + entry.actualLosses + entry.actualTies;
      const allPlayGames = Math.max(1, regularSeasonWeeks * (season.season.num_teams - 1));
      const expectedWins = entry.allPlayWins / Math.max(1, season.season.num_teams - 1);
      return {
        ...entry,
        actualWinPct: games > 0 ? (entry.actualWins + entry.actualTies * 0.5) / games : 0,
        allPlayWinPct: (entry.allPlayWins + entry.allPlayTies * 0.5) / allPlayGames,
        expectedWins,
        luckDeltaWins: entry.actualWins - expectedWins,
        averageScore: entry.averageScore / Math.max(1, regularSeasonWeeks)
      };
    })
    .sort((left, right) => right.luckDeltaWins - left.luckDeltaWins || right.allPlayWins - left.allPlayWins);
}

function buildPowerRankings(season: PublicSeasonSnapshot, rows: TeamWeekRow[], allPlayTable: FantasyAllPlayRow[], totalWeeksTracked: number): FantasyWeeklyPowerRanking[] {
  const weekRowsMap = buildWeekRowsMap(rows);
  const teamNames = new Map(season.season.teams.map((team) => [String(team.id), { teamName: team.display_name ?? team.name, managerName: buildMemberNameMap(season).get(String(team.league_member_id)) ?? (team.display_name ?? team.name) }]));
  const rankings: FantasyWeeklyPowerRanking[] = [];
  const previousRanks = new Map<string, number>();

  for (let week = 1; week <= totalWeeksTracked; week += 1) {
    const rowsToDate = rows.filter((row) => row.week <= week);
    const weekRowsToDateMap = buildWeekRowsMap(rowsToDate);
    const allPlayToDate = new Map<string, { wins: number; losses: number; ties: number }>();

    for (const weekRows of weekRowsToDateMap.values()) {
      const scores = weekRows.map((row) => row.points);
      for (const row of weekRows) {
        const current = allPlayToDate.get(row.seasonTeamId) ?? { wins: 0, losses: 0, ties: 0 };
        for (const score of scores) {
          if (score < row.points) current.wins += 1;
          else if (score > row.points) current.losses += 1;
          else current.ties += 1;
        }
        current.ties = Math.max(0, current.ties - 1);
        allPlayToDate.set(row.seasonTeamId, current);
      }
    }

    const teamRows = season.season.teams.map((team) => {
      const teamId = String(team.id);
      const teamWeeks = rowsToDate.filter((row) => row.seasonTeamId === teamId);
      const wins = teamWeeks.filter((row) => row.points > row.opponentPoints).length;
      const losses = teamWeeks.filter((row) => row.points < row.opponentPoints).length;
      const ties = teamWeeks.filter((row) => row.points === row.opponentPoints).length;
      const avgScore = average(teamWeeks.map((row) => row.points));
      const coachScore = average(teamWeeks.map((row) => row.coachScore));
      const allPlay = allPlayToDate.get(teamId) ?? { wins: 0, losses: 0, ties: 0 };
      const possibleAllPlayGames = Math.max(1, teamWeeks.length * Math.max(1, season.season.num_teams - 1));
      const allPlayWinPct = (allPlay.wins + allPlay.ties * 0.5) / possibleAllPlayGames;
      const actualGames = Math.max(1, teamWeeks.length);
      const winPct = (wins + ties * 0.5) / actualGames;
      return {
        teamId,
        teamName: teamNames.get(teamId)?.teamName ?? team.name,
        managerName: teamNames.get(teamId)?.managerName ?? team.name,
        wins,
        losses,
        ties,
        record: formatRecord(wins, losses, ties),
        averageScore: avgScore,
        allPlayWinPct,
        coachScore,
        winPct
      };
    });

    const scoreValues = teamRows.map((row) => row.averageScore);
    const minScore = Math.min(...scoreValues);
    const maxScore = Math.max(...scoreValues);

    const rankedRows = teamRows
      .map((row) => {
        const powerScore = normalize(row.averageScore, minScore, maxScore) * 45 + row.winPct * 30 + row.allPlayWinPct * 15 + (row.coachScore / 100) * 10;
        return {
          ...row,
          powerScore
        };
      })
      .sort((left, right) => right.powerScore - left.powerScore || right.averageScore - left.averageScore)
      .map((row, index) => {
        const previousRank = previousRanks.get(row.teamId);
        const currentRank = index + 1;
        previousRanks.set(row.teamId, currentRank);
        return {
          rank: currentRank,
          teamId: row.teamId,
          teamName: row.teamName,
          managerName: row.managerName,
          record: row.record,
          averageScore: row.averageScore,
          allPlayWinPct: row.allPlayWinPct,
          coachScore: row.coachScore,
          powerScore: row.powerScore,
          trend: previousRank ? previousRank - currentRank : 0
        } satisfies FantasyPowerRankingRow;
      });

    rankings.push({
      week,
      label: formatWeekLabel(week, season.season.num_weeks),
      rows: rankedRows
    });
  }

  return rankings;
}

function cloneStateMap(input: Map<string, TeamStandingState>): Map<string, TeamStandingState> {
  return new Map([...input.entries()].map(([key, value]) => [key, { ...value }]));
}

function sortStandingsRows(rows: Array<{ teamId: string; wins: number; losses: number; ties: number; pointsFor: number }>): Array<{ teamId: string; wins: number; losses: number; ties: number; pointsFor: number }> {
  return rows.toSorted((left, right) => {
    const leftScore = left.wins + left.ties * 0.5;
    const rightScore = right.wins + right.ties * 0.5;
    return rightScore - leftScore || right.pointsFor - left.pointsFor || left.teamId.localeCompare(right.teamId);
  });
}

function simulatePlayoffs(seedRows: Array<{ teamId: string; seed: number }>, teamSamples: Map<string, number[]>, leagueSamples: number[], random: () => number): string | null {
  const pickWinner = (left: { teamId: string; seed: number }, right: { teamId: string; seed: number }) => {
    const leftScore = sampleScore(teamSamples.get(left.teamId) ?? leagueSamples, leagueSamples, random);
    const rightScore = sampleScore(teamSamples.get(right.teamId) ?? leagueSamples, leagueSamples, random);
    if (leftScore === rightScore) {
      return left.seed < right.seed ? left : right;
    }
    return leftScore > rightScore ? left : right;
  };

  if (seedRows.length === 0) return null;
  if (seedRows.length === 2) return pickWinner(seedRows[0], seedRows[1]).teamId;
  if (seedRows.length === 4) {
    const semiOne = pickWinner(seedRows[0], seedRows[3]);
    const semiTwo = pickWinner(seedRows[1], seedRows[2]);
    return pickWinner(semiOne, semiTwo).teamId;
  }
  if (seedRows.length === 6) {
    const quarterOne = pickWinner(seedRows[2], seedRows[5]);
    const quarterTwo = pickWinner(seedRows[3], seedRows[4]);
    const lowestRemaining = quarterOne.seed > quarterTwo.seed ? quarterOne : quarterTwo;
    const highestRemaining = quarterOne.seed > quarterTwo.seed ? quarterTwo : quarterOne;
    const semiOne = pickWinner(seedRows[0], lowestRemaining);
    const semiTwo = pickWinner(seedRows[1], highestRemaining);
    return pickWinner(semiOne, semiTwo).teamId;
  }

  const ordered = [...seedRows].sort((left, right) => left.seed - right.seed);
  let current = ordered;
  while (current.length > 1) {
    const nextRound: Array<{ teamId: string; seed: number }> = [];
    for (let index = 0; index < current.length / 2; index += 1) {
      const left = current[index];
      const right = current[current.length - 1 - index];
      nextRound.push(pickWinner(left, right));
    }
    current = nextRound.sort((left, right) => left.seed - right.seed);
  }

  return current[0]?.teamId ?? null;
}

function buildPlayoffOdds(season: PublicSeasonSnapshot, rows: TeamWeekRow[], pairings: Pairing[], regularSeasonWeeks: number): FantasyPlayoffOddsCheckpoint[] {
  const teams = season.season.teams;
  const weekPairingsMap = buildWeekPairingsMap(pairings.filter((pairing) => pairing.week <= regularSeasonWeeks));
  const checkpoints: FantasyPlayoffOddsCheckpoint[] = [];
  const teamIdentity = new Map(teams.map((team) => [String(team.id), { teamName: team.display_name ?? team.name, managerName: buildMemberNameMap(season).get(String(team.league_member_id)) ?? (team.display_name ?? team.name), seed: toNumber(team.playoff_seed, 0), rank: toNumber(team.rank, 0) }]));

  for (let week = 1; week <= regularSeasonWeeks; week += 1) {
    const rowsToDate = rows.filter((row) => row.week <= week && row.week <= regularSeasonWeeks);
    const currentState = new Map<string, TeamStandingState>();
    for (const team of teams) {
      currentState.set(String(team.id), { wins: 0, losses: 0, ties: 0, pointsFor: 0 });
    }
    for (const row of rowsToDate) {
      const state = currentState.get(row.seasonTeamId);
      if (!state) continue;
      state.pointsFor += row.points;
      if (row.points > row.opponentPoints) state.wins += 1;
      else if (row.points < row.opponentPoints) state.losses += 1;
      else state.ties += 1;
    }

    const teamSamples = new Map<string, number[]>();
    const leagueSamples = rowsToDate.map((row) => row.points);
    for (const team of teams) {
      const teamId = String(team.id);
      teamSamples.set(teamId, rowsToDate.filter((row) => row.seasonTeamId === teamId).map((row) => row.points));
    }

    const playoffCounts = new Map<string, number>();
    const byeCounts = new Map<string, number>();
    const titleCounts = new Map<string, number>();
    const remainingWeeks = [...weekPairingsMap.keys()].filter((value) => value > week).sort((left, right) => left - right);

    if (remainingWeeks.length === 0) {
      const finalStandings = sortStandingsRows(
        [...currentState.entries()].map(([teamId, state]) => ({ teamId, ...state }))
      );
      const qualifiers = finalStandings.slice(0, season.season.num_playoff_teams);
      for (const row of qualifiers) {
        playoffCounts.set(row.teamId, 1);
      }
      const byeTeams = qualifiers.slice(0, season.season.num_playoff_teams === 6 ? 2 : 0);
      for (const row of byeTeams) {
        byeCounts.set(row.teamId, 1);
      }
      const championId = qualifiers[0]?.teamId;
      if (championId) titleCounts.set(championId, 1);
    } else {
      for (let simulation = 0; simulation < PLAYOFF_SIMULATIONS; simulation += 1) {
        const random = createSeededRandom(season.seasonYear * 1000 + week * 17 + simulation);
        const simulatedState = cloneStateMap(currentState);

        for (const futureWeek of remainingWeeks) {
          for (const pairing of weekPairingsMap.get(futureWeek) ?? []) {
            const leftScore = sampleScore(teamSamples.get(pairing.left.seasonTeamId) ?? [], leagueSamples, random);
            const rightScore = sampleScore(teamSamples.get(pairing.right.seasonTeamId) ?? [], leagueSamples, random);
            const leftState = simulatedState.get(pairing.left.seasonTeamId);
            const rightState = simulatedState.get(pairing.right.seasonTeamId);
            if (!leftState || !rightState) continue;
            leftState.pointsFor += leftScore;
            rightState.pointsFor += rightScore;
            if (leftScore > rightScore) {
              leftState.wins += 1;
              rightState.losses += 1;
            } else if (rightScore > leftScore) {
              rightState.wins += 1;
              leftState.losses += 1;
            } else {
              leftState.ties += 1;
              rightState.ties += 1;
            }
          }
        }

        const finalStandings = sortStandingsRows(
          [...simulatedState.entries()].map(([teamId, state]) => ({ teamId, ...state }))
        );
        const qualifiers = finalStandings.slice(0, season.season.num_playoff_teams);
        for (const row of qualifiers) {
          playoffCounts.set(row.teamId, (playoffCounts.get(row.teamId) ?? 0) + 1);
        }

        const byeTeams = qualifiers.slice(0, season.season.num_playoff_teams === 6 ? 2 : 0);
        for (const row of byeTeams) {
          byeCounts.set(row.teamId, (byeCounts.get(row.teamId) ?? 0) + 1);
        }

        const seededQualifiers = qualifiers.map((row, index) => ({ teamId: row.teamId, seed: index + 1 }));
        const championId = simulatePlayoffs(seededQualifiers, teamSamples, leagueSamples, random);
        if (championId) {
          titleCounts.set(championId, (titleCounts.get(championId) ?? 0) + 1);
        }
      }
    }

    const rowsForCheckpoint = teams
      .map((team) => {
        const teamId = String(team.id);
        const state = currentState.get(teamId) ?? { wins: 0, losses: 0, ties: 0, pointsFor: 0 };
        const info = teamIdentity.get(teamId);
        return {
          teamId,
          teamName: info?.teamName ?? team.name,
          managerName: info?.managerName ?? team.name,
          wins: state.wins,
          losses: state.losses,
          ties: state.ties,
          pointsFor: state.pointsFor,
          playoffOdds: (playoffCounts.get(teamId) ?? 0) / Math.max(1, remainingWeeks.length === 0 ? 1 : PLAYOFF_SIMULATIONS),
          byeOdds: (byeCounts.get(teamId) ?? 0) / Math.max(1, remainingWeeks.length === 0 ? 1 : PLAYOFF_SIMULATIONS),
          titleOdds: (titleCounts.get(teamId) ?? 0) / Math.max(1, remainingWeeks.length === 0 ? 1 : PLAYOFF_SIMULATIONS),
          actualFinalSeed: info?.seed ?? null,
          actualFinalRank: info?.rank ?? null
        } satisfies FantasyPlayoffOddsRow;
      })
      .sort((left, right) => right.playoffOdds - left.playoffOdds || right.titleOdds - left.titleOdds || right.pointsFor - left.pointsFor);

    checkpoints.push({
      week,
      label: `After Week ${week}`,
      rows: rowsForCheckpoint
    });
  }

  return checkpoints;
}

function buildWeeklyRecaps(
  season: PublicSeasonSnapshot,
  rows: TeamWeekRow[],
  pairings: Pairing[],
  powerRankings: FantasyWeeklyPowerRanking[],
  totalWeeksTracked: number,
  regularSeasonWeeks: number
): FantasyWeeklyRecap[] {
  const weekRowsMap = buildWeekRowsMap(rows);
  const weekPairingsMap = buildWeekPairingsMap(pairings);
  const weekNotes = new Map<number, string>();

  for (const annotation of season.season.annotations) {
    const week = toNumber(annotation.week, 0);
    if (!week || weekNotes.has(week)) continue;
    const sourceText = annotation.text || annotation.title;
    if (sourceText) weekNotes.set(week, sourceText.split('\n')[0].trim());
  }

  for (const newsletter of season.season.newsletters) {
    const week = toNumber(newsletter.week, 0);
    if (!week || weekNotes.has(week)) continue;
    const sourceText = newsletter.preview || newsletter.intro;
    if (sourceText) weekNotes.set(week, sourceText.trim());
  }

  const recaps: FantasyWeeklyRecap[] = [];

  for (let week = 1; week <= totalWeeksTracked; week += 1) {
    const weekRows = weekRowsMap.get(week) ?? [];
    const weekPairings = weekPairingsMap.get(week) ?? [];
    if (weekRows.length === 0) continue;

    const topScorerRow = [...weekRows].sort((left, right) => right.points - left.points)[0];
    const worstRegretRow = [...weekRows].sort((left, right) => (right.optimalPoints - right.points) - (left.optimalPoints - left.points))[0];
    const closestPair = [...weekPairings].sort((left, right) => left.margin - right.margin)[0];
    const biggestBlowout = [...weekPairings].sort((left, right) => right.margin - left.margin)[0];
    const powerEntry = powerRankings.find((entry) => entry.week === Math.min(week, powerRankings[powerRankings.length - 1]?.week ?? week));
    const topThree = powerEntry?.rows.slice(0, 3) ?? [];

    const defaultSummary = [
      `${topScorerRow.teamName} led the board with ${topScorerRow.points.toFixed(1)} points.`,
      closestPair
        ? `${closestPair.left.teamName} vs ${closestPair.right.teamName} was the tightest sweat at ${closestPair.margin.toFixed(1)} points.`
        : null,
      biggestBlowout
        ? `${biggestBlowout.left.points > biggestBlowout.right.points ? biggestBlowout.left.teamName : biggestBlowout.right.teamName} delivered the heaviest thumping at ${biggestBlowout.margin.toFixed(1)} points.`
        : null,
      worstRegretRow && worstRegretRow.optimalPoints > worstRegretRow.points
        ? `${worstRegretRow.teamName} left ${(worstRegretRow.optimalPoints - worstRegretRow.points).toFixed(1)} points on the bench.`
        : null
    ].filter(Boolean).join(' ');

    recaps.push({
      week,
      label: formatWeekLabel(week, regularSeasonWeeks),
      headline: week <= regularSeasonWeeks ? `${topScorerRow.teamName} owned Week ${week}` : `${topScorerRow.teamName} brought the playoff heat`,
      summary: weekNotes.get(week) ?? defaultSummary,
      topScorer: {
        teamId: topScorerRow.seasonTeamId,
        teamName: topScorerRow.teamName,
        managerName: topScorerRow.managerName,
        score: topScorerRow.points
      },
      closestMatchup: closestPair
        ? {
            week,
            matchupId: closestPair.matchupId,
            leftTeamId: closestPair.left.seasonTeamId,
            leftTeamName: closestPair.left.teamName,
            leftManagerName: closestPair.left.managerName,
            leftScore: closestPair.left.points,
            rightTeamId: closestPair.right.seasonTeamId,
            rightTeamName: closestPair.right.teamName,
            rightManagerName: closestPair.right.managerName,
            rightScore: closestPair.right.points,
            margin: closestPair.margin
          } satisfies FantasyWeeklyRecapMatchup
        : undefined,
      biggestBlowout: biggestBlowout
        ? {
            week,
            matchupId: biggestBlowout.matchupId,
            leftTeamId: biggestBlowout.left.seasonTeamId,
            leftTeamName: biggestBlowout.left.teamName,
            leftManagerName: biggestBlowout.left.managerName,
            leftScore: biggestBlowout.left.points,
            rightTeamId: biggestBlowout.right.seasonTeamId,
            rightTeamName: biggestBlowout.right.teamName,
            rightManagerName: biggestBlowout.right.managerName,
            rightScore: biggestBlowout.right.points,
            margin: biggestBlowout.margin
          } satisfies FantasyWeeklyRecapMatchup
        : undefined,
      worstBenchRegret: worstRegretRow && worstRegretRow.optimalPoints > worstRegretRow.points
        ? {
            teamId: worstRegretRow.seasonTeamId,
            teamName: worstRegretRow.teamName,
            managerName: worstRegretRow.managerName,
            regretPoints: worstRegretRow.optimalPoints - worstRegretRow.points,
            efficiency: worstRegretRow.optimalPoints > 0 ? worstRegretRow.points / worstRegretRow.optimalPoints : 1
          }
        : undefined,
      powerPodium: topThree.map((row) => ({
        rank: row.rank,
        teamId: row.teamId,
        teamName: row.teamName,
        managerName: row.managerName,
        powerScore: row.powerScore
      }))
    });
  }

  return recaps;
}

function buildLineupEfficiencyTable(season: PublicSeasonSnapshot, rows: TeamWeekRow[], regularSeasonWeeks: number): FantasyLineupEfficiencyRow[] {
  const regularRows = rows.filter((row) => row.week <= regularSeasonWeeks);
  const managerById = buildMemberNameMap(season);

  return season.season.teams
    .map((team) => {
      const teamId = String(team.id);
      const teamRows = regularRows.filter((row) => row.seasonTeamId === teamId);
      const actualPoints = teamRows.reduce((sum, row) => sum + row.points, 0);
      const optimalPoints = teamRows.reduce((sum, row) => sum + row.optimalPoints, 0);
      const regretPoints = Math.max(0, optimalPoints - actualPoints);
      const biggestMiss = teamRows
        .map((row) => ({ week: row.week, miss: Math.max(0, row.optimalPoints - row.points) }))
        .sort((left, right) => right.miss - left.miss)[0] ?? { week: 0, miss: 0 };
      return {
        teamId,
        teamName: team.display_name ?? team.name,
        managerName: managerById.get(String(team.league_member_id)) ?? (team.display_name ?? team.name),
        actualPoints,
        optimalPoints,
        efficiency: optimalPoints > 0 ? actualPoints / optimalPoints : 1,
        coachScore: teamRows.length > 0 ? average(teamRows.map((row) => row.coachScore)) : toNumber(team.coach_score),
        regretPoints,
        averageRegret: teamRows.length > 0 ? regretPoints / teamRows.length : 0,
        biggestMissWeek: biggestMiss.week,
        biggestMissPoints: biggestMiss.miss
      } satisfies FantasyLineupEfficiencyRow;
    })
    .sort((left, right) => left.efficiency - right.efficiency || right.regretPoints - left.regretPoints);
}

function buildSeasonAnalytics(season: PublicSeasonSnapshot): FantasySeasonAnalytics {
  const rows = buildTeamWeekRows(season);
  const pairings = buildPairings(rows);
  const totalWeeksTracked = Math.max(...rows.map((row) => row.week), season.season.num_weeks);
  const regularSeasonWeeks = toNumber(season.season.playoff_start_week, season.season.num_weeks + 1) - 1 || season.season.num_weeks;
  const allPlayTable = buildAllPlayTable(season, rows, regularSeasonWeeks);
  const powerRankings = buildPowerRankings(season, rows.filter((row) => row.week <= regularSeasonWeeks), allPlayTable, regularSeasonWeeks);
  const weeklyRecaps = buildWeeklyRecaps(season, rows, pairings, powerRankings, totalWeeksTracked, regularSeasonWeeks);
  const playoffOddsCheckpoints = buildPlayoffOdds(season, rows, pairings, regularSeasonWeeks);
  const lineupEfficiencyTable = buildLineupEfficiencyTable(season, rows, regularSeasonWeeks);

  return {
    seasonYear: season.seasonYear,
    regularSeasonWeeks,
    totalWeeksTracked,
    allPlayTable,
    playoffOddsCheckpoints,
    powerRankings,
    weeklyRecaps,
    lineupEfficiencyTable
  };
}

const analyticsBySeasonYear = new Map(
  publicSnapshot.seasons.map((season) => [season.seasonYear, buildSeasonAnalytics(season)] as const)
);

export function getFantasySeasonAnalyticsByYear(year: number): FantasySeasonAnalytics | undefined {
  return analyticsBySeasonYear.get(year);
}

export function getFantasySeasonAnalyticsYears(): number[] {
  return [...analyticsBySeasonYear.keys()].sort((left, right) => right - left);
}
