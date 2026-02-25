"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CorporateFixStep, CorporateTechFix } from "@/lib/corporate-fixes.registry";
import { corporateFixCategories } from "@/lib/corporate-fixes.registry";
import {
  buildLocalCorporateFixEntry,
  getLocalCorporateFixes,
  removeLocalCorporateFix,
  upsertLocalCorporateFix
} from "@/lib/corporate-fixes.local";
import {
  AccessLevelBadge,
  EnterpriseSupportBanner,
  MetaPill,
  SeverityBadge,
  StepTypeBadge,
  TagChip
} from "@/components/corporate-fixes/fix-shared";

const STORAGE_KEY = "corporateTechFixes:kbBuilderDraft:v1";

const severityOptions = ["Low", "Medium", "High"] as const;
const accessLevelOptions = ["User Safe", "Admin Required"] as const;
const stepTypeOptions = ["info", "command", "warning"] as const;

interface CorporateFixBuilderDraft {
  slug: string;
  title: string;
  category: CorporateTechFix["category"];
  severity: CorporateTechFix["severity"];
  accessLevel: CorporateTechFix["accessLevel"];
  estimatedTime: string;
  tags: string[];
  description: string;
  steps: CorporateFixStep[];
}

type LocalPublishState =
  | { status: "idle" }
  | { status: "saved"; slug: string; replaced: boolean }
  | { status: "removed"; slug: string }
  | { status: "error"; message: string };

function createDefaultDraft(): CorporateFixBuilderDraft {
  return {
    slug: "",
    title: "",
    category: "O365",
    severity: "Medium",
    accessLevel: "User Safe",
    estimatedTime: "10-20 min",
    tags: ["microsoft-365", "support", "troubleshooting"],
    description:
      "Add a concise, enterprise-safe troubleshooting description that explains when to use this guide and what it covers.",
    steps: [
      {
        title: "Confirm scope and impact",
        type: "info",
        content:
          "Verify whether the issue affects one user, multiple users, or a broader service. Capture exact error messages, timestamps, and recent changes before making any local changes."
      },
      {
        title: "Run safe diagnostics",
        type: "command",
        content:
          "# Add PowerShell or Terminal commands here\n# Keep commands non-destructive and enterprise-safe"
      },
      {
        title: "Escalate when policy or security is involved",
        type: "warning",
        content:
          "Escalate to IT security, identity, or platform teams when access policies, MFA, Conditional Access, DLP, or tenant-level settings appear to be the cause."
      }
    ]
  };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function normalizeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const next: string[] = [];

  for (const raw of tags) {
    const tag = raw.trim().toLowerCase();
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    next.push(tag);
  }

  return next;
}

function isDraftLike(value: unknown): value is CorporateFixBuilderDraft {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<CorporateFixBuilderDraft>;

  return (
    typeof candidate.slug === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.category === "string" &&
    typeof candidate.severity === "string" &&
    typeof candidate.accessLevel === "string" &&
    typeof candidate.estimatedTime === "string" &&
    typeof candidate.description === "string" &&
    Array.isArray(candidate.tags) &&
    Array.isArray(candidate.steps)
  );
}

function toRegistryEntry(draft: CorporateFixBuilderDraft): CorporateTechFix {
  return {
    slug: draft.slug.trim(),
    title: draft.title.trim(),
    category: draft.category,
    severity: draft.severity,
    accessLevel: draft.accessLevel,
    estimatedTime: draft.estimatedTime.trim(),
    tags: normalizeTags(draft.tags),
    description: draft.description.trim(),
    steps: draft.steps.map((step) => ({
      title: step.title.trim(),
      type: step.type,
      content: step.content.trim()
    }))
  };
}

function getValidationIssues(draft: CorporateFixBuilderDraft): string[] {
  const issues: string[] = [];

  if (!draft.title.trim()) issues.push("Title is required.");
  if (!draft.slug.trim()) issues.push("Slug is required.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug.trim())) {
    issues.push("Slug should be lowercase and hyphenated (letters/numbers only).");
  }
  if (!draft.description.trim()) issues.push("Description is required.");
  if (!draft.estimatedTime.trim()) issues.push("Estimated fix time is required.");

  const tags = normalizeTags(draft.tags);
  if (tags.length === 0) issues.push("At least one tag is required.");

  if (draft.steps.length === 0) {
    issues.push("At least one step is required.");
  }

  for (const [index, step] of draft.steps.entries()) {
    if (!step.title.trim()) issues.push(`Step ${index + 1}: title is required.`);
    if (!step.content.trim()) issues.push(`Step ${index + 1}: content is required.`);
  }

  return issues;
}

