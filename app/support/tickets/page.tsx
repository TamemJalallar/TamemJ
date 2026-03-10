import type { Metadata } from "next";
import Link from "next/link";
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
          <section className="surface-card p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Popular Search Intents
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Jump directly to high-intent enterprise troubleshooting topics.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {keywordIntents.map((entry) => (
                <Link
                  key={entry.keyword}
                  href={`/support/tickets/?q=${encodeURIComponent(entry.keyword)}`}
                  className="rounded-xl border border-line/80 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                >
                  {entry.keyword}
                </Link>
              ))}
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Full Ticket Index by Category
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Crawlable index for every support article in the library.
            </p>

            <div className="mt-4 space-y-3">
              {groupedByCategory.map((group, index) => (
                <details
                  key={group.category}
                  className="rounded-xl border border-line/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                  open={index === 0}
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {group.category} ({group.articles.length})
                  </summary>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {group.articles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/support/tickets/${article.slug}/`}
                        className="rounded-lg border border-line/70 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
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
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Top 50 SEO-Aligned Ticket Pages (Primary Keywords Assigned)
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Each page is assigned a primary exact-match keyword with an editorial intro and optimized lead paragraph.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line/80 dark:border-slate-700">
                    <th className="px-2 py-2 font-semibold text-slate-700 dark:text-slate-200">Primary Keyword</th>
                    <th className="px-2 py-2 font-semibold text-slate-700 dark:text-slate-200">Assigned Fix Guide</th>
                    <th className="px-2 py-2 font-semibold text-slate-700 dark:text-slate-200">Product</th>
                    <th className="px-2 py-2 font-semibold text-slate-700 dark:text-slate-200">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {seoAlignments.map((entry) => (
                    <tr key={`${entry.articleSlug}-${entry.primaryKeyword}`} className="border-b border-line/60 dark:border-slate-800">
                      <td className="px-2 py-2 text-slate-800 dark:text-slate-100">
                        <Link
                          href={`/support/tickets/?q=${encodeURIComponent(entry.primaryKeyword)}`}
                          className="hover:underline"
                        >
                          {entry.primaryKeyword}
                        </Link>
                      </td>
                      <td className="px-2 py-2">
                        <Link
                          href={`/support/tickets/${entry.articleSlug}/`}
                          className="font-medium text-slate-800 hover:underline dark:text-slate-100"
                        >
                          {entry.articleTitle}
                        </Link>
                      </td>
                      <td className="px-2 py-2 text-slate-600 dark:text-slate-300">
                        {entry.articleProduct}
                      </td>
                      <td className="px-2 py-2 text-slate-600 dark:text-slate-300">
                        {entry.articleCategory}
                      </td>
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
