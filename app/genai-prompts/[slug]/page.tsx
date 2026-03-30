import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GenAIPromptDetail } from "@/components/genai-prompts/genai-prompt-detail";
import { RelatedGenAIPrompts } from "@/components/genai-prompts/related-genai-prompts";
import {
  getGenAICategorySlug,
  getGenAIPromptBySlug,
  getGenAIPrompts,
  getRelatedGenAIPrompts
} from "@/lib/genai-prompts";
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

  const title = `${prompt.title} — Copy-Ready ${prompt.platform} Prompt`;
  const description = `Free copy-ready ${prompt.platform} prompt for ${prompt.tool}. ${prompt.summary} Complexity: ${prompt.complexity}. Category: ${prompt.category}.`;
  const path = `/genai-prompts/${prompt.slug}/`;

  return {
    title,
    description,
    keywords: [
      prompt.title,
      `${prompt.title.toLowerCase()} prompt`,
      `${prompt.platform.toLowerCase()} prompt`,
      `${prompt.platform.toLowerCase()} ${prompt.category.toLowerCase()} prompt`,
      `${prompt.tool.toLowerCase()} prompt`,
      `${prompt.category.toLowerCase()} ai prompt`,
      `${prompt.category.toLowerCase()} prompt template`,
      "copy ready ai prompt",
      "free ai prompt",
      "genai prompt template",
      ...prompt.tags
    ],
    alternates: {
      canonical: path
    },
    openGraph: buildOpenGraph(`${title} | TamemJ`, description, path, "article"),
    twitter: buildTwitter(`${title} | TamemJ`, description)
  };
}

export default async function GenAIPromptPage({ params }: GenAIPromptPageProps) {
  const { slug } = await params;
  const prompt = getGenAIPromptBySlug(slug);

  if (!prompt) {
    notFound();
  }

  const related = getRelatedGenAIPrompts(prompt.slug, 6);

  const categorySlug = getGenAICategorySlug(prompt.category);

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "GenAI Prompts", path: "/genai-prompts/" },
    { name: prompt.category, path: `/genai-prompts/category/${categorySlug}/` },
    { name: prompt.title, path: `/genai-prompts/${prompt.slug}/` }
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use the ${prompt.title} prompt`,
    description: `Step-by-step guide to copying and using the ${prompt.title} prompt in ${prompt.platform}.`,
    step: [
      {
        "@type": "HowToStep",
        name: "Open the prompt page",
        text: `Navigate to the ${prompt.title} prompt detail page and review the prompt text.`
      },
      {
        "@type": "HowToStep",
        name: "Fill in the variables",
        text: "Use the variable fill form to customize any placeholders (shown as {{variable_name}}) before copying."
      },
      {
        "@type": "HowToStep",
        name: "Copy the prompt",
        text: "Click the Copy button to copy the full prompt to your clipboard."
      },
      {
        "@type": "HowToStep",
        name: `Paste into ${prompt.platform}`,
        text: `Open ${prompt.platform}, start a new session or file, and paste the copied prompt to begin your ${prompt.tool} workflow.`
      }
    ]
  };

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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the ${prompt.title} prompt best used for?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${prompt.title} is intended for ${prompt.tool} workflows inside the ${prompt.category} category on ${prompt.platform}.`
        }
      },
      {
        "@type": "Question",
        name: `Can I customize the ${prompt.title} prompt before copying it?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: prompt.variables && prompt.variables.length > 0
            ? "Yes. This prompt includes variable fields so you can tailor the copied output before using it."
            : "Yes. You can adapt the prompt text directly before or after copying it into your AI tool."
        }
      },
      {
        "@type": "Question",
        name: `What should I explore after using this prompt?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Use the related prompts section, the ${prompt.category} category page, and the wider AI agents or guides hubs to expand into adjacent workflows.`
        }
      }
    ]
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

          <section className="surface-card p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Use Alongside Other Hubs</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Link
                href={`/genai-prompts/category/${categorySlug}/`}
                className="rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">More {prompt.category} Prompts</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Compare adjacent prompt templates in the same category before locking in the workflow.
                </p>
              </Link>
              <Link
                href="/ai-agents/"
                className="rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">AI Agents Library</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Pair task prompts with broader role-based system prompts and operating personas.
                </p>
              </Link>
              <Link
                href="/guides/"
                className="rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">IT Pillar Guides</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Connect prompt workflows to larger search-led knowledge hubs and supporting site resources.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
