import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FixGuide } from "@/components/corporate-fixes/fix-guide";
import { EnterpriseSupportBanner } from "@/components/corporate-fixes/fix-shared";
import { AdSenseSlot } from "@/components/monetization/adsense-slot";
import { SupportSiteCard } from "@/components/monetization/support-site-card";
import { ResourceLinkGrid } from "@/components/shared/resource-link-grid";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import { getCorporateFixBySlug, getCorporateFixes } from "@/lib/corporate-fixes.registry";
import {
  getRelatedAssetsForFix,
  getRelatedCorporateFixes,
  getRelatedDownloadsForFix,
  getRelatedPillarsForTerms,
  getRelatedSupportArticlesForFix
} from "@/lib/detail-page-related";
import { getTopKeywordArticleTargets } from "@/lib/seo-content.registry";
import { supportAuthorProfile } from "@/lib/site";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";
import { getAdSenseSlot, getMonetizationRecommendations, monetizationConfig } from "@/lib/monetization";

interface CorporateFixPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

function uniqueKeywords(keywords: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const keyword of keywords) {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(keyword.trim());
  }

  return result;
}

function normalizeKeyword(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function keywordMatchScore(haystack: string, keyword: string): number {
  const normalizedKeyword = normalizeKeyword(keyword);
  if (!normalizedKeyword) return 0;

  let score = haystack.includes(normalizedKeyword) ? 8 : 0;
  const tokens = normalizedKeyword.split(" ").filter((token) => token.length >= 3);

  let tokenHits = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) {
      tokenHits += 1;
      score += 1;
    }
  }

  if (tokens.length > 1 && tokenHits === tokens.length) {
    score += 2;
  }

  return score;
}

function toIsoDurationFromEstimatedTime(value: string): string | undefined {
  const matches = value.match(/\d+/g);
  if (!matches || matches.length === 0) {
    return undefined;
  }

  const first = Number(matches[0]);
  if (!Number.isFinite(first) || first <= 0) {
    return undefined;
  }

  const second = matches.length > 1 ? Number(matches[1]) : first;
  const minutes = Number.isFinite(second) && second > 0 ? Math.round((first + second) / 2) : first;

  return `PT${minutes}M`;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getCorporateFixes().map((fix) => ({ slug: fix.slug }));
}

