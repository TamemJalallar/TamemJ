import type { Metadata } from "next";
import Link from "next/link";
import type { FAQPage, ItemList, WebPage, WithContext } from "schema-dts";
import { AffiliateDisclosureBanner } from "@/components/affiliate/affiliate-disclosure-banner";
import { DownloadsBrowser } from "@/components/downloads/downloads-browser";
import { EditorialStandardsStrip } from "@/components/shared/editorial-authority-panels";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import { getAffiliateLinkByKey, getAffiliateLinksByKeys } from "@/lib/affiliate-links";
import { getDownloadAssetBundles, getDownloadAssetStats } from "@/lib/download-assets.registry";
import { getDownloads } from "@/lib/downloads.registry";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildOpenGraph,
  buildTwitter,
  toAbsoluteUrl
} from "@/lib/seo";
import type { DownloadEntry } from "@/types/download";

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

function hasStoreChannel(entry: DownloadEntry): boolean {
  return entry.channels.some(
    (channel) => channel.type === "Mac App Store" || channel.type === "Microsoft Store"
  );
}

function hasDirectDownloads(entry: DownloadEntry): boolean {
  return (entry.directDownloads?.length ?? 0) > 0;
}

function downloadSeoScore(entry: DownloadEntry): number {
  const popularity = (entry.popularityLabel ?? "").toLowerCase();
  let score = 0;
  if (popularity.includes("most used")) score += 8;
  if (popularity.includes("popular")) score += 4;
  if (entry.featuredOnGitHub) score += 3;
  if (entry.platforms.includes("Windows")) score += 1;
  if (entry.platforms.includes("macOS")) score += 1;
  if (entry.platforms.includes("Web")) score += 1;
  if (isFreeEntry(entry)) score += 1;
  return score;
}

function buildDownloadKeywords(entries: DownloadEntry[]): string[] {
  const topCategories = [...new Set(entries.map((entry) => entry.category))].sort((a, b) =>
    a.localeCompare(b)
  );
  const topPlatforms = [...new Set(entries.flatMap((entry) => entry.platforms))];
  const topDevelopers = [
    ...new Set(entries.map((entry) => entry.developer).filter((value): value is string => Boolean(value)))
  ].slice(0, 18);
  const topNames = [...entries]
    .sort((a, b) => downloadSeoScore(b) - downloadSeoScore(a) || a.name.localeCompare(b.name))
    .slice(0, 36)
    .map((entry) => `${entry.name} download`);

  return uniqueKeywords([
    "software downloads",
    "free app downloads",
    "safe software downloads",
    "official software download links",
    "best free software",
    "Mac App Store links",
    "Microsoft Store links",
    "GitHub Releases downloads",
    "direct download links",
    "macOS downloads",
    "Windows downloads",
    "Linux downloads",
    "open source software",
    ...topCategories.map((category) => `${category} downloads`),
    ...topCategories.map((category) => `${category} tools`),
    ...topPlatforms.map((platform) => `${platform} apps`),
    ...topDevelopers.map((developer) => `${developer} software`),
    ...topNames
  ]);
}

