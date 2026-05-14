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

export interface FantasyManagerOpeningPick {
  playerId: string;
  playerName: string;
  position: FantasyPlayerPosition;
  nflTeam: string;
  round: number;
  overallPick: number;
}

export interface FantasySeasonDraftTendency {
  seasonId: string;
  seasonYear: number;
  teamId: string;
  teamName: string;
  strategyLabel: string;
  summary: string;
  openingPositions: FantasyPlayerPosition[];
  openingPicks: FantasyManagerOpeningPick[];
  firstPositionRounds: Partial<Record<FantasyPlayerPosition, number>>;
  qbRound?: number;
  teRound?: number;
  keeperCount: number;
  totalPicks: number;
  draftGrade?: string | null;
  draftRank?: number | null;
  coachRank?: number | null;
}

export interface FantasyMember {
  id: string;
  slug: string;
  managerName: string;
  avatarUrl?: string;
  favoriteTeam: string;
  rivalryNote: string;
  draftTendency: string;
  draftTendenciesBySeason: FantasySeasonDraftTendency[];
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
  displayName?: string;
  shortName?: string;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  streak: string;
  playoffSeed?: number | null;
  playoffWins?: number;
  playoffLosses?: number;
  finishRank?: number | null;
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
  teamDisplayName?: string;
  teamShortName?: string;
  playerId: string;
  isKeeper: boolean;
  keeperCostRound?: number;
  notes?: string;
}

export interface FantasySeasonSummary {
  championTeamId: string;
  championDisplayName?: string;
  runnerUpTeamId: string;
  runnerUpDisplayName?: string;
  regularSeasonWinnerTeamId: string;
  regularSeasonWinnerDisplayName?: string;
  highestScoringTeamId: string;
  highestScoringTeamDisplayName?: string;
  worstRecordTeamId: string;
  worstRecordTeamDisplayName?: string;
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
  numPlayoffTeams: number;
  playoffStartWeek?: number | null;
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
  keeperCostOverallPick?: number;
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

export interface FantasyTradeAsset {
  playerId: string;
  playerName: string;
  position?: string | null;
  nflTeam?: string | null;
  sourceTeamKey?: string | null;
  sourceTeamName?: string | null;
  destinationTeamKey?: string | null;
  destinationTeamName?: string | null;
}

export interface FantasyTradeParty {
  seasonTeamId?: string | null;
  memberId?: string | null;
  teamKey?: string | null;
  teamName?: string | null;
}

export interface FantasyTrade {
  id: string;
  transactionKey: string;
  seasonId: string;
  seasonYear: number;
  postedAt?: string | null;
  weekLabel?: string | null;
  value?: number | null;
  status?: string | null;
  trader: FantasyTradeParty;
  tradee: FantasyTradeParty;
  traderSent: FantasyTradeAsset[];
  tradeeSent: FantasyTradeAsset[];
}

export interface FantasyManagerSeasonSnapshot {
  seasonId: string;
  seasonYear: number;
  teamId: string;
  teamName: string;
  numPlayoffTeams: number;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  regularSeasonRank?: number | null;
  finishRank?: number | null;
  playoffSeed?: number | null;
  playoffWins?: number | null;
  playoffLosses?: number | null;
  draftGrade?: string | null;
  draftRank?: number | null;
  coachRank?: number | null;
  numMoves: number;
  numTrades: number;
  avgPoints: number;
}

export interface FantasyManagerSeasonRosterPlayer {
  playerId: string;
  playerName: string;
  position: FantasyPlayerPosition;
  nflTeam: string;
  round: number;
  overallPick: number;
  potentialKeeper: boolean;
}

export interface FantasyManagerSeasonRoster {
  seasonId: string;
  seasonYear: number;
  teamId: string;
  teamName: string;
  players: FantasyManagerSeasonRosterPlayer[];
}

export interface FantasyManagerProfile {
  member: FantasyMember;
  team: FantasyTeamIdentity;
  seasonHistory: FantasyManagerSeasonSnapshot[];
  seasonRosters: FantasyManagerSeasonRoster[];
  draftTendencies: FantasySeasonDraftTendency[];
  trades: FantasyTrade[];
  championshipYears: number[];
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
  trades: FantasyTrade[];
}
