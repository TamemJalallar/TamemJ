"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole
} from "@floating-ui/react";
import {
  aiPromptExpertiseLevels,
  aiPromptProviders,
  buildAiLibraryPrompt,
  buildAiPrompt,
  createPromptInputDefaults,
  getAiPromptExpertiseProfile,
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
type ExpertiseSyncMode = "preserve" | "reseed";

const expertiseDescriptions: Record<AiPromptExpertise, string> = {
  Beginner: "Plain language, guided steps, and term definitions.",
  Hobbyist: "Practical implementation first, with optional advanced notes.",
  Intermediate: "Operational detail with tradeoffs, risks, and verification.",
  Expert: "Concise technical output focused on architecture and failure modes."
};

const ONBOARDING_HINT_STORAGE_KEY = "aiPrompts:builder:onboardingSeen:v1";
const ONBOARDING_HINT_AUTO_DISMISS_MS = 10000;

function MiniInfoTooltip({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "top",
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })]
  });
  const hover = useHover(context, { move: false, delay: { open: 120, close: 80 } });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  return (
    <>
      <span
        ref={refs.setReference}
        {...getReferenceProps({
          tabIndex: 0,
          "aria-label": label
        })}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-line/80 bg-white text-[10px] font-bold text-slate-600 outline-none transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        ?
      </span>
      {open ? (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 max-w-[16rem] rounded-md border border-line bg-white px-2 py-1.5 text-[11px] leading-5 text-slate-700 shadow-card dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            {label}
          </div>
        </FloatingPortal>
      ) : null}
    </>
  );
}

