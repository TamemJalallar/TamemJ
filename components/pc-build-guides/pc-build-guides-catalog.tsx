"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FilterChips } from "@/components/support-portal/filter-chips";
import { TopSearchBar } from "@/components/support-portal/top-search-bar";
import type { PCBuildGuide } from "@/types/pc-build";

interface PCBuildGuidesCatalogProps {
  guides: PCBuildGuide[];
  categories: string[];
  difficulties: string[];
  budgetBands: string[];
  tags: string[];
}

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function difficultyStyles(difficulty: PCBuildGuide["difficulty"]): string {
  switch (difficulty) {
    case "Beginner":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-200";
    case "Intermediate":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200";
    case "Advanced":
      return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-200";
  }
}

function budgetStyles(budgetBand: PCBuildGuide["budgetBand"]): string {
  switch (budgetBand) {
    case "Entry":
      return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200";
    case "Midrange":
      return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/70 dark:bg-sky-950/30 dark:text-sky-200";
    case "High-End":
      return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/70 dark:bg-violet-950/30 dark:text-violet-200";
    case "Enthusiast":
      return "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-900/70 dark:bg-fuchsia-950/30 dark:text-fuchsia-200";
  }
}

const TAG_PREVIEW_LIMIT = 24;

export function PCBuildGuidesCatalog({
  guides,
  categories,
  difficulties,
  budgetBands,
  tags
}: PCBuildGuidesCatalogProps) {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedBudgetBands, setSelectedBudgetBands] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(guide.category)) {
        return false;
      }

      if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(guide.difficulty)) {
        return false;
      }

      if (selectedBudgetBands.length > 0 && !selectedBudgetBands.includes(guide.budgetBand)) {
        return false;
      }

      if (selectedTags.length > 0 && !selectedTags.every((tag) => guide.tags.includes(tag))) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchableText = [
        guide.title,
        guide.description,
        guide.category,
        guide.difficulty,
        guide.budgetBand,
        guide.useCases.join(" "),
        guide.tags.join(" "),
        guide.partRecommendations.map((item) => `${item.partType} ${item.whatToBuy} ${item.benefit}`).join(" ")
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [
    guides,
    normalizedQuery,
    selectedBudgetBands,
    selectedCategories,
    selectedDifficulties,
    selectedTags
  ]);

  const visibleTags = useMemo(() => {
    if (showAllTags || tags.length <= TAG_PREVIEW_LIMIT) {
      return tags;
    }

    const selected = tags.filter((tag) => selectedTags.includes(tag));
    const remaining = tags.filter((tag) => !selectedTags.includes(tag));
    const allowedRemaining = Math.max(TAG_PREVIEW_LIMIT - selected.length, 0);

    return [...selected, ...remaining.slice(0, allowedRemaining)];
  }, [showAllTags, tags, selectedTags]);

  function clearFilters() {
    setQuery("");
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setSelectedBudgetBands([]);
    setSelectedTags([]);
  }

  function toggleTag(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((entry) => entry !== tag) : [...current, tag]
    );
  }

  const hasActiveFilters =
    query.trim() !== "" ||
    selectedCategories.length > 0 ||
    selectedDifficulties.length > 0 ||
    selectedBudgetBands.length > 0 ||
    selectedTags.length > 0;

  return (
    <div className="space-y-6">
      <div className="surface-card p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-950/70">
        <div className="space-y-4">
          <TopSearchBar
            value={query}
            onChange={setQuery}
            onSubmit={setQuery}
            placeholder="Search guides, parts, or goals (e.g., 1440p, quiet build, GPU upgrade)"
            buttonLabel="Search"
          />

          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Categories
              </p>
              <FilterChips
                options={categories.map((value) => ({ label: value, value }))}
                selected={selectedCategories}
                onChange={setSelectedCategories}
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Difficulty
              </p>
              <FilterChips
                options={difficulties.map((value) => ({ label: value, value }))}
                selected={selectedDifficulties}
                onChange={setSelectedDifficulties}
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Budget Band
              </p>
              <FilterChips
                options={budgetBands.map((value) => ({ label: value, value }))}
                selected={selectedBudgetBands}
                onChange={setSelectedBudgetBands}
              />
            </div>
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className={cx(
                "btn-secondary h-10 px-4 py-0",
                !hasActiveFilters && "cursor-not-allowed opacity-60"
              )}
            >
              Reset Filters
            </button>
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Tags
              </p>
              {tags.length > TAG_PREVIEW_LIMIT ? (
                <button
                  type="button"
                  onClick={() => setShowAllTags((current) => !current)}
                  className="rounded-full border border-line/80 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                  aria-expanded={showAllTags}
                >
                  {showAllTags
                    ? "Show fewer tags"
                    : `Show more tags (+${Math.max(tags.length - visibleTags.length, 0)})`}
                </button>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {visibleTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={selectedTags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                  className={cx(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    selectedTags.includes(tag)
                      ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                      : "border-line/80 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                  )}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-line/70 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/70">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {filteredGuides.length} guide{filteredGuides.length === 1 ? "" : "s"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {guides.length} total guides in this registry.
            </p>
          </div>
        </div>
      </div>

      {filteredGuides.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/pc-build-guides/${guide.slug}`}
              className="group surface-card block p-5 transition hover:-translate-y-0.5 hover:shadow-card dark:border-slate-800 dark:bg-slate-950/70"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  {guide.category}
                </p>
                <span className="text-xs text-slate-400 transition group-hover:text-slate-500 dark:text-slate-500">
                  Open →
                </span>
              </div>

              <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{guide.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{guide.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={cx(
                    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                    difficultyStyles(guide.difficulty)
                  )}
                >
                  {guide.difficulty}
                </span>
                <span
                  className={cx(
                    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                    budgetStyles(guide.budgetBand)
                  )}
                >
                  {guide.budgetBand}
                </span>
                <span className="inline-flex items-center rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {guide.estimatedTime}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {guide.tags.slice(0, 3).map((tag) => (
                  <span
                    key={`${guide.slug}-${tag}`}
                    className="inline-flex items-center rounded-full border border-line/80 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
                {guide.tags.length > 3 ? (
                  <span className="inline-flex items-center rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                    +{guide.tags.length - 3}
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line/80 bg-white p-6 text-sm shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No matching guides</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Try broader terms or clear one or more filters.
          </p>
          <button type="button" onClick={clearFilters} className="btn-secondary mt-4">
            Clear Search & Filters
          </button>
        </div>
      )}
    </div>
  );
}
