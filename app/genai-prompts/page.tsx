import type { Metadata } from "next";
import Link from "next/link";
import { GenAIPromptsBrowser } from "@/components/genai-prompts/genai-prompts-browser";
import {
  getGenAICategories,
  getGenAICategorySlug,
  getGenAIPrompts,
  getGenAIPromptsByCategory,
  getLatestGenAIPromptUpdatedAt
} from "@/lib/genai-prompts";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildOpenGraph,
  buildTwitter,
  toAbsoluteUrl
} from "@/lib/seo";

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
  title: "GenAI Prompt Library — 120+ Copy-Ready AI Prompts",
  description:
    "Browse 120+ free, copy-ready AI prompt templates for Meta AI, Adobe Firefly, ChatGPT, and generative AI tools. Covers Text-to-Image, Generative Fill, marketing, copywriting, social media, and more.",
  keywords: uniqueKeywords([
    "genai prompt library",
    "ai prompt templates",
    "copy ready ai prompts",
    "free ai prompts",
    "ai prompts 2026",
    "meta ai prompts",
    "adobe firefly prompts",
    "adobe genai prompts",
    "generative ai prompts",
    "text to image prompts",
    "generative fill prompts",
    "photoshop generative fill prompts",
    "generative expand prompts",
    "ai image generation prompts",
    "adobe ai prompts",
    "marketing ai prompts",
    "social media ai prompts",
    "copywriting ai prompts",
    "content creation ai prompts",
    "creative ai prompts",
    "photography ai prompts",
    "design ai prompts",
    "ecommerce ai prompts",
    "prompt engineering templates",
    "best ai prompts",
    "ai creative prompts",
    "ai writing prompts",
    "ai photo editing prompts",
    "vector art ai prompts",
    "ai video prompts",
    "professional ai prompts"
  ]),
  alternates: {
    canonical: "/genai-prompts/"
  },
  openGraph: buildOpenGraph(
    "GenAI Prompt Library — 120+ Copy-Ready AI Prompts | TamemJ",
    "Free, copy-ready prompt templates for Meta AI, Adobe Firefly, and generative AI tools. Covers Text-to-Image, Generative Fill, marketing, copywriting, and creative production.",
    "/genai-prompts/"
  ),
  twitter: buildTwitter(
    "GenAI Prompt Library — 120+ Copy-Ready AI Prompts | TamemJ",
    "Free prompt templates for Meta AI, Adobe Firefly, and generative AI tools."
  )
};

export default function GenAIPromptsPage() {
  const prompts = getGenAIPrompts();
  const categories = getGenAICategories();
  const latestUpdatedAt = getLatestGenAIPromptUpdatedAt();

  const categoryCards = categories.map((category) => ({
    name: category,
    slug: getGenAICategorySlug(category),
    count: getGenAIPromptsByCategory(category).length
  }));

  const groupedByPlatformAndCategory = ["MetaAI", "AdobeGenAI", "Both"].map((platform) => ({
    platform,
    categories: [...new Set(prompts.filter((p) => p.platform === platform).map((p) => p.category))]
      .sort((a, b) => a.localeCompare(b))
      .map((category) => ({
        category,
        prompts: prompts
          .filter((p) => p.platform === platform && p.category === category)
          .sort((a, b) => a.title.localeCompare(b.title))
      }))
  }));

  const collectionSchema = buildCollectionPageJsonLd(
    "GenAI Prompt Library",
    `${prompts.length} copy-ready AI prompt templates for Meta AI, Adobe Firefly, and generative AI workflows.`,
    "/genai-prompts/",
    prompts.map((prompt) => ({
      name: prompt.title,
      path: `/genai-prompts/${prompt.slug}/`
    }))
  );

  const categoryListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "GenAI Prompt Categories",
    numberOfItems: categoryCards.length,
    itemListElement: categoryCards.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${entry.name} AI Prompts`,
      url: toAbsoluteUrl(`/genai-prompts/category/${entry.slug}/`)
    }))
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "GenAI Prompts", path: "/genai-prompts/" }
  ]);

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "GenAI Prompt Library — TamemJ",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    description: `${prompts.length}+ free, copy-ready AI prompt templates for Meta AI, Adobe Firefly, and generative AI tools across ${categories.length} categories.`,
    url: toAbsoluteUrl("/genai-prompts/"),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    featureList: [
      `${prompts.length}+ copy-ready prompt templates`,
      `${categories.length} prompt categories`,
      "Meta AI and Adobe GenAI coverage",
      "Text-to-Image, Generative Fill, Generative Expand",
      "Variable fill form on each prompt",
      "One-click copy"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What AI platforms are covered in this prompt library?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The library covers Meta AI chat prompts and Adobe GenAI tools including Text-to-Image, Generative Fill, Generative Expand, Vector, and Video-oriented workflows in Adobe Firefly and Photoshop."
        }
      },
      {
        "@type": "Question",
        name: "Are these prompts free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — all prompts are free to copy and use. Each detail page has a one-click copy button and a variable form to customize the prompt before copying."
        }
      },
      {
        "@type": "Question",
        name: "Can I filter prompts by category or complexity?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Use the filter bar to narrow by platform, tool, category, and complexity (Simple or Advanced). You can also browse category landing pages for focused collections."
        }
      },
      {
        "@type": "Question",
        name: "What categories of AI prompts are available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `The library includes prompts across ${categories.length} categories including marketing, copywriting, social media, photo editing, design, ecommerce, photography, and more.`
        }
      }
    ]
  };

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell space-y-6">
          {/* Static crawlable hero — above client browser for SEO */}
          <div className="surface-card-strong p-6 sm:p-8">
            <span className="eyebrow">GenAI Prompt Library</span>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl lg:text-5xl">
              {prompts.length}+ Free Copy-Ready AI Prompt Templates
            </h1>
            <p className="mt-3 max-w-3xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
              Practical prompt templates for Meta AI, Adobe Firefly, and generative AI workflows.
              Covers Text-to-Image, Generative Fill, marketing, copywriting, social media, and more.
              Fill variables and copy — ready in seconds.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {prompts.length}+ prompts
              </span>
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {categories.length} categories
              </span>
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                Meta AI + Adobe GenAI
              </span>
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                Free to copy
              </span>
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                Updated{" "}
                {new Date(latestUpdatedAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {categoryCards.slice(0, 8).map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/genai-prompts/category/${entry.slug}/`}
                  className="rounded-full border border-line/70 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500"
                >
                  {entry.name} ({entry.count})
                </Link>
              ))}
            </div>
          </div>

          <GenAIPromptsBrowser prompts={prompts} />

          {/* Crawlable category cards */}
          <section className="surface-card p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Browse by Category</h2>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                {categories.length} categories
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {categoryCards.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/genai-prompts/category/${entry.slug}/`}
                  className="rounded-xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/70"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{entry.name}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{entry.count} prompts</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Full crawlable prompt index */}
          <section className="surface-card p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Full Prompt Index</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              All prompt detail pages grouped by platform and category.
            </p>
            <div className="mt-4 space-y-4">
              {groupedByPlatformAndCategory.map((group) => (
                <details
                  key={group.platform}
                  className="rounded-xl border border-line/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {group.platform} (
                    {group.categories.reduce((total, cg) => total + cg.prompts.length, 0)})
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
