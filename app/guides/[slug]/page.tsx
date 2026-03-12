import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RelatedContentSection } from "@/components/related-content-section";
import { getRelatedCorporateFixesForContext } from "@/lib/related-content";
import {
  getContentClusterBySlug,
  getKeywordOpportunitiesForPillar,
  getPillarContentBySlug,
  getPillarContentIdeas,
  getSuggestedDownloadAssetsForPillar,
  getSuggestedKBArticlesForPillar,
  type OpportunitySegment
} from "@/lib/seo-content.registry";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

const segmentLabels: Record<OpportunitySegment, string> = {
  "high-rpm": "High-RPM IT Troubleshooting",
  "long-tail-errors": "Long-Tail Error Messages",
  "affiliate-intent": "High-Intent Affiliate"
};

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

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getPillarContentIdeas().map((pillar) => ({ slug: pillar.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const pillar = getPillarContentBySlug(slug);

  if (!pillar) {
    return { title: "Guide Not Found" };
  }

  const opportunities = getKeywordOpportunitiesForPillar(pillar, 8);
  const keywordPool = uniqueKeywords([
    ...pillar.targetKeywords,
    ...pillar.relatedTerms,
    ...opportunities["high-rpm"].map((entry) => entry.keyword),
    ...opportunities["long-tail-errors"].map((entry) => entry.keyword),
    ...opportunities["affiliate-intent"].map((entry) => entry.keyword)
  ]);

  return {
    title: `${pillar.title} | IT Pillar Guide`,
    description: pillar.description,
    keywords: keywordPool,
    alternates: {
      canonical: `/guides/${pillar.slug}/`
    },
    openGraph: buildOpenGraph(
      `${pillar.title} | IT Pillar Guide`,
      pillar.description,
      `/guides/${pillar.slug}/`
    ),
    twitter: buildTwitter(`${pillar.title} | IT Pillar Guide`, pillar.description)
  };
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const pillar = getPillarContentBySlug(slug);

  if (!pillar) {
    notFound();
  }

  const cluster = getContentClusterBySlug(pillar.cluster);
  const relatedKBArticles = getSuggestedKBArticlesForPillar(pillar, 28);
  const relatedAssets = getSuggestedDownloadAssetsForPillar(pillar, 14);
  const relatedCorporateFixes = getRelatedCorporateFixesForContext(
    [pillar.title, pillar.description, ...pillar.targetKeywords, ...pillar.relatedTerms],
    4
  );
  const opportunities = getKeywordOpportunitiesForPillar(pillar, 12);

  const guideSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pillar.title,
    description: pillar.description,
    url: toAbsoluteUrl(`/guides/${pillar.slug}/`),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: relatedKBArticles.length,
      itemListElement: relatedKBArticles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "TechArticle",
          headline: article.title,
          url: toAbsoluteUrl(`/support/tickets/${article.slug}/`)
        }
      }))
    }
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "IT Pillar Guides", path: "/guides/" },
    { name: pillar.title, path: `/guides/${pillar.slug}/` }
  ]);

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell max-w-6xl space-y-6">
          <div>
            <Link
              href="/guides"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              ← Back to IT Pillar Guides
            </Link>
          </div>

          <section className="surface-card-strong p-6 sm:p-8">
            <p className="eyebrow">Pillar Guide</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
              {pillar.title}
            </h1>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              {pillar.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {cluster ? (
                <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Cluster: {cluster.title}
                </span>
              ) : null}
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {relatedKBArticles.length} linked tickets
              </span>
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {relatedAssets.length} related IT assets
              </span>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="surface-card p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Priority Target Keywords
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {pillar.targetKeywords.map((keyword) => (
                  <span
                    key={`${pillar.slug}-${keyword}`}
                    className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-100"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="surface-card p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Secondary Terms
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {pillar.relatedTerms.map((term) => (
                  <span
                    key={`${pillar.slug}-${term}`}
                    className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Linked Tickets</h2>
              <Link href="/support/tickets" className="text-sm font-semibold text-accent hover:underline">
                View all tickets
              </Link>
            </div>
            {relatedKBArticles.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {relatedKBArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/support/tickets/${article.slug}`}
                    className="rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      {article.category}
                    </p>
                    <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {article.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{article.estimatedTime}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300">No linked tickets found for this pillar yet.</p>
            )}
          </section>

          <section className="surface-card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Linked Download Assets</h2>
              <Link href="/downloads/assets" className="text-sm font-semibold text-accent hover:underline">
                View all assets
              </Link>
            </div>
            {relatedAssets.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {relatedAssets.map((asset) => (
                  <Link
                    key={asset.slug}
                    href={`/downloads/assets/${asset.slug}`}
                    className="rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      {asset.category} • {asset.format.toUpperCase()}
                    </p>
                    <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {asset.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {asset.access} • {asset.searchDemand} demand
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300">No linked assets found for this pillar yet.</p>
            )}
          </section>

          {relatedCorporateFixes.length > 0 ? (
            <RelatedContentSection
              title="Corporate Fixes Connected to This Guide"
              description="These enterprise-safe remediation pages reinforce the operational work covered by this pillar guide."
              groups={[
                {
                  title: "Related Corporate Fixes",
                  description: "Step-by-step support runbooks for adjacent incidents and recurring troubleshooting paths.",
                  href: "/corporate-tech-fixes/",
                  items: relatedCorporateFixes
                }
              ]}
            />
          ) : null}

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Opportunity Tables</h2>
            {(Object.keys(opportunities) as OpportunitySegment[]).map((segment) => {
              const entries = opportunities[segment];

              return (
                <article key={`${pillar.slug}-${segment}`} className="surface-card p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {segmentLabels[segment]}
                  </h3>
                  {entries.length > 0 ? (
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
                        <thead>
                          <tr className="border-b border-line/80 dark:border-slate-700">
                            <th className="px-2 py-2 font-semibold text-slate-700 dark:text-slate-200">Keyword</th>
                            <th className="px-2 py-2 font-semibold text-slate-700 dark:text-slate-200">Traffic</th>
                            <th className="px-2 py-2 font-semibold text-slate-700 dark:text-slate-200">Monetization</th>
                            <th className="px-2 py-2 font-semibold text-slate-700 dark:text-slate-200">Competition</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entries.map((entry) => (
                            <tr key={`${segment}-${entry.keyword}`} className="border-b border-line/60 dark:border-slate-800">
                              <td className="px-2 py-2 text-slate-800 dark:text-slate-100">{entry.keyword}</td>
                              <td className="px-2 py-2 text-slate-600 dark:text-slate-300">{entry.traffic}</td>
                              <td className="px-2 py-2 text-slate-600 dark:text-slate-300">{entry.monetization}</td>
                              <td className="px-2 py-2 text-slate-600 dark:text-slate-300">{entry.competition}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                      No matched opportunities for this segment yet.
                    </p>
                  )}
                </article>
              );
            })}
          </section>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
