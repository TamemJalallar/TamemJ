import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResourceLinkGrid } from "@/components/shared/resource-link-grid";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import {
  getDownloadAssetBundleDownloadUrl,
  getDownloadAssetBundles,
  getDownloadAssetBySlug,
  getDownloadAssetDownloadUrl,
  getDownloadAssets,
  getDownloadAssetUpdatedAt
} from "@/lib/download-assets.registry";
import { getRelatedPillarsForTerms } from "@/lib/detail-page-related";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";

interface DownloadAssetPageProps {
  params: Promise<{ slug: string }>;
}

function uniqueKeywords(keywords: string[]): string[] {
  return [...new Set(keywords.map((keyword) => keyword.trim()).filter(Boolean))];
}

function formatDate(value: string): string {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }

  return new Date(parsed).toLocaleDateString("en-US", { dateStyle: "long" });
}

function buildAssetHighlights(
  asset: NonNullable<ReturnType<typeof getDownloadAssetBySlug>>
): string[] {
  const highlights = [
    `Use this ${asset.format.toUpperCase()} asset when you need a faster starting point for ${asset.category.toLowerCase()} work instead of building a document or script from scratch.`,
    `${asset.title} is positioned for practical enterprise use, so the detail page keeps the file, category, and surrounding workflow links together in one place.`
  ];

  if (asset.category === "Scripts") {
    highlights.push("Review the script in a test-safe workflow before broad rollout, then pair it with the support or governance documentation linked below.");
  } else if (asset.category === "Templates") {
    highlights.push("Templates are structured to be reusable for internal teams, MSPs, and support operations that need something editable and presentable right away.");
  } else if (asset.category === "Checklists") {
    highlights.push("Checklists are best when you need a printable or shareable operational reference for onboarding, incident response, or escalation handoffs.");
  } else {
    highlights.push("Runbooks work best when you need a more formal operational document with clearer sequencing, ownership, and escalation context.");
  }

  return highlights.slice(0, 4);
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

  const updatedAt = getDownloadAssetUpdatedAt(asset);
  const description = `${asset.description} Download the ${asset.format.toUpperCase()} file directly, review bundle context, and connect it to related IT support resources.`;

  return {
    title: `${asset.title} Download | IT Asset Library`,
    description,
    keywords: uniqueKeywords([
      asset.title,
      `${asset.category} download`,
      `${asset.format} template`,
      `${asset.format} download`,
      `${asset.searchDemand} demand IT asset`,
      ...asset.tags
    ]),
    alternates: {
      canonical: `/downloads/assets/${asset.slug}/`
    },
    robots: buildRobotsIndexRule(`/downloads/assets/${asset.slug}/`),
    openGraph: buildOpenGraph(
      `${asset.title} Download | IT Asset Library`,
      description,
      `/downloads/assets/${asset.slug}/`,
      "article"
    ),
    twitter: buildTwitter(`${asset.title} Download | IT Asset Library`, description),
    other: {
      "download:format": asset.format.toUpperCase(),
      "download:category": asset.category,
      "download:updated": updatedAt
    }
  };
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
  const updatedAt = getDownloadAssetUpdatedAt(asset);
  const supportSearchHref = `/support/tickets/?q=${encodeURIComponent(asset.title)}`;
  const directDownloadUrl = getDownloadAssetDownloadUrl(asset);
  const relatedPillars = getRelatedPillarsForTerms(
    [asset.title, asset.description, asset.category, asset.format, ...asset.tags],
    2
  );
  const resourceLinks = [
    {
      href: directDownloadUrl,
      eyebrow: "Direct Download",
      title: `Download ${asset.slug}.${asset.format}`,
      description: "Open the hosted file directly from the downloads domain.",
      meta: `Updated ${formatDate(updatedAt)}`,
      external: true
    },
    {
      href: supportSearchHref,
      eyebrow: "Support Search",
      title: `Search support tickets for ${asset.title}`,
      description: "See whether this script, template, or checklist appears in troubleshooting guidance or operational workflows.",
      meta: "Support Portal"
    },
    {
      href: "/downloads/",
      eyebrow: "Software Catalog",
      title: "Browse supporting software downloads",
      description: "Pair this asset with the software, utilities, or apps it supports in the broader downloads catalog.",
      meta: "Downloads"
    },
    ...relatedPillars.map((pillar) => ({
      href: `/guides/${pillar.slug}/`,
      eyebrow: "Pillar Guide",
      title: pillar.title,
      description: pillar.description,
      meta: pillar.targetKeywords.slice(0, 2).join(" • ")
    }))
  ].slice(0, 5);

  const parsedUpdatedAt = Date.parse(updatedAt);
  const isoUpdatedAt = Number.isNaN(parsedUpdatedAt) ? undefined : new Date(parsedUpdatedAt).toISOString();

  const assetSchema = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: asset.title,
    description: asset.description,
    url: toAbsoluteUrl(`/downloads/assets/${asset.slug}/`),
    downloadUrl: directDownloadUrl,
    fileFormat: asset.format.toUpperCase(),
    about: asset.category,
    keywords: asset.tags.join(", "),
    ...(isoUpdatedAt ? { dateModified: isoUpdatedAt, datePublished: isoUpdatedAt } : {}),
    audience: {
      "@type": "Audience",
      audienceType: "Enterprise IT administrators and support teams"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${asset.title} free to download?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${asset.title} is available as a free direct download from the IT asset library.`
        }
      },
      {
        "@type": "Question",
        name: `What format is ${asset.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${asset.title} is published as a ${asset.format.toUpperCase()} file.`
        }
      },
      {
        "@type": "Question",
        name: `How should ${asset.title} be used?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: buildAssetHighlights(asset).join(" ")
        }
      }
    ]
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: asset.title,
    url: toAbsoluteUrl(`/downloads/assets/${asset.slug}/`),
    description: asset.description,
    ...(isoUpdatedAt ? { dateModified: isoUpdatedAt } : {}),
    isPartOf: {
      "@type": "CollectionPage",
      name: "IT Download Assets",
      url: toAbsoluteUrl("/downloads/assets/")
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
        <div className="page-shell max-w-6xl space-y-6">
          <div>
            <Link href="/downloads/assets" className="text-sm font-medium text-fg-secondary transition hover:text-fg">
              ← Back to IT Download Assets
            </Link>
          </div>

          <article className="surface-card-strong p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="filter-chip px-2.5 py-1 text-xs">Free download</span>
              <span className="filter-chip px-2.5 py-1 text-xs uppercase">{asset.format}</span>
              <span className="filter-chip px-2.5 py-1 text-xs">{asset.category}</span>
              <span className="filter-chip px-2.5 py-1 text-xs">{asset.searchDemand} search demand</span>
            </div>

            <h1 className="mt-4 font-display text-3xl font-semibold text-fg sm:text-4xl">{asset.title}</h1>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-fg-secondary sm:text-base">{asset.description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href={directDownloadUrl} target="_blank" rel="noreferrer" className="btn-primary">
                Download {asset.format.toUpperCase()}
              </a>
              <Link href="/downloads/assets/" className="btn-secondary">
                Browse Asset Library
              </Link>
              <Link href={supportSearchHref} className="btn-secondary">
                Search Support Guides
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetaPill label="Format" value={asset.format.toUpperCase()} />
              <MetaPill label="Category" value={asset.category} />
              <MetaPill label="Updated" value={formatDate(updatedAt)} />
              <MetaPill label="File Name" value={`${asset.slug}.${asset.format}`} />
            </div>
          </article>

          <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <section className="surface-card p-5 sm:p-6">
              <p className="eyebrow">Why Use This Asset</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-fg">A direct, reusable starting point</h2>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-fg-secondary sm:text-base">
                {buildAssetHighlights(asset).map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="surface-card p-5 sm:p-6">
              <p className="eyebrow">Use It Alongside</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Practical next steps</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-fg-secondary sm:text-base">
                <p>Download the file directly, review or tailor it to your environment, and then pair it with the support or guide content linked below so the asset fits into a larger workflow instead of living on its own.</p>
                <p>That is especially useful when the file supports Microsoft 365, endpoint, identity, onboarding, or security work that needs both documentation and execution material.</p>
              </div>
            </section>
          </section>

          {relatedBundles.length > 0 ? (
            <section className="surface-card p-5 sm:p-6">
              <h2 className="font-display text-2xl font-semibold text-fg">Included in Download Bundles</h2>
              <p className="mt-2 text-sm leading-7 text-fg-secondary sm:text-base">
                This asset is also packaged inside broader bundle downloads for faster rollout and team handoff.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {relatedBundles.map((bundle) => (
                  <article key={bundle.slug} className="surface-card-interactive rounded-2xl p-4">
                    <p className="eyebrow">Bundle</p>
                    <h3 className="mt-2 text-base font-semibold text-fg">{bundle.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-fg-secondary">{bundle.description}</p>
                    <p className="mt-3 text-xs text-muted">{bundle.itemSlugs.length} assets • ZIP download</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={getDownloadAssetBundleDownloadUrl(bundle)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary !px-3.5 !py-2 text-xs"
                      >
                        Download ZIP
                      </a>
                      <Link href={`/downloads/assets/#${bundle.slug}`} className="btn-secondary !px-3.5 !py-2 text-xs">
                        View Bundle Context
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <ResourceLinkGrid
            title="Use This File With Other Site Resources"
            description="Connect the direct download to support guidance, broader guides, and the rest of the downloads catalog."
            items={resourceLinks}
          />

          {relatedAssets.length > 0 ? (
            <section className="surface-card p-5 sm:p-6">
              <h2 className="font-display text-2xl font-semibold text-fg">Related Assets</h2>
              <p className="mt-2 text-sm leading-7 text-fg-secondary sm:text-base">
                More files in the same category for adjacent operational work.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {relatedAssets.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/downloads/assets/${related.slug}/`}
                    className="surface-card-interactive rounded-2xl p-4"
                  >
                    <p className="eyebrow">{related.category}</p>
                    <h3 className="mt-2 text-base font-semibold text-fg">{related.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-fg-secondary">{related.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(assetSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}

function MetaPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line/80 bg-card/80 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-fg">{value}</p>
    </div>
  );
}