export function AiPromptsBuilder() {
  const initialTemplate = templates[0];
  const [viewMode, setViewMode] = useState<"builder" | "library">("builder");
  const [selectedTemplateSlug, setSelectedTemplateSlug] = useState<string>(initialTemplate?.slug ?? "");
  const [selectedProvider, setSelectedProvider] = useState<AiPromptProvider>("ChatGPT");
  const [selectedExpertise, setSelectedExpertise] = useState<AiPromptExpertise>("Beginner");
  const [inputValues, setInputValues] = useState<Record<string, string>>(
    initialTemplate ? createPromptInputDefaults(initialTemplate, "Beginner") : {}
  );
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");
  const [libraryQuery, setLibraryQuery] = useState("");
  const [libraryCategory, setLibraryCategory] = useState<string>("All");
  const [libraryCopyKey, setLibraryCopyKey] = useState<string>("");
  const [libraryCopyState, setLibraryCopyState] = useState<"idle" | "success" | "error">("idle");
  const [expertiseSyncMode, setExpertiseSyncMode] = useState<ExpertiseSyncMode>("preserve");
  const [showOnboardingHint, setShowOnboardingHint] = useState(false);

  const selectedTemplate = getAiPromptTemplateBySlug(selectedTemplateSlug) ?? initialTemplate;
  const previousExpertiseRef = useRef<AiPromptExpertise>(selectedExpertise);
  const previousTemplateSlugRef = useRef<string>(selectedTemplate?.slug ?? "");

  useEffect(() => {
    if (!selectedTemplate || viewMode !== "builder") return;
    const templateChanged = previousTemplateSlugRef.current !== selectedTemplate.slug;
    const expertiseChanged = previousExpertiseRef.current !== selectedExpertise;

    if (templateChanged || (expertiseChanged && expertiseSyncMode === "reseed")) {
      setInputValues(createPromptInputDefaults(selectedTemplate, selectedExpertise));
      setCopyState("idle");
    }

    previousTemplateSlugRef.current = selectedTemplate.slug;
    previousExpertiseRef.current = selectedExpertise;
  }, [expertiseSyncMode, selectedExpertise, selectedTemplate, viewMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const seen = window.localStorage.getItem(ONBOARDING_HINT_STORAGE_KEY);
      if (seen !== "1") {
        setShowOnboardingHint(true);
      }
    } catch {
      // no-op: keep UX functional if storage is unavailable
    }
  }, []);

  useEffect(() => {
    if (!showOnboardingHint || typeof window === "undefined") return;
    const timeoutId = window.setTimeout(() => {
      setShowOnboardingHint(false);
      try {
        window.localStorage.setItem(ONBOARDING_HINT_STORAGE_KEY, "1");
      } catch {
        // no-op
      }
    }, ONBOARDING_HINT_AUTO_DISMISS_MS);

    return () => window.clearTimeout(timeoutId);
  }, [showOnboardingHint]);

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

  const expertiseProfile = useMemo(
    () => getAiPromptExpertiseProfile(selectedExpertise),
    [selectedExpertise]
  );

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
    setInputValues(createPromptInputDefaults(selectedTemplate, selectedExpertise));
    setCopyState("idle");
  }

  function dismissOnboardingHint() {
    setShowOnboardingHint(false);
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(ONBOARDING_HINT_STORAGE_KEY, "1");
    } catch {
      // no-op
    }
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

      {showOnboardingHint ? (
        <section className="rounded-xl border border-cyan-200 bg-cyan-50/80 p-4 shadow-soft dark:border-cyan-900 dark:bg-cyan-950/30">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-700 dark:text-cyan-200">
                First-Time Tip
              </p>
              <p className="mt-1 text-sm leading-6 text-cyan-900 dark:text-cyan-100">
                Pick an expertise level to control depth and tone. Use <span className="font-semibold">Keep my inputs</span>{" "}
                if you do not want field values replaced when switching levels.
              </p>
              <p className="mt-1 text-xs text-cyan-700 dark:text-cyan-300">
                This hint auto-dismisses after a few seconds.
              </p>
            </div>
            <button type="button" onClick={dismissOnboardingHint} className="btn-secondary">
              Got it
            </button>
          </div>
        </section>
      ) : null}

      {viewMode === "builder" ? (
        <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <div className="space-y-5">
            <article className="surface-card p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Configuration</h3>

              <div className="mt-4 rounded-xl border border-line/80 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Quick Start
                </p>
                <ol className="mt-2 grid gap-2 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-4">
                  <li className="rounded-lg border border-line/70 bg-white/90 px-2.5 py-2 dark:border-slate-700 dark:bg-slate-950/70">
                    1. Pick template
                  </li>
                  <li className="rounded-lg border border-line/70 bg-white/90 px-2.5 py-2 dark:border-slate-700 dark:bg-slate-950/70">
                    2. Choose model
                  </li>
                  <li className="rounded-lg border border-line/70 bg-white/90 px-2.5 py-2 dark:border-slate-700 dark:bg-slate-950/70">
                    3. Select skill level
                  </li>
                  <li className="rounded-lg border border-line/70 bg-white/90 px-2.5 py-2 dark:border-slate-700 dark:bg-slate-950/70">
                    4. Fill fields and copy
                  </li>
                </ol>
              </div>

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

              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Expertise Level
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-4">
                  {aiPromptExpertiseLevels.map((level) => (
                    <div key={level} className="relative">
                      <button
                        type="button"
                        onClick={() => setSelectedExpertise(level)}
                        className={cx(
                          "w-full rounded-lg border px-3 py-2 pr-8 text-left text-xs font-semibold transition",
                          selectedExpertise === level
                            ? "border-slate-300 bg-slate-900 text-white dark:border-slate-300 dark:bg-slate-100 dark:text-slate-900"
                            : "border-line/80 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                        )}
                        title={expertiseDescriptions[level]}
                      >
                        {level}
                      </button>
                      <div className="absolute right-2 top-2">
                        <MiniInfoTooltip label={expertiseDescriptions[level]} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                  {expertiseDescriptions[selectedExpertise]}
                </p>
              </div>

              <div className="mt-3 rounded-xl border border-line/80 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  When skill level changes
                </p>
                <div className="mt-2 inline-flex rounded-lg border border-line/80 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
                  <button
                    type="button"
                    onClick={() => setExpertiseSyncMode("preserve")}
                    className={cx(
                      "rounded-md px-2.5 py-1.5 text-xs font-semibold transition",
                      expertiseSyncMode === "preserve"
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    )}
                  >
                    Keep my inputs
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpertiseSyncMode("reseed")}
                    className={cx(
                      "rounded-md px-2.5 py-1.5 text-xs font-semibold transition",
                      expertiseSyncMode === "reseed"
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    )}
                  >
                    Use level defaults
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {expertiseSyncMode === "preserve"
                    ? "Your custom field values stay as-is when you switch levels."
                    : "Switching levels replaces fields with that level's defaults."}
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-line/80 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Active Skill Profile: {selectedExpertise}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  The generated prompt includes these level-specific instructions.
                </p>
                <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {expertiseProfile.map((rule) => (
                    <li key={`builder-${selectedExpertise}-${rule}`} className="leading-6">
                      • {rule}
                    </li>
                  ))}
                </ul>
              </div>
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

            <div className="mt-4 rounded-xl border border-line/80 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-900/60">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Active Skill Profile: {selectedExpertise}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {expertiseDescriptions[selectedExpertise]}
              </p>
              <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {expertiseProfile.map((rule) => (
                  <li key={`library-${selectedExpertise}-${rule}`} className="leading-6">
                    • {rule}
                  </li>
                ))}
              </ul>
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
