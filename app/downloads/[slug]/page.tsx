import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { FAQPage, ItemList, SoftwareApplication, WebPage, WithContext } from "schema-dts";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import { getDownloadBySlug, getDownloads, getRelatedDownloads } from "@/lib/downloads.registry";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";
import type { DirectDownloadArtifact, DownloadEntry } from "@/types/download";

interface DownloadDetailPageProps {
  params: Promise<{ slug: string }>;
}

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

function isFreeEntry(entry: DownloadEntry): boolean {
  return (entry.pricing ?? "").toLowerCase().includes("free");
}

function formatVersion(version?: string): string | undefined {
  if (!version) return undefined;
  return /^v/i.test(version) ? version : `v${version}`;
}

function formatDate(value?: string): string | undefined {
  if (!value) return undefined;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return undefined;
  }

  return new Date(parsed).toLocaleDateString("en-US", {
    dateStyle: "long"
  });
}

function getPrimaryLinks(entry: DownloadEntry): Array<{ label: string; url: string }> {
  const directDownloads = entry.directDownloads ?? [];

  if (directDownloads.length > 0) {
    return directDownloads.slice(0, 4).map((artifact) => ({
      label: artifact.label,
      url: artifact.url
    }));
  }

  return entry.channels.slice(0, 4).map((channel) => ({
    label: channel.label ?? channel.type,
    url: channel.url
  }));
}

function getVerificationSummary(artifacts: DirectDownloadArtifact[]): string {
  const checksummedCount = artifacts.filter((artifact) => artifact.checksumSha256).length;
  if (checksummedCount === 0) {
    return "This page links to official download channels and tracked release pages when available.";
  }

  return `${checksummedCount} direct download ${checksummedCount === 1 ? "artifact includes" : "artifacts include"} SHA-256 verification data on this page.`;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getDownloads().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params
}: DownloadDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getDownloadBySlug(slug);

  if (!entry) {
    return { title: "Download Not Found" };
  }

  const latestVersion = formatVersion(entry.releaseMetadata?.releaseTag ?? entry.directDownloads?.[0]?.version);
  const latestVersionText = latestVersion ? ` Latest tracked release: ${latestVersion}.` : "";
  const description = `${entry.summary} Download options for ${entry.platforms.join(", ")}.${latestVersionText}`;
  const path = `/downloads/${entry.slug}/`;

  return {
    title: `${entry.name} Download Guide`,
    description,
    keywords: uniqueKeywords([
      `${entry.name} download`,
      `${entry.name} for ${entry.platforms[0]}`,
      `${entry.category.toLowerCase()} software`,
      `${entry.name} official download`,
      `${entry.name} direct download`,
      ...(latestVersion ? [`${entry.name} ${latestVersion} download`] : []),
      ...(entry.developer ? [`${entry.developer} ${entry.name}`] : []),
      ...entry.platforms.map((platform) => `${entry.name} ${platform} download`),
      ...entry.tags
    ]),
    alternates: {
      canonical: path
    },
    robots: buildRobotsIndexRule(path),
    openGraph: buildOpenGraph(`${entry.name} Download Guide | Tamem J`, description, path, "article"),
    twitter: buildTwitter(`${entry.name} Download Guide | Tamem J`, description)
  };
}

