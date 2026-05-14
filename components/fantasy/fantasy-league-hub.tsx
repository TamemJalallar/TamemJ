"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useDeferredValue, useEffect, useState } from "react";
import { FantasySectionNav } from "@/components/fantasy/fantasy-section-nav";
import { resolveFantasyLiveLeagueUrl, isFantasyLiveLeagueEnvelope } from "@/lib/fantasy-live";
import type {
  FantasyDraftPick,
  FantasyDraftView,
  FantasyKeeperCandidate,
  FantasyLeagueDataset,
  FantasyMatchup,
  FantasyMember,
  FantasyPlayerPosition,
  FantasySeason,
  FantasyStanding,
  FantasyTeamIdentity,
  FantasyTrade
} from "@/types/fantasy";
import type { FantasyLiveLeagueEnvelope } from "@/types/fantasy-live";

type DraftSortKey = "overall" | "round" | "team" | "player" | "position" | "nfl";
type DraftSortDirection = "asc" | "desc";
type KeeperViewFilter = "all" | "eligible" | "selected";
type TeamSortKey = "manager" | "team" | "titles" | "playoffs" | "record";
type TeamSortDirection = "asc" | "desc";

const teamSortOptions: Array<{ value: TeamSortKey; label: string }> = [
  { value: "titles", label: "Titles" },
  { value: "playoffs", label: "Playoffs" },
  { value: "record", label: "All-time" },
  { value: "manager", label: "Manager" },
  { value: "team", label: "Team" }
];

const sectionItems = [
  { id: "overview", label: "Overview" },
  { id: "draft-results", label: "Draft Results" },
  { id: "keepers", label: "Keepers" },
  { id: "league-history", label: "League History" },
  { id: "records", label: "Records" },
  { id: "teams", label: "Teams" }
] as const;

const draftViews: Array<{ value: FantasyDraftView; label: string }> = [
  { value: "board", label: "Board View" },
  { value: "table", label: "Table View" },
  { value: "team", label: "By Team View" }
];

const positions: Array<FantasyPlayerPosition | "all"> = ["all", "QB", "RB", "WR", "TE", "K", "DST"];
const visualPositionOrder: FantasyPlayerPosition[] = ["RB", "WR", "QB", "TE", "K", "DST"];
const potentialKeeperRoundStart = 10;
const keeperViewFilters: Array<{ value: KeeperViewFilter; label: string }> = [
  { value: "all", label: "All candidates" },
  { value: "eligible", label: "Eligible only" },
  { value: "selected", label: "Chosen only" }
];

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function formatRecord(team: FantasyTeamIdentity): string {
  return `${team.allTimeRecord.wins}-${team.allTimeRecord.losses}${team.allTimeRecord.ties ? `-${team.allTimeRecord.ties}` : ""}`;
}

function formatStandingRecord(standing: FantasyStanding): string {
  return `${standing.wins}-${standing.losses}${standing.ties ? `-${standing.ties}` : ""}`;
}

function getInitials(value: string): string {
  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function getMargin(matchup: FantasyMatchup): number {
  return Math.abs(matchup.homeScore - matchup.awayScore);
}

function formatPoints(value: number): string {
  return value.toFixed(1);
}

function formatTradeDate(value?: string | null): string {
  if (!value) return "Date pending";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatTradeStatus(value?: string | null): string {
  if (!value) return "Recorded";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatTradeBundle(players: FantasyTrade["traderSent"]): string {
  if (players.length === 0) return "No players logged";
  return players.map((player) => `${player.playerName}${player.position ? ` (${player.position})` : ""}`).join(", ");
}

function getPrimaryRivalLabel(note?: string): string | null {
  if (!note) return null;
  const match = note.match(/against (.+?) at/i);
  return match?.[1]?.trim() ?? null;
}

function isPotentialKeeperDraftPick(pick: FantasyDraftPick): boolean {
  return pick.round >= potentialKeeperRoundStart;
}

function getWinningPercentage(record: FantasyTeamIdentity["allTimeRecord"]): number {
  const totalGames = record.wins + record.losses + record.ties;
  if (totalGames === 0) return 0;
  return (record.wins + record.ties * 0.5) / totalGames;
}

function CrownGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
      <path d="M3.5 15.5h13l-1.1-7.2-3.1 2-2.3-4-2.3 4-3.1-2-1.1 7.2Zm1.7-1.5.5-3.6 2.2 1.4 2.1-3.5 2.1 3.5 2.2-1.4.5 3.6h-9.6Z" />
    </svg>
  );
}

function overallPickToRound(overallPick: number, leagueSize: number): number {
  return Math.max(1, Math.ceil(overallPick / leagueSize));
}

function formatKeeperCostFormula(
  candidate: Pick<FantasyKeeperCandidate, "keeperCostOverallPick" | "keeperCostRound">,
  player?: { adp?: number }
): string | null {
  if (typeof player?.adp !== "number") return null;
  if (!candidate.keeperCostOverallPick || !candidate.keeperCostRound) {
    return `FantasyPros ${player.adp} -> Review required`;
  }

  return `FantasyPros ${player.adp} -> Cost Pick ${candidate.keeperCostOverallPick} -> Round ${candidate.keeperCostRound}`;
}

function getStandingDisplayName(standing: FantasyStanding, team?: FantasyTeamIdentity): string {
  return standing.displayName ?? team?.teamName ?? "League team";
}

function getStandingShortName(standing: FantasyStanding, team?: FantasyTeamIdentity): string {
  return standing.shortName ?? team?.shortName ?? standing.displayName ?? team?.teamName ?? "League team";
}

function getDraftPickTeamName(pick: FantasyDraftPick, team?: FantasyTeamIdentity): string {
  return pick.teamDisplayName ?? team?.teamName ?? "League team";
}

function getDraftPickTeamShortName(pick: FantasyDraftPick, team?: FantasyTeamIdentity): string {
  return pick.teamShortName ?? team?.shortName ?? pick.teamDisplayName ?? team?.teamName ?? "League team";
}

function getCountdownLabel(value: string): string {
  const now = Date.now();
  const target = new Date(value).getTime();
  const diff = target - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days > 1) return `${days} days`;
  if (days === 1) return "1 day";
  if (days === 0) return "Today";
  return `${Math.abs(days)} days ago`;
}

function classForViewButton(active: boolean): string {
  return active
    ? "rounded-full border border-primary-300 bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700 transition dark:border-primary-400/55 dark:bg-primary-500/25 dark:text-primary-100"
    : "filter-chip";
}

function classForKeeperFilterButton(active: boolean): string {
  return active
    ? "rounded-full border border-primary-300 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 transition dark:border-primary-400/55 dark:bg-primary-500/25 dark:text-primary-100"
    : "rounded-full border border-line/70 bg-card px-3 py-1.5 text-xs font-semibold text-fg-secondary transition hover:border-primary-200 hover:text-fg dark:hover:border-primary-400/30";
}

function classForTeamSortButton(active: boolean): string {
  return active
    ? "rounded-full border border-amber-300/60 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition dark:border-amber-400/35 dark:bg-amber-500/12 dark:text-amber-100"
    : "rounded-full border border-line/70 bg-card px-3 py-1.5 text-xs font-semibold text-fg-secondary transition hover:border-primary-200 hover:text-fg dark:hover:border-primary-400/30";
}

function createPositionCounts(): Record<FantasyPlayerPosition, number> {
  return {
    QB: 0,
    RB: 0,
    WR: 0,
    TE: 0,
    K: 0,
    DST: 0
  };
}

function getDraftPositionCounts(
  picks: FantasyDraftPick[],
  playersById: Map<string, { position: FantasyPlayerPosition }>
): Record<FantasyPlayerPosition, number> {
  const counts = createPositionCounts();

  for (const pick of picks) {
    const player = playersById.get(pick.playerId);
    if (!player) continue;
    counts[player.position] += 1;
  }

  return counts;
}

function getPositionVisualClass(position: FantasyPlayerPosition): string {
  switch (position) {
    case "QB":
      return "bg-gradient-to-r from-sky-500 to-cyan-300";
    case "RB":
      return "bg-gradient-to-r from-emerald-500 to-lime-300";
    case "WR":
      return "bg-gradient-to-r from-violet-500 to-fuchsia-300";
    case "TE":
      return "bg-gradient-to-r from-amber-500 to-orange-300";
    case "K":
      return "bg-gradient-to-r from-slate-500 to-slate-300";
    case "DST":
      return "bg-gradient-to-r from-rose-500 to-pink-300";
    default:
      return "bg-card-2/80";
  }
}

function LeagueMark({ label, logoUrl }: { label: string; logoUrl?: string }) {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-[28px] border border-white/20 bg-slate-950/60 shadow-lg shadow-slate-950/35 ring-1 ring-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.35),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(37,99,235,0.45),transparent_36%),linear-gradient(145deg,rgba(15,23,42,0.92),rgba(2,6,23,0.98))]" />
      <div className="absolute inset-x-3 top-2 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[20px] border border-white/10 bg-white/5 text-center font-display text-2xl font-semibold tracking-[0.2em] text-white backdrop-blur-sm">
        {logoUrl ? (
          <Image src={logoUrl} alt={`${label} league logo`} fill sizes="64px" className="object-cover" />
        ) : (
          label
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="surface-card bg-card/75 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-3 font-display text-2xl font-semibold text-fg">{value}</p>
      {hint ? <p className="mt-1 text-xs text-fg-secondary">{hint}</p> : null}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 font-display text-2xl font-semibold text-fg sm:text-3xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-fg-secondary sm:text-base">{description}</p>
    </div>
  );
}

