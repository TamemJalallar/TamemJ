"use client";

import Link from "next/link";
import { useState } from "react";
import type { FantasyManagerProfile, FantasySeasonDraftTendency, FantasyTrade } from "@/types/fantasy";

const rosterPositionOrder = ["QB", "RB", "WR", "TE", "K", "DST"] as const;
const openingMixColors = {
  QB: "bg-sky-400",
  RB: "bg-emerald-400",
  WR: "bg-violet-400",
  TE: "bg-amber-400",
  K: "bg-slate-400",
  DST: "bg-rose-400"
} as const;

type SortDirection = "asc" | "desc";
type DraftSortKey = "season" | "team" | "strategy" | "regular" | "playoffs" | "qb" | "rb" | "wr" | "te" | "grade";
type SeasonHistorySortKey = "season" | "team" | "record" | "finish" | "points" | "draft" | "moves" | "trades";
type TradeSortKey = "season" | "date" | "counterparty" | "status";

function formatRecord(wins: number, losses: number, ties: number): string {
  return `${wins}-${losses}${ties ? `-${ties}` : ""}`;
}

function formatPoints(value: number): string {
  return value.toFixed(1);
}

function getInitials(value: string): string {
  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
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

function getSeasonResultLabel({
  finishRank,
  playoffSeed,
  regularSeasonRank
}: {
  finishRank?: number | null;
  playoffSeed?: number | null;
  regularSeasonRank?: number | null;
}): string {
  if (finishRank === 1) return "Champ";
  if (finishRank === 2) return "Runner-up";
  if (playoffSeed) return `Playoffs • Seed ${playoffSeed}`;
  if (regularSeasonRank) return `Standings • ${regularSeasonRank}`;
  return "No finish posted";
}

function formatOrdinal(value?: number | null): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return `${value}st`;
  if (mod10 === 2 && mod100 !== 12) return `${value}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${value}rd`;
  return `${value}th`;
}

function formatRegularSeasonResult({
  regularSeasonRank,
  wins,
  losses,
  ties
}: {
  regularSeasonRank?: number | null;
  wins: number;
  losses: number;
  ties: number;
}): string {
  const rank = formatOrdinal(regularSeasonRank);
  return `${rank} • ${formatRecord(wins, losses, ties)}`;
}

function getRegularSeasonBadgeClass(regularSeasonRank?: number | null): string {
  if (regularSeasonRank === 1) {
    return "border-emerald-400/35 bg-emerald-500/12 text-emerald-200";
  }
  if (typeof regularSeasonRank === "number" && regularSeasonRank <= 3) {
    return "border-sky-400/35 bg-sky-500/12 text-sky-200";
  }
  if (typeof regularSeasonRank === "number" && regularSeasonRank <= 6) {
    return "border-violet-400/35 bg-violet-500/12 text-violet-200";
  }
  return "border-line/70 bg-card-2/85 text-fg-secondary";
}

function getPlayoffOutcomeLabel({
  finishRank,
  playoffSeed,
  playoffWins,
  playoffLosses,
  numPlayoffTeams
}: {
  finishRank?: number | null;
  playoffSeed?: number | null;
  playoffWins?: number | null;
  playoffLosses?: number | null;
  numPlayoffTeams: number;
}): string {
  if (finishRank === 1) return "Champion";
  if (finishRank === 2) return "Runner-up";
  if (!playoffSeed) return "Missed Playoffs";

  const fullBracket = 2 ** Math.ceil(Math.log2(Math.max(2, numPlayoffTeams)));
  const byes = Math.max(0, fullBracket - numPlayoffTeams);
  const firstPlayedRound = playoffSeed <= byes ? 2 : 1;

  if ((playoffLosses ?? 0) > 0) {
    const lossRound = firstPlayedRound + Math.max(0, (playoffWins ?? 0));
    return `Lost in Round ${lossRound}`;
  }

  return "Made Playoffs";
}

function getPlayoffBadgeClass(label: string): string {
  if (label === "Champion") {
    return "border-emerald-400/35 bg-emerald-500/12 text-emerald-200";
  }
  if (label === "Runner-up") {
    return "border-sky-400/35 bg-sky-500/12 text-sky-200";
  }
  if (label.startsWith("Lost in Round")) {
    return "border-amber-400/35 bg-amber-500/12 text-amber-200";
  }
  if (label === "Made Playoffs") {
    return "border-violet-400/35 bg-violet-500/12 text-violet-200";
  }
  return "border-line/70 bg-card-2/85 text-fg-secondary";
}

function getPrimaryRivalLabel(note: string): string | null {
  const match = note.match(/against (.+?) at/i);
  return match?.[1]?.trim() ?? null;
}

function getHeroBadgeTone(index: number): string {
  const tones = [
    "border-primary-400/35 bg-primary-500/12 text-primary-100",
    "border-violet-400/35 bg-violet-500/12 text-violet-100",
    "border-amber-400/35 bg-amber-500/12 text-amber-100"
  ] as const;

  return tones[index % tones.length];
}

function getOpeningMixBarClass(position: "QB" | "RB" | "WR" | "TE"): string {
  switch (position) {
    case "QB":
      return "bg-gradient-to-r from-sky-500 to-cyan-300";
    case "RB":
      return "bg-gradient-to-r from-emerald-500 to-lime-300";
    case "WR":
      return "bg-gradient-to-r from-violet-500 to-fuchsia-300";
    case "TE":
      return "bg-gradient-to-r from-amber-500 to-orange-300";
    default:
      return "bg-card-2/80";
  }
}

