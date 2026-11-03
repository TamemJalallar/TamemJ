import type { FantasyLiveLeagueEnvelope } from "@/types/fantasy-live";

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function formatPoints(value?: number): string {
  return typeof value === "number" ? value.toFixed(1) : "--";
}

function formatRecord(wins?: number, losses?: number, ties?: number): string {
  if (typeof wins !== "number" || typeof losses !== "number") {
    return "--";
  }

  return `${wins}-${losses}${ties ? `-${ties}` : ""}`;
}

function getWeekLabel(snapshot: FantasyLiveLeagueEnvelope["data"]): string {
  const week = snapshot.league.currentWeek ?? snapshot.meta.currentWeek ?? snapshot.meta.requestedWeek;
  return typeof week === "number" ? `Week ${week}` : "Current slate";
}

export function FantasyLiveSnapshot({
  live,
  loading,
  error
}: {
  live: FantasyLiveLeagueEnvelope | null;
  loading: boolean;
  error: string | null;
}) {
  if (!loading && !live && !error) {
    return null;
  }

  const standings = live?.data.standings.slice(0, 5) ?? [];
  const matchups = live?.data.matchups.slice(0, 3) ?? [];
  const leagueName = live?.data.league.name ?? "Yahoo league snapshot";
  const syncedAt = live?.meta.lastSuccessfulRefreshAt ?? live?.data.meta.fetchedAt;

  return (
    <section className="surface-card-strong p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="eyebrow">Live Yahoo Sync</p>
          <h2 className="mt-4 font-display text-2xl font-semibold text-fg">Production league snapshot</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-fg-secondary">
            Current standings and scoreboard data served from the Cloudflare fantasy worker. The historical archive below still uses your curated league records and keeper setup.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <span className="rounded-full border border-line/70 bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-fg-secondary">
            {loading ? "Syncing" : live?.meta.cacheState === "stale" ? "Stale cache" : "Fresh cache"}
          </span>
          {live ? (
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
              {getWeekLabel(live.data)}
            </span>
          ) : null}
        </div>
      </div>

      {live ? (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-line/70 bg-card-2/70 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">League</p>
              <p className="mt-2 text-lg font-semibold text-fg">{leagueName}</p>
              <p className="mt-1 text-xs text-fg-secondary">{live.data.league.leagueKey}</p>
            </div>
            <div className="rounded-2xl border border-line/70 bg-card-2/70 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Synced</p>
              <p className="mt-2 text-lg font-semibold text-fg">{syncedAt ? formatDateTime(syncedAt) : "Pending"}</p>
              <p className="mt-1 text-xs text-fg-secondary">Source: {live.meta.source}</p>
            </div>
            <div className="rounded-2xl border border-line/70 bg-card-2/70 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Teams</p>
              <p className="mt-2 text-lg font-semibold text-fg">{live.data.standings.length || live.data.league.numTeams || 0}</p>
              <p className="mt-1 text-xs text-fg-secondary">Scoring: {live.data.league.scoringType ?? "Yahoo"}</p>
            </div>
            <div className="rounded-2xl border border-line/70 bg-card-2/70 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Status</p>
              <p className="mt-2 text-lg font-semibold text-fg">{live.data.matchups.length ? `${live.data.matchups.length} tracked` : "No matchups"}</p>
              <p className="mt-1 text-xs text-fg-secondary">Draft: {live.data.league.draftStatus ?? "n/a"}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[24px] border border-line/70 bg-card/85 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-semibold text-fg">Live standings</h3>
                <span className="text-xs uppercase tracking-[0.14em] text-muted">Top 5</span>
              </div>
              <div className="mt-4 divide-y divide-line/70 overflow-hidden rounded-2xl border border-line/70 bg-card-2/70">
                {standings.map((team) => (
                  <div key={team.teamKey} className="grid grid-cols-[auto_1fr_auto_auto] gap-3 px-4 py-3 text-sm">
                    <span className="font-display text-lg font-semibold text-fg">{team.rank ?? "-"}</span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-fg">{team.name}</p>
                      <p className="truncate text-xs text-muted">{team.managerNames.join(", ") || "Manager pending"}</p>
                    </div>
                    <span className="font-medium text-fg">{formatRecord(team.wins, team.losses, team.ties)}</span>
                    <span className="font-medium text-fg-secondary">{formatPoints(team.pointsFor)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-line/70 bg-card/85 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-semibold text-fg">Current matchups</h3>
                <span className="text-xs uppercase tracking-[0.14em] text-muted">Yahoo feed</span>
              </div>
              <div className="mt-4 space-y-3">
                {matchups.length ? (
                  matchups.map((matchup) => (
                    <div key={matchup.matchupId} className="rounded-2xl border border-line/70 bg-card-2/70 p-3">
                      <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                        <span>Week {matchup.week}</span>
                        <span>{matchup.status}</span>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm">
                        {matchup.teams.map((team) => (
                          <div key={team.teamKey} className="flex items-center justify-between gap-3">
                            <span className="font-medium text-fg">{team.name}</span>
                            <span className="font-semibold text-fg">{formatPoints(team.points)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-line/70 bg-card-2/45 p-6 text-sm text-fg-secondary">
                    Yahoo returned no current matchup rows yet. This usually fills in once the league week and scoreboard are available.
                  </div>
                )}
              </div>
            </div>
          </div>

          {live.meta.warning ? <p className="mt-4 text-sm text-amber-300">{live.meta.warning}</p> : null}
        </>
      ) : loading ? (
        <div className="mt-5 rounded-2xl border border-dashed border-line/70 bg-card-2/45 p-6 text-sm text-fg-secondary">
          Checking for the production Yahoo fantasy worker.
        </div>
      ) : error ? (
        <div className="mt-5 rounded-2xl border border-dashed border-line/70 bg-card-2/45 p-6 text-sm text-fg-secondary">
          Live fantasy data is not available yet: {error}
        </div>
      ) : null}
    </section>
  );
}
