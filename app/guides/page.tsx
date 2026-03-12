import type { Metadata } from "next";
import Link from "next/link";
import {
  getContentClusters,
  getPillarContentIdeas,
  getSuggestedDownloadAssetsForPillar,
  getSuggestedKBArticlesForPillar,
  getTopSeoKeywordOpportunities
} from "@/lib/seo-content.registry";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildOpenGraph,
  buildTwitter,
  toAbsoluteUrl
} from "@/lib/seo";

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

export async function generateMetadata(): Promise<Metadata> {
  const topKeywords = getTopSeoKeywordOpportunities(50).map((entry) => entry.keyword);
  const pillars = getPillarContentIdeas();
  const clusters = getContentClusters();
  const description =
    `Pillar guides and SEO content clusters for enterprise IT troubleshooting across ${pillars.length} pillar pages and ${clusters.length} core clusters: Microsoft 365, endpoint management, identity security, PowerShell automation, and IT operations.`;

  return {
    title: "Enterprise IT Pillar Guides",
    description,
    keywords: uniqueKeywords([
      "enterprise it troubleshooting guide",
      "microsoft 365 troubleshooting hub",
      "intune troubleshooting guide",
      "powerShell admin scripts",
      "identity and access troubleshooting",
      "vpn network troubleshooting guide",
      "it operations runbook",
      ...topKeywords
    ]),
    alternates: {
      canonical: "/guides/"
    },
    openGraph: buildOpenGraph("Enterprise IT Pillar Guides | Tamem J", description, "/guides/"),
    twitter: buildTwitter("Enterprise IT Pillar Guides | Tamem J", description)
  };
}

export default function GuidesPage() {
  const clusters = getContentClusters();
  const pillars = getPillarContentIdeas();
  const topKeywords = getTopSeoKeywordOpportunities(24);

  const collectionSchema = buildCollectionPageJsonLd(
    "IT Pillar Guides",
    "Enterprise IT pillar guides and supporting cluster content.",
    "/guides/",
    pillars.map((pillar) => ({
      name: pillar.title,
      path: `/guides/${pillar.slug}/`
    }))
  );

  const keywordListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top IT Troubleshooting Keyword Opportunities",
    numberOfItems: topKeywords.length,
    itemListElement: topKeywords.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.keyword
    }))
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "IT Pillar Guides", path: "/guides/" }
  ]);
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Enterprise IT Pillar Guides",
    url: toAbsoluteUrl("/guides/"),
    description:
      "Pillar guides and content clusters for Microsoft 365, endpoint management, identity, PowerShell automation, and IT operations.",
    inLanguage: "en-US",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: pillars.length,
      itemListElement: pillars.map((pillar, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: pillar.title,
        url: toAbsoluteUrl(`/guides/${pillar.slug}/`)
      }))
    }
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are pillar guides on this site?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pillar guides are long-form hub pages that organize related troubleshooting tickets, downloads, and search topics into a focused knowledge cluster."
        }
      },
      {
        "@type": "Question",
        name: "Which topics do the pillar guides cover?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The guides cover Microsoft 365, endpoint management, identity and security, PowerShell automation, networking, SharePoint, and IT operations workflows."
        }
      }
    ]
  };

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell space-y-6">
          <div className="surface-card-strong p-6 sm:p-8">
            <p className="eyebrow">SEO Growth Architecture</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
              IT Pillar Guides and Content Clusters
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              Structured hubs for high-intent enterprise IT search demand. Each pillar links to related
              troubleshooting tickets, download assets, and monetization-aligned keyword opportunities.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/support/tickets" className="btn-secondary">
                Open Tickets
              </Link>
              <Link href="/downloads/assets" className="btn-secondary">
                Open IT Assets
              </Link>
              <Link href="/guides/revenue-scaling-roadmap" className="btn-secondary">
                Open Revenue Roadmap
              </Link>
            </div>
          </div>

          <section className="surface-card p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Business Guide
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Revenue Scaling Roadmap (0-24 Months)
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Phase-based execution plan for traffic growth, affiliate monetization, digital products,
                  and SaaS productization.
                </p>
              </div>
              <Link href="/guides/revenue-scaling-roadmap" className="btn-secondary">
                View Roadmap
              </Link>
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Content Clusters</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {clusters.map((cluster) => {
                const clusterPillarCount = pillars.filter((pillar) => pillar.cluster === cluster.slug).length;

                return (
                  <article
                    key={cluster.slug}
                    className="rounded-2xl border border-line/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      {clusterPillarCount} pillar pages
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      {cluster.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{cluster.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {cluster.focusAreas.map((item) => (
                        <span
                          key={`${cluster.slug}-${item}`}
                          className="rounded-full border border-line/80 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Pillar Pages</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {pillars.map((pillar) => {
                const kbCount = getSuggestedKBArticlesForPillar(pillar, 999).length;
                const assetCount = getSuggestedDownloadAssetsForPillar(pillar, 999).length;
                const cluster = clusters.find((entry) => entry.slug === pillar.cluster);

                return (
                  <Link
                    key={pillar.slug}
                    href={`/guides/${pillar.slug}`}
                    className="surface-card-strong p-5 transition hover:-translate-y-0.5 hover:shadow-card"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      {cluster?.title}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{pillar.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {kbCount} related tickets
                      </span>
                      <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {assetCount} related assets
                      </span>
                    </div>
                    <p className="mt-3 text-xs font-semibold text-accent">Open pillar guide →</p>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Top Cross-Cluster Keyword Opportunities
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {topKeywords.map((entry) => (
                <div
                  key={entry.keyword}
                  className="rounded-xl border border-line/80 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <p className="font-medium text-slate-900 dark:text-slate-100">{entry.keyword}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Traffic {entry.traffic} • Monetization {entry.monetization} • Competition {entry.competition}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(keywordListSchema) }}
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
