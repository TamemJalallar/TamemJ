import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RelatedContentSection } from "@/components/related-content-section";
import {
  getDownloadAssetBundleBySlug,
  getDownloadAssetBundles,
  getDownloadAssetsForBundle
} from "@/lib/download-assets.registry";
import { buildResourceGroupsForItContext } from "@/lib/related-content";
import { buildArticleOpenGraph, buildBreadcrumbJsonLd, buildTwitter, toAbsoluteUrl } from "@/lib/seo";

interface DownloadAssetBundlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getDownloadAssetBundles().map((bundle) => ({ slug: bundle.slug }));
}

export async function generateMetadata({ params }: DownloadAssetBundlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const bundle = getDownloadAssetBundleBySlug(slug);

  if (!bundle) {
    return { title: "Bundle Not Found" };
  }

  const description = `${bundle.description} Includes ${bundle.itemSlugs.length} assets. ZIP size: ${bundle.fileSize}. Updated ${new Date(bundle.updatedAt).toLocaleDateString("en-US", { dateStyle: "long" })}.`;

  return {
    title: `${bundle.title} | IT Download Bundles`,
    description,
    keywords: [
      bundle.title,
      `${bundle.title} zip download`,
      "it asset bundle",
      "it download bundle",
      ...bundle.highlights
    ],
    alternates: {
      canonical: `/downloads/assets/bundles/${bundle.slug}/`
    },
    openGraph: buildArticleOpenGraph(
      `${bundle.title} | IT Download Bundles`,
      description,
      `/downloads/assets/bundles/${bundle.slug}/`,
      {
        publishedTime: bundle.updatedAt,
        modifiedTime: bundle.updatedAt,
        authors: ["Tamem J"],
        section: "Downloads",
        tags: bundle.highlights
      }
    ),
    twitter: buildTwitter(`${bundle.title} | IT Download Bundles`, description)
  };
}

function formatUpdatedDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", { dateStyle: "long" });
}