export async function generateMetadata({
  params
}: CorporateFixPageProps): Promise<Metadata> {
  const { slug } = await params;
  const fix = getCorporateFixBySlug(slug);

  if (!fix) {
    return {
      title: "Fix Not Found"
    };
  }

  const authorName = fix.author?.name ?? supportAuthorProfile.name;
  const testedOnMeta =
    fix.testedOn && fix.testedOn.length > 0
      ? fix.testedOn.join(", ")
      : "Windows 11 23H2, macOS Sequoia 15";
  const fixSeoHaystack = normalizeKeyword(
    [fix.title, fix.description, fix.category, fix.tags.join(" "), fix.steps.map((step) => step.content).join(" ")]
      .join(" ")
  );
  const exactMatchKeywords = getTopKeywordArticleTargets(80)
    .map((target) => ({
      keyword: target.keyword,
      score: keywordMatchScore(fixSeoHaystack, target.keyword)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.keyword.localeCompare(b.keyword))
    .slice(0, 10)
    .map((entry) => entry.keyword);

  const description = `${fix.description} Severity: ${fix.severity}. Access level: ${fix.accessLevel}. Estimated fix time: ${fix.estimatedTime}.`;

  return {
    title: `${fix.title} | Corporate Tech Fixes`,
    description,
    authors: [{ name: authorName }],
    keywords: uniqueKeywords([
      ...fix.tags,
      fix.category,
      fix.title,
      `${fix.category} troubleshooting`,
      `${fix.accessLevel} IT guide`,
      `severity ${fix.severity}`,
      "corporate IT support",
      "enterprise troubleshooting",
      "it help desk runbook",
      ...exactMatchKeywords
    ]),
    alternates: {
      canonical: `/corporate-tech-fixes/${fix.slug}/`
    },
    robots: buildRobotsIndexRule(`/corporate-tech-fixes/${fix.slug}/`),
    openGraph: buildOpenGraph(
      `${fix.title} | Corporate Tech Fixes`,
      description,
      `/corporate-tech-fixes/${fix.slug}/`,
      "article"
    ),
    twitter: buildTwitter(`${fix.title} | Corporate Tech Fixes`, description),
    other: {
      "support:severity": fix.severity,
      "support:access-level": fix.accessLevel,
      "support:estimated-time": fix.estimatedTime,
      "support:last-verified": fix.lastVerified ?? "March 3, 2026",
      "support:tested-on": testedOnMeta
    }
  };
}

export default async function CorporateFixDetailPage({ params }: CorporateFixPageProps) {
  const { slug } = await params;
  const fix = getCorporateFixBySlug(slug);

  if (!fix) {
    notFound();
  }

  const author = fix.author ?? {
    name: supportAuthorProfile.name,
    title: supportAuthorProfile.title,
    credentials: [...supportAuthorProfile.credentials]
  };
  const lastVerified = fix.lastVerified ?? "March 3, 2026";
  const parsedLastVerified = Date.parse(lastVerified);
  const isoLastVerified = Number.isNaN(parsedLastVerified)
    ? undefined
    : new Date(parsedLastVerified).toISOString();
  const testedOn = fix.testedOn && fix.testedOn.length > 0
    ? fix.testedOn
    : ["Windows 11 23H2", "macOS Sequoia 15"];
  const totalHowToDuration = toIsoDurationFromEstimatedTime(fix.estimatedTime);
  const fixSearchHaystack = normalizeKeyword(
    [fix.title, fix.description, fix.category, fix.tags.join(" "), fix.steps.map((step) => step.content).join(" ")]
      .join(" ")
  );
  const exactQueryTargets = getTopKeywordArticleTargets(80)
    .map((target) => ({
      ...target,
      relevanceScore: keywordMatchScore(fixSearchHaystack, target.keyword)
    }))
    .filter((target) => target.relevanceScore > 0)
    .sort(
      (a, b) =>
        b.relevanceScore - a.relevanceScore ||
        a.keyword.localeCompare(b.keyword)
    )
    .slice(0, 8);
  const relatedSupportArticles = getRelatedSupportArticlesForFix(fix, 2);
  const relatedDownloads = getRelatedDownloadsForFix(fix, 2);
  const relatedAssets = getRelatedAssetsForFix(fix, 2);
  const relatedFixes = getRelatedCorporateFixes(fix, 2);
  const relatedPillars = getRelatedPillarsForTerms(
    [fix.title, fix.description, fix.category, ...fix.tags, ...fix.steps.map((step) => step.title)],
    2
  );
  const fixPartnerLinks = getMonetizationRecommendations("corporate-fixes");
  const inArticleAdSlot = getAdSenseSlot("inArticle");
  const resourceLinks = [
    ...relatedSupportArticles.map((article) => ({
      href: `/support/tickets/${article.slug}/`,
      eyebrow: "Support Ticket",
      title: article.title,
      description: article.description,
      meta: `${article.productFamily} • ${article.environment}`
    })),
    ...relatedDownloads.map((entry) => ({
      href: `/downloads/${entry.slug}/`,
      eyebrow: "Software Download",
      title: entry.name,
      description: entry.summary,
      meta: `${entry.category} • ${entry.platforms.join(", ")}`
    })),
    ...relatedAssets.map((asset) => ({
      href: `/downloads/assets/${asset.slug}/`,
      eyebrow: "IT Asset",
      title: asset.title,
      description: asset.description,
      meta: `${asset.category} • ${asset.format.toUpperCase()}`
    })),
    ...relatedFixes.map((entry) => ({
      href: `/corporate-tech-fixes/${entry.slug}/`,
      eyebrow: "Related Fix",
      title: entry.title,
      description: entry.description,
      meta: `${entry.category} • ${entry.estimatedTime}`
    })),
    ...relatedPillars.map((pillar) => ({
      href: `/guides/${pillar.slug}/`,
      eyebrow: "Pillar Guide",
      title: pillar.title,
      description: pillar.description,
      meta: pillar.targetKeywords.slice(0, 2).join(" • ")
    }))
  ].filter((item, index, array) => array.findIndex((candidate) => candidate.href === item.href) === index).slice(0, 6);

  const fixArticleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: fix.title,
    description: fix.description,
    articleSection: fix.category,
    keywords: fix.tags.join(", "),
    timeRequired: fix.estimatedTime,
    url: toAbsoluteUrl(`/corporate-tech-fixes/${fix.slug}/`),
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: author.name,
      jobTitle: author.title
    },
    dateModified: isoLastVerified,
    datePublished: isoLastVerified,
    mentions: testedOn.map((entry) => ({
      "@type": "Thing",
      name: entry
    })),
    audience: {
      "@type": "Audience",
      audienceType: "Enterprise IT support and help desk analysts"
    },
    mainEntityOfPage: toAbsoluteUrl(`/corporate-tech-fixes/${fix.slug}/`),
    publisher: {
      "@type": "Organization",
      name: supportAuthorProfile.name,
      url: toAbsoluteUrl("/")
    }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: fix.title,
    description: fix.description,
    url: toAbsoluteUrl(`/corporate-tech-fixes/${fix.slug}/`),
    ...(totalHowToDuration ? { totalTime: totalHowToDuration } : {}),
    step: fix.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.content,
      url: toAbsoluteUrl(`/corporate-tech-fixes/${fix.slug}/#step-${index + 1}`)
    }))
  };

  const escalationStep = fix.steps.find((step) => step.type === "warning");
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the first safe action for ${fix.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            fix.steps[0]?.content ??
            "Confirm impact and collect exact symptoms before applying any remediation."
        }
      },
      {
        "@type": "Question",
        name: `Does ${fix.title} require administrator access?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            fix.accessLevel === "Admin Required"
              ? "This runbook includes steps that require administrator access and should be handled by IT support."
              : "This runbook is user-safe for initial troubleshooting. Escalate if policy or security controls are involved."
        }
      },
      {
        "@type": "Question",
        name: "When should this issue be escalated?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            escalationStep?.content ??
            "Escalate when user-safe remediation does not resolve the issue or when policy/security controls are involved."
        }
      }
    ]
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Corporate Tech Fixes", path: "/corporate-tech-fixes/" },
    { name: fix.title, path: `/corporate-tech-fixes/${fix.slug}/` }
  ]);
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: fix.title,
    url: toAbsoluteUrl(`/corporate-tech-fixes/${fix.slug}/`),
    description: fix.description,
    ...(isoLastVerified ? { dateModified: isoLastVerified } : {}),
    isPartOf: {
      "@type": "CollectionPage",
      name: "Corporate Tech Fixes",
      url: toAbsoluteUrl("/corporate-tech-fixes/")
    }
  };

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell max-w-5xl">
          <div className="mb-5 print:hidden">
            <Link
              href="/corporate-tech-fixes"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              ← Back to Corporate Tech Fixes
            </Link>
          </div>

          <EnterpriseSupportBanner className="mb-5" />
          <FixGuide fix={fix} />

          <div className="mt-6 grid gap-4 print:hidden xl:grid-cols-[1fr_0.45fr]">
            <SupportSiteCard
              title="Support more enterprise-safe fixes"
              description="This runbook stays free through optional partner recommendations, light ad placements, and direct support. The fix steps remain the priority."
              affiliateLinks={fixPartnerLinks}
              compact
            />
            <AdSenseSlot
              client={monetizationConfig.adsenseClient}
              slot={inArticleAdSlot}
              label="Advertisement"
              format="fluid"
              layout="in-article"
            />
          </div>

          {exactQueryTargets.length > 0 ? (
            <section className="mt-6 surface-card p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Related Search Queries
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Other common ways people describe this issue when they are searching or escalating it.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {exactQueryTargets.map((target) => (
                  <article
                    key={`${fix.slug}-${target.keyword}`}
                    className="rounded-xl border border-line/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {target.keyword.replace(/"/g, "")}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {target.segment} • {target.articleCategory}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link href={`/support/tickets/${target.articleSlug}/`} className="btn-secondary !px-3 !py-1.5 text-xs">
                        Open related guide
                      </Link>
                      <Link
                        href={`/support/tickets/?q=${encodeURIComponent(target.keyword)}`}
                        className="btn-secondary !px-3 !py-1.5 text-xs"
                      >
                        Search exact query
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <div id="related-fix-resources" className="mt-6">
            <ResourceLinkGrid
              title="Keep Moving With Related Resources"
              description="Use adjacent downloads, support articles, and pillar guides to turn a single fix into a complete response path."
              items={resourceLinks}
            />
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(fixArticleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
