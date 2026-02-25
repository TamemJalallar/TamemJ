"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { CorporateTechFix } from "@/lib/corporate-fixes.registry";
import {
  AccessLevelBadge,
  MetaPill,
  SeverityBadge,
  StepTypeBadge,
  TagChip
} from "@/components/corporate-fixes/fix-shared";

function joinClasses(...classes: Array<string | false | null | undefined>): string {
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

function highlightCommandLine(line: string): ReactNode {
  const trimmed = line.trimStart();

  if (trimmed.length === 0) {
    return "\u00A0";
  }

  if (trimmed.startsWith("#")) {
    return <span className="text-emerald-300">{line}</span>;
  }

  const parts = line.split(/(\s+)/);
  let highlightedFirstToken = false;

  return parts.map((part, index) => {
    if (part.length === 0) {
      return null;
    }

    if (/^\s+$/.test(part)) {
      return <span key={`${line}-${index}`}>{part}</span>;
    }

    let className = "text-slate-100";

    if (!highlightedFirstToken) {
      className = "text-cyan-300";
      highlightedFirstToken = true;
    } else if (part === "|" || part === ">" || part === ">>" || part === "\\") {
      className = "text-violet-300";
    } else if (part.startsWith("$")) {
      className = "text-amber-300";
    } else if (part.startsWith("-")) {
      className = "text-fuchsia-300";
    } else if (/^['"].*['"]$/.test(part)) {
      className = "text-lime-300";
    } else if (/^\d+(\.\d+)?$/.test(part)) {
      className = "text-orange-300";
    } else if (part.includes("://")) {
      className = "text-sky-300 underline decoration-sky-400/40 underline-offset-2";
    }

    return (
      <span key={`${line}-${index}`} className={className}>
        {part}
      </span>
    );
  });
}

function CommandBlock({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const success = await copyToClipboard(content);

    if (!success) {
      return;
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 shadow-inner">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
          Command
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-xs leading-6 sm:text-sm">
        <code>
          {content.split("\n").map((line, index) => (
            <div key={`${line}-${index}`} className="min-h-5 whitespace-pre">
              {highlightCommandLine(line)}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

export function FixGuide({ fix }: { fix: CorporateTechFix }) {
  const [copiedAll, setCopiedAll] = useState(false);

  async function handleCopyAll() {
    const compiled = [
      fix.title,
      `Category: ${fix.category}`,
      `Severity: ${fix.severity}`,
      `Access Level: ${fix.accessLevel}`,
      `Estimated Fix Time: ${fix.estimatedTime}`,
      `Tags: ${fix.tags.join(", ")}`,
      "",
      fix.description,
      "",
      "Steps",
      ...fix.steps.flatMap((step, index) => [
        `${index + 1}. ${step.title} [${step.type.toUpperCase()}]`,
        step.content,
        ""
      ])
    ].join("\n");

    const success = await copyToClipboard(compiled);

    if (!success) {
      return;
    }

    setCopiedAll(true);
    window.setTimeout(() => setCopiedAll(false), 1800);
  }

  function handlePrint() {
    if (typeof window === "undefined") {
      return;
    }

    window.print();
  }

  return (
    <div className="space-y-6 print:space-y-4">
      <section className="surface-card-strong p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-950/70 print:shadow-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              {fix.category}
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
              {fix.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              {fix.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 print:hidden sm:justify-end">
            <button type="button" onClick={handleCopyAll} className="btn-secondary">
              {copiedAll ? "Copied All Steps" : "Copy All Steps"}
            </button>
            <button type="button" onClick={handlePrint} className="btn-primary">
              Download as PDF
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <SeverityBadge severity={fix.severity} />
          <AccessLevelBadge accessLevel={fix.accessLevel} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <MetaPill label="Estimated Fix Time" value={fix.estimatedTime} />
          <MetaPill label="Access Level" value={fix.accessLevel} />
          <MetaPill label="Total Steps" value={`${fix.steps.length}`} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {fix.tags.map((tag) => (
            <TagChip key={tag} label={tag} asSpan />
          ))}
        </div>

        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 print:hidden">
          Note: “Download as PDF” opens the browser print dialog. Choose “Save as PDF” for a
          printable runbook copy.
        </p>
      </section>

      <section
        className="surface-card p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-950/70 print:shadow-none"
        aria-labelledby="fix-steps-heading"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2
            id="fix-steps-heading"
            className="text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-xl"
          >
            Step-by-Step Resolution
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 print:hidden">
            Expand each section as needed
          </p>
        </div>

        <ol className="space-y-3">
          {fix.steps.map((step, index) => {
            const warningCard = step.type === "warning";

            return (
              <li key={`${fix.slug}-${index}`}>
                <details
                  className={joinClasses(
                    "fix-step-details group overflow-hidden rounded-2xl border bg-white",
                    "dark:bg-slate-900",
                    warningCard
                      ? "border-rose-200/80 dark:border-rose-900/60"
                      : "border-line/80 dark:border-slate-800"
                  )}
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-4 py-4 sm:px-5">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className={joinClasses(
                          "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                          warningCard
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-200"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        )}
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">
                            {step.title}
                          </h3>
                          <StepTypeBadge type={step.type} />
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {step.type === "command"
                            ? "Includes a copyable command block"
                            : step.type === "warning"
                              ? "Review carefully before proceeding"
                              : "Recommended validation or troubleshooting step"}
                        </p>
                      </div>
                    </div>

                    <span
                      aria-hidden="true"
                      className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line/80 text-slate-500 transition group-open:rotate-180 dark:border-slate-700 dark:text-slate-400 print:hidden"
                    >
                      v
                    </span>
                  </summary>

                  <div
                    className={joinClasses(
                      "fix-step-body border-t px-4 py-4 sm:px-5 sm:py-5",
                      warningCard
                        ? "border-rose-200/80 bg-rose-50/70 dark:border-rose-900/60 dark:bg-rose-950/20"
                        : "border-line/70 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/70"
                    )}
                  >
                    {step.type === "command" ? (
                      <CommandBlock content={step.content} />
                    ) : (
                      <div className="space-y-3">
                        {step.content.split(/\n{2,}/).map((paragraph) => (
                          <p
                            key={paragraph}
                            className="whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-200 sm:text-base"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </details>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
