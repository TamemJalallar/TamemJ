import type { Metadata } from "next";
import Link from "next/link";
import {
  getDownloadAssetBundles,
  getDownloadAssetsForBundle
} from "@/lib/download-assets.registry";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildOpenGraph,
  buildTwitter,
  toAbsoluteUrl
} from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const bundles = getDownloadAssetBundles();
  const description = `Download ${bundles.length} curated IT asset bundles with ZIP packages for operations, Microsoft 365 administration, security, compliance, and PowerShell workflows.`;

  return {
    title: "IT Download Bundles",
    description,
    keywords: [
      "it download bundles",
      "it admin starter kit",
      "powershell admin toolkit",
      "m365 admin bundle",
      "security compliance bundle",
      "zip it templates"
    ],
    alternates: {
      canonical: "/downloads/assets/bundles/"
    },
    openGraph: buildOpenGraph("IT Download Bundles | Tamem J", description, "/downloads/assets/bundles/"),
    twitter: buildTwitter("IT Download Bundles | Tamem J", description)
  };
}

function formatUpdatedDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", { dateStyle: "long" });
}

export default function DownloadAssetBundlesPage() {
  const bundles = getDownloadAssetBundles();

  const collectionSchema = buildCollectionPageJsonLd(
    "IT Download Bundles",
    "ZIP bundles that group related IT scripts, templates, checklists, and runbooks into single downloads.",
    "/downloads/assets/bundles/",
    bundles.map((bundle) => ({
      name: bundle.title,
      path: `/downloads/assets/bundles/${bundle.slug}/`
    }))
  );

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Downloads", path: "/downloads/" },
    { name: "IT Download Assets", path: "/downloads/assets/" },
    { name: "Bundles", path: "/downloads/assets/bundles/" }
  ]);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "IT Download Bundles",
    numberOfItems: bundles.length,
    itemListElement: bundles.map((bundle, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "DigitalDocument",
        name: bundle.title,
        description: bundle.description,
        url: toAbsoluteUrl(`/downloads/assets/bundles/${bundle.slug}/`),
        contentUrl: bundle.downloadUrl,
        contentSize: `${bundle.fileSizeBytes} B`,
        dateModified: bundle.updatedAt,
        isAccessibleForFree: true
      }
    }))
  };

  return (
    <>
      <section className="section-shell pt-8 sm:pt-10">
        <div className="page-shell">
          <div className="mb-5">
            <Link
              href="/downloads/assets/"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              ← Back to IT Download Assets
            </Link>
          </div>

          <section className="surface-card-strong p-6 sm:p-8">
            <p className="eyebrow">Bundle Library</p>
            <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
              Download grouped IT asset packs in a single ZIP
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              These bundles package related scripts, templates, checklists, and runbooks into single downloads
              so visitors can grab a full workflow pack instead of pulling files one by one.
            </p>
          </section>

          <section className="mt-6 grid gap-4 xl:grid-cols-2">
            {bundles.map((bundle) => {
              const includedAssets = getDownloadAssetsForBundle(bundle.slug);

              return (
                <article
                  key={bundle.slug}
                  className="surface-card-strong p-5 sm:p-6 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100">
                      Free bundle
                    </span>
                    <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {bundle.itemSlugs.length} assets
                    </span>
                    <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {bundle.fileSize}
                    </span>
                  </div>

                  <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {bundle.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {bundle.description}
                  </p>

                  <div className="mt-4 rounded-2xl border border-dashed border-line/80 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-950/40">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      What this bundle is for
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                      {bundle.previewItems.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {bundle.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-medium text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-100"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      Included assets
                    </p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {includedAssets.map((asset) => (
                        <Link
                          key={asset.slug}
                          href={`/downloads/assets/${asset.slug}/`}
                          className="rounded-xl border border-line/80 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                        >
                          {asset.title}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <span>Updated {formatUpdatedDate(bundle.updatedAt)}</span>
                    <span>•</span>
                    <span>Hosted on downloads.tamemj.com</span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link href={`/downloads/assets/bundles/${bundle.slug}/`} className="btn-secondary">
                      View bundle
                    </Link>
                    <a href={bundle.downloadUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                      Download ZIP
                    </a>
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
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
