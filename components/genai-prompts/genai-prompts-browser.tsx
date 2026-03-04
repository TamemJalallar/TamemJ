"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { GenAIPrompt } from "@/src/content/genai/genai-prompts.registry";
import {
  defaultGenAIFilters,
  filterAndSortGenAIPrompts,
  getGenAICategories,
  getGenAITools,
  type GenAIFilterState,
  type GenAISort
} from "@/lib/genai-prompts";
import { GenAIFilters } from "@/components/genai-prompts/genai-filters";
import { GenAIPromptCard } from "@/components/genai-prompts/genai-prompt-card";
import { GenAISearch } from "@/components/genai-prompts/genai-search";

interface GenAIPromptsBrowserProps {
  prompts: GenAIPrompt[];
}

export function GenAIPromptsBrowser({ prompts }: GenAIPromptsBrowserProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [filters, setFilters] = useState<GenAIFilterState>(defaultGenAIFilters);
  const [sort, setSort] = useState<GenAISort>("newest");
  const [visibleCount, setVisibleCount] = useState(24);

  const categories = useMemo(() => getGenAICategories(), []);
  const tools = useMemo(() => getGenAITools(), []);

  const results = useMemo(() => {
    const filtered = filterAndSortGenAIPrompts(prompts, deferredQuery, filters, sort);
    return filtered;
  }, [prompts, deferredQuery, filters, sort]);

  const visiblePrompts = results.slice(0, visibleCount);
  const canLoadMore = visibleCount < results.length;

  return (
    <div className="space-y-5">
      <section className="surface-card-strong p-5 sm:p-6">
        <p className="eyebrow">Meta AI + Adobe GenAI Prompt Library</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
          Copy-ready prompts for Meta AI chat and Adobe GenAI creative workflows
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Explore {prompts.length} prompts across social, branding, photo editing, product mockups, copywriting,
          marketing, content, and presentations. Filter by platform, tool, complexity, and category.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-line/80 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/60">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Total Prompts</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{prompts.length}</p>
          </div>
          <div className="rounded-xl border border-line/80 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/60">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Meta AI</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {prompts.filter((prompt) => prompt.platform === "MetaAI").length}
            </p>
          </div>
          <div className="rounded-xl border border-line/80 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/60">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Adobe GenAI</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {prompts.filter((prompt) => prompt.platform === "AdobeGenAI").length}
            </p>
          </div>
          <div className="rounded-xl border border-line/80 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/60">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Matches</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{results.length}</p>
          </div>
        </div>
      </section>

      <section className="surface-card p-5 sm:p-6 space-y-4">
        <GenAISearch value={query} onChange={(value) => { setQuery(value); setVisibleCount(24); }} />
        <GenAIFilters
          filters={filters}
          onFiltersChange={(next) => {
            setFilters(next);
            setVisibleCount(24);
          }}
          sort={sort}
          onSortChange={(next) => {
            setSort(next);
            setVisibleCount(24);
          }}
          categories={categories}
          tools={tools}
        />
      </section>

      {results.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-line/80 bg-white p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
          No prompts match the current search and filter set. Broaden your query or reset filters.
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {visiblePrompts.map((prompt) => (
            <GenAIPromptCard key={prompt.slug} prompt={prompt} />
          ))}
        </section>
      )}

      {canLoadMore ? (
        <div className="flex justify-center">
          <button type="button" onClick={() => setVisibleCount((current) => current + 24)} className="btn-secondary">
            Load more prompts
          </button>
        </div>
      ) : null}
    </div>
  );
}
