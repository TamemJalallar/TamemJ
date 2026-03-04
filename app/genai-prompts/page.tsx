import type { Metadata } from "next";
import Link from "next/link";
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
  const groupedByPlatformAndCategory = ["MetaAI", "AdobeGenAI", "Both"].map((platform) => ({
    platform,
    categories: [...new Set(prompts.filter((prompt) => prompt.platform === platform).map((prompt) => prompt.category))]
      .sort((a, b) => a.localeCompare(b))
      .map((category) => ({
        category,
        prompts: prompts
          .filter((prompt) => prompt.platform === platform && prompt.category === category)
          .sort((a, b) => a.title.localeCompare(b.title))
      }))
  }));

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

          <section className="mt-6 surface-card p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Full Prompt Index
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Crawlable index of all prompt detail pages grouped by platform and category.
            </p>
            <div className="mt-4 space-y-4">
              {groupedByPlatformAndCategory.map((group) => (
                <details
                  key={group.platform}
                  className="rounded-xl border border-line/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {group.platform} (
                    {group.categories.reduce((total, categoryGroup) => total + categoryGroup.prompts.length, 0)})
                  </summary>
                  <div className="mt-3 space-y-3">
                    {group.categories.map((categoryGroup) => (
                      <div key={`${group.platform}-${categoryGroup.category}`}>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                          {categoryGroup.category}
                        </p>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                          {categoryGroup.prompts.map((prompt) => (
                            <Link
                              key={prompt.slug}
                              href={`/genai-prompts/${prompt.slug}/`}
                              className="rounded-lg border border-line/70 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                            >
                              {prompt.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>
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
