import type { Metadata } from "next";
import Link from "next/link";
import { FixesCatalog } from "@/components/corporate-fixes/fixes-catalog";
import { EnterpriseSupportBanner } from "@/components/corporate-fixes/fix-shared";
import {
  getCorporateFixCategories,
  getCorporateFixes,
  getCorporateFixTags
} from "@/lib/corporate-fixes.registry";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildOpenGraph,
  buildTwitter,
  toAbsoluteUrl
} from "@/lib/seo";

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

const seoFixCategories = getCorporateFixCategories().slice(0, 10);
const seoFixTags = getCorporateFixTags().slice(0, 24);

export const metadata: Metadata = {
  title: "Corporate Tech Fixes",
  description:
    "Enterprise-safe IT troubleshooting guides with structured step-by-step fixes for Windows, macOS, Microsoft 365, networking, printers, and security incidents.",
  keywords: uniqueKeywords([
    "corporate IT support",
    "enterprise troubleshooting",
    "IT runbook",
    "Microsoft 365 support",
    "Windows support",
    "macOS support",
    "network troubleshooting",
    "SharePoint access denied",
    "OneDrive sync issue",
    "Teams microphone issue",
    ...seoFixCategories.map((category) => `${category} troubleshooting`),
    ...seoFixTags
  ]),
  alternates: {
    canonical: "/corporate-tech-fixes/"
  },
  openGraph: buildOpenGraph(
    "Corporate Tech Fixes | Tamem J",
    "Professional, enterprise-safe IT troubleshooting guides for common corporate technology issues.",
    "/corporate-tech-fixes/"
  ),
  twitter: buildTwitter(
    "Corporate Tech Fixes | Tamem J",
    "Professional, enterprise-safe IT troubleshooting guides for common corporate technology issues."
  )
};

