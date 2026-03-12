import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RelatedContentSection } from "@/components/related-content-section";
import {
  getCorporateFixCategories,
  getCorporateFixCategoryBySlug,
  getCorporateFixCategorySlug,
  getCorporateFixesByCategory
} from "@/lib/corporate-fixes.registry";
import { buildResourceGroupsForItContext } from "@/lib/related-content";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";

interface CorporateFixCategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

function uniqueKeywords(keywords: string[]): string[] {
  return [...new Set(keywords.map((keyword) => keyword.trim()).filter(Boolean))];
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getCorporateFixCategories().map((category) => ({ slug: getCorporateFixCategorySlug(category) }));
}

export async function generateMetadata({ params }: CorporateFixCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCorporateFixCategoryBySlug(slug);

  if (!category) {
    return { title: "Fix Category Not Found" };
  }

  const fixes = getCorporateFixesByCategory(category);
  const description = `Browse ${fixes.length} ${category} corporate tech fixes with enterprise-safe troubleshooting steps, escalation criteria, and estimated remediation times.`;

  return {
    title: `${category} Corporate Tech Fixes`,
    description,
    keywords: uniqueKeywords([
      `${category} troubleshooting`,
      `${category} support runbook`,
      `${category} enterprise support`,
      ...fixes.slice(0, 12).map((fix) => fix.title),
      ...fixes.flatMap((fix) => fix.tags.slice(0, 3))
    ]),
    alternates: {
      canonical: `/corporate-tech-fixes/category/${slug}/`
    },
    openGraph: buildOpenGraph(`${category} Corporate Tech Fixes`, description, `/corporate-tech-fixes/category/${slug}/`),
    twitter: buildTwitter(`${category} Corporate Tech Fixes`, description)
  };
}

export default async function CorporateFixCategoryPage({ params }: CorporateFixCategoryPageProps) {
  const { slug } = await params;
  const category = getCorporateFixCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const fixes = getCorporateFixesByCategory(category);
  const relatedContentGroups = buildResourceGroupsForItContext(
    [category, ...fixes.map((fix) => fix.title), ...fixes.flatMap((fix) => fix.tags.slice(0, 2))]
  ).filter((group) => group.title !== "Related Corporate Fixes");

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category} Corporate Tech Fixes`,
    numberOfItems: fixes.length,
    itemListElement: fixes.map((fix, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "TechArticle",
        headline: fix.title,
        description: fix.description,
        url: toAbsoluteUrl(`/corporate-tech-fixes/${fix.slug}/`),
        articleSection: fix.category
      }
    }))
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Corporate Tech Fixes", path: "/corporate-tech-fixes/" },
    { name: `${category} Fixes`, path: `/corporate-tech-fixes/category/${slug}/` }
  ]);

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell max-w-6xl space-y-6">
          <div>
            <Link
              href="/corporate-tech-fixes"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              ← Back to Corporate Tech Fixes
            </Link>
          </div>

          <section className="surface-card-strong p-6 sm:p-8">
            <p className="eyebrow">Fix Category</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
              {category} Corporate Tech Fixes
            </h1>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              Dedicated landing page for the {category} segment of the corporate troubleshooting library. This category view makes the runbook catalog crawlable beyond the filter UI and gives users a cleaner path into the fixes most relevant to their issue family.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {fixes.length} fixes
              </span>
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Enterprise-safe runbooks
              </span>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {fixes.map((fix) => (
              <article key={fix.slug} className="surface-card p-5 dark:border-slate-700 dark:bg-slate-950">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {fix.severity} severity
                  </span>
                  <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {fix.accessLevel}
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{fix.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{fix.description}</p>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Estimated time: {fix.estimatedTime}</p>
                <div className="mt-4">
                  <Link href={`/corporate-tech-fixes/${fix.slug}/`} className="btn-secondary !px-3 !py-1.5 text-xs">
                    Open fix
                  </Link>
                </div>
              </article>
            ))}
          </section>

          {relatedContentGroups.length > 0 ? (
            <RelatedContentSection
              title="Related Internal Resources"
              description="Additional support tickets, guides, and downloads connected to this fix category."
              groups={relatedContentGroups}
            />
          ) : null}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}
