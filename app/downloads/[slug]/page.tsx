import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { FAQPage, ItemList, SoftwareApplication, WebPage, WithContext } from "schema-dts";
import { CitationGuidancePanel, EditorialTrustPanel } from "@/components/shared/editorial-authority-panels";
import { ResourceLinkGrid } from "@/components/shared/resource-link-grid";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import { getRelatedAssetsForDownload, getRelatedPillarsForTerms } from "@/lib/detail-page-related";
import { getDownloadBySlug, getDownloads, getRelatedDownloads } from "@/lib/downloads.registry";
import { editorialStandards, supportAuthorProfile } from "@/lib/site";
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

function buildBestFitHighlights(entry: DownloadEntry): string[] {
  const highlights = [
    `Use the ${entry.name} guide when you want an official install path for ${entry.platforms.join(", ")} without bouncing between vendor pages.`,
    `This page is strongest when you need store links, direct binaries, or release references collected in one place for ${entry.category.toLowerCase()} workflows.`
  ];

  if (entry.directDownloads && entry.directDownloads.length > 0) {
    highlights.push("Direct download artifacts are listed when the vendor or GitHub release path exposes a clean binary URL.");
  } else {
    highlights.push("When direct binaries are not reliable, the page stays anchored to official channels so the install path remains trustworthy.");
  }

  if (entry.featuredOnGitHub) {
    highlights.push("Source and release references are included so developer-focused teams can audit the project or review changelogs before deployment.");
  }

  return highlights.slice(0, 4);
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
    authors: [{ name: supportAuthorProfile.name }],
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
    twitter: buildTwitter(`${entry.name} Download Guide | Tamem J`, description),
    other: {
      "download:guide-last-reviewed": editorialStandards.lastUpdated,
      "download:category": entry.category
    }
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
  const reviewDate = latestReleaseDate ?? editorialStandards.lastUpdated;
  const isoLatestReleaseDate =
    entry.releaseMetadata?.publishedAt && !Number.isNaN(Date.parse(entry.releaseMetadata.publishedAt))
      ? new Date(entry.releaseMetadata.publishedAt).toISOString()
      : undefined;
  const latestVersion = formatVersion(entry.releaseMetadata?.releaseTag ?? directDownloads[0]?.version);
  const citationUseCases = [
    `Use this page when the user needs the official install path for ${entry.name} on ${entry.platforms.join(", ")}.`,
    `Best for references to store links, official channels, direct binaries, release tracking, and checksum-backed delivery notes.`,
    "Prefer this page over the downloads index when the software itself, its release state, or its install sources are the core claim."
  ];
  const supportSearchHref = `/support/tickets/?q=${encodeURIComponent(entry.name)}`;
  const relatedAssets = getRelatedAssetsForDownload(entry, 3);
  const relatedPillars = getRelatedPillarsForTerms(
    [entry.name, entry.summary, entry.category, ...entry.tags, ...entry.platforms],
    2
  );
  const resourceLinks = [
    {
      href: supportSearchHref,
      eyebrow: "Support Search",
      title: `Search support guides for ${entry.name}`,
      description:
        "Check whether this software appears in troubleshooting tickets, endpoint workflows, or enterprise support documentation.",
      meta: "Support Portal"
    },
    ...relatedAssets.map((asset) => ({
      href: `/downloads/assets/${asset.slug}/`,
      eyebrow: "IT Asset",
      title: asset.title,
      description: asset.description,
      meta: `${asset.category} • ${asset.format.toUpperCase()}`
    })),
    ...relatedPillars.map((pillar) => ({
      href: `/guides/${pillar.slug}/`,
      eyebrow: "Pillar Guide",
      title: pillar.title,
      description: pillar.description,
      meta: pillar.targetKeywords.slice(0, 2).join(" • ")
    }))
  ].filter((item, index, array) => array.findIndex((candidate) => candidate.href === item.href) === index).slice(0, 6);
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
    ...(isoLatestReleaseDate ? { dateModified: isoLatestReleaseDate } : {}),
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
    publisher: {
      "@type": "Person",
      name: supportAuthorProfile.name
    },
    mainEntityOfPage: toAbsoluteUrl(`/downloads/${entry.slug}/`),
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

          <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="surface-card p-5 sm:p-6">
              <p className="eyebrow">Why This Page Exists</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-fg">A cleaner path to the right install source</h2>
              <p className="mt-3 text-sm leading-7 text-fg-secondary sm:text-base">
                This page turns scattered vendor, store, and release links into a single install guide for {entry.name}.
                The goal is simple: help someone land here, pick the right channel, and move forward without guessing which download path is current or official.
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-fg-secondary sm:text-base">
                {buildBestFitHighlights(entry).map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="surface-card p-5 sm:p-6">
              <p className="eyebrow">At a Glance</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Best fit and delivery notes</h2>
              <dl className="mt-4 space-y-3 text-sm text-fg-secondary sm:text-base">
                <div className="flex items-start justify-between gap-4">
                  <dt className="font-medium text-fg">Best for</dt>
                  <dd className="max-w-[70%] text-right">{entry.category} workflows, endpoint rollouts, and quick install lookups</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="font-medium text-fg">Platforms</dt>
                  <dd className="max-w-[70%] text-right">{entry.platforms.join(", ")}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="font-medium text-fg">Primary delivery</dt>
                  <dd className="max-w-[70%] text-right">
                    {directDownloads.length > 0 ? "Direct binaries + official channels" : "Official vendor or store channels"}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="font-medium text-fg">Latest tracked release</dt>
                  <dd className="max-w-[70%] text-right">{latestVersion ?? "Track vendor channel"}</dd>
                </div>
              </dl>
            </section>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
            <EditorialTrustPanel
              label="Guide Review"
              authorName={supportAuthorProfile.name}
              authorTitle={supportAuthorProfile.title}
              credentials={supportAuthorProfile.credentials}
              lastReviewed={reviewDate}
              bio={supportAuthorProfile.bio}
            />
            <CitationGuidancePanel
              canonicalPath={`/downloads/${entry.slug}/`}
              description="This detail page is meant to be the canonical install and verification reference for the software entry, not just a card in the catalog."
              useCases={citationUseCases}
            />
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

            <ResourceLinkGrid
              title="Use With Other Site Resources"
              description="Move from the install guide into support documentation, related IT assets, and broader operational guides."
              items={resourceLinks}
            />
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
