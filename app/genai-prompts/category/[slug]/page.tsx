import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import {
  getGenAICategories,
  getGenAICategoryBySlug,
  getGenAICategorySlug,
  getGenAIPromptsByCategory
} from "@/lib/genai-prompts";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildOpenGraph,
  buildTwitter,
  toAbsoluteUrl
} from "@/lib/seo";
import { buildGenAICategoryEditorial } from "@/src/content/editorial/genai-categories";

interface GenAIPromptCategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getGenAICategories().map((category) => ({
    slug: getGenAICategorySlug(category)
  }));
}

export async function generateMetadata({ params }: GenAIPromptCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getGenAICategoryBySlug(slug);

  if (!category) {
    return { title: "GenAI Prompt Category Not Found" };
  }

  const categoryPrompts = getGenAIPromptsByCategory(category);
  const tools = [...new Set(categoryPrompts.map((p) => p.tool))];
  const platforms = [...new Set(categoryPrompts.map((p) => p.platform))];
  const tags = categoryPrompts.flatMap((p) => p.tags).slice(0, 40);

  const description = `Browse ${categoryPrompts.length} copy-ready ${category} AI prompts for ${platforms.slice(0, 3).join(", ")}. Includes ${tools.join(", ")} workflows — ready to paste and use.`;

  return {
    title: `${category} AI Prompts — Copy-Ready Templates`,
    description,
    keywords: [
      `${category.toLowerCase()} ai prompts`,
      `${category.toLowerCase()} prompt templates`,
      `${category.toLowerCase()} chatgpt prompts`,
      `${category.toLowerCase()} claude prompts`,
      `${category.toLowerCase()} meta ai prompts`,
      `${category.toLowerCase()} adobe firefly prompts`,
      `${category.toLowerCase()} generative ai`,
      "copy ready ai prompts",
      "ai prompt library",
      "genai prompt templates",
      ...tools.map((t) => `${t.toLowerCase()} prompts`),
      ...platforms.map((pl) => `${pl.toLowerCase()} ${category.toLowerCase()}`),
      ...tags.slice(0, 20)
    ],
    alternates: {
      canonical: `/genai-prompts/category/${slug}/`
    },
    robots: buildRobotsIndexRule(`/genai-prompts/category/${slug}/`),
    openGraph: buildOpenGraph(
      `${category} AI Prompts — Copy-Ready Templates`,
      description,
      `/genai-prompts/category/${slug}/`
    ),
    twitter: buildTwitter(`${category} AI Prompts — Copy-Ready Templates`, description)
  };
}

export default async function GenAIPromptCategoryPage({ params }: GenAIPromptCategoryPageProps) {
  const { slug } = await params;
  const category = getGenAICategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryPrompts = getGenAIPromptsByCategory(category);
  const allCategories = getGenAICategories();
  const tools = [...new Set(categoryPrompts.map((p) => p.tool))];
  const platforms = [...new Set(categoryPrompts.map((p) => p.platform))];
  const editorial = buildGenAICategoryEditorial(category, categoryPrompts);

  const relatedCategories = allCategories
    .filter((candidate) => candidate !== category)
    .slice(0, 8)
    .map((name) => ({
      name,
      slug: getGenAICategorySlug(name),
      count: getGenAIPromptsByCategory(name).length
    }));

  const collectionSchema = buildCollectionPageJsonLd(
    `${category} AI Prompts`,
    `${categoryPrompts.length} copy-ready ${category} GenAI prompt templates.`,
    `/genai-prompts/category/${slug}/`,
    categoryPrompts.map((prompt) => ({
      name: prompt.title,
      path: `/genai-prompts/${prompt.slug}/`
    }))
  );

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "GenAI Prompts", path: "/genai-prompts/" },
    { name: category, path: `/genai-prompts/category/${slug}/` }
  ]);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${category} AI Prompts`,
    description: `${categoryPrompts.length} copy-ready ${category} prompt templates for generative AI tools.`,
    url: toAbsoluteUrl(`/genai-prompts/category/${slug}/`),
    isPartOf: {
      "@type": "CollectionPage",
      name: "GenAI Prompts Library",
      url: toAbsoluteUrl("/genai-prompts/")
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: editorial.faq.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer
      }
    }))
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

          <section className="surface-card-strong p-5 sm:p-6">
            <p className="eyebrow">GenAI Prompt Category</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
              {category} AI Prompts
            </h1>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              {categoryPrompts.length} copy-ready {category.toLowerCase()} prompt templates for generative AI.
              Each prompt is tuned for real workflows across{" "}
              {platforms.join(", ")} — paste directly and get results.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {categoryPrompts.length} prompts
              </span>
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  {tool}
                </span>
              ))}
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {allCategories.length} total categories
              </span>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
            <section className="surface-card p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">How to Work This Category</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
                {editorial.introParagraphs.map((paragraph) => (
                  <p key={`${slug}-${paragraph}`}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="surface-card p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Workflow Highlights</h2>
              <ul className="mt-4 space-y-3">
                {editorial.workflowHighlights.map((item, index) => (
                  <li
                    key={`${slug}-workflow-${index}`}
                    className="rounded-2xl border border-line/80 bg-white p-4 text-sm leading-7 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {category} Prompt Index
              </h2>
              <Link href="/genai-prompts/" className="text-sm font-semibold text-accent hover:underline">
                Open full library
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {categoryPrompts.map((prompt) => (
                <Link
                  key={prompt.slug}
                  href={`/genai-prompts/${prompt.slug}/`}
                  className="rounded-xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/70"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    {prompt.platform} · {prompt.complexity}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                    {prompt.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{prompt.tool}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{prompt.summary}</p>
                  <p className="mt-3 text-xs font-semibold text-accent">Copy prompt →</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Explore More Categories
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {relatedCategories.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/genai-prompts/category/${entry.slug}/`}
                  className="rounded-xl border border-line/80 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/70"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{entry.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{entry.count} prompts</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Use Alongside Other Hubs</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Link
                href="/ai-agents/"
                className="rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">AI Agents Library</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Pair task-level prompts with broader role-based agents and operating models.
                </p>
              </Link>
              <Link
                href="/guides/"
                className="rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">IT Pillar Guides</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Connect prompt workflows to larger knowledge hubs, troubleshooting topics, and monetizable content clusters.
                </p>
              </Link>
              <Link
                href="/downloads/"
                className="rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Downloads</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Surface practical tools, templates, and software resources alongside the prompt library.
                </p>
              </Link>
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
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
