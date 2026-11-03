"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import type {
  FantasyAllPlayRow,
  FantasyLeagueDataset,
  FantasyLineupEfficiencyRow,
  FantasyPlayoffOddsRow,
  FantasyPowerRankingRow,
  FantasySeasonAnalytics,
  FantasySeasonRecap,
  FantasyStanding,
  FantasyTrade
} from "@/types/fantasy";

function formatPoints(value: number): string {
  return value.toFixed(1);
}

function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatTradeDate(value?: string | null): string {
  if (!value) return "Date pending";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatTradeBundle(players: FantasyTrade["traderSent"]): string {
  if (players.length === 0) return "No players logged";
  return players.map((player) => `${player.playerName}${player.position ? ` (${player.position})` : ""}`).join(", ");
}

function getStandingName(standing: FantasyStanding, fallback?: string): string {
  return standing.displayName ?? fallback ?? "League team";
}

function getStandingShortName(standing: FantasyStanding, fallback?: string): string {
  return standing.shortName ?? fallback ?? standing.displayName ?? "League team";
}

function formatStandingRecord(standing: FantasyStanding): string {
  return `${standing.wins}-${standing.losses}${standing.ties ? `-${standing.ties}` : ""}`;
}

function getPlayoffResultLabel(standing: FantasyStanding): string {
  if (standing.finishRank === 1) return "Champion";
  if (standing.finishRank === 2) return "Runner-up";
  if (standing.playoffSeed && (standing.playoffLosses ?? 0) > 0) {
    const round = Math.max(1, (standing.playoffWins ?? 0) + 1);
    return `Lost in Round ${round}`;
  }
  if (standing.playoffSeed) return `Playoffs • Seed ${standing.playoffSeed}`;
  return "Missed playoffs";
}

function getPlayoffTone(label: string): string {
  if (label === "Champion") return "border-emerald-400/35 bg-emerald-500/12 text-emerald-100";
  if (label === "Runner-up") return "border-sky-400/35 bg-sky-500/12 text-sky-100";
  if (label.startsWith("Lost in Round")) return "border-amber-400/35 bg-amber-500/12 text-amber-100";
  if (label.startsWith("Playoffs")) return "border-violet-400/35 bg-violet-500/12 text-violet-100";
  return "border-line/70 bg-card-2/85 text-fg-secondary";
}

function formatSignedValue(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}`;
}

function getDraftValueTone(value: number): string {
  if (value >= 10) return "text-emerald-300";
  if (value > 0) return "text-sky-300";
  if (value <= -10) return "text-rose-300";
  return "text-amber-200";
}

function getTrendLabel(trend: number): string {
  if (trend > 0) return `+${trend}`;
  if (trend < 0) return `${trend}`;
  return "—";
}

function getTrendClass(trend: number): string {
  if (trend > 0) return "text-emerald-300";
  if (trend < 0) return "text-rose-300";
  return "text-fg-secondary";
}

function getTrendBadgeClass(trend: number): string {
  if (trend > 0) return "border-emerald-400/35 bg-emerald-500/12 text-emerald-200";
  if (trend < 0) return "border-rose-400/35 bg-rose-500/12 text-rose-200";
  return "border-line/70 bg-card/80 text-fg-secondary";
}

function getLuckBarClass(value: number): string {
  if (value >= 1.5) return "bg-gradient-to-r from-emerald-500 to-lime-300";
  if (value > 0) return "bg-gradient-to-r from-sky-500 to-cyan-300";
  if (value <= -1.5) return "bg-gradient-to-r from-rose-500 to-pink-300";
  return "bg-gradient-to-r from-amber-500 to-orange-300";
}

function getOddsBarClass(label: "playoff" | "bye" | "title"): string {
  switch (label) {
    case "playoff":
      return "bg-gradient-to-r from-sky-500 to-cyan-300";
    case "bye":
      return "bg-gradient-to-r from-violet-500 to-fuchsia-300";
    case "title":
      return "bg-gradient-to-r from-emerald-500 to-lime-300";
    default:
      return "bg-card-2/80";
  }
}

function getEfficiencyBarClass(value: number): string {
  if (value >= 0.94) return "bg-gradient-to-r from-emerald-500 to-lime-300";
  if (value >= 0.88) return "bg-gradient-to-r from-sky-500 to-cyan-300";
  if (value >= 0.82) return "bg-gradient-to-r from-amber-500 to-orange-300";
  return "bg-gradient-to-r from-rose-500 to-pink-300";
}

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function getSelectedByWeek<T extends { week: number }>(items: T[], week: number): T | undefined {
  return items.find((item) => item.week === week) ?? items[items.length - 1];
}

function buildPowerNarrative(row: FantasyPowerRankingRow | undefined): string {
  if (!row) return "Power board still warming up.";
  return `${row.teamName} closed this checkpoint at ${formatPoints(row.averageScore)} points per game with a ${formatPercentage(row.allPlayWinPct)} all-play clip.`;
}

function buildLuckNarrative(row: FantasyAllPlayRow | undefined): string {
  if (!row) return "Luck table still warming up.";
  if (row.luckDeltaWins >= 0) {
    return `${row.teamName} ran ${row.luckDeltaWins.toFixed(1)} wins ahead of expectation.`;
  }
  return `${row.teamName} absorbed ${Math.abs(row.luckDeltaWins).toFixed(1)} wins of pain versus expectation.`;
}

function buildEfficiencyNarrative(row: FantasyLineupEfficiencyRow | undefined): string {
  if (!row) return "Lineup lab still warming up.";
  if (row.biggestMissDetail?.missedPlayerName) {
    return `${row.teamName} posted a ${formatPercentage(row.efficiency)} lineup efficiency and kept ${row.biggestMissDetail.missedPlayerName} parked during its biggest miss.`;
  }
  return `${row.teamName} posted a ${formatPercentage(row.efficiency)} lineup efficiency and left ${formatPoints(row.regretPoints)} points on the cutting-room floor.`;
}

function formatPlayerBadge(name?: string, position?: string | null, team?: string | null): string | null {
  if (!name) return null;
  const meta = [position, team].filter(Boolean).join(" • ");
  return meta ? `${name} (${meta})` : name;
}

function buildWeeklyRegretText(row: FantasySeasonAnalytics["weeklyRecaps"][number]["worstBenchRegret"]): string {
  if (!row) return "—";

  const missedPlayer = formatPlayerBadge(row.missedPlayerName, row.missedPlayerPosition, row.missedPlayerTeam);
  const starter = formatPlayerBadge(row.starterName, row.starterPosition, row.starterTeam);

  if (missedPlayer && starter && row.missedPlayerPoints !== undefined && row.starterPoints !== undefined) {
    return `${formatPoints(row.regretPoints)} points left behind • ${missedPlayer} over ${starter}`;
  }

  if (missedPlayer) {
    return `${formatPoints(row.regretPoints)} points left behind • ${missedPlayer}`;
  }

  return `${formatPoints(row.regretPoints)} points left behind`;
}

type PlayoffBracketTeam = {
  teamId: string;
  seed: number;
  teamName: string;
  record: string;
  pointsFor: number;
  playoffLabel: string;
};

type PlayoffBracketMatchup = {
  id: string;
  top: PlayoffBracketTeam;
  bottom: PlayoffBracketTeam;
  winnerTeamId?: string;
};

type PlayoffBracketModel = {
  wildcard: PlayoffBracketMatchup[];
  semifinals: PlayoffBracketMatchup[];
  championship: PlayoffBracketMatchup;
};

function getBracketStatusCopy(team: PlayoffBracketTeam, isWinner: boolean, isChampion?: boolean): string {
  if (isChampion) return "Trophy secured";
  if (team.playoffLabel === "Runner-up") return "Fell in the final";
  if (isWinner) return "Advanced";
  return "Season ended";
}

function buildPlayoffBracketModel(
  standings: FantasyStanding[],
  teamById: Map<string, FantasyLeagueDataset["teams"][number]>
): PlayoffBracketModel | null {
  const seededTeams = standings
    .filter((standing): standing is FantasyStanding & { playoffSeed: number } => typeof standing.playoffSeed === "number")
    .sort((left, right) => left.playoffSeed - right.playoffSeed);

  if (seededTeams.length !== 6) {
    return null;
  }

  const asBracketTeam = (standing: FantasyStanding & { playoffSeed: number }): PlayoffBracketTeam => {
    const team = teamById.get(standing.teamId);
    return {
      teamId: standing.teamId,
      seed: standing.playoffSeed,
      teamName: getStandingShortName(standing, team?.shortName),
      record: formatStandingRecord(standing),
      pointsFor: standing.pointsFor,
      playoffLabel: getPlayoffResultLabel(standing)
    };
  };

  const seeds = new Map(seededTeams.map((standing) => [standing.playoffSeed, asBracketTeam(standing)] as const));
  const seed1 = seeds.get(1);
  const seed2 = seeds.get(2);
  const seed3 = seeds.get(3);
  const seed4 = seeds.get(4);
  const seed5 = seeds.get(5);
  const seed6 = seeds.get(6);

  if (!seed1 || !seed2 || !seed3 || !seed4 || !seed5 || !seed6) {
    return null;
  }

  const championStanding = seededTeams.find((standing) => standing.finishRank === 1);
  const runnerUpStanding = seededTeams.find((standing) => standing.finishRank === 2);
  if (!championStanding || !runnerUpStanding) {
    return null;
  }

  const wildcardA: PlayoffBracketMatchup = {
    id: "wildcard-a",
    top: seed3,
    bottom: seed6,
    winnerTeamId: championStanding.teamId === seed3.teamId || runnerUpStanding.teamId === seed3.teamId || (seededTeams.find((standing) => standing.teamId === seed3.teamId)?.finishRank ?? 99) < (seededTeams.find((standing) => standing.teamId === seed6.teamId)?.finishRank ?? 99)
      ? seed3.teamId
      : seed6.teamId
  };
  const wildcardB: PlayoffBracketMatchup = {
    id: "wildcard-b",
    top: seed4,
    bottom: seed5,
    winnerTeamId: championStanding.teamId === seed4.teamId || runnerUpStanding.teamId === seed4.teamId || (seededTeams.find((standing) => standing.teamId === seed4.teamId)?.finishRank ?? 99) < (seededTeams.find((standing) => standing.teamId === seed5.teamId)?.finishRank ?? 99)
      ? seed4.teamId
      : seed5.teamId
  };

  const wildcardWinners = [wildcardA, wildcardB]
    .map((matchup) => [matchup.top, matchup.bottom].find((team) => team.teamId === matchup.winnerTeamId))
    .filter((team): team is PlayoffBracketTeam => Boolean(team))
    .sort((left, right) => right.seed - left.seed);

  if (wildcardWinners.length !== 2) {
    return null;
  }

  const semifinalA: PlayoffBracketMatchup = {
    id: "semifinal-a",
    top: seed1,
    bottom: wildcardWinners[0],
    winnerTeamId:
      [seed1.teamId, wildcardWinners[0].teamId].includes(championStanding.teamId)
        ? championStanding.teamId
        : runnerUpStanding.teamId
  };
  const semifinalB: PlayoffBracketMatchup = {
    id: "semifinal-b",
    top: seed2,
    bottom: wildcardWinners[1],
    winnerTeamId:
      [seed2.teamId, wildcardWinners[1].teamId].includes(championStanding.teamId)
        ? championStanding.teamId
        : runnerUpStanding.teamId
  };

  const champion = asBracketTeam(championStanding);
  const runnerUp = asBracketTeam(runnerUpStanding);

  const championship: PlayoffBracketMatchup = {
    id: "championship",
    top: champion.seed < runnerUp.seed ? champion : runnerUp,
    bottom: champion.seed < runnerUp.seed ? runnerUp : champion,
    winnerTeamId: champion.teamId
  };

  return {
    wildcard: [wildcardA, wildcardB],
    semifinals: [semifinalA, semifinalB],
    championship
  };
}

function BracketTeamRow({
  team,
  isWinner,
  isChampion
}: {
  team: PlayoffBracketTeam;
  isWinner: boolean;
  isChampion?: boolean;
}) {
  return (
    <div
      className={`rounded-[22px] border px-3 py-3 transition-colors ${
        isChampion
          ? "border-emerald-400/40 bg-[linear-gradient(135deg,rgba(16,185,129,0.2),rgba(132,204,22,0.08))] shadow-[0_0_0_1px_rgba(52,211,153,0.12)]"
          : isWinner
            ? "border-primary-400/35 bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(56,189,248,0.08))]"
            : "border-line/70 bg-card/75"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">Seed {team.seed}</p>
          <p className="mt-1 text-sm font-semibold text-fg">{team.teamName}</p>
          <p className="text-xs text-fg-secondary">{team.record} • {formatPoints(team.pointsFor)} PF</p>
          <p className={`mt-2 text-[11px] font-medium ${isChampion ? "text-emerald-100" : isWinner ? "text-primary-100" : "text-muted"}`}>
            {getBracketStatusCopy(team, isWinner, isChampion)}
          </p>
        </div>
        <span className={`inline-flex shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getPlayoffTone(team.playoffLabel)}`}>
          {team.playoffLabel === "Champion" ? "Champ" : team.playoffLabel === "Runner-up" ? "Finalist" : isWinner ? "Advanced" : "Out"}
        </span>
      </div>
    </div>
  );
}