function escapeForMarkdownInline(value: string): string {
  return value.replace(/`/g, "\\`");
}

function buildMarkdownDoc(entry: CorporateTechFix): string {
  const lines: string[] = [];

  lines.push(`# ${entry.title}`);
  lines.push("");
  lines.push("> Generated by Corporate Tech Fixes KB Builder");
  lines.push("");
  lines.push("## Metadata");
  lines.push("");
  lines.push(`- **Slug:** \`${escapeForMarkdownInline(entry.slug)}\``);
  lines.push(`- **Category:** ${entry.category}`);
  lines.push(`- **Severity:** ${entry.severity}`);
  lines.push(`- **Access Level:** ${entry.accessLevel}`);
  lines.push(`- **Estimated Fix Time:** ${entry.estimatedTime}`);
  lines.push(`- **Tags:** ${entry.tags.map((tag) => `\`${escapeForMarkdownInline(tag)}\``).join(", ")}`);
  lines.push("");
  lines.push("## Description");
  lines.push("");
  lines.push(entry.description);
  lines.push("");
  lines.push("## Resolution Steps");
  lines.push("");

  entry.steps.forEach((step, index) => {
    lines.push(`### ${index + 1}. ${step.title}`);
    lines.push("");
    lines.push(`- **Type:** ${step.type}`);
    lines.push("");

    if (step.type === "command") {
      lines.push("```bash");
      lines.push(step.content);
      lines.push("```");
    } else {
      lines.push(step.content);
    }

    lines.push("");
  });

  return lines.join("\n").trimEnd();
}

