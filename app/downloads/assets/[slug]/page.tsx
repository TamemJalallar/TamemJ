import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDownloadAssetBundles,
  getDownloadAssetBySlug,
  getDownloadAssets
} from "@/lib/download-assets.registry";
import { buildArticleOpenGraph, buildBreadcrumbJsonLd, buildTwitter, toAbsoluteUrl } from "@/lib/seo";

interface DownloadAssetPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getDownloadAssets().map((asset) => ({ slug: asset.slug }));
}

export async function generateMetadata({ params }: DownloadAssetPageProps): Promise<Metadata> {
  const { slug } = await params;
  const asset = getDownloadAssetBySlug(slug);

  if (!asset) {
    return { title: "Asset Not Found" };
  }

  const description = `${asset.description} Format: ${asset.format.toUpperCase()}. File size: ${asset.fileSize}. Updated ${new Date(asset.updatedAt).toLocaleDateString("en-US", { dateStyle: "long" })}. Access: Free.`;

  return {
    title: `${asset.title} | IT Download Assets`,
    description,
    keywords: [
      asset.title,
      `${asset.category} download`,
      `${asset.format} template`,
      `${asset.searchDemand} demand it asset`,
      ...asset.tags
    ],
    alternates: {
      canonical: `/downloads/assets/${asset.slug}/`
    },
    openGraph: buildArticleOpenGraph(
      `${asset.title} | IT Download Assets`,
      description,
      `/downloads/assets/${asset.slug}/`,
      {
        publishedTime: asset.updatedAt,
        modifiedTime: asset.updatedAt,
        authors: ["Tamem J"],
        section: asset.category,
        tags: asset.tags
      }
    ),
    twitter: buildTwitter(`${asset.title} | IT Download Assets`, description)
  };
}

function accessTone(): string {
  return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100";
}

function formatUpdatedDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", { dateStyle: "long" });
}

export default async function DownloadAssetDetailPage({ params }: DownloadAssetPageProps) {
  const { slug } = await params;
  const asset = getDownloadAssetBySlug(slug);

  if (!asset) {
    notFound();
  }

  const relatedBundles = getDownloadAssetBundles().filter((bundle) => bundle.itemSlugs.includes(asset.slug));
  const relatedAssets = getDownloadAssets()
    .filter((candidate) => candidate.slug !== asset.slug && candidate.category === asset.category)
    .slice(0, 6);
  const downloadHref = asset.downloadUrl;

  const assetSchema = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: asset.title,
    description: asset.description,
    url: toAbsoluteUrl(`/downloads/assets/${asset.slug}/`),
    contentUrl: asset.downloadUrl,
    contentSize: `${asset.fileSizeBytes} B`,
    dateModified: asset.updatedAt,
    fileFormat: asset.format,
    about: asset.category,
    keywords: asset.tags.join(", "),
    mainEntityOfPage: toAbsoluteUrl(`/downloads/assets/${asset.slug}/`),
    publisher: {
      "@type": "Organization",
      name: "Tamem J",
      url: toAbsoluteUrl("/")
    },
    isAccessibleForFree: true,
    audience: {
      "@type": "Audience",
      audienceType: "Enterprise IT administrators and support teams"
    }
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Downloads", path: "/downloads/" },
    { name: "IT Download Assets", path: "/downloads/assets/" },
    { name: asset.title, path: `/downloads/assets/${asset.slug}/` }
  ]);

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell max-w-5xl">
          <div className="mb-5">
            <Link
              href="/downloads/assets"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              ← Back to IT Download Assets
            </Link>
          </div>

          <article className="surface-card-strong p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${accessTone()}`}>
                {asset.access}
              </span>
              <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold uppercase text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {asset.format}
              </span>
              <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {asset.category}
              </span>
              <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {asset.searchDemand} search demand
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
              {asset.title}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              {asset.description}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetaPill label="Format" value={asset.format.toUpperCase()} />
              <MetaPill label="Category" value={asset.category} />
              <MetaPill label="File Size" value={asset.fileSize} />
              <MetaPill label="Updated" value={formatUpdatedDate(asset.updatedAt)} />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={downloadHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Download Free Asset
              </a>
              <Link href="/contact" className="btn-secondary">
                Contact
              </Link>
            </div>
          </article>

          <section className="mt-6 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="surface-card p-5 sm:p-6 dark:border-slate-700 dark:bg-slate-950">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Preview Metadata
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Quick summary of what this asset includes before download.
              </p>
              <ul className="mt-4 space-y-2">
                {asset.previewItems.map((item) => (
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
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                File Details
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="rounded-xl border border-line/80 bg-white/80 px-3 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    Delivery
                  </dt>
                  <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">Direct download</dd>
                </div>
                <div className="rounded-xl border border-line/80 bg-white/80 px-3 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    File Size
                  </dt>
                  <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">{asset.fileSize}</dd>
                </div>
                <div className="rounded-xl border border-line/80 bg-white/80 px-3 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    Last Updated
                  </dt>
                  <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                    {formatUpdatedDate(asset.updatedAt)}
                  </dd>
                </div>
                <div className="rounded-xl border border-line/80 bg-white/80 px-3 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    Host
                  </dt>
                  <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">downloads.tamemj.com</dd>
                </div>
              </dl>
            </aside>
          </section>

          {relatedBundles.length > 0 ? (
            <section className="mt-6 surface-card p-5 sm:p-6 dark:border-slate-700 dark:bg-slate-950">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Included in Bundles</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {relatedBundles.map((bundle) => (
                  <div
                    key={bundle.slug}
                    className="rounded-2xl border border-line/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{bundle.title}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {bundle.itemSlugs.length} assets • Free bundle
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {relatedAssets.length > 0 ? (
            <section className="mt-6 surface-card p-5 sm:p-6 dark:border-slate-700 dark:bg-slate-950">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Related Assets</h2>
              <ul className="mt-3 space-y-2">
                {relatedAssets.map((related) => (
                  <li key={related.slug}>
                    <Link
                      href={`/downloads/assets/${related.slug}`}
                      className="block rounded-xl border border-line/80 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                    >
                      {related.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(assetSchema) }}
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
