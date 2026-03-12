import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KnowledgeBaseArticleView } from "@/components/support-portal/knowledge-base-article-view";
import { getRecommendedAffiliatesForKBArticle } from "@/lib/affiliate-support.registry";
import { buildResourceGroupsForItContext } from "@/lib/related-content";
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
  const relatedContentGroups = buildResourceGroupsForItContext(
    [
      article.title,
      article.description,
      article.category,
      article.product,
      article.productFamily,
      ...article.tags,
      ...article.symptoms.slice(0, 3),
      ...article.causes.slice(0, 3)
    ],
    {
      excludeKBSlug: article.slug
    }
  );

  const articleJsonLd = buildKbArticleJsonLd(article);
  const howToJsonLd = buildKbHowToJsonLd(article);
  const faqJsonLd = buildKbFaqJsonLd(article);
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
        relatedContentGroups={relatedContentGroups}
        recommendedAffiliates={recommendedAffiliates}
        keywordTargets={keywordTargets}
        seoAlignment={seoAlignment}
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
