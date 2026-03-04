"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  getAiAgentsRegistry,
  type AiAgentExpertiseLevel,
  type AiAgentPrompt
} from "@/lib/aiAgents.registry";
import { buildFuzzyIndex, runFuzzySearch } from "@/lib/fuzzy-search";

type FilterExpertise = "All" | AiAgentExpertiseLevel;

const expertiseLevels: FilterExpertise[] = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert"
];

const initialVisibleCount = 24;
const loadMoreStep = 24;
const allAgents = getAiAgentsRegistry();
const categoryOptions = ["All", ...new Set(allAgents.map((agent) => agent.category))];

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function getExpertiseBadgeClass(level: AiAgentExpertiseLevel): string {
  switch (level) {
    case "Beginner":
      return "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200";
    case "Intermediate":
      return "border-cyan-300 bg-cyan-50 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200";
    case "Advanced":
      return "border-indigo-300 bg-indigo-50 text-indigo-800 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200";
    case "Expert":
      return "border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-200";
    default:
      return "border-line/80 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200";
  }
}

function promptPreview(prompt: string, limit = 300): string {
  const normalized = prompt.trim().replace(/\s+/g, " ");
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit).trim()}...`;
}

async function copyText(value: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function AiAgentsBrowser() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedExpertise, setSelectedExpertise] = useState<FilterExpertise>("All");
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);
  const [copyKey, setCopyKey] = useState<string>("");
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");

  const filteredByFacets = useMemo(() => {
    return allAgents.filter((agent) => {
      if (selectedCategory !== "All" && agent.category !== selectedCategory) {
        return false;
      }
      if (selectedExpertise !== "All" && agent.expertiseLevel !== selectedExpertise) {
        return false;
      }
      return true;
    });
  }, [selectedCategory, selectedExpertise]);

  const fuzzyIndex = useMemo(() => {
    return buildFuzzyIndex(filteredByFacets, {
      keys: [
        { name: "title", weight: 0.3 },
        { name: "role", weight: 0.2 },
        { name: "description", weight: 0.2 },
        { name: "category", weight: 0.1 },
        { name: "tags", weight: 0.2 }
      ],
      threshold: 0.34
    });
  }, [filteredByFacets]);

  const searchedAgents = useMemo(() => {
    const normalized = deferredQuery.trim();
    if (!normalized) {
      return [...filteredByFacets].sort(
        (a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title)
      );
    }

    const fuzzy = runFuzzySearch(fuzzyIndex, normalized, 500).map((entry) => entry.item);
    if (fuzzy.length > 0) {
      return fuzzy;
    }

    return filteredByFacets.filter((agent) => {
      const haystack = [agent.title, agent.role, agent.description, agent.category, ...agent.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized.toLowerCase());
    });
  }, [deferredQuery, filteredByFacets, fuzzyIndex]);

  useEffect(() => {
    setVisibleCount(initialVisibleCount);
  }, [deferredQuery, selectedCategory, selectedExpertise]);

  const visibleAgents = searchedAgents.slice(0, visibleCount);
  const canLoadMore = visibleCount < searchedAgents.length;
  const totalCategories = categoryOptions.length - 1;

  async function handleCopy(agent: AiAgentPrompt) {
    const key = `${agent.id}-prompt`;
    const copied = await copyText(agent.systemPrompt);
    setCopyKey(key);
    setCopyState(copied ? "success" : "error");
  }

  function handleCopyStatus(agent: AiAgentPrompt): string {
    const key = `${agent.id}-prompt`;
    if (copyKey !== key || copyState === "idle") return "Copy Prompt";
    return copyState === "success" ? "Copied" : "Copy Failed";
  }

  function toggleExpanded(agentId: string) {
    setExpandedAgentId((current) => (current === agentId ? null : agentId));
  }

  return (
    <div className="space-y-5">
      <section className="surface-card-strong p-5 sm:p-6">
        <p className="eyebrow">AI Agent Library</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
          Copy-ready system prompts for {allAgents.length}+ professional AI agents
        </h2>
        <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Search and filter specialized AI agent prompts across finance, legal, technology, design, marketing,
          business, healthcare, data, and operations. Each profile includes role instructions, reasoning style,
          output rules, constraints, and example tasks.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-line/80 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/60">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Total Agents</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{allAgents.length}</p>
          </div>
          <div className="rounded-xl border border-line/80 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/60">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Categories</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{totalCategories}</p>
          </div>
          <div className="rounded-xl border border-line/80 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/60">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Matches</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{searchedAgents.length}</p>
          </div>
        </div>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              Search Agents
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search role, domain, tags, or focus area..."
              className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              Category
            </span>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            Expertise Level
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {expertiseLevels.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedExpertise(level)}
                className={cx(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  selectedExpertise === level
                    ? "border-slate-300 bg-slate-900 text-white dark:border-slate-200 dark:bg-slate-100 dark:text-slate-900"
                    : "border-line/80 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {visibleAgents.map((agent) => {
          const expanded = expandedAgentId === agent.id;
          const copyLabel = handleCopyStatus(agent);

          return (
            <article
              key={agent.id}
              id={agent.slug}
              className="rounded-2xl border border-line/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  {agent.category}
                </span>
                <span
                  className={cx(
                    "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                    getExpertiseBadgeClass(agent.expertiseLevel)
                  )}
                >
                  {agent.expertiseLevel}
                </span>
              </div>

              <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{agent.title}</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.11em] text-slate-500 dark:text-slate-400">
                {agent.role}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{agent.description}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {agent.tags.slice(0, 6).map((tag) => (
                  <span
                    key={`${agent.id}-${tag}`}
                    className="rounded-full border border-line/80 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-line/80 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  System Prompt
                </p>
                {expanded ? (
                  <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-line/70 bg-slate-950 px-3 py-2 font-mono text-xs leading-6 text-slate-100 dark:border-slate-700">
                    {agent.systemPrompt}
                  </pre>
                ) : (
                  <p className="mt-2 text-xs leading-6 text-slate-700 dark:text-slate-200">
                    {promptPreview(agent.systemPrompt)}
                  </p>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => handleCopy(agent)} className="btn-primary !px-4 !py-2 text-xs">
                  {copyLabel}
                </button>
                <button
                  type="button"
                  onClick={() => toggleExpanded(agent.id)}
                  className="btn-secondary !px-4 !py-2 text-xs"
                >
                  {expanded ? "Hide Full Prompt" : "Show Full Prompt"}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {searchedAgents.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-line/80 bg-white p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
          No AI agent prompts match your current filters. Try broader search terms or reset category/expertise filters.
        </section>
      ) : null}

      {canLoadMore ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((current) => current + loadMoreStep)}
            className="btn-secondary"
          >
            Load More Agents
          </button>
        </div>
      ) : null}
    </div>
  );
}
