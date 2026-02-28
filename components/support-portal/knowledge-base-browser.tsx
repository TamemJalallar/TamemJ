"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { KBArticle } from "@/types/support";
import { SupportPageHeader } from "@/components/support-portal/page-header";
import { TopSearchBar } from "@/components/support-portal/top-search-bar";
import { FilterChips } from "@/components/support-portal/filter-chips";
import { AccessLevelBadge, EnvironmentBadge, SeverityBadge } from "@/components/support-portal/badges";
import { trackSearch, trackSearchClick } from "@/lib/support-portal.analytics";

interface KnowledgeBaseBrowserProps {
  articles: KBArticle[];
  initialQuery?: string;
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function KnowledgeBaseBrowser({ articles, initialQuery = "" }: KnowledgeBaseBrowserProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);

  const categories = useMemo(() => uniqueSorted(articles.map((article) => article.category)), [articles]);
  const productFamilies = useMemo(
    () => uniqueSorted(articles.map((article) => article.productFamily)),
    [articles]
  );

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") ?? "");
  }, [initialQuery]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return articles.filter((article) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(article.category)) {
        return false;
      }
      if (selectedFamilies.length > 0 && !selectedFamilies.includes(article.productFamily)) {
        return false;
      }
      if (selectedSeverities.length > 0 && !selectedSeverities.includes(article.severity)) {
        return false;
      }
      if (!q) return true;

      const haystack = [
        article.title,
        article.description,
        article.category,
        article.productFamily,
        article.product,
        article.tags.join(" "),
        article.symptoms.join(" ")
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [articles, query, selectedCategories, selectedFamilies, selectedSeverities]);

  function handleSearchSubmit(term: string) {
    trackSearch({ area: "kb", query: term, resultCount: filtered.length, context: "knowledge-base" });
  }

  function clearFilters() {
    setQuery("");
    setSelectedCategories([]);
    setSelectedFamilies([]);
    setSelectedSeverities([]);
  }

  const hasFilters =
    query.trim() !== "" ||
    selectedCategories.length > 0 ||
    selectedFamilies.length > 0 ||
    selectedSeverities.length > 0;

  return (
    <div>
      <SupportPageHeader
        title="Knowledge Base"
        description="Search enterprise-safe troubleshooting runbooks for Microsoft 365, Adobe, Figma, Windows, macOS, browsers, networking, printing, and affiliate operations."
        breadcrumbs={[{ label: "Support Portal", href: "/support" }, { label: "Knowledge Base" }]}
        search={
          <TopSearchBar
            value={query}
            onChange={setQuery}
            onSubmit={handleSearchSubmit}
            placeholder="Search issues (e.g., Outlook search, Teams mic, Adobe sign-in, affiliate tracking)"
            buttonLabel="Search KB"
          />
        }
        actions={
          <div className="rounded-xl border border-line/70 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/70">
            <p className="font-semibold text-slate-900 dark:text-slate-100">{filtered.length} articles</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{articles.length} total in registry</p>
          </div>
        }
        filters={
          <div className="space-y-3">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Categories</p>
              <FilterChips
                options={categories.map((value) => ({ label: value, value }))}
                selected={selectedCategories}
                onChange={setSelectedCategories}
              />
            </div>
            <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Product Family</p>
                <FilterChips
                  options={productFamilies.map((value) => ({ label: value, value }))}
                  selected={selectedFamilies}
                  onChange={setSelectedFamilies}
                />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Severity</p>
                <FilterChips
                  options={["Low", "Medium", "High"].map((value) => ({ label: value, value }))}
                  selected={selectedSeverities}
                  onChange={setSelectedSeverities}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn-secondary h-10 w-full px-4 py-0 lg:w-auto"
                  disabled={!hasFilters}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        }
      />

      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((article, index) => (
            <Link
              key={article.slug}
              href={`/support/kb/${article.slug}`}
              onClick={() =>
                trackSearchClick({
                  area: "kb",
                  query,
                  clickedSlug: article.slug,
                  clickedTitle: article.title,
                  rank: index + 1
                })
              }
              className="group rounded-2xl border border-line/70 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card dark:border-slate-800 dark:bg-slate-950/70"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    {article.category}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{article.product}</p>
                </div>
                <span className="text-xs text-slate-400 transition group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300">
                  Open →
                </span>
              </div>

              <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{article.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{article.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <SeverityBadge severity={article.severity} />
                <AccessLevelBadge accessLevel={article.accessLevel} />
                <EnvironmentBadge environment={article.environment} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {article.tags.slice(0, 4).map((tag) => (
                  <span
                    key={`${article.slug}-${tag}`}
                    className="inline-flex items-center rounded-full border border-line/70 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
                {article.tags.length > 4 ? (
                  <span className="inline-flex items-center rounded-full border border-line/70 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                    +{article.tags.length - 4}
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line/80 bg-white p-6 text-sm shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No matching KB articles</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Try broader keywords or remove one or more filters. Search analytics are tracked locally to help improve future article coverage.
          </p>
          <button type="button" onClick={clearFilters} className="btn-secondary mt-4">
            Clear Search & Filters
          </button>
        </div>
      )}
    </div>
  );
}
