import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AiAgentDetail } from "@/components/ai-agents/ai-agent-detail";
import {
  aiAgentPlatforms,
  getAiAgentBySlug,
  getAiAgentCategorySlug,
  getAiAgentsRegistry,
  getRelatedAiAgents
} from "@/lib/aiAgents.registry";
import { getAiAgentEditorialIntro } from "@/lib/ai-agents.editorial";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";

interface AiAgentDetailPageProps {
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
  return getAiAgentsRegistry().map((agent) => ({ slug: agent.slug }));
}

export async function generateMetadata({ params }: AiAgentDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const agent = getAiAgentBySlug(slug);
  if (!agent) {
    return { title: "AI Agent Not Found" };
  }

  const title = `${agent.title} AI Agent Prompt | ${agent.category}`;
  const description = `Copy-ready ${agent.expertiseLevel.toLowerCase()} ${agent.role} system prompt with platform variants for ChatGPT, Claude, Grok/xAI, Perplexity, MetaAI, and Adobe GenAI.`;
  const path = `/ai-agents/${agent.slug}/`;
  const keywords = uniqueKeywords([
    `${agent.title} ai agent`,
    `${agent.role} prompt`,
    `${agent.category} ai agent`,
    ...agent.tags,
    ...aiAgentPlatforms.map((platform) => `${agent.title} ${platform} prompt`)
  ]);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: buildOpenGraph(`${title} | Tamem J`, description, path, "article"),
    twitter: buildTwitter(`${title} | Tamem J`, description)
  };
}

export default async function AiAgentDetailPage({ params }: AiAgentDetailPageProps) {
  const { slug } = await params;
  const agent = getAiAgentBySlug(slug);
  if (!agent) {
    notFound();
  }

  const relatedAgents = getRelatedAiAgents(agent.slug, 8);
  const categorySlug = getAiAgentCategorySlug(agent.category);
  const editorialIntro = getAiAgentEditorialIntro(agent.slug);
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "AI Agents", path: "/ai-agents/" },
    { name: agent.title, path: `/ai-agents/${agent.slug}/` }
  ]);
  const isoDate = new Date().toISOString();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${agent.title} AI Agent Prompt`,
    url: toAbsoluteUrl(`/ai-agents/${agent.slug}/`),
    description: agent.description,
    keywords: [agent.title, agent.role, agent.category, ...agent.tags].join(", "),
    isPartOf: {
      "@type": "CollectionPage",
      name: "AI Agents Library",
      url: toAbsoluteUrl("/ai-agents/")
    },
    about: [
      { "@type": "Thing", name: agent.category },
      ...aiAgentPlatforms.map((platform) => ({ "@type": "Thing", name: platform }))
    ]
  };

  const techArticleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${agent.title} AI Agent Prompt`,
    description: agent.description,
    datePublished: isoDate,
    dateModified: isoDate,
    url: toAbsoluteUrl(`/ai-agents/${agent.slug}/`),
    articleSection: agent.category,
    keywords: [agent.title, agent.role, ...agent.tags].join(", "),
    articleBody: editorialIntro ?? undefined,
    author: {
      "@type": "Person",
      name: "Tamem J"
    },
    publisher: {
      "@type": "Organization",
      name: "Tamem J"
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": toAbsoluteUrl(`/ai-agents/${agent.slug}/`)
    }
  };

  const relatedListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Related AI agents for ${agent.title}`,
    itemListElement: relatedAgents.map((related, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: related.title,
      url: toAbsoluteUrl(`/ai-agents/${related.slug}/`)
    }))
  };

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell space-y-5">
          <article className="surface-card-strong p-5 sm:p-6">
            <p className="eyebrow">AI Agent Detail</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
              {agent.title}
            </h1>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              {agent.description}
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Last verified: {new Date(isoDate).toLocaleDateString("en-US", { dateStyle: "long" })}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {agent.category}
              </span>
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {agent.expertiseLevel}
              </span>
              <Link href={`/ai-agents/category/${categorySlug}/`} className="btn-secondary !px-4 !py-1.5 text-xs">
                More {agent.category} Agents
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {agent.tags.map((tag) => (
                <span
                  key={`${agent.slug}-${tag}`}
                  className="rounded-full border border-line/80 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>

          {editorialIntro ? (
            <section className="surface-card p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Editorial Intro</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">{editorialIntro}</p>
            </section>
          ) : null}

          <AiAgentDetail agent={agent} />

          {relatedAgents.length > 0 ? (
            <section className="surface-card p-5 sm:p-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Related AI Agents</h2>
                <Link href="/ai-agents/" className="text-sm font-semibold text-accent hover:underline">
                  Browse All
                </Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {relatedAgents.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/ai-agents/${related.slug}/`}
                    className="rounded-xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/70"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      {related.category} • {related.expertiseLevel}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      {related.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{related.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(relatedListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
