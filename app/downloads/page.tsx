import type { Metadata } from "next";
import Link from "next/link";
import type { FAQPage, ItemList, WebPage, WithContext } from "schema-dts";
import { AffiliateDisclosureBanner } from "@/components/affiliate/affiliate-disclosure-banner";
import { DownloadsBrowser } from "@/components/downloads/downloads-browser";
import { getAffiliateLinkByKey, getAffiliateLinksByKeys } from "@/lib/affiliate-links";
import {
  formatDownloadAssetFileSize,
  getDownloadAssetBundles,
  getDownloadAssetStats
} from "@/lib/download-assets.registry";
import {
  getDownloadCategories,
  getDownloadCategorySlug,
  getDownloads
} from "@/lib/downloads.registry";
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";
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

export async function generateMetadata(): Promise<Metadata> {
  const downloads = getDownloads();
  const assetStats = getDownloadAssetStats();
  const freeCount = downloads.filter(isFreeEntry).length;
  const description = `Browse ${downloads.length} curated software downloads with official store links, GitHub Releases, and direct binaries. Includes ${freeCount} free apps and ${assetStats.total} IT templates/scripts/checklists for enterprise support teams.`;

  return {
    title: "Software Downloads & IT Assets",
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
    robots: {
      index: true,
      follow: true
    },
    openGraph: buildOpenGraph("Software Downloads & IT Assets | Tamem J", description, "/downloads/"),
    twitter: buildTwitter("Software Downloads & IT Assets | Tamem J", description)
  };
}

export default function DownloadsPage() {
  const downloads = getDownloads();
  const downloadCategories = getDownloadCategories();
  const groupedByCategory = [...new Set(downloads.map((entry) => entry.category))]
    .sort((a, b) => a.localeCompare(b))
    .map((category) => ({
      category,
      entries: downloads
        .filter((entry) => entry.category === category)
        .sort((a, b) => a.name.localeCompare(b.name))
    }));
  const assetStats = getDownloadAssetStats();
  const assetBundles = getDownloadAssetBundles();
  const freeCount = downloads.filter(isFreeEntry).length;
  const amazonAffiliate = getAffiliateLinkByKey("amazon-it-gear");
  const amazonFeaturedProductLinks = getAffiliateLinksByKeys([
    "amazon-pick-raspberry-pi-5-starter-kit-pro",
    "amazon-pick-brother-ptd210-label-maker-bundle",
    "amazon-pick-delamu-cable-management-raceway",
    "amazon-pick-samsung-gaming-monitor-ls27fg500snxza",
    "amazon-pick-cyberpowerpc-gxivr8060a40"
  ]);

  const downloadsCollectionSchema = buildCollectionPageJsonLd(
    "Software Downloads",
    `Browse ${downloads.length} curated software downloads with official store listings and direct binaries.`,
    "/downloads/",
    downloads.map((entry) => ({
      name: entry.name,
      path: `/downloads/#${entry.slug}`
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
        url: toAbsoluteUrl(`/downloads/#${entry.slug}`),
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
    name: "Downloads",
    url: toAbsoluteUrl("/downloads/"),
    description:
      "Curated software downloads with official store links, free direct binaries, and GitHub Releases references.",
    dateModified: assetStats.latestUpdatedAt,
    about: [
      { "@type": "Thing", name: "Mac App Store software" },
      { "@type": "Thing", name: "Microsoft Store software" },
      { "@type": "Thing", name: "GitHub Releases software" },
      { "@type": "Thing", name: "Free desktop apps" }
    ]
  };

  const downloadsFaqSchema: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are these downloads free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `${freeCount} entries are marked free, including popular open-source tools and official store listings.`
        }
      },
      {
        "@type": "Question",
        name: "Are download links official?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Store apps link to official Mac App Store or Microsoft Store pages. Direct binaries use vendor websites or GitHub Releases."
        }
      },
      {
        "@type": "Question",
        name: "Can I verify download integrity?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For GitHub-backed direct downloads, version, file size, and SHA-256 metadata are included when available."
        }
      },
      {
        "@type": "Question",
        name: "Do you use affiliate links?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Some recommendation sections may use affiliate links. Disclosures are shown near those links, and purchase price does not change."
        }
      },
      {
        "@type": "Question",
        name: "Do you provide IT scripts and templates?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The IT Download Assets section includes PowerShell scripts, templates, checklists, and runbooks for enterprise operations and support workflows."
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
        <div className="page-shell">
          <AffiliateDisclosureBanner className="mb-6" />
          <div className="mb-6 rounded-2xl border border-line/80 bg-white/85 p-5 shadow-soft dark:border-slate-700 dark:bg-slate-950/70">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  New: IT Admin Download Assets
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {assetStats.total} scripts, templates, checklists, and runbooks
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Includes {assetStats.byAccess.free} free assets. No email gating or premium tiers.
                </p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {formatDownloadAssetFileSize(assetStats.totalFileSizeBytes)} total library size • Updated{" "}
                  {new Date(assetStats.latestUpdatedAt).toLocaleDateString("en-US", {
                    dateStyle: "long"
                  })}
                </p>
              </div>
              <a href="/downloads/assets" className="btn-secondary !px-4 !py-2.5">
                Browse IT Assets
              </a>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {assetBundles.map((bundle) => (
                <a
                  key={bundle.slug}
                  href={`/downloads/assets#${bundle.slug}`}
                  className="rounded-xl border border-line/80 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                >
                  <span className="font-medium">{bundle.title}</span>
                  <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                    {bundle.itemSlugs.length} assets
                  </span>
                </a>
              ))}
            </div>
          </div>
          <section className="mb-6 rounded-2xl border border-line/80 bg-white/85 p-5 shadow-soft dark:border-slate-700 dark:bg-slate-950/70">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Download Categories
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Dedicated landing pages for each software category, not just the filterable main index.
                </p>
              </div>
              <Link href="/downloads/assets" className="text-sm font-semibold text-accent hover:underline">
                IT assets
              </Link>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {downloadCategories.map((category) => (
                <Link
                  key={category}
                  href={`/downloads/category/${getDownloadCategorySlug(category)}/`}
                  className="rounded-xl border border-line/80 bg-slate-50 px-3 py-3 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                >
                  <span className="font-medium">{category}</span>
                  <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                    Open category landing page
                  </span>
                </Link>
              ))}
            </div>
          </section>
          <DownloadsBrowser
            entries={downloads}
            amazonAffiliateUrl={amazonAffiliate?.url}
            amazonFeaturedProducts={amazonFeaturedProductLinks.map((entry) => ({
              label: entry.label,
              url: entry.url
            }))}
          />

          <section className="mt-6 surface-card p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Full Downloads Index</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Crawlable index of all curated software download entries grouped by type.
            </p>
            <div className="mt-4 space-y-3">
              {groupedByCategory.map((group) => (
                <details
                  key={group.category}
                  className="rounded-xl border border-line/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {group.category} ({group.entries.length})
                  </summary>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {group.entries.map((entry) => (
                      <Link
                        key={entry.slug}
                        href={`/downloads/#${entry.slug}`}
                        className="rounded-lg border border-line/70 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                      >
                        {entry.name}
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