export default async function DownloadDetailPage({ params }: DownloadDetailPageProps) {
  const { slug } = await params;
  const entry = getDownloadBySlug(slug);

  if (!entry) {
    notFound();
  }

  const directDownloads = entry.directDownloads ?? [];
  const relatedDownloads = getRelatedDownloads(entry, 6);
  const primaryLinks = getPrimaryLinks(entry);
  const latestReleaseDate = formatDate(entry.releaseMetadata?.publishedAt);
  const latestVersion = formatVersion(entry.releaseMetadata?.releaseTag ?? directDownloads[0]?.version);
  const supportSearchHref = `/support/tickets/?q=${encodeURIComponent(entry.name)}`;
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Downloads", path: "/downloads/" },
    { name: entry.name, path: `/downloads/${entry.slug}/` }
  ]);

  const webPageSchema: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${entry.name} Download Guide`,
    url: toAbsoluteUrl(`/downloads/${entry.slug}/`),
    description: entry.summary,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "CollectionPage",
      name: "Software Downloads",
      url: toAbsoluteUrl("/downloads/")
    }
  };

  const softwareApplicationSchema: WithContext<SoftwareApplication> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: entry.name,
    applicationCategory: entry.category,
    operatingSystem: entry.platforms.join(", "),
    description: entry.summary,
    url: toAbsoluteUrl(`/downloads/${entry.slug}/`),
    downloadUrl: directDownloads[0]?.url ?? entry.channels[0]?.url,
    ...(entry.releaseMetadata?.releaseUrl ? { releaseNotes: entry.releaseMetadata.releaseUrl } : {}),
    ...(entry.developer
      ? {
          author: {
            "@type": "Organization",
            name: entry.developer
          }
        }
      : {}),
    ...(latestVersion ? { softwareVersion: latestVersion } : {}),
    ...(entry.license ? { license: entry.license } : {}),
    ...(isFreeEntry(entry)
      ? {
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock"
          }
        }
      : {})
  };

  const downloadOptionsSchema: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${entry.name} download options`,
    numberOfItems: primaryLinks.length,
    itemListElement: primaryLinks.map((link, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: link.label,
      url: link.url
    }))
  };

  const faqSchema: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${entry.name} free to download?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: entry.pricing
            ? `${entry.name} is listed as ${entry.pricing.toLowerCase()}.`
            : `${entry.name} has download options listed on this page.`
        }
      },
      {
        "@type": "Question",
        name: `Which platforms does ${entry.name} support?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${entry.name} is available for ${entry.platforms.join(", ")}.`
        }
      },
      {
        "@type": "Question",
        name: `Are the ${entry.name} download links official?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. This page links to official website, store, source, or release channels curated for ${entry.name}.`
        }
      },
      {
        "@type": "Question",
        name: `Can I verify the ${entry.name} download before installing it?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: getVerificationSummary(directDownloads)
        }
      }
    ]
  };

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell max-w-6xl space-y-6">
          <div>
            <Link
              href="/downloads/"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              ← Back to Downloads
            </Link>
          </div>

          <section className="surface-card-strong p-6 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-4xl">
                <p className="eyebrow">Software Download Guide</p>
                <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
                  {entry.name}
                </h1>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                  {entry.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <MetaPill label={entry.category} />
                  {entry.platforms.map((platform) => (
                    <MetaPill key={`${entry.slug}-${platform}`} label={platform} />
                  ))}
                  {entry.pricing ? <MetaPill label={entry.pricing} /> : null}
                  {entry.license ? <MetaPill label={entry.license} /> : null}
                </div>
              </div>

              <div className="surface-card w-full max-w-sm p-4 dark:border-slate-700 dark:bg-slate-950">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Quick Facts
                </p>
                <dl className="mt-3 space-y-2 text-sm">
                  {entry.developer ? (
                    <div className="flex items-start justify-between gap-3">
                      <dt className="text-slate-500 dark:text-slate-400">Developer</dt>
                      <dd className="text-right font-medium text-slate-900 dark:text-slate-100">{entry.developer}</dd>
                    </div>
                  ) : null}
                  {latestVersion ? (
                    <div className="flex items-start justify-between gap-3">
                      <dt className="text-slate-500 dark:text-slate-400">Latest tracked release</dt>
                      <dd className="text-right font-medium text-slate-900 dark:text-slate-100">{latestVersion}</dd>
                    </div>
                  ) : null}
                  {latestReleaseDate ? (
                    <div className="flex items-start justify-between gap-3">
                      <dt className="text-slate-500 dark:text-slate-400">Published</dt>
                      <dd className="text-right font-medium text-slate-900 dark:text-slate-100">{latestReleaseDate}</dd>
                    </div>
                  ) : null}
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-slate-500 dark:text-slate-400">Direct downloads</dt>
                    <dd className="text-right font-medium text-slate-900 dark:text-slate-100">
                      {directDownloads.length}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-slate-500 dark:text-slate-400">Official channels</dt>
                    <dd className="text-right font-medium text-slate-900 dark:text-slate-100">
                      {entry.channels.length}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-2">
                  {primaryLinks.map((link) => (
                    <a
                      key={`${entry.slug}-${link.label}-${link.url}`}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary !px-4 !py-2 text-xs"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {entry.releaseMetadata ? (
            <section className="surface-card p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Latest Tracked Release
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    This page is wired to synced release metadata so users can see fresher version and verification
                    details without leaving the catalog.
                  </p>
                </div>
                {entry.releaseMetadata.releaseUrl ? (
                  <a
                    href={entry.releaseMetadata.releaseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary !px-4 !py-2 text-xs"
                  >
                    Open Release Notes
                  </a>
                ) : null}
              </div>
            </section>
          ) : null}

          {directDownloads.length > 0 ? (
            <section className="surface-card p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Direct Downloads</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Official direct download options, with version, file size, and checksum data where available.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {directDownloads.map((artifact) => (
                  <article
                    key={`${entry.slug}-${artifact.label}-${artifact.url}`}
                    className="rounded-2xl border border-line/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{artifact.label}</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {artifact.platform}
                          {artifact.fileType ? ` • ${artifact.fileType}` : ""}
                          {artifact.fileSize ? ` • ${artifact.fileSize}` : ""}
                          {artifact.version ? ` • ${formatVersion(artifact.version)}` : ""}
                        </p>
                      </div>
                      <a
                        href={artifact.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary !px-4 !py-2 text-xs"
                      >
                        Download
                      </a>
                    </div>
                    {artifact.checksumSha256 ? (
                      <div className="mt-3 rounded-xl border border-line/80 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/60">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                          SHA-256
                        </p>
                        <p className="mt-1 break-all font-mono text-xs text-slate-700 dark:text-slate-200">
                          {artifact.checksumSha256}
                        </p>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
            <section className="surface-card p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Official Channels</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {entry.channels.map((channel) => (
                  <a
                    key={`${entry.slug}-${channel.type}-${channel.url}`}
                    href={channel.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      {channel.type}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {channel.label ?? channel.type}
                    </p>
                    <p className="mt-2 text-xs text-accent">Open channel →</p>
                  </a>
                ))}
              </div>
            </section>

            <section className="surface-card p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Use With Other Site Resources</h2>
              <div className="mt-4 space-y-3">
                <Link
                  href={supportSearchHref}
                  className="block rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Search support fixes for {entry.name}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    See whether this app appears in troubleshooting tickets, endpoint guidance, or IT support workflows.
                  </p>
                </Link>
                <Link
                  href="/downloads/assets/"
                  className="block rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Browse IT assets and templates</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Pair software installs with scripts, checklists, and runbooks from the IT asset library.
                  </p>
                </Link>
                <Link
                  href="/guides/"
                  className="block rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Open pillar guides</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Jump into bigger resource hubs covering troubleshooting, operations, downloads, and monetization-aligned topics.
                  </p>
                </Link>
              </div>
            </section>
          </section>

          {relatedDownloads.length > 0 ? (
            <section className="surface-card p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Related Downloads</h2>
                <Link href="/downloads/" className="text-sm font-semibold text-accent hover:underline">
                  Browse full catalog
                </Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {relatedDownloads.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/downloads/${related.slug}/`}
                    className="rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      {related.category}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      {related.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{related.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(downloadOptionsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

function MetaPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
      {label}
    </span>
  );
}
