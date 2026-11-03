import type { Metadata } from "next";
import Link from "next/link";
import { EditorialStandardsStrip } from "@/components/shared/editorial-authority-panels";
import { KnowledgeBaseBrowser } from "@/components/support-portal/knowledge-base-browser";
import { getTopSeoKeywordOpportunities } from "@/lib/seo-content.registry";
import { getKBArticles } from "@/lib/support.kb.registry";
import {
  buildBreadcrumbJsonLd,
  buildKbIndexJsonLd,
  buildSupportKbIndexMetadataWithArticles,
  toAbsoluteSupportUrl
} from "@/lib/support-portal.seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildSupportKbIndexMetadataWithArticles(getKBArticles());
}

export default function KBPage() {
  const articles = getKBArticles();
  const keywordIntents = getTopSeoKeywordOpportunities(18);
  const groupedByCategory = [...new Set(articles.map((article) => article.category))]
    .sort((a, b) => a.localeCompare(b))
    .map((category) => ({
      category,
      articles: articles
        .filter((article) => article.category === category)
        .sort((a, b) => a.title.localeCompare(b.title))
    }));
  const kbIndexSchema = buildKbIndexJsonLd(articles);
  const keywordMapSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Popular enterprise IT support search intents",
    numberOfItems: keywordIntents.length,
    itemListElement: keywordIntents.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.keyword,
      url: toAbsoluteSupportUrl(`/support/tickets/?q=${encodeURIComponent(entry.keyword)}`)
    }))
  };
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Support Portal", path: "/support/" },
    { name: "Tickets", path: "/support/tickets/" }
  ]);

  return (
    <>
      <KnowledgeBaseBrowser articles={articles} />
      <section className="section-shell pb-10 pt-2 sm:pb-14">
        <div className="page-shell space-y-5">
          <EditorialStandardsStrip description="Support tickets are maintained as issue-specific reference pages. Each one is reviewed for enterprise-safe remediation, tested environment clarity, escalation guidance, and direct linkage to related fixes, guides, and downloads." />

          <section className="grid gap-4 lg:grid-cols-3">
            <article className="surface-card-interactive p-5 sm:p-6">
              <p className="eyebrow">Issue-First</p>
              <h2 className="mt-3 font-display text-xl font-semibold text-fg">Built for exact troubleshooting moments</h2>
              <p className="mt-3 text-sm leading-7 text-fg-secondary">
                Ticket pages are written around the actual issue someone is trying to resolve, whether that is a Microsoft 365 outage or a regulated Canix, Metrc, or Wurk workflow problem.
              </p>
            </article>

            <article className="surface-card-interactive p-5 sm:p-6">
              <p className="eyebrow">Enterprise-Safe</p>
              <h2 className="mt-3 font-display text-xl font-semibold text-fg">Escalation is part of the fix</h2>
              <p className="mt-3 text-sm leading-7 text-fg-secondary">
                Each page separates user-safe steps from admin-required actions and makes security, service desk, or compliance escalation explicit.
              </p>
            </article>

            <article className="surface-card-interactive p-5 sm:p-6">
              <p className="eyebrow">Connected Resources</p>
              <h2 className="mt-3 font-display text-xl font-semibold text-fg">Move directly into the next resource</h2>
              <p className="mt-3 text-sm leading-7 text-fg-secondary">
                Related downloads, templates, pillar guides, and adjacent fixes stay attached to each article so the workflow does not reset.
              </p>
            </article>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-fg">Popular Search Intents</h2>
            <p className="mt-2 text-sm text-fg-secondary">
              Jump directly into high-frequency enterprise troubleshooting problems.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {keywordIntents.map((entry) => (
                <Link
                  key={entry.keyword}
                  href={`/support/tickets/?q=${encodeURIComponent(entry.keyword)}`}
                  className="filter-chip justify-start rounded-xl px-3 py-2 text-sm"
                >
                  {entry.keyword}
                </Link>
              ))}
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-fg">
              Full Ticket Index by Category
            </h2>
            <p className="mt-2 text-sm text-fg-secondary">
              Plain category navigation for every support article in the library.
            </p>

            <div className="mt-4 space-y-3">
              {groupedByCategory.map((group, index) => (
                <details
                  key={group.category}
                  className="surface-card rounded-xl p-4"
                  open={index === 0}
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-fg">
                    {group.category} ({group.articles.length})
                  </summary>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {group.articles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/support/tickets/${article.slug}/`}
                        className="filter-chip justify-start rounded-lg px-3 py-2 text-sm"
                      >
                        {article.title}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(kbIndexSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(keywordMapSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