async function copyText(text: string): Promise<boolean> {
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

function downloadTextFile(filename: string, content: string, mimeType: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

function updateStepAtIndex(
  steps: CorporateFixStep[],
  index: number,
  updater: (step: CorporateFixStep) => CorporateFixStep
): CorporateFixStep[] {
  return steps.map((step, stepIndex) => (stepIndex === index ? updater(step) : step));
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) {
    return items;
  }

  const next = [...items];
  const [item] = next.splice(index, 1);
  next.splice(nextIndex, 0, item);
  return next;
}

export function FixBuilder() {
  const [draft, setDraft] = useState<CorporateFixBuilderDraft>(createDefaultDraft);
  const [newTag, setNewTag] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [loadedFromLocal, setLoadedFromLocal] = useState(false);
  const [localPublishState, setLocalPublishState] = useState<LocalPublishState>({ status: "idle" });
  const [isPublishedLocally, setIsPublishedLocally] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as unknown;
      if (!isDraftLike(parsed)) {
        return;
      }

      setDraft({
        slug: parsed.slug,
        title: parsed.title,
        category: corporateFixCategories.includes(parsed.category)
          ? parsed.category
          : createDefaultDraft().category,
        severity: severityOptions.includes(parsed.severity as (typeof severityOptions)[number])
          ? (parsed.severity as CorporateTechFix["severity"])
          : "Medium",
        accessLevel: accessLevelOptions.includes(
          parsed.accessLevel as (typeof accessLevelOptions)[number]
        )
          ? (parsed.accessLevel as CorporateTechFix["accessLevel"])
          : "User Safe",
        estimatedTime: parsed.estimatedTime,
        description: parsed.description,
        tags: normalizeTags(parsed.tags.filter((tag): tag is string => typeof tag === "string")),
        steps: parsed.steps
          .filter(
            (step): step is CorporateFixStep =>
              Boolean(step) &&
              typeof step === "object" &&
              typeof (step as CorporateFixStep).title === "string" &&
              typeof (step as CorporateFixStep).content === "string" &&
              stepTypeOptions.includes((step as CorporateFixStep).type)
          )
          .map((step) => ({ ...step }))
      });
      setLoadedFromLocal(true);
    } catch {
      // Ignore malformed local drafts.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...draft,
          tags: normalizeTags(draft.tags)
        })
      );
      setSaveState("saved");
      const timer = window.setTimeout(() => setSaveState("idle"), 900);
      return () => window.clearTimeout(timer);
    } catch {
      return;
    }
  }, [draft]);

  const validationIssues = useMemo(() => getValidationIssues(draft), [draft]);
  const normalizedEntry = useMemo(() => toRegistryEntry(draft), [draft]);
  const localPreviewEntry = useMemo(() => buildLocalCorporateFixEntry(normalizedEntry), [normalizedEntry]);

  const registrySnippet = useMemo(
    () => `${JSON.stringify(normalizedEntry, null, 2)},`,
    [normalizedEntry]
  );

  const markdownOutput = useMemo(() => buildMarkdownDoc(normalizedEntry), [normalizedEntry]);

  const jsonOutput = useMemo(() => JSON.stringify(normalizedEntry, null, 2), [normalizedEntry]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!normalizedEntry.slug.trim()) {
      setIsPublishedLocally(false);
      return;
    }

    const localEntries = getLocalCorporateFixes();
    setIsPublishedLocally(localEntries.some((entry) => entry.slug === localPreviewEntry.slug));
  }, [localPreviewEntry.slug, normalizedEntry.slug]);

  async function handleCopy(key: string, text: string) {
    const success = await copyText(text);
    if (!success) {
      return;
    }

    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((current) => (current === key ? null : current));
    }, 1400);
  }

  function handlePublishToTechFixesLocal() {
    if (validationIssues.length > 0) {
      setLocalPublishState({
        status: "error",
        message: "Fix validation issues before publishing to Tech Fixes."
      });
      return;
    }

    try {
      const { storedEntry, replaced } = upsertLocalCorporateFix(normalizedEntry);
      setIsPublishedLocally(true);
      setLocalPublishState({
        status: "saved",
        slug: storedEntry.slug,
        replaced
      });
    } catch {
      setLocalPublishState({
        status: "error",
        message: "Unable to save to local Tech Fixes in this browser."
      });
    }
  }

  function handleRemoveLocalPublishedEntry() {
    if (!localPreviewEntry.slug) {
      return;
    }

    try {
      const removed = removeLocalCorporateFix(localPreviewEntry.slug);
      if (!removed) {
        return;
      }

      setIsPublishedLocally(false);
      setLocalPublishState({
        status: "removed",
        slug: localPreviewEntry.slug
      });
    } catch {
      setLocalPublishState({
        status: "error",
        message: "Unable to remove the local Tech Fixes entry in this browser."
      });
    }
  }

  function addTagFromInput() {
    const parsed = newTag
      .split(/[\n,]/g)
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (parsed.length === 0) {
      return;
    }

    setDraft((current) => ({
      ...current,
      tags: normalizeTags([...current.tags, ...parsed])
    }));
    setNewTag("");
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <EnterpriseSupportBanner />

      <div className="surface-card-strong p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950/70">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="eyebrow dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              KB Builder Tool
            </p>
            <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
              Create Corporate Tech Fixes KB Entries
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              Build new registry entries and support documentation from a form. The tool stores drafts
              locally in your browser, can publish local-only previews directly into the Tech Fixes
              catalog, and generates copy/paste-ready output for
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">
                lib/corporate-fixes.registry.ts
              </code>
              plus a Markdown support doc template.
            </p>
          </div>

          <div className="rounded-2xl border border-line/80 bg-slate-50/80 p-4 text-sm dark:border-slate-800 dark:bg-slate-900/80">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Draft Status</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {saveState === "saved" ? "Draft autosaved locally" : "Editing draft"}
            </p>
            {loadedFromLocal ? (
              <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
                Loaded previous local draft
              </p>
            ) : null}
            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={handlePublishToTechFixesLocal}
                className="btn-primary px-4 py-2 text-xs sm:text-sm"
              >
                {isPublishedLocally ? "Update in Tech Fixes (Local)" : "Add to Tech Fixes (Local)"}
              </button>
              {isPublishedLocally ? (
                <button
                  type="button"
                  onClick={handleRemoveLocalPublishedEntry}
                  className="btn-secondary px-4 py-2 text-xs sm:text-sm"
                >
                  Remove Local Entry
                </button>
              ) : null}
              <Link href="/corporate-tech-fixes" className="btn-secondary px-4 py-2 text-center text-xs sm:text-sm">
                Open Tech Fixes
              </Link>
            </div>
            <p className="mt-3 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
              Local-only publish: appears in Tech Fixes on this browser/device. GitHub Pages cannot
              write new registry files from the builder.
            </p>
            {localPublishState.status === "saved" ? (
              <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-300">
                {localPublishState.replaced ? "Updated" : "Added"} local Tech Fixes entry:
                <code className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] dark:bg-slate-800">
                  {localPublishState.slug}
                </code>
              </p>
            ) : null}
            {localPublishState.status === "removed" ? (
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                Removed local Tech Fixes entry:
                <code className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] dark:bg-slate-800">
                  {localPublishState.slug}
                </code>
              </p>
            ) : null}
            {localPublishState.status === "error" ? (
              <p className="mt-2 text-xs text-rose-700 dark:text-rose-300">
                {localPublishState.message}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-start">
        <div className="min-w-0 space-y-6">
          <section className="surface-card p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950/70">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Basic Information
              </h2>
              <button
                type="button"
                onClick={() => setDraft(createDefaultDraft())}
                className="btn-secondary px-4 py-2 text-xs sm:text-sm"
              >
                Reset Draft
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">
                  Title
                </label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="e.g., Outlook Search Not Returning Results"
                  className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">
                  Slug
                </label>
                <div className="flex min-w-0 gap-2">
                  <input
                    type="text"
                    value={draft.slug}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, slug: slugify(event.target.value) }))
                    }
                    placeholder="outlook-search-not-returning-results"
                    className="min-w-0 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({ ...current, slug: slugify(current.title || current.slug) }))
                    }
                    className="btn-secondary shrink-0 px-4 py-2 text-xs sm:text-sm"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">
                  Category
                </label>
                <select
                  value={draft.category}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      category: event.target.value as CorporateTechFix["category"]
                    }))
                  }
                  className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {corporateFixCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">
                  Estimated Fix Time
                </label>
                <input
                  type="text"
                  value={draft.estimatedTime}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, estimatedTime: event.target.value }))
                  }
                  placeholder="10-20 min"
                  className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">
                  Severity
                </label>
                <select
                  value={draft.severity}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      severity: event.target.value as CorporateTechFix["severity"]
                    }))
                  }
                  className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {severityOptions.map((severity) => (
                    <option key={severity} value={severity}>
                      {severity}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">
                  Access Level
                </label>
                <select
                  value={draft.accessLevel}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      accessLevel: event.target.value as CorporateTechFix["accessLevel"]
                    }))
                  }
                  className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {accessLevelOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={draft.description}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, description: event.target.value }))
                  }
                  placeholder="Describe when to use this fix and what it safely covers."
                  className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950/70">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Tags</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Add one tag or paste comma-separated tags. Tags are normalized to lowercase.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={newTag}
                onChange={(event) => setNewTag(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTagFromInput();
                  }
                }}
                placeholder="e.g., outlook, exchange-online, auth"
                className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              <button type="button" onClick={addTagFromInput} className="btn-secondary px-4 py-2">
                Add Tag(s)
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {normalizeTags(draft.tags).map((tag) => (
                <div key={tag} className="inline-flex items-center gap-1">
                  <TagChip label={tag} asSpan />
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        tags: current.tags.filter((item) => item !== tag)
                      }))
                    }
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-line/80 bg-white text-xs text-slate-500 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                    aria-label={`Remove tag ${tag}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950/70">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Resolution Steps</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Add step-by-step sections with `info`, `command`, or `warning` types.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    steps: [
                      ...current.steps,
                      {
                        title: `Step ${current.steps.length + 1}`,
                        type: "info",
                        content: "Add the next safe troubleshooting step here."
                      }
                    ]
                  }))
                }
                className="btn-primary px-4 py-2 text-xs sm:text-sm"
              >
                Add Step
              </button>
            </div>

            <div className="space-y-4">
              {draft.steps.map((step, index) => (
                <div
                  key={`${index}-${step.title}`}
                  className="rounded-2xl border border-line/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/70"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {index + 1}
                      </span>
                      <StepTypeBadge type={step.type} />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            steps: moveItem(current.steps, index, -1)
                          }))
                        }
                        className="btn-secondary px-3 py-1.5 text-xs"
                        disabled={index === 0}
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            steps: moveItem(current.steps, index, 1)
                          }))
                        }
                        className="btn-secondary px-3 py-1.5 text-xs"
                        disabled={index === draft.steps.length - 1}
                      >
                        Down
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            steps: current.steps.filter((_, stepIndex) => stepIndex !== index)
                          }))
                        }
                        className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200"
                        disabled={draft.steps.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                        Step Title
                      </label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            steps: updateStepAtIndex(current.steps, index, (currentStep) => ({
                              ...currentStep,
                              title: event.target.value
                            }))
                          }))
                        }
                        className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div className="sm:min-w-[180px]">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                        Type
                      </label>
                      <select
                        value={step.type}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            steps: updateStepAtIndex(current.steps, index, (currentStep) => ({
                              ...currentStep,
                              type: event.target.value as CorporateFixStep["type"]
                            }))
                          }))
                        }
                        className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      >
                        {stepTypeOptions.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      Content
                    </label>
                    <textarea
                      rows={step.type === "command" ? 6 : 5}
                      value={step.content}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          steps: updateStepAtIndex(current.steps, index, (currentStep) => ({
                            ...currentStep,
                            content: event.target.value
                          }))
                        }))
                      }
                      className="w-full rounded-xl border border-line bg-white px-4 py-2.5 font-mono text-xs text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft sm:text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="min-w-0 space-y-6 xl:sticky xl:top-24">
          <section className="min-w-0 surface-card-strong p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950/70">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Preview</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Live preview of the registry entry metadata and step outline.
            </p>

            <div className="mt-4 rounded-2xl border border-line/80 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900/80">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                {normalizedEntry.category}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                {normalizedEntry.title || "Untitled Corporate Fix"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {normalizedEntry.description || "Add a description to preview the summary here."}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <SeverityBadge severity={normalizedEntry.severity} />
                <AccessLevelBadge accessLevel={normalizedEntry.accessLevel} />
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <MetaPill label="Estimated Time" value={normalizedEntry.estimatedTime || "—"} />
                <MetaPill label="Steps" value={`${normalizedEntry.steps.length}`} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {normalizedEntry.tags.map((tag) => (
                  <TagChip key={tag} label={tag} asSpan />
                ))}
              </div>

              <ol className="mt-4 space-y-2 text-sm">
                {normalizedEntry.steps.map((step, index) => (
                  <li
                    key={`${step.title}-${index}`}
                    className="rounded-xl border border-line/70 bg-slate-50/70 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/60"
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {index + 1}
                      </span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {step.title || "Untitled step"}
                      </span>
                      <StepTypeBadge type={step.type} />
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="min-w-0 surface-card p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950/70">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Validation</h2>
            {validationIssues.length === 0 ? (
              <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
                Looks good. The entry is ready to copy into the registry.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {validationIssues.map((issue) => (
                  <li
                    key={issue}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200"
                  >
                    {issue}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="min-w-0 surface-card p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950/70">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Registry Snippet (TS/JSON)
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy("registry", registrySnippet)}
                  className="btn-secondary px-4 py-2 text-xs sm:text-sm"
                >
                  {copiedKey === "registry" ? "Copied" : "Copy Snippet"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadTextFile(
                      `${normalizedEntry.slug || "corporate-fix"}.entry.json`,
                      jsonOutput,
                      "application/json"
                    )
                  }
                  className="btn-secondary px-4 py-2 text-xs sm:text-sm"
                >
                  Download JSON
                </button>
              </div>
            </div>
            <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
              Paste this object into the `corporateFixes` array in `lib/corporate-fixes.registry.ts`.
            </p>
            <pre className="max-h-[50vh] w-full max-w-full overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-100 sm:text-sm">
              <code>{registrySnippet}</code>
            </pre>
          </section>

          <section className="min-w-0 surface-card p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950/70">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Markdown Support Doc
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy("markdown", markdownOutput)}
                  className="btn-secondary px-4 py-2 text-xs sm:text-sm"
                >
                  {copiedKey === "markdown" ? "Copied" : "Copy Markdown"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadTextFile(
                      `${normalizedEntry.slug || "corporate-fix"}.md`,
                      markdownOutput,
                      "text/markdown"
                    )
                  }
                  className="btn-secondary px-4 py-2 text-xs sm:text-sm"
                >
                  Download .md
                </button>
              </div>
            </div>
            <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
              Use this for internal docs, notes, or drafting support runbooks before publishing.
            </p>
            <pre className="max-h-[50vh] w-full max-w-full overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-100 sm:text-sm">
              <code>{markdownOutput}</code>
            </pre>
          </section>
        </div>
      </div>
    </div>
  );
}
