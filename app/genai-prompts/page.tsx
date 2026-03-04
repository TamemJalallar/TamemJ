import type { Metadata } from "next";
import { GenAIPromptsBrowser } from "@/components/genai-prompts/genai-prompts-browser";
import { getGenAIPrompts } from "@/lib/genai-prompts";
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildOpenGraph, buildTwitter } from "@/lib/seo";

function uniqueKeywords(input: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const keyword of input) {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(keyword.trim());
  }

  return result;
}

export const metadata: Metadata = {
  title: "Meta AI & Adobe GenAI Prompts Library",
  description:
    "Browse 120 copy/paste-ready prompts for Meta AI chat and Adobe GenAI tools, including Text-to-Image, Generative Fill, and Generative Expand workflows.",
  keywords: uniqueKeywords([
    "meta ai prompts",
    "adobe genai prompts",
    "firefly prompts",
    "photoshop generative fill prompts",
    "generative expand prompts",
    "text-to-image prompt library",
    "ai prompt templates",
    "marketing prompts",
    "social media prompts",
    "copywriting prompts",
    "photo editing prompts"
  ]),
  alternates: {
    canonical: "/genai-prompts/"
  },
  openGraph: buildOpenGraph(
    "Meta AI & Adobe GenAI Prompts Library",
    "120 practical prompts for Meta AI and Adobe GenAI workflows across chat, photo editing, and creative production.",
    "/genai-prompts/"
  ),
  twitter: buildTwitter(
    "Meta AI & Adobe GenAI Prompts Library",
    "120 practical prompts for Meta AI and Adobe GenAI workflows across chat, photo editing, and creative production."
  )
};

export default function GenAIPromptsPage() {
  const prompts = getGenAIPrompts();

  const collectionSchema = buildCollectionPageJsonLd(
    "Meta AI and Adobe GenAI Prompts",
    `Prompt library with ${prompts.length} practical prompts for Meta AI and Adobe GenAI tools.`,
    "/genai-prompts/",
    prompts.map((prompt) => ({
      name: prompt.title,
      path: `/genai-prompts/${prompt.slug}/`
    }))
  );

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "GenAI Prompts", path: "/genai-prompts/" }
  ]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What platforms are covered in this prompt library?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The library covers Meta AI chat prompts and Adobe GenAI workflows including Text-to-Image, Generative Fill, Generative Expand, Vector, and Video-oriented prompts."
        }
      },
      {
        "@type": "Question",
        name: "Can I fill variables before copying prompts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Each prompt detail page includes a variable form and a Copy with variables button for quick copy/paste use."
        }
      },
      {
        "@type": "Question",
        name: "Are prompts separated by complexity?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can filter all prompts by Simple or Advanced complexity depending on your use case."
        }
      }
    ]
  };

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell">
          <GenAIPromptsBrowser prompts={prompts} />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
