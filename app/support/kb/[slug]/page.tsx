import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KnowledgeBaseArticleView } from "@/components/support-portal/knowledge-base-article-view";
import { getKBArticleBySlug, getKBArticles } from "@/lib/support.kb.registry";

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

  return {
    title: article.title,
    description: article.description,
    keywords: [...article.tags, article.product, article.category, "it support kb"],
    alternates: { canonical: `/support/kb/${article.slug}/` },
    openGraph: {
      title: `${article.title} | Support Portal KB`,
      description: article.description,
      type: "article",
      url: `/support/kb/${article.slug}/`
    }
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

  return <KnowledgeBaseArticleView article={article} relatedArticles={relatedArticles} />;
}
