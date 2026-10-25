import type { Metadata } from "next";
import Link from "next/link";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import { buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";
import {
  getPillarContentIdeas,
  getTopSeoKeywordOpportunities,
} from "@/lib/seo-content.registry";
import { siteConfig } from "@/lib/site";
import { getCorporateFixes } from "@/lib/corporate-fixes.registry";
import { getDownloads } from "@/lib/downloads.registry";
import { getKBArticleBySlug, getKBArticles } from "@/lib/support.kb.registry";

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

function parseDateValue(value?: string): number {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

const homeKeywordOpportunities = getTopSeoKeywordOpportunities(30);

export const metadata: Metadata = {
  title: "Enterprise IT Troubleshooting Guides & Downloads",
  description:
    "Enterprise IT troubleshooting knowledge base with Microsoft 365, Intune, Entra, networking, and endpoint fixes plus downloadable admin scripts and templates.",
  keywords: uniqueKeywords([
    "IT troubleshooting guides",
    "enterprise IT support",
    "corporate tech fixes",
    "Microsoft 365 troubleshooting",
    "Intune troubleshooting",
    "Entra ID troubleshooting",
    "PowerShell scripts",
    "IT knowledge base",
    "helpdesk resources",
    "sysadmin tools",
    "IT download assets",
    ...homeKeywordOpportunities.map((entry) => entry.keyword),
  ]),
  alternates: {
    canonical: "/",
  },
  robots: buildRobotsIndexRule("/"),
  openGraph: buildOpenGraph(
    "Enterprise IT Troubleshooting Guides & Downloads | Tamem J",
    "Microsoft 365, endpoint, identity, networking, and security troubleshooting guides with practical scripts and templates.",
    "/",
  ),
  twitter: buildTwitter(
    "Enterprise IT Troubleshooting Guides & Downloads | Tamem J",
    "Microsoft 365, endpoint, identity, networking, and security troubleshooting guides with practical scripts and templates.",
  ),
};

const trendingArticleSlugs = [
  "outlook-search-not-working-windows-macos",
  "teams-microphone-not-detected-enterprise",
  "onedrive-processing-changes-or-stuck-syncing",
  "sharepoint-access-denied-site-library-file",
  "intune-windows-device-not-checking-in-or-compliance-stale",
  "vpn-connected-but-no-internet-or-internal-access",
] as const;

const topCategoryConfig = [
  {
    label: "M365",
    description: "Outlook, Teams, OneDrive, SharePoint",
    href: "/support/tickets/?q=microsoft%20365",
    match: (category: string) => category === "Microsoft 365",
  },
  {
    label: "Windows",
    description: "OS, Intune, drivers, endpoint health",
    href: "/support/tickets/?q=windows",
    match: (category: string) => category === "Windows",
  },
  {
    label: "Security",
    description: "MFA, SSO, Conditional Access",
    href: "/support/tickets/?q=identity%20mfa%20sso",
    match: (category: string) => category === "Identity / MFA / SSO",
  },
  {
    label: "Networking",
    description: "VPN, DNS, Wi-Fi, access paths",
    href: "/support/tickets/?q=vpn%20networking",
    match: (category: string) => category === "Networking / VPN",
  },
] as const;

const primaryWorkspaceConfig = [
  {
    label: "Tickets",
    href: "/support/tickets",
    eyebrow: "Troubleshooting",
    description:
      "Issue-specific fixes for Microsoft 365, Windows, identity, networking, and endpoint support.",
  },
  {
    label: "Downloads",
    href: "/downloads",
    eyebrow: "Assets",
    description:
      "Direct software links, scripts, templates, and support-ready resources for working admins.",
  },
  {
    label: "Guides",
    href: "/guides",
    eyebrow: "Pillar Content",
    description:
      "Broader Microsoft 365, identity, network, and operations guides that connect the library together.",
  },
  {
    label: "Tech Fixes",
    href: "/corporate-tech-fixes",
    eyebrow: "Runbooks",
    description:
      "Structured, enterprise-safe remediation paths for recurring corporate support issues.",
  },
] as const;

export default function HomePage() {
  const kbArticles = getKBArticles();
  const corporateFixes = getCorporateFixes();
  const downloads = getDownloads();
  const pillarGuides = getPillarContentIdeas().slice(0, 4);
  const featuredDownloadGuides = [...downloads]
    .filter((entry) => entry.releaseMetadata?.publishedAt)
    .sort(
      (left, right) =>
        parseDateValue(right.releaseMetadata?.publishedAt) -
        parseDateValue(left.releaseMetadata?.publishedAt),
    )
    .slice(0, 4);
  const totalGuides =
    kbArticles.length + corporateFixes.length + getPillarContentIdeas().length;

  const primaryWorkspaceCounts: Record<string, number> = {
    "/corporate-tech-fixes": corporateFixes.length,
    "/support/tickets": kbArticles.length,
    "/downloads": downloads.length,
    "/guides": getPillarContentIdeas().length,
  };

  const topCategories = topCategoryConfig.map((config) => ({
    ...config,
    count: kbArticles.filter((article) => config.match(article.category))
      .length,
  }));

  const trendingArticles = trendingArticleSlugs
    .map((slug) => getKBArticleBySlug(slug))
    .filter((article): article is NonNullable<typeof article> =>
      Boolean(article),
    );

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "TamemJ Enterprise IT Knowledge Hub",
    description:
      "Enterprise IT troubleshooting guides, downloads, and support resources.",
    url: siteConfig.url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: trendingArticles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: article.title,
        url: toAbsoluteUrl(`/support/tickets/${article.slug}/`),
      })),
    },
  };

  return (
    <div className="home-redesign">
      <section className="home-hero page-shell" aria-labelledby="home-title">
        <div className="home-intro">
          <h1 id="home-title">
            Find your
            <br />
            next IT fix.
          </h1>
          <p>
            Practical troubleshooting for Microsoft 365, Windows, identity, and
            the systems you support every day.
          </p>
          <form
            action="/support/tickets/"
            method="get"
            className="home-search"
            role="search"
          >
            <label htmlFor="home-guide-search" className="sr-only">
              Search support guides
            </label>
            <input
              id="home-guide-search"
              name="q"
              type="search"
              placeholder="An error message, app, or issue…"
            />
            <button type="submit" className="btn-primary">
              Search guides
            </button>
          </form>
          <div className="home-search-examples">
            <span>Try</span>
            <Link href="/support/tickets/?q=outlook">Outlook search</Link>
            <Link href="/support/tickets/?q=vpn">VPN connection</Link>
            <Link href="/support/tickets/?q=mfa">MFA</Link>
          </div>
        </div>
        <aside className="home-directory" aria-label="Resource library">
          <h2>Your IT library</h2>
          <p>
            {totalGuides} fixes and guides. A place to start when something
            stops working.
          </p>
          {primaryWorkspaceConfig.map((workspace) => (
            <Link
              key={workspace.href}
              href={workspace.href}
              className="directory-row"
            >
              <span>{workspace.label}</span>
              <span>{primaryWorkspaceCounts[workspace.href]}</span>
            </Link>
          ))}
          <Link className="home-standards" href="/editorial-standards/">
            How these resources are maintained
          </Link>
        </aside>
      </section>

      <section
        className="home-resources page-shell"
        aria-labelledby="fixes-heading"
      >
        <div className="home-section-heading">
          <div>
            <h2 id="fixes-heading">Start with a fix</h2>
            <p>Common problems, with a practical path forward.</p>
          </div>
          <Link href="/support/tickets/">Browse all tickets</Link>
        </div>
        <div className="home-fixes-layout">
          <div className="home-fix-list">
            {trendingArticles.map((article) => (
              <Link
                href={`/support/tickets/${article.slug}/`}
                key={article.slug}
                className="home-fix"
              >
                <div>
                  <span className="home-meta">{article.category}</span>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                </div>
                <span className="home-time">{article.estimatedTime}</span>
              </Link>
            ))}
          </div>
          <aside className="home-topics">
            <h3>Browse by system</h3>
            {topCategories.map((category) => (
              <Link href={category.href} key={category.label}>
                <span>{category.label}</span>
                <p>{category.description}</p>
                <small>{category.count} articles</small>
              </Link>
            ))}
          </aside>
        </div>
      </section>

      <section className="home-learning" aria-labelledby="learning-heading">
        <div className="page-shell home-learning-inner">
          <div className="home-learning-intro">
            <h2 id="learning-heading">Go a little deeper.</h2>
            <p>
              Work through the bigger picture with guides to the tools and
              systems behind the ticket.
            </p>
            <Link href="/guides/" className="btn-primary">
              Explore guides
            </Link>
          </div>
          <div className="home-guide-list">
            {pillarGuides.map((guide) => (
              <Link href={`/guides/${guide.slug}/`} key={guide.slug}>
                <h3>{guide.title}</h3>
                <p>{guide.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className="home-downloads page-shell"
        aria-labelledby="downloads-heading"
      >
        <div className="home-section-heading">
          <div>
            <h2 id="downloads-heading">Tools for the job</h2>
            <p>Software and resources to keep close at hand.</p>
          </div>
          <Link href="/downloads/">All downloads</Link>
        </div>
        <div className="home-download-list">
          {featuredDownloadGuides.map((entry) => (
            <Link href={`/downloads/${entry.slug}/`} key={entry.slug}>
              <span className="home-meta">{entry.category}</span>
              <h3>{entry.name}</h3>
              <p>{entry.summary}</p>
              <span className="home-release">
                {entry.releaseMetadata?.releaseTag ?? "Available"}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="home-contact page-shell"
        aria-labelledby="contact-heading"
      >
        <div>
          <h2 id="contact-heading">Need a hand?</h2>
          <p>
            I help small teams manage Microsoft 365, Google Workspace,
            endpoints, and day-to-day IT operations.
          </p>
        </div>
        <div>
          <Link href="/contact/" className="btn-primary">
            Get in touch
          </Link>
          <Link href="/services/msp/">Explore managed IT services</Link>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
    </div>
  );
}
