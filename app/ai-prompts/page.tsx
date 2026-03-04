import type { Metadata } from "next";
import { AiPromptsBuilder } from "@/components/ai-prompts/ai-prompts-builder";
import { getAiPromptLibraryItems, getAiPromptTemplates } from "@/lib/ai-prompts.registry";
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildOpenGraph, buildTwitter } from "@/lib/seo";

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

export const metadata: Metadata = {
  title: "AI Prompts",
  description:
    "Build expert-ready prompts for ChatGPT, Claude, Adobe GenAI, Perplexity, Grok/xAI, and Meta AI with adjustable expertise levels and a 50+ prompt library.",
  keywords: uniqueKeywords([
    "AI prompts",
    "chatgpt prompts",
    "claude prompts",
    "adobe genai prompts",
    "perplexity prompts",
    "grok prompts",
    "meta ai prompts",
    "app development prompt",
    "it troubleshooting prompt",
    "prompt engineering"
  ]),
  alternates: {
    canonical: "/ai-prompts/"
  },
  openGraph: buildOpenGraph(
    "AI Prompts | Tamem J",
    "Prompt builder for ChatGPT, Claude, Adobe GenAI, Perplexity, Grok/xAI, and Meta AI with expertise-level tuning.",
    "/ai-prompts/"
  ),
  twitter: buildTwitter(
    "AI Prompts | Tamem J",
    "Prompt builder for ChatGPT, Claude, Adobe GenAI, Perplexity, Grok/xAI, and Meta AI with expertise-level tuning."
  )
};

export default function AiPromptsPage() {
  const templates = getAiPromptTemplates();
  const libraryItems = getAiPromptLibraryItems();
  const collectionItems = [...templates.map((template) => template.title), ...libraryItems.map((item) => item.title)];

  const collectionSchema = buildCollectionPageJsonLd(
    "AI Prompt Templates",
    `Technical prompt templates and library prompts for development and enterprise IT workflows (${collectionItems.length} total).`,
    "/ai-prompts/",
    collectionItems.map((name) => ({
      name,
      path: "/ai-prompts/"
    }))
  );

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "AI Prompts", path: "/ai-prompts/" }
  ]);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI Prompts",
    description:
      "Prompt builder with AI model selection and expertise-level tuning for app development, IT troubleshooting, and automation tasks."
  };

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell">
          <AiPromptsBuilder />
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
