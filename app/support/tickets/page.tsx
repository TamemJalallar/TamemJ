import type { Metadata } from "next";
import Link from "next/link";
import { EditorialStandardsStrip } from "@/components/shared/editorial-authority-panels";
import { KnowledgeBaseBrowser } from "@/components/support-portal/knowledge-base-browser";
import { getTopKBSeoAlignments, getTopSeoKeywordOpportunities } from "@/lib/seo-content.registry";
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
  const seoAlignments = getTopKBSeoAlignments(50);
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
    name: "Top IT troubleshooting pages with assigned exact-match target keywords",
    numberOfItems: seoAlignments.length,
    itemListElement: seoAlignments.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.primaryKeyword,
      url: toAbsoluteSupportUrl(`/support/tickets/${entry.articleSlug}/`),
      item: {
        "@type": "TechArticle",
        headline: entry.articleTitle
      }
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
          <EditorialStandardsStrip description="Support tickets are written as issue-specific reference pages. Each one is reviewed for enterprise-safe remediation, environment clarity, escalation guidance, and direct linkage to related fixes, guides, and downloads." />

          <section className="surface-card p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-fg">Popular Search Intents</h2>
            <p className="mt-2 text-sm text-fg-secondary">
              Jump directly to high-intent enterprise troubleshooting topics.
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
              Crawlable index for every support article in the library.
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

          <section className="surface-card p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-fg">
              Top 50 SEO-Aligned Ticket Pages (Primary Keywords Assigned)
            </h2>
            <p className="mt-2 text-sm text-fg-secondary">
              Each page is assigned a primary exact-match keyword with an editorial intro and optimized lead paragraph.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="data-table min-w-[44rem] border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th>Primary Keyword</th>
                    <th>Assigned Fix Guide</th>
                    <th>Product</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {seoAlignments.map((entry) => (
                    <tr key={`${entry.articleSlug}-${entry.primaryKeyword}`}>
                      <td>
                        <Link
                          href={`/support/tickets/?q=${encodeURIComponent(entry.primaryKeyword)}`}
                          className="font-medium text-fg hover:text-primary-600 hover:underline dark:hover:text-primary-300"
                        >
                          {entry.primaryKeyword}
                        </Link>
                      </td>
                      <td>
                        <Link
                          href={`/support/tickets/${entry.articleSlug}/`}
                          className="font-medium text-fg hover:text-primary-600 hover:underline dark:hover:text-primary-300"
                        >
                          {entry.articleTitle}
                        </Link>
                      </td>
                      <td>{entry.articleProduct}</td>
                      <td>{entry.articleCategory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
