import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDownloadCategories,
  getDownloadCategoryBySlug,
  getDownloadCategorySlug,
  getDownloadsByCategory
} from "@/lib/downloads.registry";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";

interface DownloadCategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

function uniqueKeywords(keywords: string[]): string[] {
  return [...new Set(keywords.map((keyword) => keyword.trim()).filter(Boolean))];
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getDownloadCategories().map((category) => ({ slug: getDownloadCategorySlug(category) }));
}

export async function generateMetadata({ params }: DownloadCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getDownloadCategoryBySlug(slug);

  if (!category) {
    return { title: "Download Category Not Found" };
  }

  const downloads = getDownloadsByCategory(category);
  const description = `Browse ${downloads.length} ${category.toLowerCase()} software downloads with official store links, vendor installers, and GitHub releases where available.`;

  return {
    title: `${category} Downloads | Software Directory`,
    description,
    keywords: uniqueKeywords([
      `${category} downloads`,
      `${category} software`,
      `${category} apps`,
      ...downloads.slice(0, 12).map((entry) => `${entry.name} download`),
      ...downloads.flatMap((entry) => entry.platforms.map((platform) => `${platform} ${entry.category.toLowerCase()} app`))
    ]),
    alternates: {
      canonical: `/downloads/category/${slug}/`
    },
    openGraph: buildOpenGraph(`${category} Downloads | Software Directory`, description, `/downloads/category/${slug}/`),
    twitter: buildTwitter(`${category} Downloads | Software Directory`, description)
  };
}

export default async function DownloadCategoryPage({ params }: DownloadCategoryPageProps) {
  const { slug } = await params;
  const category = getDownloadCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const downloads = getDownloadsByCategory(category);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category} Downloads`,
    numberOfItems: downloads.length,
    itemListElement: downloads.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: entry.name,
        description: entry.summary,
        applicationCategory: entry.category,
        operatingSystem: entry.platforms.join(", "),
        url: entry.channels[0]?.url ?? toAbsoluteUrl(`/downloads/category/${slug}/`)
      }
    }))
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Downloads", path: "/downloads/" },
    { name: `${category} Downloads`, path: `/downloads/category/${slug}/` }
  ]);

  return (
    <>
      <section className="section-shell pt-8 sm:pt-10">
        <div className="page-shell max-w-6xl space-y-6">
          <div>
            <Link
              href="/downloads"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              ← Back to Downloads
            </Link>
          </div>

          <section className="surface-card-strong p-6 sm:p-8">
            <p className="eyebrow">Software Category</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
              {category} Downloads
            </h1>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              Crawlable landing page for {category.toLowerCase()} software in the download directory. Use this page when you want a category-first list instead of searching the full downloads index.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {downloads.length} listings
              </span>
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Official stores + vendor links
              </span>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {downloads.map((entry) => (
              <article key={entry.slug} className="surface-card p-5 dark:border-slate-700 dark:bg-slate-950">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {entry.category}
                  </span>
                  {entry.popularityLabel ? (
                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-100">
                      {entry.popularityLabel}
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{entry.name}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{entry.summary}</p>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Platforms: {entry.platforms.join(", ")}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.channels.slice(0, 2).map((channel) => (
                    <a
                      key={`${entry.slug}-${channel.type}`}
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary !px-3 !py-1.5 text-xs"
                    >
                      {channel.type}
                    </a>
                  ))}
                  <Link href={`/downloads/#${entry.slug}`} className="btn-secondary !px-3 !py-1.5 text-xs">
                    View in directory
                  </Link>
                </div>
              </article>
            ))}
          </section>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}
