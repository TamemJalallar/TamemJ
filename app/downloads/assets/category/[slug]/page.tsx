import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RelatedContentSection } from "@/components/related-content-section";
import {
  getDownloadAssetCategories,
  getDownloadAssetCategoryBySlug,
  getDownloadAssetCategorySlug,
  getDownloadAssetsByCategory
} from "@/lib/download-assets.registry";
import { buildResourceGroupsForItContext } from "@/lib/related-content";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";

interface DownloadAssetCategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

function uniqueKeywords(keywords: string[]): string[] {
  return [...new Set(keywords.map((keyword) => keyword.trim()).filter(Boolean))];
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getDownloadAssetCategories().map((category) => ({ slug: getDownloadAssetCategorySlug(category) }));
}

export async function generateMetadata({ params }: DownloadAssetCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getDownloadAssetCategoryBySlug(slug);

  if (!category) {
    return { title: "Asset Category Not Found" };
  }

  const assets = getDownloadAssetsByCategory(category);
  const description = `Browse ${assets.length} ${category.toLowerCase()} assets for enterprise IT teams, including free downloads with file metadata, updated dates, and supporting guidance.`;

  return {
    title: `${category} IT Download Assets`,
    description,
    keywords: uniqueKeywords([
      `${category.toLowerCase()} downloads`,
      `${category.toLowerCase()} templates`,
      `${category.toLowerCase()} scripts`,
      ...assets.slice(0, 12).map((asset) => `${asset.title.toLowerCase()} download`),
      ...assets.flatMap((asset) => asset.tags.slice(0, 3))
    ]),
    alternates: {
      canonical: `/downloads/assets/category/${slug}/`
    },
    openGraph: buildOpenGraph(`${category} IT Download Assets`, description, `/downloads/assets/category/${slug}/`),
    twitter: buildTwitter(`${category} IT Download Assets`, description)
  };
}

export default async function DownloadAssetCategoryPage({ params }: DownloadAssetCategoryPageProps) {
  const { slug } = await params;
  const category = getDownloadAssetCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const assets = getDownloadAssetsByCategory(category);
  const relatedContentGroups = buildResourceGroupsForItContext(
    [category, ...assets.map((asset) => asset.title), ...assets.flatMap((asset) => asset.tags.slice(0, 2))]
  ).filter((group) => group.title !== "Related Download Assets");

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category} IT Download Assets`,
    numberOfItems: assets.length,
    itemListElement: assets.map((asset, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "DigitalDocument",
        name: asset.title,
        description: asset.description,
        url: toAbsoluteUrl(`/downloads/assets/${asset.slug}/`),
        contentUrl: asset.downloadUrl,
        fileFormat: asset.format,
        dateModified: asset.updatedAt,
        contentSize: `${asset.fileSizeBytes} B`
      }
    }))
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Downloads", path: "/downloads/" },
    { name: "IT Download Assets", path: "/downloads/assets/" },
    { name: `${category} Assets`, path: `/downloads/assets/category/${slug}/` }
  ]);

  return (
    <>
      <section className="section-shell pt-8 sm:pt-10">
        <div className="page-shell max-w-6xl space-y-6">
          <div>
            <Link
              href="/downloads/assets"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              ← Back to IT Download Assets
            </Link>
          </div>

          <section className="surface-card-strong p-6 sm:p-8">
            <p className="eyebrow">Asset Category</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
              {category} IT Download Assets
            </h1>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              Dedicated landing page for {category.toLowerCase()} assets in the IT resource library. This page gives search engines and users a direct path into the most relevant scripts, templates, checklists, or runbooks for this format.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {assets.length} assets
              </span>
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Free direct downloads
              </span>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {assets.map((asset) => (
              <article key={asset.slug} className="surface-card p-5 dark:border-slate-700 dark:bg-slate-950">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold uppercase text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {asset.format}
                  </span>
                  <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-100">
                    {asset.searchDemand} demand
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{asset.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{asset.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{asset.fileSize}</span>
                  <span>•</span>
                  <span>{new Date(asset.updatedAt).toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/downloads/assets/${asset.slug}/`} className="btn-secondary !px-3 !py-1.5 text-xs">
                    View asset
                  </Link>
                  <a
                    href={asset.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary !px-3 !py-1.5 text-xs"
                  >
                    Download
                  </a>
                </div>
              </article>
            ))}
          </section>

          {relatedContentGroups.length > 0 ? (
            <RelatedContentSection
              title="Related Internal Resources"
              description="Additional guides, support tickets, and corporate fixes connected to this asset category."
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
