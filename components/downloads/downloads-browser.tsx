"use client";

import { useEffect, useMemo, useState } from "react";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole
} from "@floating-ui/react";
import type {
  DirectDownloadArtifact,
  DownloadChannelLink,
  DownloadEntry,
  DownloadPlatform
} from "@/types/download";
import type { TrackDownloadInput } from "@/types/account";
import { useAccount } from "@/components/account/account-provider";
import { buildFuzzyIndex, runFuzzySearch } from "@/lib/fuzzy-search";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

async function copyText(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

const platformOrder: DownloadPlatform[] = ["macOS", "Windows", "Linux", "iOS", "Android", "Web"];
const channelFilters = ["All", "Store", "Direct", "GitHub"] as const;
const sortOptions = ["By Type", "Best Match", "Most Platforms", "Most Download Options", "A-Z"] as const;

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

function getNameInitials(name: string): string {
  const tokens = name.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return "?";
  }

  return tokens
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? "")
    .join("");
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

function popularityWeight(label?: string): number {
  if (!label) return 0;
  const normalized = label.toLowerCase();
  if (normalized.includes("most used")) return 12;
  if (normalized.includes("on github")) return 4;
  if (normalized.includes("popular")) return 6;
  return 4;
}

function getFeaturedDownloadLinks(entry: DownloadEntry): Array<{
  label: string;
  url: string;
  platform: DownloadPlatform | null;
}> {
  const directArtifacts = entry.directDownloads ?? [];

  if (directArtifacts.length > 0) {
    return directArtifacts.slice(0, 4).map((artifact) => ({
      label: artifact.label,
      url: artifact.url,
      platform: artifact.platform
    }));
  }

  const primaryChannel =
    entry.channels.find((channel) => channel.type === "Mac App Store" || channel.type === "Microsoft Store") ??
    entry.channels[0];

  if (!primaryChannel) {
    return [];
  }

  return [
    {
      label: channelButtonLabel(primaryChannel),
      url: primaryChannel.url,
      platform: null
    }
  ];
}