function formatRoundLabel(round?: number): string {
  return round ? `R${round}` : "—";
}

function groupSeasonRosterPlayers<T extends { position: string }>(players: T[]): Array<{ position: string; players: T[] }> {
  return rosterPositionOrder
    .map((position) => ({
      position,
      players: players
        .filter((player) => player.position === position)
        .toSorted((left, right) => {
          const leftRound = "round" in left && typeof left.round === "number" ? left.round : 99;
          const rightRound = "round" in right && typeof right.round === "number" ? right.round : 99;
          const leftPick = "overallPick" in left && typeof left.overallPick === "number" ? left.overallPick : 999;
          const rightPick = "overallPick" in right && typeof right.overallPick === "number" ? right.overallPick : 999;
          return leftRound - rightRound || leftPick - rightPick;
        })
    }))
    .filter((group) => group.players.length > 0);
}

function getSortValueMultiplier(direction: SortDirection): number {
  return direction === "asc" ? 1 : -1;
}

function getRegularSeasonRankValue(rank?: number | null): number {
  return typeof rank === "number" ? rank : 99;
}

function getPlayoffOutcomeRank({
  finishRank,
  playoffSeed,
  playoffWins,
  playoffLosses,
  numPlayoffTeams
}: {
  finishRank?: number | null;
  playoffSeed?: number | null;
  playoffWins?: number | null;
  playoffLosses?: number | null;
  numPlayoffTeams: number;
}): number {
  const label = getPlayoffOutcomeLabel({
    finishRank,
    playoffSeed,
    playoffWins,
    playoffLosses,
    numPlayoffTeams
  });

  if (label === "Champion") return 5;
  if (label === "Runner-up") return 4;
  if (label === "Made Playoffs") return 3;
  if (label === "Lost in Round 2") return 2;
  if (label === "Lost in Round 1") return 1;
  return 0;
}

