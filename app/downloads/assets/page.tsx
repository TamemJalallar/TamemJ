import type { Metadata } from "next";
import Link from "next/link";
import { DownloadAssetsBrowser } from "@/components/downloads/download-assets-browser";
import {
  getDownloadAssetBundles,
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
  const stats = getDownloadAssetStats();
  const categories = [...new Set(assets.map((asset) => asset.category))];

  const description = `Download ${stats.total} enterprise IT assets, including PowerShell scripts, Excel templates, checklists, and runbooks for Microsoft 365, Active Directory, security, and operations workflows.`;

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
      "Enterprise IT scripts, templates, checklists, and runbooks with free, email-gated, and premium access paths."
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
        fileFormat: asset.format,
        about: asset.category
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
              Monetization Mix
            </p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
              {stats.byAccess.free} free assets, {stats.byAccess.emailGate} email-gated assets, and {stats.byAccess.premium} premium assets.
            </p>
          </div>

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
