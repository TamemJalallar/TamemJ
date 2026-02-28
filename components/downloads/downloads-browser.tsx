"use client";

import { useMemo, useState } from "react";
import type { DownloadChannelLink, DownloadEntry, DownloadPlatform } from "@/types/download";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const platformOrder: DownloadPlatform[] = ["macOS", "Windows", "Linux", "iOS", "Android", "Web"];
const channelFilters = ["All", "Store", "Direct", "GitHub"] as const;
const sortOptions = ["Best Match", "A-Z", "Most Platforms", "Most Download Options"] as const;

type ChannelFilter = (typeof channelFilters)[number];
type SortOption = (typeof sortOptions)[number];

function channelButtonLabel(channel: DownloadChannelLink): string {
  switch (channel.type) {
    case "Mac App Store":
      return channel.label ?? "Mac App Store";
    case "Microsoft Store":
      return channel.label ?? "Microsoft Store";
    case "GitHub Releases":
      return channel.label ?? "GitHub Releases";
    case "Source Code":
      return channel.label ?? "Source Code";
    case "Direct Download":
      return channel.label ?? "Direct Download";
    case "Website":
      return channel.label ?? "Official Website";
    default:
      return channel.label ?? "Open";
  }
}

function channelChipTone(channel: DownloadChannelLink): string {
  switch (channel.type) {
    case "Mac App Store":
      return "border-slate-800 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900";
    case "Microsoft Store":
      return "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100";
    case "GitHub Releases":
      return "border-zinc-300 bg-zinc-100 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";
    case "Direct Download":
      return "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-100";
    case "Website":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-100";
    default:
      return "border-line bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200";
  }
}

function formatVersion(version: string): string {
  return /^v/i.test(version) ? version : `v${version}`;
}

function isFreeEntry(entry: DownloadEntry): boolean {
  return (entry.pricing ?? "").toLowerCase().includes("free");
}

function hasStoreChannel(entry: DownloadEntry): boolean {
  return entry.channels.some(
    (channel) => channel.type === "Mac App Store" || channel.type === "Microsoft Store"
  );
}

function hasDirectDownloads(entry: DownloadEntry): boolean {
  return (entry.directDownloads?.length ?? 0) > 0;
}

function isPopularEntry(entry: DownloadEntry): boolean {
  return Boolean(entry.featuredOnGitHub || entry.popularityLabel);
}

function entryScore(entry: DownloadEntry): number {
  let score = 0;
  if (entry.popularityLabel) score += 6;
  if (entry.featuredOnGitHub) score += 4;
  if (hasStoreChannel(entry)) score += 2;
  if (hasDirectDownloads(entry)) score += 2;
  if (isFreeEntry(entry)) score += 1;
  return score;
}

function matchesChannelFilter(entry: DownloadEntry, filter: ChannelFilter): boolean {
  if (filter === "All") return true;
  if (filter === "Store") return hasStoreChannel(entry);
  if (filter === "Direct") return hasDirectDownloads(entry);
  if (filter === "GitHub") {
    return (
      entry.featuredOnGitHub ||
      entry.channels.some((channel) => channel.type === "GitHub Releases" || channel.type === "Source Code")
    );
  }
  return true;
}

