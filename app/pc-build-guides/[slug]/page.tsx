import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PCBuildGuideView } from "@/components/pc-build-guides/pc-build-guide-view";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import { getPCBuildGuideBySlug, getPCBuildGuides } from "@/lib/pc-build-guides.registry";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";

interface PCBuildGuidePageProps {
  params: Promise<{ slug: string }>;
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
  return getPCBuildGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PCBuildGuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getPCBuildGuideBySlug(slug);

  if (!guide) {
    return { title: "Guide Not Found" };
  }

  return {
    title: `${guide.title} | PC Build Guides`,
    description: guide.description,
    keywords: uniqueKeywords([
      ...guide.tags,
      ...guide.useCases,
      guide.title,
      guide.category,
      guide.difficulty,
      guide.budgetBand,
      "pc build guide",
      "pc parts recommendations",
      "custom pc build"
    ]),
    alternates: {
      canonical: `/pc-build-guides/${guide.slug}/`
    },
    robots: buildRobotsIndexRule(`/pc-build-guides/${guide.slug}/`),
    openGraph: buildOpenGraph(
      `${guide.title} | PC Build Guides`,
      guide.description,
      `/pc-build-guides/${guide.slug}/`,
      "article"
    ),
    twitter: buildTwitter(`${guide.title} | PC Build Guides`, guide.description)
  };
}

export default async function PCBuildGuideDetailPage({ params }: PCBuildGuidePageProps) {
  const { slug } = await params;
  const guide = getPCBuildGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const relatedGuides = guide.relatedGuideSlugs
    .map((relatedSlug) => getPCBuildGuideBySlug(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const guideJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: guide.title,
    description: guide.description,
    articleSection: guide.category,
    keywords: guide.tags.join(", "),
    timeRequired: guide.estimatedTime,
    url: toAbsoluteUrl(`/pc-build-guides/${guide.slug}/`),
    audience: {
      "@type": "Audience",
      audienceType: "PC builders and technical enthusiasts"
    },
    about: guide.partRecommendations.map((part) => ({
      "@type": "Thing",
      name: part.partType
    })),
    inLanguage: "en"
  };

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "PC Build Guides", path: "/pc-build-guides/" },
    { name: guide.title, path: `/pc-build-guides/${guide.slug}/` }
  ]);

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell max-w-5xl">
          <div className="mb-5 print:hidden">
            <Link
              href="/pc-build-guides"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              ← Back to PC Build Guides
            </Link>
          </div>

          <PCBuildGuideView guide={guide} relatedGuides={relatedGuides} />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
