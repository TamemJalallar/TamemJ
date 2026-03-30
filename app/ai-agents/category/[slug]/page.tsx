import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  aiAgentPlatforms,
  getAiAgentCategories,
  getAiAgentCategoryBySlug,
  getAiAgentCategorySlug,
  getAiAgentsByCategory
} from "@/lib/aiAgents.registry";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildOpenGraph,
  buildTwitter,
  toAbsoluteUrl
} from "@/lib/seo";
import { buildAiCategoryEditorial } from "@/src/content/editorial/ai-agent-categories";

interface AiAgentCategoryPageProps {
  params: Promise<{ slug: string }>;
}

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

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getAiAgentCategories().map((category) => ({
    slug: getAiAgentCategorySlug(category)
  }));
}

export async function generateMetadata({ params }: AiAgentCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getAiAgentCategoryBySlug(slug);

  if (!category) {
    return { title: "AI Agent Category Not Found" };
  }

  const categoryAgents = getAiAgentsByCategory(category);
  const tags = categoryAgents.flatMap((agent) => agent.tags).slice(0, 40);
  const roles = categoryAgents.map((agent) => agent.role).slice(0, 24);
  const description = `Browse ${categoryAgents.length} ${category} AI agent prompts with platform variants for ChatGPT, Claude, Grok/xAI, Perplexity, and Google Gemini.`;

  return {
    title: `${category} AI Agent Prompts`,
    description,
    keywords: uniqueKeywords([
      `${category.toLowerCase()} ai agent`,
      `${category.toLowerCase()} system prompts`,
      `${category.toLowerCase()} ai prompts`,
      ...roles,
      ...tags
    ]),
    alternates: {
      canonical: `/ai-agents/category/${slug}/`
    },
    openGraph: buildOpenGraph(`${category} AI Agent Prompts`, description, `/ai-agents/category/${slug}/`),
    twitter: buildTwitter(`${category} AI Agent Prompts`, description)
  };
}

export default async function AiAgentCategoryPage({ params }: AiAgentCategoryPageProps) {
  const { slug } = await params;
  const category = getAiAgentCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryAgents = getAiAgentsByCategory(category);
  const allCategories = getAiAgentCategories();
  const editorial = buildAiCategoryEditorial(category, categoryAgents, aiAgentPlatforms);
  const relatedCategories = allCategories
    .filter((candidate) => candidate !== category)
    .slice(0, 8)
    .map((name) => ({
      name,
      slug: getAiAgentCategorySlug(name),
      count: getAiAgentsByCategory(name).length
    }));

  const collectionSchema = buildCollectionPageJsonLd(
    `${category} AI Agent Prompts`,
    `${categoryAgents.length} copy-ready ${category} AI agent system prompts.`,
    `/ai-agents/category/${slug}/`,
    categoryAgents.map((agent) => ({
      name: agent.title,
      path: `/ai-agents/${agent.slug}/`
    }))
  );

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "AI Agents", path: "/ai-agents/" },
    { name: category, path: `/ai-agents/category/${slug}/` }
  ]);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${category} AI Agent Prompts`,
    description: `${categoryAgents.length} specialized prompts for ${category} workflows.`,
    url: toAbsoluteUrl(`/ai-agents/category/${slug}/`),
    isPartOf: {
      "@type": "CollectionPage",
      name: "AI Agents Library",
      url: toAbsoluteUrl("/ai-agents/")
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
              href="/ai-agents/"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              ← Back to AI Agents
            </Link>
          </div>

          <section className="surface-card-strong p-5 sm:p-6">
            <p className="eyebrow">AI Agent Category</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
              {category} AI Agent Prompts
            </h1>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Search-ready prompt pages for {category.toLowerCase()} workflows. Each detail page includes a
              copy-ready system prompt with platform tuning for {aiAgentPlatforms.join(", ")}.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {categoryAgents.length} agents
              </span>
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {aiAgentPlatforms.length} AI platforms
              </span>
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {allCategories.length} total categories
              </span>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
            <section className="surface-card p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">How to Use This Category</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
                {editorial.introParagraphs.map((paragraph) => (
                  <p key={`${slug}-${paragraph}`}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="surface-card p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Best-Fit Use Cases</h2>
              <ul className="mt-4 space-y-3">
                {editorial.useCases.map((item, index) => (
                  <li
                    key={`${slug}-use-case-${index}`}
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
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Category Agent Index</h2>
              <Link href="/ai-agents/" className="text-sm font-semibold text-accent hover:underline">
                Open full library
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {categoryAgents.map((agent) => (
                <Link
                  key={agent.slug}
                  href={`/ai-agents/${agent.slug}/`}
                  className="rounded-xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/70"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    {agent.expertiseLevel}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                    {agent.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{agent.role}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{agent.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Explore More Categories</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {relatedCategories.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/ai-agents/category/${entry.slug}/`}
                  className="rounded-xl border border-line/80 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/70"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{entry.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{entry.count} agents</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Use Alongside Other Hubs</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Link
                href="/genai-prompts/"
                className="rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">GenAI Prompt Library</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Pair persona-driven agent prompts with task-level prompt templates.
                </p>
              </Link>
              <Link
                href="/guides/"
                className="rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">IT Pillar Guides</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Move from prompt discovery into broader operational and troubleshooting hubs.
                </p>
              </Link>
              <Link
                href="/support/tickets/"
                className="rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Support Tickets</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Connect AI workflow ideas to practical IT troubleshooting content and how-to pages.
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
