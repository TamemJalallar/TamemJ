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

  const description =
    "Pillar guides and SEO content clusters for enterprise IT troubleshooting: Microsoft 365, endpoint management, identity security, PowerShell automation, and IT operations.";

  return {
    title: "IT Pillar Guides",
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
    openGraph: buildOpenGraph("IT Pillar Guides | Tamem J", description, "/guides/"),
    twitter: buildTwitter("IT Pillar Guides | Tamem J", description)
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

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell space-y-6">
          <div className="hero-surface p-6 sm:p-8">
            <p className="eyebrow">SEO Growth Architecture</p>
            <h1 className="mt-4 font-display text-3xl font-semibold text-fg sm:text-4xl">
              IT Pillar Guides and Content Clusters
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-fg-secondary sm:text-base">
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
            </div>
          </div>

          <section className="surface-card p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-fg">Content Clusters</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {clusters.map((cluster) => {
                const clusterPillarCount = pillars.filter((pillar) => pillar.cluster === cluster.slug).length;

                return (
                  <article
                    key={cluster.slug}
                    className="surface-card rounded-2xl p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {clusterPillarCount} pillar pages
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-fg">
                      {cluster.title}
                    </h3>
                    <p className="mt-2 text-sm text-fg-secondary">{cluster.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {cluster.focusAreas.map((item) => (
                        <span
                          key={`${cluster.slug}-${item}`}
                          className="filter-chip px-2 py-0.5 text-[11px]"
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
            <h2 className="font-display text-xl font-semibold text-fg">Pillar Pages</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {pillars.map((pillar) => {
                const kbCount = getSuggestedKBArticlesForPillar(pillar, 999).length;
                const assetCount = getSuggestedDownloadAssetsForPillar(pillar, 999).length;
                const cluster = clusters.find((entry) => entry.slug === pillar.cluster);

                return (
                  <Link
                    key={pillar.slug}
                    href={`/guides/${pillar.slug}`}
                    className="surface-card-strong p-5 transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-card dark:hover:border-primary-400/30"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {cluster?.title}
                    </p>
                    <h3 className="mt-2 font-display text-lg font-semibold text-fg">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm text-fg-secondary">{pillar.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="filter-chip px-2.5 py-1 font-semibold">
                        {kbCount} related tickets
                      </span>
                      <span className="filter-chip px-2.5 py-1 font-semibold">
                        {assetCount} related assets
                      </span>
                    </div>
                    <p className="mt-3 text-xs font-semibold text-primary-600 dark:text-primary-300">Open pillar guide →</p>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold text-fg">
              Top Cross-Cluster Keyword Opportunities
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {topKeywords.map((entry) => (
                <div
                  key={entry.keyword}
                  className="surface-card rounded-xl px-3 py-2 text-sm"
                >
                  <p className="font-medium text-fg">{entry.keyword}</p>
                  <p className="mt-1 text-xs text-muted">
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(keywordListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
