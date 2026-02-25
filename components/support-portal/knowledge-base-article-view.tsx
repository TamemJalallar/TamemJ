"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { KBArticle } from "@/types/support";
import { SupportPageHeader } from "@/components/support-portal/page-header";
import { AccordionSteps } from "@/components/support-portal/accordion-steps";
import { CodeBlock } from "@/components/support-portal/code-block";
import { AccessLevelBadge, EnvironmentBadge, SeverityBadge } from "@/components/support-portal/badges";
import { getKBHelpfulVote, setKBHelpfulVote } from "@/lib/support-portal.storage";
import { trackKBArticleView, trackKBHelpfulVote } from "@/lib/support-portal.analytics";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function KnowledgeBaseArticleView({
  article,
  relatedArticles
}: {
  article: KBArticle;
  relatedArticles: KBArticle[];
}) {
  const [helpfulVote, setHelpfulVote] = useState<"yes" | "no" | null>(null);
  const [viewTracked, setViewTracked] = useState(false);

  useEffect(() => {
    setHelpfulVote(getKBHelpfulVote(article.slug));
  }, [article.slug]);

  useEffect(() => {
    if (viewTracked) return;
    trackKBArticleView({
      slug: article.slug,
      title: article.title,
      category: article.category,
      product: article.product,
      productFamily: article.productFamily
    });
    setViewTracked(true);
  }, [article, viewTracked]);

  const commandCount = article.commands.length;

  const allCommandsText = useMemo(() => {
    return article.commands
      .map((command) => `${command.title} (${command.shell})\n${command.content}`)
      .join("\n\n");
  }, [article.commands]);

  async function handleCopyAllCommands() {
    if (!navigator.clipboard?.writeText || !allCommandsText) return;
    try {
      await navigator.clipboard.writeText(allCommandsText);
    } catch {
      // noop
    }
  }

  function handleHelpfulVote(nextVote: "yes" | "no") {
    setKBHelpfulVote(article.slug, nextVote);
    setHelpfulVote(nextVote);
    trackKBHelpfulVote({ slug: article.slug, title: article.title, vote: nextVote });
  }

  return (
    <div className="space-y-5">
      <SupportPageHeader
        title={article.title}
        description={article.description}
        breadcrumbs={[
          { label: "Support Portal", href: "/support" },
          { label: "Knowledge Base", href: "/support/kb" },
          { label: article.title }
        ]}
        actions={
          <div className="rounded-xl border border-line/70 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/70">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Estimated time</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{article.estimatedTime}</p>
          </div>
        }
      />

      <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <SeverityBadge severity={article.severity} />
          <AccessLevelBadge accessLevel={article.accessLevel} />
          <EnvironmentBadge environment={article.environment} />
          <span className="inline-flex items-center rounded-full border border-line/70 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {article.productFamily} • {article.product}
          </span>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-line/70 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Symptoms</h2>
            <ul className="mt-3 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
              {article.symptoms.map((item) => (
                <li key={item} className="list-disc leading-7">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line/70 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Likely Causes</h2>
            <ul className="mt-3 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
              {article.causes.map((item) => (
                <li key={item} className="list-disc leading-7">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Resolution Steps</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Accordion runbook sections</p>
        </div>
        <AccordionSteps steps={article.resolutionSteps} />
      </section>

      <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Commands</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Copyable diagnostic or remediation commands ({commandCount} snippet{commandCount === 1 ? "" : "s"}).
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyAllCommands}
            className="btn-secondary"
            disabled={article.commands.length === 0}
          >
            Copy All Commands
          </button>
        </div>
        <div className="space-y-4">
          {article.commands.map((command) => (
            <CodeBlock
              key={`${article.slug}-${command.title}`}
              title={command.title}
              shell={command.shell}
              content={command.content}
              requiresAdmin={command.requiresAdmin}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">When to Contact IT / Security</h2>
          <ul className="mt-4 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200 sm:text-base">
            {article.escalationCriteria.map((item) => (
              <li key={item} className="list-disc leading-7">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-line/70 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Was this helpful?</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Your response is stored locally in this browser for demo analytics.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleHelpfulVote("yes")}
                className={cx(
                  "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                  helpfulVote === "yes"
                    ? "border-emerald-500 bg-emerald-600 text-white"
                    : "border-line/80 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                )}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => handleHelpfulVote("no")}
                className={cx(
                  "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                  helpfulVote === "no"
                    ? "border-rose-500 bg-rose-600 text-white"
                    : "border-line/80 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                )}
              >
                No
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Related Articles</h2>
            {relatedArticles.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {relatedArticles.map((related) => (
                  <li key={related.slug}>
                    <Link
                      href={`/support/kb/${related.slug}`}
                      className="block rounded-xl border border-line/70 bg-slate-50/60 px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700"
                    >
                      <span className="font-medium">{related.title}</span>
                      <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{related.product}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">No related articles linked yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
