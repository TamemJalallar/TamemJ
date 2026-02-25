"use client";

import { useMemo, useState } from "react";
import type { DownloadChannelLink, DownloadEntry, DownloadPlatform } from "@/types/download";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const platformOrder: DownloadPlatform[] = ["macOS", "Windows", "Linux", "iOS", "Android", "Web"];
const channelFilters = ["All", "Store", "Direct", "GitHub"] as const;
type ChannelFilter = (typeof channelFilters)[number];

function channelButtonLabel(channel: DownloadChannelLink): string {
  switch (channel.type) {
    case "Mac App Store":
      return channel.label ?? "View on Mac App Store";
    case "Microsoft Store":
      return channel.label ?? "View in Microsoft Store";
    case "GitHub Releases":
      return channel.label ?? "GitHub Releases";
    case "Source Code":
      return channel.label ?? "Source Code";
    case "Direct Download":
      return channel.label ?? "Direct Download";
    case "Website":
      return channel.label ?? "Website";
    default:
      return channel.label ?? "Open";
  }
}

function channelChipTone(channel: DownloadChannelLink): string {
  switch (channel.type) {
    case "Mac App Store":
      return "border-slate-300 bg-slate-900 text-white";
    case "Microsoft Store":
      return "border-emerald-300 bg-emerald-50 text-emerald-700";
    case "GitHub Releases":
      return "border-zinc-300 bg-zinc-100 text-zinc-800";
    case "Direct Download":
      return "border-cyan-200 bg-cyan-50 text-cyan-700";
    default:
      return "border-line bg-white text-slate-700";
  }
}

function formatVersion(version: string): string {
  return /^v/i.test(version) ? version : `v${version}`;
}

function matchesChannelFilter(entry: DownloadEntry, filter: ChannelFilter): boolean {
  if (filter === "All") return true;
  if (filter === "Store") {
    return entry.channels.some(
      (channel) => channel.type === "Mac App Store" || channel.type === "Microsoft Store"
    );
  }
  if (filter === "Direct") {
    return (entry.directDownloads?.length ?? 0) > 0 || entry.channels.some((c) => c.type === "Direct Download");
  }
  if (filter === "GitHub") {
    return (
      entry.featuredOnGitHub ||
      entry.channels.some((channel) => channel.type === "GitHub Releases" || channel.type === "Source Code")
    );
  }
  return true;
}