export default function CorporateTechFixesPage() {
  const fixes = getCorporateFixes();
  const groupedByCategory = [...new Set(fixes.map((fix) => fix.category))]
    .sort((a, b) => a.localeCompare(b))
    .map((category) => ({
      category,
      fixes: fixes
        .filter((fix) => fix.category === category)
        .sort((a, b) => a.title.localeCompare(b.title))
    }));
  const catalogFixes = fixes.map((fix) => ({
    slug: fix.slug,
    title: fix.title,
    category: fix.category,
    severity: fix.severity,
    accessLevel: fix.accessLevel,
    estimatedTime: fix.estimatedTime,
    tags: fix.tags,
    description: fix.description,
    stepCount: fix.steps.length
  }));
  const categories = getCorporateFixCategories();
  const tags = getCorporateFixTags();
  const adminRequiredCount = fixes.filter((fix) => fix.accessLevel === "Admin Required").length;
  const highSeverityCount = fixes.filter((fix) => fix.severity === "High").length;
  const featuredCategories = groupedByCategory
    .slice()
    .sort((left, right) => right.fixes.length - left.fixes.length || left.category.localeCompare(right.category))
    .slice(0, 6);

  const fixesCollectionSchema = buildCollectionPageJsonLd(
    "Corporate Tech Fixes",
    "Enterprise-safe IT troubleshooting guides with structured step-by-step fixes for common corporate issues.",
    "/corporate-tech-fixes/",
    fixes.map((fix) => ({
      name: fix.title,
      path: `/corporate-tech-fixes/${fix.slug}/`
    }))
  );
  const portalSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Corporate Tech Fixes",
    url: toAbsoluteUrl("/corporate-tech-fixes/"),
    description:
      "Enterprise-safe IT troubleshooting guides with structured step-by-step fixes for common corporate issues."
  };
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Corporate Tech Fixes", path: "/corporate-tech-fixes/" }
  ]);

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell space-y-6">
          <EnterpriseSupportBanner />

          <section className="hero-surface p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-primary-300/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-accent-400/10 blur-3xl" />
            <div className="relative grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
              <div>
                <p className="eyebrow text-primary-100">Corporate Tech Fixes</p>
                <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Step-by-step corporate IT fixes that stay readable under pressure.
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-primary-100/90 sm:text-base">
                  This library is built for enterprise-safe troubleshooting. Search by symptom, narrow by category,
                  and move through clear runbooks that call out admin-required steps, severity, and escalation points.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#fix-catalog" className="btn-primary">
                    Browse Fixes
                  </a>
                  <Link href="/support/tickets" className="btn-secondary">
                    Open Tickets Portal
                  </Link>
                  <Link href="/corporate-tech-fixes/builder" className="btn-ghost !text-white hover:!bg-white/10 hover:!text-white">
                    Open Builder
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Fixes</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{fixes.length}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Documented runbooks ready to search</p>
                </article>
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Categories</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{categories.length}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Coverage across platforms and services</p>
                </article>
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Admin Required</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{adminRequiredCount}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Guides that call out elevated access clearly</p>
                </article>
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">High Severity</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{highSeverityCount}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Operationally sensitive issues flagged up front</p>
                </article>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <article className="surface-card-interactive p-5 sm:p-6">
              <p className="eyebrow">Enterprise-safe</p>
              <h2 className="mt-3 font-display text-xl font-semibold text-fg">Built for real corporate environments</h2>
              <p className="mt-3 text-sm leading-7 text-fg-secondary">
                These guides are written to stay practical without bypassing controls. Where security or policy involvement matters,
                the escalation path is part of the runbook instead of an afterthought.
              </p>
            </article>
            <article className="surface-card-interactive p-5 sm:p-6">
              <p className="eyebrow">Fast triage</p>
              <h2 className="mt-3 font-display text-xl font-semibold text-fg">Use severity, access, and time to sort quickly</h2>
              <p className="mt-3 text-sm leading-7 text-fg-secondary">
                Each fix includes estimated effort, access level, and severity so support teams can decide whether to handle, escalate,
                or document follow-up work immediately.
              </p>
            </article>
            <article className="surface-card-interactive p-5 sm:p-6">
              <p className="eyebrow">Builder workflow</p>
              <h2 className="mt-3 font-display text-xl font-semibold text-fg">Create new runbooks without editing blindly</h2>
              <p className="mt-3 text-sm leading-7 text-fg-secondary">
                The builder exists for drafting and formatting new entries cleanly, then folding them back into the fixes library with the same structure and metadata.
              </p>
            </article>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow">Start by Category</p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Most-covered fix lanes</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-fg-secondary">
                  If you are not searching yet, these categories are the fastest way to narrow the library before you drop into the live catalog browser.
                </p>
              </div>
              <span className="filter-chip px-3 py-1 text-xs">{tags.length} searchable tags</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {featuredCategories.map((group) => (
                <article key={group.category} className="surface-card rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-fg">{group.category}</h3>
                    <span className="filter-chip px-2.5 py-1 text-xs">{group.fixes.length} guides</span>
                  </div>
                  <p className="mt-3 text-sm text-fg-secondary">
                    {group.fixes.slice(0, 2).map((fix) => fix.title).join(", ")}
                    {group.fixes.length > 2 ? `, and ${group.fixes.length - 2} more.` : "."}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <div id="fix-catalog">
            <FixesCatalog fixes={catalogFixes} categories={categories} tags={tags} />
          </div>

          <section className="surface-card p-5 sm:p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow">Full Index</p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Every corporate fix page</h2>
                <p className="mt-2 text-sm leading-7 text-fg-secondary">
                  This plain category index keeps the full library crawlable and easy to skim, even without using filters.
                </p>
              </div>
              <Link href="/support/tickets" className="btn-secondary">
                Go to Tickets Portal
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {groupedByCategory.map((group, index) => (
                <details key={group.category} className="surface-card rounded-2xl p-4" open={index === 0}>
                  <summary className="cursor-pointer list-none text-sm font-semibold text-fg">
                    {group.category} ({group.fixes.length})
                  </summary>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {group.fixes.map((fix) => (
                      <Link
                        key={fix.slug}
                        href={`/corporate-tech-fixes/${fix.slug}/`}
                        className="filter-chip justify-start rounded-lg px-3 py-2 text-sm"
                      >
                        {fix.title}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(fixesCollectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portalSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
