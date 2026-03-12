"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { RelatedContentSection } from "@/components/related-content-section";
import type { KBArticle } from "@/types/support";
import type { KBRecommendedAffiliate } from "@/lib/affiliate-support.registry";
import type { RelatedContentGroup } from "@/lib/related-content";
import type { KBSeoAlignment, SeoKeywordArticleTarget } from "@/lib/seo-content.registry";
import { SupportPageHeader } from "@/components/support-portal/page-header";
import { AccordionSteps } from "@/components/support-portal/accordion-steps";
import { CodeBlock } from "@/components/support-portal/code-block";
import { TroubleshootingDecisionTree } from "@/components/support-portal/troubleshooting-decision-tree";
import { AccessLevelBadge, EnvironmentBadge, SeverityBadge } from "@/components/support-portal/badges";
import { getKBHelpfulVote, setKBHelpfulVote } from "@/lib/support-portal.storage";
import {
  getSupportAnalyticsStore,
  subscribeToAnalyticsEvents,
  trackKBArticleView,
  trackKBHelpfulVote
} from "@/lib/support-portal.analytics";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

interface HelpfulSummary {
  yes: number;
  no: number;
  ratio: number | null;
}

function keywordLabel(value: string): string {
  return value.replace(/"/g, "").trim();
}

function summarizeHelpfulVotesForSlug(slug: string): HelpfulSummary {
  const store = getSupportAnalyticsStore();
  let yes = 0;
  let no = 0;

  for (const event of store.events) {
    if (event.type !== "kb_helpful_vote") {
      continue;
    }

    if (String(event.payload.slug ?? "") !== slug) {
      continue;
    }

    const vote = String(event.payload.vote ?? "").toLowerCase();
    if (vote === "yes") yes += 1;
    if (vote === "no") no += 1;
  }

  const total = yes + no;
  return {
    yes,
    no,
    ratio: total > 0 ? yes / total : null
  };
}

export function KnowledgeBaseArticleView({
  article,
  relatedArticles,
  relatedContentGroups,
  recommendedAffiliates,
  keywordTargets,
  seoAlignment
}: {
  article: KBArticle;
  relatedArticles: KBArticle[];
  relatedContentGroups?: RelatedContentGroup[];
  recommendedAffiliates: KBRecommendedAffiliate[];
  keywordTargets: SeoKeywordArticleTarget[];
  seoAlignment?: KBSeoAlignment;
}) {
  const [helpfulVote, setHelpfulVote] = useState<"yes" | "no" | null>(null);
  const [helpfulSummary, setHelpfulSummary] = useState<HelpfulSummary>({
    yes: 0,
    no: 0,
    ratio: null
  });
  const [viewTracked, setViewTracked] = useState(false);

  useEffect(() => {
    setHelpfulVote(getKBHelpfulVote(article.slug));
    setHelpfulSummary(summarizeHelpfulVotesForSlug(article.slug));

    const unsubscribe = subscribeToAnalyticsEvents(() => {
      setHelpfulSummary(summarizeHelpfulVotesForSlug(article.slug));
    });

    return () => unsubscribe();
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
  const primaryKeyword =
    seoAlignment?.primaryKeyword ??
    (keywordTargets.length > 0 ? keywordLabel(keywordTargets[0].keyword) : null);
  const resolutionHeading = primaryKeyword
    ? `How to Fix: ${primaryKeyword}`
    : "How to Fix This Issue";
  const symptomsHeading = primaryKeyword
    ? `Symptoms of ${primaryKeyword}`
    : "Symptoms";
  const causesHeading = primaryKeyword
    ? `Likely Causes of ${primaryKeyword}`
    : "Likely Causes";

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
    setHelpfulSummary(summarizeHelpfulVotesForSlug(article.slug));
  }

  const helpfulTotalVotes = helpfulSummary.yes + helpfulSummary.no;
  const helpfulRatioText =
    helpfulSummary.ratio === null
      ? "No ratings yet"
      : `${Math.round(helpfulSummary.ratio * 100)}% helpful`;

  return (
    <div className="space-y-5">
      <SupportPageHeader
        title={article.title}
        description={seoAlignment?.optimizedLeadParagraph ?? article.description}
        breadcrumbs={[
          { label: "Support Portal", href: "/support" },
          { label: "Tickets", href: "/support/tickets" },
          { label: article.title }
        ]}
        actions={
          <div className="rounded-xl border border-line/70 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/70">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Estimated time</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{article.estimatedTime}</p>
          </div>
        }
      />

      {seoAlignment ? (
        <section className="rounded-2xl border border-cyan-200/70 bg-cyan-50/70 p-5 shadow-soft dark:border-cyan-900/60 dark:bg-cyan-950/25 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-700 dark:text-cyan-200">
            Editorial Intro (SEO-Aligned)
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200 sm:text-base">
            {seoAlignment.editorialIntro}
          </p>
        </section>
      ) : null}

      <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <SeverityBadge severity={article.severity} />
          <AccessLevelBadge accessLevel={article.accessLevel} />
          <EnvironmentBadge environment={article.environment} />
          <span className="inline-flex items-center rounded-full border border-line/70 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {article.productFamily} • {article.product}
          </span>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl border border-line/70 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              Author & Verification
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {article.author.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{article.author.title}</p>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
              Last verified: {article.lastVerified}
            </p>
            {article.author.bio ? (
              <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300">
                {article.author.bio}
              </p>
            ) : null}
            <div className="mt-2 flex flex-wrap gap-2">
              {article.testedOn.map((environment) => (
                <span
                  key={`${article.slug}-${environment}`}
                  className="inline-flex items-center rounded-full border border-line/70 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  Tested on {environment}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line/70 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              Trust Signals
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {helpfulRatioText}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {helpfulTotalVotes} total helpfulness vote{helpfulTotalVotes === 1 ? "" : "s"}
            </p>
            <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
              {article.author.credentials.slice(0, 3).map((credential) => (
                <li key={`${article.slug}-${credential}`} className="leading-6">
                  • {credential}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-line/70 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{symptomsHeading}</h2>
            <ul className="mt-3 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
              {article.symptoms.map((item) => (
                <li key={item} className="list-disc leading-7">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line/70 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{causesHeading}</h2>
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

      <TroubleshootingDecisionTree symptoms={article.symptoms} accessLevel={article.accessLevel} />

      <section id="resolution-steps" className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{resolutionHeading}</h2>
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
        </div>

        <div className="space-y-5">
          {recommendedAffiliates.length > 0 ? (
            <div className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Recommended Partners for This Topic
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Selected from your affiliate registry based on this article&apos;s category, product family,
                and tags.
              </p>
              <ul className="mt-3 space-y-2">
                {recommendedAffiliates.map((entry) => (
                  <li key={`${article.slug}-${entry.affiliate.key}`}>
                    <div className="rounded-xl border border-line/70 bg-slate-50/60 px-3 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{entry.affiliate.label}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {entry.affiliate.program} • {entry.affiliate.network}
                          </p>
                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            {entry.affiliate.description}
                          </p>
                        </div>
                        <span
                          className={cx(
                            "inline-flex shrink-0 items-center rounded-full border px-2 py-1 text-[11px] font-semibold",
                            entry.affiliate.status === "Active"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200"
                              : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"
                          )}
                        >
                          {entry.affiliate.status}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href={entry.affiliate.url}
                          target="_blank"
                          rel={
                            entry.affiliate.status === "Active"
                              ? "sponsored nofollow noreferrer"
                              : "nofollow noreferrer"
                          }
                          className="btn-secondary !px-3 !py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                        >
                          Open partner link
                        </a>
                        <Link
                          href={`/support/tickets/${entry.supportDocSlug}`}
                          className="btn-secondary !px-3 !py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                        >
                          Open support playbook
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Disclosure: Active partner links may generate commission with no additional user cost.
              </p>
            </div>
          ) : null}

          {keywordTargets.length > 0 ? (
            <div className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Related Exact-Match Queries
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Internal fix guides aligned to high-intent search phrases.
              </p>
              <ul className="mt-3 space-y-2">
                {keywordTargets.map((target) => {
                  const isSameArticle = target.articleSlug === article.slug;
                  return (
                    <li key={`${article.slug}-${target.keyword}`}>
                      <Link
                        href={
                          isSameArticle
                            ? `/support/tickets/?q=${encodeURIComponent(target.keyword)}`
                            : `/support/tickets/${target.articleSlug}/`
                        }
                        className="block rounded-xl border border-line/70 bg-slate-50/60 px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700"
                      >
                        <span className="font-medium">{keywordLabel(target.keyword)}</span>
                        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                          {isSameArticle
                            ? "Open exact-match query results"
                            : `Related guide: ${target.articleTitle}`}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {relatedContentGroups && relatedContentGroups.length > 0 ? (
            <RelatedContentSection
              title="Broader Resources for This Issue"
              description="Use these internal links to move from the immediate fix into related guides, supporting downloads, and adjacent enterprise support documentation."
              groups={relatedContentGroups}
            />
          ) : null}

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
                      href={`/support/tickets/${related.slug}`}
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
