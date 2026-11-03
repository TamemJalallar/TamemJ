"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PCBuildGuide } from "@/types/pc-build";
import { AccordionSteps } from "@/components/support-portal/accordion-steps";
import { CodeBlock } from "@/components/support-portal/code-block";
import { getPurchaseLinksForPart, type PCPurchaseLink } from "@/lib/pc-build-purchase-links";

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

async function copyToClipboard(value: string): Promise<boolean> {
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

function purchaseLinkRel(link: PCPurchaseLink): string {
  return link.type === "affiliate" && link.status === "Active"
    ? "sponsored nofollow noreferrer"
    : "nofollow noreferrer";
}

export function PCBuildGuideView({
  guide,
  relatedGuides
}: {
  guide: PCBuildGuide;
  relatedGuides: PCBuildGuide[];
}) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedCommands, setCopiedCommands] = useState(false);

  const allCommandsText = useMemo(() => {
    return guide.commands
      .map((command) => `${command.title} (${command.shell})\n${command.content}`)
      .join("\n\n");
  }, [guide.commands]);

  async function handleCopyAll() {
    const content = [
      guide.title,
      `Category: ${guide.category}`,
      `Difficulty: ${guide.difficulty}`,
      `Budget Band: ${guide.budgetBand}`,
      `Estimated Time: ${guide.estimatedTime}`,
      "",
      guide.description,
      "",
      "Use Cases",
      ...guide.useCases.map((useCase) => `- ${useCase}`),
      "",
      "Recommended Parts",
      ...guide.partRecommendations.flatMap((part) => [
        `${part.partType}: ${part.whatToBuy}`,
        `Benefit: ${part.benefit}`,
        `Best for: ${part.goodFor}`,
        ...part.compatibilityChecks.map((check) => `- ${check}`),
        ""
      ]),
      "Checklist",
      ...guide.checklist.map((item) => `- ${item}`),
      "",
      "Steps",
      ...guide.steps.flatMap((step, index) => [`${index + 1}. ${step.title} [${step.type}]`, step.content, ""]),
      "Safety Notes",
      ...guide.safetyNotes.map((item) => `- ${item}`)
    ].join("\n");

    const success = await copyToClipboard(content);

    if (!success) {
      return;
    }

    setCopiedAll(true);
    window.setTimeout(() => setCopiedAll(false), 1800);
  }

  async function handleCopyAllCommands() {
    if (!allCommandsText) return;
    const success = await copyToClipboard(allCommandsText);

    if (!success) {
      return;
    }

    setCopiedCommands(true);
    window.setTimeout(() => setCopiedCommands(false), 1600);
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
              {guide.category}
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
              {guide.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              {guide.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 print:hidden sm:justify-end">
            <button type="button" onClick={handleCopyAll} className="btn-secondary">
              {copiedAll ? "Copied Guide" : "Copy Guide"}
            </button>
            <button type="button" onClick={handlePrint} className="btn-primary">
              Download as PDF
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span
            className={cx(
              "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
              difficultyStyles(guide.difficulty)
            )}
          >
            Difficulty: {guide.difficulty}
          </span>
          <span
            className={cx(
              "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
              budgetStyles(guide.budgetBand)
            )}
          >
            Budget: {guide.budgetBand}
          </span>
          <span className="inline-flex items-center rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            Estimated Time: {guide.estimatedTime}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {guide.useCases.map((useCase) => (
            <span
              key={`${guide.slug}-${useCase}`}
              className="inline-flex items-center rounded-full border border-line/80 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              {useCase}
            </span>
          ))}
        </div>

        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 print:hidden">
          Note: "Download as PDF" uses browser print. Choose "Save as PDF" in the print dialog.
        </p>
      </section>

      <section className="surface-card p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950/70 print:shadow-none">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recommended Parts and Benefits</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Each recommendation includes what to buy, what benefit it gives, and the compatibility checks to run before purchase.
        </p>
        <div
          className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/70 px-4 py-3 text-sm dark:border-amber-900/60 dark:bg-amber-950/20"
          role="note"
          aria-label="Affiliate disclosure"
        >
          <p className="font-semibold text-amber-900 dark:text-amber-200">Affiliate Disclosure</p>
          <p className="mt-1 leading-7 text-amber-800 dark:text-amber-100">
            Some purchase links are affiliate links. If you buy through those links, this site may earn
            a commission at no extra cost to you. Part recommendations are still chosen by fit,
            compatibility, and reliability.
          </p>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {guide.partRecommendations.map((part) => {
            const purchaseLinks = getPurchaseLinksForPart(guide, part);

            return (
              <article
                key={`${guide.slug}-${part.partType}-${part.whatToBuy}`}
                className="rounded-2xl border border-line/70 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/70"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{part.partType}</h3>
                  <span className="inline-flex items-center rounded-full border border-line/70 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    Recommended
                  </span>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-100">{part.whatToBuy}</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{part.benefit}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Best for: {part.goodFor}</p>
                <ul className="mt-3 space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-200">
                  {part.compatibilityChecks.map((item) => (
                    <li key={item} className="list-disc leading-6">
                      {item}
                    </li>
                  ))}
                </ul>
                {purchaseLinks.length > 0 ? (
                  <>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {purchaseLinks.map((link) => (
                        <a
                          key={`${part.partType}-${part.whatToBuy}-${link.label}`}
                          href={link.url}
                          target="_blank"
                          rel={purchaseLinkRel(link)}
                          className={cx(
                            "inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                            link.type === "affiliate"
                              ? "border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200 dark:hover:border-amber-800 dark:hover:bg-amber-950/60"
                              : "border-line/80 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                          )}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                      {purchaseLinks.map((link) => `${link.label}: ${link.note}`).join(" • ")}
                    </p>
                  </>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="surface-card p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950/70 print:shadow-none">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Pre-Build Checklist</h2>
        <ul className="mt-4 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200 sm:text-base">
          {guide.checklist.map((item) => (
            <li key={item} className="list-disc leading-7">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="surface-card p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950/70 print:shadow-none">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Build Steps</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Expandable runbook sections</p>
        </div>
        <AccordionSteps steps={guide.steps} />
      </section>

      <section className="surface-card p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950/70 print:shadow-none">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Commands & Validation</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Use these commands for post-build validation and troubleshooting.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyAllCommands}
            className="btn-secondary"
            disabled={guide.commands.length === 0}
          >
            {copiedCommands ? "Copied Commands" : "Copy All Commands"}
          </button>
        </div>

        {guide.commands.length > 0 ? (
          <div className="space-y-4">
            {guide.commands.map((command) => (
              <CodeBlock
                key={`${guide.slug}-${command.title}`}
                title={command.title}
                shell={command.shell}
                content={command.content}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-line/80 bg-slate-50/70 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
            No command snippets were required for this guide.
          </div>
        )}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="surface-card p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950/70 print:shadow-none">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Safety Notes</h2>
          <ul className="mt-4 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200 sm:text-base">
            {guide.safetyNotes.map((item) => (
              <li key={item} className="list-disc leading-7">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="surface-card p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950/70 print:shadow-none">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Related Guides</h2>
          {relatedGuides.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {relatedGuides.map((related) => (
                <li key={related.slug}>
                  <Link
                    href={`/pc-build-guides/${related.slug}`}
                    className="block rounded-xl border border-line/70 bg-slate-50/60 px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700"
                  >
                    <span className="font-medium">{related.title}</span>
                    <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                      {related.category} • {related.difficulty}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">No related guides linked yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
