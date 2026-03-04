import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GenAIPromptDetail } from "@/components/genai-prompts/genai-prompt-detail";
import { RelatedGenAIPrompts } from "@/components/genai-prompts/related-genai-prompts";
import { getGenAIPromptBySlug, getGenAIPrompts, getRelatedGenAIPrompts } from "@/lib/genai-prompts";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";

interface GenAIPromptPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getGenAIPrompts().map((prompt) => ({ slug: prompt.slug }));
}

export async function generateMetadata({ params }: GenAIPromptPageProps): Promise<Metadata> {
  const { slug } = await params;
  const prompt = getGenAIPromptBySlug(slug);

  if (!prompt) {
    return { title: "Prompt Not Found" };
  }

  const title = `${prompt.title} Prompt`;
  const description = `${prompt.summary} Platform: ${prompt.platform}. Tool: ${prompt.tool}. Complexity: ${prompt.complexity}.`;
  const path = `/genai-prompts/${prompt.slug}/`;

  return {
    title,
    description,
    keywords: [
      prompt.title,
      `${prompt.platform} prompt`,
      `${prompt.tool} prompt`,
      `${prompt.category} prompt`,
      ...prompt.tags
    ],
    alternates: {
      canonical: path
    },
    openGraph: buildOpenGraph(`${title} | Tamem J`, description, path, "article"),
    twitter: buildTwitter(`${title} | Tamem J`, description)
  };
}

export default async function GenAIPromptPage({ params }: GenAIPromptPageProps) {
  const { slug } = await params;
  const prompt = getGenAIPromptBySlug(slug);

  if (!prompt) {
    notFound();
  }

  const related = getRelatedGenAIPrompts(prompt.slug, 6);

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "GenAI Prompts", path: "/genai-prompts/" },
    { name: prompt.title, path: `/genai-prompts/${prompt.slug}/` }
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: prompt.title,
    description: prompt.summary,
    url: toAbsoluteUrl(`/genai-prompts/${prompt.slug}/`),
    datePublished: prompt.updatedAt,
    dateModified: prompt.updatedAt,
    articleSection: prompt.category,
    keywords: [prompt.platform, prompt.tool, prompt.complexity, ...prompt.tags].join(", "),
    about: [
      { "@type": "Thing", name: prompt.platform },
      { "@type": "Thing", name: prompt.tool },
      { "@type": "Thing", name: prompt.category }
    ],
    author: {
      "@type": "Person",
      name: "Tamem J"
    },
    publisher: {
      "@type": "Organization",
      name: "Tamem J"
    }
  };

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell space-y-5">
          <div>
            <Link
              href="/genai-prompts/"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              ← Back to GenAI Prompts
            </Link>
          </div>

          <GenAIPromptDetail prompt={prompt} />
          <RelatedGenAIPrompts prompts={related} />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
