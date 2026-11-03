import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSenseSlot } from "@/components/monetization/adsense-slot";
import { getAdSenseSlot, monetizationConfig } from "@/lib/monetization";
import { KnowledgeBaseArticleView } from "@/components/support-portal/knowledge-base-article-view";
import type { ResourceLinkItem } from "@/components/shared/resource-link-grid";
import { getRecommendedAffiliatesForKBArticle } from "@/lib/affiliate-support.registry";
import {
  getRelatedAssetsForKBArticle,
  getRelatedCorporateFixesForKBArticle,
  getRelatedDownloadsForKBArticle,
  getRelatedPillarsForTerms
} from "@/lib/detail-page-related";
import { getKBSeoAlignmentBySlug, getKeywordTargetsForKBArticle } from "@/lib/seo-content.registry";
import { getKBArticleBySlug, getKBArticles } from "@/lib/support.kb.registry";
import {
  buildBreadcrumbJsonLd,
  buildKbFaqJsonLd,
  buildKbArticleJsonLd,
  buildKbHowToJsonLd,
  buildKbArticleMetadata,
  toAbsoluteSupportUrl
} from "@/lib/support-portal.seo";

interface KBArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getKBArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: KBArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getKBArticleBySlug(slug);

  if (!article) {
    return { title: "Ticket Not Found" };
  }

  const seoAlignment = getKBSeoAlignmentBySlug(article.slug);
  const baseMetadata = buildKbArticleMetadata(article);
  const keywordTargets = getKeywordTargetsForKBArticle(article, 10);
  const baseKeywords = Array.isArray(baseMetadata.keywords) ? baseMetadata.keywords : [];

  return {
    ...baseMetadata,
    ...(seoAlignment
      ? {
          description: seoAlignment.optimizedLeadParagraph
        }
      : {}),
    keywords: [
      ...new Set([
        ...baseKeywords,
        ...keywordTargets.map((target) => target.keyword),
        ...(seoAlignment ? [seoAlignment.primaryKeyword] : [])
      ])
    ]
  };
}

export default async function KBArticlePage({ params }: KBArticlePageProps) {
  const { slug } = await params;
  const article = getKBArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = article.relatedArticleSlugs
    .map((relatedSlug) => getKBArticleBySlug(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const recommendedAffiliates = getRecommendedAffiliatesForKBArticle(article);
  const seoAlignment = getKBSeoAlignmentBySlug(article.slug);
  const keywordTargets = getKeywordTargetsForKBArticle(article, 8);
  const relatedDownloads = getRelatedDownloadsForKBArticle(article, 2);
  const relatedAssets = getRelatedAssetsForKBArticle(article, 2);
  const relatedFixes = getRelatedCorporateFixesForKBArticle(article, 2);
  const relatedPillars = getRelatedPillarsForTerms(
    [article.title, article.description, article.product, article.productFamily, article.category, ...article.tags],
    2
  );
  const resourceLinks: ResourceLinkItem[] = [
    ...relatedDownloads.map((entry) => ({
      href: `/downloads/${entry.slug}/`,
      eyebrow: "Software Download",
      title: entry.name,
      description: entry.summary,
      meta: `${entry.category} • ${entry.platforms.join(", ")}`
    })),
    ...relatedAssets.map((asset) => ({
      href: `/downloads/assets/${asset.slug}/`,
      eyebrow: "IT Asset",
      title: asset.title,
      description: asset.description,
      meta: `${asset.category} • ${asset.format.toUpperCase()}`
    })),
    ...relatedFixes.map((fix) => ({
      href: `/corporate-tech-fixes/${fix.slug}/`,
      eyebrow: "Corporate Fix",
      title: fix.title,
      description: fix.description,
      meta: `${fix.category} • ${fix.estimatedTime}`
    })),
    ...relatedPillars.map((pillar) => ({
      href: `/guides/${pillar.slug}/`,
      eyebrow: "Pillar Guide",
      title: pillar.title,
      description: pillar.description,
      meta: pillar.targetKeywords.slice(0, 2).join(" • ")
    }))
  ].filter((item, index, array) => array.findIndex((candidate) => candidate.href === item.href) === index).slice(0, 6);

  const articleJsonLd = buildKbArticleJsonLd(article);
  const howToJsonLd = buildKbHowToJsonLd(article);
  const faqJsonLd = buildKbFaqJsonLd(article);
  const parsedLastVerified = Date.parse(article.lastVerified);
  const isoLastVerified = Number.isNaN(parsedLastVerified)
    ? undefined
    : new Date(parsedLastVerified).toISOString();
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: article.title,
    url: toAbsoluteSupportUrl(`/support/tickets/${article.slug}/`),
    description: seoAlignment?.optimizedLeadParagraph ?? article.description,
    ...(isoLastVerified ? { dateModified: isoLastVerified } : {}),
    isPartOf: {
      "@type": "CollectionPage",
      name: "Support Tickets",
      url: toAbsoluteSupportUrl("/support/tickets/")
    }
  };
  const keywordTargetSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Related exact-match troubleshooting queries for ${article.title}`,
    numberOfItems: keywordTargets.length,
    itemListElement: keywordTargets.map((target, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: target.keyword,
      url: toAbsoluteSupportUrl(`/support/tickets/${target.articleSlug}/`)
    }))
  };
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Support Portal", path: "/support/" },
    { name: "Tickets", path: "/support/tickets/" },
    { name: article.title, path: `/support/tickets/${article.slug}/` }
  ]);

  return (
    <>
      <KnowledgeBaseArticleView
        article={article}
        relatedArticles={relatedArticles}
        recommendedAffiliates={recommendedAffiliates}
        keywordTargets={keywordTargets}
        seoAlignment={seoAlignment}
        resourceLinks={resourceLinks}
      />
      <div className="section-shell pb-6 pt-2">
        <div className="page-shell">
          <AdSenseSlot
            client={monetizationConfig.adsenseClient}
            slot={getAdSenseSlot("inArticle")}
            label="Advertisement"
          />
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(keywordTargetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
