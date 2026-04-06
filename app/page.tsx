import type { Metadata } from "next";
import Link from "next/link";
import { AppCard } from "@/components/app-card";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import { getFeaturedApps } from "@/lib/apps";
import { appsSectionEnabled } from "@/lib/apps-visibility";
import { buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";
import { getPillarContentIdeas, getTopSeoKeywordOpportunities } from "@/lib/seo-content.registry";
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
    ...homeKeywordOpportunities.map((entry) => entry.keyword)
  ]),
  alternates: {
    canonical: "/"
  },
  robots: buildRobotsIndexRule("/"),
  openGraph: buildOpenGraph(
    "Enterprise IT Troubleshooting Guides & Downloads | Tamem J",
    "Microsoft 365, endpoint, identity, networking, and security troubleshooting guides with practical scripts and templates.",
    "/"
  ),
  twitter: buildTwitter(
    "Enterprise IT Troubleshooting Guides & Downloads | Tamem J",
    "Microsoft 365, endpoint, identity, networking, and security troubleshooting guides with practical scripts and templates."
  )
};

const trendingArticleSlugs = [
  "outlook-search-not-working-windows-macos",
  "teams-microphone-not-detected-enterprise",
  "onedrive-processing-changes-or-stuck-syncing",
  "sharepoint-access-denied-site-library-file",
  "intune-windows-device-not-checking-in-or-compliance-stale",
  "vpn-connected-but-no-internet-or-internal-access"
] as const;

const topCategoryConfig = [
  {
    label: "M365",
    description: "Outlook, Teams, OneDrive, SharePoint",
    href: "/support/tickets/?q=microsoft%20365",
    match: (category: string) => category === "Microsoft 365"
  },
  {
    label: "Windows",
    description: "OS, Intune, drivers, endpoint health",
    href: "/support/tickets/?q=windows",
    match: (category: string) => category === "Windows"
  },
  {
    label: "Security",
    description: "MFA, SSO, Conditional Access",
    href: "/support/tickets/?q=identity%20mfa%20sso",
    match: (category: string) => category === "Identity / MFA / SSO"
  },
  {
    label: "Networking",
    description: "VPN, DNS, Wi-Fi, access paths",
    href: "/support/tickets/?q=vpn%20networking",
    match: (category: string) => category === "Networking / VPN"
  }
] as const;

const primaryWorkspaceConfig = [
  {
    label: "Tech Fixes",
    href: "/corporate-tech-fixes",
    eyebrow: "Runbooks",
    description: "Structured, enterprise-safe remediation guides for recurring corporate issues."
  },
  {
    label: "Tickets",
    href: "/support/tickets",
    eyebrow: "Knowledge Base",
    description: "Searchable troubleshooting articles built around real helpdesk and sysadmin workflows."
  },
  {
    label: "Downloads",
    href: "/downloads",
    eyebrow: "Assets",
    description: "Curated software, templates, scripts, and support-ready resources."
  },
  {
    label: "Apps",
    href: "/apps",
    eyebrow: "Products",
    description: "Production apps, in-progress products, and public-facing build documentation."
  }
] as const;

const trustPillars = [
  {
    title: "Enterprise-safe documentation",
    detail: "Guides are written for production environments and avoid security-bypass patterns."
  },
  {
    title: "Search-first support experience",
    detail: "Users can jump straight into fixes, templates, and downloads without digging through menus."
  },
  {
    title: "Practical operator tooling",
    detail: "Downloads, scripts, and templates sit next to the articles they support."
  }
] as const;

const quickActionLinks = [
  { label: "Search Tickets", href: "/support/tickets" },
  { label: "Browse Downloads", href: "/downloads" },
  { label: "Open Tech Fixes", href: "/corporate-tech-fixes" },
  { label: "View Apps", href: "/apps" }
] as const;