export default async function DownloadAssetBundleDetailPage({ params }: DownloadAssetBundlePageProps) {
  const { slug } = await params;
  const bundle = getDownloadAssetBundleBySlug(slug);

  if (!bundle) {
    notFound();
  }

  const assets = getDownloadAssetsForBundle(bundle.slug);
  const relatedBundles = getDownloadAssetBundles()
    .filter((candidate) => candidate.slug !== bundle.slug)
    .slice(0, 3);
  const relatedContentGroups = buildResourceGroupsForItContext(
    [
      bundle.title,
      bundle.description,
      ...bundle.previewItems,
      ...bundle.highlights,
      ...assets.flatMap((asset) => [asset.title, asset.description, ...asset.tags, ...asset.previewItems])
    ],
    {
      excludeAssetSlugs: assets.map((asset) => asset.slug)
    }
  );

  const bundleSchema = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: bundle.title,
    description: bundle.description,
    url: toAbsoluteUrl(`/downloads/assets/bundles/${bundle.slug}/`),
    contentUrl: bundle.downloadUrl,
    contentSize: `${bundle.fileSizeBytes} B`,
    dateModified: bundle.updatedAt,
    isAccessibleForFree: true,
    hasPart: assets.map((asset) => ({
      "@type": "DigitalDocument",
      name: asset.title,
      url: toAbsoluteUrl(`/downloads/assets/${asset.slug}/`)
    })),
    publisher: {
      "@type": "Organization",
      name: "Tamem J",
      url: toAbsoluteUrl("/")
    }
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Downloads", path: "/downloads/" },
    { name: "IT Download Assets", path: "/downloads/assets/" },
    { name: "Bundles", path: "/downloads/assets/bundles/" },
    { name: bundle.title, path: `/downloads/assets/bundles/${bundle.slug}/` }
  ]);

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell max-w-6xl">
          <div className="mb-5">
            <Link
              href="/downloads/assets/bundles/"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              ← Back to IT Download Bundles
            </Link>
          </div>

          <article className="surface-card-strong p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100">
                Free bundle
              </span>
              <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {bundle.itemSlugs.length} assets
              </span>
              <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {bundle.fileSize}
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
              {bundle.title}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              {bundle.description}
            </p>

            <div className="mt-5 rounded-2xl border border-cyan-200/70 bg-cyan-50/70 p-4 text-sm leading-7 text-slate-700 dark:border-cyan-900/60 dark:bg-cyan-950/25 dark:text-slate-200">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-700 dark:text-cyan-200">
                Bundle Summary
              </p>
              <p className="mt-2">
                This bundle groups related IT assets into one ZIP so visitors can download an entire workflow pack
                at once instead of pulling each template or script individually.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetaPill label="Archive" value="ZIP package" />
              <MetaPill label="Assets Included" value={String(bundle.itemSlugs.length)} />
              <MetaPill label="File Size" value={bundle.fileSize} />
              <MetaPill label="Updated" value={formatUpdatedDate(bundle.updatedAt)} />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <a href={bundle.downloadUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Download ZIP Bundle
              </a>
              <Link href="/downloads/assets/" className="btn-secondary">
                Browse individual assets
              </Link>
            </div>
          </article>

          <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="surface-card p-5 sm:p-6 dark:border-slate-700 dark:bg-slate-950">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">What&apos;s inside</h2>
              <ul className="mt-4 space-y-2">
                {bundle.previewItems.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-xl border border-line/80 bg-slate-50/80 px-3 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="surface-card p-5 sm:p-6 dark:border-slate-700 dark:bg-slate-950">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Best fit</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {bundle.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-100"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="rounded-xl border border-line/80 bg-white/80 px-3 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    Delivery
                  </dt>
                  <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">Single ZIP archive</dd>
                </div>
                <div className="rounded-xl border border-line/80 bg-white/80 px-3 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    Host
                  </dt>
                  <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">downloads.tamemj.com</dd>
                </div>
                <div className="rounded-xl border border-line/80 bg-white/80 px-3 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    Last Updated
                  </dt>
                  <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                    {formatUpdatedDate(bundle.updatedAt)}
                  </dd>
                </div>
              </dl>
            </aside>
          </section>

          <section className="mt-6 surface-card p-5 sm:p-6 dark:border-slate-700 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Included assets</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Each asset remains available individually if the visitor only needs one file.
                </p>
              </div>
              <a href={bundle.downloadUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Download ZIP
              </a>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {assets.map((asset) => (
                <article
                  key={asset.slug}
                  className="rounded-2xl border border-line/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold uppercase text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {asset.format}
                    </span>
                    <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {asset.fileSize}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">{asset.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{asset.description}</p>
                  <ul className="mt-3 space-y-1.5 text-xs leading-5 text-slate-600 dark:text-slate-300">
                    {asset.previewItems.slice(0, 2).map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/downloads/assets/${asset.slug}/`} className="btn-secondary !px-3.5 !py-2 text-xs">
                      View asset
                    </Link>
                    <a
                      href={asset.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary !px-3.5 !py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      Download file
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {relatedContentGroups.length > 0 ? (
            <div className="mt-6">
              <RelatedContentSection
                title="Related Troubleshooting and Guide Content"
                description="These internal links connect the bundle to the ticket, guide, and fix content visitors typically need after downloading the assets."
                groups={relatedContentGroups}
              />
            </div>
          ) : null}

          {relatedBundles.length > 0 ? (
            <section className="mt-6 surface-card p-5 sm:p-6 dark:border-slate-700 dark:bg-slate-950">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Other bundles</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {relatedBundles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/downloads/assets/bundles/${related.slug}/`}
                    className="rounded-2xl border border-line/80 bg-white p-4 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                  >
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{related.title}</span>
                    <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                      {related.itemSlugs.length} assets • {related.fileSize}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bundleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

function MetaPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line/80 bg-white/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}
