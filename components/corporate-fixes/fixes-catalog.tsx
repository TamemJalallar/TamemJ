"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CorporateTechFix } from "@/lib/corporate-fixes.registry";
import {
  LOCAL_CORPORATE_FIXES_UPDATED_EVENT,
  getLocalCorporateFixes,
  isLocalCorporateFixSlug
} from "@/lib/corporate-fixes.local";
import { FixGuide } from "@/components/corporate-fixes/fix-guide";
import { AccessLevelBadge, MetaPill, SeverityBadge, TagChip } from "@/components/corporate-fixes/fix-shared";

interface FixesCatalogProps {
  fixes: CorporateTechFix[];
  categories: string[];
  tags: string[];
}

function joinClasses(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function mergeFixCollections(baseFixes: CorporateTechFix[], localFixes: CorporateTechFix[]): CorporateTechFix[] {
  const seen = new Set<string>();
  const merged: CorporateTechFix[] = [];

  for (const localFix of localFixes) {
    if (seen.has(localFix.slug)) continue;
    seen.add(localFix.slug);
    merged.push(localFix);
  }

  for (const baseFix of baseFixes) {
    if (seen.has(baseFix.slug)) continue;
    seen.add(baseFix.slug);
    merged.push(baseFix);
  }

  return merged;
}

export function FixesCatalog({ fixes, categories, tags }: FixesCatalogProps) {
  const TAG_PREVIEW_LIMIT = 28;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [localFixes, setLocalFixes] = useState<CorporateTechFix[]>([]);
  const [selectedLocalFix, setSelectedLocalFix] = useState<CorporateTechFix | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const loadLocal = () => setLocalFixes(getLocalCorporateFixes());
    const handleStorage = (event: StorageEvent) => {
      if (event.key && !event.key.includes("corporateTechFixes:localEntries")) {
        return;
      }
      loadLocal();
    };
    const handleLocalUpdate = () => loadLocal();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedLocalFix(null);
      }
    };

    loadLocal();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(LOCAL_CORPORATE_FIXES_UPDATED_EVENT, handleLocalUpdate as EventListener);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(
        LOCAL_CORPORATE_FIXES_UPDATED_EVENT,
        handleLocalUpdate as EventListener
      );
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const allFixes = useMemo(() => mergeFixCollections(fixes, localFixes), [fixes, localFixes]);
  const allCategories = useMemo(
    () =>
      [...new Set([...categories, ...localFixes.map((fix) => fix.category)])].sort((a, b) =>
        a.localeCompare(b)
      ),
    [categories, localFixes]
  );
  const allTags = useMemo(
    () => [...new Set([...tags, ...localFixes.flatMap((fix) => fix.tags)])].sort((a, b) => a.localeCompare(b)),
    [tags, localFixes]
  );
  const visibleTags = useMemo(() => {
    if (showAllTags || allTags.length <= TAG_PREVIEW_LIMIT) {
      return allTags;
    }

    const selected = allTags.filter((tag) => selectedTags.includes(tag));
    const remaining = allTags.filter((tag) => !selectedTags.includes(tag));
    const allowedRemaining = Math.max(TAG_PREVIEW_LIMIT - selected.length, 0);

    return [...selected, ...remaining.slice(0, allowedRemaining)];
  }, [allTags, selectedTags, showAllTags]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredFixes = allFixes.filter((fix) => {
    const matchesCategory = category === "All" || fix.category === category;
    const matchesTags =
      selectedTags.length === 0 || selectedTags.every((tag) => fix.tags.includes(tag));

    if (!matchesCategory || !matchesTags) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchTarget = [fix.title, fix.description, fix.category, fix.tags.join(" ")]
      .join(" ")
      .toLowerCase();

    return searchTarget.includes(normalizedQuery);
  });

  const hasActiveFilters = query.trim() !== "" || category !== "All" || selectedTags.length > 0;

  function toggleTag(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    );
  }

  function clearFilters() {
    setQuery("");
    setCategory("All");
    setSelectedTags([]);
  }

  function renderFixCardContent(fix: CorporateTechFix, options?: { local?: boolean }) {
    const isLocal = options?.local ?? false;

    return (
      <>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              {fix.category}
            </p>
            {isLocal ? (
              <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-200">
                Local Draft
              </span>
            ) : null}
          </div>
          <span className="text-xs text-slate-400 transition group-hover:text-slate-500 dark:text-slate-500">
            {isLocal ? "Preview (local) →" : "Open →"}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{fix.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{fix.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <SeverityBadge severity={fix.severity} />
          <AccessLevelBadge accessLevel={fix.accessLevel} />
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <MetaPill label="Est. Time" value={fix.estimatedTime} />
          <MetaPill label="Steps" value={`${fix.steps.length}`} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {fix.tags.slice(0, 4).map((tag) => (
            <TagChip key={tag} label={tag} asSpan />
          ))}
          {fix.tags.length > 4 ? (
            <span className="inline-flex items-center rounded-full border border-line/70 bg-white px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              +{fix.tags.length - 4} more
            </span>
          ) : null}
        </div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="surface-card p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-950/70">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="corporate-fixes-search"
                className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100"
              >
                Search fixes
              </label>
              <input
                id="corporate-fixes-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by issue, product, or tag (e.g., Outlook, VPN, SharePoint)"
                className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <label
                htmlFor="corporate-fixes-category"
                className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100"
              >
                Category
              </label>
              <select
                id="corporate-fixes-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="All">All Categories</option>
                {allCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className={joinClasses(
                  "w-full rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
                  hasActiveFilters
                    ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                    : "border-line bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500"
                )}
                disabled={!hasActiveFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-line/80 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/80">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {filteredFixes.length} result{filteredFixes.length === 1 ? "" : "s"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Filter by category, tags, and keywords.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Tags</p>
            {allTags.length > TAG_PREVIEW_LIMIT ? (
              <button
                type="button"
                onClick={() => setShowAllTags((current) => !current)}
                className="rounded-full border border-line/80 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                aria-expanded={showAllTags}
              >
                {showAllTags
                  ? "Show fewer tags"
                  : `Show more tags (+${Math.max(allTags.length - visibleTags.length, 0)})`}
              </button>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <TagChip
                key={tag}
                label={tag}
                active={selectedTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </div>
      </div>

      {localFixes.length > 0 ? (
        <div className="rounded-2xl border border-sky-200/80 bg-sky-50/80 px-4 py-3 text-sm shadow-soft dark:border-sky-900/60 dark:bg-sky-950/20">
          <p className="font-semibold text-sky-900 dark:text-sky-100">
            {localFixes.length} local Tech Fixes {localFixes.length === 1 ? "entry" : "entries"} loaded
          </p>
          <p className="mt-1 text-xs text-sky-800/80 dark:text-sky-200/90">
            These were added from the KB Builder and exist only in this browser/device until you copy
            them into the registry and redeploy.
          </p>
        </div>
      ) : null}

      {filteredFixes.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredFixes.map((fix) => {
            const isLocal = isLocalCorporateFixSlug(fix.slug);

            if (isLocal) {
              return (
                <button
                  key={fix.slug}
                  type="button"
                  onClick={() => setSelectedLocalFix(fix)}
                  className="group surface-card block p-5 text-left transition hover:-translate-y-0.5 hover:shadow-card dark:border-slate-800 dark:bg-slate-950/70"
                >
                  {renderFixCardContent(fix, { local: true })}
                </button>
              );
            }

            return (
              <Link
                key={fix.slug}
                href={`/corporate-tech-fixes/${fix.slug}`}
                className="group surface-card block p-5 transition hover:-translate-y-0.5 hover:shadow-card dark:border-slate-800 dark:bg-slate-950/70"
              >
                {renderFixCardContent(fix)}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="surface-card border-dashed p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-950/70">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            No matching fixes found
          </h3>
          <p className="mt-2 text-sm sm:text-base dark:text-slate-300">
            Try removing one or more tags, switching the category to
            <span className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              All Categories
            </span>
            , or searching with a broader keyword.
          </p>
          <button type="button" onClick={clearFilters} className="btn-secondary mt-4">
            Reset Filters
          </button>
        </div>
      )}

      {selectedLocalFix ? (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6 print:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="local-fix-preview-title"
          onClick={() => setSelectedLocalFix(null)}
        >
          <div
            className="mx-auto w-full max-w-5xl rounded-2xl border border-line/80 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-950 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Local Tech Fixes Preview
                </p>
                <h2
                  id="local-fix-preview-title"
                  className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100"
                >
                  {selectedLocalFix.title}
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Local builder entry. This preview is available only in this browser until the fix is
                  added to the registry and redeployed.
                </p>
              </div>
              <button type="button" onClick={() => setSelectedLocalFix(null)} className="btn-secondary">
                Close Preview
              </button>
            </div>

            <FixGuide fix={selectedLocalFix} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