function CollapsibleSection({
  id,
  eyebrow,
  title,
  description,
  defaultOpen = true,
  children,
  rightSlot
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  defaultOpen?: boolean;
  children: ReactNode;
  rightSlot?: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section id={id} className="scroll-mt-28">
      <div className="rounded-[28px] border border-line/60 bg-card/20 px-4 py-4 sm:px-5 sm:py-5">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          className="block w-full text-left"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
            <div className="flex items-center gap-3">
              {rightSlot}
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-line/70 bg-card/80 text-fg-secondary transition ${isOpen ? "rotate-180" : ""}`}>
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 8 5 5 5-5" />
                </svg>
              </span>
            </div>
          </div>
        </button>
        {isOpen ? <div className="mt-6 space-y-6">{children}</div> : null}
      </div>
    </section>
  );
}

function EmptyDraftState() {
  return (
    <div className="surface-card rounded-[24px] border-dashed bg-card-2/50 p-8 text-center">
      <h3 className="font-display text-xl font-semibold text-fg">No draft picks match those filters</h3>
      <p className="mt-2 text-sm text-fg-secondary">Try clearing a team filter, widening the player search, or switching back to the full board.</p>
    </div>
  );
}

function getPlayoffFinishLabel(standing: FantasyStanding, summary: FantasySeason["summary"]): string {
  if (standing.teamId === summary.championTeamId) return "Champion";
  if (standing.teamId === summary.runnerUpTeamId) return "Runner-up";
  if (standing.playoffSeed) return `Seed ${standing.playoffSeed} • ${standing.playoffWins ?? 0}-${standing.playoffLosses ?? 0} playoff record`;
  return "Missed playoffs";
}

function getSeasonResultBadgeClass(label: string): string {
  if (label === "Champion") {
    return "border-emerald-400/35 bg-emerald-500/12 text-emerald-100";
  }
  if (label === "Runner-up") {
    return "border-sky-400/35 bg-sky-500/12 text-sky-100";
  }
  if (label.startsWith("Seed ")) {
    return "border-violet-400/35 bg-violet-500/12 text-violet-100";
  }
  return "border-line/70 bg-card text-fg-secondary";
}

function InfoGlyph({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line/70 bg-card/90 text-xs font-semibold text-fg-secondary transition hover:border-primary-300 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:hover:border-primary-400/45 dark:hover:text-primary-200"
    >
      i
    </button>
  );
}

function TeamProfileHoverCard({
  team,
  member,
  latestRecord,
  profileHref
}: {
  team: FantasyTeamIdentity;
  member?: FantasyMember;
  latestRecord?: string;
  profileHref: string;
}) {
  return (
    <div className="group/profile relative flex justify-end">
      <InfoGlyph label={`Open profile notes for ${team.teamName}`} />
      <div className="pointer-events-none fixed right-4 top-1/2 z-50 max-h-[70vh] w-[min(26rem,calc(100vw-2rem))] -translate-y-1/2 overflow-y-auto rounded-2xl border border-line/70 bg-[rgba(15,23,42,0.97)] p-4 opacity-0 shadow-2xl shadow-slate-950/55 transition duration-200 group-hover/profile:pointer-events-auto group-hover/profile:opacity-100 group-focus-within/profile:pointer-events-auto group-focus-within/profile:opacity-100">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Profile details</p>
        <div className="mt-3 space-y-3 text-sm leading-6 text-fg-secondary">
          <p><span className="font-semibold text-fg">Manager:</span> {member?.managerName ?? "League manager"}</p>
          <p><span className="font-semibold text-fg">Tag:</span> {member?.favoriteTeam ?? "Room regular"}</p>
          {latestRecord ? <p><span className="font-semibold text-fg">Latest record:</span> {latestRecord}</p> : null}
          <p><span className="font-semibold text-fg">Rivalry:</span> {member?.rivalryNote ?? "Still deciding who annoys them the most."}</p>
          <div>
            <p className="font-semibold text-fg">Seasonal draft tendencies</p>
            <div className="mt-2 space-y-2">
              {member?.draftTendenciesBySeason?.map((tendency) => (
                <div key={`${member.id}-${tendency.seasonId}`} className="rounded-2xl border border-line/60 bg-card/70 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{tendency.seasonYear}</span>
                    <span className="rounded-full border border-line/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-200">
                      {tendency.strategyLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-fg-secondary">{tendency.summary.replace(`${tendency.seasonYear}: `, "")}</p>
                </div>
              )) ?? <p>Draft personality report still loading.</p>}
            </div>
          </div>
          <p><span className="font-semibold text-fg">Profile note:</span> {team.notes}</p>
          <Link
            href={profileHref}
            className="inline-flex items-center rounded-full border border-primary-400/35 bg-primary-500/12 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-100 transition hover:border-primary-300 hover:bg-primary-500/20"
          >
            Open full draft profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export function FantasyLeagueHub({ data }: { data: FantasyLeagueDataset }) {
  const playersById = new Map(data.players.map((player) => [player.id, player]));
  const teamsById = new Map(data.teams.map((team) => [team.id, team]));
  const membersById = new Map(data.members.map((member) => [member.id, member]));
  const candidateByKey = new Map(data.keeperCandidates.map((candidate) => [`${candidate.teamId}:${candidate.playerId}`, candidate]));

  const seasonsNewestFirst = [...data.seasons].sort((left, right) => right.year - left.year);
  const currentSeason = seasonsNewestFirst.find((season) => season.status === "active") ?? seasonsNewestFirst[0];
  const latestCompletedSeason = seasonsNewestFirst.find((season) => season.status === "completed") ?? currentSeason;
  const draftSeasons = seasonsNewestFirst.filter((season) => season.draftPicks.length > 0);
  const tradeSeasonOptions = [...new Set(data.trades.map((trade) => trade.seasonYear))].sort((left, right) => right - left);
  const [dashboardSeasonYear, setDashboardSeasonYear] = useState(latestCompletedSeason.year);
  const [tradeSeasonYear, setTradeSeasonYear] = useState(tradeSeasonOptions[0] ?? latestCompletedSeason.year);

  const [draftSeasonYear, setDraftSeasonYear] = useState(draftSeasons[0]?.year ?? currentSeason.year);
  const [draftView, setDraftView] = useState<FantasyDraftView>("table");
  const [draftTeamFilter, setDraftTeamFilter] = useState<string>("all");
  const [draftPositionFilter, setDraftPositionFilter] = useState<FantasyPlayerPosition | "all">("all");
  const [draftSearch, setDraftSearch] = useState("");
  const [draftSortKey, setDraftSortKey] = useState<DraftSortKey>("overall");
  const [draftSortDirection, setDraftSortDirection] = useState<DraftSortDirection>("asc");
  const deferredDraftSearch = useDeferredValue(draftSearch);

  const sourceSeason = data.seasons.find((season) => season.year === data.keeperRules.sourceSeasonYear) ?? latestCompletedSeason;
  const initialKeeperTeamId = data.teams[0]?.id ?? "";
  const [selectedKeeperTeamId, setSelectedKeeperTeamId] = useState(initialKeeperTeamId);
  const [selectedKeepersByTeamId, setSelectedKeepersByTeamId] = useState<Record<string, string[]>>({});
  const [keeperSearch, setKeeperSearch] = useState("");
  const [keeperViewFilter, setKeeperViewFilter] = useState<KeeperViewFilter>("all");
  const [keeperFeedback, setKeeperFeedback] = useState<string | null>(null);
  const [teamSortKey, setTeamSortKey] = useState<TeamSortKey>("titles");
  const [teamSortDirection, setTeamSortDirection] = useState<TeamSortDirection>("desc");
  const [liveLeague, setLiveLeague] = useState<FantasyLiveLeagueEnvelope | null>(null);
  const [liveLeagueLoading, setLiveLeagueLoading] = useState(false);
  const [liveLeagueError, setLiveLeagueError] = useState<string | null>(null);
  const deferredKeeperSearch = useDeferredValue(keeperSearch);

  useEffect(() => {
    const defaults: Record<string, string[]> = {};
    for (const team of data.teams) {
      defaults[team.id] = currentSeason.keeperSelections
        .filter((selection) => selection.teamId === team.id)
        .slice(0, data.keeperRules.maxKeepers)
        .map((selection) => selection.playerId);
    }
    setSelectedKeepersByTeamId(defaults);
  }, [currentSeason.keeperSelections, data.keeperRules.maxKeepers, data.teams]);

  useEffect(() => {
    const liveLeagueUrl = resolveFantasyLiveLeagueUrl();
    if (!liveLeagueUrl) {
      return;
    }
    const endpoint = liveLeagueUrl;

    const controller = new AbortController();
    let active = true;

    async function loadLiveLeague() {
      setLiveLeagueLoading(true);
      setLiveLeagueError(null);

      try {
        const response = await fetch(endpoint, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`Endpoint returned ${response.status}`);
        }

        const payload = (await response.json()) as unknown;
        if (!isFantasyLiveLeagueEnvelope(payload)) {
          throw new Error("Fantasy worker response shape was invalid");
        }

        if (!active) {
          return;
        }

        setLiveLeague(payload);
      } catch (error) {
        if (!active || controller.signal.aborted) {
          return;
        }

        const message = error instanceof Error ? error.message : "Unable to load live fantasy data";
        setLiveLeagueError(message);
      } finally {
        if (active) {
          setLiveLeagueLoading(false);
        }
      }
    }

    void loadLiveLeague();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const draftSeason = draftSeasons.find((season) => season.year === draftSeasonYear) ?? draftSeasons[0] ?? currentSeason;
  const normalizedDraftQuery = deferredDraftSearch.trim().toLowerCase();
  const liveLeagueIdentity = liveLeague?.data.league;
  const displayLeagueName = liveLeagueIdentity?.name ?? data.league.name;
  const displaySeasonYear = liveLeagueIdentity?.season ?? data.league.seasonYear;
  const displayWeekLabel =
    typeof liveLeagueIdentity?.currentWeek === "number" ? `Week ${liveLeagueIdentity.currentWeek}` : data.league.currentWeekLabel;
  const heroStatusLabel = liveLeague
    ? "Live Yahoo sync • league history below"
    : liveLeagueLoading
      ? "Checking Yahoo sync"
      : liveLeagueError
      ? "League history • live sync pending"
        : "League hub";
  const overviewDescription = "Switch seasons, compare standings, and read title runs, playoff fields, trades, and how each year finished.";
  const dashboardSeason = seasonsNewestFirst.find((season) => season.year === dashboardSeasonYear) ?? latestCompletedSeason;

  const filteredDraftPicks = [...draftSeason.draftPicks]
    .filter((pick) => {
      const player = playersById.get(pick.playerId);
      const team = teamsById.get(pick.teamId);
      if (!player || !team) return false;
      if (draftTeamFilter !== "all" && pick.teamId !== draftTeamFilter) return false;
      if (draftPositionFilter !== "all" && player.position !== draftPositionFilter) return false;
      if (!normalizedDraftQuery) return true;

      return [player.name, player.position, player.nflTeam, team.teamName, team.shortName]
        .join(" ")
        .toLowerCase()
        .includes(normalizedDraftQuery);
    })
    .sort((left, right) => {
      const leftPlayer = playersById.get(left.playerId);
      const rightPlayer = playersById.get(right.playerId);
      const leftTeam = teamsById.get(left.teamId);
      const rightTeam = teamsById.get(right.teamId);

      let comparison = 0;
      switch (draftSortKey) {
        case "overall":
          comparison = left.overallPick - right.overallPick;
          break;
        case "round":
          comparison = left.round - right.round || left.pickInRound - right.pickInRound;
          break;
        case "team":
          comparison = (leftTeam?.teamName ?? "").localeCompare(rightTeam?.teamName ?? "");
          break;
        case "player":
          comparison = (leftPlayer?.name ?? "").localeCompare(rightPlayer?.name ?? "");
          break;
        case "position":
          comparison = (leftPlayer?.position ?? "").localeCompare(rightPlayer?.position ?? "");
          break;
        case "nfl":
          comparison = (leftPlayer?.nflTeam ?? "").localeCompare(rightPlayer?.nflTeam ?? "");
          break;
      }

      if (comparison === 0) {
        comparison = left.overallPick - right.overallPick;
      }

      return draftSortDirection === "asc" ? comparison : comparison * -1;
    });

  const currentStandings = [...dashboardSeason.standings].sort((left, right) => left.rank - right.rank);
  const topScoringStanding = [...currentStandings].sort((left, right) => right.pointsFor - left.pointsFor)[0];
  const lowestScoringStanding = [...currentStandings].sort((left, right) => left.pointsFor - right.pointsFor)[0];
  const closestMatchup = [...dashboardSeason.matchups].sort((left, right) => getMargin(left) - getMargin(right))[0];
  const biggestBlowout = [...dashboardSeason.matchups].sort((left, right) => getMargin(right) - getMargin(left))[0];
  const dashboardChampion = teamsById.get(dashboardSeason.summary.championTeamId);
  const dashboardRunnerUp = teamsById.get(dashboardSeason.summary.runnerUpTeamId);
  const dashboardRegularSeasonWinner = teamsById.get(dashboardSeason.summary.regularSeasonWinnerTeamId);
  const dashboardPlayoffTeams = currentStandings
    .filter((standing) => standing.playoffSeed !== null && standing.playoffSeed !== undefined)
    .sort((left, right) => (left.playoffSeed ?? 99) - (right.playoffSeed ?? 99));
  const scoringLadder = [...currentStandings].sort((left, right) => right.pointsFor - left.pointsFor).slice(0, 6);
  const maxSeasonPoints = Math.max(...currentStandings.map((standing) => standing.pointsFor), 1);
  const dashboardDraftPositionCounts = getDraftPositionCounts(dashboardSeason.draftPicks, playersById);
  const dashboardDraftPositionTotal = Object.values(dashboardDraftPositionCounts).reduce((sum, value) => sum + value, 0) || 1;
  const dashboardKeeperPickCount = dashboardSeason.draftPicks.filter((pick) => pick.isKeeper).length;
  const tradesNewestFirst = [...data.trades].sort((left, right) => {
    return new Date(right.postedAt ?? 0).getTime() - new Date(left.postedAt ?? 0).getTime();
  });
  const selectedTradeSeasonYear = tradeSeasonOptions.includes(tradeSeasonYear) ? tradeSeasonYear : tradeSeasonOptions[0] ?? latestCompletedSeason.year;
  const selectedTradeSeasonTrades = tradesNewestFirst.filter((trade) => trade.seasonYear === selectedTradeSeasonYear);
  const dashboardSeasonTrades = selectedTradeSeasonTrades.slice(0, 4);

  const mostDecoratedTeam = [...data.teams].sort((left, right) => right.championships - left.championships || left.teamName.localeCompare(right.teamName))[0];
  const titleBoard = [...data.teams]
    .sort((left, right) => right.championships - left.championships || right.playoffAppearances - left.playoffAppearances || left.teamName.localeCompare(right.teamName))
    .slice(0, 6);
  const maxTitles = Math.max(...titleBoard.map((team) => team.championships), 1);
  const totalDraftPicksTracked = data.seasons.reduce((total, season) => total + season.draftPicks.length, 0);
  const yearsActive = data.league.seasonYear - data.league.establishedYear + 1;
  const defendingChampion = teamsById.get(latestCompletedSeason.summary.championTeamId);
  const defendingChampionMember = defendingChampion ? membersById.get(defendingChampion.memberId) : undefined;
  const nextDraftCountdown = getCountdownLabel(data.league.nextDraftDate);

  const sourceRoster: Array<{ pick: FantasyDraftPick; player: { id: string; name: string; position: FantasyPlayerPosition; nflTeam: string; adp?: number }; candidate: FantasyKeeperCandidate | undefined }> = [];
  [...sourceSeason.draftPicks]
    .filter((pick) => pick.teamId === selectedKeeperTeamId)
    .sort((left, right) => left.overallPick - right.overallPick)
    .forEach((pick) => {
      const player = playersById.get(pick.playerId);
      if (!player) return;
      sourceRoster.push({
        pick,
        player,
        candidate: candidateByKey.get(`${pick.teamId}:${pick.playerId}`)
      });
    });

  const selectedKeeperPlayerIds = selectedKeepersByTeamId[selectedKeeperTeamId] ?? [];

  const selectedKeeperCandidates = sourceRoster
    .filter((entry) => selectedKeeperPlayerIds.includes(entry.pick.playerId))
    .map((entry) => entry.candidate ?? {
      id: `${entry.pick.teamId}-${entry.pick.playerId}`,
      seasonYear: sourceSeason.year,
      teamId: entry.pick.teamId,
      playerId: entry.pick.playerId,
      previousDraftRound: entry.pick.round,
      keeperCostRound: undefined,
      yearsKept: 0,
      eligible: false
    });
  const overflowKeeperCandidates = selectedKeeperCandidates.slice(data.keeperRules.maxKeepers);

  const keeperWarnings: string[] = [];
  if (selectedKeeperCandidates.length > data.keeperRules.maxKeepers) {
    keeperWarnings.push(`Maximum keepers exceeded. This league allows ${data.keeperRules.maxKeepers} keepers.`);
  }
  if (selectedKeeperCandidates.some((candidate) => !candidate.eligible)) {
    keeperWarnings.push("One or more selected players are not eligible under the current keeper rules.");
  }
  if (selectedKeeperCandidates.some((candidate) => candidate.keeperCostRound === undefined)) {
    keeperWarnings.push("At least one selected player is missing a valid keeper cost round.");
  }
  const selectedPositions = selectedKeeperCandidates
    .map((candidate) => playersById.get(candidate.playerId)?.position)
    .filter((value): value is FantasyPlayerPosition => Boolean(value));
  const duplicatePosition = selectedPositions.find((position, index) => selectedPositions.indexOf(position) !== index);
  if (duplicatePosition) {
    keeperWarnings.push(`Duplicate position warning: you selected multiple ${duplicatePosition} keepers.`);
  }

  const normalizedKeeperQuery = deferredKeeperSearch.trim().toLowerCase();
  const keeperCandidateRoster = sourceRoster.filter(({ candidate }) => candidate?.eligible ?? false);
  const visibleSourceRoster = keeperCandidateRoster.filter(({ pick, player, candidate }) => {
    if (keeperViewFilter === "eligible" && !(candidate?.eligible ?? false)) return false;
    if (keeperViewFilter === "selected" && !selectedKeeperPlayerIds.includes(pick.playerId)) return false;
    if (!normalizedKeeperQuery) return true;

    return [
      player.name,
      player.position,
      player.nflTeam,
      `round ${pick.round}`,
      candidate?.notes ?? ""
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedKeeperQuery);
  });
  const draftPicksByTeam = new Map<string, FantasyDraftPick[]>();
  for (const pick of draftSeason.draftPicks) {
    if (!draftPicksByTeam.has(pick.teamId)) {
      draftPicksByTeam.set(pick.teamId, []);
    }
    draftPicksByTeam.get(pick.teamId)?.push(pick);
  }
  const draftIntegrityGaps = draftSeason.teamOrder
    .map((teamId) => {
      const picks = draftPicksByTeam.get(teamId) ?? [];
      const roundsPresent = new Set(picks.map((pick) => pick.round));
      const missingRounds = Array.from({ length: draftSeason.draftRounds }, (_, index) => index + 1).filter(
        (round) => !roundsPresent.has(round)
      );
      return {
        teamId,
        count: picks.length,
        missingRounds
      };
    })
    .filter((entry) => entry.missingRounds.length > 0);
  const draftPositionCounts = getDraftPositionCounts(draftSeason.draftPicks, playersById);
  const draftPositionTotal = Object.values(draftPositionCounts).reduce((sum, value) => sum + value, 0) || 1;
  const keeperRoundHeatmap = Array.from({ length: draftSeason.draftRounds }, (_, index) => {
    const round = index + 1;
    const keeperCount = draftSeason.draftPicks.filter((pick) => pick.round === round && pick.isKeeper).length;
    return {
      round,
      keeperCount
    };
  });
  const maxKeeperRoundCount = Math.max(...keeperRoundHeatmap.map((entry) => entry.keeperCount), 1);
  const sortedTeams = [...data.teams].toSorted((left, right) => {
    let comparison = 0;

    switch (teamSortKey) {
      case "manager":
        comparison = (membersById.get(left.memberId)?.managerName ?? "").localeCompare(membersById.get(right.memberId)?.managerName ?? "");
        break;
      case "team":
        comparison = left.teamName.localeCompare(right.teamName);
        break;
      case "titles":
        comparison = left.championships - right.championships;
        break;
      case "playoffs":
        comparison = left.playoffAppearances - right.playoffAppearances;
        break;
      case "record":
        comparison =
          getWinningPercentage(left.allTimeRecord) - getWinningPercentage(right.allTimeRecord) ||
          left.allTimeRecord.wins - right.allTimeRecord.wins;
        break;
    }

    if (comparison === 0) {
      comparison = left.teamName.localeCompare(right.teamName);
    }

    return teamSortDirection === "asc" ? comparison : comparison * -1;
  });

  function setDraftSort(key: DraftSortKey) {
    if (draftSortKey === key) {
      setDraftSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setDraftSortKey(key);
    setDraftSortDirection("asc");
  }

  function setTeamSort(key: TeamSortKey) {
    if (teamSortKey === key) {
      setTeamSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setTeamSortKey(key);
    setTeamSortDirection(key === "manager" || key === "team" ? "asc" : "desc");
  }

  function toggleKeeper(playerId: string) {
    setSelectedKeepersByTeamId((current) => {
      const existing = current[selectedKeeperTeamId] ?? [];

      const nextForTeam = existing.includes(playerId)
        ? existing.filter((value) => value !== playerId)
        : data.keeperRules.maxKeepers === 1
          ? [playerId]
          : [...existing.slice(0, Math.max(0, data.keeperRules.maxKeepers - 1)), playerId];

      return {
        ...current,
        [selectedKeeperTeamId]: nextForTeam
      };
    });
    setKeeperFeedback(null);
  }

  async function copyKeeperSummary() {
    const team = teamsById.get(selectedKeeperTeamId);
    if (!team || selectedKeeperCandidates.length === 0) {
      setKeeperFeedback("Select at least one keeper before copying a summary.");
      return;
    }

    const summary = [
      `${data.league.name} — ${data.keeperRules.targetSeasonYear} keeper summary`,
      `Team: ${team.teamName}`,
      `Deadline: ${formatDateTime(data.keeperRules.deadline)}`,
      "",
      ...selectedKeeperCandidates.map((candidate) => {
        const player = playersById.get(candidate.playerId);
        if (!player) return "";
        const keeperFormula = formatKeeperCostFormula(candidate, player);
        const costFallback = candidate.keeperCostRound ? `Cost Round ${candidate.keeperCostRound}` : "Current cost review required";
        return `- ${player.name} (${player.position}, ${player.nflTeam}) — drafted Round ${candidate.previousDraftRound ?? "n/a"}, ${keeperFormula ?? costFallback}`;
      })
    ]
      .filter(Boolean)
      .join("\n");

    await navigator.clipboard.writeText(summary);
    setKeeperFeedback("Keeper summary copied to clipboard.");
  }

  function exportKeeperSelections() {
    const team = teamsById.get(selectedKeeperTeamId);
    if (!team) {
      setKeeperFeedback("Select a team before exporting keepers.");
      return;
    }

    const payload = {
      league: data.league.name,
      targetSeasonYear: data.keeperRules.targetSeasonYear,
      team: team.teamName,
      selections: selectedKeeperCandidates.map((candidate) => {
        const player = playersById.get(candidate.playerId);
        return {
          playerName: player?.name ?? candidate.playerId,
          position: player?.position,
          nflTeam: player?.nflTeam,
          previousDraftRound: candidate.previousDraftRound,
          keeperCostRound: candidate.keeperCostRound,
          keeperCostOverallPick: candidate.keeperCostOverallPick,
          yearsKept: candidate.yearsKept,
          eligible: candidate.eligible,
          notes: candidate.notes ?? ""
        };
      })
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${team.teamName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-keepers.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setKeeperFeedback("Keeper export downloaded.");
  }

  return (
    <div className="section-shell pt-10 sm:pt-14">
      <div className="page-shell space-y-6">
        <section className="hero-surface p-6 sm:p-8 lg:p-10">
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow">Fantasy League Hub</span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
                  {heroStatusLabel}
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
                <LeagueMark label={data.league.logoText} logoUrl={data.league.logoUrl} />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">{displaySeasonYear} Season Hub</p>
                  <h1 className="mt-3 text-balance font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
                    {displayLeagueName}
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200/90 sm:text-base">
                    {data.league.tagline}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link href="#draft-results" className="btn-primary">
                  Jump to Draft Board
                </Link>
                <Link href="#keepers" className="btn-secondary">
                  Open Keeper Lab
                </Link>
                <Link href="#teams" className="btn-ghost border-white/20 text-white hover:bg-white/10 hover:text-white">
                  View Team Profiles
                </Link>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard label="Current season" value={String(displaySeasonYear)} hint={displayWeekLabel} />
                <StatCard label="League size" value={`${data.league.leagueSize} teams`} hint={data.league.location} />
                <StatCard label="Years active" value={`${yearsActive}`} hint={`Since ${data.league.establishedYear}`} />
                <StatCard label="Defending champion" value={defendingChampion?.shortName ?? "TBD"} hint={defendingChampionMember?.managerName} />
                <StatCard label="Draft picks tracked" value={`${totalDraftPicksTracked}`} hint="Historic and current boards" />
                <StatCard label="Keeper deadline" value={formatDate(data.keeperRules.deadline)} hint={`${data.keeperRules.targetSeasonYear} cycle`} />
              </div>
            </div>

            <div className="surface-card-strong p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Champion callout</p>
              <div className="mt-4 flex items-start gap-4">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${defendingChampion?.colors.primary ?? "#2563EB"}, ${defendingChampion?.colors.secondary ?? "#06B6D4"})` }}
                >
                  {getInitials(defendingChampion?.shortName ?? "FF")}
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold text-fg">{defendingChampion?.teamName ?? "League Champion"}</h2>
                  <p className="mt-1 text-sm font-medium text-primary-600 dark:text-primary-300">{defendingChampionMember?.managerName ?? "Manager TBD"}</p>
                  <p className="mt-3 text-sm leading-7 text-fg-secondary">
                    {defendingChampion?.teamName ?? "This roster"} enters the season as the team to chase after finishing {formatRecord(defendingChampion ?? data.teams[0])} all-time with {defendingChampion?.championships ?? 0} championships.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-line/70 bg-card-2/70 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">League record summary</p>
                  <p className="mt-2 text-sm text-fg-secondary">
                    {mostDecoratedTeam.teamName} owns the most titles at <span className="font-semibold text-fg">{mostDecoratedTeam.championships}</span>, while the current one-seed pace belongs to {teamsById.get(currentStandings[0]?.teamId)?.teamName ?? "the leader"}.
                  </p>
                </div>
                <div className="rounded-2xl border border-line/70 bg-card-2/70 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Next draft placeholder</p>
                  <p className="mt-2 text-sm text-fg-secondary">
                    The next draft window is set for <span className="font-semibold text-fg">{formatDateTime(data.league.nextDraftDate)}</span>.
                  </p>
                  <p className="mt-2 text-xs font-semibold text-primary-600 dark:text-primary-300">Countdown: {nextDraftCountdown}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FantasySectionNav items={[...sectionItems]} />

        <CollapsibleSection
          id="overview"
          eyebrow="League Dashboard"
          title="Current season dashboard"
          description={overviewDescription}
        >

          <div className="flex justify-end">
            <label className="w-full max-w-[12rem] space-y-2 text-sm font-medium text-fg">
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">Season</span>
              <select
                value={dashboardSeasonYear}
                onChange={(event) => setDashboardSeasonYear(Number(event.target.value))}
                className="w-full px-3 py-2.5 text-sm"
              >
                {seasonsNewestFirst.map((season) => (
                  <option key={season.year} value={season.year}>{season.year}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="surface-card-strong p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Season standings</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-fg">{dashboardSeason.label}</h3>
                </div>
                <span className="rounded-full border border-line/70 bg-card px-3 py-1 text-xs font-semibold text-fg-secondary">{dashboardSeason.weekLabel}</span>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-line/70">
                <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 border-b border-line/70 bg-card-2/70 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  <span>Rank</span>
                  <span>Team</span>
                  <span>Record</span>
                  <span>PF</span>
                  <span>PA</span>
                </div>
                <div className="divide-y divide-line/70">
                  {currentStandings.map((standing) => {
                    const team = teamsById.get(standing.teamId);
                    const member = team ? membersById.get(team.memberId) : undefined;
                    return (
                      <div key={standing.teamId} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 px-4 py-3 text-sm">
                        <span className="font-display text-lg font-semibold text-fg">{standing.rank}</span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-fg">{getStandingDisplayName(standing, team)}</p>
                          <p className="truncate text-xs text-muted">{member?.managerName} • {standing.streak}</p>
                        </div>
                        <span className="font-medium text-fg">{formatStandingRecord(standing)}</span>
                        <span className="font-medium text-fg">{formatPoints(standing.pointsFor)}</span>
                        <span className="font-medium text-fg-secondary">{formatPoints(standing.pointsAgainst)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="surface-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Season outcome</p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-line/70 bg-card-2/70 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Champion</p>
                    <p className="mt-1 text-sm font-semibold text-fg">{dashboardChampion?.teamName ?? "League champ"}</p>
                    <p className="mt-1 text-xs text-fg-secondary">
                      Championship matchup vs {dashboardRunnerUp?.teamName ?? "runner-up"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-line/70 bg-card-2/70 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Regular-season winner</p>
                    <p className="mt-1 text-sm font-semibold text-fg">{dashboardRegularSeasonWinner?.teamName ?? "Season leader"}</p>
                    <p className="mt-1 text-xs text-fg-secondary">
                      Playoffs started in Week {dashboardSeason.playoffStartWeek ?? "TBD"} with {dashboardSeason.numPlayoffTeams} teams.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-line/70 bg-card-2/70 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Playoff matchups</p>
                    <p className="mt-1 text-sm text-fg-secondary">
                      Championship closed as {dashboardChampion?.shortName ?? "Champ"} vs {dashboardRunnerUp?.shortName ?? "Runner-up"}.
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      We have the seeds, final finish, and playoff records here, even if every game-by-game bracket pair was not logged. The table below still shows the full playoff field for the selected season.
                    </p>
                  </div>
                </div>
              </div>

              <div className="surface-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Playoff field</p>
                <div className="mt-4 overflow-hidden rounded-2xl border border-line/70">
                  <div className="grid grid-cols-[auto_1fr_auto] gap-3 border-b border-line/70 bg-card-2/70 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                    <span>Seed</span>
                    <span>Team</span>
                    <span>Finish</span>
                  </div>
                  <div className="divide-y divide-line/70">
                    {dashboardPlayoffTeams.map((standing) => {
                      const team = teamsById.get(standing.teamId);
                      return (
                        <div key={`playoff-${standing.teamId}`} className="grid grid-cols-[auto_1fr_auto] gap-3 px-4 py-3 text-sm">
                          <span className="font-display text-lg font-semibold text-fg">{standing.playoffSeed}</span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-fg">{getStandingDisplayName(standing, team)}</p>
                            <p className="truncate text-xs text-muted">
                              {formatStandingRecord(standing)} regular season
                            </p>
                          </div>
                          <span className="text-right text-xs font-medium text-fg-secondary">
                            {getPlayoffFinishLabel(standing, dashboardSeason.summary)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="surface-card p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Season trade wire</p>
                    <p className="mt-1 text-sm text-fg-secondary">The deals that moved the room around in {selectedTradeSeasonYear}.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="space-y-2 text-sm font-medium text-fg">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Season</span>
                      <select value={selectedTradeSeasonYear} onChange={(event) => setTradeSeasonYear(Number(event.target.value))} className="min-w-[8.5rem] px-3 py-2 text-sm">
                        {tradeSeasonOptions.map((seasonYear) => (
                          <option key={`trade-wire-${seasonYear}`} value={seasonYear}>{seasonYear}</option>
                        ))}
                      </select>
                    </label>
                    <span className="rounded-full border border-line/70 bg-card px-3 py-1 text-xs font-semibold text-fg-secondary">
                      {dashboardSeasonTrades.length} shown
                    </span>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {dashboardSeasonTrades.length > 0 ? dashboardSeasonTrades.map((trade) => (
                    <div key={`dashboard-trade-${trade.transactionKey}`} className="rounded-2xl border border-line/70 bg-card-2/70 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-fg">{trade.trader.teamName} ↔ {trade.tradee.teamName}</p>
                          <p className="mt-1 text-xs text-fg-secondary">{trade.weekLabel ?? formatTradeDate(trade.postedAt)}</p>
                        </div>
                        <span className="rounded-full border border-line/70 bg-card px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-fg-secondary">
                          {formatTradeStatus(trade.status)}
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">{trade.trader.teamName} sent</p>
                          <p className="mt-1 text-xs leading-6 text-fg-secondary">{formatTradeBundle(trade.traderSent)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">{trade.tradee.teamName} sent</p>
                          <p className="mt-1 text-xs leading-6 text-fg-secondary">{formatTradeBundle(trade.tradeeSent)}</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="rounded-2xl border border-line/70 bg-card-2/70 p-4 text-sm text-fg-secondary">
                      No trades were logged for this season. Either everybody played nice or every offer died in the chat.
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <StatCard
                  label="Top scoring team"
                  value={teamsById.get(topScoringStanding?.teamId ?? "")?.shortName ?? "TBD"}
                  hint={topScoringStanding ? `${formatPoints(topScoringStanding.pointsFor)} points for` : undefined}
                />
                <StatCard
                  label="Lowest scoring team"
                  value={teamsById.get(lowestScoringStanding?.teamId ?? "")?.shortName ?? "TBD"}
                  hint={lowestScoringStanding ? `${formatPoints(lowestScoringStanding.pointsFor)} points for` : undefined}
                />
                <StatCard
                  label="Closest matchup"
                  value={closestMatchup ? `${formatPoints(getMargin(closestMatchup))} pts` : "TBD"}
                  hint={closestMatchup ? `${teamsById.get(closestMatchup.homeTeamId)?.shortName} vs ${teamsById.get(closestMatchup.awayTeamId)?.shortName}` : undefined}
                />
                <StatCard
                  label="Biggest blowout"
                  value={biggestBlowout ? `${formatPoints(getMargin(biggestBlowout))} pts` : "TBD"}
                  hint={biggestBlowout ? `${teamsById.get(biggestBlowout.homeTeamId)?.shortName} vs ${teamsById.get(biggestBlowout.awayTeamId)?.shortName}` : undefined}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="surface-card-strong relative overflow-hidden p-5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_38%)]" />
              <div className="relative">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Season visual</p>
                    <h3 className="mt-1 font-display text-xl font-semibold text-fg">Scoring ladder</h3>
                  </div>
                  <span className="rounded-full border border-line/70 bg-card px-3 py-1 text-xs font-semibold text-fg-secondary">
                    Top {scoringLadder.length} by points for
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {scoringLadder.map((standing) => {
                    const team = teamsById.get(standing.teamId);
                    return (
                      <div key={`scoring-ladder-${standing.teamId}`} className="rounded-2xl border border-line/70 bg-card/75 p-3">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-fg">{getStandingDisplayName(standing, team)}</p>
                            <p className="truncate text-xs text-fg-secondary">{formatStandingRecord(standing)} • {standing.streak}</p>
                          </div>
                          <span className="font-display text-lg font-semibold text-fg">{formatPoints(standing.pointsFor)}</span>
                        </div>
                        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-card-2/80 shadow-inner shadow-black/20">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary-500 via-sky-400 to-cyan-300 shadow-[0_0_18px_rgba(96,165,250,0.35)]"
                            style={{ width: `${Math.max(12, (standing.pointsFor / maxSeasonPoints) * 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="surface-card-strong relative overflow-hidden p-5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.12),transparent_40%)]" />
              <div className="relative">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Season visual</p>
                    <h3 className="mt-1 font-display text-xl font-semibold text-fg">Draft DNA</h3>
                  </div>
                  <span className="rounded-full border border-line/70 bg-card px-3 py-1 text-xs font-semibold text-fg-secondary">
                    {dashboardKeeperPickCount} keeper-tagged picks
                  </span>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-card-2/80 shadow-inner shadow-black/20">
                  {visualPositionOrder.map((position) => {
                    const count = dashboardDraftPositionCounts[position];
                    if (!count) return null;
                    return (
                      <div
                        key={`dashboard-draft-dna-${dashboardSeason.year}-${position}`}
                        className={`h-full ${getPositionVisualClass(position)}`}
                        style={{ width: `${(count / dashboardDraftPositionTotal) * 100}%` }}
                      />
                    );
                  })}
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {visualPositionOrder.map((position) => (
                    <div key={`dashboard-dna-chip-${position}`} className="rounded-2xl border border-line/70 bg-card/75 px-3 py-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{position}</span>
                        <span className="text-sm font-semibold text-fg">{dashboardDraftPositionCounts[position]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </CollapsibleSection>

        <CollapsibleSection
          id="draft-results"
          eyebrow="Draft Results"
          title="Draft board, table, and team views"
          description="Switch seasons, search the board, and move between compact views without losing the full draft history."
          defaultOpen={false}
        >

          <div className="surface-card-strong p-4 sm:p-5">
            <div className="grid gap-3 xl:grid-cols-[auto_auto_auto_1fr_auto] xl:items-end">
              <label className="space-y-2 text-sm font-medium text-fg">
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">Season</span>
                <select value={draftSeasonYear} onChange={(event) => setDraftSeasonYear(Number(event.target.value))} className="min-w-[9rem] px-3 py-2.5 text-sm">
                  {draftSeasons.map((season) => (
                    <option key={season.year} value={season.year}>{season.year}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm font-medium text-fg">
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">Team</span>
                <select value={draftTeamFilter} onChange={(event) => setDraftTeamFilter(event.target.value)} className="min-w-[11rem] px-3 py-2.5 text-sm">
                  <option value="all">All teams</option>
                  {draftSeason.teamOrder.map((teamId) => (
                    <option key={teamId} value={teamId}>
                      {draftSeason.standings.find((standing) => standing.teamId === teamId)?.displayName ?? teamsById.get(teamId)?.teamName ?? teamId}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm font-medium text-fg">
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">Position</span>
                <select value={draftPositionFilter} onChange={(event) => setDraftPositionFilter(event.target.value as FantasyPlayerPosition | "all")} className="min-w-[9rem] px-3 py-2.5 text-sm">
                  {positions.map((position) => (
                    <option key={position} value={position}>{position === "all" ? "All positions" : position}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm font-medium text-fg">
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">Search</span>
                <input
                  value={draftSearch}
                  onChange={(event) => setDraftSearch(event.target.value)}
                  placeholder="Search player, NFL team, or fantasy team"
                  className="w-full px-3 py-2.5 text-sm"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                {draftViews.map((view) => (
                  <button
                    key={view.value}
                    type="button"
                    onClick={() => setDraftView(view.value)}
                    className={classForViewButton(draftView === view.value)}
                  >
                    {view.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
              <span className="filter-chip px-2.5 py-1 font-semibold">{draftSeason.draftRounds} rounds</span>
              <span className="filter-chip px-2.5 py-1 font-semibold">{draftSeason.draftPicks.length} picks tracked</span>
              <span className="filter-chip px-2.5 py-1 font-semibold">Draft date {formatDate(draftSeason.draftDate)}</span>
              <span className="filter-chip px-2.5 py-1 font-semibold">Round 10+ glow = keeper range</span>
              <span className="filter-chip px-2.5 py-1 font-semibold">Locked keepers stay tagged</span>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="surface-card relative overflow-hidden p-5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.1),transparent_38%)]" />
              <div className="relative">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Draft visual</p>
                    <h3 className="mt-1 font-display text-xl font-semibold text-fg">Position mix</h3>
                  </div>
                  <span className="rounded-full border border-line/70 bg-card px-3 py-1 text-xs font-semibold text-fg-secondary">
                    {draftSeason.year} board
                  </span>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-card-2/80 shadow-inner shadow-black/20">
                  {visualPositionOrder.map((position) => {
                    const count = draftPositionCounts[position];
                    if (!count) return null;
                    return (
                      <div
                        key={`draft-position-mix-${draftSeason.year}-${position}`}
                        className={`h-full ${getPositionVisualClass(position)}`}
                        style={{ width: `${(count / draftPositionTotal) * 100}%` }}
                      />
                    );
                  })}
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {visualPositionOrder.map((position) => (
                    <div key={`draft-position-count-${position}`} className="rounded-2xl border border-line/70 bg-card/75 px-3 py-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{position}</span>
                        <span className="text-sm font-semibold text-fg">{draftPositionCounts[position]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="surface-card relative overflow-hidden p-5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(244,63,94,0.1),transparent_38%)]" />
              <div className="relative">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Draft visual</p>
                    <h3 className="mt-1 font-display text-xl font-semibold text-fg">Keeper pockets by round</h3>
                  </div>
                  <span className="rounded-full border border-line/70 bg-card px-3 py-1 text-xs font-semibold text-fg-secondary">
                    {draftSeason.draftPicks.filter((pick) => pick.isKeeper).length} total keepers
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-8 xl:grid-cols-5 2xl:grid-cols-8">
                  {keeperRoundHeatmap.map((entry) => (
                    <div key={`keeper-round-${draftSeason.year}-${entry.round}`} className="rounded-2xl border border-line/70 bg-card/75 px-2 py-3 text-center">
                      <div className="flex h-16 items-end justify-center">
                        <div className="flex w-7 items-end rounded-full bg-card-2/90 p-1 shadow-inner shadow-black/20">
                          <div
                            className="w-full rounded-full bg-gradient-to-t from-amber-500 via-orange-400 to-rose-400"
                            style={{ height: `${entry.keeperCount === 0 ? 6 : Math.max(16, (entry.keeperCount / maxKeeperRoundCount) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">R{entry.round}</p>
                      <p className="mt-1 text-sm font-semibold text-fg">{entry.keeperCount}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {draftIntegrityGaps.length > 0 ? (
            <div className="surface-card border border-amber-300/60 bg-amber-50/90 p-4 text-sm dark:border-amber-400/30 dark:bg-amber-500/10">
              <p className="font-semibold text-amber-800 dark:text-amber-200">Draft note: this season has a couple missing pick entries</p>
              <p className="mt-2 text-amber-700 dark:text-amber-100">
                A few draft entries were not logged for this year, which is why some teams show fewer than {draftSeason.draftRounds} selections in the recap.
              </p>
              <ul className="mt-3 space-y-1.5 text-amber-700 dark:text-amber-100">
                {draftIntegrityGaps.map((entry) => {
                  const team = teamsById.get(entry.teamId);
                  return (
                    <li key={`gap-${entry.teamId}`}>
                      • {team?.teamName ?? entry.teamId}: {entry.count} picks logged, missing Round {entry.missingRounds.join(", ")}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {filteredDraftPicks.length === 0 ? (
            <EmptyDraftState />
          ) : draftView === "board" ? (
            <div className="space-y-3 overflow-x-auto pb-2">
              <div className="min-w-[980px] space-y-3">
                {Array.from({ length: draftSeason.draftRounds }, (_, index) => index + 1).map((round) => {
                  const roundOrder = round % 2 === 1 ? draftSeason.teamOrder : [...draftSeason.teamOrder].reverse();
                  return (
                    <div key={`round-${round}`} className="surface-card-strong p-3.5">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="font-display text-lg font-semibold text-fg">Round {round}</h3>
                        <span className="rounded-full border border-line/70 bg-card px-3 py-1 text-xs font-semibold text-fg-secondary">
                          Snake {round % 2 === 1 ? "left to right" : "right to left"}
                        </span>
                      </div>
                      <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${roundOrder.length}, minmax(0, 1fr))` }}>
                        {roundOrder.map((teamId) => {
                          const pick = filteredDraftPicks.find((entry) => entry.round === round && entry.teamId === teamId);
                          const team = teamsById.get(teamId);
                          const player = pick ? playersById.get(pick.playerId) : undefined;
                          const potentialKeeper = pick ? isPotentialKeeperDraftPick(pick) : false;
                          return (
                            <div
                              key={`${round}-${teamId}`}
                              className={`rounded-[18px] border p-2.5 ${
                                potentialKeeper
                                  ? "border-emerald-300/70 bg-gradient-to-br from-emerald-500/12 to-lime-400/10 shadow-[0_0_0_1px_rgba(110,231,183,0.16)]"
                                  : "border-line/70 bg-card/80"
                              }`}
                            >
                              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                                {pick ? getDraftPickTeamShortName(pick, team) : draftSeason.standings.find((standing) => standing.teamId === teamId)?.shortName ?? team?.shortName}
                              </p>
                              {pick && player ? (
                                <>
                                  <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-fg">{player.name}</p>
                                  <p className="mt-1 text-[11px] text-fg-secondary">{player.position} • {player.nflTeam}</p>
                                  <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                                    <span className="rounded-full border border-line/70 bg-card-2/70 px-2 py-1 font-semibold text-fg-secondary">#{pick.overallPick}</span>
                                    {potentialKeeper ? (
                                      <span className="rounded-full border border-emerald-300/70 bg-emerald-50 px-2 py-1 font-semibold text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-500/12 dark:text-emerald-200">
                                        Keeper range
                                      </span>
                                    ) : null}
                                    {pick.isKeeper ? (
                                      <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-1 font-semibold text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-500/12 dark:text-emerald-200">
                                        Locked keeper • R{pick.keeperCostRound}
                                      </span>
                                    ) : null}
                                  </div>
                                </>
                              ) : (
                                <div className="mt-3 rounded-2xl border border-dashed border-line/70 px-3 py-6 text-center text-xs text-muted">
                                  Filtered out
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : draftView === "table" ? (
            <div className="surface-card-strong overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-card-2/80 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                    <tr>
                      {[
                        ["overall", "Pick"],
                        ["round", "Round"],
                        ["team", "Fantasy team"],
                        ["player", "Player"],
                        ["position", "Pos"],
                        ["nfl", "NFL"],
                        ["overall", "Keeper"]
                      ].map(([key, label], index) => (
                        <th key={`${label}-${index}`} className="px-3 py-2.5">
                          {index === 6 ? (
                            label
                          ) : (
                            <button type="button" onClick={() => setDraftSort(key as DraftSortKey)} className="inline-flex items-center gap-1 text-left text-inherit transition hover:text-fg">
                              {label}
                              {draftSortKey === key ? <span>{draftSortDirection === "asc" ? "↑" : "↓"}</span> : null}
                            </button>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDraftPicks.map((pick) => {
                      const player = playersById.get(pick.playerId);
                      const team = teamsById.get(pick.teamId);
                      const potentialKeeper = isPotentialKeeperDraftPick(pick);
                      if (!player || !team) return null;

                      return (
                        <tr
                          key={pick.id}
                          className={`border-t border-line/70 transition hover:bg-card-2/80 ${
                            potentialKeeper ? "bg-emerald-50/50 dark:bg-emerald-500/8" : "bg-card/90"
                          }`}
                        >
                          <td className="px-3 py-2.5 font-semibold text-fg">#{pick.overallPick}</td>
                          <td className="px-3 py-2.5 text-fg-secondary">R{pick.round}.{pick.pickInRound}</td>
                          <td className="px-3 py-2.5 text-fg">{getDraftPickTeamName(pick, team)}</td>
                          <td className="px-3 py-2.5">
                            <div>
                              <p className="font-semibold text-fg">{player.name}</p>
                              <p className="text-xs text-muted">ADP {player.adp ?? "TBD"}</p>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-fg">{player.position}</td>
                          <td className="px-3 py-2.5 text-fg-secondary">{player.nflTeam}</td>
                          <td className="px-3 py-2.5">
                            <div className="flex flex-wrap gap-1.5">
                              {potentialKeeper ? (
                                <span className="rounded-full border border-emerald-300/70 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-500/12 dark:text-emerald-200">
                                  Keeper range
                                </span>
                              ) : null}
                              {pick.isKeeper ? (
                                <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-500/12 dark:text-emerald-200">
                                  Locked keeper • R{pick.keeperCostRound}
                                </span>
                              ) : !potentialKeeper ? (
                                <span className="text-xs text-muted">No</span>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
              {draftSeason.teamOrder
                .filter((teamId) => draftTeamFilter === "all" || teamId === draftTeamFilter)
                .map((teamId) => {
                  const team = teamsById.get(teamId);
                  const teamPicks = filteredDraftPicks.filter((pick) => pick.teamId === teamId).sort((left, right) => left.overallPick - right.overallPick);
                  if (!team || teamPicks.length === 0) return null;
                  const teamLabel = teamPicks[0] ? getDraftPickTeamName(teamPicks[0], team) : team.teamName;

                  return (
                    <article key={teamId} className="surface-card-strong p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Team draft recap</p>
                          <h3 className="mt-1 font-display text-lg font-semibold text-fg">{teamLabel}</h3>
                        </div>
                        <span className="rounded-full border border-line/70 bg-card px-3 py-1 text-xs font-semibold text-fg-secondary">{teamPicks.length} picks</span>
                      </div>
                      <div className="mt-3 space-y-2.5">
                        {teamPicks.map((pick) => {
                          const player = playersById.get(pick.playerId);
                          const potentialKeeper = isPotentialKeeperDraftPick(pick);
                          if (!player) return null;
                          return (
                            <div
                              key={pick.id}
                              className={`rounded-[18px] border p-2.5 ${
                                potentialKeeper
                                  ? "border-emerald-300/70 bg-gradient-to-br from-emerald-500/12 to-lime-400/10 shadow-[0_0_0_1px_rgba(110,231,183,0.16)]"
                                  : "border-line/70 bg-card-2/70"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold text-fg">#{pick.overallPick} • {player.name}</p>
                                  <p className="mt-1 text-[11px] text-fg-secondary">Round {pick.round}, {player.position} • {player.nflTeam}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                  {potentialKeeper ? (
                                    <span className="rounded-full border border-emerald-300/70 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-500/12 dark:text-emerald-200">
                                      Keeper range
                                    </span>
                                  ) : null}
                                  {pick.isKeeper ? (
                                    <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-500/12 dark:text-emerald-200">
                                      Locked keeper
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </article>
                  );
                })}
            </div>
          )}
        </CollapsibleSection>

        <CollapsibleSection
          id="keepers"
          eyebrow="Keeper Tool"
          title="One-keeper manager board"
          description="Pick one keeper per manager, stay inside the eligible pool, and keep the decision board clean and easy to scan."
        >

          <div className="surface-card-strong p-5 sm:p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">League keeper board</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-fg">Everyone’s current choice</h3>
                <p className="mt-2 text-sm text-fg-secondary">
                  Click any manager card to jump into their candidate pool. The chosen keeper updates live across the whole board.
                </p>
              </div>
              <span className="rounded-full border border-line/70 bg-card px-3 py-1 text-xs font-semibold text-fg-secondary">
                {Object.values(selectedKeepersByTeamId).filter((value) => value.length > 0).length}/{data.teams.length} managers picked
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {sortedTeams.map((team) => {
                const member = membersById.get(team.memberId);
                const selectedPlayerId = selectedKeepersByTeamId[team.id]?.[0];
                const selectedPlayer = selectedPlayerId ? playersById.get(selectedPlayerId) : undefined;
                const selectedCandidate = selectedPlayerId ? candidateByKey.get(`${team.id}:${selectedPlayerId}`) : undefined;
                const isActive = team.id === selectedKeeperTeamId;
                const isChampion = team.id === latestCompletedSeason.summary.championTeamId;

                return (
                  <button
                    key={`keeper-board-${team.id}`}
                    type="button"
                    onClick={() => setSelectedKeeperTeamId(team.id)}
                    className={`rounded-[22px] border p-4 text-left transition ${
                      isActive
                        ? "border-primary-300 bg-primary-50/70 shadow-[0_0_0_1px_rgba(96,165,250,0.18)] dark:border-primary-400/45 dark:bg-primary-500/12"
                        : isChampion
                          ? "border-amber-300/45 bg-amber-50/40 dark:bg-amber-500/[0.05]"
                          : "border-line/70 bg-card/85 hover:border-primary-200 hover:bg-card-2/80 dark:hover:border-primary-400/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{member?.managerName ?? "League manager"}</p>
                          {isChampion ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/35 bg-amber-500/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-100">
                              <CrownGlyph />
                              Reigning champ
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-base font-semibold text-fg">{team.teamName}</p>
                      </div>
                      <span className="rounded-full border border-line/70 bg-card px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-fg-secondary">
                        {selectedPlayer ? "Chosen" : "Open"}
                      </span>
                    </div>

                    <div className="mt-4 rounded-2xl border border-line/70 bg-card-2/70 p-3">
                      {selectedPlayer && selectedCandidate ? (
                        <>
                          <p className="font-semibold text-fg">{selectedPlayer.name}</p>
                          <p className="mt-1 text-xs text-fg-secondary">
                            {selectedPlayer.position} • {selectedPlayer.nflTeam}
                          </p>
                          <p className="mt-2 text-xs text-muted">
                            Drafted Round {selectedCandidate.previousDraftRound ?? "n/a"}
                          </p>
                          <p className="mt-1 text-xs font-medium text-fg-secondary">
                            {formatKeeperCostFormula(selectedCandidate, selectedPlayer) ?? `Cost Round ${selectedCandidate.keeperCostRound ?? "review"}`}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-fg-secondary">No keeper picked yet.</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.18fr)_22rem]">
            <div className="space-y-4">
              <div className="surface-card-strong p-5 sm:p-6">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,15rem)_1fr] lg:items-end">
                  <label className="space-y-2 text-sm font-medium text-fg">
                    <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">Select team</span>
                    <select value={selectedKeeperTeamId} onChange={(event) => setSelectedKeeperTeamId(event.target.value)} className="w-full px-4 py-3 text-sm">
                      {data.teams.map((team) => (
                        <option key={team.id} value={team.id}>{team.teamName}</option>
                      ))}
                    </select>
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-line/70 bg-card-2/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Keeper slot</p>
                      <p className="mt-1.5 text-lg font-semibold text-fg">{selectedKeeperCandidates.length}/{data.keeperRules.maxKeepers}</p>
                    </div>
                    <div className="rounded-2xl border border-line/70 bg-card-2/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Source season</p>
                      <p className="mt-1.5 text-lg font-semibold text-fg">{sourceSeason.year}</p>
                    </div>
                    <div className="rounded-2xl border border-line/70 bg-card-2/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Deadline</p>
                      <p className="mt-1.5 text-lg font-semibold text-fg">{formatDate(data.keeperRules.deadline)}</p>
                    </div>
                    <div className="rounded-2xl border border-line/70 bg-card-2/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Round rule</p>
                      <p className="mt-1.5 text-sm font-semibold text-fg">Round 10+</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="filter-chip px-2.5 py-1 font-semibold">1 keeper per manager</span>
                  <span className="filter-chip px-2.5 py-1 font-semibold">Eligible if drafted after Round 9</span>
                  <span className="filter-chip px-2.5 py-1 font-semibold">FantasyPros PPR rank plus 20 picks</span>
                  <span className="filter-chip px-2.5 py-1 font-semibold">{data.keeperRules.defaultWaiverCost}</span>
                </div>
              </div>

              <div className="surface-card-strong overflow-hidden">
                <div className="border-b border-line/70 px-5 py-5 sm:px-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Keeper candidates</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-fg">
                      {teamsById.get(selectedKeeperTeamId)?.teamName}
                    </h3>
                    <p className="mt-2 text-sm text-fg-secondary">
                      Built from the {sourceSeason.year} draft board. Only Round 10+ candidates are shown here, so you can pick the one keeper that actually matters.
                    </p>
                  </div>
                  <span className="rounded-full border border-line/70 bg-card px-3 py-1 text-xs font-semibold text-fg-secondary">
                    {keeperCandidateRoster.length} eligible options
                  </span>
                </div>
                  <div className="grid gap-3 pt-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <label className="space-y-2 text-sm font-medium text-fg">
                      <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">Search roster</span>
                      <input
                        type="search"
                        value={keeperSearch}
                        onChange={(event) => setKeeperSearch(event.target.value)}
                        placeholder="Search keeper candidate, team, round, or notes"
                        className="w-full px-4 py-3 text-sm"
                      />
                    </label>
                    <div className="flex flex-wrap items-end gap-2">
                      {keeperViewFilters.map((filter) => (
                        <button
                          key={filter.value}
                          type="button"
                          onClick={() => setKeeperViewFilter(filter.value)}
                          className={classForKeeperFilterButton(keeperViewFilter === filter.value)}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-[980px] w-full text-left text-sm">
                    <thead className="bg-card-2/80 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      <tr>
                        <th className="px-3 py-2.5">Player</th>
                        <th className="px-3 py-2.5">Drafted</th>
                        <th className="px-3 py-2.5">Current cost</th>
                        <th className="px-3 py-2.5">FantasyPros slot</th>
                        <th className="px-3 py-2.5">Years kept</th>
                        <th className="px-3 py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleSourceRoster.length > 0 ? visibleSourceRoster.map(({ pick, player, candidate }) => {
                        const selected = selectedKeeperPlayerIds.includes(pick.playerId);
                        const eligible = candidate?.eligible ?? false;

                        return (
                          <tr
                            key={`${pick.teamId}-${pick.playerId}`}
                            className={`border-t border-line/70 align-top transition ${selected ? "bg-primary-50/80 dark:bg-primary-500/12" : "bg-card/90 hover:bg-card-2/70"}`}
                          >
                            <td className="px-3 py-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold text-fg">{player.name}</p>
                                <span className="rounded-full border border-line/70 bg-card-2/70 px-2 py-0.5 text-[11px] font-semibold text-fg-secondary">{player.position}</span>
                                <span className="rounded-full border border-line/70 bg-card-2/70 px-2 py-0.5 text-[11px] font-semibold text-fg-secondary">{player.nflTeam}</span>
                              </div>
                              {candidate?.notes ? <p className="mt-1.5 max-w-md text-xs leading-6 text-muted">{candidate.notes}</p> : null}
                            </td>
                            <td className="px-3 py-3 text-fg-secondary">
                              <p className="font-semibold text-fg">Round {pick.round}</p>
                              <p className="mt-1 text-xs text-muted">Pick #{pick.overallPick}</p>
                            </td>
                            <td className="px-3 py-3 text-fg-secondary">
                              <p className="font-semibold text-fg">
                                {candidate?.keeperCostRound ? `Round ${candidate.keeperCostRound}` : "Review required"}
                              </p>
                              <p className="mt-1 text-xs text-muted">
                                {candidate ? formatKeeperCostFormula(candidate, player) ?? "Need source rank" : "Need source rank"}
                              </p>
                            </td>
                            <td className="px-3 py-3 text-fg-secondary">
                              {typeof player.adp === "number" ? (
                                <>
                                  <p className="font-semibold text-fg">Pick {player.adp}</p>
                                  <p className="mt-1 text-xs text-muted">FantasyPros PPR board</p>
                                </>
                              ) : (
                                <>
                                  <p className="font-semibold text-fg">Missing rank</p>
                                  <p className="mt-1 text-xs text-muted">FantasyPros snapshot needed</p>
                                </>
                              )}
                            </td>
                            <td className="px-3 py-3 font-semibold text-fg">{candidate?.yearsKept ?? 0}</td>
                            <td className="px-3 py-3 text-right">
                              <button
                                type="button"
                                onClick={() => toggleKeeper(pick.playerId)}
                                className={selected ? "rounded-full border border-primary-300 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 transition dark:border-primary-400/55 dark:bg-primary-500/25 dark:text-primary-100" : "rounded-full border border-line/70 bg-card px-3 py-1.5 text-xs font-semibold text-fg-secondary transition hover:border-primary-200 hover:text-fg dark:hover:border-primary-400/30"}
                              >
                                {selected ? "Remove" : "Choose keeper"}
                              </button>
                            </td>
                          </tr>
                        );
                      }) : (
                        <tr className="border-t border-line/70 bg-card/90">
                          <td colSpan={6} className="px-4 py-8 text-center text-sm text-fg-secondary">
                            No keeper candidates match the current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <aside className="xl:sticky xl:top-24 xl:self-start">
              <div className="surface-card-strong p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Selected keeper summary</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-fg">
                      {teamsById.get(selectedKeeperTeamId)?.shortName} keeper card
                    </h3>
                    <p className="mt-2 text-sm text-fg-secondary">
                      {selectedKeeperCandidates.length}/{data.keeperRules.maxKeepers} keeper chosen for this manager.
                    </p>
                  </div>
                  <span className="rounded-full border border-line/70 bg-card px-3 py-1 text-xs font-semibold text-fg-secondary">
                    {selectedKeeperCandidates.length} picked
                  </span>
                </div>

                <div className="mt-5 grid gap-3">
                  {Array.from({ length: data.keeperRules.maxKeepers }).map((_, index) => {
                    const candidate = selectedKeeperCandidates[index];
                    const player = candidate ? playersById.get(candidate.playerId) : undefined;

                    return (
                      <div key={`keeper-slot-${index}`} className="rounded-2xl border border-line/70 bg-card-2/70 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Keeper {index + 1}</p>
                          {candidate ? (
                            <span className="rounded-full border border-line/70 bg-card px-2.5 py-1 text-[11px] font-semibold text-fg-secondary">
                              Cost R{candidate.keeperCostRound ?? "?"}
                            </span>
                          ) : null}
                        </div>

                        {candidate && player ? (
                          <>
                            <p className="mt-2 font-semibold text-fg">{player.name}</p>
                            <p className="mt-1 text-xs text-fg-secondary">{player.position} • {player.nflTeam}</p>
                            <p className="mt-2 text-xs text-muted">
                              Drafted Round {candidate.previousDraftRound ?? "n/a"} • Years kept {candidate.yearsKept}
                            </p>
                            <p className="mt-1 text-xs font-medium text-fg-secondary">
                              {formatKeeperCostFormula(candidate, player) ?? `Cost Round ${candidate.keeperCostRound ?? "review"}`}
                            </p>
                          </>
                        ) : (
                          <p className="mt-2 text-sm text-fg-secondary">No keeper chosen yet.</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {keeperWarnings.length > 0 ? (
                  <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50/90 p-4 text-sm dark:border-amber-400/30 dark:bg-amber-500/10">
                    <p className="font-semibold text-amber-800 dark:text-amber-200">Review before export</p>
                    <ul className="mt-2 space-y-1.5 text-amber-700 dark:text-amber-100">
                      {keeperWarnings.map((warning) => (
                        <li key={warning}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {overflowKeeperCandidates.length > 0 ? (
                  <div className="mt-4 rounded-2xl border border-line/70 bg-card-2/70 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Overflow selections</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {overflowKeeperCandidates.map((candidate) => {
                        const player = playersById.get(candidate.playerId);
                        return (
                          <span key={`overflow-${candidate.playerId}`} className="filter-chip px-2.5 py-1 font-semibold">
                            {player?.name ?? candidate.playerId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  <button type="button" onClick={copyKeeperSummary} className="btn-primary justify-center">
                    Copy summary
                  </button>
                  <button type="button" onClick={exportKeeperSelections} className="btn-secondary justify-center">
                    Export JSON
                  </button>
                </div>

                {keeperFeedback ? <p className="mt-3 text-sm text-primary-600 dark:text-primary-300">{keeperFeedback}</p> : null}

                <details className="mt-5 rounded-2xl border border-line/70 bg-card-2/70 p-4 text-sm text-fg-secondary">
                  <summary className="cursor-pointer list-none font-semibold text-fg">
                    Rules in play
                  </summary>
                  <div className="mt-3 space-y-2 leading-7">
                    <p>• {data.keeperRules.costRule}</p>
                    <p>• {data.keeperRules.roundPenaltyRule}</p>
                    <p>• {data.keeperRules.defaultWaiverCost}</p>
                    <p>• {data.keeperRules.ineligiblePlayersRule}</p>
                  </div>
                </details>
              </div>
            </aside>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          id="league-history"
          eyebrow="League History"
          title="Champions, runners-up, and season history"
          description="A tighter history of title runs, season leaders, and the trade ledger that shaped the room."
        >

          <div className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
            <div className="surface-card-strong overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-card-2/80 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                    <tr>
                      <th className="px-3 py-2.5">Season</th>
                      <th className="px-3 py-2.5">Champion</th>
                      <th className="px-3 py-2.5">Runner-up</th>
                      <th className="px-3 py-2.5">Regular season</th>
                      <th className="px-3 py-2.5">Points leader</th>
                      <th className="px-3 py-2.5">Bottom finish</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seasonsNewestFirst.map((season) => (
                      <tr key={season.id} className="border-t border-line/70 bg-card/90 transition hover:bg-card-2/70">
                        <td className="px-3 py-2.5 font-semibold text-fg">{season.year}</td>
                        <td className="px-3 py-2.5 text-fg">{season.summary.championDisplayName ?? teamsById.get(season.summary.championTeamId)?.teamName}</td>
                        <td className="px-3 py-2.5 text-fg-secondary">{season.summary.runnerUpDisplayName ?? teamsById.get(season.summary.runnerUpTeamId)?.teamName}</td>
                        <td className="px-3 py-2.5 text-fg-secondary">{season.summary.regularSeasonWinnerDisplayName ?? teamsById.get(season.summary.regularSeasonWinnerTeamId)?.shortName}</td>
                        <td className="px-3 py-2.5 text-fg-secondary">{season.summary.highestScoringTeamDisplayName ?? teamsById.get(season.summary.highestScoringTeamId)?.shortName}</td>
                        <td className="px-3 py-2.5 text-fg-secondary">{season.summary.worstRecordTeamDisplayName ?? teamsById.get(season.summary.worstRecordTeamId)?.shortName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <div className="surface-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">History at a glance</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-fg">The fast read</h3>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-line/70 bg-card-2/70 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Latest champion</p>
                    <p className="mt-1 text-sm font-semibold text-fg">{latestCompletedSeason.summary.championDisplayName ?? defendingChampion?.teamName}</p>
                    <p className="mt-1 text-xs text-fg-secondary">{latestCompletedSeason.year} title run</p>
                  </div>
                  <div className="rounded-2xl border border-line/70 bg-card-2/70 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Trades tracked</p>
                    <p className="mt-1 text-sm font-semibold text-fg">{tradesNewestFirst.length} deals</p>
                    <p className="mt-1 text-xs text-fg-secondary">Defaulting to {selectedTradeSeasonYear}, with older seasons one dropdown away.</p>
                  </div>
                  <div className="rounded-2xl border border-line/70 bg-card-2/70 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Draft receipts</p>
                    <p className="mt-1 text-sm text-fg-secondary">Need a season build story? Jump straight back into the draft board or record book.</p>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl border border-line/70 bg-card-2/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Title board</p>
                      <p className="mt-1 text-sm text-fg-secondary">Who has actually turned good rosters into trophies.</p>
                    </div>
                    <span className="rounded-full border border-line/70 bg-card px-2.5 py-1 text-[11px] font-semibold text-fg-secondary">
                      {mostDecoratedTeam.championships} to beat
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {titleBoard.map((team) => (
                      <div key={`title-board-${team.id}`} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span className="truncate font-semibold text-fg">{team.teamName}</span>
                          <span className="text-fg-secondary">{team.championships} title{team.championships === 1 ? "" : "s"}</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-card/80 shadow-inner shadow-black/20">
                          <div
                            className="h-full rounded-full shadow-[0_0_16px_rgba(59,130,246,0.25)]"
                            style={{
                              width: `${Math.max(10, (team.championships / maxTitles) * 100)}%`,
                              background: `linear-gradient(90deg, ${team.colors.primary}, ${team.colors.secondary})`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href="#draft-results" className="btn-secondary">
                    Open draft section
                  </Link>
                  <Link href="#records" className="btn-ghost">
                    View record book
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card-strong overflow-hidden">
            <div className="flex flex-col gap-2 border-b border-line/70 px-4 py-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Trade ledger</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-fg">{selectedTradeSeasonYear} deals, with teams and packages</h3>
              </div>
              <div className="flex items-center gap-3">
                <label className="space-y-2 text-sm font-medium text-fg">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Season</span>
                  <select value={selectedTradeSeasonYear} onChange={(event) => setTradeSeasonYear(Number(event.target.value))} className="min-w-[8.5rem] px-3 py-2 text-sm">
                    {tradeSeasonOptions.map((seasonYear) => (
                      <option key={`trade-ledger-${seasonYear}`} value={seasonYear}>{seasonYear}</option>
                    ))}
                  </select>
                </label>
                <span className="rounded-full border border-line/70 bg-card px-3 py-1 text-xs font-semibold text-fg-secondary">
                  {selectedTradeSeasonTrades.length} trades tracked
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-card-2/80 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  <tr>
                    <th className="px-3 py-2.5">Season</th>
                    <th className="px-3 py-2.5">Date</th>
                    <th className="px-3 py-2.5">Between</th>
                    <th className="px-3 py-2.5">Package A</th>
                    <th className="px-3 py-2.5">Package B</th>
                    <th className="px-3 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTradeSeasonTrades.map((trade) => (
                    <tr key={trade.transactionKey} className="border-t border-line/70 align-top bg-card/90 transition hover:bg-card-2/70">
                      <td className="px-3 py-3 font-semibold text-fg">{trade.seasonYear}</td>
                      <td className="px-3 py-3 text-xs text-fg-secondary">{trade.weekLabel ?? formatTradeDate(trade.postedAt)}</td>
                      <td className="px-3 py-3">
                        <p className="font-semibold text-fg">{trade.trader.teamName}</p>
                        <p className="text-xs text-fg-secondary">for {trade.tradee.teamName}</p>
                      </td>
                      <td className="px-3 py-3 text-sm text-fg-secondary">
                        <p className="font-semibold text-fg">{trade.trader.teamName} sent</p>
                        <p className="mt-1 leading-6">{formatTradeBundle(trade.traderSent)}</p>
                      </td>
                      <td className="px-3 py-3 text-sm text-fg-secondary">
                        <p className="font-semibold text-fg">{trade.tradee.teamName} sent</p>
                        <p className="mt-1 leading-6">{formatTradeBundle(trade.tradeeSent)}</p>
                      </td>
                      <td className="px-3 py-3">
                        <span className="rounded-full border border-line/70 bg-card px-2.5 py-1 text-[11px] font-semibold text-fg-secondary">
                          {formatTradeStatus(trade.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {selectedTradeSeasonTrades.length === 0 ? (
                    <tr className="border-t border-line/70 bg-card/90">
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-fg-secondary">
                        No trades were logged for {selectedTradeSeasonYear}. Either peace broke out or nobody hit accept.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          id="records"
          eyebrow="Records & Awards"
          title="Legacy stats that make the group chat louder"
          description="A denser record book for the numbers people and a cleaner annual awards table for the storylines."
        >

          <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="surface-card-strong overflow-hidden">
              <div className="border-b border-line/70 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Record book</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-fg">League marks</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-card-2/80 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                    <tr>
                      <th className="px-3 py-2.5">Record</th>
                      <th className="px-3 py-2.5">Value</th>
                      <th className="px-3 py-2.5">Holder</th>
                      <th className="px-3 py-2.5">Season</th>
                      <th className="px-3 py-2.5">Context</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.records.map((record) => {
                      const team = record.teamId ? teamsById.get(record.teamId) : undefined;
                      const member = record.memberId ? membersById.get(record.memberId) : undefined;
                      return (
                        <tr key={record.id} className="border-t border-line/70 bg-card/90 align-top transition hover:bg-card-2/70">
                          <td className="px-3 py-3">
                            <p className="font-semibold text-fg">{record.label}</p>
                            <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">{record.category}</p>
                          </td>
                          <td className="px-3 py-3 font-semibold text-primary-600 dark:text-primary-300">{record.value}</td>
                          <td className="px-3 py-3 text-fg-secondary">{team?.teamName ?? member?.managerName ?? "League record"}</td>
                          <td className="px-3 py-3 text-fg-secondary">{record.seasonYear}</td>
                          <td className="px-3 py-3 text-sm leading-6 text-fg-secondary">{record.context}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="surface-card-strong overflow-hidden">
              <div className="border-b border-line/70 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Annual awards</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-fg">Season superlatives</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-card-2/80 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                    <tr>
                      <th className="px-3 py-2.5">Season</th>
                      <th className="px-3 py-2.5">Award</th>
                      <th className="px-3 py-2.5">Winner</th>
                      <th className="px-3 py-2.5">Summary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.awards.map((award) => {
                      const team = award.teamId ? teamsById.get(award.teamId) : undefined;
                      const member = award.memberId ? membersById.get(award.memberId) : undefined;
                      return (
                        <tr key={award.id} className="border-t border-line/70 bg-card/90 align-top transition hover:bg-card-2/70">
                          <td className="px-3 py-3 font-semibold text-fg">{award.seasonYear}</td>
                          <td className="px-3 py-3 text-fg">{award.title}</td>
                          <td className="px-3 py-3 text-fg-secondary">{team?.teamName ?? member?.managerName ?? "League award"}</td>
                          <td className="px-3 py-3 text-sm leading-6 text-fg-secondary">{award.summary}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          id="teams"
          eyebrow="Member & Team Profiles"
          title="Profiles for every manager in the room"
          description="A denser manager table up front, with rivalry and tendency notes tucked behind the info icon so the section stays compact."
        >

          <div className="surface-card-strong overflow-hidden">
            <div className="border-b border-line/70 px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Sort the room</p>
                  <p className="mt-1 text-sm text-fg-secondary">Re-rack the table by titles, playoff mileage, all-time track record, or just pure manager chaos.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {teamSortOptions.map((option) => (
                    <button
                      key={`team-sort-${option.value}`}
                      type="button"
                      onClick={() => setTeamSort(option.value)}
                      className={classForTeamSortButton(teamSortKey === option.value)}
                    >
                      <span>{option.label}</span>
                      {teamSortKey === option.value ? <span className="ml-1">{teamSortDirection === "asc" ? "↑" : "↓"}</span> : null}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-3 p-4 md:hidden">
              {sortedTeams.map((team) => {
                const member = membersById.get(team.memberId);
                const standing = currentStandings.find((entry) => entry.teamId === team.id);
                const latestRecord = standing ? `${formatStandingRecord(standing)} last season` : "League profile in motion";
                const profileHref = member ? `/fantasy/managers/${member.slug}/` : "/fantasy/";
                const primaryRival = getPrimaryRivalLabel(member?.rivalryNote);
                const titleBadge = team.championships > 0 ? `${team.championships}x champ` : "Title chase";
                const playoffBadge =
                  team.playoffAppearances > 0
                    ? `${team.playoffAppearances} playoff ${team.playoffAppearances === 1 ? "trip" : "trips"}`
                    : "Still crashing the bracket";
                const seasonResult = standing ? getPlayoffFinishLabel(standing, dashboardSeason.summary) : "Season loading";
                const seasonResultClass = getSeasonResultBadgeClass(seasonResult);
                const isReigningChampion = team.id === latestCompletedSeason.summary.championTeamId;
                const rowAccent =
                  isReigningChampion
                    ? "border-amber-300/55 bg-amber-50/60 dark:bg-amber-500/8"
                    : team.championships > 0
                      ? "border-amber-300/35 bg-card/90"
                      : "border-line/70 bg-card/90";

                return (
                  <article key={`${team.id}-mobile-card`} className={`rounded-[22px] border p-4 ${rowAccent}`}>
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold text-white shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${team.colors.primary}, ${team.colors.secondary})` }}
                      >
                        {getInitials(team.shortName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                          <Link href={profileHref} className="transition hover:text-primary-300">
                            {member?.managerName ?? "League manager"}
                          </Link>
                        </p>
                        <p className="mt-1 text-base font-semibold text-fg">
                          <Link href={profileHref} className="transition hover:text-primary-300">
                            {team.teamName}
                          </Link>
                        </p>
                        {isReigningChampion ? (
                          <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-amber-400/35 bg-amber-500/12 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-100">
                            <CrownGlyph />
                            Reigning champ
                          </span>
                        ) : null}
                        <p className="mt-1 text-xs text-fg-secondary">{latestRecord}</p>
                      </div>
                      <TeamProfileHoverCard team={team} member={member} latestRecord={latestRecord} profileHref={profileHref} />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full border border-primary-400/30 bg-primary-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-100">
                        {member?.favoriteTeam ?? "League member"}
                      </span>
                      {primaryRival ? (
                        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-100">
                          Beef: {primaryRival}
                        </span>
                      ) : null}
                      <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-100">
                        {titleBadge}
                      </span>
                      <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-100">
                        {playoffBadge}
                      </span>
                      <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${seasonResultClass}`}>
                        {seasonResult}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-xl border border-line/70 bg-card-2/70 px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Titles</p>
                        <p className="mt-1 text-sm font-semibold text-fg">{team.championships}</p>
                      </div>
                      <div className="rounded-xl border border-line/70 bg-card-2/70 px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Playoffs</p>
                        <p className="mt-1 text-sm font-semibold text-fg">{team.playoffAppearances}</p>
                      </div>
                      <div className="rounded-xl border border-line/70 bg-card-2/70 px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">All-time</p>
                        <p className="mt-1 text-sm font-semibold text-fg">{formatRecord(team)}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {team.legacyNames.map((legacyName) => (
                        <span key={`${team.id}-${legacyName}-mobile`} className="filter-chip px-2.5 py-1 font-semibold">
                          {legacyName}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-[980px] w-full text-left text-sm">
                <thead className="bg-card-2/80 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  <tr>
                    <th className="px-3 py-2.5">
                      <button type="button" onClick={() => setTeamSort("manager")} className="inline-flex items-center gap-1 text-left text-inherit transition hover:text-fg">
                        Manager
                        {teamSortKey === "manager" ? <span>{teamSortDirection === "asc" ? "↑" : "↓"}</span> : null}
                      </button>
                    </th>
                    <th className="px-3 py-2.5">
                      <button type="button" onClick={() => setTeamSort("team")} className="inline-flex items-center gap-1 text-left text-inherit transition hover:text-fg">
                        Team
                        {teamSortKey === "team" ? <span>{teamSortDirection === "asc" ? "↑" : "↓"}</span> : null}
                      </button>
                    </th>
                    <th className="px-3 py-2.5">
                      <button type="button" onClick={() => setTeamSort("titles")} className="inline-flex items-center gap-1 text-left text-inherit transition hover:text-fg">
                        Titles
                        {teamSortKey === "titles" ? <span>{teamSortDirection === "asc" ? "↑" : "↓"}</span> : null}
                      </button>
                    </th>
                    <th className="px-3 py-2.5">
                      <button type="button" onClick={() => setTeamSort("playoffs")} className="inline-flex items-center gap-1 text-left text-inherit transition hover:text-fg">
                        Playoffs
                        {teamSortKey === "playoffs" ? <span>{teamSortDirection === "asc" ? "↑" : "↓"}</span> : null}
                      </button>
                    </th>
                    <th className="px-3 py-2.5">
                      <button type="button" onClick={() => setTeamSort("record")} className="inline-flex items-center gap-1 text-left text-inherit transition hover:text-fg">
                        All-time
                        {teamSortKey === "record" ? <span>{teamSortDirection === "asc" ? "↑" : "↓"}</span> : null}
                      </button>
                    </th>
                    <th className="px-3 py-2.5">Legacy names</th>
                    <th className="px-3 py-2.5 text-right">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTeams.map((team) => {
                    const member = membersById.get(team.memberId);
                    const standing = currentStandings.find((entry) => entry.teamId === team.id);
                    const latestRecord = standing ? `${formatStandingRecord(standing)} last season` : "League profile in motion";
                    const profileHref = member ? `/fantasy/managers/${member.slug}/` : "/fantasy/";
                    const primaryRival = getPrimaryRivalLabel(member?.rivalryNote);
                    const titleBadge = team.championships > 0 ? `${team.championships}x champ` : "Title chase";
                    const playoffBadge =
                      team.playoffAppearances > 0
                        ? `${team.playoffAppearances} playoff ${team.playoffAppearances === 1 ? "trip" : "trips"}`
                        : "Still crashing the bracket";
                    const seasonResult = standing ? getPlayoffFinishLabel(standing, dashboardSeason.summary) : "Season loading";
                    const seasonResultClass = getSeasonResultBadgeClass(seasonResult);
                    const isReigningChampion = team.id === latestCompletedSeason.summary.championTeamId;
                    const rowAccent =
                      isReigningChampion
                        ? "bg-amber-50/60 dark:bg-amber-500/8"
                        : team.championships > 0
                          ? "bg-amber-50/30 dark:bg-amber-500/[0.04]"
                          : "bg-card/90";

                    return (
                      <tr key={team.id} className={`border-t border-line/70 align-top transition hover:bg-card-2/70 ${rowAccent}`}>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold text-white shadow-lg"
                              style={{ background: `linear-gradient(135deg, ${team.colors.primary}, ${team.colors.secondary})` }}
                            >
                              {getInitials(team.shortName)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                                <Link href={profileHref} className="transition hover:text-primary-300">
                                  {member?.managerName ?? "League manager"}
                                </Link>
                              </p>
                              <div className="mt-1.5 flex flex-wrap gap-1.5">
                                <span className="rounded-full border border-primary-400/30 bg-primary-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-100">
                                  {member?.favoriteTeam ?? "League member"}
                                </span>
                                {primaryRival ? (
                                  <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-100">
                                    Beef: {primaryRival}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-fg">
                              <Link href={profileHref} className="transition hover:text-primary-300">
                                {team.teamName}
                              </Link>
                            </p>
                            {isReigningChampion ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/35 bg-amber-500/12 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-100">
                                <CrownGlyph />
                                Reigning champ
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-xs text-fg-secondary">{latestRecord}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-100">
                              {titleBadge}
                            </span>
                            <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-100">
                              {playoffBadge}
                            </span>
                            <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${seasonResultClass}`}>
                              {seasonResult}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 font-semibold text-fg">{team.championships}</td>
                        <td className="px-3 py-3 font-semibold text-fg">{team.playoffAppearances}</td>
                        <td className="px-3 py-3 font-semibold text-fg">{formatRecord(team)}</td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-2">
                            {team.legacyNames.map((legacyName) => (
                              <span key={`${team.id}-${legacyName}`} className="filter-chip px-2.5 py-1 font-semibold">
                                {legacyName}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={profileHref}
                              className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-300 transition hover:text-primary-200"
                            >
                              Draft profile
                            </Link>
                            <TeamProfileHoverCard team={team} member={member} latestRecord={latestRecord} profileHref={profileHref} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </CollapsibleSection>
      </div>
    </div>
  );
}
