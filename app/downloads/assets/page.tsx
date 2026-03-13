import type { Metadata } from "next";
import Link from "next/link";
import { DownloadAssetsBrowser } from "@/components/downloads/download-assets-browser";
import {
  formatDownloadAssetFileSize,
  getDownloadAssetBundles,
  getDownloadAssetCategories,
  getDownloadAssetCategorySlug,
  getDownloadAssets,
  getDownloadAssetStats
} from "@/lib/download-assets.registry";
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
  const assets = getDownloadAssets();
  const bundles = getDownloadAssetBundles();
  const stats = getDownloadAssetStats();
  const categories = [...new Set(assets.map((asset) => asset.category))];

  const description = `Download ${stats.total} enterprise IT assets and ${bundles.length} ZIP bundles, including PowerShell scripts, Excel templates, checklists, and runbooks for Microsoft 365, Active Directory, security, and operations workflows.`;

  return {
    title: "IT Download Assets",
    description,
    keywords: uniqueKeywords([
      "it download assets",
      "powershell scripts",
      "it templates",
      "helpdesk checklist",
      "microsoft 365 admin scripts",
      "active directory scripts",
      "it compliance templates",
      "incident response checklist",
      "it operations runbook",
      "it admin starter kit",
      "it download bundles",
      ...categories.map((category) => `${category.toLowerCase()} downloads`),
      ...assets.slice(0, 20).map((asset) => `${asset.title.toLowerCase()} download`)
    ]),
    alternates: {
      canonical: "/downloads/assets/"
    },
    openGraph: buildOpenGraph("IT Download Assets | Tamem J", description, "/downloads/assets/"),
    twitter: buildTwitter("IT Download Assets | Tamem J", description)
  };
}

export default function DownloadAssetsPage() {
  const assets = getDownloadAssets();
  const assetCategories = getDownloadAssetCategories();
  const bundles = getDownloadAssetBundles();
  const stats = getDownloadAssetStats();
  const assetsByCategory = [...new Set(assets.map((asset) => asset.category))]
    .sort((a, b) => a.localeCompare(b))
    .map((category) => ({
      category,
      assets: assets
        .filter((asset) => asset.category === category)
        .sort((a, b) => a.title.localeCompare(b.title))
    }));

  const collectionSchema = buildCollectionPageJsonLd(
    "IT Download Assets",
    "Enterprise IT scripts, templates, checklists, and runbooks.",
    "/downloads/assets/",
    assets.map((asset) => ({
      name: asset.title,
      path: `/downloads/assets/${asset.slug}/`
    }))
  );

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "IT Download Assets",
    url: toAbsoluteUrl("/downloads/assets/"),
    description:
      "Enterprise IT scripts, templates, checklists, and runbooks with free access."
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "IT Asset Library",
    numberOfItems: assets.length,
    itemListElement: assets.map((asset, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "DigitalDocument",
        name: asset.title,
        description: asset.description,
        url: toAbsoluteUrl(`/downloads/assets/${asset.slug}/`),
        contentSize: `${asset.fileSizeBytes} B`,
        dateModified: asset.updatedAt,
        fileFormat: asset.format,
        about: asset.category,
        isAccessibleForFree: true
      }
    }))
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Downloads", path: "/downloads/" },
    { name: "IT Download Assets", path: "/downloads/assets/" }
  ]);

  return (
    <>
      <section className="section-shell pt-8 sm:pt-10">
        <div className="page-shell">
          <div className="mb-5 rounded-2xl border border-line/80 bg-white/80 p-4 shadow-soft dark:border-slate-700 dark:bg-slate-950/70 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Access Model
            </p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
              All assets are free to download. No gating or premium tiers.
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Library footprint: {formatDownloadAssetFileSize(stats.totalFileSizeBytes)} • Last refreshed{" "}
              {new Date(stats.latestUpdatedAt).toLocaleDateString("en-US", { dateStyle: "long" })}
            </p>
          </div>

          <section className="mb-6 rounded-2xl border border-line/80 bg-white/80 p-5 shadow-soft dark:border-slate-700 dark:bg-slate-950/70">
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Asset Categories</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Category landing pages for scripts, templates, checklists, and runbooks.
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  {assetCategories.map((category) => (
                    <Link
                      key={category}
                      href={`/downloads/assets/category/${getDownloadAssetCategorySlug(category)}/`}
                      className="rounded-xl border border-line/80 bg-slate-50 px-3 py-3 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                    >
                      <span className="font-medium">{category}</span>
                      <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                        Open category landing page
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-line/80 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Bundle Library
                </p>
                <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                  Download grouped starter packs
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Bundle pages explain what each pack includes, who it is for, and provide a single ZIP download.
                </p>
                <div className="mt-3 space-y-2">
                  {bundles.slice(0, 3).map((bundle) => (
                    <Link
                      key={bundle.slug}
                      href={`/downloads/assets/bundles/${bundle.slug}/`}
                      className="block rounded-xl border border-line/80 bg-white px-3 py-3 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                    >
                      <span className="font-medium">{bundle.title}</span>
                      <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                        {bundle.itemSlugs.length} assets • {bundle.fileSize}
                      </span>
                    </Link>
                  ))}
                </div>
                <Link href="/downloads/assets/bundles/" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
                  View all bundles
                </Link>
              </div>
            </div>
          </section>

          <DownloadAssetsBrowser assets={assets} bundles={bundles} />

          <section className="mt-6 surface-card p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Full Download Asset Index
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Crawlable list of every script, template, checklist, and runbook in the asset library.
            </p>
            <div className="mt-4 space-y-3">
              {assetsByCategory.map((group, index) => (
                <details
                  key={group.category}
                  className="rounded-xl border border-line/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                  open={index === 0}
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {group.category} ({group.assets.length})
                  </summary>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {group.assets.map((asset) => (
                      <Link
                        key={asset.slug}
                        href={`/downloads/assets/${asset.slug}/`}
                        className="rounded-lg border border-line/70 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                      >
                        {asset.title}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
