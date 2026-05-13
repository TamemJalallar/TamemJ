export type FantasyPlatform = "Yahoo" | "ESPN" | "Sleeper" | "Manual";
export type FantasySeasonStatus = "active" | "completed" | "upcoming";
export type FantasyPlayerPosition = "QB" | "RB" | "WR" | "TE" | "K" | "DST";
export type FantasyDraftView = "board" | "table" | "team";
export type FantasyMatchupStatus = "upcoming" | "live" | "final";

export interface FantasyProviderIds {
  yahoo?: string;
  espn?: string;
  sleeper?: string;
}

export interface FantasyLeagueIdentity {
  name: string;
  slug: string;
  tagline: string;
  seasonYear: number;
  establishedYear: number;
  logoUrl?: string;
  logoText: string;
  currentWeekLabel: string;
  location: string;
  nextDraftDate: string;
  platformReadiness: FantasyPlatform[];
  leagueSize: number;
}

export interface FantasyKeeperRules {
  maxKeepers: number;
  sourceSeasonYear: number;
  targetSeasonYear: number;
  deadline: string;
  costRule: string;
  roundPenaltyRule: string;
  defaultWaiverCost: string;
  ineligiblePlayersRule: string;
  notes: string[];
}

export interface FantasyMember {
  id: string;
  managerName: string;
  avatarUrl?: string;
  favoriteTeam: string;
  rivalryNote: string;
  draftTendency: string;
  bio: string;
}

export interface FantasyTeamIdentity {
  id: string;
  memberId: string;
  teamName: string;
  shortName: string;
  mascot: string;
  colors: {
    primary: string;
    secondary: string;
  };
  championships: number;
  playoffAppearances: number;
  allTimeRecord: {
    wins: number;
    losses: number;
    ties: number;
  };
  legacyNames: string[];
  notes: string;
}

export interface FantasyPlayer {
  id: string;
  name: string;
  position: FantasyPlayerPosition;
  nflTeam: string;
  adp?: number;
}

export interface FantasyStanding {
  teamId: string;
  rank: number;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  streak: string;
}

export interface FantasyMatchup {
  id: string;
  week: number;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  status: FantasyMatchupStatus;
  note?: string;
}

export interface FantasyDraftPick {
  id: string;
  seasonYear: number;
  round: number;
  pickInRound: number;
  overallPick: number;
  teamId: string;
  playerId: string;
  isKeeper: boolean;
  keeperCostRound?: number;
  notes?: string;
}

export interface FantasySeasonSummary {
  championTeamId: string;
  runnerUpTeamId: string;
  regularSeasonWinnerTeamId: string;
  highestScoringTeamId: string;
  worstRecordTeamId: string;
}

export interface FantasySeason {
  id: string;
  year: number;
  label: string;
  status: FantasySeasonStatus;
  weekLabel: string;
  teamOrder: string[];
  standings: FantasyStanding[];
  matchups: FantasyMatchup[];
  draftPicks: FantasyDraftPick[];
  draftDate: string;
  draftRounds: number;
  keeperSelections: FantasyKeeperSelection[];
  summary: FantasySeasonSummary;
  seasonNotes: string[];
}

export interface FantasyKeeperCandidate {
  id: string;
  seasonYear: number;
  teamId: string;
  playerId: string;
  previousDraftRound?: number;
  keeperCostRound?: number;
  yearsKept: number;
  eligible: boolean;
  notes?: string;
}

export interface FantasyKeeperSelection {
  seasonYear: number;
  teamId: string;
  playerId: string;
  keeperCostRound?: number;
  locked: boolean;
}

export interface FantasyLeagueRecord {
  id: string;
  label: string;
  category: "weekly" | "matchup" | "draft" | "manager" | "season";
  value: string;
  seasonYear: number;
  teamId?: string;
  memberId?: string;
  context: string;
}

export interface FantasyLeagueAward {
  id: string;
  title: string;
  seasonYear: number;
  teamId?: string;
  memberId?: string;
  summary: string;
}

export interface FantasyLeagueDataset {
  league: FantasyLeagueIdentity;
  keeperRules: FantasyKeeperRules;
  members: FantasyMember[];
  teams: FantasyTeamIdentity[];
  players: FantasyPlayer[];
  seasons: FantasySeason[];
  keeperCandidates: FantasyKeeperCandidate[];
  records: FantasyLeagueRecord[];
  awards: FantasyLeagueAward[];
}
