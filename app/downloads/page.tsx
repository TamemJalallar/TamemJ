import type { Metadata } from "next";
import { DownloadsBrowser } from "@/components/downloads/downloads-browser";
import { getAffiliateLinkByKey } from "@/lib/affiliate-links";
import { getDownloads } from "@/lib/downloads.registry";
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

function buildDownloadKeywords(entries: DownloadEntry[]): string[] {
  const topCategories = [...new Set(entries.map((entry) => entry.category))].slice(0, 8);
  const topPlatforms = [...new Set(entries.flatMap((entry) => entry.platforms))];
  const topNames = entries.slice(0, 18).map((entry) => `${entry.name} download`);

  return uniqueKeywords([
    "software downloads",
    "free app downloads",
    "Mac App Store links",
    "Microsoft Store links",
    "GitHub Releases downloads",
    "direct download links",
    "macOS downloads",
    "Windows downloads",
    "Linux downloads",
    "open source software",
    ...topCategories.map((category) => `${category} downloads`),
    ...topPlatforms.map((platform) => `${platform} apps`),
    ...topNames
  ]);
}

export async function generateMetadata(): Promise<Metadata> {
  const downloads = getDownloads();
  const freeCount = downloads.filter(isFreeEntry).length;
  const description = `Browse ${downloads.length} curated software downloads with official store links, GitHub Releases, and direct binaries. Includes ${freeCount} free apps for macOS, Windows, Linux, iOS, Android, and web tools.`;

  return {
    title: "Downloads",
    description,
    keywords: buildDownloadKeywords(downloads),
    category: "Software",
    alternates: {
      canonical: "/downloads/"
    },
    robots: {
      index: true,
      follow: true
    },
    openGraph: buildOpenGraph("Downloads | Tamem J", description, "/downloads/"),
    twitter: buildTwitter("Downloads | Tamem J", description)
  };
}

export default function DownloadsPage() {
  const downloads = getDownloads();
  const freeCount = downloads.filter(isFreeEntry).length;
  const amazonAffiliate = getAffiliateLinkByKey("amazon-it-gear");

  const downloadsCollectionSchema = buildCollectionPageJsonLd(
    "Software Downloads",
    `Browse ${downloads.length} curated software downloads with official store listings and direct binaries.`,
    "/downloads/",
    downloads.map((entry) => ({
      name: entry.name,
      path: `/downloads/#${entry.slug}`
    }))
  );

  const softwareListSchema = {
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

  const downloadsWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Downloads",
    url: toAbsoluteUrl("/downloads/"),
    description:
      "Curated software downloads with official store links, free direct binaries, and GitHub Releases references.",
    about: [
      { "@type": "Thing", name: "Mac App Store software" },
      { "@type": "Thing", name: "Microsoft Store software" },
      { "@type": "Thing", name: "GitHub Releases software" },
      { "@type": "Thing", name: "Free desktop apps" }
    ]
  };

  const downloadsFaqSchema = {
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
      }
    ]
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Downloads", path: "/downloads/" }
  ]);

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell">
          <DownloadsBrowser entries={downloads} amazonAffiliateUrl={amazonAffiliate?.url} />
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
