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
import { getQuickStartGuides } from "@/src/content/editorial/quick-start-guides";

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
    "Pillar guides and quick-start setup guides for enterprise IT and regulated operations: Microsoft 365, endpoint management, identity security, PowerShell automation, IT operations, and New York cannabis workflows.";

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
      "canix quick start guide",
      "metrc quick start guide",
      "wurk quick start guide",
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
  const quickStartGuides = getQuickStartGuides();
  const topKeywords = getTopSeoKeywordOpportunities(24);

  const collectionSchema = buildCollectionPageJsonLd(
    "IT Pillar Guides",
    "Enterprise IT pillar guides, regulated-operations quick starts, and supporting cluster content.",
    "/guides/",
    [
      ...pillars.map((pillar) => ({
        name: pillar.title,
        path: `/guides/${pillar.slug}/`
      })),
      ...quickStartGuides.map((guide) => ({
        name: guide.title,
        path: `/guides/quick-start/${guide.slug}/`
      }))
    ]
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
            <p className="eyebrow">Guides Library</p>
            <h1 className="mt-4 font-display text-3xl font-semibold text-fg sm:text-4xl">
              IT Pillar Guides and Quick Start Setups
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-fg-secondary sm:text-base">
              Structured hubs for deeper troubleshooting and short onboarding guides for faster setup. Use pillar pages for broad topic coverage and quick starts for basic operator-ready setup flows.
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

          <section className="space-y-3">
            <div>
              <p className="eyebrow">Quick Start Guides</p>
              <h2 className="mt-3 font-display text-xl font-semibold text-fg">Basic setup paths for new platforms and workflows</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-fg-secondary">
                These shorter guides are for teams who need the first safe setup path before they move into deeper troubleshooting. They are intentionally practical, source-linked, and escalation-aware.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {quickStartGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/quick-start/${guide.slug}/`}
                  className="surface-card-strong p-5 transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-card dark:hover:border-primary-400/30"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    {guide.product}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-fg">
                    {guide.title}
                  </h3>
                  <p className="mt-2 text-sm text-fg-secondary">{guide.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="filter-chip px-2.5 py-1 font-semibold">
                      {guide.estimatedTime}
                    </span>
                    <span className="filter-chip px-2.5 py-1 font-semibold">
                      {guide.relatedTicketSlugs.length} linked tickets
                    </span>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-primary-600 dark:text-primary-300">Open quick start →</p>
                </Link>
              ))}
            </div>
          </section>

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
