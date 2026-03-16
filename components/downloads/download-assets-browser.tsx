"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { buildDownloadAssetRequestMailto } from "@/lib/download-assets.registry";
import { siteConfig } from "@/lib/site";
import type { DownloadAsset, DownloadAssetAccess, DownloadAssetBundle, DownloadAssetSearchDemand } from "@/types/download";

interface DownloadAssetsBrowserProps {
  assets: DownloadAsset[];
  bundles: DownloadAssetBundle[];
}

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function formatBadgeTone(access: DownloadAssetAccess): string {
  if (access === "Free") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100";
  }

  if (access === "Email gate") {
    return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-700 dark:bg-sky-900/40 dark:text-sky-100";
  }

  return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-100";
}

function demandBadgeTone(demand: DownloadAssetSearchDemand): string {
  if (demand === "High") {
    return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-900/40 dark:text-rose-100";
  }

  if (demand === "Medium") {
    return "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-100";
  }

  return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";
}

export function DownloadAssetsBrowser({ assets, bundles }: DownloadAssetsBrowserProps) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<DownloadAsset["category"] | "All">("All");
  const [accessFilter, setAccessFilter] = useState<DownloadAssetAccess | "All">("All");
  const [demandFilter, setDemandFilter] = useState<DownloadAssetSearchDemand | "All">("All");
  const [formatFilter, setFormatFilter] = useState<DownloadAsset["format"] | "All">("All");

  const categories = useMemo(
    () => [...new Set(assets.map((asset) => asset.category))].sort((a, b) => a.localeCompare(b)),
    [assets]
  );

  const filteredAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return assets
      .filter((asset) => {
        if (categoryFilter !== "All" && asset.category !== categoryFilter) return false;
        if (accessFilter !== "All" && asset.access !== accessFilter) return false;
        if (demandFilter !== "All" && asset.searchDemand !== demandFilter) return false;
        if (formatFilter !== "All" && asset.format !== formatFilter) return false;

        if (!normalizedQuery) {
          return true;
        }

        const haystack = [asset.title, asset.description, asset.category, asset.format, asset.access, asset.monetization, asset.searchDemand, ...asset.tags]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [accessFilter, assets, categoryFilter, demandFilter, formatFilter, query]);

  const stats = useMemo(() => {
    return {
      total: assets.length,
      highDemand: assets.filter((asset) => asset.searchDemand === "High").length,
      free: assets.filter((asset) => asset.access === "Free").length,
      bundles: bundles.length
    };
  }, [assets, bundles.length]);

  const bundleCounts = useMemo(() => {
    return bundles.map((bundle) => ({
      ...bundle,
      itemCount: bundle.itemSlugs.length
    }));
  }, [bundles]);

  return (
    <div className="space-y-6">
      <section className="surface-card-strong p-5 sm:p-6">
        <p className="eyebrow">Download Assets</p>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
          IT Scripts, Templates, Checklists, and Runbooks
        </h1>
        <p className="mt-3 max-w-3xl text-sm sm:text-base">
          Browse enterprise-focused operational assets designed for IT support, system administration,
          compliance tracking, and security response workflows.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Assets" value={String(stats.total)} />
          <StatCard label="High-Demand" value={String(stats.highDemand)} />
          <StatCard label="Free Assets" value={String(stats.free)} />
          <StatCard label="Bundles" value={String(stats.bundles)} />
        </div>
      </section>

      <section className="surface-card p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-950">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Bundle Opportunities</h2>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
            {bundleCounts.map((bundle) => (
              <article
                key={bundle.slug}
                id={bundle.slug}
                className="rounded-2xl border border-line/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
              <div className="flex flex-wrap items-center gap-2">
                <span className={cx("rounded-full border px-2.5 py-1 text-[11px] font-semibold", formatBadgeTone(bundle.access))}>
                  {bundle.access}
                </span>
                <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {bundle.itemCount} assets
                </span>
                {bundle.priceLabel ? (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-100">
                    {bundle.priceLabel}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{bundle.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{bundle.description}</p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{bundle.monetization}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-card p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-950">
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-5">
          <label className="xl:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Search Assets
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, format, category, or keyword"
              className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <SelectFilter
            label="Category"
            value={categoryFilter}
            onChange={(value) => setCategoryFilter(value as DownloadAsset["category"] | "All")}
            options={["All", ...categories]}
          />

          <SelectFilter
            label="Access"
            value={accessFilter}
            onChange={(value) => setAccessFilter(value as DownloadAssetAccess | "All")}
            options={["All", "Free", "Email gate", "Premium"]}
          />

          <SelectFilter
            label="Format"
            value={formatFilter}
            onChange={(value) => setFormatFilter(value as DownloadAsset["format"] | "All")}
            options={["All", "ps1", "xlsx", "pdf", "docx"]}
          />

          <SelectFilter
            label="Search Demand"
            value={demandFilter}
            onChange={(value) => setDemandFilter(value as DownloadAssetSearchDemand | "All")}
            options={["All", "High", "Medium", "Low"]}
          />
        </div>

        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Showing {filteredAssets.length} of {assets.length} assets
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Asset Library
        </h2>

        {filteredAssets.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredAssets.map((asset) => (
              <article
                key={asset.slug}
                className="surface-card-strong p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cx("rounded-full border px-2.5 py-1 text-[11px] font-semibold", formatBadgeTone(asset.access))}>
                    {asset.access}
                  </span>
                  <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {asset.category}
                  </span>
                  <span className={cx("rounded-full border px-2.5 py-1 text-[11px] font-semibold", demandBadgeTone(asset.searchDemand))}>
                    {asset.searchDemand} demand
                  </span>
                  <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold uppercase text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {asset.format}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">
                  {asset.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{asset.description}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{asset.monetization}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/downloads/assets/${asset.slug}`} className="btn-secondary !px-3.5 !py-2 text-xs">
                    View Asset
                  </Link>
                  <a
                    href={buildDownloadAssetRequestMailto(asset, siteConfig.email)}
                    className="btn-secondary !px-3.5 !py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    {asset.access === "Premium"
                      ? "Purchase"
                      : asset.access === "Email gate"
                        ? "Request Access"
                        : "Get Free Copy"}
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="surface-card border-dashed p-5 dark:border-slate-700 dark:bg-slate-950">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              No assets match the current filters. Clear one or more filters and try again.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line/80 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

function SelectFilter({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label>
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
