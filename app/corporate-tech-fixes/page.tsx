import type { Metadata } from "next";
import Link from "next/link";
import { FixesCatalog } from "@/components/corporate-fixes/fixes-catalog";
import { EnterpriseSupportBanner } from "@/components/corporate-fixes/fix-shared";
import { SectionHeading } from "@/components/section-heading";
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
        <div className="page-shell">
          <EnterpriseSupportBanner />

          <SectionHeading
            className="mt-5"
            eyebrow="Corporate Tech Fixes"
            title="Corporate IT troubleshooting guides"
            description="Structured, professional runbooks for common corporate IT issues. Search by symptom, filter by category, and use tags to narrow results quickly."
          />

          <div className="surface-card mt-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-fg">
                Need to add a new ticket or support runbook?
              </p>
              <p className="mt-1 text-xs text-muted">
                Use the built-in Ticket Builder to draft entries, manage steps/tags, and copy a registry snippet.
              </p>
            </div>
            <Link href="/corporate-tech-fixes/builder" className="btn-secondary">
              Open Ticket Builder
            </Link>
          </div>

          <div className="mt-8">
            <FixesCatalog fixes={catalogFixes} categories={categories} tags={tags} />
          </div>

          <section className="mt-8 surface-card p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-fg">
              Full Tech Fixes Index
            </h2>
            <p className="mt-2 text-sm text-fg-secondary">
              Crawlable category index for all Corporate Tech Fix guides.
            </p>
            <div className="mt-4 space-y-3">
              {groupedByCategory.map((group, index) => (
                <details
                  key={group.category}
                  className="surface-card rounded-xl p-4"
                  open={index === 0}
                >
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