function SortableHeader({
  label,
  active,
  direction,
  onClick,
  className = ""
}: {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 transition hover:text-fg ${className}`}
    >
      <span>{label}</span>
      <span className={`text-[10px] ${active ? "text-primary-200" : "text-muted"}`}>
        {active ? (direction === "asc" ? "↑" : "↓") : "↕"}
      </span>
    </button>
  );
}

export function FantasyManagerProfileView({ profile }: { profile: FantasyManagerProfile }) {
  const latestSeason = profile.seasonHistory[0];
  const [tradeSeasonFilter, setTradeSeasonFilter] = useState<number | "all">(latestSeason?.seasonYear ?? "all");
  const [draftSort, setDraftSort] = useState<{ key: DraftSortKey; direction: SortDirection }>({
    key: "season",
    direction: "desc"
  });
  const [seasonHistorySort, setSeasonHistorySort] = useState<{ key: SeasonHistorySortKey; direction: SortDirection }>({
    key: "season",
    direction: "desc"
  });
  const [tradeSort, setTradeSort] = useState<{ key: TradeSortKey; direction: SortDirection }>({
    key: "date",
    direction: "desc"
  });
  const titles = profile.team.championships;
  const playoffTrips = profile.team.playoffAppearances;
  const tradeSeasonOptions = profile.seasonHistory.map((season) => season.seasonYear);
  const filteredTrades = profile.trades.filter((trade) => tradeSeasonFilter === "all" || trade.seasonYear === tradeSeasonFilter);
  const seasonHistoryBySeasonId = new Map(profile.seasonHistory.map((season) => [season.seasonId, season]));
  const maxWins = Math.max(...profile.seasonHistory.map((season) => season.wins), 1);
  const maxPoints = Math.max(...profile.seasonHistory.map((season) => season.pointsFor), 1);
  const primaryRival = getPrimaryRivalLabel(profile.member.rivalryNote);
  const peakWinsSeason = profile.seasonHistory.reduce((best, season) => (season.wins > best.wins ? season : best), profile.seasonHistory[0]);
  const peakPointsSeason = profile.seasonHistory.reduce(
    (best, season) => (season.pointsFor > best.pointsFor ? season : best),
    profile.seasonHistory[0]
  );
  const heroBadges = [
    profile.member.favoriteTeam,
    titles > 0 ? `${titles}x champ` : playoffTrips > 0 ? `${playoffTrips} playoff trips` : "League sicko",
    primaryRival ? `Main beef: ${primaryRival}` : "Rival pending"
  ];

  function handleDraftSort(key: DraftSortKey) {
    setDraftSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: key === "season" ? "desc" : "asc" }
    );
  }

  function handleSeasonHistorySort(key: SeasonHistorySortKey) {
    setSeasonHistorySort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: key === "season" ? "desc" : "asc" }
    );
  }

  function handleTradeSort(key: TradeSortKey) {
    setTradeSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: key === "date" ? "desc" : "asc" }
    );
  }

  const sortedDraftTendencies = [...profile.draftTendencies].toSorted((left, right) => {
    const direction = getSortValueMultiplier(draftSort.direction);
    const leftSeason = seasonHistoryBySeasonId.get(left.seasonId);
    const rightSeason = seasonHistoryBySeasonId.get(right.seasonId);

    switch (draftSort.key) {
      case "season":
        return (left.seasonYear - right.seasonYear) * direction;
      case "team":
        return left.teamName.localeCompare(right.teamName) * direction;
      case "strategy":
        return left.strategyLabel.localeCompare(right.strategyLabel) * direction;
      case "regular":
        return (getRegularSeasonRankValue(leftSeason?.regularSeasonRank) - getRegularSeasonRankValue(rightSeason?.regularSeasonRank)) * direction;
      case "playoffs":
        return (
          getPlayoffOutcomeRank({
            finishRank: leftSeason?.finishRank,
            playoffSeed: leftSeason?.playoffSeed,
            playoffWins: leftSeason?.playoffWins,
            playoffLosses: leftSeason?.playoffLosses,
            numPlayoffTeams: leftSeason?.numPlayoffTeams ?? 0
          }) -
          getPlayoffOutcomeRank({
            finishRank: rightSeason?.finishRank,
            playoffSeed: rightSeason?.playoffSeed,
            playoffWins: rightSeason?.playoffWins,
            playoffLosses: rightSeason?.playoffLosses,
            numPlayoffTeams: rightSeason?.numPlayoffTeams ?? 0
          })
        ) * direction;
      case "qb":
        return ((left.firstPositionRounds.QB ?? 99) - (right.firstPositionRounds.QB ?? 99)) * direction;
      case "rb":
        return ((left.firstPositionRounds.RB ?? 99) - (right.firstPositionRounds.RB ?? 99)) * direction;
      case "wr":
        return ((left.firstPositionRounds.WR ?? 99) - (right.firstPositionRounds.WR ?? 99)) * direction;
      case "te":
        return ((left.firstPositionRounds.TE ?? 99) - (right.firstPositionRounds.TE ?? 99)) * direction;
      case "grade":
        return (left.draftGrade ?? "Z").localeCompare(right.draftGrade ?? "Z") * direction;
      default:
        return 0;
    }
  });

  const sortedSeasonHistory = [...profile.seasonHistory].toSorted((left, right) => {
    const direction = getSortValueMultiplier(seasonHistorySort.direction);
    switch (seasonHistorySort.key) {
      case "season":
        return (left.seasonYear - right.seasonYear) * direction;
      case "team":
        return left.teamName.localeCompare(right.teamName) * direction;
      case "record":
        return ((left.wins - left.losses) - (right.wins - right.losses)) * direction;
      case "finish":
        return (getRegularSeasonRankValue(left.finishRank) - getRegularSeasonRankValue(right.finishRank)) * direction;
      case "points":
        return (left.pointsFor - right.pointsFor) * direction;
      case "draft":
        return ((left.draftRank ?? 99) - (right.draftRank ?? 99)) * direction;
      case "moves":
        return (left.numMoves - right.numMoves) * direction;
      case "trades":
        return (left.numTrades - right.numTrades) * direction;
      default:
        return 0;
    }
  });

  const sortedTrades = [...filteredTrades].toSorted((left, right) => {
    const direction = getSortValueMultiplier(tradeSort.direction);
    const leftCounterparty = left.trader.memberId === profile.member.id ? left.tradee.teamName ?? "" : left.trader.teamName ?? "";
    const rightCounterparty = right.trader.memberId === profile.member.id ? right.tradee.teamName ?? "" : right.trader.teamName ?? "";
    switch (tradeSort.key) {
      case "season":
        return (left.seasonYear - right.seasonYear) * direction;
      case "date":
        return ((Date.parse(left.postedAt ?? "") || 0) - (Date.parse(right.postedAt ?? "") || 0)) * direction;
      case "counterparty":
        return leftCounterparty.localeCompare(rightCounterparty) * direction;
      case "status":
        return (left.status ?? "").localeCompare(right.status ?? "") * direction;
      default:
        return 0;
    }
  });

  const openingFourMix = profile.draftTendencies.map((tendency) => {
    const counts = tendency.openingPicks.reduce<Record<string, number>>((result, pick) => {
      result[pick.position] = (result[pick.position] ?? 0) + 1;
      return result;
    }, {});
    return {
      seasonYear: tendency.seasonYear,
      strategyLabel: tendency.strategyLabel,
      counts
    };
  });

  return (
    <div className="section-shell pt-10 sm:pt-14">
      <div className="page-shell space-y-8 max-w-6xl">
        <div className="print:hidden">
          <Link
            href="/fantasy/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            ← Back to Fantasy Hub
          </Link>
        </div>

        <section className="surface-card-strong overflow-hidden">
          <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${profile.team.colors.primary}, ${profile.team.colors.secondary})` }} />
          <div className="grid gap-6 px-5 py-6 lg:grid-cols-[1.35fr_0.95fr]">
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl text-xl font-semibold text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${profile.team.colors.primary}, ${profile.team.colors.secondary})` }}
                >
                  {getInitials(profile.member.managerName)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">Manager Profile</p>
                  <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                    {profile.member.managerName}
                  </h1>
                  <p className="mt-2 text-lg text-fg-secondary">{profile.team.teamName}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {heroBadges.map((badge, index) => (
                      <span
                        key={`${profile.member.id}-hero-badge-${badge}`}
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${getHeroBadgeTone(index)}`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-fg-secondary">{profile.member.bio}</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-line/70 bg-card/75 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Rivalry report</p>
                  <p className="mt-2 text-sm leading-6 text-fg-secondary">{profile.member.rivalryNote}</p>
                </div>
                <div className="rounded-2xl border border-line/70 bg-card/75 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Current team note</p>
                  <p className="mt-2 text-sm leading-6 text-fg-secondary">{profile.team.notes}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-line/70 bg-card/75 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Season-by-season tendencies</p>
                    <p className="mt-1 text-sm text-fg-secondary">
                      {profile.draftTendencies.length} draft rooms tracked across {profile.seasonHistory.length} seasons. Enough receipts for a full scouting report.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.team.legacyNames.map((name) => (
                      <span key={`${profile.team.id}-${name}`} className="filter-chip px-2.5 py-1 font-semibold">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="rounded-2xl border border-line/70 bg-card/75 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">All-time record</p>
                <p className="mt-2 font-display text-3xl font-semibold text-fg">
                  {formatRecord(profile.team.allTimeRecord.wins, profile.team.allTimeRecord.losses, profile.team.allTimeRecord.ties)}
                </p>
                <p className="mt-2 text-sm text-fg-secondary">The full win-loss story, no excuses attached.</p>
              </div>
              <div className="rounded-2xl border border-line/70 bg-card/75 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Titles</p>
                <p className="mt-2 font-display text-3xl font-semibold text-fg">{titles}</p>
                <p className="mt-2 text-sm text-fg-secondary">
                  {profile.championshipYears.length > 0 ? `Won in ${profile.championshipYears.join(", ")}.` : "Still chasing the first title."}
                </p>
              </div>
              <div className="rounded-2xl border border-line/70 bg-card/75 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Playoff trips</p>
                <p className="mt-2 font-display text-3xl font-semibold text-fg">{playoffTrips}</p>
                <p className="mt-2 text-sm text-fg-secondary">Trips to the dance, with varying levels of heartbreak.</p>
              </div>
              <div className="rounded-2xl border border-line/70 bg-card/75 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Trades logged</p>
                <p className="mt-2 font-display text-3xl font-semibold text-fg">{profile.trades.length}</p>
                <p className="mt-2 text-sm text-fg-secondary">
                  {latestSeason ? `${latestSeason.seasonYear} closed with ${latestSeason.numTrades} rostered trade actions.` : "Trade history loaded and ready for judgment."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <div className="surface-card-strong relative overflow-hidden p-4">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.18),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_38%)]" />
            <div className="relative">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Visuals</p>
                  <h2 className="mt-1 font-display text-xl font-semibold text-fg">Wins and points by season</h2>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
                  <span className="rounded-full border border-primary-400/35 bg-primary-500/12 px-2.5 py-1 text-primary-100">
                    Peak wins: {peakWinsSeason.seasonYear} · {peakWinsSeason.wins}
                  </span>
                  <span className="rounded-full border border-amber-400/35 bg-amber-500/12 px-2.5 py-1 text-amber-100">
                    Peak PF: {peakPointsSeason.seasonYear} · {formatPoints(peakPointsSeason.pointsFor)}
                  </span>
                </div>
              </div>
              <div className="mt-4 space-y-3">
              {sortedSeasonHistory
                .slice()
                .reverse()
                .map((season) => (
                  <div key={`${season.seasonId}-win-bar`} className="rounded-2xl border border-line/70 bg-card/75 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{season.seasonYear}</p>
                        <p className="mt-1 text-sm font-semibold text-fg">{season.teamName}</p>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getRegularSeasonBadgeClass(season.regularSeasonRank)}`}>
                          {formatRegularSeasonResult({
                            regularSeasonRank: season.regularSeasonRank,
                            wins: season.wins,
                            losses: season.losses,
                            ties: season.ties
                          })}
                        </span>
                        <span
                          className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getPlayoffBadgeClass(
                            getPlayoffOutcomeLabel({
                              finishRank: season.finishRank,
                              playoffSeed: season.playoffSeed,
                              playoffWins: season.playoffWins,
                              playoffLosses: season.playoffLosses,
                              numPlayoffTeams: season.numPlayoffTeams
                            })
                          )}`}
                        >
                          {getPlayoffOutcomeLabel({
                            finishRank: season.finishRank,
                            playoffSeed: season.playoffSeed,
                            playoffWins: season.playoffWins,
                            playoffLosses: season.playoffLosses,
                            numPlayoffTeams: season.numPlayoffTeams
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3 text-[11px] font-medium uppercase tracking-[0.12em] text-fg-secondary">
                          <span>Wins</span>
                          <span>{season.wins} of {maxWins}</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-card-2/80 shadow-inner shadow-black/20">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary-500 via-sky-400 to-cyan-300 shadow-[0_0_16px_rgba(96,165,250,0.35)]"
                            style={{ width: `${Math.max(8, (season.wins / maxWins) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3 text-[11px] font-medium uppercase tracking-[0.12em] text-fg-secondary">
                          <span>Points For</span>
                          <span>{formatPoints(season.pointsFor)}</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-card-2/70 shadow-inner shadow-black/20">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-300 to-rose-400 shadow-[0_0_16px_rgba(251,191,36,0.28)]"
                            style={{ width: `${Math.max(8, (season.pointsFor / maxPoints) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-secondary">
                <span className="inline-flex items-center gap-2"><span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary-400" />Wins</span>
                <span className="inline-flex items-center gap-2"><span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />Points For</span>
              </div>
            </div>
          </div>

          <div className="surface-card-strong relative overflow-hidden p-4">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.16),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(74,222,128,0.1),transparent_36%)]" />
            <div className="relative">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Visuals</p>
                  <h2 className="mt-1 font-display text-xl font-semibold text-fg">Opening four mix by season</h2>
                </div>
                <div className="flex flex-wrap gap-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-secondary">
                  {(["QB", "RB", "WR", "TE"] as const).map((position) => (
                    <span key={position} className="inline-flex items-center gap-2">
                      <span className={`inline-flex h-2.5 w-2.5 rounded-full ${openingMixColors[position]}`} />
                      {position}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {openingFourMix.map((season) => {
                  const total = Object.values(season.counts).reduce((sum, value) => sum + value, 0) || 1;
                  return (
                    <div key={`${profile.member.id}-${season.seasonYear}-mix`} className="rounded-2xl border border-line/70 bg-card/75 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{season.seasonYear}</p>
                          <p className="mt-1 text-sm font-semibold text-fg">{season.strategyLabel}</p>
                        </div>
                        <div className="flex flex-wrap justify-end gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em]">
                          {(["QB", "RB", "WR", "TE"] as const).map((position) =>
                            season.counts[position] ? (
                              <span key={`${season.seasonYear}-${position}-count`} className="rounded-full border border-line/70 bg-card-2/80 px-2 py-1 text-fg-secondary">
                                {position} {season.counts[position]}
                              </span>
                            ) : null
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-card-2/80 shadow-inner shadow-black/25">
                        {(["QB", "RB", "WR", "TE"] as const).map((position) => {
                          const count = season.counts[position] ?? 0;
                          if (!count) return null;
                          return (
                            <div
                              key={`${season.seasonYear}-${position}`}
                              className={getOpeningMixBarClass(position)}
                              style={{ width: `${(count / total) * 100}%` }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="surface-card-strong overflow-hidden">
          <div className="border-b border-line/70 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Season tendencies</p>
            <h2 className="mt-1 font-display text-xl font-semibold text-fg">Season-by-season draft tendencies</h2>
          </div>
          <div className="space-y-3 px-4 py-4 md:hidden">
            {sortedDraftTendencies.map((tendency) => {
              const seasonSnapshot = seasonHistoryBySeasonId.get(tendency.seasonId);
              const regularSeasonLabel = seasonSnapshot
                ? formatRegularSeasonResult({
                    regularSeasonRank: seasonSnapshot.regularSeasonRank,
                    wins: seasonSnapshot.wins,
                    losses: seasonSnapshot.losses,
                    ties: seasonSnapshot.ties
                  })
                : "—";
              const playoffLabel = seasonSnapshot
                ? getPlayoffOutcomeLabel({
                    finishRank: seasonSnapshot.finishRank,
                    playoffSeed: seasonSnapshot.playoffSeed,
                    playoffWins: seasonSnapshot.playoffWins,
                    playoffLosses: seasonSnapshot.playoffLosses,
                    numPlayoffTeams: seasonSnapshot.numPlayoffTeams
                  })
                : "—";

              return (
                <div key={`${profile.member.id}-${tendency.seasonId}-mobile`} className="rounded-2xl border border-line/70 bg-card/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{tendency.seasonYear}</p>
                      <h3 className="mt-1 font-semibold text-fg">{tendency.teamName}</h3>
                    </div>
                    <span className="rounded-full border border-primary-400/30 bg-primary-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-100">
                      {tendency.draftGrade ?? "No grade"}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-line/70 bg-card-2/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-fg">
                      {tendency.strategyLabel}
                    </span>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getRegularSeasonBadgeClass(seasonSnapshot?.regularSeasonRank)}`}>
                      {regularSeasonLabel}
                    </span>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getPlayoffBadgeClass(playoffLabel)}`}>
                      {playoffLabel}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Opening four</p>
                    <div className="mt-2 grid gap-1.5">
                      {tendency.openingPicks.map((pick) => (
                        <div key={`${tendency.seasonId}-${pick.playerId}-${pick.overallPick}-mobile`} className="flex items-center gap-2 text-xs text-fg-secondary">
                          <span className="inline-flex rounded-full border border-line/70 bg-card-2/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-fg">
                            {pick.position}
                          </span>
                          <span className="truncate">{pick.playerName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-fg-secondary">{tendency.summary.replace(`${tendency.seasonYear}: `, "")}</p>
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {(["QB", "RB", "WR", "TE"] as const).map((position) => (
                      <div key={`${tendency.seasonId}-${position}-mobile-round`} className="rounded-xl border border-line/70 bg-card-2/70 px-2 py-2 text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">{position}</p>
                        <p className="mt-1 text-sm font-semibold text-fg">{formatRoundLabel(tendency.firstPositionRounds[position])}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-card-2/80 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="Season" active={draftSort.key === "season"} direction={draftSort.direction} onClick={() => handleDraftSort("season")} />
                  </th>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="Team" active={draftSort.key === "team"} direction={draftSort.direction} onClick={() => handleDraftSort("team")} />
                  </th>
                  <th className="px-3 py-2.5">Opening four</th>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="Strategy" active={draftSort.key === "strategy"} direction={draftSort.direction} onClick={() => handleDraftSort("strategy")} />
                  </th>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="Regular Season" active={draftSort.key === "regular"} direction={draftSort.direction} onClick={() => handleDraftSort("regular")} />
                  </th>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="Playoffs" active={draftSort.key === "playoffs"} direction={draftSort.direction} onClick={() => handleDraftSort("playoffs")} />
                  </th>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="QB" active={draftSort.key === "qb"} direction={draftSort.direction} onClick={() => handleDraftSort("qb")} />
                  </th>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="RB" active={draftSort.key === "rb"} direction={draftSort.direction} onClick={() => handleDraftSort("rb")} />
                  </th>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="WR" active={draftSort.key === "wr"} direction={draftSort.direction} onClick={() => handleDraftSort("wr")} />
                  </th>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="TE" active={draftSort.key === "te"} direction={draftSort.direction} onClick={() => handleDraftSort("te")} />
                  </th>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="Grade" active={draftSort.key === "grade"} direction={draftSort.direction} onClick={() => handleDraftSort("grade")} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedDraftTendencies.map((tendency) => {
                  const seasonSnapshot = seasonHistoryBySeasonId.get(tendency.seasonId);
                  const regularSeasonLabel = seasonSnapshot
                    ? formatRegularSeasonResult({
                        regularSeasonRank: seasonSnapshot.regularSeasonRank,
                        wins: seasonSnapshot.wins,
                        losses: seasonSnapshot.losses,
                        ties: seasonSnapshot.ties
                      })
                    : "—";
                  const playoffLabel = seasonSnapshot
                    ? getPlayoffOutcomeLabel({
                        finishRank: seasonSnapshot.finishRank,
                        playoffSeed: seasonSnapshot.playoffSeed,
                        playoffWins: seasonSnapshot.playoffWins,
                        playoffLosses: seasonSnapshot.playoffLosses,
                        numPlayoffTeams: seasonSnapshot.numPlayoffTeams
                      })
                    : "—";

                  return (
                    <tr key={`${profile.member.id}-${tendency.seasonId}`} className="border-t border-line/70 bg-card/90 align-top transition hover:bg-card-2/70">
                      <td className="px-3 py-3 font-semibold text-fg">{tendency.seasonYear}</td>
                      <td className="px-3 py-3 text-fg-secondary">{tendency.teamName}</td>
                      <td className="px-3 py-3">
                        <div className="space-y-1">
                          {tendency.openingPicks.map((pick) => (
                            <div
                              key={`${tendency.seasonId}-${pick.playerId}-${pick.overallPick}`}
                              className="flex items-center gap-2 whitespace-nowrap text-[11px] font-medium leading-4 text-fg-secondary"
                            >
                              <span className="inline-flex rounded-full border border-line/70 bg-card-2/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-fg">
                                {pick.position}
                              </span>
                              <span className="truncate">{pick.playerName}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-semibold text-fg">{tendency.strategyLabel}</p>
                        <p className="mt-1 text-xs leading-5 text-fg-secondary">{tendency.summary.replace(`${tendency.seasonYear}: `, "")}</p>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getRegularSeasonBadgeClass(seasonSnapshot?.regularSeasonRank)}`}
                        >
                          {regularSeasonLabel}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getPlayoffBadgeClass(playoffLabel)}`}
                        >
                          {playoffLabel}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-semibold text-fg">{formatRoundLabel(tendency.firstPositionRounds.QB)}</td>
                      <td className="px-3 py-3 font-semibold text-fg">{formatRoundLabel(tendency.firstPositionRounds.RB)}</td>
                      <td className="px-3 py-3 font-semibold text-fg">{formatRoundLabel(tendency.firstPositionRounds.WR)}</td>
                      <td className="px-3 py-3 font-semibold text-fg">{formatRoundLabel(tendency.firstPositionRounds.TE)}</td>
                      <td className="px-3 py-3 font-semibold text-fg">{tendency.draftGrade ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="surface-card-strong overflow-hidden">
          <div className="border-b border-line/70 px-4 py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Season Squads</p>
                <h2 className="mt-1 font-display text-xl font-semibold text-fg">Each draft class, season by season</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                Highlighted players are potential keepers
              </div>
            </div>
          </div>
          <div className="grid gap-4 px-4 py-4 lg:grid-cols-2">
            {profile.seasonRosters.map((seasonRoster) => {
              const seasonSnapshot = seasonHistoryBySeasonId.get(seasonRoster.seasonId);
              const seasonResultBadge = seasonSnapshot
                ? getPlayoffOutcomeLabel({
                    finishRank: seasonSnapshot.finishRank,
                    playoffSeed: seasonSnapshot.playoffSeed,
                    playoffWins: seasonSnapshot.playoffWins,
                    playoffLosses: seasonSnapshot.playoffLosses,
                    numPlayoffTeams: seasonSnapshot.numPlayoffTeams
                  })
                : "Season in review";
              const regularSeasonBadge = seasonSnapshot
                ? formatRegularSeasonResult({
                    regularSeasonRank: seasonSnapshot.regularSeasonRank,
                    wins: seasonSnapshot.wins,
                    losses: seasonSnapshot.losses,
                    ties: seasonSnapshot.ties
                  })
                : "Season in review";
              const positionGroups = groupSeasonRosterPlayers(seasonRoster.players);

              return (
                <details key={`${profile.member.id}-${seasonRoster.seasonId}-roster`} className="rounded-2xl border border-line/70 bg-card/75 p-4">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-3 [&::-webkit-details-marker]:hidden">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{seasonRoster.seasonYear}</p>
                      <h3 className="mt-1 font-semibold text-fg">{seasonRoster.teamName}</h3>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex flex-wrap justify-end gap-2">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${getRegularSeasonBadgeClass(seasonSnapshot?.regularSeasonRank)}`}>
                          {regularSeasonBadge}
                        </span>
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${getPlayoffBadgeClass(seasonResultBadge)}`}>
                          {seasonResultBadge}
                        </span>
                      </div>
                      <span className="rounded-full border border-line/70 bg-card-2/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-secondary">
                        {seasonRoster.players.length} picks
                      </span>
                    </div>
                  </summary>

                  <div className="mt-4 space-y-3">
                    {positionGroups.map((group) => (
                      <div key={`${seasonRoster.seasonId}-${group.position}`} className="rounded-2xl border border-line/60 bg-card/70 p-3">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{group.position}</span>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-fg-secondary">
                            {group.players.length} pick{group.players.length === 1 ? "" : "s"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {group.players.map((player) => (
                            <div
                              key={`${seasonRoster.seasonId}-${player.playerId}-${player.overallPick}`}
                              className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-4 ${
                                player.potentialKeeper
                                  ? "border-emerald-300/70 bg-gradient-to-r from-emerald-400/30 to-lime-300/25 text-emerald-50 shadow-[0_0_0_1px_rgba(110,231,183,0.18)]"
                                  : "border-line/70 bg-card-2/80 text-fg-secondary"
                              }`}
                            >
                              <span className="font-semibold text-fg">{player.playerName}</span>
                              <span className="text-[10px] uppercase tracking-[0.12em] opacity-80">R{player.round}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="surface-card-strong overflow-hidden">
            <div className="border-b border-line/70 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Season Timeline</p>
              <h2 className="mt-1 font-display text-xl font-semibold text-fg">How each season closed</h2>
            </div>
            <div className="space-y-3 px-4 py-4 md:hidden">
              {sortedSeasonHistory.map((season) => {
                const regularSeasonLabel = formatRegularSeasonResult({
                  regularSeasonRank: season.regularSeasonRank,
                  wins: season.wins,
                  losses: season.losses,
                  ties: season.ties
                });
                const playoffLabel = getPlayoffOutcomeLabel({
                  finishRank: season.finishRank,
                  playoffSeed: season.playoffSeed,
                  playoffWins: season.playoffWins,
                  playoffLosses: season.playoffLosses,
                  numPlayoffTeams: season.numPlayoffTeams
                });

                return (
                  <div key={`${profile.member.id}-${season.seasonId}-history-mobile`} className="rounded-2xl border border-line/70 bg-card/80 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{season.seasonYear}</p>
                        <h3 className="mt-1 font-semibold text-fg">{season.teamName}</h3>
                      </div>
                      <span className="rounded-full border border-line/70 bg-card-2/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-fg-secondary">
                        {formatPoints(season.pointsFor)} PF
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getRegularSeasonBadgeClass(season.regularSeasonRank)}`}>
                        {regularSeasonLabel}
                      </span>
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getPlayoffBadgeClass(playoffLabel)}`}>
                        {playoffLabel}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-xl border border-line/70 bg-card-2/70 px-2 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Draft</p>
                        <p className="mt-1 text-sm font-semibold text-fg">{season.draftGrade ?? "—"}</p>
                      </div>
                      <div className="rounded-xl border border-line/70 bg-card-2/70 px-2 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Moves</p>
                        <p className="mt-1 text-sm font-semibold text-fg">{season.numMoves}</p>
                      </div>
                      <div className="rounded-xl border border-line/70 bg-card-2/70 px-2 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Trades</p>
                        <p className="mt-1 text-sm font-semibold text-fg">{season.numTrades}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-card-2/80 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  <tr>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="Season" active={seasonHistorySort.key === "season"} direction={seasonHistorySort.direction} onClick={() => handleSeasonHistorySort("season")} />
                  </th>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="Team" active={seasonHistorySort.key === "team"} direction={seasonHistorySort.direction} onClick={() => handleSeasonHistorySort("team")} />
                  </th>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="Record" active={seasonHistorySort.key === "record"} direction={seasonHistorySort.direction} onClick={() => handleSeasonHistorySort("record")} />
                  </th>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="Finish" active={seasonHistorySort.key === "finish"} direction={seasonHistorySort.direction} onClick={() => handleSeasonHistorySort("finish")} />
                  </th>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="PF" active={seasonHistorySort.key === "points"} direction={seasonHistorySort.direction} onClick={() => handleSeasonHistorySort("points")} />
                  </th>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="Draft" active={seasonHistorySort.key === "draft"} direction={seasonHistorySort.direction} onClick={() => handleSeasonHistorySort("draft")} />
                  </th>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="Moves" active={seasonHistorySort.key === "moves"} direction={seasonHistorySort.direction} onClick={() => handleSeasonHistorySort("moves")} />
                  </th>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="Trades" active={seasonHistorySort.key === "trades"} direction={seasonHistorySort.direction} onClick={() => handleSeasonHistorySort("trades")} />
                  </th>
                </tr>
              </thead>
                <tbody>
                  {sortedSeasonHistory.map((season) => (
                    <tr key={`${profile.member.id}-${season.seasonId}`} className="border-t border-line/70 bg-card/90 align-top transition hover:bg-card-2/70">
                      <td className="px-3 py-3 font-semibold text-fg">{season.seasonYear}</td>
                      <td className="px-3 py-3 text-fg-secondary">{season.teamName}</td>
                      <td className="px-3 py-3 font-semibold text-fg">{formatRecord(season.wins, season.losses, season.ties)}</td>
                      <td className="px-3 py-3 text-fg-secondary">
                        <div className="flex flex-wrap gap-2">
                          <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getRegularSeasonBadgeClass(season.regularSeasonRank)}`}>
                            {formatRegularSeasonResult({
                              regularSeasonRank: season.regularSeasonRank,
                              wins: season.wins,
                              losses: season.losses,
                              ties: season.ties
                            })}
                          </span>
                          <span
                            className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getPlayoffBadgeClass(
                              getPlayoffOutcomeLabel({
                                finishRank: season.finishRank,
                                playoffSeed: season.playoffSeed,
                                playoffWins: season.playoffWins,
                                playoffLosses: season.playoffLosses,
                                numPlayoffTeams: season.numPlayoffTeams
                              })
                            )}`}
                          >
                            {getPlayoffOutcomeLabel({
                              finishRank: season.finishRank,
                              playoffSeed: season.playoffSeed,
                              playoffWins: season.playoffWins,
                              playoffLosses: season.playoffLosses,
                              numPlayoffTeams: season.numPlayoffTeams
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-semibold text-fg">{formatPoints(season.pointsFor)}</td>
                      <td className="px-3 py-3 text-fg-secondary">
                        {season.draftGrade ?? "—"}
                        {typeof season.draftRank === "number" ? ` · #${season.draftRank}` : ""}
                      </td>
                      <td className="px-3 py-3 font-semibold text-fg">{season.numMoves}</td>
                      <td className="px-3 py-3 font-semibold text-fg">{season.numTrades}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="surface-card-strong overflow-hidden">
            <div className="border-b border-line/70 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Draft Room Read</p>
              <h2 className="mt-1 font-display text-xl font-semibold text-fg">Profile notes at a glance</h2>
            </div>
            <div className="space-y-3 px-4 py-4">
              {profile.draftTendencies.map((tendency) => (
                <div key={`${profile.member.id}-${tendency.seasonId}-card`} className="rounded-2xl border border-line/70 bg-card/75 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{tendency.seasonYear}</p>
                      <h3 className="mt-1 font-semibold text-fg">{tendency.teamName}</h3>
                    </div>
                    <span className="rounded-full border border-primary-400/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-200">
                      {tendency.strategyLabel}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-fg-secondary">{tendency.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="surface-card-strong overflow-hidden">
          <div className="border-b border-line/70 px-4 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Trade Ledger</p>
                <h2 className="mt-1 font-display text-xl font-semibold text-fg">Every trade involving this manager</h2>
              </div>
              <label className="flex min-w-[220px] flex-col gap-1 text-left">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Filter by season</span>
                <select
                  value={tradeSeasonFilter}
                  onChange={(event) =>
                    setTradeSeasonFilter(event.target.value === "all" ? "all" : Number(event.target.value))
                  }
                  className="input-shell h-11 rounded-2xl px-3 text-sm"
                >
                  {tradeSeasonOptions.map((seasonYear) => (
                    <option key={`trade-filter-${seasonYear}`} value={seasonYear}>
                      {seasonYear}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className="space-y-3 px-4 py-4 md:hidden">
            {sortedTrades.length === 0 ? (
              <div className="rounded-2xl border border-line/70 bg-card/80 px-4 py-8 text-center text-sm text-fg-secondary">
                No trades showed up for that season. Either peace broke out or nobody hit accept.
              </div>
            ) : null}
            {sortedTrades.map((trade) => {
              const isTrader = trade.trader.memberId === profile.member.id;
              const sent = isTrader ? trade.traderSent : trade.tradeeSent;
              const received = isTrader ? trade.tradeeSent : trade.traderSent;
              const counterparty = isTrader ? trade.tradee.teamName : trade.trader.teamName;

              return (
                <div key={`${trade.id}-mobile`} className="rounded-2xl border border-line/70 bg-card/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{trade.seasonYear}</p>
                      <h3 className="mt-1 font-semibold text-fg">{counterparty ?? "League trade partner"}</h3>
                    </div>
                    <span className="rounded-full border border-line/70 bg-card-2/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-fg-secondary">
                      {trade.status ?? "recorded"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-fg-secondary">{formatTradeDate(trade.postedAt)}</p>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-xl border border-line/70 bg-card-2/70 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Sent</p>
                      <p className="mt-2 text-sm leading-6 text-fg-secondary">{formatTradeBundle(sent)}</p>
                    </div>
                    <div className="rounded-xl border border-line/70 bg-card-2/70 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Received</p>
                      <p className="mt-2 text-sm leading-6 text-fg-secondary">{formatTradeBundle(received)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-card-2/80 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="Season" active={tradeSort.key === "season"} direction={tradeSort.direction} onClick={() => handleTradeSort("season")} />
                  </th>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="Date" active={tradeSort.key === "date"} direction={tradeSort.direction} onClick={() => handleTradeSort("date")} />
                  </th>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="Counterparty" active={tradeSort.key === "counterparty"} direction={tradeSort.direction} onClick={() => handleTradeSort("counterparty")} />
                  </th>
                  <th className="px-3 py-2.5">Sent</th>
                  <th className="px-3 py-2.5">Received</th>
                  <th className="px-3 py-2.5">
                    <SortableHeader label="Status" active={tradeSort.key === "status"} direction={tradeSort.direction} onClick={() => handleTradeSort("status")} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTrades.map((trade) => {
                  const isTrader = trade.trader.memberId === profile.member.id;
                  const sent = isTrader ? trade.traderSent : trade.tradeeSent;
                  const received = isTrader ? trade.tradeeSent : trade.traderSent;
                  const counterparty = isTrader ? trade.tradee.teamName : trade.trader.teamName;

                  return (
                    <tr key={trade.id} className="border-t border-line/70 bg-card/90 align-top transition hover:bg-card-2/70">
                      <td className="px-3 py-3 font-semibold text-fg">{trade.seasonYear}</td>
                      <td className="px-3 py-3 text-fg-secondary">{formatTradeDate(trade.postedAt)}</td>
                      <td className="px-3 py-3 text-fg-secondary">{counterparty ?? "League trade partner"}</td>
                      <td className="px-3 py-3 text-sm leading-6 text-fg-secondary">{formatTradeBundle(sent)}</td>
                      <td className="px-3 py-3 text-sm leading-6 text-fg-secondary">{formatTradeBundle(received)}</td>
                      <td className="px-3 py-3 font-semibold text-fg capitalize">{trade.status ?? "recorded"}</td>
                    </tr>
                  );
                })}
                {filteredTrades.length === 0 ? (
                  <tr className="border-t border-line/70 bg-card/90">
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-fg-secondary">
                      No trades showed up for that season. Either peace broke out or nobody hit accept.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
