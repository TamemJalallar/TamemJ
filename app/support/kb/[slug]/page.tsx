import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KnowledgeBaseArticleView } from "@/components/support-portal/knowledge-base-article-view";
import { getRecommendedAffiliatesForKBArticle } from "@/lib/affiliate-support.registry";
import { getKBArticleBySlug, getKBArticles } from "@/lib/support.kb.registry";
import {
  buildBreadcrumbJsonLd,
  buildKbArticleJsonLd,
  buildKbArticleMetadata
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
    return { title: "KB Article Not Found" };
  }

  return buildKbArticleMetadata(article);
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

  const articleJsonLd = buildKbArticleJsonLd(article);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Support Portal", path: "/support/" },
    { name: "Knowledge Base", path: "/support/kb/" },
    { name: article.title, path: `/support/kb/${article.slug}/` }
  ]);

  return (
    <>
      <KnowledgeBaseArticleView
        article={article}
        relatedArticles={relatedArticles}
        recommendedAffiliates={recommendedAffiliates}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
