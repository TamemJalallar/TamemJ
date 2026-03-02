import type { Metadata } from "next";
import { PCBuildGuidesCatalog } from "@/components/pc-build-guides/pc-build-guides-catalog";
import { SectionHeading } from "@/components/section-heading";
import {
  getPCBuildGuideBudgetBands,
  getPCBuildGuideCategories,
  getPCBuildGuideDifficulties,
  getPCBuildGuides,
  getPCBuildGuideTags
} from "@/lib/pc-build-guides.registry";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildOpenGraph,
  buildTwitter,
  toAbsoluteUrl
} from "@/lib/seo";

const guides = getPCBuildGuides();

function buildGuideKeywords() {
  const topTags = getPCBuildGuideTags().slice(0, 20);

  return [
    "pc build guides",
    "computer build guide",
    "pc part recommendations",
    "cpu gpu ram selection",
    "gaming pc build",
    "creator workstation build",
    "home office pc build",
    "pc troubleshooting",
    "how to choose pc parts",
    ...topTags
  ];
}

export const metadata: Metadata = {
  title: "PC Build Guides",
  description:
    "Step-by-step PC building guides with practical part recommendations, compatibility checks, and performance benefits for gaming, creator, office, and AI workflows.",
  keywords: buildGuideKeywords(),
  alternates: {
    canonical: "/pc-build-guides/"
  },
  openGraph: buildOpenGraph(
    "PC Build Guides | Tamem J",
    "Part-by-part guidance for building reliable PCs with clear compatibility checks and upgrade planning.",
    "/pc-build-guides/"
  ),
  twitter: buildTwitter(
    "PC Build Guides | Tamem J",
    "Part-by-part guidance for building reliable PCs with clear compatibility checks and upgrade planning."
  )
};

export default function PCBuildGuidesPage() {
  const categories = getPCBuildGuideCategories();
  const difficulties = getPCBuildGuideDifficulties();
  const budgetBands = getPCBuildGuideBudgetBands();
  const tags = getPCBuildGuideTags();

  const collectionSchema = buildCollectionPageJsonLd(
    "PC Build Guides",
    `Browse ${guides.length} PC build guides with part recommendations, compatibility checks, and troubleshooting workflows.`,
    "/pc-build-guides/",
    guides.map((guide) => ({
      name: guide.title,
      path: `/pc-build-guides/${guide.slug}/`
    }))
  );

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "PC Build Guides",
    url: toAbsoluteUrl("/pc-build-guides/"),
    description:
      "Step-by-step PC building guides with practical part recommendations, compatibility checks, and performance benefits.",
    inLanguage: "en",
    audience: {
      "@type": "Audience",
      audienceType: "PC builders, IT professionals, and power users"
    }
  };
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "PC Build Guides", path: "/pc-build-guides/" }
  ]);

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell">
          <div
            className="rounded-2xl border border-cyan-200/80 bg-cyan-50 px-4 py-3 shadow-soft dark:border-cyan-900/60 dark:bg-cyan-950/40"
            role="note"
          >
            <p className="text-sm font-medium text-cyan-900 dark:text-cyan-100">
              Practical guides for planning, building, and upgrading PCs with compatibility-first recommendations.
            </p>
          </div>

          <SectionHeading
            className="mt-5"
            eyebrow="PC Build Guides"
            title="Part-by-part build playbooks"
            description="Search by workload, filter by difficulty and budget, and use each guide to choose components with clear compatibility checks and expected benefits."
          />

          <div className="mt-8">
            <PCBuildGuidesCatalog
              guides={guides}
              categories={categories}
              difficulties={difficulties}
              budgetBands={budgetBands}
              tags={tags}
            />
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
