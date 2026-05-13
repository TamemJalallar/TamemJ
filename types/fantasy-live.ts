export interface FantasyLivePublicMeta {
  cacheState: "fresh" | "stale";
  cachedAt: string;
  expiresAt: string;
  lastSuccessfulRefreshAt: string;
  source: "kv" | "live-refresh" | "stale-kv";
  refreshReason?: string;
  warning?: string;
}

export interface FantasyLiveLeagueSnapshot {
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
  meta: {
    source: "yahoo";
    fetchedAt: string;
    requestedWeek?: number;
    currentWeek?: number;
  };
}

export interface FantasyLiveLeagueEnvelope {
  ok: boolean;
  data: FantasyLiveLeagueSnapshot;
  meta: FantasyLivePublicMeta;
}
