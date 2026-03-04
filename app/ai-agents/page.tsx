import type { Metadata } from "next";
import Link from "next/link";
import { AiAgentsBrowser } from "@/components/ai-agents/ai-agents-browser";
import { getAiAgentCategories, getAiAgentCategorySlug, getAiAgentsRegistry } from "@/lib/aiAgents.registry";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildOpenGraph,
  buildTwitter,
  toAbsoluteUrl
} from "@/lib/seo";

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
  title: "AI Agents Library (300+ System Prompts)",
  description:
    "Discover 300+ copy-ready AI agent system prompts with platform-specific variants for ChatGPT, Claude, Grok/xAI, Perplexity, and Google Gemini.",
  keywords: uniqueKeywords([
    "ai agents",
    "ai agents library",
    "best ai agent prompts",
    "ai agent examples",
    "professional ai agents",
    "ai role prompts",
    "custom ai agents",
    "chatgpt agents",
    "claude agents",
    "perplexity agents",
    "google gemini prompts",
    "grok xai prompts",
    "system prompts",
    "ai agent prompts",
    "chatgpt system prompts",
    "claude system prompts",
    "grok system prompts",
    "perplexity prompts",
    "google gemini prompts",
    "professional ai roles",
    "technology ai agent",
    "finance ai assistant",
    "legal ai prompt",
    "marketing ai strategist",
    "prompt library",
    "copy ready ai prompts"
  ]),
  alternates: {
    canonical: "/ai-agents/"
  },
  openGraph: buildOpenGraph(
    "AI Agents Library | 300+ Professional System Prompts",
    "Copy-ready system prompts for 300+ specialized AI agents with platform-specific output for ChatGPT, Claude, Grok/xAI, Perplexity, and Google Gemini.",
    "/ai-agents/"
  ),
  twitter: buildTwitter(
    "AI Agents Library | 300+ Professional System Prompts",
    "Copy-ready system prompts for 300+ specialized AI agents with platform-specific output for ChatGPT, Claude, Grok/xAI, Perplexity, and Google Gemini."
  )
};

export default function AiAgentsPage() {
  const agents = getAiAgentsRegistry();
  const categories = getAiAgentCategories();
  const categoryCards = categories.map((category) => ({
    category,
    slug: getAiAgentCategorySlug(category),
    count: agents.filter((agent) => agent.category === category).length
  }));
  const popularAgents = agents.slice(0, 24);

  const collectionSchema = buildCollectionPageJsonLd(
    "AI Agent System Prompts",
    `Professional AI agent prompt library with ${agents.length} specialized role definitions.`,
    "/ai-agents/",
    agents.map((agent) => ({
      name: agent.title,
      path: `/ai-agents/${agent.slug}/`
    }))
  );

  const categoryListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AI Agent Prompt Categories",
    numberOfItems: categoryCards.length,
    itemListElement: categoryCards.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${entry.category} AI Agent Prompts`,
      url: toAbsoluteUrl(`/ai-agents/category/${entry.slug}/`)
    }))
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "AI Agents", path: "/ai-agents/" }
  ]);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI Agents",
    description:
      "Professional AI agent prompt library with copy-ready system prompts and filterable roles by category, platform, and expertise.",
    url: toAbsoluteUrl("/ai-agents/"),
    inLanguage: "en-US"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is included in this AI agents library?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `The library contains ${agents.length}+ professional AI agent system prompts with role definitions, responsibilities, output rules, constraints, and example tasks.`
        }
      },
      {
        "@type": "Question",
        name: "Which AI platforms are supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Each agent can be generated for ChatGPT, Claude, Grok/xAI, Perplexity, and Google Gemini."
        }
      },
      {
        "@type": "Question",
        name: "Can I filter prompts by skill level or domain?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can search and filter by category, expertise level, platform, role, and tags to quickly find the right agent prompt."
        }
      }
    ]
  };

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell">
          <AiAgentsBrowser />

          <section className="mt-6 surface-card p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Browse by Category</h2>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Crawlable category pages
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {categoryCards.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/ai-agents/category/${entry.slug}/`}
                  className="rounded-xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/70"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{entry.category}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{entry.count} agents</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-6 surface-card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Popular AI Agent Prompts</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">Search-optimized detail pages</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {popularAgents.map((agent) => (
                <Link
                  key={agent.slug}
                  href={`/ai-agents/${agent.slug}/`}
                  className="rounded-lg border border-line/80 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                >
                  <span className="font-semibold">{agent.title}</span>
                  <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">{agent.category}</span>
                </Link>
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryListSchema) }}
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