export default function HomePage() {
  const kbArticles = getKBArticles();
  const corporateFixes = getCorporateFixes();
  const downloads = getDownloads();
  const featuredApps = appsSectionEnabled ? getFeaturedApps().slice(0, 3) : [];
  const pillarGuides = getPillarContentIdeas().slice(0, 4);
  const featuredDownloadGuides = [...downloads]
    .filter((entry) => entry.releaseMetadata?.publishedAt)
    .sort(
      (left, right) =>
        parseDateValue(right.releaseMetadata?.publishedAt) -
        parseDateValue(left.releaseMetadata?.publishedAt)
    )
    .slice(0, 4);
  const keywordOpportunities = homeKeywordOpportunities.slice(0, 10);
  const totalGuides = kbArticles.length + corporateFixes.length;
  const totalSupportCategories = new Set(kbArticles.map((article) => article.category)).size;

  const primaryWorkspaces = primaryWorkspaceConfig.filter(
    (entry) => entry.href !== "/apps" || appsSectionEnabled
  );

  const primaryWorkspaceCounts: Record<string, number> = {
    "/corporate-tech-fixes": corporateFixes.length,
    "/support/tickets": kbArticles.length,
    "/downloads": downloads.length,
    "/apps": featuredApps.length
  };

  const topCategories = topCategoryConfig.map((config) => ({
    ...config,
    count: kbArticles.filter((article) => config.match(article.category)).length
  }));

  const trendingArticles = trendingArticleSlugs
    .map((slug) => getKBArticleBySlug(slug))
    .filter((article): article is NonNullable<typeof article> => Boolean(article));

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "TamemJ Enterprise IT Knowledge Hub",
    description: "Enterprise IT troubleshooting guides, downloads, and support resources.",
    url: siteConfig.url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: trendingArticles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: article.title,
        url: toAbsoluteUrl(`/support/tickets/${article.slug}/`)
      }))
    }
  };

  const queryIntentSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Popular IT troubleshooting search intents",
    numberOfItems: keywordOpportunities.length,
    itemListElement: keywordOpportunities.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.keyword,
      url: toAbsoluteUrl(`/support/tickets/?q=${encodeURIComponent(entry.keyword)}`)
    }))
  };

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14 lg:pt-20">
        <div className="page-shell">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="hero-surface p-6 sm:p-8 lg:p-12">
              <span className="eyebrow">Enterprise IT Knowledge Hub</span>
              <h1 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                A cleaner way to find <span className="text-primary-500 dark:text-accent-300">fixes, tools, downloads, and products</span>
              </h1>
              <p className="mt-4 max-w-3xl text-base text-fg-secondary sm:text-lg">
                Search troubleshooting guides, jump into support workflows, download practical assets,
                and explore products without bouncing between disconnected sections.
              </p>

              <form action="/support/tickets/" method="get" className="mt-7">
                <label htmlFor="home-guide-search" className="sr-only">
                  Search support guides
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="home-guide-search"
                    name="q"
                    type="search"
                    defaultValue=""
                    placeholder="Search troubleshooting guides, KBs, or error messages"
                    className="form-input h-12"
                  />
                  <button type="submit" className="btn-primary h-12 shrink-0 px-6 py-0">
                    Search
                  </button>
                </div>
              </form>

              <div className="mt-5 flex flex-wrap gap-2">
                {quickActionLinks
                  .filter((item) => item.href !== "/apps" || appsSectionEnabled)
                  .map((item) => (
                    <Link key={item.href} href={item.href} className="btn-secondary !px-4 !py-2 text-xs sm:text-sm">
                      {item.label}
                    </Link>
                  ))}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="surface-card p-4">
                  <p className="font-display text-2xl font-bold text-primary-600 dark:text-primary-300">{totalGuides}+</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">Guides + fixes</p>
                </div>
                <div className="surface-card p-4">
                  <p className="font-display text-2xl font-bold text-primary-600 dark:text-primary-300">{kbArticles.length}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">Support tickets</p>
                </div>
                <div className="surface-card p-4">
                  <p className="font-display text-2xl font-bold text-primary-600 dark:text-primary-300">{downloads.length}+</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">Downloads</p>
                </div>
                <div className="surface-card p-4">
                  <p className="font-display text-2xl font-bold text-primary-600 dark:text-primary-300">{totalSupportCategories}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">Support categories</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="surface-card-strong p-5 sm:p-6">
                <p className="eyebrow">Start Here</p>
                <div className="mt-4 space-y-3">
                  {primaryWorkspaces.map((workspace) => (
                    <Link
                      key={workspace.href}
                      href={workspace.href}
                      className="surface-card-interactive flex items-start justify-between gap-4 rounded-2xl p-4"
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                          {workspace.eyebrow}
                        </p>
                        <h2 className="mt-1 font-display text-lg font-semibold text-fg">
                          {workspace.label}
                        </h2>
                        <p className="mt-2 text-sm text-fg-secondary">{workspace.description}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-display text-xl font-bold text-primary-600 dark:text-primary-300">
                          {primaryWorkspaceCounts[workspace.href]}
                          {workspace.href === "/apps" ? "" : "+"}
                        </p>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                          {workspace.href === "/apps" ? "apps" : "items"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="surface-card p-5 sm:p-6">
                <p className="eyebrow">Why This Feels Better</p>
                <div className="mt-4 space-y-3">
                  {trustPillars.map((pillar) => (
                    <div key={pillar.title} className="rounded-2xl border border-line/80 bg-card-2/80 p-4 dark:bg-card/80">
                      <p className="text-sm font-semibold text-fg">{pillar.title}</p>
                      <p className="mt-1 text-sm text-fg-secondary">{pillar.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pt-2 sm:pt-4">
        <div className="page-shell">
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="surface-card p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Popular Right Now</p>
                  <h2 className="mt-3 font-display text-2xl font-semibold text-fg sm:text-3xl">
                    Trending support fixes
                  </h2>
                </div>
                <Link href="/support/tickets" className="btn-ghost !px-4 !py-2 text-sm">
                  View all tickets
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {trendingArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/support/tickets/${article.slug}`}
                    className="surface-card-interactive group rounded-2xl p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="filter-chip px-2.5 py-1 text-[11px] font-semibold">{article.category}</span>
                      <span className="filter-chip px-2.5 py-1 text-[11px] font-semibold">{article.estimatedTime}</span>
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-fg transition group-hover:text-primary-600 dark:group-hover:text-primary-300">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-sm text-fg-secondary">{article.description}</p>
                    <p className="mt-4 text-xs font-semibold text-primary-600 dark:text-primary-300">Open article →</p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="surface-card p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Fast Paths</p>
                  <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Top categories</h2>
                </div>
                <Link href="/corporate-tech-fixes" className="btn-ghost !px-4 !py-2 text-sm">
                  Open fixes
                </Link>
              </div>
              <div className="grid gap-3">
                {topCategories.map((category) => (
                  <Link
                    key={category.label}
                    href={category.href}
                    className="surface-card-interactive rounded-2xl p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                          {category.count} articles
                        </p>
                        <h3 className="mt-2 font-display text-lg font-semibold text-fg">{category.label}</h3>
                        <p className="mt-1 text-sm text-fg-secondary">{category.description}</p>
                      </div>
                      <span className="mt-1 text-sm font-semibold text-primary-600 dark:text-primary-300">Open</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="section-shell pt-2">
        <div className="page-shell">
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="surface-card p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Guided Learning</p>
                  <h2 className="mt-3 font-display text-2xl font-semibold text-fg sm:text-3xl">
                    Pillar guides
                  </h2>
                </div>
                <Link href="/guides" className="btn-ghost !px-4 !py-2 text-sm">
                  Open guides
                </Link>
              </div>
              <div className="grid gap-3">
                {pillarGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}/`}
                    className="surface-card-interactive rounded-2xl p-4"
                  >
                    <h3 className="text-base font-semibold text-fg">{guide.title}</h3>
                    <p className="mt-2 text-sm text-fg-secondary">{guide.description}</p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="surface-card p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Practical Assets</p>
                  <h2 className="mt-3 font-display text-2xl font-semibold text-fg sm:text-3xl">
                    Recent downloads
                  </h2>
                </div>
                <Link href="/downloads" className="btn-ghost !px-4 !py-2 text-sm">
                  Open downloads
                </Link>
              </div>
              <div className="grid gap-3">
                {featuredDownloadGuides.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`/downloads/${entry.slug}/`}
                    className="surface-card-interactive rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                        {entry.category}
                      </p>
                      <span className="filter-chip px-2.5 py-1 text-[11px] font-semibold">
                        {entry.releaseMetadata?.releaseTag ?? "Available"}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-fg">{entry.name}</h3>
                    <p className="mt-2 text-sm text-fg-secondary">{entry.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      {featuredApps.length > 0 ? (
        <section className="section-shell pt-2">
          <div className="page-shell">
            <div className="surface-card p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Products</p>
                  <h2 className="mt-3 font-display text-2xl font-semibold text-fg sm:text-3xl">
                    Apps in the portfolio
                  </h2>
                </div>
                <Link href="/apps" className="btn-ghost !px-4 !py-2 text-sm">
                  Open apps
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {featuredApps.map((app) => (
                  <AppCard key={app.slug} app={app} />
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-shell pt-2">
        <div className="page-shell">
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <section className="surface-card-strong p-6 sm:p-8">
              <p className="eyebrow">Need Ongoing Help?</p>
              <h2 className="mt-4 text-balance font-display text-2xl font-semibold text-fg sm:text-3xl">
                Retained systems support for teams that need more than one-off fixes
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-fg-secondary sm:text-base">
                I work across Microsoft 365, Google Workspace, macOS, Windows, Linux, identity,
                collaboration, endpoint management, and operational cleanup for small teams and growing businesses.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link href="/services/msp" className="btn-primary">
                  Explore MSP Services
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Request Retainer Availability
                </Link>
              </div>
            </section>

            <section className="surface-card p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Search Demand</p>
                  <h2 className="mt-3 font-display text-2xl font-semibold text-fg sm:text-3xl">
                    Popular IT searches
                  </h2>
                </div>
                <Link href="/guides" className="btn-ghost !px-4 !py-2 text-sm">
                  Open guides
                </Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {keywordOpportunities.map((entry) => (
                  <Link
                    key={entry.keyword}
                    href={`/support/tickets/?q=${encodeURIComponent(entry.keyword)}`}
                    className="surface-card-interactive rounded-2xl p-4"
                  >
                    <h3 className="text-sm font-semibold text-fg">{entry.keyword}</h3>
                    <p className="mt-2 text-xs text-muted">
                      Traffic {entry.traffic} • Monetization {entry.monetization} • Competition {entry.competition}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(queryIntentSchema) }}
      />
    </>
  );
}
