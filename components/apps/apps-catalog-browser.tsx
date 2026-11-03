"use client";

import { useDeferredValue, useState } from "react";
import Link from "next/link";
import { AppCard } from "@/components/app-card";
import {
  getAppCategorySlug,
  hasAppStoreRelease,
  isPublishedApp
} from "@/lib/apps";
import type { IOSApp } from "@/types/app";

type StatusFilter = "all" | "published" | "in-development" | "app-store" | "open-source";
type SortMode = "featured" | "az" | "updated";

interface AppsCatalogBrowserProps {
  apps: IOSApp[];
}

const statusFilters: Array<{ label: string; value: StatusFilter }> = [
  { label: "All", value: "all" },
  { label: "Published", value: "published" },
  { label: "In Development", value: "in-development" },
  { label: "App Store", value: "app-store" },
  { label: "Open Source", value: "open-source" }
];

function matchesStatus(app: IOSApp, status: StatusFilter): boolean {
  if (status === "all") return true;
  if (status === "published") return isPublishedApp(app);
  if (status === "in-development") return !isPublishedApp(app);
  if (status === "app-store") return hasAppStoreRelease(app);
  return Boolean(app.repositoryUrl?.trim().length || app.primaryUrl?.includes("github.com"));
}

function sortApps(apps: IOSApp[], sortMode: SortMode): IOSApp[] {
  return [...apps].sort((a, b) => {
    if (sortMode === "az") return a.name.localeCompare(b.name);
    if (sortMode === "updated") return (b.lastUpdated ?? "").localeCompare(a.lastUpdated ?? "");
    return Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name);
  });
}

export function AppsCatalogBrowser({ apps }: AppsCatalogBrowserProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const deferredQuery = useDeferredValue(query);
  const categories = [...new Set(apps.map((app) => app.category))].sort((a, b) => a.localeCompare(b));
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filteredApps = sortApps(
    apps.filter((app) => {
      if (!matchesStatus(app, status)) return false;
      if (category !== "all" && app.category !== category) return false;
      if (!normalizedQuery) return true;

      return [
        app.name,
        app.category,
        app.tagline,
        app.shortDescription,
        app.description,
        app.pricing,
        app.pricingNote ?? "",
        ...(app.features ?? [])
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    }),
    sortMode
  );

  return (
    <section className="surface-card p-5 sm:p-6" id="app-catalog">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Product Catalog</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Full product catalog</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-fg-secondary">
            Search, filter, and sort the product catalog across published apps, open-source tools, and in-development products.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/privacy" className="btn-secondary !px-4 !py-2 text-xs">
            Privacy Policy
          </Link>
          <Link href="/support" className="btn-secondary !px-4 !py-2 text-xs">
            App Support
          </Link>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <label className="block">
          <span className="sr-only">Search products</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, categories, features..."
            className="w-full rounded-2xl border border-line bg-card px-4 py-3 text-sm text-fg outline-none transition placeholder:text-muted focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15"
          />
        </label>

        <label className="block">
          <span className="sr-only">Sort products</span>
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className="w-full rounded-2xl border border-line bg-card px-4 py-3 text-sm font-semibold text-fg outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 lg:w-44"
          >
            <option value="featured">Featured first</option>
            <option value="az">A-Z</option>
            <option value="updated">Recently updated</option>
          </select>
        </label>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatus(filter.value)}
              className={
                status === filter.value
                  ? "rounded-full border border-primary-300 bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700 transition dark:border-primary-400/55 dark:bg-primary-500/25 dark:text-primary-100"
                  : "filter-chip"
              }
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={
              category === "all"
                ? "rounded-full border border-accent-300 bg-accent-50 px-3 py-1.5 text-xs font-bold text-accent-800 transition dark:border-accent-400/55 dark:bg-accent-500/20 dark:text-accent-100"
                : "filter-chip"
            }
          >
            All categories
          </button>
          {categories.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setCategory(name)}
              className={
                category === name
                  ? "rounded-full border border-accent-300 bg-accent-50 px-3 py-1.5 text-xs font-bold text-accent-800 transition dark:border-accent-400/55 dark:bg-accent-500/20 dark:text-accent-100"
                  : "filter-chip"
              }
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-line bg-card-2/70 px-4 py-3 text-sm text-fg-secondary sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing <strong className="text-fg">{filteredApps.length}</strong> of <strong className="text-fg">{apps.length}</strong> products.
        </span>
        {category !== "all" ? (
          <Link
            href={`/apps/category/${getAppCategorySlug(category)}/`}
            className="font-semibold text-primary-600 transition hover:text-primary-700 hover:underline dark:text-primary-300 dark:hover:text-primary-200"
          >
            Open {category} category page →
          </Link>
        ) : null}
      </div>

      {filteredApps.length > 0 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredApps.map((app) => (
            <AppCard key={`catalog-${app.slug}`} app={app} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-3xl border border-dashed border-line bg-card-2/70 p-8 text-center">
          <h3 className="font-display text-xl font-semibold text-fg">No matching products</h3>
          <p className="mt-2 text-sm text-fg-secondary">Try clearing filters or searching for a broader product name, category, or feature.</p>
        </div>
      )}
    </section>
  );
}
