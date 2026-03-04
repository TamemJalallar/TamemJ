"use client";

import { useEffect, useMemo, useState } from "react";
import {
  aiPromptExpertiseLevels,
  aiPromptProviders,
  buildAiLibraryPrompt,
  buildAiPrompt,
  createPromptInputDefaults,
  getAiPromptLibraryCategories,
  getAiPromptLibraryItems,
  getAiPromptTemplateBySlug,
  getAiPromptTemplates,
  type AiPromptExpertise,
  type AiPromptProvider
} from "@/lib/ai-prompts.registry";

function cx(...classes: Array<string | null | undefined | false>): string {
  return classes.filter(Boolean).join(" ");
}

async function copyToClipboard(text: string): Promise<boolean> {
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

function providerShortLabel(provider: AiPromptProvider): string {
  switch (provider) {
    case "Adobe GenAI":
      return "Adobe";
    case "Grok/xAI":
      return "Grok";
    default:
      return provider;
  }
}

const templates = getAiPromptTemplates();
const libraryItems = getAiPromptLibraryItems();
const libraryCategories = getAiPromptLibraryCategories();

export function AiPromptsBuilder() {
  const initialTemplate = templates[0];
  const [viewMode, setViewMode] = useState<"builder" | "library">("builder");
  const [selectedTemplateSlug, setSelectedTemplateSlug] = useState<string>(initialTemplate?.slug ?? "");
  const [selectedProvider, setSelectedProvider] = useState<AiPromptProvider>("ChatGPT");
  const [selectedExpertise, setSelectedExpertise] = useState<AiPromptExpertise>("Beginner");
  const [inputValues, setInputValues] = useState<Record<string, string>>(
    initialTemplate ? createPromptInputDefaults(initialTemplate) : {}
  );
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");
  const [libraryQuery, setLibraryQuery] = useState("");
  const [libraryCategory, setLibraryCategory] = useState<string>("All");
  const [libraryCopyKey, setLibraryCopyKey] = useState<string>("");
  const [libraryCopyState, setLibraryCopyState] = useState<"idle" | "success" | "error">("idle");

  const selectedTemplate = getAiPromptTemplateBySlug(selectedTemplateSlug) ?? initialTemplate;

  useEffect(() => {
    if (!selectedTemplate) return;
    setInputValues(createPromptInputDefaults(selectedTemplate));
    setCopyState("idle");
  }, [selectedTemplate?.slug]);

  const filteredLibraryItems = useMemo(() => {
    const normalized = libraryQuery.trim().toLowerCase();

    return libraryItems
      .filter((item) => (libraryCategory === "All" ? true : item.category === libraryCategory))
      .filter((item) => {
        if (!normalized) return true;
        const haystack = [item.title, item.description, item.category, item.prompt, ...item.tags]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalized);
      })
      .sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
  }, [libraryCategory, libraryQuery]);

  if (!selectedTemplate) {
    return (
      <div className="rounded-2xl border border-dashed border-line/80 bg-white p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
        No AI prompt templates are configured yet.
      </div>
    );
  }

  const generatedPrompt = buildAiPrompt({
    template: selectedTemplate,
    provider: selectedProvider,
    expertise: selectedExpertise,
    values: inputValues
  });

  async function handleCopyPrompt() {
    const copied = await copyToClipboard(generatedPrompt);
    setCopyState(copied ? "success" : "error");
  }

  function handleFieldValueChange(fieldKey: string, value: string) {
    setInputValues((current) => ({
      ...current,
      [fieldKey]: value
    }));
    setCopyState("idle");
  }

  function handleResetBuilder() {
    setInputValues(createPromptInputDefaults(selectedTemplate));
    setCopyState("idle");
  }

  async function handleCopyLibraryPrompt(itemSlug: string, provider: AiPromptProvider) {
    const item = libraryItems.find((entry) => entry.slug === itemSlug);
    if (!item) return;

    const prompt = buildAiLibraryPrompt({
      item,
      provider,
      expertise: selectedExpertise
    });
    const copied = await copyToClipboard(prompt);
    setLibraryCopyKey(`${item.slug}-${provider}`);
    setLibraryCopyState(copied ? "success" : "error");
  }

  function resetLibraryFilters() {
    setLibraryQuery("");
    setLibraryCategory("All");
  }

  return (
    <div className="space-y-5">
      <section className="surface-card-strong p-5 sm:p-6">
        <p className="eyebrow">Prompt Builder</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          AI prompts for technical workflows
        </h2>
        <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Use Builder mode for customized prompts, or Prompt Library mode for one-click prompts across ChatGPT, Claude,
          Adobe GenAI, Perplexity, Grok/xAI, and Meta AI.
        </p>
        <div className="mt-4 inline-flex rounded-xl border border-line/80 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setViewMode("builder")}
            className={cx(
              "rounded-lg px-3 py-1.5 text-sm font-semibold transition",
              viewMode === "builder"
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
          >
            Builder
          </button>
          <button
            type="button"
            onClick={() => setViewMode("library")}
            className={cx(
              "rounded-lg px-3 py-1.5 text-sm font-semibold transition",
              viewMode === "library"
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
          >
            Prompt Library ({libraryItems.length})
          </button>
        </div>
      </section>

      {viewMode === "builder" ? (
        <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <div className="space-y-5">
            <article className="surface-card p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Configuration</h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    Template
                  </span>
                  <select
                    value={selectedTemplate.slug}
                    onChange={(event) => setSelectedTemplateSlug(event.target.value)}
                    className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {templates.map((template) => (
                      <option key={template.slug} value={template.slug}>
                        {template.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    AI Model
                  </span>
                  <select
                    value={selectedProvider}
                    onChange={(event) => setSelectedProvider(event.target.value as AiPromptProvider)}
                    className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {aiPromptProviders.map((provider) => (
                      <option key={provider} value={provider}>
                        {provider}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="mt-3 block space-y-1">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Expertise Level
                </span>
                <select
                  value={selectedExpertise}
                  onChange={(event) => setSelectedExpertise(event.target.value as AiPromptExpertise)}
                  className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {aiPromptExpertiseLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>
            </article>

            <article className="surface-card p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{selectedTemplate.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{selectedTemplate.description}</p>

              <div className="mt-4 space-y-3">
                {selectedTemplate.fields.map((field) => (
                  <label key={`${selectedTemplate.slug}-${field.key}`} className="block space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      {field.label}
                      {field.required ? " (required)" : ""}
                    </span>
                    {field.multiline ? (
                      <textarea
                        value={inputValues[field.key] ?? ""}
                        onChange={(event) => handleFieldValueChange(field.key, event.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                    ) : (
                      <input
                        type="text"
                        value={inputValues[field.key] ?? ""}
                        onChange={(event) => handleFieldValueChange(field.key, event.target.value)}
                        placeholder={field.placeholder}
                        className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                    )}
                  </label>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={handleCopyPrompt} className="btn-primary">
                  Copy Prompt
                </button>
                <button type="button" onClick={handleResetBuilder} className="btn-secondary">
                  Reset Inputs
                </button>
                <p
                  className={cx(
                    "self-center text-xs font-medium",
                    copyState === "success" && "text-emerald-600 dark:text-emerald-300",
                    copyState === "error" && "text-rose-600 dark:text-rose-300",
                    copyState === "idle" && "text-slate-500 dark:text-slate-400"
                  )}
                >
                  {copyState === "success"
                    ? "Prompt copied."
                    : copyState === "error"
                      ? "Copy failed. Use manual copy."
                      : "Ready to copy."}
                </p>
              </div>
            </article>
          </div>

          <article className="surface-card p-5 sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Generated Prompt</h3>
              <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {selectedProvider} • {selectedExpertise}
              </span>
            </div>
            <pre className="max-h-[44rem] overflow-auto whitespace-pre-wrap rounded-xl border border-line/80 bg-slate-950 px-4 py-4 font-mono text-xs leading-6 text-slate-100 dark:border-slate-700">
              {generatedPrompt}
            </pre>
          </article>
        </section>
      ) : (
        <section className="space-y-4">
          <article className="surface-card p-5 sm:p-6">
            <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px_auto]">
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Search Prompt Library
                </span>
                <input
                  type="search"
                  value={libraryQuery}
                  onChange={(event) => setLibraryQuery(event.target.value)}
                  placeholder="Search prompt title, category, or tags..."
                  className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Category
                </span>
                <select
                  value={libraryCategory}
                  onChange={(event) => setLibraryCategory(event.target.value)}
                  className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="All">All</option>
                  {libraryCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Expertise Level
                </span>
                <select
                  value={selectedExpertise}
                  onChange={(event) => setSelectedExpertise(event.target.value as AiPromptExpertise)}
                  className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {aiPromptExpertiseLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={resetLibraryFilters}
                  className="btn-secondary h-11 w-full px-4 py-0 lg:w-auto"
                >
                  Reset
                </button>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-line/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
            Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{filteredLibraryItems.length}</span>{" "}
            of <span className="font-semibold text-slate-900 dark:text-slate-100">{libraryItems.length}</span> prompts.
            Each provider button performs a one-click copy using the selected expertise level.
          </article>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredLibraryItems.map((item) => (
              <article
                key={item.slug}
                className="rounded-2xl border border-line/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{selectedExpertise}</span>
                </div>

                <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.tags.slice(0, 4).map((tag) => (
                    <span
                      key={`${item.slug}-${tag}`}
                      className="rounded-full border border-line/80 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {aiPromptProviders.map((provider) => {
                    const copyKey = `${item.slug}-${provider}`;
                    const wasCopied = libraryCopyKey === copyKey && libraryCopyState === "success";
                    const copyFailed = libraryCopyKey === copyKey && libraryCopyState === "error";

                    return (
                      <button
                        key={copyKey}
                        type="button"
                        onClick={() => handleCopyLibraryPrompt(item.slug, provider)}
                        className={cx(
                          "rounded-lg border px-2 py-1.5 text-xs font-semibold transition",
                          wasCopied
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
                            : copyFailed
                              ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-200"
                              : "border-line/80 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                        )}
                        title={`Copy for ${provider}`}
                      >
                        {wasCopied ? `${providerShortLabel(provider)} ✓` : providerShortLabel(provider)}
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>

          {filteredLibraryItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line/80 bg-white p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
              No prompt library matches for your filters. Try broader search terms.
            </div>
          ) : null}
        </section>
      )}
    </div>
  );
}
