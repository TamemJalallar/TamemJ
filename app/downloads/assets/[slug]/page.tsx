import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buildDownloadAssetRequestMailto,
  getDownloadAssetBundles,
  getDownloadAssetBySlug,
  getDownloadAssets
} from "@/lib/download-assets.registry";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

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

  const description = `${asset.description} Format: ${asset.format.toUpperCase()}. Access: ${asset.access}.`;

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
    openGraph: buildOpenGraph(
      `${asset.title} | IT Download Assets`,
      description,
      `/downloads/assets/${asset.slug}/`
    ),
    twitter: buildTwitter(`${asset.title} | IT Download Assets`, description)
  };
}

function accessTone(access: string): string {
  if (access === "Free") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100";
  }

  if (access === "Email gate") {
    return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-700 dark:bg-sky-900/40 dark:text-sky-100";
  }

  return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-100";
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
  const requestHref = buildDownloadAssetRequestMailto(asset, siteConfig.email);

  const assetSchema = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: asset.title,
    description: asset.description,
    url: toAbsoluteUrl(`/downloads/assets/${asset.slug}/`),
    fileFormat: asset.format,
    about: asset.category,
    keywords: asset.tags.join(", "),
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
              <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${accessTone(asset.access)}`}>
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
              {asset.priceLabel ? (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-100">
                  {asset.priceLabel}
                </span>
              ) : null}
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
              <MetaPill label="Access" value={asset.access} />
              <MetaPill label="Monetization" value={asset.monetization} />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={requestHref}
                className="btn-primary"
              >
                {asset.access === "Premium"
                  ? "Request Purchase Details"
                  : asset.access === "Email gate"
                    ? "Request Email-Gated Access"
                    : "Request Free Copy"}
              </a>
              <Link href="/contact" className="btn-secondary">
                Contact
              </Link>
            </div>
          </article>

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
                      {bundle.itemSlugs.length} assets • {bundle.monetization}
                    </p>
                    {bundle.priceLabel ? (
                      <p className="mt-1 text-xs text-amber-700 dark:text-amber-200">Bundle price: {bundle.priceLabel}</p>
                    ) : null}
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