function parseDateValue(value?: string): number {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export async function generateMetadata(): Promise<Metadata> {
  const downloads = getDownloads();
  const assetStats = getDownloadAssetStats();
  const freeCount = downloads.filter(isFreeEntry).length;
  const description = `Browse ${downloads.length} curated software downloads with official store links, GitHub Releases, and direct binaries. Includes ${freeCount} free apps and ${assetStats.total} IT templates, scripts, and support assets.`;

  return {
    title: "Downloads & IT Assets",
    description,
    keywords: uniqueKeywords([
      ...buildDownloadKeywords(downloads),
      "it download assets",
      "powershell scripts download",
      "it templates download",
      "it checklist download",
      "it runbook template",
      "it admin toolkit"
    ]),
    category: "Software",
    alternates: {
      canonical: "/downloads/"
    },
    robots: buildRobotsIndexRule("/downloads/"),
    openGraph: buildOpenGraph("Downloads & IT Assets | Tamem J", description, "/downloads/"),
    twitter: buildTwitter("Downloads & IT Assets | Tamem J", description)
  };
}

export default function DownloadsPage() {
  const downloads = getDownloads();
  const assetStats = getDownloadAssetStats();
  const assetBundles = getDownloadAssetBundles();
  const freeCount = downloads.filter(isFreeEntry).length;
  const storeLinkedCount = downloads.filter(hasStoreChannel).length;
  const directBinaryCount = downloads.filter(hasDirectDownloads).length;
  const trackedReleaseEntries = [...downloads]
    .filter((entry) => entry.releaseMetadata?.publishedAt)
    .sort(
      (left, right) =>
        parseDateValue(right.releaseMetadata?.publishedAt) -
        parseDateValue(left.releaseMetadata?.publishedAt)
    )
    .slice(0, 6);
  const groupedByCategory = [...new Set(downloads.map((entry) => entry.category))]
    .sort((a, b) => a.localeCompare(b))
    .map((category) => ({
      category,
      entries: downloads
        .filter((entry) => entry.category === category)
        .sort((a, b) => a.name.localeCompare(b.name))
    }));
  const featuredCategories = groupedByCategory.slice(0, 6);
  const amazonAffiliate = getAffiliateLinkByKey("amazon-it-gear");
  const amazonFeaturedProductLinks = getAffiliateLinksByKeys([
    "amazon-pick-raspberry-pi-5-starter-kit-pro",
    "amazon-pick-brother-ptd210-label-maker-bundle",
    "amazon-pick-delamu-cable-management-raceway",
    "amazon-pick-samsung-gaming-monitor-ls27fg500snxza",
    "amazon-pick-cyberpowerpc-gxivr8060a40"
  ]);

  const downloadsCollectionSchema = buildCollectionPageJsonLd(
    "Software Downloads and IT Assets",
    `Browse ${downloads.length} curated software downloads with official store listings, direct binaries, and IT support assets.`,
    "/downloads/",
    downloads.map((entry) => ({
      name: entry.name,
      path: `/downloads/${entry.slug}/`
    }))
  );

  const softwareListSchema: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Downloadable Software Catalog",
    numberOfItems: downloads.length,
    description:
      "Curated software downloads with official Mac App Store, Microsoft Store, GitHub Releases, and direct download links.",
    itemListElement: downloads.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: entry.name,
        description: entry.summary,
        applicationCategory: entry.category,
        operatingSystem: entry.platforms.join(", "),
        url: toAbsoluteUrl(`/downloads/${entry.slug}/`),
        downloadUrl: entry.directDownloads?.[0]?.url ?? entry.channels[0]?.url,
        ...(entry.releaseNotesUrl ? { releaseNotes: entry.releaseNotesUrl } : {}),
        ...(entry.license ? { license: entry.license } : {}),
        ...(entry.developer
          ? {
              author: {
                "@type": "Organization",
                name: entry.developer
              }
            }
          : {}),
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
      }
    }))
  };

  const downloadsWebPageSchema: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Downloads & IT Assets",
    url: toAbsoluteUrl("/downloads/"),
    description:
      "Curated software downloads with official store links, direct binaries, GitHub Releases references, and IT support asset bundles.",
    about: [
      { "@type": "Thing", name: "Mac App Store software" },
      { "@type": "Thing", name: "Microsoft Store software" },
      { "@type": "Thing", name: "GitHub Releases software" },
      { "@type": "Thing", name: "IT support scripts and templates" }
    ]
  };

  const downloadsFaqSchema: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are these download links official?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Store apps link to official Mac App Store or Microsoft Store pages. Direct binaries use vendor websites or GitHub Releases when available."
        }
      },
      {
        "@type": "Question",
        name: "What is included in IT Download Assets?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `The asset library includes ${assetStats.total} scripts, templates, checklists, and runbooks for enterprise support workflows.`
        }
      },
      {
        "@type": "Question",
        name: "Are there download bundles?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. ${assetBundles.length} bundle packs group related IT assets for onboarding, Microsoft 365 administration, PowerShell operations, and security workflows.`
        }
      },
      {
        "@type": "Question",
        name: "Can I verify download integrity?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For GitHub-backed direct downloads, version, file size, and SHA-256 metadata are included when available."
        }
      }
    ]
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Downloads", path: "/downloads/" }
  ]);

  return (
    <>
      <section className="section-shell pt-8 sm:pt-10">
        <div className="page-shell space-y-6">
          <section className="hero-surface p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 top-0 h-56 w-56 rounded-full bg-primary-300/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-12 bottom-0 h-52 w-52 rounded-full bg-accent-400/10 blur-3xl" />

            <div className="relative grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
              <div>
                <p className="eyebrow text-primary-100">Downloads</p>
                <h1 className="mt-4 max-w-3xl text-balance font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Software downloads, direct binaries, and IT assets in one cleaner workspace.
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-primary-100/90 sm:text-base">
                  This page now acts as the front door for both curated software and practical support assets.
                  Use it to find trusted app links, direct downloads, fresh release pages, and bundled IT resources
                  without digging through separate sections first.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#downloads-browser" className="btn-primary">
                    Browse Software
                  </a>
                  <Link href="/downloads/assets" className="btn-secondary">
                    Open IT Assets
                  </Link>
                  <Link href="/support/tickets" className="btn-ghost !text-white hover:!bg-white/10 hover:!text-white">
                    Open Support Tickets
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">
                    Curated Software
                  </p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{downloads.length}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Apps with official store and download paths</p>
                </article>
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">
                    Free Picks
                  </p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{freeCount}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Free apps prioritized in the browse experience</p>
                </article>
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">
                    IT Assets
                  </p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{assetStats.total}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Scripts, templates, checklists, and runbooks</p>
                </article>
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">
                    Bundles
                  </p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{assetBundles.length}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Role-based packs for faster download decisions</p>
                </article>
              </div>
            </div>
          </section>

          <EditorialStandardsStrip
            title="How the download library is reviewed"
            description="Downloads are curated around support usefulness first: official store links stay preferred when available, direct binaries are only surfaced when the path is clear, and related IT assets stay attached so the page solves more than the install step."
          />

          <section className="grid gap-4 lg:grid-cols-3">
            <article className="surface-card-interactive p-5 sm:p-6">
              <p className="eyebrow">Software Library</p>
              <h2 className="mt-3 font-display text-xl font-semibold text-fg">Find trusted download paths faster</h2>
              <p className="mt-3 text-sm leading-7 text-fg-secondary">
                Search by app, platform, category, and release channel. Store links stay first when available,
                and direct binaries surface with metadata when they are safe to expose.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                <span className="filter-chip px-2.5 py-1">{storeLinkedCount} store-backed listings</span>
                <span className="filter-chip px-2.5 py-1">{directBinaryCount} apps with direct binaries</span>
              </div>
            </article>

            <article className="surface-card-interactive p-5 sm:p-6">
              <p className="eyebrow">IT Assets</p>
              <h2 className="mt-3 font-display text-xl font-semibold text-fg">Pair downloads with operational assets</h2>
              <p className="mt-3 text-sm leading-7 text-fg-secondary">
                The asset library carries the support-side resources behind the software catalog: PowerShell scripts,
                Excel trackers, checklists, and runbooks for day-to-day IT work.
              </p>
              <div className="mt-5">
                <Link href="/downloads/assets" className="btn-secondary">
                  Browse IT Assets
                </Link>
              </div>
            </article>

            <article className="surface-card-interactive p-5 sm:p-6">
              <p className="eyebrow">Bundle Packs</p>
              <h2 className="mt-3 font-display text-xl font-semibold text-fg">Download grouped starter packs</h2>
              <p className="mt-3 text-sm leading-7 text-fg-secondary">
                Bundles turn individual assets into clearer starter paths for helpdesk, M365 admins, PowerShell-heavy workflows,
                and security/compliance planning.
              </p>
              <div className="mt-4 space-y-2 text-sm text-fg-secondary">
                {assetBundles.slice(0, 3).map((bundle) => (
                  <p key={bundle.slug}>
                    <span className="font-semibold text-fg">{bundle.title}:</span> {bundle.itemSlugs.length} related assets.
                  </p>
                ))}
              </div>
            </article>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow">Browse by Category</p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Top software lanes</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-fg-secondary">
                  These are the main categories people will scan first. The browser below still includes the full catalog,
                  but this gives a cleaner starting point before filtering.
                </p>
              </div>
              <a href="#all-downloads" className="btn-secondary">
                Jump to Full Index
              </a>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {featuredCategories.map((group) => (
                <article key={group.category} className="surface-card rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-fg">{group.category}</h3>
                    <span className="filter-chip px-2.5 py-1 text-xs">{group.entries.length} apps</span>
                  </div>
                  <p className="mt-3 text-sm text-fg-secondary">
                    {group.entries.slice(0, 3).map((entry) => entry.name).join(", ")}
                    {group.entries.length > 3 ? `, and ${group.entries.length - 3} more.` : "."}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <article className="surface-card p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Bundle Downloads</p>
                  <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Start with grouped asset packs</h2>
                </div>
                <Link href="/downloads/assets" className="btn-secondary !px-4 !py-2 text-xs">
                  View Asset Library
                </Link>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {assetBundles.map((bundle) => (
                  <a
                    key={bundle.slug}
                    href={`/downloads/assets#${bundle.slug}`}
                    className="surface-card-interactive rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-fg">{bundle.title}</h3>
                      <span className="filter-chip px-2.5 py-1 text-xs">{bundle.itemSlugs.length} assets</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-fg-secondary">{bundle.description}</p>
                    <p className="mt-3 text-xs font-medium text-primary-600 dark:text-primary-300">Open bundle →</p>
                  </a>
                ))}
              </div>
            </article>

            {trackedReleaseEntries.length > 0 ? (
              <article className="surface-card p-5 sm:p-6">
                <p className="eyebrow">Fresh Release Pages</p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Latest tracked updates</h2>
                <p className="mt-2 text-sm leading-7 text-fg-secondary">
                  These detail pages have recent release metadata attached, which makes them the best starting point when you need current versions quickly.
                </p>
                <div className="mt-5 space-y-3">
                  {trackedReleaseEntries.map((entry) => (
                    <Link
                      key={entry.slug}
                      href={`/downloads/${entry.slug}/`}
                      className="surface-card-interactive block rounded-2xl p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{entry.category}</p>
                      <h3 className="mt-2 text-base font-semibold text-fg">{entry.name}</h3>
                      <p className="mt-2 text-sm text-fg-secondary">{entry.summary}</p>
                      <p className="mt-3 text-xs text-muted">
                        Latest tracked release: {entry.releaseMetadata?.releaseTag ?? "Available"}
                      </p>
                    </Link>
                  ))}
                </div>
              </article>
            ) : null}
          </section>

          <div id="downloads-browser">
            <AffiliateDisclosureBanner className="mb-6 max-w-5xl" />
            <DownloadsBrowser
              entries={downloads}
              amazonAffiliateUrl={amazonAffiliate?.url}
              amazonStorefrontHref="/recommended-gear/"
              amazonFeaturedProducts={amazonFeaturedProductLinks.map((entry) => ({
                label: entry.label,
                url: entry.url
              }))}
            />
          </div>

          <section className="surface-card p-5 sm:p-6" id="all-downloads">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow">Full Directory</p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Full downloads directory</h2>
                <p className="mt-2 text-sm leading-7 text-fg-secondary">
                  Every curated software page lives here in a plain category index so people can browse the library without relying on filters alone.
                </p>
              </div>
              <span className="filter-chip px-3 py-1 text-xs">
                {downloads.length} total software pages
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {groupedByCategory.map((group) => (
                <details key={group.category} className="surface-card rounded-2xl p-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-fg">
                    {group.category} ({group.entries.length})
                  </summary>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {group.entries.map((entry) => (
                      <Link
                        key={entry.slug}
                        href={`/downloads/${entry.slug}/`}
                        className="filter-chip justify-start rounded-lg px-3 py-2 text-sm"
                      >
                        <span className="font-medium">{entry.name}</span>
                        {entry.releaseMetadata?.releaseTag ? (
                          <span className="ml-2 text-xs text-muted">{entry.releaseMetadata.releaseTag}</span>
                        ) : null}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(downloadsCollectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(downloadsWebPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(downloadsFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
