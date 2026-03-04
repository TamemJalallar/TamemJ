import type { Metadata } from "next";
import { AiAgentsBrowser } from "@/components/ai-prompts/ai-agents-browser";
import { getAiAgentsRegistry } from "@/lib/aiAgents.registry";
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
  title: "AI Agents",
  description:
    "Search, filter, and copy 300+ professional AI agent system prompts across technology, finance, legal, design, marketing, and operations.",
  keywords: uniqueKeywords([
    "ai agents",
    "system prompts",
    "ai agent prompts",
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
    "AI Agents | Tamem J",
    "Copy-ready system prompts for 300+ specialized AI agents across professional domains.",
    "/ai-agents/"
  ),
  twitter: buildTwitter(
    "AI Agents | Tamem J",
    "Copy-ready system prompts for 300+ specialized AI agents across professional domains."
  )
};

export default function AiAgentsPage() {
  const agents = getAiAgentsRegistry();
  const collectionSchema = buildCollectionPageJsonLd(
    "AI Agent System Prompts",
    `Professional AI agent prompt library with ${agents.length} specialized role definitions.`,
    "/ai-agents/",
    agents.map((agent) => ({
      name: agent.title,
      path: "/ai-agents/"
    }))
  );

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "AI Agents", path: "/ai-agents/" }
  ]);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI Agents",
    description:
      "Professional AI agent prompt library with copy-ready system prompts and filterable roles by category and expertise."
  };

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell">
          <AiAgentsBrowser />
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
