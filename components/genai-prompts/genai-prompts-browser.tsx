"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { GenAIFilters } from "@/components/genai-prompts/genai-filters";
import { GenAIPromptCard } from "@/components/genai-prompts/genai-prompt-card";
import { GenAISearch } from "@/components/genai-prompts/genai-search";
import { searchGenAIPromptsOrama } from "@/lib/orama-search";
import {
  defaultGenAIFilters,
  getGenAICategories,
  getGenAITools,
  type GenAIFilterState,
  type GenAISort
} from "@/lib/genai-prompts";
import type { GenAIPrompt } from "@/src/content/genai/genai-prompts.registry";

interface GenAIPromptsBrowserProps {
  prompts: GenAIPrompt[];
}

function sortPrompts(prompts: GenAIPrompt[], sort: GenAISort): GenAIPrompt[] {
  return [...prompts].sort((a, b) => {
    if (sort === "a-z") {
      return a.title.localeCompare(b.title);
    }

    return b.updatedAt.localeCompare(a.updatedAt) || a.title.localeCompare(b.title);
  });
}

function matchesFilters(prompt: GenAIPrompt, filters: GenAIFilterState): boolean {
  if (filters.platform !== "All" && prompt.platform !== filters.platform) {
    return false;
  }

  if (filters.tool !== "All" && prompt.tool !== filters.tool) {
    return false;
  }

  if (filters.complexity !== "All" && prompt.complexity !== filters.complexity) {
    return false;
  }

  if (filters.category !== "All" && prompt.category !== filters.category) {
    return false;
  }

  return true;
}

function usePromptColumns(): number {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setColumns(media.matches ? 2 : 1);

    update();

    const listener = () => update();
    media.addEventListener("change", listener);

    return () => {
      media.removeEventListener("change", listener);
    };
  }, []);

  return columns;
}

export function GenAIPromptsBrowser({ prompts }: GenAIPromptsBrowserProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [filters, setFilters] = useState<GenAIFilterState>(defaultGenAIFilters);
  const [sort, setSort] = useState<GenAISort>("newest");
  const [oramaRankedIds, setOramaRankedIds] = useState<string[] | null>(null);
  const [isRanking, startRankingTransition] = useTransition();

  const categories = useMemo(() => getGenAICategories(), []);
  const tools = useMemo(() => getGenAITools(), []);
  const columnCount = usePromptColumns();

  const facetedPrompts = useMemo(() => {
    return prompts.filter((prompt) => matchesFilters(prompt, filters));
  }, [filters, prompts]);

  useEffect(() => {
    const normalized = deferredQuery.trim();

    if (!normalized) {
      setOramaRankedIds(null);
      return;
    }

    let cancelled = false;

    void searchGenAIPromptsOrama(normalized, prompts).then((ids) => {
      if (cancelled) return;

      startRankingTransition(() => {
        setOramaRankedIds(ids);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [deferredQuery, prompts]);

  const results = useMemo(() => {
    const normalized = deferredQuery.trim();

    if (!normalized) {
      return sortPrompts(facetedPrompts, sort);
    }

    const facetedById = new Map(facetedPrompts.map((prompt) => [prompt.id, prompt]));

    if (oramaRankedIds && oramaRankedIds.length > 0) {
      const ranked = oramaRankedIds
        .map((id) => facetedById.get(id))
        .filter((prompt): prompt is GenAIPrompt => Boolean(prompt));

      if (ranked.length > 0) {
        return ranked;
      }
    }

    const queryLower = normalized.toLowerCase();

    return facetedPrompts.filter((prompt) => {
      const haystack = [prompt.title, prompt.summary, prompt.platform, prompt.tool, prompt.category, ...prompt.tags]
        .join(" ")
        .toLowerCase();

      return haystack.includes(queryLower);
    });
  }, [deferredQuery, facetedPrompts, oramaRankedIds, sort]);

  const shouldVirtualize = results.length > 32;

  const rows = useMemo(() => {
    const grouped: GenAIPrompt[][] = [];
    for (let index = 0; index < results.length; index += columnCount) {
      grouped.push(results.slice(index, index + columnCount));
    }
    return grouped;
  }, [results, columnCount]);

  const listRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 360,
    overscan: 8
  });

  useEffect(() => {
    rowVirtualizer.measure();
  }, [columnCount, rows.length, rowVirtualizer]);

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

      <section className="surface-card space-y-4 p-5 sm:p-6">
        <GenAISearch
          value={query}
          onChange={(value) => {
            setQuery(value);
          }}
        />
        <GenAIFilters
          filters={filters}
          onFiltersChange={(next) => {
            setFilters(next);
          }}
          sort={sort}
          onSortChange={(next) => {
            setSort(next);
          }}
          categories={categories}
          tools={tools}
        />

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {deferredQuery.trim().length > 0 ? "Ranked by Orama semantic/fuzzy index." : "Browse mode."}
          {isRanking ? " Updating results..." : ""}
        </p>
      </section>

      {results.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-line/80 bg-white p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
          No prompts match the current search and filter set. Broaden your query or reset filters.
        </section>
      ) : shouldVirtualize ? (
        <section className="rounded-2xl border border-line/70 bg-white p-3 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-4">
          <div ref={listRef} className="max-h-[72vh] overflow-auto pr-1">
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];

                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    className={columnCount === 2 ? "absolute left-0 top-0 grid w-full grid-cols-2 gap-4" : "absolute left-0 top-0 grid w-full grid-cols-1 gap-4"}
                    style={{ transform: `translateY(${virtualRow.start}px)` }}
                  >
                    {row.map((prompt) => (
                      <GenAIPromptCard key={prompt.slug} prompt={prompt} />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {results.map((prompt) => (
            <GenAIPromptCard key={prompt.slug} prompt={prompt} />
          ))}
        </section>
      )}
    </div>
  );
}
