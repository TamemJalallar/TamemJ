"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";
import { FantasyLiveSnapshot } from "@/components/fantasy/fantasy-live-snapshot";
import { FantasySectionNav } from "@/components/fantasy/fantasy-section-nav";
import { resolveFantasyLiveLeagueUrl, isFantasyLiveLeagueEnvelope } from "@/lib/fantasy-live";
import type {
  FantasyDraftPick,
  FantasyDraftView,
  FantasyKeeperCandidate,
  FantasyLeagueDataset,
  FantasyLeagueRecord,
  FantasyMatchup,
  FantasyPlayerPosition,
  FantasySeason,
  FantasyStanding,
  FantasyTeamIdentity
} from "@/types/fantasy";
import type { FantasyLiveLeagueEnvelope } from "@/types/fantasy-live";

type DraftSortKey = "overall" | "round" | "team" | "player" | "position" | "nfl";
type DraftSortDirection = "asc" | "desc";

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

function EmptyDraftState() {
  return (
    <div className="surface-card rounded-[24px] border-dashed bg-card-2/50 p-8 text-center">
      <h3 className="font-display text-xl font-semibold text-fg">No draft picks match those filters</h3>
      <p className="mt-2 text-sm text-fg-secondary">Try clearing a team filter, widening the player search, or switching back to the full board.</p>
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

  const [draftSeasonYear, setDraftSeasonYear] = useState(draftSeasons[0]?.year ?? currentSeason.year);
  const [draftView, setDraftView] = useState<FantasyDraftView>("board");
  const [draftTeamFilter, setDraftTeamFilter] = useState<string>("all");
  const [draftPositionFilter, setDraftPositionFilter] = useState<FantasyPlayerPosition | "all">("all");
  const [draftSearch, setDraftSearch] = useState("");
  const [draftSortKey, setDraftSortKey] = useState<DraftSortKey>("overall");
  const [draftSortDirection, setDraftSortDirection] = useState<DraftSortDirection>("asc");
  const deferredDraftSearch = useDeferredValue(draftSearch);

  const sourceSeason = data.seasons.find((season) => season.year === data.keeperRules.sourceSeasonYear) ?? latestCompletedSeason;
  const initialKeeperTeamId = data.teams[0]?.id ?? "";
  const [selectedKeeperTeamId, setSelectedKeeperTeamId] = useState(initialKeeperTeamId);
  const [selectedKeeperPlayerIds, setSelectedKeeperPlayerIds] = useState<string[]>([]);
  const [keeperFeedback, setKeeperFeedback] = useState<string | null>(null);
  const [liveLeague, setLiveLeague] = useState<FantasyLiveLeagueEnvelope | null>(null);
  const [liveLeagueLoading, setLiveLeagueLoading] = useState(false);
  const [liveLeagueError, setLiveLeagueError] = useState<string | null>(null);

  useEffect(() => {
    const defaults = currentSeason.keeperSelections
      .filter((selection) => selection.teamId === selectedKeeperTeamId)
      .map((selection) => selection.playerId);
    setSelectedKeeperPlayerIds(defaults);
  }, [currentSeason.keeperSelections, selectedKeeperTeamId]);

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
    ? "Live Yahoo sync • curated history below"
    : liveLeagueLoading
      ? "Checking Yahoo sync"
      : liveLeagueError
        ? "Curated history • live sync pending"
        : "Curated league hub";
  const overviewDescription =
    currentSeason.status === "completed"
      ? `Live Yahoo sync is active above. Until the ${displaySeasonYear} season starts returning standings and matchups, the dashboard below leans on the ${currentSeason.year} archive snapshot for context.`
      : "A modern snapshot of standings, matchup context, and the storylines league members check first every week.";

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

  const currentStandings = [...currentSeason.standings].sort((left, right) => left.rank - right.rank);
  const topScoringStanding = [...currentStandings].sort((left, right) => right.pointsFor - left.pointsFor)[0];
  const lowestScoringStanding = [...currentStandings].sort((left, right) => left.pointsFor - right.pointsFor)[0];
  const closestMatchup = [...currentSeason.matchups].sort((left, right) => getMargin(left) - getMargin(right))[0];
  const biggestBlowout = [...currentSeason.matchups].sort((left, right) => getMargin(right) - getMargin(left))[0];

  const mostDecoratedTeam = [...data.teams].sort((left, right) => right.championships - left.championships || left.teamName.localeCompare(right.teamName))[0];
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

  function setDraftSort(key: DraftSortKey) {
    if (draftSortKey === key) {
      setDraftSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setDraftSortKey(key);
    setDraftSortDirection("asc");
  }

  function toggleKeeper(playerId: string) {
    setSelectedKeeperPlayerIds((current) =>
      current.includes(playerId) ? current.filter((value) => value !== playerId) : [...current, playerId]
    );
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
        return `- ${player.name} (${player.position}, ${player.nflTeam}) — previous round ${candidate.previousDraftRound ?? "n/a"}, keeper cost ${candidate.keeperCostRound ?? "review"}`;
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

        <FantasyLiveSnapshot live={liveLeague} loading={liveLeagueLoading} error={liveLeagueError} />

        <FantasySectionNav items={[...sectionItems]} />

        <section id="overview" className="space-y-6 scroll-mt-28">
          <SectionHeading
            eyebrow="League Dashboard"
            title="Current season dashboard"
            description={overviewDescription}
          />

          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="surface-card-strong p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    {currentSeason.status === "completed" ? "Latest archived standings" : "Current standings"}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-fg">{currentSeason.label}</h3>
                </div>
                <span className="rounded-full border border-line/70 bg-card px-3 py-1 text-xs font-semibold text-fg-secondary">{currentSeason.weekLabel}</span>
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
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Current matchups</p>
                {currentSeason.matchups.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {currentSeason.matchups.map((matchup) => {
                      const homeTeam = teamsById.get(matchup.homeTeamId);
                      const awayTeam = teamsById.get(matchup.awayTeamId);
                      return (
                        <div key={matchup.id} className="rounded-2xl border border-line/70 bg-card-2/70 p-3">
                          <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                            <span>Week {matchup.week}</span>
                            <span>{matchup.status}</span>
                          </div>
                          <div className="mt-3 grid gap-2 text-sm">
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-medium text-fg">{homeTeam?.shortName}</span>
                              <span className="font-semibold text-fg">{formatPoints(matchup.homeScore)}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-medium text-fg">{awayTeam?.shortName}</span>
                              <span className="font-semibold text-fg">{formatPoints(matchup.awayScore)}</span>
                            </div>
                          </div>
                          {matchup.note ? <p className="mt-2 text-xs text-fg-secondary">{matchup.note}</p> : null}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-dashed border-line/70 bg-card-2/45 p-5 text-sm text-fg-secondary">
                    Live matchup cards will appear here once the Yahoo season publishes head-to-head results. Until then, the page is using the archive and draft history below.
                  </div>
                )}
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

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="surface-card p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Waiver activity placeholder</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-fg">Weekly wire pulse</h3>
              <p className="mt-3 text-sm leading-7 text-fg-secondary">
                Mock state for now: add FAAB trends, waiver claims, and roster churn once Yahoo, Sleeper, or manual CSV imports are connected.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="filter-chip px-2.5 py-1 font-semibold">Most adds: Albany Audible</span>
                <span className="filter-chip px-2.5 py-1 font-semibold">Hot position: WR depth</span>
                <span className="filter-chip px-2.5 py-1 font-semibold">Next sync: API / CSV</span>
              </div>
            </div>

            <div className="surface-card p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Draft countdown placeholder</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-fg">Next league event</h3>
              <p className="mt-3 text-sm leading-7 text-fg-secondary">
                Keeper lock and the next draft are already modeled here so you can swap mock values for live schedules without touching the UI layer.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-line/70 bg-card-2/70 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Next draft</p>
                  <p className="mt-2 text-lg font-semibold text-fg">{formatDateTime(data.league.nextDraftDate)}</p>
                  <p className="mt-1 text-xs text-fg-secondary">{nextDraftCountdown}</p>
                </div>
                <div className="rounded-2xl border border-line/70 bg-card-2/70 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Keeper deadline</p>
                  <p className="mt-2 text-lg font-semibold text-fg">{formatDateTime(data.keeperRules.deadline)}</p>
                  <p className="mt-1 text-xs text-fg-secondary">{data.keeperRules.maxKeepers} keepers max</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="draft-results" className="space-y-6 scroll-mt-28">
          <SectionHeading
            eyebrow="Draft Results"
            title="Draft board, table, and team views"
            description="The draft section is built for commissioner receipts: switch seasons, search by player, filter by position, and flip between a board view, sortable table, or roster-by-team recap."
          />

          <div className="surface-card-strong p-5 sm:p-6">
            <div className="grid gap-3 xl:grid-cols-[auto_auto_auto_1fr_auto] xl:items-end">
              <label className="space-y-2 text-sm font-medium text-fg">
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">Season</span>
                <select value={draftSeasonYear} onChange={(event) => setDraftSeasonYear(Number(event.target.value))} className="min-w-[10rem] px-4 py-3 text-sm">
                  {draftSeasons.map((season) => (
                    <option key={season.year} value={season.year}>{season.year}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm font-medium text-fg">
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">Team</span>
                <select value={draftTeamFilter} onChange={(event) => setDraftTeamFilter(event.target.value)} className="min-w-[12rem] px-4 py-3 text-sm">
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
                <select value={draftPositionFilter} onChange={(event) => setDraftPositionFilter(event.target.value as FantasyPlayerPosition | "all")} className="min-w-[10rem] px-4 py-3 text-sm">
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
                  className="w-full px-4 py-3 text-sm"
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

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="filter-chip px-2.5 py-1 font-semibold">{draftSeason.draftRounds} rounds</span>
              <span className="filter-chip px-2.5 py-1 font-semibold">{draftSeason.draftPicks.length} picks tracked</span>
              <span className="filter-chip px-2.5 py-1 font-semibold">Draft date {formatDate(draftSeason.draftDate)}</span>
              <span className="filter-chip px-2.5 py-1 font-semibold">Keepers highlighted</span>
            </div>
          </div>

          {filteredDraftPicks.length === 0 ? (
            <EmptyDraftState />
          ) : draftView === "board" ? (
            <div className="space-y-4 overflow-x-auto pb-2">
              <div className="min-w-[1100px] space-y-4">
                {Array.from({ length: draftSeason.draftRounds }, (_, index) => index + 1).map((round) => {
                  const roundOrder = round % 2 === 1 ? draftSeason.teamOrder : [...draftSeason.teamOrder].reverse();
                  return (
                    <div key={`round-${round}`} className="surface-card-strong p-4">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <h3 className="font-display text-xl font-semibold text-fg">Round {round}</h3>
                        <span className="rounded-full border border-line/70 bg-card px-3 py-1 text-xs font-semibold text-fg-secondary">
                          Snake {round % 2 === 1 ? "left to right" : "right to left"}
                        </span>
                      </div>
                      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${roundOrder.length}, minmax(0, 1fr))` }}>
                        {roundOrder.map((teamId) => {
                          const pick = filteredDraftPicks.find((entry) => entry.round === round && entry.teamId === teamId);
                          const team = teamsById.get(teamId);
                          const player = pick ? playersById.get(pick.playerId) : undefined;
                          return (
                            <div key={`${round}-${teamId}`} className="rounded-2xl border border-line/70 bg-card/80 p-3">
                              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                                {pick ? getDraftPickTeamShortName(pick, team) : draftSeason.standings.find((standing) => standing.teamId === teamId)?.shortName ?? team?.shortName}
                              </p>
                              {pick && player ? (
                                <>
                                  <p className="mt-3 font-semibold text-fg">{player.name}</p>
                                  <p className="mt-1 text-xs text-fg-secondary">{player.position} • {player.nflTeam}</p>
                                  <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                                    <span className="rounded-full border border-line/70 bg-card-2/70 px-2 py-1 font-semibold text-fg-secondary">#{pick.overallPick}</span>
                                    {pick.isKeeper ? (
                                      <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-1 font-semibold text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-500/12 dark:text-emerald-200">
                                        Keeper • R{pick.keeperCostRound}
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
                  <thead className="bg-card-2/80 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
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
                        <th key={`${label}-${index}`} className="px-4 py-3">
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
                      if (!player || !team) return null;

                      return (
                        <tr key={pick.id} className="border-t border-line/70 bg-card/90 transition hover:bg-card-2/80">
                          <td className="px-4 py-3 font-semibold text-fg">#{pick.overallPick}</td>
                          <td className="px-4 py-3 text-fg-secondary">R{pick.round}.{pick.pickInRound}</td>
                          <td className="px-4 py-3 text-fg">{getDraftPickTeamName(pick, team)}</td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-semibold text-fg">{player.name}</p>
                              <p className="text-xs text-muted">ADP {player.adp ?? "TBD"}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-fg">{player.position}</td>
                          <td className="px-4 py-3 text-fg-secondary">{player.nflTeam}</td>
                          <td className="px-4 py-3">
                            {pick.isKeeper ? (
                              <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-500/12 dark:text-emerald-200">
                                Keeper • R{pick.keeperCostRound}
                              </span>
                            ) : (
                              <span className="text-xs text-muted">No</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {draftSeason.teamOrder
                .filter((teamId) => draftTeamFilter === "all" || teamId === draftTeamFilter)
                .map((teamId) => {
                  const team = teamsById.get(teamId);
                  const teamPicks = filteredDraftPicks.filter((pick) => pick.teamId === teamId).sort((left, right) => left.overallPick - right.overallPick);
                  if (!team || teamPicks.length === 0) return null;
                  const teamLabel = teamPicks[0] ? getDraftPickTeamName(teamPicks[0], team) : team.teamName;

                  return (
                    <article key={teamId} className="surface-card-strong p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Team draft recap</p>
                          <h3 className="mt-2 font-display text-xl font-semibold text-fg">{teamLabel}</h3>
                        </div>
                        <span className="rounded-full border border-line/70 bg-card px-3 py-1 text-xs font-semibold text-fg-secondary">{teamPicks.length} picks</span>
                      </div>
                      <div className="mt-4 space-y-3">
                        {teamPicks.map((pick) => {
                          const player = playersById.get(pick.playerId);
                          if (!player) return null;
                          return (
                            <div key={pick.id} className="rounded-2xl border border-line/70 bg-card-2/70 p-3">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-fg">#{pick.overallPick} • {player.name}</p>
                                  <p className="mt-1 text-xs text-fg-secondary">Round {pick.round}, {player.position} • {player.nflTeam}</p>
                                </div>
                                {pick.isKeeper ? (
                                  <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-500/12 dark:text-emerald-200">
                                    Keeper
                                  </span>
                                ) : null}
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
        </section>

        <section id="keepers" className="space-y-6 scroll-mt-28">
          <SectionHeading
            eyebrow="Keeper Tool"
            title="Interactive keeper lab"
            description="Start with last season's roster, click into keeper candidates, and validate the selection against editable league rules. This stays fully client-side until you decide to connect a provider or upload structured data."
          />

          <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
            <div className="space-y-4">
              <div className="surface-card-strong p-5 sm:p-6">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,15rem)_1fr] lg:items-end">
                  <label className="space-y-2 text-sm font-medium text-fg">
                    <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">Select team</span>
                    <select value={selectedKeeperTeamId} onChange={(event) => setSelectedKeeperTeamId(event.target.value)} className="w-full px-4 py-3 text-sm">
                      {data.teams.map((team) => (
                        <option key={team.id} value={team.id}>{team.teamName}</option>
                      ))}
                    </select>
                  </label>
                  <div className="rounded-2xl border border-line/70 bg-card-2/70 p-4 text-sm text-fg-secondary">
                    <p className="font-semibold text-fg">Rules in play</p>
                    <ul className="mt-2 space-y-1.5 leading-6">
                      <li>• Max keepers: {data.keeperRules.maxKeepers}</li>
                      <li>• Cost rule: {data.keeperRules.costRule}</li>
                      <li>• Round penalty: {data.keeperRules.roundPenaltyRule}</li>
                      <li>• Waiver default: {data.keeperRules.defaultWaiverCost}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="surface-card-strong p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Last season roster</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-fg">
                      {teamsById.get(selectedKeeperTeamId)?.teamName}
                    </h3>
                    <p className="mt-2 text-sm text-fg-secondary">
                      Keeper candidates sourced from the {sourceSeason.year} draft ledger. Toggle players to build a keeper submission preview.
                    </p>
                  </div>
                  <span className="rounded-full border border-line/70 bg-card px-3 py-1 text-xs font-semibold text-fg-secondary">
                    {sourceRoster.length} tracked players
                  </span>
                </div>

                <div className="mt-5 grid gap-3">
                  {sourceRoster.map(({ pick, player, candidate }) => {
                    const selected = selectedKeeperPlayerIds.includes(pick.playerId);
                    const eligible = candidate?.eligible ?? false;
                    return (
                      <button
                        key={`${pick.teamId}-${pick.playerId}`}
                        type="button"
                        onClick={() => toggleKeeper(pick.playerId)}
                        className={`rounded-[22px] border p-4 text-left transition ${selected ? "border-primary-300 bg-primary-50 shadow-card dark:border-primary-400/40 dark:bg-primary-500/12" : "border-line/70 bg-card/85 hover:-translate-y-0.5 hover:border-primary-200 dark:hover:border-primary-400/25"}`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-fg">{player.name}</p>
                              <span className="rounded-full border border-line/70 bg-card-2/70 px-2 py-0.5 text-[11px] font-semibold text-fg-secondary">{player.position}</span>
                              <span className="rounded-full border border-line/70 bg-card-2/70 px-2 py-0.5 text-[11px] font-semibold text-fg-secondary">{player.nflTeam}</span>
                            </div>
                            <p className="mt-2 text-sm text-fg-secondary">
                              Drafted in Round {pick.round} • Keeper cost {candidate?.keeperCostRound ? `Round ${candidate.keeperCostRound}` : "review required"}
                            </p>
                            {candidate?.notes ? <p className="mt-2 text-xs leading-6 text-muted">{candidate.notes}</p> : null}
                          </div>
                          <div className="flex flex-wrap gap-2 sm:justify-end">
                            <span className={eligible ? "rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-500/12 dark:text-emerald-200" : "rounded-full border border-rose-300 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 dark:border-rose-400/35 dark:bg-rose-500/12 dark:text-rose-200"}>
                              {eligible ? "Eligible" : "Ineligible"}
                            </span>
                            <span className="rounded-full border border-line/70 bg-card px-2.5 py-1 text-[11px] font-semibold text-fg-secondary">
                              Years kept: {candidate?.yearsKept ?? 0}
                            </span>
                            <span className={selected ? "rounded-full border border-primary-300 bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700 dark:border-primary-400/45 dark:bg-primary-500/20 dark:text-primary-100" : "rounded-full border border-line/70 bg-card px-2.5 py-1 text-[11px] font-semibold text-fg-secondary"}>
                              {selected ? "Selected" : "Tap to select"}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <aside className="xl:sticky xl:top-24 xl:self-start">
              <div className="surface-card-strong p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Selected keeper summary</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-fg">
                  {teamsById.get(selectedKeeperTeamId)?.shortName} keeper slate
                </h3>
                <p className="mt-2 text-sm text-fg-secondary">
                  Export, share, or sanity-check the current keeper mix before final submission.
                </p>

                <div className="mt-5 space-y-3">
                  {selectedKeeperCandidates.length > 0 ? (
                    selectedKeeperCandidates.map((candidate) => {
                      const player = playersById.get(candidate.playerId);
                      if (!player) return null;
                      return (
                        <div key={`${candidate.teamId}-${candidate.playerId}`} className="rounded-2xl border border-line/70 bg-card-2/70 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-fg">{player.name}</p>
                              <p className="mt-1 text-xs text-fg-secondary">{player.position} • {player.nflTeam}</p>
                            </div>
                            <span className="rounded-full border border-line/70 bg-card px-2.5 py-1 text-[11px] font-semibold text-fg-secondary">
                              Cost R{candidate.keeperCostRound ?? "?"}
                            </span>
                          </div>
                          <p className="mt-2 text-xs text-muted">Previous draft round {candidate.previousDraftRound ?? "n/a"} • Years kept {candidate.yearsKept}</p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl border border-dashed border-line/70 bg-card-2/50 p-6 text-center text-sm text-fg-secondary">
                      Select players from the roster to build a keeper submission summary.
                    </div>
                  )}
                </div>

                {keeperWarnings.length > 0 ? (
                  <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50/90 p-4 text-sm dark:border-amber-400/30 dark:bg-amber-500/10">
                    <p className="font-semibold text-amber-800 dark:text-amber-200">Warnings</p>
                    <ul className="mt-2 space-y-1.5 text-amber-700 dark:text-amber-100">
                      {keeperWarnings.map((warning) => (
                        <li key={warning}>• {warning}</li>
                      ))}
                    </ul>
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

                <div className="mt-5 rounded-2xl border border-line/70 bg-card-2/70 p-4 text-sm text-fg-secondary">
                  <p className="font-semibold text-fg">Editable league rules</p>
                  <p className="mt-2 leading-7">Everything on this tool is driven by a single local data file. Update max keepers, deadline, waiver defaults, or round penalties without rewriting the component logic.</p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="league-history" className="space-y-6 scroll-mt-28">
          <SectionHeading
            eyebrow="League History"
            title="Champions, runners-up, and season archive"
            description="A legacy-style archive of who won, who came close, and which seasons shaped the current rivalries. Older seasons can stay summary-only until you import deeper data."
          />

          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="surface-card-strong overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-card-2/80 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    <tr>
                      <th className="px-4 py-3">Season</th>
                      <th className="px-4 py-3">Champion</th>
                      <th className="px-4 py-3">Runner-up</th>
                      <th className="px-4 py-3">Regular season winner</th>
                      <th className="px-4 py-3">Highest scorer</th>
                      <th className="px-4 py-3">Worst record</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seasonsNewestFirst.map((season) => (
                      <tr key={season.id} className="border-t border-line/70 bg-card/90 transition hover:bg-card-2/70">
                        <td className="px-4 py-3 font-semibold text-fg">{season.year}</td>
                        <td className="px-4 py-3 text-fg">{season.summary.championDisplayName ?? teamsById.get(season.summary.championTeamId)?.teamName}</td>
                        <td className="px-4 py-3 text-fg-secondary">{season.summary.runnerUpDisplayName ?? teamsById.get(season.summary.runnerUpTeamId)?.teamName}</td>
                        <td className="px-4 py-3 text-fg-secondary">{season.summary.regularSeasonWinnerDisplayName ?? teamsById.get(season.summary.regularSeasonWinnerTeamId)?.shortName}</td>
                        <td className="px-4 py-3 text-fg-secondary">{season.summary.highestScoringTeamDisplayName ?? teamsById.get(season.summary.highestScoringTeamId)?.shortName}</td>
                        <td className="px-4 py-3 text-fg-secondary">{season.summary.worstRecordTeamDisplayName ?? teamsById.get(season.summary.worstRecordTeamId)?.shortName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <div className="surface-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Playoff bracket placeholder</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-fg">Bracket and matchup history</h3>
                <p className="mt-3 text-sm leading-7 text-fg-secondary">
                  Keep this card in place for a future playoff tree, visual bracket recap, or screenshot uploads from Yahoo, ESPN, or Sleeper.
                </p>
                <div className="mt-4 rounded-2xl border border-dashed border-line/70 bg-card-2/50 p-6 text-center text-sm text-muted">
                  Bracket visualization placeholder
                </div>
              </div>

              <div className="surface-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Draft history</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-fg">Jump back into draft receipts</h3>
                <p className="mt-3 text-sm leading-7 text-fg-secondary">
                  Pair the historical archive with the draft board when league members want context on how a season was built.
                </p>
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
        </section>

        <section id="records" className="space-y-6 scroll-mt-28">
          <SectionHeading
            eyebrow="Records & Awards"
            title="Legacy stats that make the group chat louder"
            description="Weekly highs, brutal lows, draft wins, and annual awards give the page the personality a serious fantasy league hub needs."
          />

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {data.records.map((record) => {
              const team = record.teamId ? teamsById.get(record.teamId) : undefined;
              const member = record.memberId ? membersById.get(record.memberId) : undefined;
              return (
                <article key={record.id} className="surface-card-strong p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{record.category}</p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-fg">{record.label}</h3>
                  <p className="mt-3 text-2xl font-semibold text-primary-600 dark:text-primary-300">{record.value}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">{record.seasonYear}</p>
                  <p className="mt-2 text-sm leading-7 text-fg-secondary">{record.context}</p>
                  {team || member ? (
                    <p className="mt-3 text-xs text-muted">{team?.teamName}{team && member ? " • " : ""}{member?.managerName}</p>
                  ) : null}
                </article>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.awards.map((award) => {
              const team = award.teamId ? teamsById.get(award.teamId) : undefined;
              const member = award.memberId ? membersById.get(award.memberId) : undefined;
              return (
                <article key={award.id} className="surface-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{award.seasonYear} award</p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-fg">{award.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-fg-secondary">{award.summary}</p>
                  <p className="mt-3 text-xs font-semibold text-primary-600 dark:text-primary-300">{team?.teamName}{team && member ? " • " : ""}{member?.managerName}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="teams" className="space-y-6 scroll-mt-28">
          <SectionHeading
            eyebrow="Member & Team Profiles"
            title="Profiles for every manager in the room"
            description="Blend team branding, all-time results, and rivalry notes so the league page feels like a real living archive instead of a one-season dashboard."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.teams.map((team) => {
              const member = membersById.get(team.memberId);
              const standing = currentStandings.find((entry) => entry.teamId === team.id);
              return (
                <article key={team.id} className="surface-card-strong overflow-hidden">
                  <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${team.colors.primary}, ${team.colors.secondary})` }} />
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${team.colors.primary}, ${team.colors.secondary})` }}>
                        {getInitials(team.shortName)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{member?.managerName}</p>
                        <h3 className="mt-1 font-display text-2xl font-semibold text-fg">{team.teamName}</h3>
                        <p className="mt-1 text-sm text-fg-secondary">{member?.favoriteTeam ? `${member.favoriteTeam} • ` : ""}{standing ? `${formatStandingRecord(standing)} in the latest archive season` : "Archive-backed team profile"}</p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-line/70 bg-card-2/70 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Titles</p>
                        <p className="mt-2 text-xl font-semibold text-fg">{team.championships}</p>
                      </div>
                      <div className="rounded-2xl border border-line/70 bg-card-2/70 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Playoffs</p>
                        <p className="mt-2 text-xl font-semibold text-fg">{team.playoffAppearances}</p>
                      </div>
                      <div className="rounded-2xl border border-line/70 bg-card-2/70 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">All-time</p>
                        <p className="mt-2 text-xl font-semibold text-fg">{formatRecord(team)}</p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3 text-sm leading-7 text-fg-secondary">
                      <p><span className="font-semibold text-fg">Rivalry:</span> {member?.rivalryNote}</p>
                      <p><span className="font-semibold text-fg">Draft tendency:</span> {member?.draftTendency}</p>
                      <p><span className="font-semibold text-fg">Profile note:</span> {team.notes}</p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 text-xs">
                      {team.legacyNames.map((legacyName) => (
                        <span key={`${team.id}-${legacyName}`} className="filter-chip px-2.5 py-1 font-semibold">
                          {legacyName}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="surface-card p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="eyebrow">Future Integration Ready</p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Built to swap mock data for live league data later</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-fg-secondary sm:text-base">
                  The route is powered by a single fantasy data file today, but the structures are ready for Yahoo, Sleeper, ESPN, uploaded CSVs, or a Google Sheets bridge without rewriting the page-level UI.
                </p>
              </div>
              <div className="grid gap-2 text-xs sm:grid-cols-2">
                {data.league.platformReadiness.map((platform) => (
                  <span key={platform} className="rounded-full border border-line/70 bg-card px-3 py-2 font-semibold text-fg-secondary">
                    {platform} ready
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