function entryScore(entry: DownloadEntry): number {
  let score = 0;
  score += popularityWeight(entry.popularityLabel);
  if (entry.featuredOnGitHub) score += 2;
  if (hasStoreChannel(entry)) score += 2;
  if (hasDirectDownloads(entry)) score += 2;
  if (entry.platforms.length >= 4) score += 1;
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
  amazonAffiliateUrl,
  amazonFeaturedProducts = []
}: {
  entries: DownloadEntry[];
  amazonAffiliateUrl?: string;
  amazonFeaturedProducts?: Array<{
    label: string;
    url: string;
  }>;
}) {
  const { user, trackDownload } = useAccount();
  const [query, setQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<DownloadPlatform | "All">("All");
  const [categoryFilter, setCategoryFilter] = useState<string | "All">("All");
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("All");
  const [sortBy, setSortBy] = useState<SortOption>("By Type");
  const [freeOnly, setFreeOnly] = useState(true);
  const [popularOnly, setPopularOnly] = useState(false);
  const INITIAL_VISIBLE = 18;
  const LOAD_MORE_STEP = 18;
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

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

    const facetMatches = entries.filter((entry) => {
      if (platformFilter !== "All" && !entry.platforms.includes(platformFilter)) return false;
      if (categoryFilter !== "All" && entry.category !== categoryFilter) return false;
      if (!matchesChannelFilter(entry, channelFilter)) return false;
      if (freeOnly && !isFreeEntry(entry)) return false;
      if (popularOnly && !isPopularEntry(entry)) return false;
      return true;
    });

    const fuzzyIndex = buildFuzzyIndex(facetMatches, {
      keys: [
        { name: "name", weight: 0.4 },
        { name: "summary", weight: 0.24 },
        { name: "category", weight: 0.1 },
        { name: "tags", weight: 0.12 },
        { name: "platforms", weight: 0.07 },
        { name: "developer", weight: 0.04 },
        { name: "popularityLabel", weight: 0.03 }
      ],
      threshold: 0.35
    });

    let matches = facetMatches;
    if (normalized) {
      const fuzzyMatches = runFuzzySearch(fuzzyIndex, normalized, 200).map((entry) => entry.item);
      matches =
        fuzzyMatches.length > 0
          ? fuzzyMatches
          : facetMatches.filter((entry) => {
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
    }

    return matches.sort((a, b) => {
      if (sortBy === "By Type") {
        return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
      }
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

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [query, platformFilter, categoryFilter, channelFilter, sortBy, freeOnly, popularOnly]);

  const visibleEntries = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  const spotlight = useMemo(() => {
    return [...filtered]
      .filter((entry) => isPopularEntry(entry) || hasStoreChannel(entry))
      .sort(
        (a, b) =>
          entryScore(b) - entryScore(a) ||
          b.platforms.length - a.platforms.length ||
          a.name.localeCompare(b.name)
      )
      .slice(0, 4);
  }, [filtered]);

  const groupedByType = useMemo(() => {
    const map = new Map<string, DownloadEntry[]>();
    for (const entry of visibleEntries) {
      const current = map.get(entry.category) ?? [];
      current.push(entry);
      map.set(entry.category, current);
    }

    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([category, items]) => ({ category, items }));
  }, [visibleEntries]);

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
    setSortBy("By Type");
    setFreeOnly(true);
    setPopularOnly(false);
  }

  const hasCustomFilters =
    query.trim().length > 0 ||
    platformFilter !== "All" ||
    categoryFilter !== "All" ||
    channelFilter !== "All" ||
    sortBy !== "By Type" ||
    !freeOnly ||
    popularOnly;

  function handleTrackDownload(input: TrackDownloadInput): void {
    void trackDownload(input);
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-5 text-white shadow-card sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="relative grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">
              Downloads Hub
            </p>
            <h1 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Popular free downloads with trusted sources and direct binaries
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200 sm:text-base">
              Browse high-signal software picks with Mac and Microsoft Store links, plus GitHub Releases
              and official direct download paths where available.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
              <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
                Store links first
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
                Version + checksum metadata
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
                Static-site friendly
              </span>
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <StatCard label="Visible Apps" value={String(stats.total)} />
            <StatCard label="Free Apps" value={String(stats.free)} />
            <StatCard label="Store Listings" value={String(stats.store)} />
            <StatCard label="Direct Binaries" value={String(stats.directArtifacts)} />
          </div>
        </div>
      </section>

      <section className="surface-card p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-950">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">How to use this page</h2>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {user ? "Signed in: download history is being tracked to your profile." : "Tip: sign in to track your downloads in your profile."}
        </p>
        <ul className="mt-3 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200 sm:text-base">
          <li className="list-disc">Use search + filters to narrow by app, platform, category, and channel.</li>
          <li className="list-disc">
            In each app card, use the OS chips at the top-right: hover on desktop or tap on mobile to open download details.
          </li>
          <li className="list-disc">
            Inside the OS panel, use direct “Download” links and verify the displayed SHA-256 checksum when provided.
          </li>
          <li className="list-disc">
            Store links are prioritized when available; direct binaries and GitHub Releases are shown for non-store apps.
          </li>
        </ul>
      </section>

      {amazonAffiliateUrl || amazonFeaturedProducts.length > 0 ? (
        <section className="surface-card p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-950">
          <div className="flex flex-col gap-3">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Recommended Gear
              </p>
              <h2 className="mt-1.5 text-lg font-semibold text-slate-900 dark:text-slate-100">
                Shop curated Amazon picks
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Monitors, docks, cables, and support-team essentials.
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Disclosure: This section contains affiliate links. If you buy through these links, I may
                earn a commission at no extra cost to you.
              </p>
            </div>

            {amazonFeaturedProducts.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {amazonFeaturedProducts.map((product) => (
                  <a
                    key={product.url}
                    href={product.url}
                    target="_blank"
                    rel="sponsored nofollow noreferrer"
                    className="group rounded-xl border border-line bg-white/90 p-3 text-sm transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-cyan-700 dark:hover:bg-cyan-900/30"
                  >
                    <p className="font-medium text-slate-900 dark:text-slate-100">{product.label}</p>
                    <p className="mt-1 text-xs text-cyan-700 transition group-hover:translate-x-0.5 dark:text-cyan-300">
                      Open product link
                    </p>
                  </a>
                ))}
              </div>
            ) : null}

            {amazonAffiliateUrl ? (
              <div className="flex">
                <a
                  href={amazonAffiliateUrl}
                  target="_blank"
                  rel="sponsored nofollow noreferrer"
                  className="btn-secondary shrink-0 !px-4 !py-2.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  Open Full Amazon Picks
                </a>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="surface-card p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-950">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Search Downloads
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by app, platform, category, or tag..."
              className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="block lg:min-w-48">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Sort
            </span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 grid gap-3 xl:grid-cols-3">
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

        <div className="mt-4 flex flex-wrap items-center gap-2">
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
            <button type="button" onClick={resetFilters} className="btn-secondary !px-3.5 !py-1.5 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
              Reset Filters
            </button>
          ) : null}

          <p className="ml-auto text-xs text-slate-500 dark:text-slate-400">
            Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} apps ({entries.length} total)
          </p>
        </div>
      </section>

      {spotlight.length > 0 ? (
        <section className="space-y-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold tracking-tight">Featured Free Picks</h2>
            <p className="text-sm sm:text-base">
              High-trust apps with strong adoption and reliable update channels.
            </p>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {spotlight.map((entry) => (
              <SpotlightCard key={entry.slug} entry={entry} onTrackDownload={handleTrackDownload} />
            ))}
          </div>
        </section>
      ) : null}

      <section id="all-downloads" className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2.5">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">All Downloads</h2>
            <p className="text-sm sm:text-base">Organized by type/category with curated links across stores, official sites, and release channels.</p>
          </div>
          <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {filtered.length} Results
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="space-y-4">
            {groupedByType.map((group) => (
              <details
                key={`group-${group.category}`}
                open
                className="group rounded-2xl border border-line/80 bg-white/70 p-3 shadow-soft dark:border-slate-700 dark:bg-slate-950"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-1 py-1 text-left [&::-webkit-details-marker]:hidden">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300">
                    {group.category}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{group.items.length} apps</span>
                    <span className="text-xs text-slate-500 transition group-open:rotate-180 dark:text-slate-400">
                      ▾
                    </span>
                  </div>
                </summary>
                <div className="mt-3 grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
                    {group.items.map((entry) => (
                      <div key={entry.slug}>
                        <DownloadCard entry={entry} onTrackDownload={handleTrackDownload} />
                      </div>
                    ))}
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className="surface-card border-dashed p-5 dark:border-slate-700 dark:bg-slate-950">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              No downloads match the current filters. Reset filters and try a broader search.
            </p>
          </div>
        )}

        {filtered.length > visibleCount ? (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => Math.min(c + LOAD_MORE_STEP, filtered.length))}
              className="btn-secondary"
            >
              Load More ({Math.min(LOAD_MORE_STEP, filtered.length - visibleCount)})
            </button>
            <button
              type="button"
              onClick={() => setVisibleCount(filtered.length)}
              className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
            >
              Show All ({filtered.length})
            </button>
          </div>
        ) : null}
      </section>

      <section className="surface-card p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-950">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Trust and legal checklist</h2>
        <ul className="mt-3 space-y-1.5 pl-5 text-sm text-slate-800 dark:text-slate-100 sm:text-base">
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
      className={cx("rounded-full border px-2.5 py-1 text-[11px] font-semibold transition", palette)}
    >
      {label}
    </button>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-2.5 backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.14em] text-cyan-100">{label}</p>
      <p className="mt-1.5 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function SpotlightCard({
  entry,
  onTrackDownload
}: {
  entry: DownloadEntry;
  onTrackDownload: (input: TrackDownloadInput) => void;
}) {
  const featuredDownloadLinks = getFeaturedDownloadLinks(entry);

  return (
    <article className="surface-card-strong p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex min-w-0 items-start gap-3">
          <DownloadEntryIcon entry={entry} />
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{entry.name}</h3>
            <p className="mt-1.5 text-sm leading-5">{entry.summary}</p>
          </div>
        </div>
        {isFreeEntry(entry) ? (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100">
            Free
          </span>
        ) : null}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {entry.platforms.slice(0, 4).map((platform) => (
          <span
            key={`${entry.slug}-spotlight-${platform}`}
            className="rounded-full border border-line bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {platform}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {featuredDownloadLinks.map((link) => (
          <a
            key={`${entry.slug}-featured-download-${link.label}-${link.url}`}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              onTrackDownload({
                appSlug: entry.slug,
                appName: entry.name,
                channelLabel: link.label,
                channelType: link.platform ? "Direct Download" : "Primary Link",
                platform: link.platform,
                url: link.url
              })
            }
            className="inline-flex items-center justify-center rounded-full border border-cyan-300 bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-100 dark:hover:bg-cyan-900/60"
          >
            Download{link.platform ? ` (${link.platform})` : ""}
          </a>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {entry.channels.slice(0, 3).map((channel) => (
          <a
            key={`${entry.slug}-${channel.type}-${channel.url}`}
            href={channel.url}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              onTrackDownload({
                appSlug: entry.slug,
                appName: entry.name,
                channelLabel: channelButtonLabel(channel),
                channelType: channel.type,
                platform: null,
                url: channel.url
              })
            }
            className={cx(
              "inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-[11px] font-semibold transition hover:opacity-90",
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

function DownloadCard({
  entry,
  onTrackDownload
}: {
  entry: DownloadEntry;
  onTrackDownload: (input: TrackDownloadInput) => void;
}) {
  const directArtifacts = entry.directDownloads ?? [];
  const directPlatforms = [...new Set(directArtifacts.map((artifact) => artifact.platform))];
  const topRightPlatforms = directPlatforms.length > 0 ? directPlatforms : entry.platforms;
  const directArtifactsByPlatform = directArtifacts.reduce(
    (accumulator, artifact) => {
      const current = accumulator[artifact.platform] ?? [];
      accumulator[artifact.platform] = [...current, artifact];
      return accumulator;
    },
    {} as Partial<Record<DownloadPlatform, DirectDownloadArtifact[]>>
  );

  return (
    <article id={entry.slug} className="surface-card-strong scroll-mt-24 overflow-visible p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-900">
      <div className="pointer-events-none mb-3 h-1 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-slate-900" />

      <div className="flex flex-wrap items-start justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <DownloadEntryIcon entry={entry} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-full border border-line bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {entry.category}
                </span>
                {entry.popularityLabel ? (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-100">
                    {entry.popularityLabel}
                  </span>
                ) : null}
                {isFreeEntry(entry) ? (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100">
                    Free
                  </span>
                ) : null}
              </div>

              <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{entry.name}</h3>
              <p className="mt-1.5 text-sm leading-5">{entry.summary}</p>
            </div>
          </div>
        </div>

        <div className="flex max-w-[15rem] shrink-0 flex-col items-end gap-2">
          <div className="flex flex-wrap justify-end gap-1">
            {topRightPlatforms.map((platform) => (
              <PlatformDownloadChip
                key={`${entry.slug}-download-platform-${platform}`}
                appSlug={entry.slug}
                appName={entry.name}
                platform={platform}
                artifacts={directArtifactsByPlatform[platform] ?? []}
                onTrackDownload={onTrackDownload}
              />
            ))}
          </div>
          <div className="text-right text-[11px] text-slate-500 dark:text-slate-400">
            {entry.developer ? <p>{entry.developer}</p> : null}
            {entry.license ? <p className="mt-0.5">License: {entry.license}</p> : null}
            {entry.pricing ? <p className="mt-0.5">{entry.pricing}</p> : null}
          </div>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-1.5">
        {entry.channels.map((channel) => (
          <a
            key={`${entry.slug}-${channel.type}-${channel.url}`}
            href={channel.url}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              onTrackDownload({
                appSlug: entry.slug,
                appName: entry.name,
                channelLabel: channelButtonLabel(channel),
                channelType: channel.type,
                platform: null,
                url: channel.url
              })
            }
            className={cx(
              "inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-[11px] font-semibold transition hover:opacity-90",
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

function DownloadEntryIcon({ entry }: { entry: DownloadEntry }) {
  const [imageErrored, setImageErrored] = useState(false);
  const initials = getNameInitials(entry.name);
  const showImage = Boolean(entry.iconUrl) && !imageErrored;

  return (
    <div className="shrink-0">
      {showImage ? (
        <img
          src={entry.iconUrl}
          alt={`${entry.name} icon`}
          loading="lazy"
          decoding="async"
          onError={() => setImageErrored(true)}
          className="h-11 w-11 rounded-xl border border-line/80 bg-white p-2 object-contain shadow-soft dark:border-slate-700 dark:bg-slate-900"
        />
      ) : (
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-line/80 bg-slate-100 text-xs font-semibold text-slate-700 shadow-soft dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
          {initials}
        </div>
      )}
    </div>
  );
}

function PlatformDownloadChip({
  appSlug,
  appName,
  platform,
  artifacts,
  onTrackDownload
}: {
  appSlug: string;
  appName: string;
  platform: DownloadPlatform;
  artifacts: DirectDownloadArtifact[];
  onTrackDownload: (input: TrackDownloadInput) => void;
}) {
  const [open, setOpen] = useState(false);
  const [copiedChecksumKey, setCopiedChecksumKey] = useState<string | null>(null);
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-end",
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip({ padding: 12 }), shift({ padding: 12 })]
  });

  const hover = useHover(context, {
    enabled: artifacts.length > 0,
    handleClose: safePolygon(),
    move: false
  });
  const click = useClick(context, { enabled: artifacts.length > 0 });
  const focus = useFocus(context, { enabled: artifacts.length > 0 });
  const dismiss = useDismiss(context, { outsidePress: true });
  const role = useRole(context, { role: "dialog" });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, click, focus, dismiss, role]);

  if (artifacts.length === 0) {
    return (
      <span className="rounded-full border border-line bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
        {platform}
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        ref={refs.setReference}
        {...getReferenceProps({
          type: "button",
          "aria-expanded": open,
          "aria-label": `Show ${platform} download details`
        })}
        className="rounded-full border border-cyan-300 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold text-cyan-700 transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-1 dark:border-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-100 dark:hover:bg-cyan-900/60"
      >
        {platform}
      </button>
      {open ? (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="z-40 w-[19rem] rounded-lg border border-line bg-white p-2 shadow-card dark:border-slate-700 dark:bg-slate-900"
            {...getFloatingProps()}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              {platform} Downloads
            </p>
            <ul className="mt-1.5 space-y-1.5">
              {artifacts.map((artifact) => (
                <li
                  key={`${platform}-${artifact.label}-${artifact.url}`}
                  className="rounded-md border border-line/80 bg-slate-50/80 p-2 dark:border-slate-700 dark:bg-slate-800/80"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold text-slate-900 dark:text-slate-100">
                        {artifact.label}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                        {artifact.fileType ? `${artifact.fileType}` : "Installer"}
                        {artifact.version ? ` | ${formatVersion(artifact.version)}` : ""}
                        {artifact.fileSize ? ` | ${artifact.fileSize}` : ""}
                      </p>
                      {artifact.checksumSha256 ? (
                        <div className="mt-1 rounded-md border border-line/80 bg-white/70 p-1.5 dark:border-slate-700 dark:bg-slate-900/70">
                          <div className="flex items-center justify-between gap-1.5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                              SHA-256
                            </p>
                            <button
                              type="button"
                              onClick={async () => {
                                const key = `${platform}-${artifact.label}-${artifact.url}`;
                                const copied = await copyText(artifact.checksumSha256 ?? "");
                                if (!copied) {
                                  return;
                                }

                                setCopiedChecksumKey(key);
                                window.setTimeout(() => {
                                  setCopiedChecksumKey((current) => (current === key ? null : current));
                                }, 1200);
                              }}
                              className="rounded border border-line bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                            >
                              {copiedChecksumKey === `${platform}-${artifact.label}-${artifact.url}` ? "Copied" : "Copy"}
                            </button>
                          </div>
                          <p className="mt-1 break-all font-mono text-[10px] text-slate-600 dark:text-slate-300">
                            {artifact.checksumSha256}
                          </p>
                        </div>
                      ) : null}
                    </div>
                    <a
                      href={artifact.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() =>
                        onTrackDownload({
                          appSlug,
                          appName,
                          channelLabel: artifact.label,
                          channelType: "Direct Download",
                          platform,
                          url: artifact.url
                        })
                      }
                      className="rounded-md border border-line bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      Download
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </FloatingPortal>
      ) : null}
    </div>
  );
}
