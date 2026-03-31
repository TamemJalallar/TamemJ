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
  const keywordOpportunities = homeKeywordOpportunities.slice(0, 15);

  const totalGuides = kbArticles.length + corporateFixes.length;
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
          <div className="surface-card-strong p-6 sm:p-8 lg:p-12">
            <span className="eyebrow">Enterprise IT Support Portal</span>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Search 200+ IT troubleshooting guides
            </h1>
            <p className="mt-4 max-w-3xl text-base sm:text-lg">
              Fast, enterprise-safe fixes for Microsoft 365, endpoint management, identity,
              networking, and corporate workflows.
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
                  placeholder="Search 200+ IT troubleshooting guides"
                  className="h-12 w-full rounded-xl border border-line bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
                <button type="submit" className="btn-primary h-12 shrink-0 px-6 py-0">
                  Search Guides
                </button>
              </div>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/corporate-tech-fixes" className="btn-secondary !px-4 !py-2 text-xs sm:text-sm">
                Browse Tech Fixes
              </Link>
              <Link href="/support/tickets" className="btn-secondary !px-4 !py-2 text-xs sm:text-sm">
                Open Tickets
              </Link>
              <Link href="/guides" className="btn-secondary !px-4 !py-2 text-xs sm:text-sm">
                Open Pillar Guides
              </Link>
              <Link href="/ai-agents" className="btn-secondary !px-4 !py-2 text-xs sm:text-sm">
                Open AI Agents
              </Link>
              <Link href="/downloads" className="btn-secondary !px-4 !py-2 text-xs sm:text-sm">
                View Downloads
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="surface-card p-4">
                <p className="text-2xl font-bold text-accent">{totalGuides}+</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
                  Total Troubleshooting Guides
                </p>
              </div>
              <div className="surface-card p-4">
                <p className="text-2xl font-bold text-accent">{kbArticles.length}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
                  Verified Tickets
                </p>
              </div>
              <div className="surface-card p-4">
                <p className="text-2xl font-bold text-accent">{downloads.length}+</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
                  Curated Downloads
                </p>
              </div>
              <div className="surface-card p-4">
                <p className="text-2xl font-bold text-accent">11</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
                  IT Support Categories
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pt-4 sm:pt-6">
        <div className="page-shell">
          <div className="surface-card-strong mb-6 overflow-hidden p-5 sm:p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <span className="eyebrow">Managed IT Services</span>
                <h2 className="mt-4 text-balance text-2xl font-semibold sm:text-3xl">
                  Need retained systems administration, not just one-off fixes?
                </h2>
                <p className="mt-3 max-w-2xl text-sm sm:text-base">
                  I also offer retained MSP-style support for small businesses, agencies, and
                  growing teams that need ongoing help across Microsoft 365, Google Workspace,
                  macOS, Windows, Linux, identity, collaboration, SaaS administration, and
                  operational improvement.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link href="/services/msp" className="btn-primary">
                    Explore MSP Services
                  </Link>
                  <Link href="/contact" className="btn-secondary">
                    Request Retainer Availability
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-line/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Cross-platform coverage
                  </p>
                  <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300">
                    Microsoft, Google, Apple, Windows, Linux, and business SaaS environments.
                  </p>
                </div>
                <div className="rounded-2xl border border-line/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Retained monthly support
                  </p>
                  <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300">
                    Ongoing admin, consulting, systems cleanup, and workflow improvement.
                  </p>
                </div>
                <div className="rounded-2xl border border-line/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Security-aware operations
                  </p>
                  <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300">
                    Identity, permissions, endpoint management, and platform governance.
                  </p>
                </div>
                <div className="rounded-2xl border border-line/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Documentation that scales
                  </p>
                  <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300">
                    Runbooks, standards, and cleaner operational handoffs as teams grow.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">
                Top Categories
              </h2>
              <Link href="/support/tickets" className="text-sm font-semibold text-accent hover:underline">
                View all categories
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {topCategories.map((category) => (
                <Link
                  key={category.label}
                  href={category.href}
                  className="rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/70"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    {category.count} articles
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {category.label}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {category.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="surface-card p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">
                  Featured IT Pillar Guides
                </h2>
                <Link href="/guides" className="text-sm font-semibold text-accent hover:underline">
                  Open Guides
                </Link>
              </div>
              <div className="grid gap-3">
                {pillarGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}/`}
                    className="rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/70"
                  >
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {guide.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{guide.description}</p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="surface-card p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">
                  Verified Download Guides
                </h2>
                <Link href="/downloads" className="text-sm font-semibold text-accent hover:underline">
                  Open Downloads
                </Link>
              </div>
              <div className="grid gap-3">
                {featuredDownloadGuides.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`/downloads/${entry.slug}/`}
                    className="rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/70"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      {entry.category}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      {entry.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{entry.summary}</p>
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                      Latest tracked release: {entry.releaseMetadata?.releaseTag ?? "Available"}
                    </p>
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
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">
                  Built Apps
                </h2>
                <Link href="/apps" className="text-sm font-semibold text-accent hover:underline">
                  Open Apps
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
          <div className="surface-card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">
                Trending Fix Articles
              </h2>
              <Link href="/support/tickets" className="text-sm font-semibold text-accent hover:underline">
                Open Tickets
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {trendingArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/support/tickets/${article.slug}`}
                  className="group rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/70"
                >
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    {article.category} • {article.estimatedTime}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900 transition group-hover:text-accent dark:text-slate-100">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {article.description}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-accent">Open article →</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pt-2">
        <div className="page-shell">
          <div className="surface-card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">
                Popular IT Error Searches
              </h2>
              <Link href="/guides" className="text-sm font-semibold text-accent hover:underline">
                Keyword Strategy
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {keywordOpportunities.map((entry) => (
                <Link
                  key={entry.keyword}
                  href={`/support/tickets/?q=${encodeURIComponent(entry.keyword)}`}
                  className="rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/70"
                >
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{entry.keyword}</h3>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Traffic {entry.traffic} • Monetization {entry.monetization} • Competition{" "}
                    {entry.competition}
                  </p>
                </Link>
              ))}
            </div>
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