export function DownloadsBrowser({ entries }: { entries: DownloadEntry[] }) {
  const [query, setQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<DownloadPlatform | "All">("All");
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("All");

  const availablePlatforms = useMemo(() => {
    const set = new Set<DownloadPlatform>();
    for (const entry of entries) {
      for (const platform of entry.platforms) set.add(platform);
    }
    return platformOrder.filter((platform) => set.has(platform));
  }, [entries]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (platformFilter !== "All" && !entry.platforms.includes(platformFilter)) return false;
      if (!matchesChannelFilter(entry, channelFilter)) return false;
      if (!normalized) return true;

      const haystack = [
        entry.name,
        entry.summary,
        entry.category,
        entry.developer ?? "",
        ...entry.tags,
        ...entry.platforms
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [channelFilter, entries, platformFilter, query]);

  const sections = useMemo(() => {
    return {
      popularGitHub: filtered.filter((entry) => entry.featuredOnGitHub),
      storeListings: filtered.filter((entry) =>
        entry.channels.some(
          (channel) => channel.type === "Mac App Store" || channel.type === "Microsoft Store"
        )
      ),
      directDownloads: filtered.filter((entry) => (entry.directDownloads?.length ?? 0) > 0)
    };
  }, [filtered]);

  const totalDirectArtifacts = filtered.reduce(
    (sum, entry) => sum + (entry.directDownloads?.length ?? 0),
    0
  );

  return (
    <div className="space-y-8">
      <section className="surface-card-strong p-5 sm:p-6">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="eyebrow">Downloads</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              App stores, GitHub releases, and direct downloads in one place
            </h1>
            <p className="mt-4 max-w-3xl text-sm sm:text-base">
              Mac App Store apps and Microsoft Store apps link to their official store pages. For
              non-store apps, this page supports direct downloads and GitHub Releases links so you can
              host binaries at no cost outside GitHub Pages.
            </p>
          </div>

          <div className="surface-card border-dashed p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-slate-900">Recommended Free Hosting</h2>
            <ul className="mt-3 space-y-2 pl-5 text-sm text-slate-600">
              <li className="list-disc">
                <span className="font-medium text-slate-900">GitHub Releases</span>: best default for
                versioned desktop installers and release notes.
              </li>
              <li className="list-disc">
                <span className="font-medium text-slate-900">Cloudflare R2 (free tier)</span>: useful if
                you want custom download URLs later.
              </li>
              <li className="list-disc">
                Keep binaries off <span className="font-medium text-slate-900">GitHub Pages</span> to
                avoid storage and bandwidth limits.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Search Downloads
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by app, platform, tag, or developer..."
              className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Platform</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPlatformFilter("All")}
                  className={cx(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    platformFilter === "All"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-line bg-white text-slate-700 hover:bg-slate-50"
                  )}
                >
                  All
                </button>
                {availablePlatforms.map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => setPlatformFilter(platform)}
                    className={cx(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                      platformFilter === platform
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-line bg-white text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Channel</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {channelFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setChannelFilter(filter)}
                    className={cx(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                      channelFilter === filter
                        ? "border-cyan-700 bg-cyan-600 text-white"
                        : "border-line bg-white text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
          <span className="rounded-full border border-line bg-slate-50 px-3 py-1.5">
            {filtered.length} app{filtered.length === 1 ? "" : "s"} shown
          </span>
          <span className="rounded-full border border-line bg-slate-50 px-3 py-1.5">
            {totalDirectArtifacts} direct download option{totalDirectArtifacts === 1 ? "" : "s"}
          </span>
        </div>
      </section>

      <DownloadSection
        title="Popular GitHub Downloads"
        description="Curated, widely used apps with GitHub Releases-based distribution."
        entries={sections.popularGitHub}
        emptyLabel="No GitHub-focused downloads match the current filters."
      />

      <DownloadSection
        title="Official Store Listings"
        description="Entries with Mac App Store and/or Microsoft Store links."
        entries={sections.storeListings}
        emptyLabel="No store-linked apps match the current filters."
      />

      <DownloadSection
        title="Direct Downloads"
        description="Apps with direct download entries (currently using GitHub Releases for zero-cost hosting examples)."
        entries={sections.directDownloads}
        emptyLabel="No direct-download entries match the current filters."
      />

      <section className="surface-card p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-slate-900">Legal and trust considerations</h2>
        <ul className="mt-4 space-y-2 pl-5 text-sm sm:text-base">
          <li className="list-disc">
            Use official Apple and Microsoft store badges/brand assets only if you follow their branding
            guidelines.
          </li>
          <li className="list-disc">
            Sign and notarize macOS builds and sign Windows installers to reduce warnings and improve trust.
          </li>
          <li className="list-disc">
            Publish checksums and release notes for direct downloads whenever possible.
          </li>
          <li className="list-disc">
            Avoid hosting installer binaries directly in GitHub Pages; keep Pages for the site UI and docs.
          </li>
        </ul>
      </section>
    </div>
  );
}

function DownloadSection({
  title,
  description,
  entries,
  emptyLabel
}: {
  title: string;
  description: string;
  entries: DownloadEntry[];
  emptyLabel: string;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm sm:text-base">{description}</p>
      </div>

      {entries.length > 0 ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {entries.map((entry) => (
            <DownloadCard key={entry.slug} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="surface-card border-dashed p-6">
          <p className="text-sm text-slate-600">{emptyLabel}</p>
        </div>
      )}
    </section>
  );
}

function DownloadCard({ entry }: { entry: DownloadEntry }) {
  return (
    <article className="surface-card-strong p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-line bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
              {entry.category}
            </span>
            {entry.popularityLabel ? (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                {entry.popularityLabel}
              </span>
            ) : null}
          </div>
          <h3 className="mt-3 text-xl font-semibold text-slate-900">{entry.name}</h3>
          <p className="mt-2 text-sm leading-6">{entry.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {entry.platforms.map((platform) => (
              <span
                key={`${entry.slug}-${platform}`}
                className="rounded-full border border-line bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>

        <div className="text-right text-xs text-slate-500">
          {entry.developer ? <p>{entry.developer}</p> : null}
          {entry.license ? <p className="mt-1">License: {entry.license}</p> : null}
          {entry.pricing ? <p className="mt-1">{entry.pricing}</p> : null}
        </div>
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
        <div className="mt-5 rounded-2xl border border-line/80 bg-slate-50/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-slate-900">Direct Downloads</h4>
            <span className="rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">
              Hosted via GitHub Releases / external host
            </span>
          </div>
          <ul className="mt-3 space-y-2">
            {entry.directDownloads.map((artifact) => (
              <li
                key={`${entry.slug}-${artifact.label}-${artifact.platform}`}
                className="rounded-xl border border-line bg-white p-3"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">{artifact.label}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {artifact.platform}
                      {artifact.fileType ? ` | ${artifact.fileType}` : ""}
                      {artifact.version ? ` | ${formatVersion(artifact.version)}` : ""}
                      {artifact.fileSize ? ` | ${artifact.fileSize}` : ""}
                      {artifact.host ? ` | ${artifact.host}` : ""}
                    </p>
                    {artifact.notes ? <p className="mt-1 text-xs text-slate-500">{artifact.notes}</p> : null}
                    {artifact.checksumSha256 ? (
                      <p className="mt-1 break-all font-mono text-[11px] text-slate-500">
                        SHA-256: {artifact.checksumSha256}
                      </p>
                    ) : null}
                  </div>
                  <a href={artifact.url} target="_blank" rel="noreferrer" className="btn-secondary shrink-0 !px-4 !py-2">
                    Download
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {entry.tags.map((tag) => (
          <span
            key={`${entry.slug}-tag-${tag}`}
            className="rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500"
          >
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}