export function DownloadsBrowser({
  entries,
  amazonAffiliateUrl
}: {
  entries: DownloadEntry[];
  amazonAffiliateUrl?: string;
}) {
  const [query, setQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<DownloadPlatform | "All">("All");
  const [categoryFilter, setCategoryFilter] = useState<string | "All">("All");
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("All");
  const [sortBy, setSortBy] = useState<SortOption>("Best Match");
  const [freeOnly, setFreeOnly] = useState(true);
  const [popularOnly, setPopularOnly] = useState(false);

  const availablePlatforms = useMemo(() => {
    const set = new Set<DownloadPlatform>();
    for (const entry of entries) {
      for (const platform of entry.platforms) set.add(platform);
    }
    return platformOrder.filter((platform) => set.has(platform));
  }, [entries]);

  const availableCategories = useMemo(() => {
    return [...new Set(entries.map((entry) => entry.category))].sort((a, b) => a.localeCompare(b));
  }, [entries]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const matches = entries.filter((entry) => {
      if (platformFilter !== "All" && !entry.platforms.includes(platformFilter)) return false;
      if (categoryFilter !== "All" && entry.category !== categoryFilter) return false;
      if (!matchesChannelFilter(entry, channelFilter)) return false;
      if (freeOnly && !isFreeEntry(entry)) return false;
      if (popularOnly && !isPopularEntry(entry)) return false;

      if (!normalized) return true;
      const haystack = [
        entry.name,
        entry.summary,
        entry.category,
        entry.developer ?? "",
        entry.pricing ?? "",
        ...entry.tags,
        ...entry.platforms
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });

    return matches.sort((a, b) => {
      if (sortBy === "A-Z") return a.name.localeCompare(b.name);
      if (sortBy === "Most Platforms") return b.platforms.length - a.platforms.length || a.name.localeCompare(b.name);
      if (sortBy === "Most Download Options") {
        const optionsA = a.channels.length + (a.directDownloads?.length ?? 0);
        const optionsB = b.channels.length + (b.directDownloads?.length ?? 0);
        return optionsB - optionsA || a.name.localeCompare(b.name);
      }
      return entryScore(b) - entryScore(a) || a.name.localeCompare(b.name);
    });
  }, [categoryFilter, channelFilter, entries, freeOnly, platformFilter, popularOnly, query, sortBy]);

  const spotlight = useMemo(() => {
    return filtered.filter((entry) => isPopularEntry(entry) || hasStoreChannel(entry)).slice(0, 4);
  }, [filtered]);

  const stats = useMemo(() => {
    const directArtifactCount = filtered.reduce(
      (sum, entry) => sum + (entry.directDownloads?.length ?? 0),
      0
    );
    return {
      total: filtered.length,
      free: filtered.filter(isFreeEntry).length,
      store: filtered.filter(hasStoreChannel).length,
      directArtifacts: directArtifactCount
    };
  }, [filtered]);

  function resetFilters() {
    setQuery("");
    setPlatformFilter("All");
    setCategoryFilter("All");
    setChannelFilter("All");
    setSortBy("Best Match");
    setFreeOnly(true);
    setPopularOnly(false);
  }

  const hasCustomFilters =
    query.trim().length > 0 ||
    platformFilter !== "All" ||
    categoryFilter !== "All" ||
    channelFilter !== "All" ||
    sortBy !== "Best Match" ||
    !freeOnly ||
    popularOnly;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-6 text-white shadow-card sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">
              Downloads Hub
            </p>
            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Popular free downloads with trusted sources and direct binaries
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">
              Browse high-signal software picks with Mac and Microsoft Store links, plus GitHub Releases
              and official direct download paths where available.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-200">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                Store links first
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                Version + checksum metadata
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                Static-site friendly
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard label="Visible Apps" value={String(stats.total)} />
            <StatCard label="Free Apps" value={String(stats.free)} />
            <StatCard label="Store Listings" value={String(stats.store)} />
            <StatCard label="Direct Binaries" value={String(stats.directArtifacts)} />
          </div>
        </div>
      </section>

      {amazonAffiliateUrl ? (
        <section className="surface-card p-5 sm:p-6 dark:border-slate-700 dark:bg-slate-950">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Recommended Gear
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                Shop popular IT accessories
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Monitors, docks, cables, and support-team essentials.
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Disclosure: This section contains affiliate links. If you buy through these links, I may
                earn a commission at no extra cost to you.
              </p>
            </div>
            <a
              href={amazonAffiliateUrl}
              target="_blank"
              rel="sponsored nofollow noreferrer"
              className="btn-secondary shrink-0 !px-5 !py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Open Amazon Picks
            </a>
          </div>
        </section>
      ) : null}

      <section className="surface-card p-5 sm:p-6 dark:border-slate-700 dark:bg-slate-950">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Search Downloads
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by app, platform, category, or tag..."
              className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="block lg:min-w-48">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Sort
            </span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Platform
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <FilterButton active={platformFilter === "All"} onClick={() => setPlatformFilter("All")} label="All" />
              {availablePlatforms.map((platform) => (
                <FilterButton
                  key={platform}
                  active={platformFilter === platform}
                  onClick={() => setPlatformFilter(platform)}
                  label={platform}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Category
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <FilterButton active={categoryFilter === "All"} onClick={() => setCategoryFilter("All")} label="All" />
              {availableCategories.map((category) => (
                <FilterButton
                  key={category}
                  active={categoryFilter === category}
                  onClick={() => setCategoryFilter(category)}
                  label={category}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Channel
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {channelFilters.map((filter) => (
                <FilterButton
                  key={filter}
                  active={channelFilter === filter}
                  onClick={() => setChannelFilter(filter)}
                  label={filter}
                  accent={filter === "GitHub" ? "cyan" : "slate"}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <FilterButton
            active={freeOnly}
            onClick={() => setFreeOnly((current) => !current)}
            label="Free Only"
            accent="emerald"
          />
          <FilterButton
            active={popularOnly}
            onClick={() => setPopularOnly((current) => !current)}
            label="Popular Only"
            accent="amber"
          />
          {hasCustomFilters ? (
            <button type="button" onClick={resetFilters} className="btn-secondary !px-4 !py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
              Reset Filters
            </button>
          ) : null}

          <p className="ml-auto text-xs text-slate-500 dark:text-slate-400">
            Showing {filtered.length} of {entries.length} apps
          </p>
        </div>
      </section>

      {spotlight.length > 0 ? (
        <section className="space-y-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight">Featured Free Picks</h2>
            <p className="text-sm sm:text-base">
              High-trust apps with strong adoption and reliable update channels.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {spotlight.map((entry) => (
              <SpotlightCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </section>
      ) : null}

      <section id="all-downloads" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">All Downloads</h2>
            <p className="text-sm sm:text-base">Curated links across store listings, official sites, and release channels.</p>
          </div>
          <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {filtered.length} Results
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {filtered.map((entry) => (
              <DownloadCard key={entry.slug} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="surface-card border-dashed p-6 dark:border-slate-700 dark:bg-slate-950">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              No downloads match the current filters. Reset filters and try a broader search.
            </p>
          </div>
        )}
      </section>

      <section className="surface-card p-5 sm:p-6 dark:border-slate-700 dark:bg-slate-950">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Trust and legal checklist</h2>
        <ul className="mt-4 space-y-2 pl-5 text-sm sm:text-base">
          <li className="list-disc">
            Prefer official Apple and Microsoft store pages when store distribution is available.
          </li>
          <li className="list-disc">
            Publish SHA-256 values for direct binaries whenever checksum metadata is available.
          </li>
          <li className="list-disc">
            Keep hosted binaries off GitHub Pages and use GitHub Releases or approved object storage.
          </li>
        </ul>
      </section>
    </div>
  );
}

function FilterButton({
  active,
  label,
  onClick,
  accent = "slate"
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  accent?: "slate" | "cyan" | "emerald" | "amber";
}) {
  const palette =
    accent === "cyan"
      ? active
        ? "border-cyan-700 bg-cyan-600 text-white"
        : "border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-100 dark:hover:bg-cyan-900/60"
      : accent === "emerald"
        ? active
          ? "border-emerald-700 bg-emerald-600 text-white"
          : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100 dark:hover:bg-emerald-900/60"
        : accent === "amber"
          ? active
            ? "border-amber-700 bg-amber-500 text-white"
            : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-100 dark:hover:bg-amber-900/60"
          : active
            ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
            : "border-line bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx("rounded-full border px-3 py-1.5 text-xs font-semibold transition", palette)}
    >
      {label}
    </button>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.14em] text-cyan-100">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function SpotlightCard({ entry }: { entry: DownloadEntry }) {
  return (
    <article className="surface-card-strong p-5 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{entry.name}</h3>
          <p className="mt-2 text-sm leading-6">{entry.summary}</p>
        </div>
        {isFreeEntry(entry) ? (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100">
            Free
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {entry.platforms.slice(0, 4).map((platform) => (
          <span
            key={`${entry.slug}-spotlight-${platform}`}
            className="rounded-full border border-line bg-white px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {platform}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {entry.channels.slice(0, 3).map((channel) => (
          <a
            key={`${entry.slug}-${channel.type}-${channel.url}`}
            href={channel.url}
            target="_blank"
            rel="noreferrer"
            className={cx(
              "inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:opacity-90",
              channelChipTone(channel)
            )}
          >
            {channelButtonLabel(channel)}
          </a>
        ))}
      </div>
    </article>
  );
}

function DownloadCard({ entry }: { entry: DownloadEntry }) {
  const visibleTags = entry.tags.slice(0, 4);
  const hiddenTagCount = entry.tags.length - visibleTags.length;

  return (
    <article id={entry.slug} className="surface-card-strong scroll-mt-24 overflow-hidden p-5 sm:p-6 dark:border-slate-700 dark:bg-slate-900">
      <div className="pointer-events-none mb-4 h-1 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-slate-900" />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-line bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {entry.category}
            </span>
            {entry.popularityLabel ? (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-100">
                {entry.popularityLabel}
              </span>
            ) : null}
            {isFreeEntry(entry) ? (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100">
                Free
              </span>
            ) : null}
          </div>

          <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">{entry.name}</h3>
          <p className="mt-2 text-sm leading-6">{entry.summary}</p>
        </div>

        <div className="text-right text-xs text-slate-500 dark:text-slate-400">
          {entry.developer ? <p>{entry.developer}</p> : null}
          {entry.license ? <p className="mt-1">License: {entry.license}</p> : null}
          {entry.pricing ? <p className="mt-1">{entry.pricing}</p> : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {entry.platforms.map((platform) => (
          <span
            key={`${entry.slug}-${platform}`}
            className="rounded-full border border-line bg-white px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {platform}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {entry.channels.map((channel) => (
          <a
            key={`${entry.slug}-${channel.type}-${channel.url}`}
            href={channel.url}
            target="_blank"
            rel="noreferrer"
            className={cx(
              "inline-flex items-center justify-center rounded-full border px-4 py-2 text-xs font-semibold transition hover:opacity-90",
              channelChipTone(channel)
            )}
          >
            {channelButtonLabel(channel)}
          </a>
        ))}
      </div>

      {entry.directDownloads && entry.directDownloads.length > 0 ? (
        <div className="mt-5 rounded-2xl border border-line/80 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/70">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Direct Downloads</h4>
            <span className="rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              Version + hash metadata
            </span>
          </div>

          <ul className="mt-3 space-y-2">
            {entry.directDownloads.map((artifact) => (
              <li key={`${entry.slug}-${artifact.label}-${artifact.platform}`} className="rounded-xl border border-line bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{artifact.label}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {artifact.platform}
                      {artifact.fileType ? ` | ${artifact.fileType}` : ""}
                      {artifact.version ? ` | ${formatVersion(artifact.version)}` : ""}
                      {artifact.fileSize ? ` | ${artifact.fileSize}` : ""}
                      {artifact.host ? ` | ${artifact.host}` : ""}
                    </p>
                    {artifact.notes ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{artifact.notes}</p> : null}
                    {artifact.checksumSha256 ? (
                      <p className="mt-1 break-all font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        SHA-256: {artifact.checksumSha256}
                      </p>
                    ) : null}
                  </div>
                  <a href={artifact.url} target="_blank" rel="noreferrer" className="btn-secondary shrink-0 !px-4 !py-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
                    Download
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {visibleTags.map((tag) => (
          <span
            key={`${entry.slug}-tag-${tag}`}
            className="rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            #{tag}
          </span>
        ))}
        {hiddenTagCount > 0 ? (
          <span className="rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            +{hiddenTagCount} more
          </span>
        ) : null}
      </div>
    </article>
  );
}
