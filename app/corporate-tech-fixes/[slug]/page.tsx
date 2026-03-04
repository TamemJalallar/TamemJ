import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FixGuide } from "@/components/corporate-fixes/fix-guide";
import { EnterpriseSupportBanner } from "@/components/corporate-fixes/fix-shared";
import { getCorporateFixBySlug, getCorporateFixes } from "@/lib/corporate-fixes.registry";
import { supportAuthorProfile } from "@/lib/site";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";

interface CorporateFixPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

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

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getCorporateFixes().map((fix) => ({ slug: fix.slug }));
}

export async function generateMetadata({
  params
}: CorporateFixPageProps): Promise<Metadata> {
  const { slug } = await params;
  const fix = getCorporateFixBySlug(slug);

  if (!fix) {
    return {
      title: "Fix Not Found"
    };
  }

  const authorName = fix.author?.name ?? supportAuthorProfile.name;
  const testedOnMeta =
    fix.testedOn && fix.testedOn.length > 0
      ? fix.testedOn.join(", ")
      : "Windows 11 23H2, macOS Sequoia 15";

  return {
    title: `${fix.title} | Corporate Tech Fixes`,
    description: fix.description,
    authors: [{ name: authorName }],
    keywords: uniqueKeywords([
      ...fix.tags,
      fix.category,
      fix.title,
      `${fix.category} troubleshooting`,
      `${fix.accessLevel} IT guide`,
      `severity ${fix.severity}`,
      "corporate IT support",
      "enterprise troubleshooting",
      "it help desk runbook"
    ]),
    alternates: {
      canonical: `/corporate-tech-fixes/${fix.slug}/`
    },
    robots: {
      index: true,
      follow: true
    },
    openGraph: buildOpenGraph(
      `${fix.title} | Corporate Tech Fixes`,
      fix.description,
      `/corporate-tech-fixes/${fix.slug}/`,
      "article"
    ),
    twitter: buildTwitter(`${fix.title} | Corporate Tech Fixes`, fix.description),
    other: {
      "support:severity": fix.severity,
      "support:access-level": fix.accessLevel,
      "support:estimated-time": fix.estimatedTime,
      "support:last-verified": fix.lastVerified ?? "March 3, 2026",
      "support:tested-on": testedOnMeta
    }
  };
}

export default async function CorporateFixDetailPage({ params }: CorporateFixPageProps) {
  const { slug } = await params;
  const fix = getCorporateFixBySlug(slug);

  if (!fix) {
    notFound();
  }

  const author = fix.author ?? {
    name: supportAuthorProfile.name,
    title: supportAuthorProfile.title,
    credentials: [...supportAuthorProfile.credentials]
  };
  const lastVerified = fix.lastVerified ?? "March 3, 2026";
  const parsedLastVerified = Date.parse(lastVerified);
  const isoLastVerified = Number.isNaN(parsedLastVerified)
    ? undefined
    : new Date(parsedLastVerified).toISOString();
  const testedOn = fix.testedOn && fix.testedOn.length > 0
    ? fix.testedOn
    : ["Windows 11 23H2", "macOS Sequoia 15"];

  const fixArticleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: fix.title,
    description: fix.description,
    articleSection: fix.category,
    keywords: fix.tags.join(", "),
    timeRequired: fix.estimatedTime,
    url: toAbsoluteUrl(`/corporate-tech-fixes/${fix.slug}/`),
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: author.name,
      jobTitle: author.title
    },
    dateModified: isoLastVerified,
    datePublished: isoLastVerified,
    mentions: testedOn.map((entry) => ({
      "@type": "Thing",
      name: entry
    })),
    audience: {
      "@type": "Audience",
      audienceType: "Enterprise IT support and help desk analysts"
    }
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Corporate Tech Fixes", path: "/corporate-tech-fixes/" },
    { name: fix.title, path: `/corporate-tech-fixes/${fix.slug}/` }
  ]);

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell max-w-5xl">
          <div className="mb-5 print:hidden">
            <Link
              href="/corporate-tech-fixes"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              ← Back to Corporate Tech Fixes
            </Link>
          </div>

          <EnterpriseSupportBanner className="mb-5" />
          <FixGuide fix={fix} />
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(fixArticleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
