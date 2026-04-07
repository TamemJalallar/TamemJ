import type { Metadata } from "next";
import Link from "next/link";
import { EditorialStandardsStrip } from "@/components/shared/editorial-authority-panels";
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
  const categories = [...new Set(assets.map((asset) => asset.category))].sort((a, b) => a.localeCompare(b));
  const assetsByCategory = categories.map((category) => ({
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
      "Enterprise IT scripts, templates, checklists, and runbooks with practical, ready-to-download resources."
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
        <div className="page-shell space-y-6">
          <section className="hero-surface p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 top-0 h-52 w-52 rounded-full bg-primary-300/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-12 bottom-0 h-52 w-52 rounded-full bg-accent-400/10 blur-3xl" />
            <div className="relative grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
              <div>
                <p className="eyebrow text-primary-100">IT Download Assets</p>
                <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Scripts, templates, checklists, and runbooks that support the software side of the site.
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-primary-100/90 sm:text-base">
                  This is the practical operations layer of the downloads section. Instead of generic files dumped into a list,
                  the page now treats assets like a curated library: role-friendly bundles, plain category browsing, and searchable detail pages.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#asset-browser" className="btn-primary">
                    Browse Asset Library
                  </a>
                  <Link href="/downloads" className="btn-secondary">
                    Back to Software Downloads
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Assets</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{stats.total}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Downloadable operational resources</p>
                </article>
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Bundles</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{stats.bundles}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Grouped packs for faster starting points</p>
                </article>
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">High Demand</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{stats.highDemand}</p>
                  <p className="mt-1 text-sm text-primary-100/85">High-intent assets with strong search demand</p>
                </article>
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Categories</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{categories.length}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Scripts, templates, checklists, and runbooks</p>
                </article>
              </div>
            </div>
          </section>

          <EditorialStandardsStrip description="Asset detail pages are reviewed as reference surfaces, not just file listings. The goal is to keep each script, template, checklist, or runbook page clear about format, update timing, workflow fit, and the surrounding support context." />

          <section className="grid gap-4 lg:grid-cols-3">
            <article className="surface-card-interactive p-5 sm:p-6">
              <p className="eyebrow">Role-based packs</p>
              <h2 className="mt-3 font-display text-xl font-semibold text-fg">Start with bundles when you need a pack, not one file</h2>
              <p className="mt-3 text-sm leading-7 text-fg-secondary">
                Bundle pages turn the library into clearer starting points for M365 admins, helpdesk teams, security/compliance work, and PowerShell-heavy operations.
              </p>
            </article>
            <article className="surface-card-interactive p-5 sm:p-6">
              <p className="eyebrow">Readable assets</p>
              <h2 className="mt-3 font-display text-xl font-semibold text-fg">Templates are designed to look usable right away</h2>
              <p className="mt-3 text-sm leading-7 text-fg-secondary">
                The files are no longer tiny placeholders. They are formatted resources with structure, instructions, and polish so the marketplace feels credible.
              </p>
            </article>
            <article className="surface-card-interactive p-5 sm:p-6">
              <p className="eyebrow">Search-friendly</p>
              <h2 className="mt-3 font-display text-xl font-semibold text-fg">Every asset has its own crawlable landing page</h2>
              <p className="mt-3 text-sm leading-7 text-fg-secondary">
                That keeps the library useful for both people who want the file now and people who land from search on a specific script or template.
              </p>
            </article>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow">Starter Bundles</p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Grouped downloads by workflow</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-fg-secondary">
                  Bundle links are the fastest way to explain what the grouped downloads actually are, instead of leaving them as unlabeled pack names.
                </p>
              </div>
              <Link href="/downloads" className="btn-secondary !px-4 !py-2 text-xs">
                Software Downloads
              </Link>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {bundles.map((bundle) => (
                <a key={bundle.slug} href={`#${bundle.slug}`} className="surface-card-interactive rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-fg">{bundle.title}</h3>
                    <span className="filter-chip px-2.5 py-1 text-xs">{bundle.itemSlugs.length} assets</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-fg-secondary">{bundle.description}</p>
                </a>
              ))}
            </div>
          </section>

          <div id="asset-browser">
            <DownloadAssetsBrowser assets={assets} bundles={bundles} />
          </div>

          <section className="surface-card p-5 sm:p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow">Crawlable Index</p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Full asset directory</h2>
                <p className="mt-2 text-sm leading-7 text-fg-secondary">
                  This keeps every script, template, checklist, and runbook accessible in a plain index without requiring search first.
                </p>
              </div>
              <span className="filter-chip px-3 py-1 text-xs">{assets.length} asset pages</span>
            </div>
            <div className="mt-5 space-y-3">
              {assetsByCategory.map((group, index) => (
                <details key={group.category} className="surface-card rounded-2xl p-4" open={index === 0}>
                  <summary className="cursor-pointer list-none text-sm font-semibold text-fg">
                    {group.category} ({group.assets.length})
                  </summary>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {group.assets.map((asset) => (
                      <Link
                        key={asset.slug}
                        href={`/downloads/assets/${asset.slug}/`}
                        className="filter-chip justify-start rounded-lg px-3 py-2 text-sm"
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