function BracketConnector({
  direction = "down"
}: {
  direction?: "down" | "right";
}) {
  if (direction === "right") {
    return (
      <div className="pointer-events-none hidden xl:flex items-center justify-center py-2">
        <div className="h-px w-8 bg-gradient-to-r from-line/30 via-primary-300/60 to-line/30" />
        <div className="-ml-1 h-2.5 w-2.5 rotate-45 border-r border-t border-primary-300/70" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-1.5 xl:hidden">
      <div className="flex flex-col items-center gap-1">
        <div className="h-6 w-px bg-gradient-to-b from-line/20 via-primary-300/60 to-line/20" />
        <div className="h-2.5 w-2.5 rotate-45 border-b border-r border-primary-300/70" />
      </div>
    </div>
  );
}

function BracketMatchupCard({
  title,
  matchup,
  showConnector = true
}: {
  title: string;
  matchup: PlayoffBracketMatchup;
  showConnector?: boolean;
}) {
  return (
    <div className="relative rounded-[28px] border border-line/70 bg-card-2/80 p-4 shadow-[0_12px_30px_rgba(2,6,23,0.18)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary-200">{title}</p>
      <div className="mt-3 space-y-3">
        <BracketTeamRow team={matchup.top} isWinner={matchup.top.teamId === matchup.winnerTeamId} isChampion={matchup.top.teamId === matchup.winnerTeamId && matchup.id === "championship"} />
        <div className="mx-3 border-t border-dashed border-line/70" />
        <BracketTeamRow team={matchup.bottom} isWinner={matchup.bottom.teamId === matchup.winnerTeamId} isChampion={matchup.bottom.teamId === matchup.winnerTeamId && matchup.id === "championship"} />
      </div>
      {showConnector ? <div className="pointer-events-none absolute -right-10 top-1/2 hidden -translate-y-1/2 xl:block"><BracketConnector direction="right" /></div> : null}
    </div>
  );
}

function BracketRoundCard({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[30px] border border-line/70 bg-card/88 p-4 backdrop-blur sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">{title}</p>
          {subtitle ? <p className="mt-1 text-sm text-fg-secondary">{subtitle}</p> : null}
        </div>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function ChampionBracketCard({ matchup }: { matchup: PlayoffBracketMatchup }) {
  const champion = matchup.top.teamId === matchup.winnerTeamId ? matchup.top : matchup.bottom;
  const runnerUp = matchup.top.teamId === matchup.winnerTeamId ? matchup.bottom : matchup.top;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-emerald-400/30 bg-[radial-gradient(circle_at_top,rgba(253,224,71,0.22),transparent_30%),linear-gradient(145deg,rgba(6,78,59,0.92),rgba(6,11,32,0.96))] p-5 shadow-[0_24px_80px_rgba(6,78,59,0.28)]">
      <div className="absolute right-4 top-4 rounded-full border border-emerald-200/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-50">
        Champion
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-100/80">Championship</p>
      <h3 className="mt-3 font-display text-3xl text-white sm:text-[2.4rem]">{champion.teamName}</h3>
      <p className="mt-2 text-sm text-emerald-50/85">
        Closed out the bracket from Seed {champion.seed}, finishing ahead of {runnerUp.teamName}.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[24px] border border-white/10 bg-white/10 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100/70">Winner</p>
          <p className="mt-1 text-base font-semibold text-white">{champion.teamName}</p>
          <p className="text-xs text-emerald-50/80">{champion.record} • {formatPoints(champion.pointsFor)} PF</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-black/10 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100/70">Finalist</p>
          <p className="mt-1 text-base font-semibold text-white">{runnerUp.teamName}</p>
          <p className="text-xs text-emerald-50/80">{runnerUp.record} • {formatPoints(runnerUp.pointsFor)} PF</p>
        </div>
      </div>
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-line/70 bg-card-2/90 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">{label}</p>
      <p className="mt-1 text-base font-semibold text-fg">{value}</p>
    </div>
  );
}

export function FantasySeasonRecapView({
  data,
  recap,
  analytics
}: {
  data: FantasyLeagueDataset;
  recap: FantasySeasonRecap;
  analytics: FantasySeasonAnalytics;
}) {
  const teamById = new Map(data.teams.map((team) => [team.id, team]));
  const managerById = new Map(data.members.map((member) => [member.id, member]));
  const recapYears = data.seasonRecaps.map((entry) => entry.season.year);
  const selectedYear = recap.season.year;

  const championTeam = teamById.get(recap.season.summary.championTeamId);
  const runnerUpTeam = teamById.get(recap.season.summary.runnerUpTeamId);
  const regularSeasonWinner = teamById.get(recap.season.summary.regularSeasonWinnerTeamId);
  const highestScorer = teamById.get(recap.season.summary.highestScoringTeamId);
  const worstRecordTeam = teamById.get(recap.season.summary.worstRecordTeamId);

  const championshipMatchup = [...recap.season.matchups]
    .filter(
      (matchup) =>
        matchup.status === "final" &&
        [matchup.homeTeamId, matchup.awayTeamId].includes(recap.season.summary.championTeamId) &&
        [matchup.homeTeamId, matchup.awayTeamId].includes(recap.season.summary.runnerUpTeamId)
    )
    .sort((left, right) => right.week - left.week)[0];

  const approvedTrades = recap.trades.filter((trade) => (trade.status ?? "completed") === "successful");
  const vetoedTrades = recap.trades.filter((trade) => trade.status === "vetoed");
  const pendingTrades = recap.trades.filter(
    (trade) => trade.status && trade.status !== "successful" && trade.status !== "vetoed"
  );

  const tradeActivity = Array.from(
    recap.trades.reduce((map, trade) => {
      const leftName = trade.trader.teamName ?? "League team";
      const rightName = trade.tradee.teamName ?? "League team";
      map.set(leftName, (map.get(leftName) ?? 0) + 1);
      map.set(rightName, (map.get(rightName) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
  ).sort((left, right) => right[1] - left[1]);

  const teamColor = championTeam?.colors.primary ?? "#7c3aed";
  const latestPowerWeek = analytics.powerRankings[analytics.powerRankings.length - 1]?.week ?? analytics.regularSeasonWeeks;
  const latestRecapWeek = analytics.weeklyRecaps[analytics.weeklyRecaps.length - 1]?.week ?? analytics.totalWeeksTracked;
  const latestOddsWeek = analytics.playoffOddsCheckpoints[analytics.playoffOddsCheckpoints.length - 1]?.week ?? analytics.regularSeasonWeeks;

  const [selectedPowerWeek, setSelectedPowerWeek] = useState(latestPowerWeek);
  const [selectedRecapWeek, setSelectedRecapWeek] = useState(latestRecapWeek);
  const [selectedOddsWeek, setSelectedOddsWeek] = useState(latestOddsWeek);

  const selectedPowerRanking = getSelectedByWeek(analytics.powerRankings, selectedPowerWeek);
  const selectedWeeklyRecap = getSelectedByWeek(analytics.weeklyRecaps, selectedRecapWeek);
  const selectedOddsCheckpoint = getSelectedByWeek(analytics.playoffOddsCheckpoints, selectedOddsWeek);

  const luckLeader = analytics.allPlayTable[0];
  const luckVictim = [...analytics.allPlayTable].sort((left, right) => left.luckDeltaWins - right.luckDeltaWins)[0];
  const efficiencyLeader = [...analytics.lineupEfficiencyTable].sort((left, right) => right.efficiency - left.efficiency)[0];
  const worstEfficiency = analytics.lineupEfficiencyTable[0];
  const latestPowerLeader = selectedPowerRanking?.rows[0];
  const playoffBracket = buildPlayoffBracketModel(recap.season.standings, teamById);

  return (
    <div className="bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.16),_transparent_45%),linear-gradient(180deg,#060816_0%,#0b1120_32%,#050915_100%)] text-fg">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-line/70 bg-card/85 px-5 py-4 backdrop-blur md:px-6">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary-200">Season recap</p>
            <h1 className="font-display text-3xl text-fg sm:text-4xl">{selectedYear} league almanac</h1>
            <p className="max-w-2xl text-sm text-fg-secondary sm:text-base">
              The title chase, draft hits, trade drama, all-play luck, power swings, and lineup decisions from the {selectedYear} New Uzbek Mafia season.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/fantasy/" className="rounded-full border border-line/70 bg-card-2/90 px-4 py-2 text-sm font-semibold text-fg transition hover:border-primary-300/40 hover:text-primary-100">
              Back to hub
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              {recapYears.map((year) => (
                <Link
                  key={year}
                  href={`/fantasy/seasons/${year}/`}
                  className={
                    year === selectedYear
                      ? "rounded-full border border-primary-400/40 bg-primary-500/18 px-3 py-1.5 text-xs font-semibold text-primary-100"
                      : "rounded-full border border-line/70 bg-card-2/90 px-3 py-1.5 text-xs font-semibold text-fg-secondary transition hover:border-primary-300/35 hover:text-fg"
                  }
                >
                  {year}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <section className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
          <div className="overflow-hidden rounded-[32px] border border-line/70 bg-card/88 backdrop-blur">
            <div className="border-b border-line/70 px-6 py-5" style={{ boxShadow: `inset 0 4px 0 ${teamColor}` }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary-200">Title picture</p>
              <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl text-fg sm:text-[2.6rem]">{championTeam?.teamName ?? recap.season.summary.championDisplayName ?? "Champion"}</h2>
                  <p className="mt-1 text-sm text-fg-secondary">
                    Beat {runnerUpTeam?.teamName ?? recap.season.summary.runnerUpDisplayName ?? "the runner-up"}
                    {championshipMatchup
                      ? ` ${formatPoints(
                          championshipMatchup.homeTeamId === recap.season.summary.championTeamId
                            ? championshipMatchup.homeScore
                            : championshipMatchup.awayScore
                        )}-${formatPoints(
                          championshipMatchup.homeTeamId === recap.season.summary.runnerUpTeamId
                            ? championshipMatchup.homeScore
                            : championshipMatchup.awayScore
                        )}`
                      : " to close the season on top"}
                    .
                  </p>
                </div>
                <div className="rounded-3xl border border-primary-400/25 bg-primary-500/12 px-4 py-3 text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary-200">Draft room leader</p>
                  <p className="mt-1 text-base font-semibold text-fg">{recap.draftRoomLeader?.teamName ?? "No grade posted"}</p>
                  <p className="text-sm text-fg-secondary">
                    {recap.draftRoomLeader?.draftGrade
                      ? `${recap.draftRoomLeader.draftGrade} grade`
                      : recap.draftRoomLeader?.draftRank
                        ? `Draft rank ${recap.draftRoomLeader.draftRank}`
                        : "No draft grade in the ledger"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 px-6 py-5 sm:grid-cols-2 xl:grid-cols-4">
              <MetricPill label="Regular season winner" value={regularSeasonWinner?.teamName ?? recap.season.summary.regularSeasonWinnerDisplayName ?? "No leader posted"} />
              <MetricPill label="Highest scorer" value={highestScorer?.teamName ?? recap.season.summary.highestScoringTeamDisplayName ?? "No scorer posted"} />
              <MetricPill label="Luckiest break" value={luckLeader ? `${luckLeader.teamName} ${formatSignedValue(luckLeader.luckDeltaWins)} wins` : "No luck data"} />
              <MetricPill label="Best lineup efficiency" value={efficiencyLeader ? `${efficiencyLeader.teamName} ${formatPercentage(efficiencyLeader.efficiency)}` : "No lineup data"} />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-line/70 bg-card/88 p-5 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">Storylines</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-3xl border border-line/70 bg-card-2/90 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted">Power board</p>
                  <p className="mt-1 text-base font-semibold text-fg">{latestPowerLeader?.teamName ?? "No ranking yet"}</p>
                  <p className="text-sm text-fg-secondary">{buildPowerNarrative(latestPowerLeader)}</p>
                </div>
                <div className="rounded-3xl border border-line/70 bg-card-2/90 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted">Luck report</p>
                  <p className="mt-1 text-base font-semibold text-fg">{luckVictim?.teamName ?? "No luck read"}</p>
                  <p className="text-sm text-fg-secondary">{buildLuckNarrative(luckVictim)}</p>
                </div>
                <div className="rounded-3xl border border-line/70 bg-card-2/90 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted">Lineup lab</p>
                  <p className="mt-1 text-base font-semibold text-fg">{worstEfficiency?.teamName ?? "No lineup data"}</p>
                  <p className="text-sm text-fg-secondary">{buildEfficiencyNarrative(worstEfficiency)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-line/70 bg-card/88 p-5 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">Trade desk</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-line/70 bg-card-2/90 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">Approved</p>
                  <p className="mt-1 text-xl font-semibold text-fg">{approvedTrades.length}</p>
                </div>
                <div className="rounded-3xl border border-line/70 bg-card-2/90 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">Vetoed</p>
                  <p className="mt-1 text-xl font-semibold text-fg">{vetoedTrades.length}</p>
                </div>
                <div className="rounded-3xl border border-line/70 bg-card-2/90 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">Still weird</p>
                  <p className="mt-1 text-xl font-semibold text-fg">{pendingTrades.length}</p>
                </div>
              </div>
              {tradeActivity[0] ? (
                <p className="mt-4 text-sm text-fg-secondary">
                  Most active front office: <span className="font-semibold text-fg">{tradeActivity[0][0]}</span> with {tradeActivity[0][1]} logged trade{tradeActivity[0][1] === 1 ? "" : "s"}.
                </p>
              ) : (
                <p className="mt-4 text-sm text-fg-secondary">Nobody found the trade machine that year.</p>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr]">
          <div className="rounded-[32px] border border-line/70 bg-card/88 backdrop-blur">
            <div className="border-b border-line/70 px-6 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">Final standings</p>
              <h2 className="mt-2 font-display text-2xl text-fg">How the table finished</h2>
            </div>
            <div className="grid gap-3 p-4 md:hidden">
              {recap.season.standings.map((standing) => {
                const team = teamById.get(standing.teamId);
                const playoffLabel = getPlayoffResultLabel(standing);
                return (
                  <div key={standing.teamId} className="rounded-[24px] border border-line/70 bg-card-2/90 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">Rank {standing.rank}</p>
                        <p className="mt-1 text-base font-semibold text-fg">{getStandingName(standing, team?.teamName)}</p>
                        {team ? <p className="text-xs text-muted">{managerById.get(team.memberId)?.managerName ?? "Manager"}</p> : null}
                      </div>
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getPlayoffTone(playoffLabel)}`}>{playoffLabel}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-line/60 bg-card/70 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Record</p>
                        <p className="mt-1 text-sm font-semibold text-fg">{formatStandingRecord(standing)}</p>
                      </div>
                      <div className="rounded-2xl border border-line/60 bg-card/70 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Points</p>
                        <p className="mt-1 text-sm font-semibold text-fg">{formatPoints(standing.pointsFor)} PF</p>
                        <p className="text-[11px] text-muted">PA {formatPoints(standing.pointsAgainst)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-sm">
                <thead className="bg-card-2/90 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Team</th>
                    <th className="px-4 py-3">Record</th>
                    <th className="px-4 py-3">Points</th>
                    <th className="px-4 py-3">Playoffs</th>
                  </tr>
                </thead>
                <tbody>
                  {recap.season.standings.map((standing) => {
                    const team = teamById.get(standing.teamId);
                    const playoffLabel = getPlayoffResultLabel(standing);
                    return (
                      <tr key={standing.teamId} className="border-t border-line/70 text-fg-secondary">
                        <td className="px-4 py-3 text-base font-semibold text-fg">{standing.rank}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-semibold text-fg">{getStandingName(standing, team?.teamName)}</p>
                            {team ? <p className="text-xs text-muted">{managerById.get(team.memberId)?.managerName ?? "Manager"}</p> : null}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-fg">{formatStandingRecord(standing)}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-fg">{formatPoints(standing.pointsFor)}</div>
                          <div className="text-xs text-muted">PA {formatPoints(standing.pointsAgainst)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getPlayoffTone(playoffLabel)}`}>{playoffLabel}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[32px] border border-line/70 bg-card/88 backdrop-blur">
              <div className="border-b border-line/70 px-6 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">Season notes</p>
                <h2 className="mt-2 font-display text-2xl text-fg">The quick read</h2>
              </div>
              <div className="space-y-3 px-6 py-5 text-sm text-fg-secondary">
                {recap.season.seasonNotes.map((note) => (
                  <div key={note} className="rounded-3xl border border-line/70 bg-card-2/90 px-4 py-3">
                    {note}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-line/70 bg-card/88 backdrop-blur">
              <div className="border-b border-line/70 px-6 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">Draft market check</p>
                <h2 className="mt-2 font-display text-2xl text-fg">Steals and reaches</h2>
              </div>
              <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">Best steals</p>
                  <div className="mt-3 space-y-2">
                    {recap.topSteals.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="rounded-3xl border border-line/70 bg-card-2/90 px-4 py-3 text-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-fg">{entry.playerName}</p>
                            <p className="text-xs text-muted">{entry.teamName} • R{entry.round} • Pick {entry.overallPick}</p>
                          </div>
                          <span className={`font-semibold ${getDraftValueTone(entry.value)}`}>{formatSignedValue(entry.value)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-200">Biggest reaches</p>
                  <div className="mt-3 space-y-2">
                    {recap.topReaches.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="rounded-3xl border border-line/70 bg-card-2/90 px-4 py-3 text-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-fg">{entry.playerName}</p>
                            <p className="text-xs text-muted">{entry.teamName} • R{entry.round} • Pick {entry.overallPick}</p>
                          </div>
                          <span className={`font-semibold ${getDraftValueTone(entry.value)}`}>{formatSignedValue(entry.value)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-line/70 bg-card/88 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 px-6 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">All-play and schedule luck</p>
                <h2 className="mt-2 font-display text-2xl text-fg">Who was legit, and who caught a break</h2>
              </div>
              <span className="rounded-full border border-line/70 bg-card-2/85 px-3 py-1 text-xs font-semibold text-fg-secondary">
                Regular season only
              </span>
            </div>
            <div className="grid gap-3 p-4 md:hidden">
              {analytics.allPlayTable.map((row) => (
                <div key={row.teamId} className="rounded-[24px] border border-line/70 bg-card-2/90 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-fg">{row.teamName}</p>
                      <p className="text-xs text-muted">{row.managerName}</p>
                    </div>
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${row.luckDeltaWins >= 0 ? "border-emerald-400/35 bg-emerald-500/12 text-emerald-200" : "border-rose-400/35 bg-rose-500/12 text-rose-200"}`}>
                      {formatSignedValue(row.luckDeltaWins)} luck
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-line/60 bg-card/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Actual</p>
                      <p className="mt-1 text-sm font-semibold text-fg">
                        {row.actualWins}-{row.actualLosses}
                        {row.actualTies ? `-${row.actualTies}` : ""}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-line/60 bg-card/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">All-play</p>
                      <p className="mt-1 text-sm font-semibold text-fg">
                        {row.allPlayWins}-{row.allPlayLosses}
                        {row.allPlayTies ? `-${row.allPlayTies}` : ""}
                      </p>
                      <p className="text-[11px] text-muted">{formatPercentage(row.allPlayWinPct)}</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl border border-line/60 bg-card/70 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Average score</p>
                      <p className="text-sm font-semibold text-fg">{formatPoints(row.averageScore)}</p>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-card-2/90">
                      <div
                        className={`h-full ${getLuckBarClass(row.luckDeltaWins)}`}
                        style={{ width: `${clampPercent(Math.abs(row.luckDeltaWins) * 16 + 8)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-sm">
                <thead className="bg-card-2/90 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                  <tr>
                    <th className="px-4 py-3">Team</th>
                    <th className="px-4 py-3">Actual</th>
                    <th className="px-4 py-3">All-play</th>
                    <th className="px-4 py-3">Luck</th>
                    <th className="px-4 py-3">Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.allPlayTable.map((row) => (
                    <tr key={row.teamId} className="border-t border-line/70 align-top text-fg-secondary">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-fg">{row.teamName}</p>
                        <p className="text-xs text-muted">{row.managerName}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-fg">{row.actualWins}-{row.actualLosses}{row.actualTies ? `-${row.actualTies}` : ""}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-fg">{row.allPlayWins}-{row.allPlayLosses}{row.allPlayTies ? `-${row.allPlayTies}` : ""}</div>
                        <div className="text-xs text-muted">{formatPercentage(row.allPlayWinPct)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-card-2/90">
                            <div
                              className={`h-full ${getLuckBarClass(row.luckDeltaWins)}`}
                              style={{ width: `${clampPercent(Math.abs(row.luckDeltaWins) * 16 + 8)}%` }}
                            />
                          </div>
                          <span className={`font-semibold ${row.luckDeltaWins >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{formatSignedValue(row.luckDeltaWins)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-fg">{formatPoints(row.averageScore)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[32px] border border-line/70 bg-card/88 p-5 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">Luck board</p>
              <div className="mt-4 space-y-3">
                {[luckLeader, luckVictim].filter(Boolean).map((row, index) => (
                  <div key={row?.teamId ?? index} className="rounded-3xl border border-line/70 bg-card-2/90 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">{index === 0 ? "Best run" : "Toughest run"}</p>
                    <p className="mt-1 text-base font-semibold text-fg">{row?.teamName}</p>
                    <p className="text-sm text-fg-secondary">{row?.managerName}</p>
                    <p className={`mt-2 text-sm font-semibold ${row && row.luckDeltaWins >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{row ? `${formatSignedValue(row.luckDeltaWins)} wins versus expectation` : "No luck data"}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-line/70 bg-card/88 p-5 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">Power finish</p>
              <div className="mt-4 space-y-3">
                {(selectedPowerRanking?.rows.slice(0, 3) ?? []).map((row) => (
                  <div key={row.teamId} className="flex items-center justify-between gap-3 rounded-3xl border border-line/70 bg-card-2/90 px-4 py-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">Rank {row.rank}</p>
                      <p className="text-base font-semibold text-fg">{row.teamName}</p>
                      <p className="text-sm text-fg-secondary">{row.record} • {row.managerName}</p>
                    </div>
                    <p className="text-lg font-semibold text-fg">{row.powerScore.toFixed(1)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] border border-line/70 bg-card/88 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 px-6 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">Retro playoff odds</p>
                <h2 className="mt-2 font-display text-2xl text-fg">What the room looked like in the moment</h2>
              </div>
              <label className="flex items-center gap-2 text-sm text-fg-secondary">
                <span>Checkpoint</span>
                <select
                  value={selectedOddsWeek}
                  onChange={(event) => setSelectedOddsWeek(Number(event.target.value))}
                  className="rounded-full border border-line/70 bg-card-2/90 px-3 py-2 text-sm text-fg outline-none transition focus:border-primary-300/40"
                >
                  {analytics.playoffOddsCheckpoints.map((checkpoint) => (
                    <option key={checkpoint.week} value={checkpoint.week}>{checkpoint.label}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-3 p-4 md:hidden">
              {(selectedOddsCheckpoint?.rows ?? []).map((row) => (
                <div key={row.teamId} className="rounded-[24px] border border-line/70 bg-card-2/90 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-fg">{row.teamName}</p>
                      <p className="text-xs text-muted">{row.managerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-fg">
                        {row.wins}-{row.losses}
                        {row.ties ? `-${row.ties}` : ""}
                      </p>
                      <p className="text-[11px] text-muted">{formatPoints(row.pointsFor)} PF</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="mb-1 flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                        <span>Playoffs</span>
                        <span>{formatPercentage(row.playoffOdds)}</span>
                      </div>
                      <OddsBar value={row.playoffOdds} label="playoff" />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                        <span>Bye</span>
                        <span>{formatPercentage(row.byeOdds)}</span>
                      </div>
                      <OddsBar value={row.byeOdds} label="bye" />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                        <span>Title</span>
                        <span>{formatPercentage(row.titleOdds)}</span>
                      </div>
                      <OddsBar value={row.titleOdds} label="title" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-sm">
                <thead className="bg-card-2/90 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                  <tr>
                    <th className="px-4 py-3">Team</th>
                    <th className="px-4 py-3">Record</th>
                    <th className="px-4 py-3">Playoffs</th>
                    <th className="px-4 py-3">Bye</th>
                    <th className="px-4 py-3">Title</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOddsCheckpoint?.rows ?? []).map((row) => (
                    <tr key={row.teamId} className="border-t border-line/70 align-top text-fg-secondary">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-fg">{row.teamName}</p>
                        <p className="text-xs text-muted">{row.managerName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-fg">{row.wins}-{row.losses}{row.ties ? `-${row.ties}` : ""}</div>
                        <div className="text-xs text-muted">{formatPoints(row.pointsFor)} PF</div>
                      </td>
                      <td className="px-4 py-3"><OddsBar value={row.playoffOdds} label="playoff" /></td>
                      <td className="px-4 py-3"><OddsBar value={row.byeOdds} label="bye" /></td>
                      <td className="px-4 py-3"><OddsBar value={row.titleOdds} label="title" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[32px] border border-line/70 bg-card/88 p-5 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">How to read it</p>
            <div className="mt-4 space-y-3 text-sm text-fg-secondary">
              <div className="rounded-3xl border border-line/70 bg-card-2/90 px-4 py-3">
                Odds freeze the season after the selected week, then replay the remaining regular season and playoffs using each team’s score profile to that point.
              </div>
              <div className="rounded-3xl border border-line/70 bg-card-2/90 px-4 py-3">
                That makes this a fair "what did it look like then?" view instead of a hindsight table pretending everyone knew the ending.
              </div>
              <div className="rounded-3xl border border-line/70 bg-card-2/90 px-4 py-3">
                Higher bye odds matter most in six-team playoff years, where the top two seeds get to skip the first round and save themselves some stress.
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] border border-line/70 bg-card/88 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 px-6 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">Power rankings</p>
                <h2 className="mt-2 font-display text-2xl text-fg">Weekly pecking order</h2>
              </div>
              <label className="flex items-center gap-2 text-sm text-fg-secondary">
                <span>Week</span>
                <select
                  value={selectedPowerWeek}
                  onChange={(event) => setSelectedPowerWeek(Number(event.target.value))}
                  className="rounded-full border border-line/70 bg-card-2/90 px-3 py-2 text-sm text-fg outline-none transition focus:border-primary-300/40"
                >
                  {analytics.powerRankings.map((ranking) => (
                    <option key={ranking.week} value={ranking.week}>{ranking.label}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-3 p-4 md:hidden">
              {(selectedPowerRanking?.rows ?? []).map((row) => (
                <div key={row.teamId} className="rounded-[24px] border border-line/70 bg-card-2/90 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">Rank {row.rank}</p>
                      <p className="mt-1 text-base font-semibold text-fg">{row.teamName}</p>
                      <p className="text-xs text-muted">{row.record} • {row.managerName}</p>
                    </div>
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getTrendBadgeClass(row.trend)}`}>
                      {getTrendLabel(row.trend)}
                    </span>
                  </div>
                  <div className="mt-4 rounded-2xl border border-line/60 bg-card/70 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Power score</p>
                      <p className="text-sm font-semibold text-fg">{row.powerScore.toFixed(1)}</p>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-card-2/90">
                      <div className="h-full bg-gradient-to-r from-sky-500 via-violet-500 to-emerald-400" style={{ width: `${clampPercent(row.powerScore)}%` }} />
                    </div>
                    <p className="mt-2 text-[11px] text-muted">{formatPoints(row.averageScore)} PPG • {formatPercentage(row.allPlayWinPct)} all-play</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-sm">
                <thead className="bg-card-2/90 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Team</th>
                    <th className="px-4 py-3">Power</th>
                    <th className="px-4 py-3">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedPowerRanking?.rows ?? []).map((row) => (
                    <tr key={row.teamId} className="border-t border-line/70 align-top text-fg-secondary">
                      <td className="px-4 py-3 text-base font-semibold text-fg">{row.rank}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-fg">{row.teamName}</p>
                        <p className="text-xs text-muted">{row.record} • {row.managerName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-card-2/90">
                            <div className="h-full bg-gradient-to-r from-sky-500 via-violet-500 to-emerald-400" style={{ width: `${clampPercent(row.powerScore)}%` }} />
                          </div>
                          <span className="font-semibold text-fg">{row.powerScore.toFixed(1)}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted">{formatPoints(row.averageScore)} PPG • {formatPercentage(row.allPlayWinPct)} all-play</p>
                      </td>
                      <td className={`px-4 py-3 font-semibold ${getTrendClass(row.trend)}`}>{getTrendLabel(row.trend)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[32px] border border-line/70 bg-card/88 p-5 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">Podium pulse</p>
            <div className="mt-4 space-y-3">
              {(selectedPowerRanking?.rows.slice(0, 3) ?? []).map((row) => (
                <div key={row.teamId} className="rounded-3xl border border-line/70 bg-card-2/90 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">Rank {row.rank}</p>
                      <p className="text-base font-semibold text-fg">{row.teamName}</p>
                      <p className="text-sm text-fg-secondary">{row.managerName}</p>
                    </div>
                    <p className="text-lg font-semibold text-fg">{row.powerScore.toFixed(1)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] border border-line/70 bg-card/88 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 px-6 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">Weekly recaps</p>
                <h2 className="mt-2 font-display text-2xl text-fg">One week, one story</h2>
              </div>
              <label className="flex items-center gap-2 text-sm text-fg-secondary">
                <span>Week</span>
                <select
                  value={selectedRecapWeek}
                  onChange={(event) => setSelectedRecapWeek(Number(event.target.value))}
                  className="rounded-full border border-line/70 bg-card-2/90 px-3 py-2 text-sm text-fg outline-none transition focus:border-primary-300/40"
                >
                  {analytics.weeklyRecaps.map((entry) => (
                    <option key={entry.week} value={entry.week}>{entry.label}</option>
                  ))}
                </select>
              </label>
            </div>
            {selectedWeeklyRecap ? (
              <div className="space-y-4 px-6 py-5">
                <div className="rounded-[28px] border border-line/70 bg-card-2/90 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary-200">{selectedWeeklyRecap.label}</p>
                  <h3 className="mt-2 font-display text-2xl text-fg">{selectedWeeklyRecap.headline}</h3>
                  <p className="mt-3 text-sm leading-6 text-fg-secondary">{selectedWeeklyRecap.summary}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <StatCard label="Top scorer" title={selectedWeeklyRecap.topScorer.teamName} detail={`${selectedWeeklyRecap.topScorer.managerName} • ${formatPoints(selectedWeeklyRecap.topScorer.score)} pts`} />
                  <StatCard
                    label="Closest sweat"
                    title={selectedWeeklyRecap.closestMatchup ? `${selectedWeeklyRecap.closestMatchup.leftTeamName} vs ${selectedWeeklyRecap.closestMatchup.rightTeamName}` : "No matchup"}
                    detail={selectedWeeklyRecap.closestMatchup ? `${selectedWeeklyRecap.closestMatchup.margin.toFixed(1)} points apart` : "—"}
                  />
                  <StatCard
                    label="Bench regret"
                    title={selectedWeeklyRecap.worstBenchRegret?.teamName ?? "No miss logged"}
                    detail={buildWeeklyRegretText(selectedWeeklyRecap.worstBenchRegret)}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-[32px] border border-line/70 bg-card/88 p-5 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">Power podium that week</p>
            <div className="mt-4 space-y-3">
              {(selectedWeeklyRecap?.powerPodium ?? []).map((row) => (
                <div key={row.teamId} className="rounded-3xl border border-line/70 bg-card-2/90 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">Rank {row.rank}</p>
                      <p className="text-base font-semibold text-fg">{row.teamName}</p>
                      <p className="text-sm text-fg-secondary">{row.managerName}</p>
                    </div>
                    <p className="text-lg font-semibold text-fg">{row.powerScore.toFixed(1)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] border border-line/70 bg-card/88 backdrop-blur">
            <div className="border-b border-line/70 px-6 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">Lineup efficiency and start-sit regret</p>
              <h2 className="mt-2 font-display text-2xl text-fg">How much meat stayed on the bone</h2>
              <p className="mt-2 text-sm text-fg-secondary">
                Weekly lineup cards compare what actually started to the best legal version of that same roster, then call out the player decisions that hurt the most.
              </p>
            </div>
            <div className="grid gap-3 p-4 md:hidden">
              {analytics.lineupEfficiencyTable.map((row) => (
                <div key={row.teamId} className="rounded-[24px] border border-line/70 bg-card-2/90 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-fg">{row.teamName}</p>
                      <p className="text-xs text-muted">{row.managerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-fg">{formatPercentage(row.efficiency)}</p>
                      <p className="text-[11px] text-muted">Coach {row.coachScore.toFixed(1)}</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-card/80">
                    <div className={`h-full ${getEfficiencyBarClass(row.efficiency)}`} style={{ width: `${clampPercent(row.efficiency * 100)}%` }} />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-line/60 bg-card/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Regret</p>
                      <p className="mt-1 text-sm font-semibold text-fg">{formatPoints(row.regretPoints)} pts</p>
                      <p className="text-[11px] text-muted">{formatPoints(row.averageRegret)} weekly</p>
                    </div>
                    <div className="rounded-2xl border border-line/60 bg-card/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Worst week</p>
                      <p className="mt-1 text-sm font-semibold text-fg">Week {row.biggestMissWeek}</p>
                      <p className="text-[11px] text-muted">{formatPoints(row.biggestMissPoints)} points missed</p>
                    </div>
                  </div>
                  {row.biggestMissDetail?.missedPlayerName ? (
                    <div className="mt-4 rounded-2xl border border-primary-400/20 bg-primary-500/8 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-200">Biggest bench sting</p>
                      <p className="mt-1 text-sm font-semibold text-fg">
                        {formatPlayerBadge(
                          row.biggestMissDetail.missedPlayerName,
                          row.biggestMissDetail.missedPlayerPosition,
                          row.biggestMissDetail.missedPlayerTeam
                        )}
                      </p>
                      {row.biggestMissDetail?.starterName ? (
                        <p className="mt-1 text-[11px] text-fg-secondary">
                          Started over{" "}
                          {formatPlayerBadge(
                            row.biggestMissDetail.starterName,
                            row.biggestMissDetail.starterPosition,
                            row.biggestMissDetail.starterTeam
                          )}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-sm">
                <thead className="bg-card-2/90 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                  <tr>
                    <th className="px-4 py-3">Team</th>
                    <th className="px-4 py-3">Efficiency</th>
                    <th className="px-4 py-3">Regret</th>
                    <th className="px-4 py-3">Worst miss</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.lineupEfficiencyTable.map((row) => (
                    <tr key={row.teamId} className="border-t border-line/70 align-top text-fg-secondary">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-fg">{row.teamName}</p>
                        <p className="text-xs text-muted">{row.managerName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-card-2/90">
                            <div className={`h-full ${getEfficiencyBarClass(row.efficiency)}`} style={{ width: `${clampPercent(row.efficiency * 100)}%` }} />
                          </div>
                          <span className="font-semibold text-fg">{formatPercentage(row.efficiency)}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted">Coach score {row.coachScore.toFixed(1)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-fg">{formatPoints(row.regretPoints)} pts</div>
                        <div className="text-xs text-muted">{formatPoints(row.averageRegret)} per week</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-fg">Week {row.biggestMissWeek}</div>
                        <div className="text-xs text-muted">{formatPoints(row.biggestMissPoints)} points missed</div>
                        {row.biggestMissDetail?.missedPlayerName ? (
                          <div className="mt-2 text-xs text-primary-100">
                            {formatPlayerBadge(
                              row.biggestMissDetail.missedPlayerName,
                              row.biggestMissDetail.missedPlayerPosition,
                              row.biggestMissDetail.missedPlayerTeam
                            )}
                          </div>
                        ) : null}
                        {row.biggestMissDetail?.starterName ? (
                          <div className="mt-1 text-[11px] text-muted">
                            Started over{" "}
                            {formatPlayerBadge(
                              row.biggestMissDetail.starterName,
                              row.biggestMissDetail.starterPosition,
                              row.biggestMissDetail.starterTeam
                            )}
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[32px] border border-line/70 bg-card/88 p-5 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">Cleanest coaching</p>
              <div className="mt-4 space-y-3">
                {[...analytics.lineupEfficiencyTable]
                  .sort((left, right) => right.efficiency - left.efficiency)
                  .slice(0, 3)
                  .map((row) => (
                    <div key={row.teamId} className="rounded-3xl border border-line/70 bg-card-2/90 px-4 py-3">
                      <p className="text-base font-semibold text-fg">{row.teamName}</p>
                      <p className="text-sm text-fg-secondary">{row.managerName}</p>
                      <p className="mt-2 text-sm font-semibold text-emerald-300">{formatPercentage(row.efficiency)} efficiency</p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-line/70 bg-card/88 p-5 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">Pain ledger</p>
              <div className="mt-4 space-y-3">
                {[...analytics.lineupEfficiencyTable]
                  .sort((left, right) => right.regretPoints - left.regretPoints)
                  .slice(0, 3)
                  .map((row) => (
                    <div key={row.teamId} className="rounded-3xl border border-line/70 bg-card-2/90 px-4 py-3">
                      <p className="text-base font-semibold text-fg">{row.teamName}</p>
                      <p className="text-sm text-fg-secondary">
                        {row.biggestMissDetail?.missedPlayerName
                          ? `${row.biggestMissDetail.missedPlayerName} was the biggest bench sting in Week ${row.biggestMissWeek}.`
                          : `Week ${row.biggestMissWeek} was the worst of it.`}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-rose-300">{formatPoints(row.biggestMissPoints)} points missed</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-line/70 bg-card/88 backdrop-blur">
            <div className="border-b border-line/70 px-6 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">Trade review center</p>
              <h2 className="mt-2 font-display text-2xl text-fg">Every deal from the {selectedYear} room</h2>
            </div>
            <div className="grid gap-3 p-4 md:hidden">
              {recap.trades.length ? (
                recap.trades.map((trade) => (
                  <div key={trade.id} className="rounded-[24px] border border-line/70 bg-card-2/90 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">{formatTradeDate(trade.postedAt)}</p>
                        <p className="mt-1 text-base font-semibold text-fg">{trade.trader.teamName ?? "League team"}</p>
                        <p className="text-sm text-fg-secondary">for {trade.tradee.teamName ?? "League team"}</p>
                      </div>
                      <span className="inline-flex rounded-full border border-line/70 bg-card/80 px-2.5 py-1 text-[11px] font-semibold text-fg">
                        {trade.status ? trade.status.charAt(0).toUpperCase() + trade.status.slice(1) : "Completed"}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3">
                      <div className="rounded-2xl border border-line/60 bg-card/70 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{trade.trader.teamName ?? "Side A"} sent</p>
                        <p className="mt-1 text-sm text-fg">{formatTradeBundle(trade.traderSent)}</p>
                      </div>
                      <div className="rounded-2xl border border-line/60 bg-card/70 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{trade.tradee.teamName ?? "Side B"} sent</p>
                        <p className="mt-1 text-sm text-fg">{formatTradeBundle(trade.tradeeSent)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] border border-line/70 bg-card-2/90 p-4 text-sm text-fg-secondary">
                  No trades were logged for this season. Either everyone behaved, or the receipts never made it into the book.
                </div>
              )}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-sm">
                <thead className="bg-card-2/90 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Between</th>
                    <th className="px-4 py-3">Package A</th>
                    <th className="px-4 py-3">Package B</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recap.trades.map((trade) => (
                    <tr key={trade.id} className="border-t border-line/70 align-top text-fg-secondary">
                      <td className="px-4 py-3 text-xs text-muted">{formatTradeDate(trade.postedAt)}</td>
                      <td className="px-4 py-3">
                        <div className="space-y-1 text-sm">
                          <p className="font-semibold text-fg">{trade.trader.teamName ?? "League team"}</p>
                          <p className="text-xs text-muted">for {trade.tradee.teamName ?? "League team"}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-fg">{formatTradeBundle(trade.traderSent)}</td>
                      <td className="px-4 py-3 text-sm text-fg">{formatTradeBundle(trade.tradeeSent)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full border border-line/70 bg-card-2/85 px-2.5 py-1 text-xs font-semibold text-fg">
                          {trade.status ? trade.status.charAt(0).toUpperCase() + trade.status.slice(1) : "Completed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recap.trades.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-fg-secondary">
                        No trades were logged for this season. Either everyone behaved, or the receipts never made it into the book.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[32px] border border-line/70 bg-card/88 backdrop-blur">
              <div className="border-b border-line/70 px-6 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">Awards</p>
                <h2 className="mt-2 font-display text-2xl text-fg">Who owned the headlines</h2>
              </div>
              <div className="space-y-3 px-6 py-5">
                {recap.awards.map((award) => (
                  <div key={award.id} className="rounded-3xl border border-line/70 bg-card-2/90 px-4 py-3">
                    <p className="text-sm font-semibold text-fg">{award.title}</p>
                    <p className="mt-1 text-sm text-fg-secondary">{award.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-line/70 bg-card/88 backdrop-blur">
              <div className="border-b border-line/70 px-6 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">Records</p>
                <h2 className="mt-2 font-display text-2xl text-fg">Season marks</h2>
              </div>
              <div className="grid gap-3 p-4 md:hidden">
                {recap.records.map((record) => (
                  <div key={record.id} className="rounded-[24px] border border-line/70 bg-card-2/90 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">{record.label}</p>
                    <p className="mt-2 text-base font-semibold text-fg">{record.value}</p>
                    <p className="mt-2 text-sm text-fg-secondary">{record.context}</p>
                  </div>
                ))}
              </div>
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-sm">
                  <thead className="bg-card-2/90 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                    <tr>
                      <th className="px-4 py-3">Record</th>
                      <th className="px-4 py-3">Value</th>
                      <th className="px-4 py-3">Context</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recap.records.map((record) => (
                      <tr key={record.id} className="border-t border-line/70 align-top text-fg-secondary">
                        <td className="px-4 py-3 font-semibold text-fg">{record.label}</td>
                        <td className="px-4 py-3 text-fg">{record.value}</td>
                        <td className="px-4 py-3 text-sm">{record.context}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-line/70 bg-card/88 p-5 backdrop-blur md:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-200">Playoff bracket</p>
              <h2 className="mt-2 font-display text-2xl text-fg">How the postseason unfolded</h2>
              <p className="mt-2 text-sm text-fg-secondary">
                Rebuilt from archived seeds and final finishes so the playoff path reads like an actual bracket instead of a seed list.
              </p>
            </div>
            <div className="rounded-full border border-line/70 bg-card-2/90 px-3 py-1.5 text-xs font-semibold text-fg-secondary">
              {recap.season.numPlayoffTeams}-team playoff field
            </div>
          </div>

          {playoffBracket ? (
            <div className="mt-6">
              <div className="space-y-3 xl:hidden">
                <BracketRoundCard
                  title="Wildcard"
                  subtitle="Seeds 3 through 6 fought for the right to meet the bye teams."
                >
                  <BracketMatchupCard title="3 vs 6" matchup={playoffBracket.wildcard[0]} showConnector={false} />
                  <BracketMatchupCard title="4 vs 5" matchup={playoffBracket.wildcard[1]} showConnector={false} />
                </BracketRoundCard>

                <BracketConnector />

                <BracketRoundCard
                  title="Semifinals"
                  subtitle="Seeds 1 and 2 entered here after skipping the opening round."
                >
                  <BracketMatchupCard title="Top seed side" matchup={playoffBracket.semifinals[0]} showConnector={false} />
                  <BracketMatchupCard title="Two seed side" matchup={playoffBracket.semifinals[1]} showConnector={false} />
                </BracketRoundCard>

                <BracketConnector />

                <ChampionBracketCard matchup={playoffBracket.championship} />
              </div>

              <div className="hidden xl:grid xl:grid-cols-[1.08fr_1.08fr_0.92fr] xl:gap-6">
                <BracketRoundCard
                  title="Wildcard"
                  subtitle="Seeds 1 and 2 stayed home while the rest of the field survived opening weekend."
                >
                  <div className="rounded-3xl border border-dashed border-line/70 bg-card-2/50 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">Bye week</p>
                    <p className="mt-1 text-sm text-fg-secondary">Seeds 1 and 2 skipped this round and waited in the semifinals.</p>
                  </div>
                  <BracketMatchupCard title="3 vs 6" matchup={playoffBracket.wildcard[0]} />
                  <BracketMatchupCard title="4 vs 5" matchup={playoffBracket.wildcard[1]} />
                </BracketRoundCard>

                <BracketRoundCard
                  title="Semifinals"
                  subtitle="The byes arrived and the bracket narrowed to the finalists."
                >
                  <BracketMatchupCard title="Top seed side" matchup={playoffBracket.semifinals[0]} />
                  <BracketMatchupCard title="Two seed side" matchup={playoffBracket.semifinals[1]} />
                </BracketRoundCard>

                <div className="flex items-center">
                  <ChampionBracketCard matchup={playoffBracket.championship} />
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {recap.season.standings
                .filter((standing) => typeof standing.playoffSeed === "number")
                .sort((left, right) => (left.playoffSeed ?? 99) - (right.playoffSeed ?? 99))
                .map((standing) => {
                  const team = teamById.get(standing.teamId);
                  const label = getPlayoffResultLabel(standing);
                  return (
                    <div key={standing.teamId} className="rounded-3xl border border-line/70 bg-card-2/90 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">Seed {standing.playoffSeed}</span>
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getPlayoffTone(label)}`}>{label}</span>
                      </div>
                      <p className="mt-3 text-base font-semibold text-fg">{getStandingShortName(standing, team?.shortName)}</p>
                      <p className="text-sm text-fg-secondary">{formatStandingRecord(standing)} • {formatPoints(standing.pointsFor)} PF</p>
                    </div>
                  );
                })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function OddsBar({ value, label }: { value: number; label: "playoff" | "bye" | "title" }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <div className="h-2 w-24 overflow-hidden rounded-full bg-card-2/90">
          <div className={`h-full ${getOddsBarClass(label)}`} style={{ width: `${clampPercent(value * 100)}%` }} />
        </div>
        <span className="font-semibold text-fg">{formatPercentage(value)}</span>
      </div>
    </div>
  );
}

function StatCard({ label, title, detail }: { label: string; title: string; detail: string }) {
  return (
    <div className="rounded-3xl border border-line/70 bg-card-2/90 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">{label}</p>
      <p className="mt-1 text-base font-semibold text-fg">{title}</p>
      <p className="text-sm text-fg-secondary">{detail}</p>
    </div>
  );
}
