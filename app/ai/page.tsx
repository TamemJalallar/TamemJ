import type { Metadata } from "next";
import Link from "next/link";
import {
  getAiAgentCategories,
  getAiAgentCategorySlug,
  getAiAgentsLastVerified,
  getAiAgentsRegistry
} from "@/lib/aiAgents.registry";
import {
  getGenAICategories,
  getGenAICategorySlug,
  getGenAIPrompts,
  getLatestGenAIPromptUpdatedAt
} from "@/lib/genai-prompts";
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
  title: "AI Hub — AI Agents and GenAI Prompt Libraries",
  description:
    "Browse AI Agents for ChatGPT, Claude, Grok/xAI, Perplexity, and Google Gemini alongside Meta AI and Adobe GenAI prompt libraries for creative and production workflows.",
  keywords: uniqueKeywords([
    "ai hub",
    "ai agents library",
    "ai agent prompts",
    "system prompts",
    "genai prompts",
    "chatgpt prompts",
    "claude prompts",
    "google gemini prompts",
    "perplexity prompts",
    "grok xai prompts",
    "meta ai prompts",
    "adobe firefly prompts",
    "adobe genai prompts",
    "copy ready ai prompts",
    "professional ai agents"
  ]),
  alternates: {
    canonical: "/ai/"
  },
  openGraph: buildOpenGraph(
    "AI Hub — AI Agents and GenAI Prompt Libraries",
    "Browse role-based AI agents and Meta AI / Adobe GenAI prompt libraries in one search-friendly hub.",
    "/ai/"
  ),
  twitter: buildTwitter(
    "AI Hub — AI Agents and GenAI Prompt Libraries",
    "Browse role-based AI agents and Meta AI / Adobe GenAI prompt libraries in one search-friendly hub."
  )
};

export default function AiLibraryPage() {
  const agents = getAiAgentsRegistry();
  const prompts = getGenAIPrompts();
  const agentCategories = getAiAgentCategories().slice(0, 8);
  const promptCategories = getGenAICategories().slice(0, 8);
  const aiAgentsLastVerified = getAiAgentsLastVerified();
  const genAIPromptsUpdatedAt = getLatestGenAIPromptUpdatedAt();

  const collectionSchema = buildCollectionPageJsonLd(
    "AI Hub",
    "AI resource hub with specialized AI agents and generative AI prompt libraries.",
    "/ai/",
    [
      { name: "AI Agents Library", path: "/ai-agents/" },
      { name: "GenAI Prompt Library", path: "/genai-prompts/" }
    ]
  );

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI Hub",
    url: toAbsoluteUrl("/ai/"),
    description:
      "Central AI resource hub for role-based agent prompts and production-ready generative AI prompts.",
    inLanguage: "en-US",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: 2,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "AI Agents Library",
          url: toAbsoluteUrl("/ai-agents/")
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "GenAI Prompt Library",
          url: toAbsoluteUrl("/genai-prompts/")
        }
      ]
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the difference between AI Agents and GenAI Prompts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AI Agents are role-based system prompts for tools such as ChatGPT, Claude, Grok/xAI, Perplexity, and Google Gemini. GenAI Prompts are workflow prompts designed for Meta AI and Adobe GenAI tasks such as chat, text-to-image, and generative editing."
        }
      },
      {
        "@type": "Question",
        name: "Are these prompts free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Both libraries are free to browse, copy, and adapt."
        }
      }
    ]
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "AI Hub", path: "/ai/" }
  ]);

  return (
    <>
      <section className="section-shell pb-12 pt-10 sm:pt-14">
        <div className="page-shell">
          <div className="rounded-3xl border border-line/70 bg-white/95 p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              AI Hub
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
              AI Hub: Agents + GenAI Prompts
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
              Pick the right library for your workflow. AI Agents focus on role-based system prompts,
              while GenAI Prompts target Meta AI and Adobe GenAI workflows for content, design, and
              creative production.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="rounded-full border border-line/70 bg-slate-50 px-3 py-1 dark:border-slate-800 dark:bg-slate-900">
                {agents.length} AI agents
              </span>
              <span className="rounded-full border border-line/70 bg-slate-50 px-3 py-1 dark:border-slate-800 dark:bg-slate-900">
                {prompts.length} GenAI prompts
              </span>
              <span className="rounded-full border border-line/70 bg-slate-50 px-3 py-1 dark:border-slate-800 dark:bg-slate-900">
                Agents verified{" "}
                {new Date(aiAgentsLastVerified).toLocaleDateString("en-US", { dateStyle: "medium" })}
              </span>
              <span className="rounded-full border border-line/70 bg-slate-50 px-3 py-1 dark:border-slate-800 dark:bg-slate-900">
                Prompts updated{" "}
                {new Date(genAIPromptsUpdatedAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <Link
              href="/ai-agents"
              className="group relative overflow-hidden rounded-3xl border border-line/70 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-card dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100 dark:from-emerald-900/20" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  AI Agents
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  System prompts for specialized roles
                </h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  300+ expert agent prompts across technology, business, marketing, legal, finance,
                  and operations. Built for ChatGPT, Claude, Grok/xAI, Perplexity, and Gemini.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
                    {agents.length} agents
                  </span>
                  <span className="rounded-full border border-line/70 bg-white px-3 py-1 font-semibold dark:border-slate-700 dark:bg-slate-900">
                    Role-based system prompts
                  </span>
                </div>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition group-hover:translate-x-1 dark:text-emerald-200">
                  Browse AI Agents →
                </div>
              </div>
            </Link>

            <Link
              href="/genai-prompts"
              className="group relative overflow-hidden rounded-3xl border border-line/70 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-card dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100 dark:from-cyan-900/20" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  GenAI Prompts
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  Meta AI + Adobe workflows
                </h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  Copy-ready prompts for Meta AI chat and Adobe Firefly or Photoshop Generative Fill,
                  Expand, and Text-to-Image tasks with variables and best-practice guidance.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 font-semibold text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-200">
                    {prompts.length} prompts
                  </span>
                  <span className="rounded-full border border-line/70 bg-white px-3 py-1 font-semibold dark:border-slate-700 dark:bg-slate-900">
                    Creative + marketing workflows
                  </span>
                </div>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition group-hover:translate-x-1 dark:text-cyan-200">
                  Browse GenAI Prompts →
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Top AI Agent Categories
                </h2>
                <Link href="/ai-agents/" className="text-sm font-semibold text-accent hover:underline">
                  View all
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {agentCategories.map((category) => (
                  <Link
                    key={category}
                    href={`/ai-agents/category/${getAiAgentCategorySlug(category)}/`}
                    className="rounded-full border border-line/70 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Top GenAI Prompt Categories
                </h2>
                <Link href="/genai-prompts/" className="text-sm font-semibold text-accent hover:underline">
                  View all
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {promptCategories.map((category) => (
                  <Link
                    key={category}
                    href={`/genai-prompts/category/${getGenAICategorySlug(category)}/`}
                    className="rounded-full border border-line/70 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-6 rounded-2xl border border-line/70 bg-slate-50 p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Not sure where to start?</p>
            <p className="mt-2">
              If you need role-based system prompts, start with AI Agents. If you need creative or
              visual prompts, head to GenAI Prompts.
            </p>
          </div>
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
