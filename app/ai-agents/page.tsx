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
  title: "AI Agents Library — 300+ Copy-Ready System Prompts",
  description:
    "Browse 300+ professional AI agent system prompts across 35 categories. Platform-tuned for ChatGPT, Claude, Grok/xAI, Perplexity, and Google Gemini. Free to copy.",
  keywords: uniqueKeywords([
    "ai agents library",
    "ai agent prompts",
    "ai agent system prompts",
    "best ai agents 2025",
    "copy ready ai prompts",
    "ai agent examples",
    "professional ai agents",
    "ai role prompts",
    "custom ai agents",
    "chatgpt agents",
    "claude agents",
    "perplexity agents",
    "google gemini prompts",
    "grok xai prompts",
    "chatgpt system prompts",
    "claude system prompts",
    "grok system prompts",
    "perplexity prompts",
    "ai agent prompt library",
    "free ai agent prompts",
    "ai agent templates",
    "technology ai agent",
    "finance ai assistant",
    "legal ai prompt",
    "marketing ai strategist",
    "hr ai agent",
    "sales ai agent prompts",
    "cybersecurity ai agent",
    "data analysis ai agent",
    "writing ai agent prompts",
    "customer service ai agent",
    "project management ai agent",
    "ai persona prompts",
    "ai assistant prompts",
    "system prompt generator",
    "ai prompt templates free"
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
  const groupedByCategory = categories.map((category) => ({
    category,
    slug: getAiAgentCategorySlug(category),
    agents: agents.filter((agent) => agent.category === category).sort((a, b) => a.title.localeCompare(b.title))
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

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AI Agents Prompt Library — TamemJ",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    description: `Browser-based AI agent prompt library with ${agents.length}+ copy-ready system prompts across ${categories.length} categories for ChatGPT, Claude, Grok/xAI, Perplexity, and Google Gemini.`,
    url: toAbsoluteUrl("/ai-agents/"),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    featureList: [
      "300+ professional AI agent system prompts",
      "35 specialist categories",
      "5 AI platform variants per agent",
      "One-click copy",
      "Filter by category, expertise, and platform"
    ]
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
        <div className="page-shell space-y-6">
          {/* Static crawlable hero — above client browser for SEO */}
          <div className="hero-surface p-6 sm:p-8">
            <span className="eyebrow">AI Agents Prompt Library</span>
            <h1 className="mt-3 font-display text-3xl font-semibold text-fg sm:text-4xl lg:text-5xl">
              300+ Professional AI Agent System Prompts
            </h1>
            <p className="mt-3 max-w-3xl text-base text-fg-secondary sm:text-lg">
              Browse copy-ready AI agent prompts across {categories.length} specialist categories.
              Each prompt ships with platform-tuned variants for ChatGPT, Claude, Grok/xAI, Perplexity, and Google Gemini.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="filter-chip px-3 py-1.5 text-xs font-semibold">
                {agents.length}+ system prompts
              </span>
              <span className="filter-chip px-3 py-1.5 text-xs font-semibold">
                {categories.length} categories
              </span>
              <span className="filter-chip px-3 py-1.5 text-xs font-semibold">
                5 AI platforms
              </span>
              <span className="filter-chip px-3 py-1.5 text-xs font-semibold">
                Free to copy
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {categoryCards.slice(0, 8).map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/ai-agents/category/${entry.slug}/`}
                  className="filter-chip px-3 py-1 text-xs font-medium"
                >
                  {entry.category} ({entry.count})
                </Link>
              ))}
            </div>
          </div>

          <AiAgentsBrowser />

          <section className="surface-card p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold text-fg">Browse by Category</h2>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Crawlable category pages
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {categoryCards.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/ai-agents/category/${entry.slug}/`}
                  className="surface-card-interactive rounded-xl p-4"
                >
                  <p className="text-sm font-semibold text-fg">{entry.category}</p>
                  <p className="mt-1 text-xs text-muted">{entry.count} agents</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold text-fg">Popular AI Agent Prompts</h2>
              <span className="text-xs text-muted">Search-optimized detail pages</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {popularAgents.map((agent) => (
                <Link
                  key={agent.slug}
                  href={`/ai-agents/${agent.slug}/`}
                  className="surface-card-interactive rounded-lg px-3 py-2 text-sm"
                >
                  <span className="font-semibold text-fg">{agent.title}</span>
                  <span className="ml-2 text-xs text-muted">{agent.category}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-fg">Full AI Agent Index</h2>
            <p className="mt-2 text-sm text-fg-secondary">
              Crawlable index of all AI agent detail pages grouped by category.
            </p>
            <div className="mt-4 space-y-3">
              {groupedByCategory.map((group) => (
                <details
                  key={group.slug}
                  className="surface-card rounded-xl p-4"
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-fg">
                    {group.category} ({group.agents.length})
                  </summary>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {group.agents.map((agent) => (
                      <Link
                        key={agent.slug}
                        href={`/ai-agents/${agent.slug}/`}
                        className="filter-chip justify-start rounded-lg px-3 py-2 text-sm"
                      >
                        {agent.title}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-fg">Use Alongside Other Hubs</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Link
                href="/genai-prompts/"
                className="surface-card-interactive rounded-2xl p-4"
              >
                <p className="text-sm font-semibold text-fg">GenAI Prompt Library</p>
                <p className="mt-2 text-sm text-fg-secondary">
                  Move from role-based agent prompts into task-level prompt templates.
                </p>
              </Link>
              <Link
                href="/guides/"
                className="surface-card-interactive rounded-2xl p-4"
              >
                <p className="text-sm font-semibold text-fg">IT Pillar Guides</p>
                <p className="mt-2 text-sm text-fg-secondary">
                  Connect AI workflow ideas to broader troubleshooting, operations, and growth hubs.
                </p>
              </Link>
              <Link
                href="/downloads/"
                className="surface-card-interactive rounded-2xl p-4"
              >
                <p className="text-sm font-semibold text-fg">Downloads</p>
                <p className="mt-2 text-sm text-fg-secondary">
                  Surface practical software, scripts, and templates that pair with AI workflows.
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
    </>
  );
}
